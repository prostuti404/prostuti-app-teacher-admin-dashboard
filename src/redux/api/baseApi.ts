import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "../store"; // assuming RootState has the auth state type
import { logout, setUser } from "../features/auth/authSlice";

// Local url -> http://localhost:5000/
// Production url -> https://prostuti-app-backend-production.up.railway.app
// Development url -> https://resilient-heart-dev.up.railway.app

const baseUrl = import.meta.env.VITE_BASE_URL;
const baseQuery = fetchBaseQuery({
  baseUrl: `${baseUrl}/api/v1`,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithRefreshToken: typeof baseQuery = async (
  args,
  api,
  extraOptions
) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error && (result.error as FetchBaseQueryError).status === 401) {
    const res = await fetch(`${baseUrl}/api/v1/auth/refresh-token`, {
      method: "POST",
      credentials: "include",
    });

    const data = await res.json();

    const user = (api.getState() as RootState).auth.user;

    // if user token expires this if block will trigger and redirect to login page
    if (!data.success) {
      api.dispatch(logout());
    }

    api.dispatch(setUser({ user, token: data.data.accessToken }));
  }
  console.log("baseApi", result);
  return result;
};

// Use `baseQueryWithRefreshToken` in the base API
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: [
    "User",
    "Teacher",
    "Questions",
    "Categories",
    "Courses",
    "Lessons",
    "Record",
    "Assignment",
    "Resource",
    "Coupons",
    "Coupon",
    "Payments",
    "Payment",
    "Teacher-Management",
    "Subjects",
    "Notice",
    "Test",
    "AssignmentSubmission",
    "Flashcards",
    "ChildFlashcards",
    "Chat",
    "Notifications",
    "EditRequests",
    "Leaderboard",
    "CourseEngagement",
    "TopSellingCourses",
    "TestCompletion",
    "AssignmentCompletion",
    "MonthlySalesStats",
    "Last7DaysSales",
    "FlashcardStats",
    "StudentPerformance",
    "QuestionPatterns"
  ],
  endpoints: () => ({}),
});
