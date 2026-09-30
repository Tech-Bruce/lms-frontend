import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const mentorshipApi = createApi({
  reducerPath: "mentorshipApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_API_URL}/mentorship` }),
  endpoints: (builder) => ({
    getMentors: builder.query({
      query: () => "/mentors",
    }),
    getMentorSlots: builder.query({
      query: (mentorId) => `/mentor/${mentorId}`,
    }),
    createSlot: builder.mutation({
      query: (data) => ({
        url: "/slots",
        method: "POST",
        body: data,
      }),
    }),
    bookSlot: builder.mutation({
      query: (data) => ({
        url: "/book",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetMentorsQuery,
  useGetMentorSlotsQuery,
  useCreateSlotMutation,
  useBookSlotMutation,
} = mentorshipApi;
