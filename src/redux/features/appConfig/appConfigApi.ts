import { baseApi } from "../../api/baseApi";

interface AppConfig {
    isTrialEnabled: boolean;
    freeTrialDays: number;
    freeAccessFeatures: string[];
    featureLimits: Record<string, number>;
}

const appConfigApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAppConfig: builder.query<{ data: AppConfig }, void>({
            query: () => ({
                url: `/config`,
                method: "GET",
            }),
            providesTags: ["AppConfig"],
        }),
        updateAppConfig: builder.mutation<{ data: AppConfig }, Partial<AppConfig>>({
            query: (payload) => ({
                url: `/config`,
                method: "PATCH",
                body: payload,
            }),
            invalidatesTags: ["AppConfig"],
        }),
    }),
});

export const { useGetAppConfigQuery, useUpdateAppConfigMutation } = appConfigApi;
