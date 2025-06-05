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


    }),
});

export const { useGetAllQuestionPatternsQuery } = practiceTestApi;
