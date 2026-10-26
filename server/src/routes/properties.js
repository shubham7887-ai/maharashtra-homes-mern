import { Router } from "express";
import mongoose from "mongoose";
import Property from "../models/Property.js";
import requireAuth from "../middleware/auth.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const { purpose, city, search, propertyType, minPrice, maxPrice, bedrooms } = req.query;
    const filter = { status: "available" };
    if (["rent", "buy"].includes(purpose)) filter.purpose = purpose;
    if (city) filter.city = new RegExp(String(city).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    if (propertyType) filter.propertyType = propertyType;
    if (bedrooms) filter.bedrooms = { $gte: Number(bedrooms) };
    if (minPrice || maxPrice) filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
    if (search) filter.$or = ["title", "city", "locality", "description"].map(k => ({ [k]: new RegExp(String(search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i") }));
    const properties = await Property.find(filter).populate("owner", "name").sort({ createdAt: -1 }).limit(100);
    res.json({ properties });
  } catch (err) { next(err); }
});

router.get("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid property ID." });
    const property = await Property.findById(req.params.id).populate("owner", "name");
    if (!property) return res.status(404).json({ message: "Property not found." });
    res.json({ property });
  } catch (err) { next(err); }
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const { title, purpose, price, city, locality } = req.body;
    if (!title?.trim() || !["rent", "buy"].includes(purpose) || !Number.isFinite(Number(price)) || Number(price) <= 0 || !city?.trim() || !locality?.trim())
      return res.status(400).json({ message: "Title, purpose, positive price, city and locality are required." });
    const property = await Property.create({ ...req.body, owner: req.user.id, price: Number(price) });
    res.status(201).json({ property });
  } catch (err) { next(err); }
});

router.put("/:id", requireAuth, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid property ID." });
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found." });
    if (String(property.owner) !== req.user.id) return res.status(403).json({ message: "You can only edit your own listings." });
    const allowed = ["title", "description", "purpose", "propertyType", "price", "city", "locality", "bedrooms", "bathrooms", "areaSqFt", "imageUrl", "amenities", "status"];
    allowed.forEach(key => { if (req.body[key] !== undefined) property[key] = req.body[key]; });
    await property.save();
    res.json({ property });
  } catch (err) { next(err); }
});

router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid property ID." });
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found." });
    if (String(property.owner) !== req.user.id) return res.status(403).json({ message: "You can only delete your own listings." });
    await property.deleteOne();
    res.json({ message: "Listing deleted." });
  } catch (err) { next(err); }
});
export default router;
