import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const lessonApi = createApi({
  reducerPath: 'lessonApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/lessons`,
  }),
  tagTypes: ['Lesson'],
  endpoints: (builder) => ({ 
    // Create lesson
    createLesson: builder.mutation({
      query: (lessonData) => ({
        url: '/',
        method: 'POST',
        body: lessonData,
      }),
      invalidatesTags: ['Lesson'],
    }),

    // Get all lessons
    getAllLessons: builder.query({
      query: () => '/',
      providesTags: ['Lesson'],
    }),

    // Get lessons by moduleId (fixed URL)
    getLessonsByModuleId: builder.query({
      query: (moduleId) => `/module/${moduleId}`,
      providesTags: ['Lesson'],
    }),

    // Get single lesson
    getLessonById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Lesson', id }],
    }),

    // Update lesson
    updateLesson: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: updateData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Lesson', id },
        'Lesson',
      ],
    }),

    // Delete lesson
    deleteLesson: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Lesson'],
    }),
  }),
});

export const {
  useCreateLessonMutation,
  useGetAllLessonsQuery,
  useGetLessonsByModuleIdQuery, // fixed hook name
  useGetLessonByIdQuery,
  useUpdateLessonMutation,
  useDeleteLessonMutation,
} = lessonApi;
