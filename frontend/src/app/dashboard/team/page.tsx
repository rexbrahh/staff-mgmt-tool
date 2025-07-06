'use client';

import { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  CircularProgress,
  Grid,
  Paper,
  Chip,
} from '@mui/material';
import { Add, FilterList } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../lib/hooks';
import {
  fetchTeamMembers,
  fetchTeamStats,
  setFilters,
  updateTeamMember,
  deleteTeamMember,
  TeamMember,
  TeamFilters,
} from '../../../lib/features/team/teamSlice';
import TeamMemberCard from '../../../components/TeamMemberCard';

export default function TeamPage() {
  const dispatch = useAppDispatch();
  const { members, stats, loading, error, total, page, limit, filters } = useAppSelector((state) => state.team);

  const [localFilters, setLocalFilters] = useState<TeamFilters>(filters);
  const [showFilters, setShowFilters] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchTeamMembers({ page, limit, filters }));
    dispatch(fetchTeamStats());
  }, [dispatch, page, limit, filters]);

  const handleFilterSubmit = () => {
    dispatch(setFilters(localFilters));
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    const emptyFilters = {};
    setLocalFilters(emptyFilters);
    dispatch(setFilters(emptyFilters));
  };

  const handleEditMember = (member: TeamMember) => {
    // TODO: Open edit modal/form
    console.log('Edit member:', member);
  };

  const handleDeleteMember = async (memberId: string) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      try {
        await dispatch(deleteTeamMember(memberId)).unwrap();
        setDeleteError(null);
      } catch {
        setDeleteError('Failed to delete team member');
      }
    }
  };

  const handleToggleActive = async (memberId: string, isActive: boolean) => {
    try {
      await dispatch(updateTeamMember({ 
        id: memberId, 
        updates: { isActive } 
      })).unwrap();
    } catch (error) {
      console.error('Failed to update member status:', error);
    }
  };

  const handleCreateMember = () => {
    // TODO: Open create modal/form
    console.log('Create new team member');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Team Management
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filters
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreateMember}
          >
            Add Member
          </Button>
        </Box>
      </Box>

      {/* Team Statistics */}
      {stats && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Team Overview
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Box textAlign="center">
                <Typography variant="h4" color="primary">
                  {stats.totalMembers}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Members
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box textAlign="center">
                <Typography variant="h4" color="success.main">
                  {stats.activeMembers}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Members
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box textAlign="center">
                <Typography variant="h4" color="warning.main">
                  {stats.departmentBreakdown.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Departments
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box display="flex" flexWrap="wrap" gap={0.5} justifyContent="center">
                {stats.roleBreakdown.map((role) => (
                  <Chip
                    key={role.role}
                    label={`${role.role}: ${role.count}`}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Filters */}
      {showFilters && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Filter Team Members
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Search"
                value={localFilters.search || ''}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, search: e.target.value || undefined })
                }
                placeholder="Name or email..."
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={localFilters.role || ''}
                  label="Role"
                  onChange={(e) =>
                    setLocalFilters({ ...localFilters, role: e.target.value || undefined })
                  }
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="ADMIN">Admin</MenuItem>
                  <MenuItem value="MANAGER">Manager</MenuItem>
                  <MenuItem value="EMPLOYEE">Employee</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Department"
                value={localFilters.department || ''}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, department: e.target.value || undefined })
                }
                placeholder="Department name..."
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={localFilters.isActive !== undefined ? localFilters.isActive.toString() : ''}
                  label="Status"
                  onChange={(e) => {
                    const value = e.target.value;
                    setLocalFilters({ 
                      ...localFilters, 
                      isActive: value === '' ? undefined : value === 'true'
                    });
                  }}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="true">Active</MenuItem>
                  <MenuItem value="false">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Box display="flex" gap={2} mt={2}>
            <Button variant="contained" onClick={handleFilterSubmit}>
              Apply Filters
            </Button>
            <Button variant="outlined" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          </Box>
        </Paper>
      )}

      {/* Error Alert */}
      {(error || deleteError) && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setDeleteError(null)}>
          {error || deleteError}
        </Alert>
      )}

      {/* Loading */}
      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {/* Team Members List */}
      {!loading && (
        <>
          {members.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No team members found
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                {Object.keys(filters).length > 0
                  ? 'Try adjusting your filters or add a new team member.'
                  : 'Get started by adding your first team member.'}
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleCreateMember}
                sx={{ mt: 2 }}
              >
                Add Team Member
              </Button>
            </Paper>
          ) : (
            <>
              <Typography variant="h6" gutterBottom>
                Team Members ({total})
              </Typography>
              
              {members.map((member) => (
                <TeamMemberCard
                  key={member.id}
                  member={member}
                  onEdit={handleEditMember}
                  onDelete={handleDeleteMember}
                  onToggleActive={handleToggleActive}
                />
              ))}
            </>
          )}
        </>
      )}
    </Container>
  );
}