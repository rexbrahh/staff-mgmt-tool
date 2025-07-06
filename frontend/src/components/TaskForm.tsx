'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../lib/hooks';
import { createTask, updateTask, Task } from '../lib/features/tasks/taskSlice';

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  task?: Task | null; // If provided, we're editing
}

interface TaskFormData {
  title: string;
  description: string;
  status: Task['status'];
  priority: Task['priority'];
  dueDate: Date | null;
  projectId: string;
  assignedToId: string;
}

const initialFormData: TaskFormData = {
  title: '',
  description: '',
  status: 'TODO',
  priority: 'MEDIUM',
  dueDate: null,
  projectId: '',
  assignedToId: '',
};

export default function TaskForm({ open, onClose, task }: TaskFormProps) {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.tasks);
  // const { user } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState<TaskFormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<Partial<TaskFormData>>({});

  const isEditing = Boolean(task);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? new Date(task.dueDate) : null,
        projectId: task.projectId || '',
        assignedToId: task.assignedToId || '',
      });
    } else {
      setFormData(initialFormData);
    }
    setFormErrors({});
  }, [task, open]);

  const validateForm = (): boolean => {
    const errors: Partial<TaskFormData> = {};

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const taskData = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      status: formData.status,
      priority: formData.priority,
      dueDate: formData.dueDate?.toISOString() || undefined,
      projectId: formData.projectId || undefined,
      assignedToId: formData.assignedToId || undefined,
    };

    try {
      if (isEditing && task) {
        await dispatch(updateTask({ id: task.id, updates: taskData })).unwrap();
      } else {
        await dispatch(createTask(taskData)).unwrap();
      }
      onClose();
    } catch (error) {
      // Error handling is done in the slice
      console.error('Form submission failed:', error);
    }
  };

  const handleChange = (field: keyof TaskFormData) => (event: React.ChangeEvent<HTMLInputElement> | Date | null) => {
    const value = event && typeof event === 'object' && 'target' in event ? event.target.value : event;
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {isEditing ? 'Edit Task' : 'Create New Task'}
          </DialogTitle>

          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box display="flex" flexDirection="column" gap={2} mt={1}>
              <TextField
                fullWidth
                label="Title"
                value={formData.title}
                onChange={handleChange('title')}
                error={Boolean(formErrors.title)}
                helperText={formErrors.title}
                required
              />

              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={handleChange('description')}
                multiline
                rows={3}
              />

              <Box display="flex" gap={2}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    label="Status"
                    onChange={handleChange('status')}
                  >
                    <MenuItem value="TODO">To Do</MenuItem>
                    <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                    <MenuItem value="REVIEW">Review</MenuItem>
                    <MenuItem value="DONE">Done</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={formData.priority}
                    label="Priority"
                    onChange={handleChange('priority')}
                  >
                    <MenuItem value="LOW">Low</MenuItem>
                    <MenuItem value="MEDIUM">Medium</MenuItem>
                    <MenuItem value="HIGH">High</MenuItem>
                    <MenuItem value="URGENT">Urgent</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <DatePicker
                label="Due Date"
                value={formData.dueDate}
                onChange={handleChange('dueDate')}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />

              <TextField
                fullWidth
                label="Project ID"
                value={formData.projectId}
                onChange={handleChange('projectId')}
                placeholder="Optional: Enter project ID"
              />

              <TextField
                fullWidth
                label="Assigned To (User ID)"
                value={formData.assignedToId}
                onChange={handleChange('assignedToId')}
                placeholder="Optional: Enter user ID"
              />
            </Box>
          </DialogContent>

          <DialogActions>
            <Button onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={loading}
            >
              {loading ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </LocalizationProvider>
  );
}