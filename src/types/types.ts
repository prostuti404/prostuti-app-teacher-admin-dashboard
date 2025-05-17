export type TUserInfo = {
    email: string;
    password: string;
    rememberMe?: string;
};

export type TUser = {
    registeredId: string;
    exp: number;
    iat: number;
    role: string;
};

export type TUserData = {
    userId: string;
    exp: number;
    iat: number;
    role: string;
};

// error handling types
export interface TErrorData {
    errorSources: [
        {
            message: string;
            path: string;
        },
    ];
    message: string;
    success: boolean;
}

export interface TLoginError {
    status: number;
    data: TErrorData;
}
export interface TNetworkError {
    error: string;
    status: string;
}

export interface ICategory {
    subject: string;
    type: string;
    universityType?: string;
    universityName?: string;
    unit?: string;
    jobType?: string;
    jobName?: string;
    updatedAt?: string;
    __v?: number;
    _id: string;
    createdAt?: string;
    chapter: string;
    division: string;
}

export interface CourseState {
    testHistoryData: {
        history: any;
    },
    assignmentHistory: {
        history: any;
    },
    id: {
        course_id: string;
        lesson_id: string;
        test_id: string;
        assignment_id: string;
    };

}

export interface ISingleCategory {
    _id: string;
    type: string;
    subject?: string;
    division?: string;
    chapter?: string;
    universityType?: string;
    universityName?: string;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

export interface ISingleQuestion {
    _id: string;
    type: string;
    category_id: string;
    title: string;
    description: string;
    createdBy: string;
    updatedBy: string;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
    category?: ISingleCategory[];
}

export interface ICoursePreview {

}