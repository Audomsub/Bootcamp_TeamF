import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Upload, Loader2, AlertCircle } from 'lucide-react';
import { PageHeader } from '@/components/ui/shared';
import { productService } from '@/services/product.service';
import { getImageUrl } from '@/lib/utils';

const productSchema = z.object({
  name: z.string().min(1, 'กรุณาระบุชื่อสินค้า'),
  description: z.string().optional().or(z.literal('')),
  cost_price: z.coerce.number().min(0.01, 'ต้นทุนต้องมากกว่า 0'),
  min_price: z.coerce.number().min(0, 'ราคาขายขั้นต่ำต้องไม่ติดลบ'),
  stock: z.coerce.number().int().min(0, 'จำนวนสินค้าต้องไม่ติดลบ'),
}).refine((data) => data.min_price >= data.cost_price, {
  message: 'ราคาขายขั้นต่ำต้องมากกว่าหรือเท่ากับต้นทุน',
  path: ['min_price'],
});

type ProductForm = z.infer<typeof productSchema>;

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      name: '',
      description: '',
      cost_price: 0,
      min_price: 0,
      stock: 0,
    },
  });

  useEffect(() => {
    if (isEdit) loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const response = await productService.getById(Number(id));
      const product = response.data.data;
      reset({
        name: product.name,
        description: product.description,
        cost_price: product.cost_price,
        min_price: product.min_price,
        stock: product.stock,
      });
      setImagePreview(getImageUrl(product.image_url));
    } catch {
      navigate('/admin/products');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        setError('อนุญาตเฉพาะไฟล์รูปภาพ JPG, JPEG และ PNG เท่านั้น');
        return;
      }
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('ขนาดไฟล์ต้องไม่เกิน 5MB');
        return;
      }

      setError('');
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProductForm) => {
    try {
      setError('');
      if (!isEdit && !imageFile && !imagePreview) {
        setError('กรุณาอัปโหลดรูปภาพสินค้า');
        return;
      }
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) =>
        formData.append(key, String(value))
      );
      if (imageFile) formData.append('image', imageFile);

      if (isEdit) {
        await productService.update(Number(id), formData);
      } else {
        await productService.create(formData);
      }
      navigate('/admin/products');
    } catch (err: any) {
      setError(err.response?.data?.message || 'ไม่สามารถบันทึกข้อมูลสินค้าได้ กรุณาลองใหม่อีกครั้ง');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        title={isEdit ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}
        subtitle={isEdit ? 'อัปเดตรายละเอียดและข้อมูลของสินค้า' : 'เพิ่มรายการสินค้าใหม่เข้าสู่ระบบคลัง'}
      >
        <button
          onClick={() => navigate('/admin/products')}
          className="btn-secondary flex items-center gap-2 font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          ย้อนกลับ
        </button>
      </PageHeader>

      <div className="flex items-center justify-center">
        <div className="glass-card bg-white/80 border-white/60 shadow-xl rounded-[2rem] w-full max-w-3xl p-6 sm:p-8">
          
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-sm font-medium text-rose-600 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Image upload */}
            <div>
              <label className="block text-sm font-semibold text-neutral-800 mb-3">รูปภาพสินค้า</label>
              <div className="flex items-center gap-5">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-28 h-28 rounded-2xl object-cover border-2 border-neutral-100 shadow-sm"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-2xl bg-neutral-50 border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center text-neutral-400">
                    <Upload className="h-6 w-6 mb-1" />
                    <span className="text-xs font-medium">ไม่มีรูปภาพ</span>
                  </div>
                )}
                <div>
                  <label className="btn-secondary cursor-pointer text-sm font-medium inline-flex items-center gap-2 bg-white hover:bg-neutral-50 transition-colors">
                    <Upload className="h-4 w-4" />
                    อัปโหลดรูปภาพ
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs font-medium text-neutral-500 mt-2">
                    รองรับ PNG, JPG ขนาดไม่เกิน 5MB
                  </p>
                </div>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-neutral-800 mb-1.5">ชื่อสินค้า</label>
              <input
                {...register('name')}
                className="input-field w-full"
                placeholder="ระบุชื่อสินค้า"
              />
              {errors.name && <p className="mt-1.5 text-sm font-medium text-rose-500">{errors.name.message}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-neutral-800 mb-1.5">รายละเอียดสินค้า</label>
              <textarea
                {...register('description')}
                rows={4}
                className="input-field w-full resize-none"
                placeholder="ระบุรายละเอียดสินค้า"
              />
              {errors.description && (
                <p className="mt-1.5 text-sm font-medium text-rose-500">{errors.description.message}</p>
              )}
            </div>

            {/* Prices */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-neutral-800 mb-1.5">ต้นทุน (บาท)</label>
                <input
                  type="number"
                  step="0.01"
                  {...register('cost_price')}
                  className="input-field w-full"
                  placeholder="0.00"
                />
                {errors.cost_price && (
                  <p className="mt-1.5 text-sm font-medium text-rose-500">{errors.cost_price.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-800 mb-1.5">ราคาขายขั้นต่ำ (บาท)</label>
                <input
                  type="number"
                  step="0.01"
                  {...register('min_price')}
                  className="input-field w-full"
                  placeholder="0.00"
                />
                {errors.min_price && (
                  <p className="mt-1.5 text-sm font-medium text-rose-500">{errors.min_price.message}</p>
                )}
              </div>
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-semibold text-neutral-800 mb-1.5">จำนวนสินค้าในคลัง</label>
              <input
                type="number"
                {...register('stock')}
                className="input-field w-full sm:max-w-[50%]"
                placeholder="0"
              />
              {errors.stock && (
                <p className="mt-1.5 text-sm font-medium text-rose-500">{errors.stock.message}</p>
              )}
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-3 pt-6 border-t border-neutral-100/60 mt-8">
              <button
                type="button"
                onClick={() => navigate('/admin/products')}
                className="btn-secondary font-medium bg-white hover:bg-neutral-50"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary flex items-center gap-2 font-semibold shadow-md hover:shadow-lg transition-all"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {isEdit ? 'บันทึกการแก้ไข' : 'เพิ่มสินค้า'}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}