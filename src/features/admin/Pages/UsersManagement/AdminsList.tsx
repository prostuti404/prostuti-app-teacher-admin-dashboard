import React from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Avatar,
  Stack,
  IconButton,
  Tooltip
} from "@mui/material";
import { useGetAllAdminsQuery, useDeleteAdminMutation } from "../../../../redux/features/userManagement/userManagementApi";
import DeleteIcon from '@mui/icons-material/Delete';
import CreateAdminModal from './CreateAdminModal';
import Swal from 'sweetalert2';

const AdminsList = () => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const { data, isLoading } = useGetAllAdminsQuery({});
  const [deleteAdmin, { isLoading: isDeleting }] = useDeleteAdminMutation();
  const admins = (data as any)?.data ?? [];

  const handleDelete = async (adminId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteAdmin(adminId).unwrap();
          Swal.fire("Deleted!", "The admin has been deleted.", "success");
        } catch (error) {
          console.error("Failed to delete admin:", error);
          Swal.fire("Error!", "Failed to delete admin.", "error");
        }
      }
    });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Admins</Typography>
        <Button variant="contained" color="primary" onClick={() => setModalOpen(true)}>Add New Admin</Button>
      </Box>
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #E0E0E0', borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="admins table">
          <TableHead sx={{ backgroundColor: '#F9FAFB' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: '#6B7280' }}>Admin Info</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#6B7280' }}>Contact</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#6B7280' }}>Role</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, color: '#6B7280' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {admins.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">No admins found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              admins.map((admin: any) => {
                const isSuperAdmin = admin.user_id?.isSuperAdmin;
                return (
                  <TableRow 
                    key={admin._id}
                    sx={{ 
                      '&:last-child td, &:last-child th': { border: 0 },
                      backgroundColor: isSuperAdmin ? 'rgba(216, 180, 254, 0.15)' : 'inherit',
                      transition: 'background-color 0.2s',
                      '&:hover': { backgroundColor: isSuperAdmin ? 'rgba(216, 180, 254, 0.25)' : '#F9FAFB' }
                    }}
                  >
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: isSuperAdmin ? '#9333EA' : '#1976d2', width: 40, height: 40 }}>
                          {admin.name?.charAt(0)?.toUpperCase() || 'A'}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{admin.name || 'Unnamed Admin'}</Typography>
                          <Typography variant="caption" color="text.secondary">ID: {admin.adminId}</Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{admin.email}</Typography>
                      <Typography variant="caption" color="text.secondary">{admin.phone || 'No phone provided'}</Typography>
                    </TableCell>
                    <TableCell>
                      {isSuperAdmin ? (
                        <Chip label="Super Admin" size="small" sx={{ backgroundColor: '#9333EA', color: 'white', fontWeight: 600 }} />
                      ) : (
                        <Chip label="Admin" size="small" color="primary" variant="outlined" />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title={isSuperAdmin ? "Cannot delete a Super Admin" : "Delete Admin"}>
                        <span>
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(admin._id)}
                            disabled={isDeleting || isSuperAdmin}
                            sx={{ opacity: isSuperAdmin ? 0.5 : 1 }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <CreateAdminModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </Box>
  );
};

export default AdminsList;
