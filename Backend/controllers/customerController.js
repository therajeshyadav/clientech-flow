import Customer from "../models/Customer.js";
import Lead from "../models/Lead.js";

export const createCustomer = async (req, res) => {
  try {
    const customer = await Customer.create({
      ...req.body,
      ownerId: req.user.id,
    });
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getCustomers = async (req, res) => {
  try {
    const { page = 1, limit = 5, search = "" } = req.query;

    const query = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };

    const total = await Customer.countDocuments(query);

    const customers = await Customer.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      customers,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalCustomers: total,
      },
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ msg: "Customer not found" });

    const leads = await Lead.find({ customerId: customer._id });
    res.json({ customer, leads });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ msg: "Customer deleted" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
