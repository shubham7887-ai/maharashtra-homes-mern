import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, default: "", maxlength: 3000 },
  purpose: { type: String, enum: ["rent", "buy"], required: true },
  propertyType: { type: String, enum: ["Apartment", "Villa", "Independent house", "Plot", "Commercial"], default: "Apartment" },
  price: { type: Number, required: true, min: 1 },
  city: { type: String, required: true, trim: true },
  locality: { type: String, required: true, trim: true },
  bedrooms: { type: Number, default: 1, min: 0, max: 30 },
  bathrooms: { type: Number, default: 1, min: 0, max: 30 },
  areaSqFt: { type: Number, default: 0, min: 0 },
  imageUrl: { type: String, default: "" },
  amenities: [{ type: String, maxlength: 40 }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["available", "pending", "sold", "rented"], default: "available" }
}, { timestamps: true });

propertySchema.index({ title: "text", city: "text", locality: "text", description: "text" });
export default mongoose.model("Property", propertySchema);
