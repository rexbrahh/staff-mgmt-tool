import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Card, 
  CardContent,
  CardHeader,
  IconButton
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

const Dashboard: React.FC = () => {
  const stats = [
    { title: 'Total Team Members', value: '12', icon: <PeopleIcon color="primary" /> },
    { title: 'Active Tasks', value: '8', icon: <AssignmentIcon color="secondary" /> },
    { title: 'Completed Tasks', value: '24', icon: <CheckCircleIcon color="success" /> },
    { title: 'Pending Reviews', value: '3', icon: <WarningIcon color="warning" /> },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    {stat.title}
                  </Typography>
                  <Typography variant="h4">
                    {stat.value}
                  </Typography>
                </Box>
                {stat.icon}
              </CardContent>
            </Card>
          </Grid>
        ))}

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <CardHeader
              title="Recent Activity"
              action={
                <IconButton>
                  <MoreVertIcon />
                </IconButton>
              }
            />
            <CardContent>
              <Typography variant="body2" color="textSecondary">
                Activity feed coming soon...
              </Typography>
            </CardContent>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <CardHeader
              title="Team Overview"
              action={
                <IconButton>
                  <MoreVertIcon />
                </IconButton>
              }
            />
            <CardContent>
              <Typography variant="body2" color="textSecondary">
                Team statistics coming soon...
              </Typography>
            </CardContent>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 