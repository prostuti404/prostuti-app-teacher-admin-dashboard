import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DatabaseIcon from "../../../assets/Dashboard-SVGs/database.svg?react";
import DashboardIcon from "../../../assets/Dashboard-SVGs/dashboard-icon.svg?react";
import ProstutiLogo from "../../../assets/Dashboard-SVGs/Prostuti-logo.svg?react";
import MyCourseIcon from "../../../assets/Dashboard-SVGs/my-courses.svg?react";
import MessagesIcon from "../../../assets/Dashboard-SVGs/messages.svg?react";
import FlashCardIcon from "../../../assets/Dashboard-SVGs/flashcard.svg?react";
import ProfileIcon from "../../../assets/Dashboard-SVGs/profile.svg?react";
import LogOutIcon from "../../../assets/Dashboard-SVGs/logout.svg?react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { logout } from "../../../redux/features/auth/authSlice";
import NotificationIcon from "../../../shared/components/NotificationIcon";
import NotificationDrawer from "../../../shared/components/NotificationDrawer";
import TeacherDashboard from "../../../features/teacher/Pages/TeacherDashboard/TeacherDashboard";
import { useGetTeacherProfileQuery } from "../../../redux/features/teacher/teacherApi";
import Loader from "../Loader";
import { useEffect, useState } from "react";
import { RootState } from "../../../redux/store";
import { resetStoredQuestions } from "../../../redux/features/question/questionSlice";
import {
  saveCourseIdToStore,
  saveLessonIdToStore,
  saveTestStore,
  saveAssignmentIdToStore,
} from "../../../redux/features/course/courseSlice";
import { PURGE } from "redux-persist";
import { baseApi } from "../../../redux/api/baseApi";
import { TUserData } from "../../../types/types";
import {CheckmarkIcon} from "react-hot-toast";

const drawerWidth = 256;
const teacherDashboardMenus = [
  {
    path: "/teacher/dashboard",
    name: "Dashboard",
    icon: <DashboardIcon />,
  },
  {
    path: "/teacher/my-course",
    name: "My Course",
    icon: <MyCourseIcon />,
  },
  {
    path: "/teacher/messages",
    name: "Messages",
    icon: <MessagesIcon />,
  },
  {
    path: "/teacher/flashcard",
    name: "Flashcard",
    icon: <FlashCardIcon />,
  },
  {
    path: "/teacher/question-database",
    name: "Question Database",
    icon: <DatabaseIcon />,
  },
  {
    path: "/teacher/proof-check",
    name: "Proof Check",
    icon: <CheckmarkIcon />,
  },
  {
    path: "/teacher/profile",
    name: "Profile",
    icon: <ProfileIcon />,
  },
];

export const TeacherLayout = () => {
  // Track the current user ID for detecting changes
  const userId = useAppSelector(
    (state: RootState) => (state.auth.user as TUserData).userId
  );

  // Add a transition loading state
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Track the previous user ID to detect changes
  const [prevUserId, setPrevUserId] = useState(userId);

  const {
    data: fetchedProfileData,
    isLoading,
    isError,
    refetch,
  } = useGetTeacherProfileQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
      // Skip the query if we're in transition - this forces the cache to be ignored
      skip: isTransitioning,
    }
  );

  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Handle user transitions
  useEffect(() => {
    // If user ID changed
    if (userId !== prevUserId) {
      // Enter transition state
      setIsTransitioning(true);

      // Update previous user ID
      setPrevUserId(userId);

      // Small delay to ensure Redux state is fully updated
      setTimeout(() => {
        // Exit transition state and allow query to run
        setIsTransitioning(false);
      }, 50);
    }
  }, [userId, prevUserId]);

  // Show loader during initial loading or user transitions
  if (isLoading || isTransitioning) {
    return <Loader />;
  }

  // Handle complete logout - clears all persisted state
  const handleLogout = () => {
    // First, reset individual state slices
    dispatch(resetStoredQuestions());

    // Reset course related data
    dispatch(saveCourseIdToStore({ course_id: "" }));
    dispatch(saveLessonIdToStore({ lesson_id: "" }));
    dispatch(saveTestStore({ test_id: "" }));
    dispatch(saveAssignmentIdToStore({ assignment_id: "" }));

    // Clear all persisted redux state
    dispatch({
      type: PURGE,
      key: "root",
      result: () => null,
    });

    // Logout the user (this should be last)
    dispatch(logout());

    // Force a cache reset by clearing the RTK Query cache
    dispatch(baseApi.util.resetApiState());

    // Navigate to login page
    navigate("/");
  };

  // Handle error case or when data is undefined
  if (isError || !fetchedProfileData) {
    // You might want to show an error message or fallback UI here
    // For now, just show the profile menu as a fallback
    const fallbackMenus = [
      {
        path: "/teacher/profile",
        name: "Profile",
        icon: <ProfileIcon />,
      },
    ];

    return renderLayout(fallbackMenus);
  }

  // Extract assignedWorks safely with default empty array
  const assignedWorks = fetchedProfileData?.data?.assignedWorks || [];

  // Normalized assigned work set
  const assignedSet = new Set(assignedWorks.map((w) => w.toLowerCase()));

  // Checking if all 4 main items are assigned
  const hasAllAssigned = ["Flashcard", "Questions", "Course", "Messages", "Proof_Check"].every(
    (item) => assignedSet.has(item.toLowerCase())
  );

  // Final filter
  const filteredMenus = teacherDashboardMenus.filter((menu) => {
    console.log(assignedSet);
    if (menu.name === "Profile") return true;
    if (menu.name === "Dashboard") return hasAllAssigned;

    if (menu.name === "My Course" && assignedSet.has("course")) return true;
    if (menu.name === "Messages" && assignedSet.has("messages")) return true;
    if (menu.name === "Flashcard" && assignedSet.has("flashcard")) return true;
    if (menu.name === "Question Database" && assignedSet.has("questions")) return true;
    if (menu.name === "Proof Check" && assignedSet.has("proof_check")) return true;

    return false;
  });

  return renderLayout(filteredMenus);

  // Helper function to render the layout with given menus
  function renderLayout(menus) {
    return (
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            width: `calc(100% - ${drawerWidth}px)`,
            ml: `${drawerWidth}px`,
            backgroundColor: "transparent",
            backdropFilter: "blur(5px)",
            borderBottom: "1px solid rgba(230, 230, 230, 0.5)",
          }}
        >
          <Toolbar
            variant="dense"
            sx={{
              justifyContent: "flex-end",
              minHeight: "48px",
              padding: "0 16px",
            }}
          >
            {/* Add notification icon to toolbar */}
            <NotificationIcon />
          </Toolbar>
        </AppBar>
        {/* sidebar starts */}
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          variant="permanent"
          anchor="left"
        >
          {/* logo */}
          <Box
            sx={{ display: "flex", justifyContent: "flex-start", p: 2, ml: 2 }}
          >
            <ProstutiLogo />
          </Box>
          {/* logo end */}
          {/* sidebar menu start */}
          <List sx={{ ml: 2 }}>
            {menus.map((item, index) => (
              <ListItem key={index} disablePadding>
                {/* navlink comes from react router dom */}
                <NavLink
                  to={item.path as string}
                  style={({ isActive }) => {
                    return isActive
                      ? {
                          textDecoration: "none",
                          width: "93%",
                          color: "#2970FF",
                          backgroundColor: "#EFF4FF",
                          borderRadius: "10px",
                        }
                      : {
                          color: "#9CA3AF",
                          textDecoration: "none",
                          width: "93%",
                        };
                  }}
                >
                  <ListItemButton
                    sx={{
                      "&:hover": {
                        color: "#2970FF",
                        backgroundColor: "#EFF4FF",
                        borderRadius: "10px",
                      },
                    }}
                  >
                    <ListItemIcon sx={{ mr: -3 }}>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.name} />
                  </ListItemButton>
                </NavLink>
              </ListItem>
            ))}
            {/* logout button */}
            <ListItem disablePadding>
              <Box sx={{ width: "93%" }}>
                <ListItemButton
                  sx={{
                    color: "#9CA3AF",
                    "&:hover": {
                      color: "#2970FF",
                      backgroundColor: "#EFF4FF",
                      borderRadius: "10px",
                    },
                  }}
                  onClick={handleLogout}
                >
                  <ListItemIcon sx={{ mr: -3 }}>
                    <LogOutIcon />
                  </ListItemIcon>
                  <ListItemText primary="Log Out" />
                </ListItemButton>
              </Box>
            </ListItem>
          </List>
          {/* sidebar menu start */}
        </Drawer>
        {/* sidebar ends */}
        {/* main content section */}
        <Box
          component="main"
          sx={{ flexGrow: 1, bgcolor: "#FAFAFA", px: 4, minHeight: "100vh" }}
        >
          <Toolbar />
          {/* sidebar menu main content will show here */}
          {location.pathname === "/teacher" ? <TeacherDashboard /> : <Outlet />}
          <Toolbar />
        </Box>
        {/* main content ends */}

        {/* Notification drawer */}
        <NotificationDrawer />
      </Box>
    );
  }
};

export default TeacherLayout;
