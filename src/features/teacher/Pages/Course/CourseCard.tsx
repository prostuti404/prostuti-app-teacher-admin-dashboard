import { Box } from "@mui/material";
import { Link } from "react-router-dom";
import { useAppSelector } from "../Materials/Create Test";
import { TUser } from "../../../../types/types";
import { RootState } from "../../../../redux/store";

const CourseCard = ({ course }: any) => {
    const user = useAppSelector((state: RootState) => state.auth.user as TUser);
    // course - preview /: courseId
    const path = course?.image?.path || "https://placehold.co/600x400?text=No+Image";
    const { name, _id } = course;
    return (

        <Link style={{ textDecoration: "none" }} to={user.role === 'admin' ? `/admin/course-preview/${_id}` : `/teacher/course-preview/${_id}`}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0, justifyContent: "space-evenly", cursor: "pointer", }}>
                <Box sx={{ width: '320px', height: '153px', borderRadius: 8 }}>
                    <img src={path} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }} />
                </Box>
                <h4 style={{ marginTop: "5px", }}>{name}</h4>
            </Box>
        </Link>
    );
};

export default CourseCard;