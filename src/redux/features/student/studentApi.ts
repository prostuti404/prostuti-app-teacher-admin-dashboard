import { baseApi } from "../../api/baseApi";

interface StudentFilters {
    mainCategory?: string;
    subCategory?: string;
    isSubscribed?: string;
    searchTerm?: string;
}

const studentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllStudents: builder.query<unknown, StudentFilters>({
            query: ({ mainCategory, subCategory, isSubscribed, searchTerm } = {}) => {
                const params = new URLSearchParams();
                if (mainCategory) params.append("mainCategory", mainCategory);
                if (subCategory) params.append("subCategory", subCategory);
                if (isSubscribed !== undefined && isSubscribed !== "") params.append("isSubscribed", isSubscribed);
                if (searchTerm) params.append("searchTerm", searchTerm);
                return {
                    url: `/student?${params.toString()}`,
                    method: "GET",
                };
            },
            providesTags: ["Students"],
        }),
    }),
});

export const { useGetAllStudentsQuery } = studentApi;
