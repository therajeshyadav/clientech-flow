import Customer from "../models/Customer.js";
import Lead from "../models/Lead.js";
import mongoose from "mongoose";

export const createLead = async (req, res) => {
  try {
    const { customerId, ...leadData } = req.body;

    // Check customer belongs to logged in user
    const customer = await Customer.findOne({
      _id: customerId,
      ownerId: req.user.id,
    });

    if (!customer) {
      return res
        .status(403)
        .json({ msg: "Not authorized to add lead for this customer" });
    }

    const lead = await Lead.create({
      ...leadData,
      customerId,
    });

    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getLeads = async (req, res) => {
  try {
    const { customerId, status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Ensure this customer belongs to logged in user
    if (customerId) {
      const customer = await Customer.findOne({
        _id: customerId,
        ownerId: req.user.id,
      });
      if (!customer) {
        return res
          .status(403)
          .json({ msg: "Not authorized to view leads for this customer" });
      }
    }

    const query = {};
    if (customerId) query.customerId = new mongoose.Types.ObjectId(customerId);
    if (status && status !== "all") query.status = status;

    const [leads, totalLeads] = await Promise.all([
      Lead.find(query)
        .sort({ createdAt: -1 })
        .skip(parseInt(skip))
        .limit(parseInt(limit)),
      Lead.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalLeads / limit);

    res.json({
      leads,
      pagination: {
        totalLeads,
        totalPages,
        currentPage: parseInt(page),
      },
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).populate("customerId");

    if (!lead) return res.status(404).json({ msg: "Lead not found" });
    if (lead.customerId.ownerId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ msg: "Not authorized to update this lead" });
    }

    Object.assign(lead, req.body);
    await lead.save();

    res.json(lead);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).populate("customerId");

    if (!lead) return res.status(404).json({ msg: "Lead not found" });
    if (lead.customerId.ownerId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ msg: "Not authorized to delete this lead" });
    }

    await lead.deleteOne();
    res.json({ msg: "Lead deleted" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getLeadStats = async (req, res) => {
  try {
    // Group by status for count
    const statusDistribution = await Lead.aggregate([
      {
        $lookup: {
          from: "customers", // Customer collection
          localField: "customerId",
          foreignField: "_id",
          as: "customer",
        },
      },
      { $unwind: "$customer" }, // Flatten the array
      {
        $match: {
          "customer.ownerId": new mongoose.Types.ObjectId(req.user.id),
        },
      },
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $project: { status: "$_id", count: 1, _id: 0 } },
    ]);

    const valueDistribution = await Lead.aggregate([
      {
        $lookup: {
          from: "customers",
          localField: "customerId",
          foreignField: "_id",
          as: "customer",
        },
      },
      { $unwind: "$customer" },
      {
        $match: {
          "customer.ownerId": new mongoose.Types.ObjectId(req.user.id),
        },
      },
      { $group: { _id: "$status", totalValue: { $sum: "$value" } } },
      { $project: { status: "$_id", totalValue: 1, _id: 0 } },
    ]);

    res.json({ statusDistribution, valueDistribution });
  } catch (error) {
    console.error("Error in getLeadStats:", error.message);
    res.status(500).json({ msg: error.message });
  }
};
