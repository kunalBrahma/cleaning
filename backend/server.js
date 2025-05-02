import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import { config } from "dotenv";
import morgan from "morgan";

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
  password: process.env.DB_PASSWORD || "tansegan",
  database: process.env.DB_NAME || "cleaning",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || "0e02fa4596bb2cfe82c864dfaf2ef5c863659b84dd7e1c985d34f8f54a8e6435783c958f858cabe99cabaf45ce3b56b50fe7afab1d3268381da0ddd12a402a9c";

// Test database connection on startup
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
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

// Auth endpoints
app.post("/auth/signup", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, phone no, and password are required" });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
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
      // FIX: Added the correct number of placeholders to match values
      const [result] = await connection.query(
        "INSERT INTO profile (name, email, phone, password) VALUES (?, ?, ?, ?)",
        [name, email, phone, hashedPassword]
      );

      const [users] = await connection.query(
        "SELECT id, name, email, phone, created_at FROM profile WHERE id = ?",
        [result.insertId]
      );

      const token = jwt.sign({ userId: result.insertId }, JWT_SECRET, { expiresIn: "1d" });

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
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const connection = await pool.getConnection();
    try {
      const [users] = await connection.query("SELECT * FROM profile WHERE email = ?", [email]);

      if (users.length === 0) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const user = users[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1d" });
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
        error: process.env.NODE_ENV === "development" ? error.message : undefined
      });
    }
  });


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});