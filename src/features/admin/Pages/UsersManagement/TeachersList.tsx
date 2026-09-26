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
import { useGetAllTeacherQuery, useDeleteTeacherMutation } from "../../../../redux/features/teacherManagement/teacherManagementApi";
import DeleteIcon from '@mui/icons-material/Delete';
import CreateTeacherModal from './CreateTeacherModal';
import Swal from 'sweetalert2';

const TeachersList = () => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const { data, isLoading } = useGetAllTeacherQuery({});
  const [deleteTeacher, { isLoading: isDeleting }] = useDeleteTeacherMutation();
  const teachers = (data as any)?.data ?? [];

  const handleDelete = async (teacherId: string) => {
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
          await deleteTeacher(teacherId).unwrap();
          Swal.fire("Deleted!", "The teacher has been deleted.", "success");
        } catch (error) {
          console.error("Failed to delete teacher:", error);
          Swal.fire("Error!", "Failed to delete teacher.", "error");
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
        <Typography variant="h6">Teachers</Typography>
        <Button variant="contained" color="primary" onClick={() => setModalOpen(true)}>Add New Teacher</Button>
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
            {teachers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">No teachers found</TableCell>
              </TableRow>
            ) : (
              teachers.map((teacher: any) => (
                <TableRow key={teacher._id}>
                  <TableCell>{teacher.teacherId}</TableCell>
                  <TableCell>{teacher.name}</TableCell>
                  <TableCell>{teacher.email}</TableCell>
                  <TableCell>{teacher.phone}</TableCell>
                  <TableCell align="right">
                    <Button 
                      variant="outlined" 
                      color="error" 
                      size="small" 
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(teacher._id)}
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
      <CreateTeacherModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </Box>
  );
};

export default TeachersList;
