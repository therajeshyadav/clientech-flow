import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

// Async thunks
export const fetchLeads = createAsyncThunk(
  "leads/fetchLeads",
  async (
    {
      customerId,
      status,
      page = 1,
      limit = 5,
    }: { customerId: string; status: string; page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get("/leads", {
        params: { customerId, status, page, limit },
      });
      return response.data; // backend se { leads, pagination } aayega
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.msg || "Failed to fetch leads"
      );
    }
  }
);

export const createLead = createAsyncThunk(
  "leads/createLead",
  async (
    leadData: {
      title: string;
      description: string;
      status: string;
      value: number;
      customerId: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/leads", leadData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create lead"
      );
    }
  }
);

export const updateLead = createAsyncThunk(
  "leads/updateLead",
  async (
    leadData: {
      id: string;
      title: string;
      description: string;
      status: string;
      value: number;
      customerId: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const { id, ...updateData } = leadData;
      const response = await api.put(`/leads/${id}`, updateData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update lead"
      );
    }
  }
);

export const deleteLead = createAsyncThunk(
  "leads/deleteLead",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/leads/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete lead"
      );
    }
  }
);

export const fetchLeadsStats = createAsyncThunk(
  "leads/fetchLeadsStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/leads/stats");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch leads stats"
      );
    }
  }
);

const initialState = {
  leads: [],
  isLoading: false,
  error: null,
  statusFilter: "all",
  stats: {
    statusDistribution: [],
    valueDistribution: [],
  },
  pagination: {
    totalLeads: 0,
    totalPages: 0,
    currentPage: 1,
  },
};

const leadSlice = createSlice({
  name: "leads",
  initialState,
  reducers: {
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch leads
      .addCase(fetchLeads.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        console.log("Fetched leads:", action.payload.leads);
        state.isLoading = false;
        state.leads = action.payload.leads;
        state.pagination = action.payload.pagination;
      })

      .addCase(fetchLeads.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create lead
      .addCase(createLead.fulfilled, (state, action) => {
        state.leads.unshift(action.payload);
      })
      // Update lead
      .addCase(updateLead.fulfilled, (state, action) => {
        const index = state.leads.findIndex(
          (l) => l._id === action.payload._id
        );
        if (index !== -1) {
          state.leads[index] = action.payload;
        }
      })
      // Delete lead
      .addCase(deleteLead.fulfilled, (state, action) => {
        state.leads = state.leads.filter((l) => l._id !== action.payload);
      })
      // Fetch stats
      .addCase(fetchLeadsStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export const { setStatusFilter, clearError } = leadSlice.actions;
export default leadSlice.reducer;
