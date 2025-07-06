'use client';

import { useState } from 'react';
import { Container, Alert } from '@mui/material';
import { useAppDispatch } from '../../../lib/hooks';
import { deleteTask, Task } from '../../../lib/features/tasks/taskSlice';
import TaskList from '../../../components/TaskList';
import TaskForm from '../../../components/TaskForm';

export default function TasksPage() {
  const dispatch = useAppDispatch();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleCreateTask = () => {
    setEditingTask(null);
    setShowTaskForm(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await dispatch(deleteTask(taskId)).unwrap();
        setDeleteError(null);
      } catch {
        setDeleteError('Failed to delete task');
      }
    }
  };

  const handleCloseForm = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {deleteError && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          onClose={() => setDeleteError(null)}
        >
          {deleteError}
        </Alert>
      )}
      
      <TaskList
        onCreateTask={handleCreateTask}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
      />

      <TaskForm
        open={showTaskForm}
        onClose={handleCloseForm}
        task={editingTask}
      />
    </Container>
  );
}