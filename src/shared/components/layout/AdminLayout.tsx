import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '../../../assets/Dashboard-SVGs/dashboard-icon.svg?react';
import ProstutiLogo from '../../../assets/Dashboard-SVGs/Prostuti-logo.svg?react';
import FlashCardIcon from '../../../assets/Dashboard-SVGs/flashcard.svg?react';
import LogOutIcon from '../../../assets/Dashboard-SVGs/logout.svg?react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import Welcome from '../Welcome';
import TeacherManagementIcon from '../../../assets/Dashboard-SVGs/profile.svg?react';
import CourseManagementIcon from '../../../assets/Dashboard-SVGs/my-courses.svg?react';
import PracticeTestIcon from '../../../assets/Dashboard-SVGs/practiceTest.svg?react';
import PaymentManagement from '../../../assets/Dashboard-SVGs/paymentManagement.svg?react';
import RevenueManagementIcon from '../../../assets/Dashboard-SVGs/revenueManagement.svg?react';
import ReportComplianceIcon from '../../../assets/Dashboard-SVGs/reportCompliance.svg?react';
import { useAppDispatch } from '../../../redux/hooks';
import { logout } from '../../../redux/features/auth/authSlice';
import NotificationIcon from '../NotificationIcon';
import NotificationDrawer from '../NotificationDrawer';
import AdminDashboard from '../../../features/admin/Pages/AdminDashboard/AdminDashboard';

const drawerWidth = 265;
const adminDashboardMenus = [
  {
    path: '/admin/dashboard',
    name: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    path: '/admin/course-management',
    name: 'Course Management',
    icon: <CourseManagementIcon />,
  },
  {
    path: '/admin/flashcard-management',
    name: 'Flashcard Management',
    icon: <FlashCardIcon />,
  },
  {
    path: '/admin/teacher-management',
    name: 'Teacher Management',
    icon: <TeacherManagementIcon />,
  },
  {
    path: '/admin/student-management',
    name: 'Student Management',
    icon: <TeacherManagementIcon />,
  },
  {
    path: '/admin/practice-test',
    name: 'Practice Test',
    icon: <PracticeTestIcon />,
  },
  {
    path: '/admin/payment-management',
    name: 'Payment Management',
    icon: <PaymentManagement />,
  },
  {
    path: '/admin/coupon-management',
    name: 'Coupon Management',
    icon: <PaymentManagement />,
  },
  // {
  //   path: '/admin/revenue-management',
  //   name: 'Revenue Management',
  //   icon: <RevenueManagementIcon />,
  // },
  {
    path: '/admin/category',
    name: 'Category',
    icon: <RevenueManagementIcon />,
  },
  {
    path: '/admin/report-compliance',
    name: 'Report & Compliance',
    icon: <ReportComplianceIcon />,
  },
];

export const AdminLayout = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          backgroundColor: 'transparent',
          backdropFilter: 'blur(5px)',
          borderBottom: '1px solid rgba(230, 230, 230, 0.5)'
        }}
      >
        <Toolbar
          variant="dense"
          sx={{
            justifyContent: 'flex-end',
            minHeight: '48px',
            padding: '0 16px'
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
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        {/* logo */}
        <Box
          sx={{ display: 'flex', justifyContent: 'flex-start', p: 2, ml: 2 }}
        >
          <ProstutiLogo />
        </Box>
        {/* logo end */}
        {/* sidebar menu start */}
        <List sx={{ ml: 2 }}>
          {adminDashboardMenus.map((item, index) => (
            <ListItem key={index} disablePadding>
              {/* navlink comes from react router dom */}
              <NavLink
                to={item.path as string}
                style={({ isActive }) => {
                  return isActive
                    ? {
                      textDecoration: 'none',
                      width: '93%',
                      color: '#2970FF',
                      backgroundColor: '#EFF4FF',
                      borderRadius: '10px',
                    }
                    : {
                      color: '#9CA3AF',
                      textDecoration: 'none',
                      width: '93%',
                    };
                }}
              >
                <ListItemButton
                  sx={{
                    '&:hover': {
                      color: '#2970FF',
                      backgroundColor: '#EFF4FF',
                      borderRadius: '10px',
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
            <Box sx={{ width: '93%' }}>
              <ListItemButton
                sx={{
                  color: '#9CA3AF',
                  '&:hover': {
                    color: '#2970FF',
                    backgroundColor: '#EFF4FF',
                    borderRadius: '10px',
                  },
                }}
                onClick={() => dispatch(logout())}
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
        sx={{ flexGrow: 1, bgcolor: 'background.default', px: 4 }}
      >
        <Toolbar sx={{ zIndex: -3 }} />
        {/* sidebar menu main content will show here */}
        {location.pathname === '/admin' ? <AdminDashboard /> : <Outlet />}
      </Box>
      {/* main content ends */}

      {/* Notification drawer */}
      <NotificationDrawer />
    </Box>
  );
};

export default AdminLayout;