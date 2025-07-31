import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import { adminRoutes } from './admin.routes';
import { teacherRoutes } from './teacher.routes';
import Login from '../shared/components/Login';
import ProtectedRoute from '../shared/components/layout/ProtectedRoute';
import { NavigationProvider } from '../lib/Providers/NavigationProvider';
import PrivacyPolicy from "../features/PrivacyPolicy.tsx";


const router = createBrowserRouter([
    {
        path: '/',
        element: <Login />,
    },
    {
        path: '/teacher',
        element: (
            <ProtectedRoute allowedRoles={['teacher']}>
                <NavigationProvider>
                    <App />
                </NavigationProvider>
            </ProtectedRoute>
        ),
        children: teacherRoutes
    },
    {
        path: '/admin',
        element: (
            <ProtectedRoute allowedRoles={['admin']}>
                <NavigationProvider>
                    <App />
                </NavigationProvider>
            </ProtectedRoute>
        ),
        children: adminRoutes
    },
    {
        path: '/privacy-policy', // Add this new route
        element: <PrivacyPolicy />,
    },
]);

export default router;