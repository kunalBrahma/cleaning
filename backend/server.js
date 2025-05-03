import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import { config } from "dotenv";
import morgan from "morgan";
import fetch from "node-fetch";

config();

const app = express();

// Middleware
app.use(morgan("dev"));
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
  })
);
app.use(express.json());

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later.",
});
app.use("/auth/", authLimiter);

// MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "cleaning",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// JWT secret
const JWT_SECRET =
  process.env.JWT_SECRET ||
  "0e02fa4596bb2cfe82c864dfaf2ef5c863659b84dd7e1c985d34f8f54a8e6435783c958f858cabe99cabaf45ce3b56b50fe7afab1d3268381da0ddd12a402a9c";

// Test database connection
async function testDatabaseConnection() {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log("✅ Database connection successful");
    await connection.query("SELECT 1");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  } finally {
    if (connection) connection.release();
  }
}

testDatabaseConnection();

// Middleware to verify JWT
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authentication token required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Auth endpoints
app.post("/auth/signup", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }

    const connection = await pool.getConnection();
    try {
      const [existingUsers] = await connection.query(
        "SELECT id FROM profile WHERE email = ?",
        [email]
      );

      if (existingUsers.length > 0) {
        return res.status(409).json({ message: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await connection.query(
        "INSERT INTO profile (name, email, phone, password) VALUES (?, ?, ?, ?)",
        [name, email, phone, hashedPassword]
      );

      const [users] = await connection.query(
        "SELECT id, name, email, phone, created_at FROM profile WHERE id = ?",
        [result.insertId]
      );

      const token = jwt.sign({ userId: result.insertId }, JWT_SECRET, {
        expiresIn: "7d",
      });

      return res.status(201).json({
        message: "User created successfully",
        user: users[0],
        token,
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const connection = await pool.getConnection();
    try {
      const [users] = await connection.query(
        "SELECT * FROM profile WHERE email = ?",
        [email]
      );

      if (users.length === 0) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const user = users[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      const { password: _, ...userWithoutPassword } = user;

      return res.status(200).json({
        message: "Login successful",
        user: userWithoutPassword,
        token,
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

app.get("/auth/me", authenticateToken, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    try {
      const [users] = await connection.query(
        "SELECT id, name, email, phone, created_at FROM profile WHERE id = ?",
        [req.user.id]
      );

      if (users.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({
        message: "User data retrieved",
        user: users[0],
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Get user error:", error);
    return res.status(500).json({
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

app.post("/auth/refresh", authenticateToken, async (req, res) => {
  try {
    const newToken = jwt.sign({ userId: req.user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.status(200).json({ token: newToken });
  } catch (error) {
    console.error("Refresh token error:", error);
    return res.status(500).json({ message: "Failed to refresh token" });
  }
});

// Get all services grouped by category
app.get("/api/services-by-category", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    try {
      const [services] = await connection.query("SELECT * FROM services");

      const servicesByCategory = {};
      services.forEach((service) => {
        if (!servicesByCategory[service.category]) {
          servicesByCategory[service.category] = [];
        }
        servicesByCategory[service.category].push(service);
      });

      res.status(200).json(servicesByCategory);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Fetch services error:", error);
    res.status(500).json({
      message: "Failed to fetch services",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Get all active services
app.get("/api/services", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    try {
      const [services] = await connection.query(
        "SELECT * FROM main WHERE status = 'Active'"
      );

      res.status(200).json(services);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({
      message: "Failed to fetch services",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Checkout endpoint
app.post("/api/checkout", async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    addressLine1,
    addressLine2,
    city,
    state,
    zipCode,
    country,
    paymentMethod,
    cartItems,
    subtotal,
    convenienceFee,
    discount,
    total,
    couponCode,
  } = req.body;

  // Validate required fields
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !addressLine1 ||
    !city ||
    !state ||
    !zipCode ||
    !country ||
    !paymentMethod ||
    !cartItems ||
    !Array.isArray(cartItems) ||
    cartItems.length === 0 ||
    subtotal == null ||
    convenienceFee == null ||
    total == null
  ) {
    return res
      .status(400)
      .json({ message: "All required fields must be provided" });
  }

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  let profileId = null;

  // If token exists, verify it and extract user ID
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      profileId = decoded.userId;
    } catch (error) {
      console.error("Token verification error:", error);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  }

  const orderNumber = `ORD-${Math.floor(Math.random() * 1000000)}`;

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Insert into orders table
    const [orderResult] = await connection.query(
      `
      INSERT INTO orders (
        order_number, profile_id, guest_email, guest_phone, first_name, last_name,
        address_line1, address_line2, city, state, zip_code, country,
        payment_method, subtotal, convenience_fee, discount, total, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        orderNumber,
        profileId,
        email, // Always store email
        phone, // Always store phone
        firstName,
        lastName,
        addressLine1,
        addressLine2 || null,
        city,
        state,
        zipCode,
        country,
        paymentMethod,
        subtotal,
        convenienceFee,
        discount || 0,
        total,
        "Pending", // Initial status
      ]
    );

    const orderId = orderResult.insertId;

    // Insert order items
    for (const item of cartItems) {
      if (!item.id || !item.name || !item.quantity || !item.price) {
        throw new Error("Invalid cart item data");
      }
      await connection.query(
        `
        INSERT INTO order_items (
          order_id, product_id, product_name, quantity, price
        ) VALUES (?, ?, ?, ?, ?)
        `,
        [orderId, item.id, item.name, item.quantity, item.price]
      );
    }

    // Handle coupon (if provided and coupons table exists)
    if (couponCode && discount > 0) {
      try {
        const [coupon] = await connection.query(
          "SELECT * FROM coupons WHERE code = ? AND is_active = TRUE",
          [couponCode]
        );

        if (coupon.length > 0) {
          await connection.query(
            "INSERT INTO order_coupons (order_id, coupon_id, discount_applied) VALUES (?, ?, ?)",
            [orderId, coupon[0].coupon_id, discount]
          );
        }
      } catch (error) {
        console.error("Error handling coupon:", error);
        // Continue with order creation even if coupon handling fails
      }
    }

    await connection.commit();

    // Send WhatsApp notification
    const message = `Thank you for your order, ${firstName} ${lastName}! Your order number is ${orderNumber}. Total: Rs. ${total.toFixed(
      2
    )}.`;
    sendWhatsAppNotification(phone, message);

    // Return order summary
    const orderSummary = {
      orderNumber,
      customerName: `${firstName} ${lastName}`,
      email,
      phone,
      shippingAddress: {
        line1: addressLine1,
        line2: addressLine2 || "",
        city,
        state,
        zipCode,
        country,
      },
      items: cartItems,
      paymentMethod,
      subtotal,
      convenienceFee,
      discount: discount || 0,
      total,
      orderDate: new Date().toISOString(),
      status: "Pending",
    };

    res
      .status(201)
      .json({ message: "Order placed successfully", orderSummary });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("Checkout error:", error);
    res.status(500).json({
      message: "Failed to place order",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  } finally {
    if (connection) connection.release();
  }
});

// Make sure this endpoint is properly defined and not commented out
// Get bookings/orders for authenticated user
app.get("/api/user/bookings", authenticateToken, async (req, res) => {
  try {
    const profileId = req.user ? req.user.id : null;

    if (!profileId) {
      return res
        .status(401)
        .json({ message: "Authentication required to view bookings" });
    }

    const [orders] = await pool.query(
      `
      SELECT 
        o.order_id,
        o.order_number,
        o.first_name,
        o.last_name,
        o.guest_email,
        o.guest_phone,
        o.address_line1,
        o.address_line2,
        o.city,
        o.state,
        o.zip_code,
        o.country,
        o.payment_method,
        o.subtotal,
        o.convenience_fee,
        o.discount,
        o.total,
        o.status,
        o.created_at,
        o.updated_at,
        GROUP_CONCAT(
          CONCAT(oi.product_name, ' (x', oi.quantity, ')')
          SEPARATOR ', '
        ) AS items
      FROM orders o
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
      WHERE o.profile_id = ?
      GROUP BY o.order_id
      ORDER BY o.created_at DESC
      `,
      [profileId]
    );

    res.status(200).json({
      message: "Bookings retrieved successfully",
      bookings: orders,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({
      message: "Failed to fetch bookings",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// WhatsApp notification function with error handling
async function sendWhatsAppNotification(phoneNumber, message) {
  try {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        appkey: "991b16da-8631-4b78-aa70-24c6b4eb8d51",
        authkey: "oecn2ubK3Rrm4zwTvdhqvqO2qqwVEA0scFBHpxiM9yTXJnxvnP",
        to: phoneNumber,
        message: message,
      }),
    };

    const response = await fetch(
      "https://whatsapp.webotapp.com/api/create-message",
      options
    );

    // Check if the response is JSON
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      console.log("WhatsApp notification sent:", data);
      return data;
    } else {
      const text = await response.text();
      console.error("Unexpected response from WhatsApp API:", text);
      return null;
    }
  } catch (error) {
    console.error("Error sending WhatsApp notification:", error);
    return null;
  }
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
