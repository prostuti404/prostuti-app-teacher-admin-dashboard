import {baseApi} from "../api/baseApi.ts";


const questionPatternApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createQuestionPattern: builder.mutation({
            query: (data) => {
                return {
                    url: '/question-pattern/create-question-pattern',
                    method: 'POST',
                    body: data
                };
            },
            invalidatesTags: ['QuestionPatterns']
        }),
        getAllQuestionPatterns: builder.query({
            query: ({ page = 1, limit = 100 }) => {
                return {
                    url: `/all-question-pattern/?page=${page}&limit=${limit}`,
                    method: 'GET',
                };
            },
            providesTags: ['QuestionPatterns']
        }),
        getQuestionPatternById: builder.query({
            query: (id) => {
                return {
                    url: `/question-pattern/${id}`,
                    method: 'GET',
                };
            },
            providesTags: ['QuestionPatterns']
        }),
        updateQuestionPattern: builder.mutation({
            query: ({ id, body }) => {
                return {
                    url: `/single-question-pattern/${id}`,
                    method: 'PATCH',
                    body
                };
            },
            invalidatesTags: ['QuestionPatterns']
        }),
        deleteQuestionPattern: builder.mutation({
            query: (id) => {
                return {
                    url: `/question-pattern/${id}`,
                    method: 'DELETE',
                };
            },
            invalidatesTags: ['QuestionPatterns']
        }),
    })
});

export const {
    useCreateQuestionPatternMutation,
    useGetAllQuestionPatternsQuery,
    useGetQuestionPatternByIdQuery,
    useUpdateQuestionPatternMutation,
    useDeleteQuestionPatternMutation
} = questionPatternApi;