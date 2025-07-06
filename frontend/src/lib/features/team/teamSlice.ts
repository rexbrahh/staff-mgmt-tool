import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

// Types
export interface TeamMember {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  staffProfile?: StaffProfile;
  assignedTasks?: Array<Record<string, unknown>>;
  createdTasks?: Array<Record<string, unknown>>;
}

export interface StaffProfile {
  id: string;
  userId: string;
  department?: string;
  position?: string;
  phoneNumber?: string;
  address?: string;
  hireDate?: string;
  salary?: number;
  skills: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TeamFilters {
  role?: string;
  department?: string;
  search?: string;
  isActive?: boolean;
}

export interface TeamStats {
  totalMembers: number;
  activeMembers: number;
  inactiveMembers: number;
  departmentBreakdown: Array<{ department: string; count: number }>;
  roleBreakdown: Array<{ role: string; count: number }>;
}

export interface CreateTeamMemberData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
  staffProfile?: {
    department?: string;
    position?: string;
    phoneNumber?: string;
    address?: string;
    hireDate?: string;
    salary?: number;
    skills?: string[];
  };
}

export interface UpdateTeamMemberData {
  firstName?: string;
  lastName?: string;
  role?: 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
  isActive?: boolean;
  staffProfile?: {
    department?: string;
    position?: string;
    phoneNumber?: string;
    address?: string;
    hireDate?: string;
    salary?: number;
    skills?: string[];
  };
}

interface TeamState {
  members: TeamMember[];
  stats: TeamStats | null;
  loading: boolean;
  error: string | null;
  page: number;
  limit: number;
  total: number;
  filters: TeamFilters;
}

const initialState: TeamState = {
  members: [],
  stats: null,
  loading: false,
  error: null,
  page: 1,
  limit: 10,
  total: 0,
  filters: {},
};

// Helper function to get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Async thunks
export const fetchTeamMembers = createAsyncThunk(
  'team/fetchTeamMembers',
  async (params: { page?: number; limit?: number; filters?: TeamFilters } = {}) => {
    const { page = 1, limit = 10, filters = {} } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== undefined && value !== '')),
    });

    const response = await axios.get(`${API_BASE_URL}/api/team?${queryParams}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  }
);

export const fetchTeamMemberById = createAsyncThunk(
  'team/fetchTeamMemberById',
  async (id: string) => {
    const response = await axios.get(`${API_BASE_URL}/api/team/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  }
);

export const createTeamMember = createAsyncThunk(
  'team/createTeamMember',
  async (memberData: CreateTeamMemberData) => {
    const response = await axios.post(`${API_BASE_URL}/api/team`, memberData, {
      headers: getAuthHeader(),
    });
    return response.data;
  }
);

export const updateTeamMember = createAsyncThunk(
  'team/updateTeamMember',
  async ({ id, updates }: { id: string; updates: UpdateTeamMemberData }) => {
    const response = await axios.put(`${API_BASE_URL}/api/team/${id}`, updates, {
      headers: getAuthHeader(),
    });
    return response.data;
  }
);

export const deleteTeamMember = createAsyncThunk(
  'team/deleteTeamMember',
  async (id: string) => {
    await axios.delete(`${API_BASE_URL}/api/team/${id}`, {
      headers: getAuthHeader(),
    });
    return id;
  }
);

export const fetchTeamStats = createAsyncThunk(
  'team/fetchTeamStats',
  async () => {
    const response = await axios.get(`${API_BASE_URL}/api/team/stats`, {
      headers: getAuthHeader(),
    });
    return response.data;
  }
);

export const fetchTeamMembersByDepartment = createAsyncThunk(
  'team/fetchTeamMembersByDepartment',
  async (department: string) => {
    const response = await axios.get(`${API_BASE_URL}/api/team/department/${department}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  }
);

// Slice
const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    },
    setFilters: (state, action: PayloadAction<TeamFilters>) => {
      state.filters = action.payload;
      state.page = 1; // Reset to first page when filters change
    },
    clearError: (state) => {
      state.error = null;
    },
    clearStats: (state) => {
      state.stats = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch team members
      .addCase(fetchTeamMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeamMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.members = action.payload.data;
        state.total = action.payload.pagination.total;
        state.page = action.payload.pagination.page;
        state.limit = action.payload.pagination.limit;
      })
      .addCase(fetchTeamMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch team members';
      })

      // Fetch team member by ID
      .addCase(fetchTeamMemberById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeamMemberById.fulfilled, (state, action) => {
        state.loading = false;
        // Update the member in the list if it exists
        const index = state.members.findIndex(member => member.id === action.payload.data.id);
        if (index !== -1) {
          state.members[index] = action.payload.data;
        }
      })
      .addCase(fetchTeamMemberById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch team member';
      })

      // Create team member
      .addCase(createTeamMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTeamMember.fulfilled, (state, action) => {
        state.loading = false;
        state.members.unshift(action.payload.data);
        state.total += 1;
      })
      .addCase(createTeamMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create team member';
      })

      // Update team member
      .addCase(updateTeamMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTeamMember.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.members.findIndex(member => member.id === action.payload.data.id);
        if (index !== -1) {
          state.members[index] = action.payload.data;
        }
      })
      .addCase(updateTeamMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update team member';
      })

      // Delete team member
      .addCase(deleteTeamMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTeamMember.fulfilled, (state, action) => {
        state.loading = false;
        state.members = state.members.filter(member => member.id !== action.payload);
        state.total -= 1;
      })
      .addCase(deleteTeamMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete team member';
      })

      // Fetch team stats
      .addCase(fetchTeamStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeamStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.data;
      })
      .addCase(fetchTeamStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch team statistics';
      })

      // Fetch team members by department
      .addCase(fetchTeamMembersByDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeamMembersByDepartment.fulfilled, (state) => {
        state.loading = false;
        // This doesn't update the main members list, just returns data for specific use cases
      })
      .addCase(fetchTeamMembersByDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch team members by department';
      });
  },
});

export const { setPage, setLimit, setFilters, clearError, clearStats } = teamSlice.actions;
export default teamSlice.reducer;