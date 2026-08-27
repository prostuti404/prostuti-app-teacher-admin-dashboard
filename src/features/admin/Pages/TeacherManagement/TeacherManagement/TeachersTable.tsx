import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Link } from "react-router-dom";
import { useGetAllTeacherQuery } from "../../../../../redux/features/teacherManagement/teacherManagementApi";
import Loader from "../../../../../shared/components/Loader";

const TeachersTable = ({ searchTerm, subjects, category }) => {
  const { data, isLoading } = useGetAllTeacherQuery({
    searchTerm,
    subjects,
    jobType: category,
  });

  if (isLoading) {
    return <Loader />;
  }

  // Extract the teachers array from the API response
  const teachers = data?.data || [];

  return (
    <TableContainer component={Paper} sx={{ maxWidth: "100%", margin: "auto" }}>
      <Table sx={{ minWidth: 650 }} aria-label="teachers-table">
        <TableHead>
          <TableRow sx={{ backgroundColor: "#E5E7EB" }}>
            <TableCell>SI</TableCell>
            <TableCell>Teacher Name</TableCell>
            <TableCell>Teacher ID</TableCell>
            <TableCell>Subject</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {teachers.map((teacher, index) => (
            <TableRow
              key={teacher._id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
              <TableCell>{`${index + 1}.`}</TableCell>
              <TableCell>{teacher.name || "N/A"}</TableCell>
              <TableCell>{teacher.teacherId}</TableCell>
              <TableCell>{teacher.subjects?.join(", ") || "N/A"}</TableCell>
              <TableCell>{teacher.jobType || "N/A"}</TableCell>
              <TableCell>
                <Link to={`profile/${teacher.teacherId}`}>
                  <IconButton aria-label="action">
                    <ArrowForwardIosIcon />
                  </IconButton>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TeachersTable;
