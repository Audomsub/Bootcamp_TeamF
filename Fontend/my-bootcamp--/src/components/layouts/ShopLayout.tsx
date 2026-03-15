import { Outlet, Link, useParams } from 'react-router-dom';
import { Store, ShoppingBag, Truck } from 'lucide-react';

export default function ShopLayout() {
  const { slug } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            {/* Logo area */}
            <Link to={slug ? `/shop/${slug}` : '/'} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Store className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-gray-900 hidden sm:block">
                Powered by Reseller System
              </span>
            </Link>

            {/* Navigation */}
            <div className="flex items-center gap-4">
              {slug && (
                <Link
                  to={`/shop/${slug}`}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-2"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Shop
                </Link>
              )}
              <Link
                to="/track-order"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-2"
              >
                <Truck className="h-4 w-4" />
                Track Order
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Reseller System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
