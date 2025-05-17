import { baseApi } from "../../api/baseApi";

interface ICategoryQueryParams {
  type?: string;
  division?: string;
  subject?: string;
  chapter?: string;
  universityName?: string;
  universityType?: string;
}
const courseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    saveCourse: builder.mutation({
      query: (courseData) => {
        return {
          url: "/course",
          method: "POST",
          body: courseData,
        };
      },
      invalidatesTags: ["Courses"],
    }),
    saveLesson: builder.mutation({
      query: (lessonData) => {
        return {
          url: "/lesson",
          method: "POST",
          body: lessonData,
        };
      },
      invalidatesTags: ["Lessons"],
    }),
    getCourseByTeacher: builder.query({
      query: (filters) => {
        const queryParams = new URLSearchParams();

        if (filters.limit) queryParams.set("limit", filters.limit);
        if (filters.isPublished !== undefined)
          queryParams.set("isPublished", filters.isPublished);

        return {
          url: `/course/course-by-me?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Courses"],
    }),
    getCourseForAdminEnd: builder.query({
      query: () => ({
        url: "/course/all-course-admin",
        method: "GET",
      }),
      providesTags: ["Courses"],
    }),
    getLessonsByCourseId: builder.query({
      query: ({ courseId }) => {
        return {
          url: `/lesson/course/${courseId}`,
          method: "GET",
        };
      },
      providesTags: ["Lessons"],
    }),
    getCourseById: builder.query({
      query: ({ courseId }) => ({
        url: `/course/${courseId}`,
        method: "GET",
      }),
      providesTags: ["Courses"],
    }),
    getCoursePreview: builder.query({
      query: ({ courseId }) => ({
        url: `/course/preview/${courseId}`,
        method: "GET",
      }),
      providesTags: ["Courses"],
    }),
    getCategoryForCourse: builder.query({
      query: (questionObj: Record<string, string>) => {
        // filters: type: questionObj.category_0, division,subject, chapter
        // console.log('coming from the questionAPI', questionObj);
        const queryParams: ICategoryQueryParams = {
          ...(questionObj.category && { type: questionObj.category }),
          ...(questionObj.division && { division: questionObj.division }),
          ...(questionObj.subject && { subject: questionObj.subject }),
          ...(questionObj.chapter && { chapter: questionObj.chapter }),
          ...(questionObj.universityName && { universityName: questionObj.universityName }),
          ...(questionObj.universityType && { universityType: questionObj.universityType }),
          ...(questionObj.unit && { unit: questionObj.unit }),
          ...(questionObj.jobType && { jobType: questionObj.jobType }),
          ...(questionObj.jobName && { jobName: questionObj.jobName }),
        };

        let URL = "/category";
        // console.log('from questionAPI', queryParams);

        if (queryParams.type) {
          URL = Object.entries(queryParams).reduce(
            (acc, [key, value], index) => {
              const prefix = index === 0 ? "?" : "&";
              return `${acc}${prefix}${key}=${value}`;
            },
            URL
          );
        }
        console.log('from courseAPI', URL);
        return {
          url: URL,
          method: "GET",
        };
      },
    }),
    approveCourseStatus: builder.mutation({
      query: ({ courseId, data }) => ({
        url: `/course/approve/${courseId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Courses"],
    }),
    deleteCourse: builder.mutation({
      query: ({ courseId }) => {
        return {
          url: `/course/${courseId}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Courses"],
    }),
    deleteLessonFromDB: builder.mutation({
      query: ({ lessonId }) => {
        console.log('recieved lesson id in redux', lessonId);
        return {
          url: `/lesson/${lessonId}`,
          method: 'DELETE'
        };
      },
      invalidatesTags: ['Lessons']
    }),
    updateLesson: builder.mutation({
      query: ({ lessonId, data }) => ({
        url: `/lesson/${lessonId}`,
        method: 'PATCH',
        body: data
      }),
      invalidatesTags: ['Lessons']
    }),
    getAllStudentPerformance: builder.query({
      query: ({ courseId }) => ({
        url: `/leaderboard/course/${courseId}`,
        method: 'GET'
      }),
      providesTags: ['StudentPerformance']
    }),
    getStudentPerformanceDetails: builder.query({
      query: ({ studentId, courseId }) => ({
        url: `/leaderboard/${courseId}/${studentId}`,
        method: 'GET'
      }),
    })
  }),
});


export const { useSaveCourseMutation, useSaveLessonMutation, useGetLessonsByCourseIdQuery, useGetCourseByIdQuery, useGetCategoryForCourseQuery, useGetCourseByTeacherQuery, useGetCoursePreviewQuery, useDeleteCourseMutation, useGetCourseForAdminEndQuery, useApproveCourseStatusMutation, useDeleteLessonFromDBMutation, useUpdateLessonMutation, useGetAllStudentPerformanceQuery, useGetStudentPerformanceDetailsQuery } = courseApi;