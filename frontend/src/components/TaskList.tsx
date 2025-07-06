'use client';

import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Alert,
  CircularProgress,
  Grid2 as Grid,
  Paper,
} from '@mui/material';
import { Add, FilterList } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../lib/hooks';
import {
  fetchTasks,
  setFilters,
  setPage,
  updateTask,
  Task,
  TaskFilters,
} from '../lib/features/tasks/taskSlice';
import TaskCard from './TaskCard';

interface TaskListProps {
  onCreateTask?: () => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (taskId: string) => void;
}

export default function TaskList({ onCreateTask, onEditTask, onDeleteTask }: TaskListProps) {
  const dispatch = useAppDispatch();
  const { tasks, loading, error, total, page, limit, filters } = useAppSelector((state) => state.tasks);
  // const { user } = useAppSelector((state) => state.auth);

  const [localFilters, setLocalFilters] = useState<TaskFilters>(filters);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchTasks({ page, limit, filters }));
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

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    dispatch(setPage(newPage));
  };

  const handleStatusChange = async (taskId: string, newStatus: Task['status']) => {
    try {
      await dispatch(updateTask({ id: taskId, updates: { status: newStatus } })).unwrap();
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Tasks
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filters
          </Button>
          {onCreateTask && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={onCreateTask}
            >
              New Task
            </Button>
          )}
        </Box>
      </Box>

      {/* Filters */}
      {showFilters && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Filter Tasks
          </Typography>
          <Grid container spacing={2}>
            <Grid xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={localFilters.status || ''}
                  label="Status"
                  onChange={(e) =>
                    setLocalFilters({ ...localFilters, status: e.target.value || undefined })
                  }
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="TODO">To Do</MenuItem>
                  <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                  <MenuItem value="REVIEW">Review</MenuItem>
                  <MenuItem value="DONE">Done</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={localFilters.priority || ''}
                  label="Priority"
                  onChange={(e) =>
                    setLocalFilters({ ...localFilters, priority: e.target.value || undefined })
                  }
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="LOW">Low</MenuItem>
                  <MenuItem value="MEDIUM">Medium</MenuItem>
                  <MenuItem value="HIGH">High</MenuItem>
                  <MenuItem value="URGENT">Urgent</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Assigned To ID"
                value={localFilters.assignedToId || ''}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, assignedToId: e.target.value || undefined })
                }
                placeholder="Enter user ID"
              />
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Project ID"
                value={localFilters.projectId || ''}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, projectId: e.target.value || undefined })
                }
                placeholder="Enter project ID"
              />
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
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Loading */}
      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {/* Task List */}
      {!loading && (
        <>
          {tasks.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No tasks found
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                {Object.keys(filters).length > 0
                  ? 'Try adjusting your filters or create a new task.'
                  : 'Get started by creating your first task.'}
              </Typography>
              {onCreateTask && (
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={onCreateTask}
                  sx={{ mt: 2 }}
                >
                  Create Task
                </Button>
              )}
            </Paper>
          ) : (
            <>
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                  onStatusChange={handleStatusChange}
                />
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <Box display="flex" justifyContent="center" mt={4}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                  />
                </Box>
              )}
            </>
          )}
        </>
      )}
    </Box>
  );
}