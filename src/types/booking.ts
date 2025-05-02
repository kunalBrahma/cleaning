// types/booking.ts
export interface BookingItem {
    order_item_id: number;
    product_id: string;
    product_name: string;
    quantity: number;
    price: number;
  }
  
  export interface Booking {
    order_id: number;
    order_number: string;
    created_at: string;
    status: string;
    total: number;
    items: BookingItem[];
  }
  
  // types/user.ts
export interface User {
    name: string;
    email: string;
    // add other fields as needed
  }
  