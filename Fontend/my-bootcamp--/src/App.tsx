import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import AdminLayout from './components/layouts/AdminLayout';
import ResellerLayout from './components/layouts/ResellerLayout';
import ShopLayout from './components/layouts/ShopLayout';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import ProductForm from './pages/admin/ProductForm';
import AdminResellers from './pages/admin/AdminResellers';
import AdminOrders from './pages/admin/AdminOrders';

// Reseller Pages
import ResellerLogin from './pages/reseller/ResellerLogin';
import ResellerRegister from './pages/reseller/ResellerRegister';
import ResellerDashboard from './pages/reseller/ResellerDashboard';
import ResellerCatalog from './pages/reseller/ResellerCatalog';
import ResellerMyProducts from './pages/reseller/ResellerMyProducts';
import ResellerOrders from './pages/reseller/ResellerOrders';
import ResellerWallet from './pages/reseller/ResellerWallet';

// Customer Shop Pages
import ShopPage from './pages/shop/ShopPage';
import CheckoutPage from './pages/shop/CheckoutPage';
import PaymentPage from './pages/shop/PaymentPage';
import TrackOrder from './pages/shop/TrackOrder';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Public Root Redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Admin Auth */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoute role="admin" />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/admin/products/add" element={<ProductForm />} />
                <Route path="/admin/products/edit/:id" element={<ProductForm />} />
                <Route path="/admin/resellers" element={<AdminResellers />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
              </Route>
            </Route>

            {/* Reseller Auth */}
            <Route path="/login" element={<ResellerLogin />} />
            <Route path="/register" element={<ResellerRegister />} />

            {/* Protected Reseller Routes */}
            <Route element={<ProtectedRoute role="reseller" requireApproval={true} />}>
              <Route element={<ResellerLayout />}>
                <Route path="/reseller/dashboard" element={<ResellerDashboard />} />
                <Route path="/reseller/catalog" element={<ResellerCatalog />} />
                <Route path="/reseller/my-products" element={<ResellerMyProducts />} />
                <Route path="/reseller/orders" element={<ResellerOrders />} />
                <Route path="/reseller/wallet" element={<ResellerWallet />} />
              </Route>
            </Route>

            {/* Public Shop Routes */}
            <Route element={<ShopLayout />}>
              <Route path="/shop/:slug" element={<ShopPage />} />
              <Route path="/shop/:slug/checkout" element={<CheckoutPage />} />
              <Route path="/shop/:slug/payment/:order_id" element={<PaymentPage />} />
              <Route path="/track-order" element={<TrackOrder />} />
            </Route>

            {/* 404 Catch All */}
            <Route path="*" element={
              <div className="h-screen flex items-center justify-center text-center p-4">
                <div>
                  <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-gray-500 mb-6">Oops! The page you're looking for doesn't exist.</p>
                  <button onClick={() => window.history.back()} className="btn-primary">
                    Go Back
                  </button>
                </div>
              </div>
            } />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
