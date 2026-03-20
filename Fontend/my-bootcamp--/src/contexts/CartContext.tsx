import React, { createContext, useContext, useState, useEffect } from 'react';
import { ShopProduct } from '../types';

interface CartItem {
  shopProduct: ShopProduct;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  resellerEmail: string;
  setResellerEmail: (email: string) => void;
  addToCart: (shopProduct: ShopProduct, quantity: number) => void;
  removeFromCart: (shopProductId: number) => void;
  updateQuantity: (shopProductId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalQuantity: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('shop_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [resellerEmail, setResellerEmail] = useState<string>(() => {
    return localStorage.getItem('reseller_email') || '';
  });

  useEffect(() => {
    localStorage.setItem('shop_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('reseller_email', resellerEmail);
  }, [resellerEmail]);

  const addToCart = (shopProduct: ShopProduct, quantity: number) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.shopProduct.id === shopProduct.id);
      const stock = shopProduct.product?.stock ?? 999;
      
      if (existing) {
        const newQuantity = Math.min(existing.quantity + quantity, stock);
        return prev.map(item => 
          item.shopProduct.id === shopProduct.id 
            ? { ...item, quantity: newQuantity } 
            : item
        );
      }
      return [...prev, { shopProduct, quantity: Math.min(quantity, stock) }];
    });
  };

  const removeFromCart = (shopProductId: number) => {
    setCartItems(prev => prev.filter(item => item.shopProduct.id !== shopProductId));
  };

  const updateQuantity = (shopProductId: number, quantity: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.shopProduct.id === shopProductId) {
        const stock = item.shopProduct.product?.stock ?? 999;
        return { ...item, quantity: Math.min(Math.max(1, quantity), stock) };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalItems = cartItems.length;
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cartItems.reduce((sum, item) => 
    sum + (item.shopProduct.selling_price * item.quantity), 0
  );

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      resellerEmail,
      setResellerEmail,
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      totalItems, 
      totalQuantity,
      totalAmount 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
