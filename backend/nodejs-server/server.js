require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve uploaded images

// MongoDB Connection
const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/feedforward";
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ FeedForward DB connected"))
  .catch((err) => {
    console.error("❌ DB connection error:", err);
    process.exit(1);
  });

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// JWT Middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized - No token" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    req.userId = decoded.userId;
    next();
  });
};

// **User Schema & Model**
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

// **Waste Schema & Model**
const wasteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  foodItem: String,
  foodQuantity: Number,
  foodReason: String,
  foodWasteDate: { type: Date, default: Date.now },
  location: String,
  image: String, // 📸 Added field for image uploads
});

const WasteData = mongoose.model("WasteData", wasteSchema);

// **Inventory Schema & Model**
const inventorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  itemName: String,
  itemQuantity: Number,
  itemCost: Number,
  itemPurchaseDate: Date,
  itemExpiryDate: Date,
  consumed: Boolean,
});

const Inventory = mongoose.model("Inventory", inventorySchema);

// 📸 **Multer Setup for Image Uploads**
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./uploads";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// **User Registration**
app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.json({ message: "User registered successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Registration failed." });
  }
});

// **User Login**
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Login failed." });
  }
});

// **Log Food Waste (with Image Upload)**
app.post("/waste", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const { foodItem, foodQuantity, foodReason, foodWasteDate, location } = req.body;
    const imagePath = req.file ? req.file.filename : null;

    if (!foodItem || !foodQuantity || !foodReason || !foodWasteDate || !location) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newWaste = new WasteData({
      user: req.userId,
      foodItem,
      foodQuantity,
      foodReason,
      foodWasteDate,
      location,
      image: imagePath, // Save image path
    });

    await newWaste.save();
    res.json({ message: "Waste data recorded", data: newWaste });
  } catch (err) {
    res.status(500).json({ error: "Failed to save waste data" });
  }
});

// **Fetch Waste Data**
app.get("/waste", verifyToken, async (req, res) => {
  try {
    const wasteData = await WasteData.find({ user: req.userId });
    res.json(wasteData);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch waste data" });
  }
});

// **Delete Waste Item**
app.delete("/waste/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedWaste = await WasteData.findByIdAndDelete(id);

    if (!deletedWaste) {
      return res.status(404).json({ error: "Waste item not found" });
    }

    res.json({ message: `Waste item "${deletedWaste.foodItem}" deleted successfully!` });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete waste item" });
  }
});

// **Add Inventory Item**
app.post("/inventory", verifyToken, async (req, res) => {
  try {
    const { itemName, itemQuantity, itemCost, itemPurchaseDate, itemExpiryDate } = req.body;

    if (!itemName || !itemQuantity || !itemCost || !itemPurchaseDate || !itemExpiryDate) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newItem = new Inventory({
      user: req.userId,
      itemName,
      itemQuantity,
      itemCost,
      itemPurchaseDate,
      itemExpiryDate,
      consumed: false,
    });

    await newItem.save();
    res.status(201).json({ message: "Item added successfully", data: newItem });
  } catch (err) {
    res.status(500).json({ error: "Failed to add inventory item." });
  }
});

// **Fetch Inventory Items**
app.get("/inventory", verifyToken, async (req, res) => {
  try {
    const inventoryData = await Inventory.find({ user: req.userId });
    res.json(inventoryData);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch inventory data" });
  }
});

// Start the server
app.listen(port, () => console.log(`✅ Server running on port ${port}`));
