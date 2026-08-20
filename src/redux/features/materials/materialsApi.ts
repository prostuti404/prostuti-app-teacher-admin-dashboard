import { baseApi } from "../../api/baseApi";

const materialApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createRecordClass: builder.mutation({
            query: (recordClassData) => {
                return {
                    url: '/recoded-class',
                    method: 'POST',
                    body: recordClassData
                };
            },
            invalidatesTags: ['Record']
        }),
        getRecordClassById: builder.query({
            query: ({ recordId }) => {
                return {
                    url: `/recoded-class/${recordId}`,
                    method: 'GET',
                };
            },
            providesTags: ['Record'],
        }),
        updateRecordClass: builder.mutation({
            query: ({ recordClassData, recordClassId }) => {
                return {
                    url: `/recoded-class/${recordClassId}`,
                    method: 'PATCH',
                    body: recordClassData
                };
            },
            invalidatesTags: ['Record']
        }),
        deleteRecordClass: builder.mutation({
            query: ({ recordClassId }) => {
                return {
                    url: `/recoded-class/${recordClassId}`,
                    method: 'DELETE',
                };
            },
            invalidatesTags: ['Record']
        }),
        // resource operations
        createResource: builder.mutation({
            query: (resourceData) => {
                // console.log('Data received in API call:', resourceData.get('files'));
                return {
                    url: '/resource',
                    method: 'POST',
                    body: resourceData
                };
            },
            invalidatesTags: ['Resource']
        }),
        getResourceById: builder.query({
            query: ({ resourceId }) => {
                return {
                    url: `/resource/${resourceId}`,
                    method: 'GET',
                };
            },
            providesTags: ['Resource'],
        }),
        updateResource: builder.mutation({
            query: ({ resourceData, resourceId }) => {
                return {
                    url: `/resource/${resourceId}`,
                    method: 'PATCH',
                    body: resourceData
                };
            },
            invalidatesTags: ['Resource']
        }),
        deleteResource: builder.mutation({
            query: ({ resourceId }) => {
                return {
                    url: `/resource/${resourceId}`,
                    method: 'DELETE',
                };
            },
            invalidatesTags: ['Resource']
        }),
        // assignment operations
        createAssignment: builder.mutation({
            query: (assignmentData) => {
                return {
                    url: '/assignment',
                    method: 'POST',
                    body: assignmentData
                };
            },
            invalidatesTags: ['Assignment']
        }),
        getAssignmentById: builder.query({
            query: ({ assignmentId }) => {
                return {
                    url: `/assignment/${assignmentId}`,
                    method: 'GET',
                };
            },
            providesTags: ['Assignment'],
        }),
        updateAssignment: builder.mutation({
            query: ({ assignmentData, assignmentId }) => {
                return {
                    url: `/assignment/${assignmentId}`,
                    method: 'PATCH',
                    body: assignmentData
                };
            },
            invalidatesTags: ['Assignment']
        }),
        getSubmittedAssignmentList: builder.query({
            query: ({ courseId, assignmentId }) => ({
                url: `/assignment-submission/${courseId}/${assignmentId}`,
                method: 'GET'
            }),
            providesTags: ['AssignmentSubmission']
        }),
        // test operations
        createTest: builder.mutation({
            query: (testData) => {
                return {
                    url: '/test',
                    method: 'POST',
                    body: testData
                };
            },
            invalidatesTags: ['Test']
        }),

        getSingleTest: builder.query({
            query: ({ testId }) => {
                return {
                    url: `/test/${testId}`,
                    method: 'GET'
                };
            },
            providesTags: ['Test']
        }),

        updateTest: builder.mutation({
            query: ({ testId, testData }) => {
                return {
                    url: `/test/${testId}`,
                    method: 'PATCH',
                    body: testData
                };
            },
            invalidatesTags: ['Test']
        }),

        getTestHistory: builder.query({
            query: ({ testId }) => {
                return {
                    url: `/test-history/all-test-history?test_id=${testId}`,
                    method: 'GET'
                };
            }
        }),

        // New endpoint for submitting written test marks
        submitWrittenTestMarks: builder.mutation({
            query: (markData) => {
                return {
                    url: '/test-history/preview-written-test',
                    method: 'PATCH',
                    body: markData
                };
            },
            invalidatesTags: ['Test']
        }),

        // notice operations
        getNoticesOfACourse: builder.query({
            query: ({ courseId }) => {
                return {
                    url: `/notice/course/${courseId}`,
                    method: 'GET',
                };
            },
            providesTags: ['Notice']
        }),
        getNoticeById: builder.query({
            query: ({ noticeId }) => {
                return {
                    url: `/notice/${noticeId}`,
                    method: 'GET'
                };
            }
        }),
        createNotice: builder.mutation({
            query: (noticeData) => {
                return {
                    url: '/notice',
                    method: 'POST',
                    body: noticeData
                };
            },
            invalidatesTags: ['Notice']
        }),
        updateNotice: builder.mutation({
            query: ({ updateNoticeData, noticeId }) => {
                return {
                    url: `/notice/${noticeId}`,
                    method: 'PATCH',
                    body: updateNoticeData
                };
            },
            invalidatesTags: ['Notice']
        }),
        deleteNotice: builder.mutation({
            query: ({ noticeId }) => {
                return {
                    url: `/notice/${noticeId}`,
                    method: 'DELETE',
                };
            },
            invalidatesTags: ['Notice']
        }),
        createRoutine: builder.mutation({
            query: (routineData) => ({
                url: '/routine',
                method: 'POST',
                body: routineData
            }),
            invalidatesTags: ['Routine']
        }),
        getAllRoutines: builder.query({
            query: (params) => ({
                url: '/routine',
                method: 'GET',
                params
            }),
            providesTags: ['Routine']
        }),
        publishRoutine: builder.mutation({
            query: ({ id, isPublished }) => ({
                url: `/routine/${id}`,
                method: 'PATCH',
                body: { isPublished }
            }),
            invalidatesTags: ['Routine']
        })
    })
});

export const {
    useCreateRecordClassMutation,
    useCreateResourceMutation,
    useCreateAssignmentMutation,
    useCreateTestMutation,
    useGetRecordClassByIdQuery,
    useUpdateRecordClassMutation,
    useGetAssignmentByIdQuery,
    useUpdateAssignmentMutation,
    useGetResourceByIdQuery,
    useUpdateResourceMutation,
    useDeleteRecordClassMutation,
    useDeleteResourceMutation,
    useCreateNoticeMutation,
    useGetNoticesOfACourseQuery,
    useGetNoticeByIdQuery,
    useUpdateNoticeMutation,
    useDeleteNoticeMutation,
    useGetSingleTestQuery,
    useUpdateTestMutation,
    useGetTestHistoryQuery,
    useGetSubmittedAssignmentListQuery,
    useSubmitWrittenTestMarksMutation,
    useCreateRoutineMutation,
    useGetAllRoutinesQuery,
    usePublishRoutineMutation,
} = materialApi;