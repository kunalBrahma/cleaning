import React, { useRef, useEffect } from "react";
import { X, Trash2 } from "lucide-react";
import { gsap } from "gsap";
import { Link } from "react-router-dom";
import Button from "./Button";

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, newQuantity: number) => void;
  calculateTotal: () => string;
}

const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  removeFromCart,
  updateQuantity,
  calculateTotal,
}) => {
  const cartModalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cartModalRef.current) {
      if (isOpen) {
        // Animate cart modal in
        gsap.fromTo(
          cartModalRef.current,
          { opacity: 0, y: -20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out",
          }
        );
      } else {
        // Animate cart modal out
        gsap.to(cartModalRef.current, {
          opacity: 0,
          y: -20,
          duration: 0.2,
          ease: "power2.in",
        });
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Cart Modal */}
      <div
        ref={cartModalRef}
        className="fixed right-0 top-0 md:top-20 md:right-4 w-full md:w-96 bg-white rounded-lg shadow-lg z-50 max-h-[80vh] overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-lg">Your Cart ({cartItems.length})</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 border-b pb-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-blue-600 font-semibold">${item.price}</p>
                  <div className="flex items-center mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l"
                    >
                      -
                    </button>
                    <span className="w-10 h-8 flex items-center justify-center border-t border-b border-gray-300">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="border-t p-4 bg-gray-50">
          <div className="flex justify-between mb-4">
            <span className="font-semibold">Total:</span>
            <span className="font-bold text-blue-700">${calculateTotal()}</span>
          </div>
          <Link to="/checkout">
            <Button
              onClick={onClose}
              className="w-full"
              disabled={cartItems.length === 0}
            >
              Checkout
            </Button>
          </Link>
          <Link to="/cart">
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full mt-2"
              disabled={cartItems.length === 0}
            >
              View Cart
            </Button>
          </Link>
          
        </div>
      </div>
    </>
  );
};

export default CartModal;