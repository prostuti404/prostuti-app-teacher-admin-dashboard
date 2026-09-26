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
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Phone</strong></TableCell>
              <TableCell align="right"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {admins.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">No admins found</TableCell>
              </TableRow>
            ) : (
              admins.map((admin: any) => (
                <TableRow key={admin._id}>
                  <TableCell>{admin.adminId}</TableCell>
                  <TableCell>{admin.name}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>{admin.phone}</TableCell>
                  <TableCell align="right">
                    <Button 
                      variant="outlined" 
                      color="error" 
                      size="small" 
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(admin._id)}
                      disabled={isDeleting}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <CreateAdminModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </Box>
  );
};

export default AdminsList;
