import { Box, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const MyCoursesSection = ({ courses }) => {
  return (
    <Box
      sx={{
        mb: 4,
        p: 3,
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        backgroundColor: "#fff",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" component="h2" sx={{ fontWeight: "bold" }}>
          My Courses
        </Typography>
        <Link to="/teacher/my-course" style={{ textDecoration: "none" }}>
          <Typography
            variant="body2"
            color="primary"
            sx={{ cursor: "pointer" }}
          >
            View all
          </Typography>
        </Link>
      </Box>
      <Grid container spacing={3}>
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course._id || course.id}>
            <Link
              style={{
                textDecoration: "none",
                display: "block",
                height: "100%",
              }}
              to={`/teacher/course-preview/${course._id}`}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  cursor: "pointer",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: "180px",
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={course?.image?.path || "https://placehold.co/600x400?text=No+Image"}
                    alt={course.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    mt: 1,
                    fontWeight: "500",
                    color: "#333",
                  }}
                >
                  {course.name.length > 20
                    ? `${course.name.slice(0, 20)}...`
                    : course.name}
                </Typography>
              </Box>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MyCoursesSection;
