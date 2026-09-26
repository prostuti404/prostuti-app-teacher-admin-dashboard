import { baseApi } from "../../api/baseApi";

const userManagementAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all admins
    getAllAdmins: builder.query({
      query: () => ({
        url: "/admin/all-admins",
        method: "GET",
      }),
      providesTags: ["Admins"],
    }),

    // Create Admin
    createAdmin: builder.mutation({
      query: (data) => ({
        url: "/user/create-admin",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Admins"],
    }),

    // Delete Admin
    deleteAdmin: builder.mutation({
      query: (id) => ({
        url: `/admin/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Admins"],
    }),
  }),
});

export const {
  useGetAllAdminsQuery,
  useCreateAdminMutation,
  useDeleteAdminMutation,
} = userManagementAPI;
