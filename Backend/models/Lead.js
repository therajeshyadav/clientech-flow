import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    title: { type: String, required: true },
    description: String,
    status: { type: String, enum: ["New", "Contacted", "Converted", "Lost"], default: "New" },
    value: Number,
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Lead", leadSchema);
