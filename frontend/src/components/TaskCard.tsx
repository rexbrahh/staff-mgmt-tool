'use client';

import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Delete,
  Person,
  CalendarToday,
  Assignment,
} from '@mui/icons-material';
import { useState } from 'react';
import { Task } from '../lib/features/tasks/taskSlice';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onStatusChange?: (taskId: string, newStatus: Task['status']) => void;
}

const statusColors = {
  TODO: 'default',
  IN_PROGRESS: 'info',
  REVIEW: 'warning',
  DONE: 'success',
} as const;

const priorityColors = {
  LOW: 'default',
  MEDIUM: 'primary',
  HIGH: 'warning',
  URGENT: 'error',
} as const;

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit?.(task);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete?.(task.id);
    handleMenuClose();
  };

  const handleStatusChange = (newStatus: Task['status']) => {
    onStatusChange?.(task.id, newStatus);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'DONE';

  return (
    <Card sx={{ 
      mb: 2, 
      border: isOverdue ? '2px solid' : '1px solid',
      borderColor: isOverdue ? 'error.main' : 'divider',
    }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Typography variant="h6" component="h3" sx={{ flexGrow: 1 }}>
            {task.title}
          </Typography>
          <IconButton size="small" onClick={handleMenuClick}>
            <MoreVert />
          </IconButton>
        </Box>

        {task.description && (
          <Typography variant="body2" color="text.secondary" mb={2}>
            {task.description}
          </Typography>
        )}

        <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
          <Chip
            label={task.status.replace('_', ' ')}
            color={statusColors[task.status]}
            size="small"
          />
          <Chip
            label={task.priority}
            color={priorityColors[task.priority]}
            size="small"
            variant="outlined"
          />
        </Box>

        <Box display="flex" flexDirection="column" gap={1}>
          {task.assignedTo && (
            <Box display="flex" alignItems="center" gap={1}>
              <Person fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {task.assignedTo.firstName} {task.assignedTo.lastName}
              </Typography>
            </Box>
          )}

          {task.dueDate && (
            <Box display="flex" alignItems="center" gap={1}>
              <CalendarToday fontSize="small" color={isOverdue ? 'error' : 'action'} />
              <Typography 
                variant="body2" 
                color={isOverdue ? 'error' : 'text.secondary'}
                fontWeight={isOverdue ? 'bold' : 'normal'}
              >
                Due: {formatDate(task.dueDate)}
                {isOverdue && ' (Overdue)'}
              </Typography>
            </Box>
          )}

          {task.project && (
            <Box display="flex" alignItems="center" gap={1}>
              <Assignment fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {task.project.name}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>

      <CardActions>
        <Box display="flex" gap={1} flexWrap="wrap">
          {task.status !== 'DONE' && (
            <>
              {task.status === 'TODO' && (
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleStatusChange('IN_PROGRESS')}
                >
                  Start
                </Button>
              )}
              {task.status === 'IN_PROGRESS' && (
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleStatusChange('REVIEW')}
                >
                  Submit for Review
                </Button>
              )}
              {task.status === 'REVIEW' && (
                <Button
                  size="small"
                  variant="outlined"
                  color="success"
                  onClick={() => handleStatusChange('DONE')}
                >
                  Mark Done
                </Button>
              )}
            </>
          )}
          {task.status === 'DONE' && (
            <Chip label="Completed" color="success" size="small" />
          )}
        </Box>
      </CardActions>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleEdit}>
          <Edit fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
    </Card>
  );
}