import { baseApi } from "../../api/baseApi";

const teacherManagementAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all teachers
    getAllTeacher: builder.query({
      query: (filters) => {
        const queryParams = new URLSearchParams();

        if (filters.searchTerm)
          queryParams.set("searchTerm", filters.searchTerm);
        if (filters.subject) queryParams.set("subject", filters.subject);
        if (filters.jobType) queryParams.set("jobType", filters.jobType);

        return {
          url: `/teacher-management?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Teacher-Management"],
    }),

    // Get a single teacher
    getTeacherById: builder.query({
      query: (id) => ({
        url: `/teacher-management/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => {
        return [{ type: "Teacher-Management", id }];
      },
    }),

    // Get All Category Subjects
    getAllCategorySubjects: builder.query({
      query: () => ({
        url: "/category/subject?limit=0",
        method: "GET",
      }),
      providesTags: ["Subjects"],
    }),

    // Create Teacher
    createTeacher: builder.mutation({
      query: (data) => ({
        url: "/user/create-teacher",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Teacher-Management"],
    }),

    // Update Teacher Assigned Works
    updateTeacherAssignedWorks: builder.mutation({
      query: ({ id, data }) => ({
        url: "/teacher-management/assigned-works",
        method: "PATCH",
        body: data,
      }),

      invalidatesTags: (_result, _error, { id }) => {
        return ["Teacher-Management", { type: "Teacher-Management", id }];
      },
    }),

    // ***
  }),
});

export const {
  useGetAllTeacherQuery,
  useGetTeacherByIdQuery,
  useGetAllCategorySubjectsQuery,
  useCreateTeacherMutation,
  useUpdateTeacherAssignedWorksMutation,
} = teacherManagementAPI;
