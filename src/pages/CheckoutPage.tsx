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
  // Contact Information
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),

  // Address Information
  addressLine1: z.string().min(1, "Address line 1 is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(5, "Zip code must be at least 5 characters"),
  country: z.string().min(1, "Country is required"),

  // Payment Method
  paymentMethod: z.enum(["credit", "paypal", "cash"]),

  // Credit Card Details (conditionally required)
  cardNumber: z
    .string()
    .optional()
    .refine((val) => !val || val.replace(/\s/g, "").length === 16, {
      message: "Card number must be 16 digits",
    }),
  cardExpiry: z
    .string()
    .optional()
    .refine((val) => !val || /^\d{2}\/\d{2}$/.test(val), {
      message: "Expiry date must be in MM/YY format",
    }),
  cardCvv: z
    .string()
    .optional()
    .refine((val) => !val || /^\d{3,4}$/.test(val), {
      message: "CVV must be 3 or 4 digits",
    }),

  // Terms and Conditions
  agreeTerms: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the terms and conditions" }),
  }),
});

// Type inference based on schema
type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart(); // Use cart context

  // Form state with React Hook Form
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
      country: "India", // Default to India
      paymentMethod: "cash", // Default to cash for India context
      cardNumber: "",
      cardExpiry: "",
      cardCvv: "",
      agreeTerms: true,
    },
  });

  // Get current payment method from form
  const watchPaymentMethod = form.watch("paymentMethod");

  // Coupon and discount state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1; // 10% tax
  const shipping = 5.99; // Standard shipping fee
  const total = subtotal + tax + shipping - discount;

  // Available coupons (would normally come from API)
  const availableCoupons = [
    { code: "CLEAN10", discount: 10, type: "percentage" },
    { code: "SAVE20", discount: 20, type: "fixed" },
    { code: "FIRST15", discount: 15, type: "percentage" },
  ];

  const applyCoupon = () => {
    setIsLoading(true);
    // Simulate API call
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
      } else {
        setDiscount(0);
        setAppliedCoupon("");
        alert("Invalid coupon code");
      }
      setIsLoading(false);
    }, 1000);
  };

  const removeCoupon = () => {
    setCouponCode("");
    setAppliedCoupon("");
    setDiscount(0);
  };

  const onSubmit = (data: CheckoutFormValues) => {
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
      tax,
      shipping,
      discount,
      total,
      orderDate: new Date().toISOString(),
      status: "Confirmed",
    };

    // Save order to localStorage for DashboardPage
    const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    const updatedOrders = [...existingOrders, orderSummary];
    localStorage.setItem("orders", JSON.stringify(updatedOrders));

    // Store in sessionStorage for ThankYouPage
    sessionStorage.setItem("orderSummary", JSON.stringify(orderSummary));

    // Clear cart after successful order
    clearCart();

    if (data.paymentMethod === "cash") {
      // Redirect to Thank You page
      navigate("/thank-you", { state: { orderSummary } });
    } else {
      // Show success message for other payment methods
      navigate("/thank-you", { state: { orderSummary } });
      // alert("Order has been placed successfully!");
    }
  };

  // List of countries
  const countries = ["India"];

  // List of Indian states
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
              <a href="/services">Browse Services</a>
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Customer Info */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Contact Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Contact Information
                      </CardTitle>
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
                              <Input
                                placeholder="Street address, P.O. box"
                                {...field}
                              />
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
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
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
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
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
                                    <RadioGroupItem
                                      value="credit"
                                      id="credit"
                                    />
                                  </FormControl>
                                  <FormLabel
                                    className="font-normal"
                                    htmlFor="credit"
                                  >
                                    Credit/Debit Card
                                  </FormLabel>
                                </FormItem>

                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem
                                      value="paypal"
                                      id="paypal"
                                    />
                                  </FormControl>
                                  <FormLabel
                                    className="font-normal"
                                    htmlFor="paypal"
                                  >
                                    PayPal
                                  </FormLabel>
                                </FormItem>

                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="cash" id="cash" />
                                  </FormControl>
                                  <FormLabel
                                    className="font-normal"
                                    htmlFor="cash"
                                  >
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
                                      // Format card number with spaces every 4 digits
                                      const value = e.target.value.replace(
                                        /\s/g,
                                        ""
                                      );
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
                                        // Format expiry date with slash after month
                                        const value = e.target.value.replace(
                                          /\D/g,
                                          ""
                                        );
                                        if (value.length > 2) {
                                          field.onChange(
                                            `${value.slice(0, 2)}/${value.slice(
                                              2,
                                              4
                                            )}`
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
                                        // Allow only numbers and limit to 4 digits
                                        const value = e.target.value.replace(
                                          /\D/g,
                                          ""
                                        );
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
                      <div className="space-y-2">
                        {cartItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between items-center"
                          >
                            <span>
                              {item.name} × {item.quantity}
                            </span>
                            <span>
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="border-t pt-4 space-y-2">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax (10%)</span>
                          <span>${tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shipping</span>
                          <span>${shipping.toFixed(2)}</span>
                        </div>

                        {/* Coupon Section */}
                        <div className="pt-2">
                          {appliedCoupon ? (
                            <div className="flex justify-between items-center bg-green-50 p-2 rounded">
                              <div className="text-green-700">
                                Coupon: {appliedCoupon} (-
                                ${discount.toFixed(2)})
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

                        <div className="border-t pt-4 flex justify-between font-semibold text-lg">
                          <span>Total</span>
                          <span>${total.toFixed(2)}</span>
                        </div>
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
                                <a
                                  href="#"
                                  className="text-primary underline"
                                >
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
                        className="w-full mt-4"
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