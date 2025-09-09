import Lead from "../models/Lead.js";
import mongoose from "mongoose";
export const createLead = async (req, res) => {
  try {
    const lead = await Lead.create(req.body);
    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};



export const getLeads = async (req, res) => {
  try {
    const { customerId, status, page = 1, limit = 10 } = req.query;

    const query = {};
    if (customerId) query.customerId = new mongoose.Types.ObjectId(customerId); // <-- fixed
    if (status && status !== "all") query.status = status;

    const skip = (page - 1) * limit;

    const [leads, totalLeads] = await Promise.all([
      Lead.find(query)
        .sort({ createdAt: -1 })
        .skip(parseInt(skip))
        .limit(parseInt(limit)),
      Lead.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalLeads / limit);

    console.log("Fetching leads with query:", query, "Found:", leads.length);

    res.json({
      leads,
      pagination: {
        totalLeads,
        totalPages,
        currentPage: parseInt(page),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
};


export const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(lead);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteLead = async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ msg: "Lead deleted" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getLeadStats = async (req, res) => {
  try {
    // Group by status for count
    const statusDistribution = await Lead.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $project: { status: "$_id", count: 1, _id: 0 } },
    ]);

    // Group by status for total value
    const valueDistribution = await Lead.aggregate([
      { $group: { _id: "$status", totalValue: { $sum: "$value" } } },
      { $project: { status: "$_id", totalValue: 1, _id: 0 } },
    ]);

    res.json({ statusDistribution, valueDistribution });
  } catch (error) {
    console.error("Error in getLeadStats:", error.message);
    res.status(500).json({ msg: error.message });
  }
};

