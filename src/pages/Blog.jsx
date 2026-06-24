import React, { useEffect, useState } from "react";

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:8000/api/v1/blogs";
  const BASE_URL = "http://localhost:8000"; // for images/videos/docs

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setBlogPosts(data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Skeleton loader component
  const SkeletonLoader = () => (
    <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="flex flex-col rounded-xl shadow-lg overflow-hidden bg-white border border-gray-100 animate-pulse"
        >
          <div className="w-full h-60 bg-gray-200"></div>
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
            <div className="mt-6 flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gray-200"></div>
              </div>
              <div className="ml-3 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-24"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Cyber Security Brigade <span className="text-blue-600">Blog</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
            Insights, tutorials, and news from the cybersecurity world
          </p>
        
        </div>

        {loading ? (
          <SkeletonLoader />
        ) : blogPosts.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center rounded-full bg-gray-100 p-4 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No blog posts available</h3>
            <p className="text-gray-500">Check back later for new content.</p>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2">
            {blogPosts.map((post) => (
              <div
                key={post._id}
                className="flex flex-col rounded-xl shadow-lg overflow-hidden bg-white border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                {/* Poster (Image) */}
                {post.type === "poster" && (
                  <div className="relative overflow-hidden">
                    <img
                      src={`${BASE_URL}${post.fileUrl}`}
                      alt={post.title}
                      className="w-full h-60 object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {post.type}
                      </span>
                    </div>
                  </div>
                )}

                {/* Video */}
                {post.type === "video" && (
                  <div className="relative">
                    <video
                      controls
                      className="w-full h-60 object-contain bg-gray-900"
                      poster={`${BASE_URL}${post.thumbnailUrl || ''}`}
                    >
                      <source
                        src={`${BASE_URL}${post.fileUrl}`}
                        type="video/mp4"
                      />
                      <source
                        src={`${BASE_URL}${post.fileUrl}`}
                        type="video/webm"
                      />
                      Your browser does not support the video tag.
                    </video>
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {post.type}
                      </span>
                    </div>
                  </div>
                )}

                {/* Document */}
                {post.type === "document" && (
                  <div className="relative">
                    <a
                      href={`${BASE_URL}${post.fileUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full h-60 flex flex-col items-center justify-center bg-gray-100 text-blue-600 font-semibold hover:bg-gray-200 transition-colors duration-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>View Document</span>
                    </a>
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {post.type}
                      </span>
                    </div>
                  </div>
                )}

                {/* Blog Details */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="mt-3 text-gray-600 line-clamp-3">
                      {post.description}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center pt-4 border-t border-gray-100">
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white font-medium shadow-sm">
                        {post.createdBy ? post.createdBy.charAt(0).toUpperCase() : "A"}
                      </span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {post.createdBy || "Unknown Author"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;