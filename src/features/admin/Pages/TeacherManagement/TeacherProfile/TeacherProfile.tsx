import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Paper,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetTeacherByIdQuery,
  useUpdateTeacherAssignedWorksMutation,
} from "../../../../../redux/features/teacherManagement/teacherManagementApi";
import CustomLabel from "../../../../../shared/components/CustomLabel";
import CustomTextField from "../../../../../shared/components/CustomTextField";
import Loader from "../../../../../shared/components/Loader";
import { teacherAssignedWorks } from "../../../../../constants";
import toast from "react-hot-toast";
import { getErrorMessage } from "../../../../../utils/getErrorMessage";

const activities = [
  { detail: "Accepted Flashcard", time: "3 minutes ago" },
  { detail: "Accepted Flashcard", time: "3 minutes ago" },
  { detail: 'Edited a card in "World War" flashcard', time: "3 minutes ago" },
  { detail: 'Deleted a card in "World War" flashcard', time: "3 minutes ago" },
  { detail: "Accepted flashcard", time: "3 minutes ago" },
  { detail: "Accepted flashcard", time: "3 minutes ago" },
  { detail: 'Edited a card in "World War" flashcard', time: "3 minutes ago" },
  { detail: 'Deleted a card in "World War" flashcard', time: "3 minutes ago" },
];

const TeacherProfile = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetTeacherByIdQuery(id);
  const [updateAssignedWorks, { isLoading: isUpdating }] =
    useUpdateTeacherAssignedWorksMutation();
  const navigate = useNavigate();

  // Initialize selectedWorks with proper data or empty array
  const [selectedWorks, setSelectedWorks] = useState([]);

  // Use useMemo to extract teacher and courses data
  const { teacher, courses } = useMemo(() => {
    return data?.data ? data.data : { teacher: {}, courses: [] };
  }, [data]);

  // Set initial values when data loads
  useEffect(() => {
    if (teacher?.assignedWorks && Array.isArray(teacher.assignedWorks)) {
      setSelectedWorks(teacher.assignedWorks);
    }
  }, [teacher]);

  // Optimized work selection handler
  const handleWorkSelection = (work) => {
    setSelectedWorks((prev) =>
      prev.includes(work)
        ? prev.filter((item) => item !== work)
        : [...prev, work]
    );
  };

  // Handle Teacher Update Assigned Works
  const handleUpdateAssignedWorks = async () => {
    try {
      const data = {
        teacherProfileId: teacher._id,
        assignedWorks: selectedWorks,
      };

      await updateAssignedWorks({
        id,
        data,
      }).unwrap();

      toast.success("Assigned Works Updated Successfully");
    } catch (error) {
      console.error("Failed to update assigned works:", error);
      toast.error(getErrorMessage(error, "Failed to update assigned works"));
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Paper
        variant="outlined"
        sx={{ width: "100%", borderRadius: "25px", p: 3 }}>
        {/* ---------------------------Teacher Information */}
        <Box>
          {/* top profile title and button section */}
          <Box
            component="section"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
            <Box
              component="section"
              sx={{
                display: "flex",
                gap: "15px",
                justifyContent: "flex-start",
                alignItems: "center",
              }}>
              {/* <Link to='/teacher/question-database'> */}
              <Button
                variant="outlined"
                sx={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  borderColor: "grey.700",
                  color: "#3F3F46",
                }}
                onClick={() => {
                  navigate("/admin/teacher-management");
                }}>
                <ArrowBackIcon fontSize="small" />
              </Button>
              {/* </Link> */}
              <Typography variant="h3">Teacher Profile</Typography>
            </Box>
            <Button
              variant="contained"
              type="submit"
              onClick={handleUpdateAssignedWorks}
              sx={{
                width: "120px",
                height: "38px",
                borderRadius: "8px",
                fontSize: "14px",
              }}>
              Save
            </Button>
          </Box>

          {/* profile picture and teacher name */}
          <Box
            component="section"
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              gap: 3,
              mt: 3,
            }}>
            {/* avatar section */}
            <Box sx={{ position: "relative" }}>
              <Avatar
                alt={`teacher-photo-${teacher.teacherId}`}
                src={teacher?.image?.path || ""}
                sx={{ width: "130px", height: "130px" }}
              />
            </Box>
            {/* avatar section ends */}
            <Box
              component="div"
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                gap: 0.5,
              }}>
              <Typography variant="h3">{teacher.email}</Typography>
              <Typography variant="h6" sx={{ fontWeight: "650" }}>
                {teacher.teacherId}
              </Typography>
            </Box>
          </Box>
          {/* profile information section */}
          <Box component="section" sx={{ mt: 3, flexGrow: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: "600" }}>
              Generals
            </Typography>
            {/* Row 1 */}
            <Grid container spacing={2} sx={{ mt: 3 }}>
              <Grid size={6}>
                <CustomLabel fieldName="Name" />
                <CustomTextField
                  value={""}
                  name="name"
                  placeholder={teacher?.name || ""}
                  disabled
                />
              </Grid>
              <Grid size={6}>
                <CustomLabel fieldName="Contact Number" />
                <CustomTextField
                  name="phone"
                  placeholder={teacher?.phone || ""}
                  disabled
                />
              </Grid>
              {/* date field */}
            </Grid>
            {/* Row 2 */}
            <Grid container spacing={2} sx={{ mt: 3 }}>
              <Grid size={6}>
                <CustomLabel fieldName="Joined Date" />
                <CustomTextField
                  value={""}
                  name="joinedDate"
                  placeholder={teacher?.joinedDate || ""}
                  disabled
                />
              </Grid>
              <Grid size={6}>
                <CustomLabel fieldName="Subject" />
                <CustomTextField
                  name="subject"
                  placeholder={teacher?.subject || ""}
                  disabled
                />
              </Grid>
              {/* date field */}
            </Grid>
            {/* Row 3 */}
            <Grid container spacing={2} sx={{ mt: 3 }}>
              <Grid size={6}>
                <CustomLabel fieldName="Type" />
                <CustomTextField
                  name="type"
                  placeholder={teacher?.jobType || ""}
                  disabled
                />
              </Grid>
              {/* ************************Assigned Work */}
              <Grid size={6}>
                <CustomLabel fieldName="Assigned Work" />
                <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                  {teacherAssignedWorks.map((work) => (
                    <Button
                      key={work}
                      variant="outlined"
                      onClick={() => handleWorkSelection(work)}
                      sx={{
                        borderRadius: "8px",
                        px: 2,
                        py: 1,
                        color: selectedWorks.includes(work)
                          ? "primary.main"
                          : "text.secondary",
                        borderColor: selectedWorks.includes(work)
                          ? "primary.main"
                          : "grey.300",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}>
                      {work}
                      {selectedWorks.includes(work) && (
                        <CheckCircleOutlineIcon
                          color="primary"
                          fontSize="small"
                        />
                      )}
                    </Button>
                  ))}
                </Box>
              </Grid>
            </Grid>
            <Divider sx={{ mt: 3 }} />
          </Box>
        </Box>
        {/* ---------------------------Teacher Courses */}
        <Box component="section" sx={{ mt: 3, flexGrow: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: "600", mb: 3 }}>
            Courses
          </Typography>
        </Box>
        <Box
          display="grid"
          gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))"
          gap={3}>
          {courses.length === 0 ? (
            <Typography variant="h6" sx={{ fontWeight: "600", mb: 3 }}>
              No Courses
            </Typography>
          ) : (
            courses.map((course) => (
              <Box key={course._id}>
                {/* <CourseCard course={course} /> */}
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    sx={{ objectFit: "cover" }}
                    image={course.image?.path}
                    alt={course?.name}
                  />
                  <CardContent>
                    <Typography
                      sx={{ fontSize: "18px", fontWeight: "bold" }}
                      gutterBottom
                      variant="h6"
                      component="div">
                      {course?.name}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))
          )}
        </Box>
        {/* ---------------------------Teacher Activity */}
        <Box component="section" sx={{ mt: 3, flexGrow: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: "600", mb: 3 }}>
            Activity
          </Typography>
          <Grid container spacing={2}>
            <Grid size={12}>
              {activities.map((val, index) => (
                <Card
                  key={index}
                  variant="outlined"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mt: 0.8,
                    px: 1.5,
                    py: 0.8,
                    borderRadius: 2,
                  }}>
                  <AccessTimeOutlinedIcon fontSize="large" color="disabled" />
                  <Box component="div">
                    <Typography
                      variant="subtitle1"
                      sx={{ fontSize: "14px", fontWeight: "600" }}>
                      {val.detail}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      color="grey.500"
                      sx={{ fontSize: "14px", fontWeight: "500" }}>
                      {val.time}
                    </Typography>
                  </Box>
                </Card>
              ))}
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};
export default TeacherProfile;
