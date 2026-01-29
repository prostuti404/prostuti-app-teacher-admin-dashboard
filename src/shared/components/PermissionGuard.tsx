import { Navigate } from "react-router-dom";
import { useGetTeacherProfileQuery } from "../../../redux/features/teacher/teacherApi";
import Loader from "./Loader";

interface PermissionGuardProps {
  children: React.ReactNode;
  requiredPermission: string;
  fallbackPath?: string;
}

/**
 * PermissionGuard component to protect routes based on teacher's assigned works.
 * If the teacher doesn't have the required permission, they are redirected to the fallback path.
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  requiredPermission,
  fallbackPath = "/teacher/profile",
}) => {
  const { data: profileData, isLoading, isError } = useGetTeacherProfileQuery({});

  // Show loader while fetching profile data
  if (isLoading) {
    return <Loader />;
  }

  // If error or no data, redirect to fallback
  if (isError || !profileData) {
    return <Navigate to={fallbackPath} replace />;
  }

  // Extract assignedWorks and normalize to lowercase for comparison
  const assignedWorks = profileData?.data?.assignedWorks || [];
  const assignedSet = new Set(assignedWorks.map((w: string) => w.toLowerCase()));

  // Check if the required permission is present
  const hasPermission = assignedSet.has(requiredPermission.toLowerCase());

  if (!hasPermission) {
    // Redirect to fallback path if permission is missing
    return <Navigate to={fallbackPath} replace />;
  }

  // Render children if permission check passes
  return <>{children}</>;
};

export default PermissionGuard;
