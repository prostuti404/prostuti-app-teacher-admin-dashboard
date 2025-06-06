import { Box, Typography, Grid } from "@mui/material";
import FlashcardIcon from "./../../../../assets/icons/flashcard.svg?react";
import { Link } from "react-router-dom";
import { useGetRecentFlashcardsQuery } from "../../../../redux/features/flashcard/flashcardApi";
import Loader from "../../../../shared/components/Loader";

const RecentFlashcards = () => {
  const { data: flashCards, isLoading: flashCardsLoader } =
    useGetRecentFlashcardsQuery({ visibility: "EVERYONE", limit: 4 });

  if (flashCardsLoader) {
    return <Loader />;
  }

  const flashcardData = flashCards?.data?.data || [];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ p: 3, border: "1px solid #e0e0e0", borderRadius: "8px" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h5" component="h2" fontWeight="bold">
            Recent Flashcards
          </Typography>
          <Link to="/teacher/flashcard" style={{ textDecoration: "none" }}>
            <Typography
              variant="body2"
              color="primary"
              sx={{ cursor: "pointer" }}
            >
              View all
            </Typography>
          </Link>
        </Box>

        <Grid container spacing={2}>
          {flashcardData.map((flashcard) => (
            <Grid key={flashcard._id} item xs={6} sm={4} md={3}>
              <Link
                to={`/teacher/flashcard/${flashcard._id}`}
                style={{ textDecoration: "none" }}
              >
                <Box sx={{ cursor: "pointer" }}>
                  <Box
                    sx={{
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      p: 5,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <FlashcardIcon style={{ color: "#9e9e9e", fontSize: 40 }} />
                  </Box>
                  <Typography variant="body1" color="text.primary">
                    {flashcard.title}
                  </Typography>
                </Box>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default RecentFlashcards;
