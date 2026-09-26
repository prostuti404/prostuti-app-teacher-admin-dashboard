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
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #E0E0E0', borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="teachers table">
          <TableHead sx={{ backgroundColor: '#F9FAFB' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: '#6B7280' }}>Teacher Info</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#6B7280' }}>Contact</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#6B7280' }}>Role</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, color: '#6B7280' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teachers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">No teachers found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              teachers.map((teacher: any) => {
                const isSuperAdmin = teacher.user_id?.isSuperAdmin;
                return (
                  <TableRow 
                    key={teacher._id}
                    sx={{ 
                      '&:last-child td, &:last-child th': { border: 0 },
                      backgroundColor: isSuperAdmin ? 'rgba(216, 180, 254, 0.15)' : 'inherit',
                      transition: 'background-color 0.2s',
                      '&:hover': { backgroundColor: isSuperAdmin ? 'rgba(216, 180, 254, 0.25)' : '#F9FAFB' }
                    }}
                  >
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: isSuperAdmin ? '#9333EA' : '#10B981', width: 40, height: 40 }}>
                          {teacher.name?.charAt(0)?.toUpperCase() || 'T'}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{teacher.name || 'Unnamed Teacher'}</Typography>
                          <Typography variant="caption" color="text.secondary">ID: {teacher.teacherId}</Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{teacher.email}</Typography>
                      <Typography variant="caption" color="text.secondary">{teacher.phone || 'No phone provided'}</Typography>
                    </TableCell>
                    <TableCell>
                      {isSuperAdmin ? (
                        <Chip label="Super Admin" size="small" sx={{ backgroundColor: '#9333EA', color: 'white', fontWeight: 600 }} />
                      ) : (
                        <Chip label="Teacher" size="small" sx={{ color: '#059669', borderColor: '#34D399', backgroundColor: 'rgba(52, 211, 153, 0.1)' }} variant="outlined" />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title={isSuperAdmin ? "Cannot delete a Super Admin" : "Delete Teacher"}>
                        <span>
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(teacher._id)}
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
      <CreateTeacherModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </Box>
  );
};

export default TeachersList;
