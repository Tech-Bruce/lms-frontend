import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const instructorApi = createApi({
  reducerPath: "instructorApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api" }),
  tagTypes: ["Instructor"],
  endpoints: (builder) => ({
    createProfile: builder.mutation({
      query: (data) => ({
        url: "/instructors/profile",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Instructor"],
    }),
    getProfile: builder.query({
      query: (id) => `/instructors/profile/${id}`,
      providesTags: ["Instructor"],
    }),
  }),
});

export const { useCreateProfileMutation, useGetProfileQuery } = instructorApi;
