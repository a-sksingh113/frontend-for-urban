import { User } from "@/types/user";
import { apiSlice } from "./api";

type AuthResponse = { message: string };

export type UpdateProfileRequest = Partial<
  Pick<
    User,
    | "fullName"
    | "phone"
    | "city"
    | "state"
    | "country"
    | "zipCode"
    | "profilePhoto"
  >
>;

export type UpdateProfileResponse = {
  message: string;
  user?: User;
};

export type ChangePasswordRequest = {
  oldPassword: string;
  newPassword: string;
};

export type ChangePasswordResponse = {
  success?: boolean;
  message: string;
};
export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation<AuthResponse, { email: string; password: string }>(
      {
        query: (data) => ({
          url: "/api/auth/signup",
          method: "POST",
          body: data,
        }),
      }
    ),
    login: builder.mutation<AuthResponse, { email: string; password: string }>({
      query: (data) => ({
        url: "/api/auth/login",
        method: "POST",
        body: data,
      }),
    }),

    logout: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: "/api/auth/logout",
        method: "POST",
      }),
    }),

    forgotPassword: builder.mutation<AuthResponse, { email: string }>({
      query: ({ email }) => ({
        url: "/api/auth/forgot-password",
        method: "POST",
        body: { email },
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ resetToken, password }) => ({
        url: `/api/auth/reset-password/${resetToken}`,
        method: "POST",
        body: {
          newPassword: password,
        },
      }),
    }),
    verifyEmail: builder.mutation<{ message: string }, { token: string }>({
      query: ({ token }) => ({
        url: `/api/auth/verify-email/${encodeURIComponent(token)}`,
        method: "GET",
      }),
    }),
    resendVerifyEmail: builder.mutation<AuthResponse, { email: string }>({
      query: ({ email }) => ({
        url: "/api/auth/resend-verification",
        method: "POST",
        body: { email },
      }),
    }),

    updateProfile: builder.mutation<
      UpdateProfileResponse,
      UpdateProfileRequest
    >({
      query: (data) => ({
        url: "/api/user/profile",
        method: "PATCH",
        body: data,
      }),
    }),

    changePassword: builder.mutation<
      ChangePasswordResponse,
      ChangePasswordRequest
    >({
      query: (body) => ({
        url: "/api/user/change-password",
        method: "POST",
        body,
      }),
    }),
  }),

  overrideExisting: false,
});

export const {
  useSignupMutation,
  useLoginMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
  useResendVerifyEmailMutation,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = authApi;
