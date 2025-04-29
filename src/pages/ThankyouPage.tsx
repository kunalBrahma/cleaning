import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CheckCircle, ArrowLeft, MapPin, Calendar, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface ShippingAddress {
  line1: string;
  line2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface OrderSummary {
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  paymentMethod: string;
  subtotal: number;
  convenienceFee: number;
  discount: number;
  total: number;
  orderDate: string;
  status: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

const getEstimatedDelivery = () => {
  const today = new Date();
  const deliveryDate = new Date(today);
  deliveryDate.setDate(today.getDate() + 3);
  return formatDate(deliveryDate.toISOString());
};

const ThankYouPage = () => {
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Try to get order summary from location.state first
    const stateOrderSummary = location.state?.orderSummary as OrderSummary | undefined;

    if (stateOrderSummary) {
      setOrderSummary(stateOrderSummary);
    } else {
      // Fallback to sessionStorage
      const orderData = sessionStorage.getItem("orderSummary");
      if (orderData) {
        try {
          setOrderSummary(JSON.parse(orderData));
        } catch (error) {
          console.error("Error parsing orderSummary from sessionStorage:", error);
        }
      }
    }

    // Trigger animation
    setTimeout(() => setShowAnimation(true), 100);

    // Clear sessionStorage to prevent stale data
    return () => {
      sessionStorage.removeItem("orderSummary");
    };
  }, [location.state]); // Dependency on location.state

  if (!orderSummary) {
    return (
      <div className="min-h-screen mt-[130px] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No order information found</h2>
          <p className="mb-6">Please complete checkout to see your order details.</p>
          <Link
            to="/checkout"
            className="inline-flex items-center px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Checkout
          </Link>
        </div>
      </div>
    );
  }

  const formatAddress = (address: ShippingAddress) => {
    const parts = [
      address.line1,
      address.line2,
      address.city,
      address.state,
      address.zipCode,
      address.country,
    ].filter(Boolean);
    return parts.join(", ");
  };

  return (
    <div className="min-h-screen bg-gray-50 mt-[150px] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div
            className={`inline-flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-4 transition-all duration-700 ${
              showAnimation ? "scale-100 opacity-100" : "scale-50 opacity-0"
            }`}
          >
            <CheckCircle
              className={`h-12 w-12 text-green-600 transition-all duration-1000 ${
                showAnimation ? "opacity-100 transform-none" : "opacity-0 -translate-y-4"
              }`}
            />
          </div>
          <h1
            className={`text-3xl font-bold mb-2 transition-all duration-500 ${
              showAnimation ? "opacity-100 transform-none" : "opacity-0 -translate-y-4"
            }`}
          >
            Thank You for Your Order!
          </h1>
          <p
            className={`text-gray-600 mb-8 max-w-xl mx-auto transition-all duration-700 delay-100 ${
              showAnimation ? "opacity-100 transform-none" : "opacity-0 -translate-y-4"
            }`}
          >
            Your order has been successfully placed. We've sent a confirmation email to{" "}
            <span className="font-medium">{orderSummary.email}</span> with your order details.
          </p>
        </div>

        {/* Order Details */}
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-700 delay-200 ${
            showAnimation ? "opacity-100 transform-none" : "opacity-0 translate-y-4"
          }`}
        >
          {/* Order Info */}
          <div className="col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Order Number</h3>
                    <p className="text-lg font-semibold">{orderSummary.orderNumber}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Order Date</h3>
                    <p>{formatDate(orderSummary.orderDate)}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Shipping Address</h3>
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                    <p className="text-gray-800">{formatAddress(orderSummary.shippingAddress)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Estimated Delivery</h3>
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                      <p>{getEstimatedDelivery()}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Payment Method</h3>
                    <p className="capitalize">
                      {orderSummary.paymentMethod === "cash" ? "Cash on Delivery" : orderSummary.paymentMethod}
                    </p>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Order Status</h3>
                  <div className="relative pt-1">
                    <div className="flex mb-3 items-center justify-between">
                      <div className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-green-200 text-green-800">
                        Order Confirmed
                      </div>
                      <div className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-gray-200 text-gray-800">
                        Processing
                      </div>
                      <div className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-gray-200 text-gray-800">
                        Shipped
                      </div>
                      <div className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-gray-200 text-gray-800">
                        Delivered
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex bg-gray-200 rounded">
                      <div
                        style={{ width: "25%" }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                      ></div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">
                        We're preparing your order. You'll receive an update when it ships.
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items (Order #{orderSummary.orderNumber})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {orderSummary.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 border-b pb-3 last:border-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-medium text-rose-600">
                        Rs. {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Price Summary */}
          <div className="col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>Rs. {orderSummary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Convenience Fee</span>
                  <span>Rs. {orderSummary.convenienceFee.toFixed(2)}</span>
                </div>
                {orderSummary.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-Rs. {orderSummary.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-rose-600">Rs. {orderSummary.total.toFixed(2)}</span>
                  </div>
                </div>
                <div className="pt-4">
                  <Link
                    to="/cleaning"
                    className="inline-flex w-full justify-center items-center px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 transition-colors"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Continue Shopping
                  </Link>
                </div>
              </CardContent>
            </Card>
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-medium text-yellow-800 mb-2">Need Help?</h3>
              <p className="text-sm text-yellow-700 mb-2">
                For any questions or issues with your order, please contact our customer service.
              </p>
              <a href="mailto:support@cityhomeservice.com" className="text-sm font-medium text-yellow-800 hover:underline">
                support@cityhomeservice.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;