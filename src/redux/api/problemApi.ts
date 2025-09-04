import { apiSlice } from "./api";
import type { SubmitProblemResponse } from "@/types/problem";

type SubmitProblemArgs = {
  data: FormData;
};

export const problemApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    submitProblem: builder.mutation<SubmitProblemResponse, SubmitProblemArgs>({
      query: ({ data }) => ({
        url: "/api/user/problem/submit",
        method: "POST",
        body: data,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useSubmitProblemMutation } = problemApi;
