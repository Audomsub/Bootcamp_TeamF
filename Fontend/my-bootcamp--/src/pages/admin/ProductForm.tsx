import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Upload, Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/shared';
import { productService } from '@/services/product.service';

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Description is required'),
  cost_price: z.coerce.number().min(0, 'Cost price must be positive'),
  min_price: z.coerce.number().min(0, 'Minimum price must be positive'),
  stock: z.coerce.number().int().min(0, 'Stock must be non-negative'),
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
      setImagePreview(product.image_url);
    } catch {
      navigate('/admin/products');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProductForm) => {
    try {
      setError('');
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
      setError(err.response?.data?.message || 'Failed to save product');
    }
  };

  return (
    <div>
      <PageHeader
        title={isEdit ? 'Edit Product' : 'Add Product'}
        subtitle={isEdit ? 'Update product details' : 'Add a new product to catalog'}
      >
        <button
          onClick={() => navigate('/admin/products')}
          className="btn-secondary flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </PageHeader>

      <div className="card max-w-2xl">
        <div className="card-body">
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Image upload */}
            <div>
              <label className="label">Product Image</label>
              <div className="flex items-center gap-4">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-24 h-24 rounded-xl object-cover border border-gray-200"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <Upload className="h-6 w-6 text-gray-400" />
                  </div>
                )}
                <div>
                  <label className="btn-secondary cursor-pointer text-sm inline-flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</p>
                </div>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="label">Product Name</label>
              <input
                {...register('name')}
                className="input-field"
                placeholder="Enter product name"
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="label">Description</label>
              <textarea
                {...register('description')}
                rows={3}
                className="input-field resize-none"
                placeholder="Enter product description"
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>
              )}
            </div>

            {/* Prices */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Cost Price (THB)</label>
                <input
                  type="number"
                  step="0.01"
                  {...register('cost_price')}
                  className="input-field"
                  placeholder="0.00"
                />
                {errors.cost_price && (
                  <p className="mt-1 text-xs text-red-500">{errors.cost_price.message}</p>
                )}
              </div>
              <div>
                <label className="label">Minimum Selling Price (THB)</label>
                <input
                  type="number"
                  step="0.01"
                  {...register('min_price')}
                  className="input-field"
                  placeholder="0.00"
                />
                {errors.min_price && (
                  <p className="mt-1 text-xs text-red-500">{errors.min_price.message}</p>
                )}
              </div>
            </div>

            {/* Stock */}
            <div>
              <label className="label">Stock Quantity</label>
              <input
                type="number"
                {...register('stock')}
                className="input-field max-w-xs"
                placeholder="0"
              />
              {errors.stock && (
                <p className="mt-1 text-xs text-red-500">{errors.stock.message}</p>
              )}
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate('/admin/products')}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary flex items-center gap-2"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {isEdit ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
