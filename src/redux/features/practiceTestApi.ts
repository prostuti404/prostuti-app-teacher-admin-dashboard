// src/redux/features/practiceTest/practiceTestApi.ts
import { baseApi } from "../api/baseApi";

export const practiceTestApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllQuestionPatterns: builder.query<any, void>({
            query: () => ({
                url: "/question-pattern/all-question-pattern",
                method: "GET",
            }),
            providesTags: ["QuestionPatterns"],
        }),
        getQuestionPatternById: builder.query<any, string>({
            query: (id) => ({
                url: `/question-pattern/single-question-pattern/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "QuestionPatterns", id }],
        }),
        deleteQuestionPattern: builder.mutation({
            query: (id) => ({
                url: `/question-pattern/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["QuestionPatterns"],
        })
    }),
});

export const { useGetAllQuestionPatternsQuery, useGetQuestionPatternByIdQuery, useDeleteQuestionPatternMutation } = practiceTestApi;
