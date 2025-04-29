import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Button from "@/components/ui/Button";

// Define the checkout form schema with Zod
const checkoutSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  addressLine1: z.string().min(1, "Address line 1 is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(5, "Zip code must be at least 5 characters"),
  country: z.string().min(1, "Country is required"),
  paymentMethod: z.enum(["credit", "paypal", "cash"]),
  cardNumber: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.replace(/\s/g, "").length === 16,
      { message: "Card number must be 16 digits" }
    ),
  cardExpiry: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d{2}\/\d{2}$/.test(val),
      { message: "Expiry date must be in MM/YY format" }
    ),
  cardCvv: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d{3,4}$/.test(val),
      { message: "CVV must be 3 or 4 digits" }
    ),
  agreeTerms: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the terms and conditions" }),
  }),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      zipCode: "",
      country: "India",
      paymentMethod: "cash",
      cardNumber: "",
      cardExpiry: "",
      cardCvv: "",
      agreeTerms: true,
    },
  });

  const watchPaymentMethod = form.watch("paymentMethod");

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const calculateConvenienceFee = (subtotal: number) => {
    if (subtotal < 500) {
      return 39;
    }
    const increments = Math.floor(subtotal / 500);
    return 39 + increments * 10;
  };
  const convenienceFee = calculateConvenienceFee(subtotal);
  const total = subtotal + convenienceFee - discount;

  const availableCoupons = [
    { code: "CLEAN10", discount: 10, type: "percentage" },
    { code: "SAVE20", discount: 20, type: "fixed" },
    { code: "FIRST15", discount: 15, type: "percentage" },
  ];

  const applyCoupon = () => {
    setIsLoading(true);
    setTimeout(() => {
      const validCoupon = availableCoupons.find(
        (coupon) => coupon.code === couponCode.toUpperCase()
      );

      if (validCoupon) {
        let discountAmount = 0;
        if (validCoupon.type === "percentage") {
          discountAmount = (subtotal * validCoupon.discount) / 100;
        } else {
          discountAmount = validCoupon.discount;
        }
        setDiscount(discountAmount);
        setAppliedCoupon(validCoupon.code);
        toast.success(`Coupon ${validCoupon.code} applied! Saved Rs. ${discountAmount.toFixed(2)}.`, {
          position: "top-right",
          autoClose: 3000,
          className: "bg-green-500 text-white border-green-600",
        });
      } else {
        setDiscount(0);
        setAppliedCoupon("");
        toast.error("Invalid coupon code.", {
          position: "top-right",
          autoClose: 3000,
          className: "bg-red-500 text-white border-red-600",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  const removeCoupon = () => {
    setCouponCode("");
    setAppliedCoupon("");
    setDiscount(0);
    toast.success("Coupon removed.", {
      position: "top-right",
      autoClose: 3000,
      className: "bg-green-500 text-white border-green-600",
    });
  };

  const onSubmit = (data: CheckoutFormValues) => {
    console.log("Form submitted with data:", data); // Debug
    try {
      // Clear card fields for non-credit payments
      if (data.paymentMethod !== "credit") {
        data.cardNumber = undefined;
        data.cardExpiry = undefined;
        data.cardCvv = undefined;
      }

      const orderSummary = {
        orderNumber: `ORD-${Math.floor(Math.random() * 1000000)}`,
        customerName: `${data.firstName} ${data.lastName}`,
        email: data.email,
        phone: data.phone,
        shippingAddress: {
          line1: data.addressLine1,
          line2: data.addressLine2 || "",
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country,
        },
        items: cartItems,
        paymentMethod: data.paymentMethod,
        subtotal,
        convenienceFee,
        discount,
        total,
        orderDate: new Date().toISOString(),
        status: "Confirmed",
      };

      console.log("Order summary created:", orderSummary); // Debug

      // Save to localStorage
      try {
        const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
        localStorage.setItem("orders", JSON.stringify([...existingOrders, orderSummary]));
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }

      // Store in sessionStorage
      try {
        sessionStorage.setItem("orderSummary", JSON.stringify(orderSummary));
      } catch (error) {
        console.error("Error saving to sessionStorage:", error);
      }

      // Clear cart
      console.log("Clearing cart"); // Debug
      clearCart();

      // Show success toast only once
      if (!sessionStorage.getItem("orderPlacedToast")) {
        toast.success("Order placed successfully!", {
          position: "top-right",
          autoClose: 3000,
          className: "bg-green-500 text-white border-green-600",
        });
        sessionStorage.setItem("orderPlacedToast", "true");
      }

      console.log("Navigating to /thank-you"); // Debug
      navigate("/thank-you", { state: { orderSummary } });
    } catch (error) {
      console.error("Error in onSubmit:", error);
      toast.error("Failed to place order. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        className: "bg-red-500 text-white border-red-600",
      });
    }
  };

  const countries = ["India"];
  const states = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];

  return (
    <div className="mt-[150px] pb-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium mb-4">Your cart is empty</h2>
            <Button>
              <a href="/cleaning">Browse Services</a>
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={(e) => {
                form.handleSubmit(onSubmit)(e).catch(() => {
                  console.log("Form validation errors:", form.formState.errors);
                });
              }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Customer Info */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Contact Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input type="tel" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Shipping Address */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Shipping Address</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="addressLine1"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address Line 1</FormLabel>
                            <FormControl>
                              <Input placeholder="Street address, P.O. box" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="addressLine2"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address Line 2 (optional)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Apartment, suite, unit, building, floor, etc."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State/Province</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a state" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="max-h-60">
                                  {states.map((state) => (
                                    <SelectItem key={state} value={state}>
                                      {state}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="zipCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ZIP/Postal Code</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a country" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {countries.map((country) => (
                                    <SelectItem key={country} value={country}>
                                      {country}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Payment Method */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Payment Method</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <FormField
                        control={form.control}
                        name="paymentMethod"
                        render={({ field }) => (
                          <FormItem className="space-y-4">
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="space-y-4"
                              >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="credit" id="credit" />
                                  </FormControl>
                                  <FormLabel className="font-normal" htmlFor="credit">
                                    Credit/Debit Card
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="paypal" id="paypal" />
                                  </FormControl>
                                  <FormLabel className="font-normal" htmlFor="paypal">
                                    PayPal
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="cash" id="cash" />
                                  </FormControl>
                                  <FormLabel className="font-normal" htmlFor="cash">
                                    Cash on Delivery
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {watchPaymentMethod === "credit" && (
                        <div className="mt-6 space-y-4 border p-4 rounded-md">
                          <FormField
                            control={form.control}
                            name="cardNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Card Number</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="1234 5678 9012 3456"
                                    {...field}
                                    onChange={(e) => {
                                      const value = e.target.value.replace(/\s/g, "");
                                      const formattedValue = value
                                        .replace(/\D/g, "")
                                        .replace(/(\d{4})(?=\d)/g, "$1 ");
                                      field.onChange(formattedValue.slice(0, 19));
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="cardExpiry"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Expiry Date</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="MM/YY"
                                      {...field}
                                      onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, "");
                                        if (value.length > 2) {
                                          field.onChange(
                                            `${value.slice(0, 2)}/${value.slice(2, 4)}`
                                          );
                                        } else {
                                          field.onChange(value);
                                        }
                                      }}
                                      maxLength={5}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="cardCvv"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>CVV</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="123"
                                      type="password"
                                      {...field}
                                      onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, "");
                                        field.onChange(value.slice(0, 4));
                                      }}
                                      maxLength={4}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column - Order Summary */}
                <div className="lg:col-span-1 space-y-6">
                  <Card className="sticky top-[150px]">
                    <CardHeader>
                      <CardTitle className="text-lg">Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-4">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex items-center space-x-4 border-b pb-4">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium">{item.name}</h4>
                              <p className="text-rose-600 font-semibold">
                                Rs. {(item.price * item.quantity).toFixed(2)} (x{item.quantity})
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="border-t pt-4 space-y-2">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>Rs. {subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Convenience Fee</span>
                          <span>Rs. {convenienceFee.toFixed(2)}</span>
                        </div>
                        {discount > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Discount ({appliedCoupon})</span>
                            <span>-Rs. {discount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="border-t pt-4 flex justify-between font-semibold text-lg">
                          <span>Total</span>
                          <span className="text-rose-600">Rs. {total.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="pt-2">
                        {appliedCoupon ? (
                          <div className="flex justify-between items-center bg-green-50 p-2 rounded">
                            <div className="text-green-700">
                              Coupon: {appliedCoupon} (-Rs. {discount.toFixed(2)})
                            </div>
                            <Button
                              size="sm"
                              className="text-red-500 hover:text-red-700"
                              onClick={removeCoupon}
                              type="button"
                            >
                              Remove
                            </Button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <Input
                              placeholder="Coupon code"
                              value={couponCode}
                              onChange={(e) => setCouponCode(e.target.value)}
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              onClick={applyCoupon}
                              disabled={!couponCode || isLoading}
                              className="bg-sky-500 hover:bg-sky-600"
                            >
                              {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                "Apply"
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                      <FormField
                        control={form.control}
                        name="agreeTerms"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-2 pt-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                I agree to the{" "}
                                <a href="/terms" className="text-sky-500 underline">
                                  Terms and Conditions
                                </a>
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full mt-4 bg-sky-500 hover:bg-sky-600"
                        size="lg"
                        disabled={isLoading}
                      >
                        Place Order
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;