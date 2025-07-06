'use client';

import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Chip,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import {
  MoreVert,
  Email,
  Phone,
  Business,
  Person,
  Edit,
  Delete,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import { useState } from 'react';
import { TeamMember } from '../lib/features/team/teamSlice';

interface TeamMemberCardProps {
  member: TeamMember;
  onEdit?: (member: TeamMember) => void;
  onDelete?: (memberId: string) => void;
  onToggleActive?: (memberId: string, isActive: boolean) => void;
}

const getRoleColor = (role: string): 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' => {
  switch (role) {
    case 'ADMIN': return 'error';
    case 'MANAGER': return 'warning';
    case 'EMPLOYEE': return 'primary';
    default: return 'secondary';
  }
};

const getRoleIcon = (role: string) => {
  switch (role) {
    case 'ADMIN': return '👑';
    case 'MANAGER': return '🏢';
    case 'EMPLOYEE': return '👤';
    default: return '👤';
  }
};

export default function TeamMemberCard({ member, onEdit, onDelete, onToggleActive }: TeamMemberCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit?.(member);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete?.(member.id);
    handleMenuClose();
  };

  const handleToggleActive = () => {
    onToggleActive?.(member.id, !member.isActive);
    handleMenuClose();
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <Card 
      sx={{ 
        mb: 2, 
        opacity: member.isActive ? 1 : 0.7,
        border: member.isActive ? 'none' : '2px dashed #ccc'
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box display="flex" alignItems="center" flex={1}>
            <Avatar 
              sx={{ 
                mr: 2, 
                bgcolor: member.isActive ? 'primary.main' : 'grey.400',
                width: 56, 
                height: 56 
              }}
            >
              {getInitials(member.firstName, member.lastName)}
            </Avatar>
            
            <Box flex={1}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Typography variant="h6" component="h3">
                  {member.firstName} {member.lastName}
                </Typography>
                <Chip
                  label={`${getRoleIcon(member.role)} ${member.role}`}
                  size="small"
                  color={getRoleColor(member.role)}
                  variant="outlined"
                />
                {!member.isActive && (
                  <Chip
                    label="Inactive"
                    size="small"
                    color="error"
                    variant="filled"
                  />
                )}
              </Box>

              <Box display="flex" alignItems="center" gap={2} mb={1}>
                <Box display="flex" alignItems="center" gap={0.5}>
                  <Email fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {member.email}
                  </Typography>
                </Box>
                
                {member.staffProfile?.phoneNumber && (
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Phone fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {member.staffProfile.phoneNumber}
                    </Typography>
                  </Box>
                )}
              </Box>

              {member.staffProfile && (
                <Box display="flex" alignItems="center" gap={2}>
                  {member.staffProfile.department && (
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <Business fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {member.staffProfile.department}
                      </Typography>
                    </Box>
                  )}
                  
                  {member.staffProfile.position && (
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <Person fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {member.staffProfile.position}
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}

              {member.staffProfile?.skills && member.staffProfile.skills.length > 0 && (
                <Box mt={1}>
                  <Box display="flex" flexWrap="wrap" gap={0.5}>
                    {member.staffProfile.skills.slice(0, 3).map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        size="small"
                        variant="outlined"
                        color="secondary"
                      />
                    ))}
                    {member.staffProfile.skills.length > 3 && (
                      <Chip
                        label={`+${member.staffProfile.skills.length - 3} more`}
                        size="small"
                        variant="outlined"
                        color="secondary"
                      />
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          </Box>

          <Box>
            <Tooltip title="Actions">
              <IconButton onClick={handleMenuOpen}>
                <MoreVert />
              </IconButton>
            </Tooltip>
            
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
              {onEdit && (
                <MenuItem onClick={handleEdit}>
                  <Edit fontSize="small" sx={{ mr: 1 }} />
                  Edit
                </MenuItem>
              )}
              
              {onToggleActive && (
                <MenuItem onClick={handleToggleActive}>
                  {member.isActive ? (
                    <>
                      <Cancel fontSize="small" sx={{ mr: 1 }} />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <CheckCircle fontSize="small" sx={{ mr: 1 }} />
                      Activate
                    </>
                  )}
                </MenuItem>
              )}
              
              {onDelete && (
                <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                  <Delete fontSize="small" sx={{ mr: 1 }} />
                  Delete
                </MenuItem>
              )}
            </Menu>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}