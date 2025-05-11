/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => Promise<void>;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  calculateTotal: () => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("cart");
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((item: any) => ({
          id: item.id,
          name: item.name,
          price: parseFloat(item.price) || 0,
          image: item.image || "",
          quantity: item.quantity || 1,
          category: item.category || "Cleaning Services",
        }));
      }
      return [];
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [cartItems]);

  const addToCart = async (item: Omit<CartItem, "quantity">) => {
    try {
      const existingItem = cartItems.find((i) => i.id === item.id);

      if (existingItem) {
        setCartItems((prevItems) =>
          prevItems.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          )
        );
        return;
      }

      // Add item with provided category
      setCartItems((prevItems) => [
        ...prevItems,
        {
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: 1,
          category: item.category || "Cleaning Services",
        },
      ]);

      try {
        const response = await fetch("/api/api/services-by-category");
        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }

        const servicesData: Record<
          string,
          Array<{
            id: string | number;
            name?: string;
            price?: string | number;
            image?: string;
            category?: string;
          }>
        > = await response.json();

        console.log("API servicesData:", servicesData);

        const allServices = Object.values(servicesData).flat();

        const service = allServices.find(
          (s) => s.id.toString() === item.id.toString()
        );

        console.log("Found service:", service);

        if (service) {
          setCartItems((prevItems) =>
            prevItems.map((i) =>
              i.id === item.id
                ? {
                    ...i,
                    name: service.name || i.name,
                    price:
                      typeof service.price === "number"
                        ? service.price
                        : parseFloat(service.price || "0") || i.price,
                    image: service.image || i.image,
                    category:
                      service.category && service.category.trim() !== ""
                        ? service.category
                        : i.category, // Preserve item.category
                  }
                : i
            )
          );
        } else {
          console.warn(`Service with ID ${item.id} not found in API response`);
        }
      } catch (apiError) {
        console.error("Failed to fetch additional service details:", apiError);
      }
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    }
  };

  const removeFromCart = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const calculateTotal = () => {
    const subtotal = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // Convenience fee only for Cleaning Services
    const cleaningSubtotal = cartItems
      .filter((item) => item.category === "Cleaning Services")
      .reduce((total, item) => total + item.price * item.quantity, 0);

    let convenienceFee = 0;
    if (cleaningSubtotal > 0) {
      if (cleaningSubtotal < 500) {
        convenienceFee = 39;
      } else {
        const increments = Math.floor(cleaningSubtotal / 500);
        convenienceFee = 39 + increments * 10;
      }
    }

    return (subtotal + convenienceFee).toFixed(2);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        calculateTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};