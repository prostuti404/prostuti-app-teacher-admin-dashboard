import { baseApi } from "../../api/baseApi";

interface IQueryParams {
    type?: string;
    division?: string;
    subject?: string;
    chapter?: string;
    universityType?: string;
    universityName?: string;
    unit?: string;
    jobType?: string;
    jobName?: string;
}

const questionAPI = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCategory: builder.query({
            query: (questionObj: Record<string, string>) => {
                // filters: type: questionObj.category_0, division,subject, chapter
                // console.log('coming from the questionAPI', questionObj);
                const queryParams: IQueryParams = {
                    ...(questionObj.category && { type: questionObj.category }),
                    ...(questionObj.division && { division: questionObj.division }),
                    ...(questionObj.subject && { subject: questionObj.subject }),
                    ...(questionObj.chapter && { chapter: questionObj.chapter }),
                    ...(questionObj.universityType && { universityType: questionObj.universityType }),
                    ...(questionObj.universityName && { universityName: questionObj.universityName }),
                    ...(questionObj.unit && { unit: questionObj.unit }),
                    ...(questionObj.jobType && { jobType: questionObj.jobType }),
                    ...(questionObj.jobName && { jobName: questionObj.jobName }),
                };

                let URL = '/category?limit=0';
                // console.log('from questionAPI', queryParams);


                if (queryParams.type) {
                    URL = Object.entries(queryParams).reduce((acc, [key, value], index) => {
                        const prefix = index === 0 ? '?' : '&';
                        return `${acc}${prefix}${key}=${value}`;
                    }, URL);
                }
                return {
                    url: URL,
                    method: 'GET'
                };
            },
            providesTags: ['Categories']
        }),
        createQuestion: builder.mutation({
            query: (questionData) => {
                return {
                    url: '/question',
                    method: 'POST',
                    body: questionData
                };
            },
            invalidatesTags: ['Questions']
        }),
        // academic questions
        getAllAcademicQuestions: builder.query({
            query: (filters) => {
                let URL = `/question?categoryType=Academic&limit=0`;
                if (Object.keys(filters).length !== 0) {
                    URL = Object.entries(filters).reduce((acc, [key, value]) => {
                        const prefix = '&';
                        return `${acc}${prefix}${key}=${value}`;
                    }, URL);
                }
                console.log('URL from academic questionAPI', URL);
                return {
                    url: URL,
                    method: 'GET'
                };
            },
            providesTags: ['Questions']
        }),
        // job questions
        getAllJobQuestions: builder.query({
            query: (filters) => {
                let URL = `/question?categoryType=Job&limit=0`;
                if (Object.keys(filters).length !== 0) {
                    URL = Object.entries(filters).reduce((acc, [key, value]) => {
                        const prefix = '&';
                        return `${acc}${prefix}${key}=${value}`;
                    }, URL);
                }
                return {
                    url: URL,
                    method: 'GET'
                };
            },
            providesTags: ['Questions']
        }),
        // admission questions
        getAllAdmissionQuestions: builder.query({
            query: (filters) => {
                let URL = `/question?categoryType=Admission&limit=0`;
                if (Object.keys(filters).length !== 0) {
                    URL = Object.entries(filters).reduce((acc, [key, value]) => {
                        const prefix = '&';
                        return `${acc}${prefix}${key}=${value}`;
                    }, URL);
                }
                console.log('URL from admission questionAPI', URL);
                return {
                    url: URL,
                    method: 'GET'
                };
            },
            providesTags: ['Questions']
        }),
        getAllQuestions: builder.query({
            query: (filters) => {
                let URL = `/question`;
                console.log('filters sent to redux:', filters);
                if (Object.keys(filters).length !== 0) {
                    URL = Object.entries(filters).reduce((acc, [key, value], index) => {
                        const prefix = index === 0 ? '?' : '&';
                        return `${acc}${prefix}${key}=${value}`;
                    }, URL);
                }
                return {
                    url: `${URL}`,
                    method: 'GET'
                };
            },
            providesTags: ['Questions']
        }),
        deleteQuestion: builder.mutation({
            query: (id) => {
                return {
                    url: `/question/${id}`,
                    method: 'DELETE'
                };
            },
            invalidatesTags: ['Questions']
        })
    })
});

export const { useGetCategoryQuery, useCreateQuestionMutation, useGetAllAcademicQuestionsQuery, useGetAllQuestionsQuery, useDeleteQuestionMutation, useGetAllJobQuestionsQuery, useGetAllAdmissionQuestionsQuery } = questionAPI;