import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from './store';
import { logout } from './store/slices/authSlice';

// Import page components
import Dashboard from './components/pages/Dashboard';
import Team from './components/pages/Team';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

const drawerWidth = 240;

// Placeholder components for routes not yet implemented
const Tasks = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4">Tasks</Typography>
    <Typography variant="body1">View and manage tasks</Typography>
  </Box>
);

const Profile = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4">Profile</Typography>
    <Typography variant="body1">Your profile settings</Typography>
  </Box>
);

const Settings = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4">Settings</Typography>
    <Typography variant="body1">Application settings</Typography>
  </Box>
);

const App: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Team', icon: <PeopleIcon />, path: '/team' },
    { text: 'Tasks', icon: <AssignmentIcon />, path: '/tasks' },
    { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  const drawer = (
    <Box>
      <Toolbar />
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            component={Link} 
            to={item.path}
            onClick={() => isMobile && handleDrawerToggle()}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        <Divider />
        <ListItem button onClick={handleLogout}>
          <ListItemIcon><LogoutIcon /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex' }}>
          {isAuthenticated && (
            <>
              <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ mr: 2, display: { sm: 'none' } }}
                  >
                    <MenuIcon />
                  </IconButton>
                  <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                    Staff Management Tool
                  </Typography>
                  {user && (
                    <Typography variant="body1" sx={{ mr: 2 }}>
                      {user.firstName} {user.lastName}
                    </Typography>
                  )}
                </Toolbar>
              </AppBar>

              <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
              >
                <Drawer
                  variant={isMobile ? 'temporary' : 'permanent'}
                  open={isMobile ? mobileOpen : true}
                  onClose={handleDrawerToggle}
                  ModalProps={{
                    keepMounted: true,
                  }}
                  sx={{
                    '& .MuiDrawer-paper': { 
                      boxSizing: 'border-box', 
                      width: drawerWidth,
                      backgroundColor: theme.palette.background.default
                    },
                  }}
                >
                  {drawer}
                </Drawer>
              </Box>
            </>
          )}

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              width: { sm: isAuthenticated ? `calc(100% - ${drawerWidth}px)` : '100%' },
              ml: { sm: isAuthenticated ? `${drawerWidth}px` : 0 },
              mt: isAuthenticated ? '64px' : 0
            }}
          >
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={
                isAuthenticated ? <Navigate to="/" replace /> : <Login />
              } />
              <Route path="/register" element={
                isAuthenticated ? <Navigate to="/" replace /> : <Register />
              } />

              {/* Protected routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/team" element={
                <ProtectedRoute>
                  <Team />
                </ProtectedRoute>
              } />
              <Route path="/tasks" element={
                <ProtectedRoute>
                  <Tasks />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute requiredRoles={['admin']}>
                  <Settings />
                </ProtectedRoute>
              } />

              {/* Redirect to login if not authenticated */}
              <Route path="*" element={
                isAuthenticated ? <Navigate to="/" replace /> : <Navigate to="/login" replace />
              } />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App; 