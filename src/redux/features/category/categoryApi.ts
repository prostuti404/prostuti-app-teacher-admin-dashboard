import { baseApi } from "../../api/baseApi";

const categoryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllCategoryTypes: builder.query({
            query: () => {
                return {
                    url: '/category/type',
                    method: 'GET',
                };
            },
            providesTags: ['Categories']
        }),
        getUnits: builder.query({
            query: () => {
                return {
                    url: '/category/unit',
                    method: 'GET',
                };
            },
            providesTags: ['Categories']
        }),
        getJobTypes: builder.query({
            query: () => {
                return {
                    url: '/category/job-type',
                    method: 'GET',
                };
            },
            providesTags: ['Categories']
        }),
        getJobNames: builder.query({
            query: () => {
                return {
                    url: '/category/job-name',
                    method: 'GET',
                };
            },
            providesTags: ['Categories']
        }),
        getCategoryById: builder.query({
            query: ({ id }) => {
                return {
                    url: `/category/${id}`,
                    method: 'GET',
                };
            },
            providesTags: ['Categories']
        }),
        getAllCategories: builder.query({
            query: ({ page = 1, limit = 100 }) => {
                return {
                    url: `/category?page=${page}&limit=${limit}`,
                    method: 'GET',
                };
            },
            providesTags: ['Categories']
        }),
        createCategory: builder.mutation({
            query: (questions) => {
                return {
                    url: '/category',
                    method: 'POST',
                    body: questions
                };
            },
            invalidatesTags: ['Categories']
        }),
        updateCategory: builder.mutation({
            query: ({ id, body }) => {
                return {
                    url: `/category/${id}`,
                    method: 'PATCH',
                    body
                };
            },
            invalidatesTags: ['Categories']
        }),
        deleteCategory: builder.mutation({
            query: (id) => {
                return {
                    url: `/category/${id}`,
                    method: 'DELETE',
                };
            },
            invalidatesTags: ['Categories']
        }),
    })
});

export const {
    useGetAllCategoryTypesQuery,
    useGetAllCategoriesQuery,
    useGetCategoryByIdQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    useGetUnitsQuery,
    useGetJobTypesQuery,
    useGetJobNamesQuery
} = categoryApi;