import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, calculateTotal } = useCart();

  const calculateSubtotal = () => {
    return cartItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const calculateConvenienceFee = () => {
    const subtotal = parseFloat(calculateSubtotal());
    const total = parseFloat(calculateTotal());
    return (total - subtotal).toFixed(2);
  };

  return (
    <div className="mt-[130px] pb-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium mb-4">Your cart is empty</h2>
            <Button>
              <Link to="/services">Browse Services</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b">
                  <h2 className="text-lg font-semibold">
                    {cartItems.length}{" "}
                    {cartItems.length === 1 ? "Item" : "Items"} in Cart
                  </h2>
                </div>

                <div className="divide-y">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-6 flex flex-col sm:flex-row gap-6"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src = "/fallback-image.png";
                        }}
                      />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{item.name}</h3>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        <p className="text-primary font-semibold mt-2">
                          Rs. {item.price.toFixed(2)}
                        </p>
                        <div className="flex items-center mt-4">
                          <Button
                            variant="outline"
                            className="rounded-r-none h-10"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                          >
                            -
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(
                                item.id,
                                parseInt(e.target.value) || 1
                              )
                            }
                            className="w-16 h-10 rounded-none text-center border-x-0"
                            min="1"
                          />
                          <Button
                            variant="outline"
                            className="rounded-l-none h-10"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-[150px]">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>Rs. {calculateSubtotal()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Convenience Fee</span>
                    <span>Rs. {calculateConvenienceFee()}</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>Rs. {calculateTotal()}</span>
                  </div>
                </div>

                <Button className="w-full mt-6" size="lg">
                  <Link to="/checkout">Proceed to Checkout</Link>
                </Button>

                <Button variant="outline" className="w-full mt-4" size="lg">
                  <Link to="/services">Continue Shopping</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;