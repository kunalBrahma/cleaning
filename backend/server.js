import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import { config } from "dotenv";
import morgan from "morgan";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import helmet from "helmet";
import crypto from "crypto";

config();

const app = express();

// Define __dirname for ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(helmet()); // Security headers
app.use(morgan("combined")); // Detailed logging for production
app.use(
  cors({
    origin: [
      "https://cityhomeservice.in",
      "https://admin.cityhomeservice.in", // Ensured admin subdomain is included
      ...(process.env.NODE_ENV === "development"
        ? [
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:5175",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:5174",
            "http://127.0.0.1:5175",
          ]
        : []),
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
  })
);
app.use(express.json());

// Serve static files (uploads directory)
app.use("/uploads", express.static(path.join(__dirname, "public", "Uploads")));

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later.",
});
app.use("/auth/", authLimiter);

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many contact form submissions, please try again later.",
});

// MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "kunal",
  password: process.env.DB_PASSWORD || "Tansegan@123",
  database: process.env.DB_NAME || "cleaning",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// JWT secret
const JWT_SECRET =
  process.env.JWT_SECRET || crypto.randomBytes(64).toString("hex");

// Configure multer for image uploads
const uploadsDir = path.join(__dirname, "public", "Uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only images (jpeg, jpg, png, gif) are allowed"));
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

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

// Admin authentication middleware
const authenticateAdmin = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authentication token required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const connection = await pool.getConnection();
    try {
      const [users] = await connection.query(
        "SELECT id FROM user WHERE id = ? AND status = 'active'",
        [decoded.userId]
      );

      if (users.length === 0) {
        return res.status(403).json({ message: "Admin access required" });
      }

      req.user = { id: decoded.userId, isAdmin: true };
      next();
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Admin token verification error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Image upload endpoint (admin-only, accessible from admin.cityhomeservice.in)
app.post("/api/upload", authenticateAdmin, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { filename } = req.file;
    const filePath = `/uploads/${filename}`;
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? "https://cityhomeservice.in" // Images served from main domain
        : `http://${req.get("host")}`;
    res.status(200).json({
      message: "File uploaded successfully",
      file: {
        filename,
        path: filePath,
        url: `${baseUrl}${filePath}`,
      },
    });
  } catch (error) {
    console.error("File upload error:", error);
    res.status(500).json({
      message: "Failed to upload file",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Secondary image upload endpoint (admin-only, accessible from admin.cityhomeservice.in)
app.post("/api/admin/images", authenticateAdmin, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const { filename } = req.file;
    const filePath = `/uploads/${filename}`;
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? "https://cityhomeservice.in" // Images served from main domain
        : `http://${req.get("host")}`;
    res.status(201).json({
      message: "Image uploaded successfully",
      image: {
        filename,
        path: filePath,
        url: `${baseUrl}${filePath}`,
      },
    });
  } catch (error) {
    console.error("Image upload error:", error);
    res.status(500).json({
      message: "Failed to upload image",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Global error handler for multer and other errors
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "File size exceeds 5MB limit" });
    }
    return res.status(400).json({ message: "File upload error" });
  }

  if (err.message === "Only images (jpeg, jpg, png, gif) are allowed") {
    return res.status(400).json({ message: err.message });
  }

  res.status(500).json({
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

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
        "SELECT * FROM.stationery WHERE email = ?",
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

// Admin auth endpoints
app.post("/auth/admin/signup", async (req, res) => {
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
        "SELECT id FROM user WHERE email = ?",
        [email]
      );

      if (existingUsers.length > 0) {
        return res.status(409).json({ message: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await connection.query(
        "INSERT INTO user (name, email, phone, password, status) VALUES (?, ?, ?, ?, ?)",
        [name, email, phone, hashedPassword, "inactive"]
      );

      return res.status(201).json({
        message: "Admin account created successfully. Waiting for activation.",
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Admin signup error:", error);
    return res.status(500).json({
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

app.post("/auth/admin/login", async (req, res) => {
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
        "SELECT * FROM user WHERE email = ?",
        [email]
      );

      if (users.length === 0) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const user = users[0];
      const userStatus = user.status ? user.status.toLowerCase() : "inactive";

      if (userStatus !== "active") {
        return res.status(403).json({
          message: "Admin account not yet activated. Please contact super admin.",
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ userId: user.id, isAdmin: true }, JWT_SECRET, {
        expiresIn: "7d",
      });

      const { password: _, ...userWithoutPassword } = user;

      return res.status(200).json({
        message: "Admin login successful",
        user: { ...userWithoutPassword, status: userStatus },
        token,
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

app.get("/auth/admin/me", authenticateAdmin, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    try {
      const [users] = await connection.query(
        "SELECT id, name, email, phone, status, created_at FROM user WHERE id = ?",
        [req.user.id]
      );

      if (users.length === 0) {
        return res.status(404).json({ message: "Admin not found" });
      }

      const user = users[0];
      const userStatus = user.status ? user.status.toLowerCase() : "inactive";

      return res.status(200).json({
        message: "Admin data retrieved",
        user: { ...user, status: userStatus },
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Get admin error:", error);
    return res.status(500).json({
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

app.put("/auth/admin/activate/:id", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    try {
      const [existing] = await connection.query(
        "SELECT id FROM user WHERE id = ?",
        [id]
      );

      if (existing.length === 0) {
        return res.status(404).json({ message: "Admin not found" });
      }

      await connection.query("UPDATE user SET status = 'active' WHERE id = ?", [
        id,
      ]);

      const [updatedAdmin] = await connection.query(
        "SELECT id, name, email, status FROM user WHERE id = ?",
        [id]
      );

      return res.status(200).json({
        message: "Admin account activated successfully",
        user: updatedAdmin[0],
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Admin activation error:", error);
    return res.status(500).json({
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Get all services grouped by category
app.get("/api/services-by-category", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    try {
      const [services] = await connection.query("SELECT * FROM services");

      const baseUrl =
        process.env.NODE_ENV === "production"
          ? "https://cityhomeservice.in"
          : `http://${req.get("host")}`;

      const servicesByCategory = {};
      services.forEach((service) => {
        if (!servicesByCategory[service.category]) {
          servicesByCategory[service.category] = [];
        }
        servicesByCategory[service.category].push({
          ...service,
          image: service.image ? `${baseUrl}${service.image}` : null,
        });
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

      const baseUrl =
        process.env.NODE_ENV === "production"
          ? "https://cityhomeservice.in"
          : `http://${req.get("host")}`;

      const formattedServices = services.map((service) => ({
        ...service,
        icon: service.icon ? `${baseUrl}${service.icon}` : null,
      }));

      res.status(200).json(formattedServices);
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
        email,
        phone,
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
        "Pending",
      ]
    );

    const orderId = orderResult.insertId;

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
      }
    }

    await connection.commit();

    const message = `Thank you for your order, ${firstName} ${lastName}! Your order number is ${orderNumber}. Total: Rs. ${total.toFixed(
      2
    )}.`;
    sendWhatsAppNotification(phone, message);

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

// Get all orders (no authentication required)
app.get("/api/orders", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    try {
      const [orders] = await connection.query(
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
        GROUP BY o.order_id
        ORDER BY o.created_at DESC
        `
      );

      const formattedOrders = orders.map((order) => ({
        ...order,
        created_at: order.created_at
          ? new Date(order.created_at).toISOString()
          : null,
        updated_at: order.updated_at
          ? new Date(order.updated_at).toISOString()
          : null,
      }));

      res.status(200).json({
        message: "Orders retrieved successfully",
        orders: formattedOrders,
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      message: "Failed to fetch orders",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Contact form submission
app.post("/api/contact", contactLimiter, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject) {
      return res
        .status(400)
        .json({ message: "Name, email, and subject are required" });
    }
    if (name.length < 2) {
      return res
        .status(400)
        .json({ message: "Name must be at least 2 characters" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res
        .status(400)
        .json({ message: "Please enter a valid email address" });
    }
    if (subject.length < 2) {
      return res
        .status(400)
        .json({ message: "Subject must be at least 2 characters" });
    }

    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query(
        "INSERT INTO contact_us (name, email, subject, message) VALUES (?, ?, ?, ?)",
        [name, email, subject, message || ""]
      );

      res.status(201).json({
        message: "Contact form submitted successfully",
        contactId: result.insertId,
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Contact form submission error:", error);
    res.status(500).json({
      message: "Failed to submit contact form",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

async function sendWhatsAppNotification(phoneNumber, message) {
  try {
    let formattedPhoneNumber = phoneNumber.trim();
    if (!formattedPhoneNumber.startsWith("+")) {
      formattedPhoneNumber = `+91${formattedPhoneNumber}`;
    }

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        appkey: process.env.WHATSAPP_APP_KEY || "991b16da-8631-4b78-aa70-24c6b4eb8d51",
        authkey: process.env.WHATSAPP_AUTH_KEY || "oecn2ubK3Rrm4zwTvdhqvqO2qqwVEA0scFBHpxiM9yTXJnxvnP",
        to: formattedPhoneNumber,
        message: message,
      }),
    };

    const response = await fetch(
      "https://whatsapp.webotapp.com/api/create-message",
      options
    );

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

// Create a new service
app.post("/api/main", authenticateAdmin, async (req, res) => {
  try {
    const { category, subCategory, icon, path } = req.body;

    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query(
        "INSERT INTO main (category, subCategory, icon, path, status) VALUES (?, ?, ?, ?, ?)",
        [category, subCategory || null, icon || null, path || null, "Active"]
      );

      const [newService] = await connection.query(
        "SELECT * FROM main WHERE id = ?",
        [result.insertId]
      );

      const baseUrl =
        process.env.NODE_ENV === "production"
          ? "https://cityhomeservice.in"
          : `http://${req.get("host")}`;

      res.status(201).json({
        message: "Service created successfully",
        service: {
          ...newService[0],
          icon: newService[0].icon ? `${baseUrl}${newService[0].icon}` : null,
        },
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Create service error:", error);
    res.status(500).json({
      message: "Failed to create service",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Get all services (including inactive)
app.get("/api/main/all", authenticateAdmin, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    try {
      const [services] = await connection.query(
        "SELECT * FROM main ORDER BY createdAt DESC"
      );

      const baseUrl =
        process.env.NODE_ENV === "production"
          ? "https://cityhomeservice.in"
          : `http://${req.get("host")}`;

      const formattedServices = services.map((service) => ({
        ...service,
        icon: service.icon ? `${baseUrl}${service.icon}` : null,
      }));

      res.status(200).json(formattedServices);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Get all services error:", error);
    res.status(500).json({
      message: "Failed to fetch services",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Get service by ID
app.get("/api/main/:id", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    try {
      const [services] = await connection.query(
        "SELECT * FROM main WHERE id = ?",
        [id]
      );

      if (services.length === 0) {
        return res.status(404).json({ message: "Service not found" });
      }

      const baseUrl =
        process.env.NODE_ENV === "production"
          ? "https://cityhomeservice.in"
          : `http://${req.get("host")}`;

      res.status(200).json({
        ...services[0],
        icon: services[0].icon ? `${baseUrl}${services[0].icon}` : null,
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Get service error:", error);
    res.status(500).json({
      message: "Failed to fetch service",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Update service
app.put("/api/main/:id", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { category, subCategory, icon, path, status } = req.body;

    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    const connection = await pool.getConnection();
    try {
      const [existing] = await connection.query(
        "SELECT id FROM main WHERE id = ?",
        [id]
      );

      if (existing.length === 0) {
        return res.status(404).json({ message: "Service not found" });
      }

      await connection.query(
        "UPDATE main SET category = ?, subCategory = ?, icon = ?, path = ?, status = ? WHERE id = ?",
        [category, subCategory || null, icon || null, path || null, status || "Active", id]
      );

      const [updatedService] = await connection.query(
        "SELECT * FROM main WHERE id = ?",
        [id]
      );

      const baseUrl =
        process.env.NODE_ENV === "production"
          ? "https://cityhomeservice.in"
          : `http://${req.get("host")}`;

      res.status(200).json({
        message: "Service updated successfully",
        service: {
          ...updatedService[0],
          icon: updatedService[0].icon ? `${baseUrl}${updatedService[0].icon}` : null,
        },
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Update service error:", error);
    res.status(500).json({
      message: "Failed to update service",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// "Delete" service (update status to inActive)
app.delete("/api/main/:id", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    try {
      const [existing] = await connection.query(
        "SELECT id FROM main WHERE id = ?",
        [id]
      );

      if (existing.length === 0) {
        return res.status(404).json({ message: "Service not found" });
      }

      await connection.query("UPDATE main SET status = 'inActive' WHERE id = ?", [
        id,
      ]);

      res.status(200).json({ message: "Service marked as inactive" });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Delete service error:", error);
    res.status(500).json({
      message: "Failed to update service status",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Update order status (Admin only)
app.put("/api/orders/:id/status", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || typeof status !== "string" || status.trim() === "") {
      return res
        .status(400)
        .json({ message: "Status is required and must be a non-empty string" });
    }

    const connection = await pool.getConnection();
    try {
      const [existing] = await connection.query(
        "SELECT order_id, order_number, first_name, last_name, guest_phone FROM orders WHERE order_id = ?",
        [id]
      );

      if (existing.length === 0) {
        return res.status(404).json({ message: "Order not found" });
      }

      const order = existing[0];

      await connection.query(
        "UPDATE orders SET status = ?, updated_at = NOW() WHERE order_id = ?",
        [status.trim(), id]
      );

      const [updatedOrder] = await connection.query(
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
        WHERE o.order_id = ?
        GROUP BY o.order_id
        `,
        [id]
      );

      if (updatedOrder.length === 0) {
        return res.status(404).json({ message: "Order not found after update" });
      }

      const formattedOrder = {
        ...updatedOrder[0],
        created_at: updatedOrder[0].created_at
          ? new Date(updatedOrder[0].created_at).toISOString()
          : null,
        updated_at: updatedOrder[0].updated_at
          ? new Date(updatedOrder[0].updated_at).toISOString()
          : null,
      };

      const message = `Dear ${order.first_name} ${order.last_name}, your order (${order.order_number}) status has been updated to ${status.trim()}.`;
      await sendWhatsAppNotification(order.guest_phone, message);

      res.status(200).json({
        message: "Order status updated successfully",
        order: formattedOrder,
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({
      message: "Failed to update order status",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// OFFERINGS CRUD OPERATIONS

// Create a new offering (admin-only)
app.post("/api/offerings", authenticateAdmin, async (req, res) => {
  try {
    const {
      service_code,
      name,
      description,
      icon,
      price,
      category,
      subCategory,
      image,
      features,
      requirements,
      exclusions,
      pricetable,
      popular,
      whatsapp_message,
    } = req.body;

    if (!service_code || !name) {
      return res
        .status(400)
        .json({ message: "Service code and name are required" });
    }

    const connection = await pool.getConnection();
    try {
      const [existing] = await connection.query(
        "SELECT id FROM services WHERE service_code = ?",
        [service_code]
      );

      if (existing.length > 0) {
        return res.status(409).json({ message: "Service code already exists" });
      }

      const [result] = await connection.query(
        `INSERT INTO services (
          service_code, name, description, icon, price, category, subCategory,
          image, features, requirements, exclusions, pricetable, popular, whatsapp_message
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          service_code,
          name,
          description || null,
          icon || null,
          price || null,
          category || null,
          subCategory || null,
          image || null,
          features || null,
          requirements || null,
          exclusions || null,
          pricetable || null,
          popular || 0,
          whatsapp_message || null,
        ]
      );

      const [newOffering] = await connection.query(
        "SELECT * FROM services WHERE id = ?",
        [result.insertId]
      );

      const baseUrl =
        process.env.NODE_ENV === "production"
          ? "https://cityhomeservice.in"
          : `http://${req.get("host")}`;

      res.status(201).json({
        message: "Offering created successfully",
        offering: {
          ...newOffering[0],
          image: newOffering[0].image
            ? `${baseUrl}${newOffering[0].image}`
            : null,
          icon: newOffering[0].icon
            ? `${baseUrl}${newOffering[0].icon}`
            : null,
        },
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Create offering error:", error);
    res.status(500).json({
      message: "Failed to create offering",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Get all offerings
app.get("/api/offerings", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    try {
      const [offerings] = await connection.query(
        "SELECT * FROM services ORDER BY id DESC"
      );

      const baseUrl =
        process.env.NODE_ENV === "production"
          ? "https://cityhomeservice.in"
          : `http://${req.get("host")}`;

      const formattedOfferings = offerings.map((offering) => ({
        ...offering,
        image: offering.image ? `${baseUrl}${offering.image}` : null,
        icon: offering.icon ? `${baseUrl}${offering.icon}` : null,
      }));

      res.status(200).json({
        message: "Offerings retrieved successfully",
        offerings: formattedOfferings,
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Get all offerings error:", error);
    res.status(500).json({
      message: "Failed to fetch offerings",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Get offering by ID
app.get("/api/offerings/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    try {
      const [offerings] = await connection.query(
        "SELECT * FROM services WHERE id = ?",
        [id]
      );

      if (offerings.length === 0) {
        return res.status(404).json({ message: "Offering not found" });
      }

      const baseUrl =
        process.env.NODE_ENV === "production"
          ? "https://cityhomeservice.in"
          : `http://${req.get("host")}`;

      res.status(200).json({
        message: "Offering retrieved successfully",
        offering: {
          ...offerings[0],
          image: offerings[0].image
            ? `${baseUrl}${offerings[0].image}`
            : null,
          icon: offerings[0].icon
            ? `${baseUrl}${offerings[0].icon}`
            : null,
        },
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Get offering error:", error);
    res.status(500).json({
      message: "Failed to fetch offering",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Get offering by service_code
app.get("/api/offerings/code/:service_code", async (req, res) => {
  try {
    const { service_code } = req.params;

    const connection = await pool.getConnection();
    try {
      const [offerings] = await connection.query(
        "SELECT * FROM services WHERE service_code = ?",
        [service_code]
      );

      if (offerings.length === 0) {
        return res.status(404).json({ message: "Offering not found" });
      }

      const baseUrl =
        process.env.NODE_ENV === "production"
          ? "https://cityhomeservice.in"
          : `http://${req.get("host")}`;

      res.status(200).json({
        message: "Offering retrieved successfully",
        offering: {
          ...offerings[0],
          image: offerings[0].image
            ? `${baseUrl}${offerings[0].image}`
            : null,
          icon: offerings[0].icon
            ? `${baseUrl}${offerings[0].icon}`
            : null,
        },
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Get offering by code error:", error);
    res.status(500).json({
      message: "Failed to fetch offering",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Update offering (admin-only)
app.put("/api/offerings/:id", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      service_code,
      name,
      description,
      icon,
      price,
      category,
      subCategory,
      image,
      features,
      requirements,
      exclusions,
      pricetable,
      popular,
      whatsapp_message,
    } = req.body;

    if (!service_code || !name) {
      return res
        .status(400)
        .json({ message: "Service code and name are required" });
    }

    const connection = await pool.getConnection();
    try {
      const [existing] = await connection.query(
        "SELECT id, image FROM services WHERE id = ?",
        [id]
      );

      if (existing.length === 0) {
        return res.status(404).json({ message: "Offering not found" });
      }

      const [codeConflict] = await connection.query(
        "SELECT id FROM services WHERE service_code = ? AND id != ?",
        [service_code, id]
      );

      if (codeConflict.length > 0) {
        return res
          .status(409)
          .json({ message: "Service code already in use by another offering" });
      }

      // Delete old image if a new one is provided and different
      if (image && existing[0].image && image !== existing[0].image) {
        const oldImagePath = path.join(
          uploadsDir,
          path.basename(existing[0].image)
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      await connection.query(
        `UPDATE services SET 
          service_code = ?,
          name = ?,
          description = ?,
          icon = ?,
          price = ?,
          category = ?,
          subCategory = ?,
          image = ?,
          features = ?,
          requirements = ?,
          exclusions = ?,
          pricetable = ?,
          popular = ?,
          whatsapp_message = ?
        WHERE id = ?`,
        [
          service_code,
          name,
          description || null,
          icon || null,
          price || null,
          category || null,
          subCategory || null,
          image || null,
          features || null,
          requirements || null,
          exclusions || null,
          pricetable || null,
          popular || 0,
          whatsapp_message || null,
          id,
        ]
      );

      const [updatedOffering] = await connection.query(
        "SELECT * FROM services WHERE id = ?",
        [id]
      );

      const baseUrl =
        process.env.NODE_ENV === "production"
          ? "https://cityhomeservice.in"
          : `http://${req.get("host")}`;

      res.status(200).json({
        message: "Offering updated successfully",
        offering: {
          ...updatedOffering[0],
          image: updatedOffering[0].image
            ? `${baseUrl}${updatedOffering[0].image}`
            : null,
          icon: updatedOffering[0].icon
            ? `${baseUrl}${updatedOffering[0].icon}`
            : null,
        },
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Update offering error:", error);
    res.status(500).json({
      message: "Failed to update offering",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Delete offering (admin-only)
app.delete("/api/offerings/:id", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    try {
      const [existing] = await connection.query(
        "SELECT id, image FROM services WHERE id = ?",
        [id]
      );

      if (existing.length === 0) {
        return res.status(404).json({ message: "Offering not found" });
      }

      // Delete associated image
      if (existing[0].image) {
        const imagePath = path.join(uploadsDir, path.basename(existing[0].image));
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      await connection.query("DELETE FROM services WHERE id = ?", [id]);

      res.status(200).json({ message: "Offering deleted successfully" });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Delete offering error:", error);
    res.status(500).json({
      message: "Failed to delete offering",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Get popular offerings
app.get("/api/offerings/popular", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    try {
      const [offerings] = await connection.query(
        "SELECT * FROM services WHERE popular = 1 ORDER BY id DESC"
      );

      const baseUrl =
        process.env.NODE_ENV === "production"
          ? "https://cityhomeservice.in"
          : `http://${req.get("host")}`;

      const formattedOfferings = offerings.map((offering) => ({
        ...offering,
        image: offering.image ? `${baseUrl}${offering.image}` : null,
        icon: offering.icon ? `${baseUrl}${offering.icon}` : null,
      }));

      res.status(200).json({
        message: "Popular offerings retrieved successfully",
        offerings: formattedOfferings,
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Get popular offerings error:", error);
    res.status(500).json({
      message: "Failed to fetch popular offerings",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Get offerings by category
app.get("/api/offerings/category/:category", async (req, res) => {
  try {
    const { category } = req.params;

    const connection = await pool.getConnection();
    try {
      const [offerings] = await connection.query(
        "SELECT * FROM services WHERE category = ? ORDER BY id DESC",
        [category]
      );

      const baseUrl =
        process.env.NODE_ENV === "production"
          ? "https://cityhomeservice.in"
          : `http://${req.get("host")}`;

      const formattedOfferings = offerings.map((offering) => ({
        ...offering,
        image: offering.image ? `${baseUrl}${offering.image}` : null,
        icon: offering.icon ? `${baseUrl}${offering.icon}` : null,
      }));

      res.status(200).json({
        message: "Offerings by category retrieved successfully",
        offerings: formattedOfferings,
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Get offerings by category error:", error);
    res.status(500).json({
      message: "Failed to fetch offerings by category",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Profile CRUD Operations (Admin only)
app.get("/api/profiles", authenticateAdmin, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    try {
      const [profiles] = await connection.query(
        "SELECT id, name, email, phone, created_at FROM profile ORDER BY created_at DESC"
      );

      const formattedProfiles = profiles.map((profile) => ({
        ...profile,
        created_at: profile.created_at
          ? new Date(profile.created_at).toISOString()
          : null,
      }));

      res.status(200).json({
        message: "Profiles retrieved successfully",
        profiles: formattedProfiles,
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Get profiles error:", error);
    res.status(500).json({
      message: "Failed to fetch profiles",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

app.get("/api/profiles/:id", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    try {
      const [profiles] = await connection.query(
        "SELECT id, name, email, phone, created_at FROM profile WHERE id = ?",
        [id]
      );

      if (profiles.length === 0) {
        return res.status(404).json({ message: "Profile not found" });
      }

      const formattedProfile = {
        ...profiles[0],
        created_at: profiles[0].created_at
          ? new Date(profiles[0].created_at).toISOString()
          : null,
      };

      res.status(200).json({
        message: "Profile retrieved successfully",
        profile: formattedProfile,
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      message: "Failed to fetch profile",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

app.post("/api/profiles", authenticateAdmin, async (req, res) => {
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

      const [newProfile] = await connection.query(
        "SELECT id, name, email, phone, created_at FROM profile WHERE id = ?",
        [result.insertId]
      );

      const formattedProfile = {
        ...newProfile[0],
        created_at: newProfile[0].created_at
          ? new Date(newProfile[0].created_at).toISOString()
          : null,
      };

      res.status(201).json({
        message: "Profile created successfully",
        profile: formattedProfile,
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Create profile error:", error);
    res.status(500).json({
      message: "Failed to create profile",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

app.put("/api/profiles/:id", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, password } = req.body;

    if (!name || !email) {
      return res
        .status(400)
        .json({ message: "Name and email are required" });
    }

    const connection = await pool.getConnection();
    try {
      const [existing] = await connection.query(
        "SELECT id FROM profile WHERE id = ?",
        [id]
      );

      if (existing.length === 0) {
        return res.status(404).json({ message: "Profile not found" });
      }

      const [emailConflict] = await connection.query(
        "SELECT id FROM profile WHERE email = ? AND id != ?",
        [email, id]
      );

      if (emailConflict.length > 0) {
        return res
          .status(409)
          .json({ message: "Email already in use by another profile" });
      }

      let hashedPassword = undefined;
      if (password && password.length >= 8) {
        hashedPassword = await bcrypt.hash(password, 10);
      } else if (password) {
        return res
          .status(400)
          .json({ message: "Password must be at least 8 characters" });
      }

      await connection.query(
        `UPDATE profile SET 
          name = ?,
          email = ?,
          phone = ?,
          ${password ? "password = ?," : ""}
          created_at = created_at
        WHERE id = ?`,
        [
          name,
          email,
          phone || null,
          ...(password ? [hashedPassword] : []),
          id,
        ]
      );

      const [updatedProfile] = await connection.query(
        "SELECT id, name, email, phone, created_at Distance profile WHERE id = ?",
        [id]
      );

      const formattedProfile = {
        ...updatedProfile[0],
        created_at: updatedProfile[0].created_at
          ? new Date(updatedProfile[0].created_at).toISOString()
          : null,
      };

      res.status(200).json({
        message: "Profile updated successfully",
        profile: formattedProfile,
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      message: "Failed to update profile",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

app.delete("/api/profiles/:id", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    try {
      const [existing] = await connection.query(
        "SELECT id FROM profile WHERE id = ?",
        [id]
      );

      if (existing.length === 0) {
        return res.status(404).json({ message: "Profile not found" });
      }

      await connection.query("DELETE FROM profile WHERE id = ?", [id]);

      res.status(200).json({ message: "Profile deleted successfully" });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Delete profile error:", error);
    res.status(500).json({
      message: "Failed to delete profile",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// User CRUD Operations (Admin only)
app.get("/api/users", authenticateAdmin, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    try {
      const [users] = await connection.query(
        "SELECT id, name, email, phone, status, created_at FROM user ORDER BY created_at DESC"
      );

      const formattedUsers = users.map((user) => ({
        ...user,
        created_at: user.created_at
          ? new Date(user.created_at).toISOString()
          : null,
        status: user.status ? user.status.toLowerCase() : "inactive",
      }));

      res.status(200).json({
        message: "Users retrieved successfully",
        users: formattedUsers,
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      message: "Failed to fetch users",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

app.get("/api/users/:id", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    try {
      const [users] = await connection.query(
        "SELECT id, name, email, phone, status, created_at FROM user WHERE id = ?",
        [id]
      );

      if (users.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const formattedUser = {
        ...users[0],
        created_at: users[0].created_at
          ? new Date(users[0].created_at).toISOString()
          : null,
        status: users[0].status ? users[0].status.toLowerCase() : "inactive",
      };

      res.status(200).json({
        message: "User retrieved successfully",
        user: formattedUser,
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      message: "Failed to fetch user",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

app.post("/api/users", authenticateAdmin, async (req, res) => {
  try {
    const { name, email, phone, password, status } = req.body;

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
    if (status && !["active", "inactive"].includes(status.toLowerCase())) {
      return res
        .status(400)
        .json({ message: "Status must be 'active' or 'inactive'" });
    }

    const connection = await pool.getConnection();
    try {
      const [existingUsers] = await connection.query(
        "SELECT id FROM user WHERE email = ?",
        [email]
      );

      if (existingUsers.length > 0) {
        return res.status(409).json({ message: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await connection.query(
        "INSERT INTO user (name, email, phone, password, status) VALUES (?, ?, ?, ?, ?)",
        [
          name,
          email,
          phone || null,
          hashedPassword,
          status ? status.toLowerCase() : "inactive",
        ]
      );

      const [newUser] = await connection.query(
        "SELECT id, name, email, phone, status, created_at FROM user WHERE id = ?",
        [result.insertId]
      );

      const formattedUser = {
        ...newUser[0],
        created_at: newUser[0].created_at
          ? new Date(newUser[0].created_at).toISOString()
          : null,
        status: newUser[0].status ? newUser[0].status.toLowerCase() : "inactive",
      };

      res.status(201).json({
        message: "User created successfully",
        user: formattedUser,
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({
      message: "Failed to create user",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

app.put("/api/users/:id", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, password, status } = req.body;

    if (!name || !email) {
      return res
        .status(400)
        .json({ message: "Name and email are required" });
    }
    if (status && !["active", "inactive"].includes(status.toLowerCase())) {
      return res
        .status(400)
        .json({ message: "Status must be 'active' or 'inactive'" });
    }

    const connection = await pool.getConnection();
    try {
      const [existing] = await connection.query(
        "SELECT id FROM user WHERE id = ?",
        [id]
      );

      if (existing.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const [emailConflict] = await connection.query(
        "SELECT id FROM user WHERE email = ? AND id != ?",
        [email, id]
      );

      if (emailConflict.length > 0) {
        return res
          .status(409)
          .json({ message: "Email already in use by another user" });
      }

      let hashedPassword = undefined;
      if (password && password.length >= 8) {
        hashedPassword = await bcrypt.hash(password, 10);
      } else if (password) {
        return res
          .status(400)
          .json({ message: "Password must be at least 8 characters" });
      }

      await connection.query(
        `UPDATE user SET 
          name = ?,
          email = ?,
          phone = ?,
          ${password ? "password = ?," : ""}
          status = ?
        WHERE id = ?`,
        [
          name,
          email,
          phone || null,
          ...(password ? [hashedPassword] : []),
          status ? status.toLowerCase() : "inactive",
          id,
        ]
      );

      const [updatedUser] = await connection.query(
        "SELECT id, name, email, phone, status, created_at FROM user WHERE id = ?",
        [id]
      );

      const formattedUser = {
        ...updatedUser[0],
        created_at: updatedUser[0].created_at
          ? new Date(updatedUser[0].created_at).toISOString()
          : null,
        status: updatedUser[0].status
          ? updatedUser[0].status.toLowerCase()
          : "inactive",
      };

      res.status(200).json({
        message: "User updated successfully",
        user: formattedUser,
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({
      message: "Failed to update user",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

app.delete("/api/users/:id", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    try {
      const [existing] = await connection.query(
        "SELECT id FROM user WHERE id = ?",
        [id]
      );

      if (existing.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      await connection.query("DELETE FROM user WHERE id = ?", [id]);

      res.status(200).json({ message: "User deleted successfully" });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      message: "Failed to delete user",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

app.patch("/api/users/:id/status", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !["active", "inactive"].includes(status.toLowerCase())) {
      return res
        .status(400)
        .json({ message: "Status must be 'active' or 'inactive'" });
    }

    const connection = await pool.getConnection();
    try {
      const [existing] = await connection.query(
        "SELECT id, status FROM user WHERE id = ?",
        [id]
      );

      if (existing.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      await connection.query("UPDATE user SET status = ? WHERE id = ?", [
        status.toLowerCase(),
        id,
      ]);

      const [updatedUser] = await connection.query(
        "SELECT id, name, email, phone, status, created_at FROM user WHERE id = ?",
        [id]
      );

      const formattedUser = {
        ...updatedUser[0],
        created_at: updatedUser[0].created_at
          ? new Date(updatedUser[0].created_at).toISOString()
          : null,
        status: updatedUser[0].status
          ? updatedUser[0].status.toLowerCase()
          : "inactive",
      };

      res.status(200).json({
        message: "User status updated successfully",
        user: formattedUser,
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Update user status error:", error);
    res.status(500).json({
      message: "Failed to update user status",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// COUPONS CRUD OPERATIONS

// Create a new coupon (admin-only)
app.post("/api/coupons", authenticateAdmin, async (req, res) => {
  try {
    const { code, discount, expiry_date, is_active } = req.body;

    if (!code || !discount) {
      return res
        .status(400)
        .json({ message: "Code and discount are required" });
    }

    const connection = await pool.getConnection();
    try {
      const [existing] = await connection.query(
        "SELECT id FROM coupons WHERE code = ?",
        [code]
      );

      if (existing.length > 0) {
        return res.status(409).json({ message: "Coupon code already exists" });
      }

      await connection.query(
        `INSERT INTO coupons (code, discount, expiry_date, is_active) VALUES (?, ?, ?, ?)`,
        [code, discount, expiry_date || null, is_active ? 1 : 0]
      );

      res.status(201).json({ message: "Coupon created successfully" });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Create coupon error:", error);
    res.status(500).json({
      message: "Failed to create coupon",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Get all coupons
app.get("/api/coupons", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    try {
      const [coupons] = await connection.query("SELECT * FROM coupons");

      res.status(200).json({
        message: "Coupons retrieved successfully",
        coupons,
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Get all coupons error:", error);
    res.status(500).json({
      message: "Failed to fetch coupons",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Get coupon by ID
app.get("/api/coupons/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    try {
      const [coupons] = await connection.query(
        "SELECT * FROM coupons WHERE id = ?",
        [id]
      );

      if (coupons.length === 0) {
        return res.status(404).json({ message: "Coupon not found" });
      }

      res.status(200).json({
        message: "Coupon retrieved successfully",
        coupon: coupons[0],
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Get coupon error:", error);
    res.status(500).json({
      message: "Failed to fetch coupon",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Update coupon (admin-only)
app.put("/api/coupons/:id", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { code, discount, expiry_date, is_active } = req.body;

    if (!code || !discount) {
      return res
        .status(400)
        .json({ message: "Code and discount are required" });
    }

    const connection = await pool.getConnection();
    try {
      const [existing] = await connection.query(
        "SELECT id FROM coupons WHERE id = ?",
        [id]
      );

      if (existing.length === 0) {
        return res.status(404).json({ message: "Coupon not found" });
      }

      const [codeConflict] = await connection.query(
        "SELECT id FROM coupons WHERE code = ? AND id != ?",
        [code, id]
      );

      if (codeConflict.length > 0) {
        return res
          .status(409)
          .json({ message: "Coupon code already in use by another coupon" });
      }

      await connection.query(
        `UPDATE coupons SET 
          code = ?,
          discount = ?,
          expiry_date = ?,
          is_active = ?
        WHERE id = ?`,
        [code, discount, expiry_date || null, is_active ? 1 : 0, id]
      );

      const [updatedCoupon] = await connection.query(
        "SELECT * FROM coupons WHERE id = ?",
        [id]
      );

      res.status(200).json({
        message: "Coupon updated successfully",
        coupon: updatedCoupon[0],
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Update coupon error:", error);
    res.status(500).json({
      message: "Failed to update coupon",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Delete coupon (admin-only)
app.delete("/api/coupons/:id", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    try {
      const [existing] = await connection.query(
        "SELECT id FROM coupons WHERE id = ?",
        [id]
      );

      if (existing.length === 0) {
        return res.status(404).json({ message: "Coupon not found" });
      }

      await connection.query("DELETE FROM coupons WHERE id = ?", [id]);

      res.status(200).json({ message: "Coupon deleted successfully" });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Delete coupon error:", error);
    res.status(500).json({
      message: "Failed to delete coupon",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

app.get("/api/coupons/code/:code", async (req, res) => {
  try {
    const { code } = req.params;

    const connection = await pool.getConnection();
    try {
      const [coupons] = await connection.query(
        `SELECT * FROM coupons 
         WHERE code = ? 
         AND is_active = TRUE 
         AND (valid_from IS NULL OR valid_from <= NOW())
         AND (valid_until IS NULL OR valid_until >= NOW())
         AND (max_uses IS NULL OR current_uses < max_uses)`,
        [code]
      );

      if (coupons.length === 0) {
        return res.status(404).json({ message: "Valid coupon not found" });
      }

      const formattedCoupon = {
        ...coupons[0],
        valid_from: coupons[0].valid_from
          ? new Date(coupons[0].valid_from).toISOString()
          : null,
        valid_until: coupons[0].valid_until
          ? new Date(coupons[0].valid_until).toISOString()
          : null,
        created_at: coupons[0].created_at
          ? new Date(coupons[0].created_at).toISOString()
          : null,
      };

      res.status(200).json({
        message: "Coupon retrieved successfully",
        coupon: formattedCoupon,
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Get coupon by code error:", error);
    res.status(500).json({
      message: "Failed to fetch coupon",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle uncaught exceptions and rejections
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});
