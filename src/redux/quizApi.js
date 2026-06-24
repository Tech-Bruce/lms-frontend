// src/redux/quizApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const quizApi = createApi({
    reducerPath: "quizApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_API_URL}/quizzes`,
    }),
    tagTypes: ["Quiz"],
    endpoints: (builder) => ({
        // Create quiz
        createQuiz: builder.mutation({
            query: (data) => ({
                url: "/",
                method: "POST",
                body: data, // plain JSON
            }),
            invalidatesTags: ["Quiz"],
        }),

        // Update quiz
        updateQuiz: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/quiz/${id}`,
                method: "PUT",
                body: data, // plain JSON
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Quiz", id }],
        }),
        // Get quizzes by lesson
        getQuizzesByLesson: builder.query({
            query: (lessonId) => `/${lessonId}`,
            providesTags: (result, error, lessonId) => [{ type: "Quiz", id: lessonId }],
        }),

        // Get quiz by ID
        getQuizById: builder.query({
            query: (id) => `/quiz/${id}`,
            providesTags: (result, error, id) => [{ type: "Quiz", id }],
        }),

        // Delete quiz
        deleteQuiz: builder.mutation({
            query: (id) => ({
                url: `/quiz/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, id) => [{ type: "Quiz", id }],
        }),
    }),
});

export const {
    useCreateQuizMutation,
    useGetQuizzesByLessonQuery,
    useGetQuizByIdQuery,
    useUpdateQuizMutation,
    useDeleteQuizMutation,
} = quizApi;
