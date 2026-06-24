import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_API_URL;


export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["Blog"],
  endpoints: (builder) => ({
    getBlogs: builder.query({
      query: () => "blogs",
      providesTags: ["Blog"],
    }),
    createBlog: builder.mutation({
      query: (formData) => ({
        url: "blogs",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Blog"],
    }),
    updateBlog: builder.mutation({
      query: ({ id, formData }) => ({
        url: `blogs/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Blog"],
    }),
    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `blogs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Blog"],
    }),
  }),
});

export const {
  useGetBlogsQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogApi;
