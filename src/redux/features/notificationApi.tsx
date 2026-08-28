import { baseApi } from "../api/baseApi";

const notificationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Get all notifications for the current user
        getMyNotifications: builder.query({
            query: (filters) => {
                const queryParams = new URLSearchParams();

                if (filters?.page) queryParams.set('page', filters.page.toString());
                if (filters?.limit) queryParams.set('limit', filters.limit.toString());
                if (filters?.sortBy) queryParams.set('sortBy', filters.sortBy);
                if (filters?.sortOrder) queryParams.set('sortOrder', filters.sortOrder);
                if (filters?.isRead !== undefined) queryParams.set('isRead', filters.isRead.toString());
                if (filters?.type) queryParams.set('type', filters.type);
                if (filters?.resourceType) queryParams.set('resourceType', filters.resourceType);
                if (filters?.searchTerm) queryParams.set('searchTerm', filters.searchTerm);

                return {
                    url: `/notifications/my-notifications?${queryParams.toString()}`,
                    method: 'GET',
                };
            },
            providesTags: ['Notifications']
        }),

        // Get unread notification count
        getUnreadNotificationCount: builder.query({
            query: () => {
                return {
                    url: '/notifications/unread-count',
                    method: 'GET',
                };
            },
            providesTags: ['Notifications']
        }),

        // Mark a notification as read
        markNotificationAsRead: builder.mutation({
            query: (notificationId) => {
                return {
                    url: `/notifications/mark-as-read/${notificationId}`,
                    method: 'PATCH',
                };
            },
            invalidatesTags: ['Notifications']
        }),

        // Mark all notifications as read
        markAllNotificationsAsRead: builder.mutation({
            query: () => {
                return {
                    url: '/notifications/mark-all-as-read',
                    method: 'PATCH',
                };
            },
            invalidatesTags: ['Notifications']
        }),

        // Request an edit (Admin only)
        requestEdit: builder.mutation({
            query: (requestData) => {
                return {
                    url: '/edit-requests',
                    method: 'POST',
                    body: requestData
                };
            },
            invalidatesTags: ['Notifications', 'EditRequests']
        }),

        // Get my edit requests (Admin only)
        getMyEditRequests: builder.query({
            query: (filters) => {
                const queryParams = new URLSearchParams();

                if (filters?.page) queryParams.set('page', filters.page.toString());
                if (filters?.limit) queryParams.set('limit', filters.limit.toString());
                if (filters?.sortBy) queryParams.set('sortBy', filters.sortBy);
                if (filters?.sortOrder) queryParams.set('sortOrder', filters.sortOrder);
                if (filters?.resourceType) queryParams.set('resourceType', filters.resourceType);
                if (filters?.searchTerm) queryParams.set('searchTerm', filters.searchTerm);

                return {
                    url: `/edit-requests/my-requests?${queryParams.toString()}`,
                    method: 'GET',
                };
            },
            providesTags: ['EditRequests']
        }),

        // Send bulk notification (Admin only)
        sendBulkNotification: builder.mutation({
            query: (payload) => ({
                url: '/notifications/send-bulk',
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['Notifications'],
        }),
    }),
});

export const {
    useGetMyNotificationsQuery,
    useGetUnreadNotificationCountQuery,
    useMarkNotificationAsReadMutation,
    useMarkAllNotificationsAsReadMutation,
    useRequestEditMutation,
    useGetMyEditRequestsQuery,
    useSendBulkNotificationMutation
} = notificationApi;