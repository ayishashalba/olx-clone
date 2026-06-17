const express = require("express");
const Product = require("../models/Product");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

// Add Product / Post Ad
router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    if (
  req.user.role !== "seller" &&
  req.user.role !== "admin"
) {
  return res.status(403).json({
    message: "Only sellers or admins can post ads",
  });
}
    const { title, description, price, category, location } = req.body;

    const existingProduct=await Product.findOne({
      title:title.trim(),
      seller:req.user._id
    });
    if(existingProduct){
      return res.json({
         message:"already added",
      });
    }

    const product = await Product.create({
      title,
      description,
      price,
      category,
      location,
      image: req.file.filename,
      seller: req.user._id,
    });

    res.status(201).json({
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get All Products
// Get All Products with Search, Filter, Sort
router.get("/", async (req, res) => {
  try {
    const { search, category, location, sort } = req.query;

    let query = {};

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    let products = Product.find(query).populate("seller", "name email");

    if (sort === "low") {
      products = products.sort({ price: 1 });
    } else if (sort === "high") {
      products = products.sort({ price: -1 });
    } else {
      products = products.sort({ createdAt: -1 });
    }

    const result = await products;

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Admin: Get All Listings
router.get("/admin/listings", protect, adminOnly, async (req, res) => {
  try {
    const products = await Product.find()
      .populate("seller", "name email role")
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get My Listings
router.get("/my/listings", protect, async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Single Product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "seller",
      "name email"
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Delete Product
router.delete("/:id", protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (
      product.seller.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Not allowed to delete this product",
      });
    }

    await product.deleteOne();

    res.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});



// Update Product
router.put("/:id", protect, upload.single("image"), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (
      product.seller.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Not allowed to update this product",
      });
    }

    product.title = req.body.title || product.title;
    product.description = req.body.description || product.description;
    product.price = req.body.price || product.price;
    product.category = req.body.category || product.category;
    product.location = req.body.location || product.location;

    if (req.file) {
      product.image = req.file.filename;
    }

    const updatedProduct = await product.save();

    res.json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Mark Product Sold / Active
router.patch("/:id/status", protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (
      product.seller.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    product.status = product.status === "active" ? "sold" : "active";

    await product.save();

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;