import { apiSlice } from "./api";

type AuthResponse = { message: string };

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
  }),
  overrideExisting: false,
});

export const {
  useSignupMutation,
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
