// src/store/moduleApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const moduleApi = createApi({
  reducerPath: "moduleApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/modules`,
  }),
  tagTypes: ["Module"],
  endpoints: (builder) => ({
    getModules: builder.query({
      query: (courseId) => `?courseId=${courseId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Module", id: _id })),
              { type: "Module", id: "LIST" },
            ]
          : [{ type: "Module", id: "LIST" }],
    }),

    getModuleById: builder.query({
      query: (moduleId) => `/${moduleId}`,
      providesTags: (result, error, id) => [{ type: "Module", id }],
    }),

    createModule: builder.mutation({
      query: (newModule) => ({
        url: "/",
        method: "POST",
        body: newModule,
      }),
      invalidatesTags: [{ type: "Module", id: "LIST" }],
    }),

    updateModule: builder.mutation({
      query: ({ moduleId, ...updateData }) => ({
        url: `/${moduleId}`,
        method: "PUT",
        body: updateData,
      }),
      invalidatesTags: (result, error, { moduleId }) => [
        { type: "Module", id: moduleId },
      ],
    }),

    deleteModule: builder.mutation({
      query: (moduleId) => ({
        url: `/${moduleId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Module", id }],
    }),
  }),
});

export const {
  useGetModulesQuery,
  useGetModuleByIdQuery,
  useCreateModuleMutation,
  useUpdateModuleMutation,
  useDeleteModuleMutation,
} = moduleApi;
