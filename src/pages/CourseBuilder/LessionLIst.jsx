import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Pencil, X, Plus } from "lucide-react";
import {
  useGetLessonsByModuleIdQuery,
  useDeleteLessonMutation,
} from "../../redux/LessionApi";
import { useGetQuizzesByLessonQuery, useDeleteQuizMutation } from "../../redux/quizApi";
import { toast } from "react-toastify";
import QuizForm from "./QuizForm";

const LessonList = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();

  const { data: lessons = [], isLoading, isError, refetch } =
    useGetLessonsByModuleIdQuery(moduleId);

  const [deleteLesson] = useDeleteLessonMutation();
  const [deleteQuiz] = useDeleteQuizMutation();

  const [showQuizForm, setShowQuizForm] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  // fetch quizzes only when a lesson is selected
  const {
    data: quizzes = [],
    isLoading: isLoadingQuizzes,
    refetch: refetchQuizzes,
  } = useGetQuizzesByLessonQuery({ lessonId: selectedLessonId }, {
    skip: !selectedLessonId,
  });


  if (!moduleId) return <p>No module selected</p>;
  if (isLoading) return <p>Loading lessons...</p>;
  if (isError) return <p>Error loading lessons</p>;

  const handleDeleteLesson = async (id) => {
    if (window.confirm("Are you sure you want to delete this lesson?")) {
      try {
        await deleteLesson(id).unwrap();
        toast.success("Lesson deleted");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || "Failed to delete lesson");
      }
    }
  };

  const handleOpenQuizForm = (e, lessonId, quiz = null) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedLessonId(lessonId);
    setSelectedQuiz(quiz);
    setShowQuizForm(true);
  };
    console.log("Opening quiz form for lesson:", selectedLessonId, "with quiz:", selectedQuiz);

  const handleDeleteQuiz = async (quizId) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      try {
        await deleteQuiz(quizId).unwrap();
        toast.success("Quiz deleted");
        refetchQuizzes();
      } catch (err) {
        toast.error(err?.data?.message || "Failed to delete quiz");
      }
    }
  };

  const handleQuizSaved = () => {
    toast.success("Quiz saved successfully");
    setShowQuizForm(false);
    refetchQuizzes();
  };

  return (
    <div className="min-h-screen p-10 space-y-6 bg-slate-50">
      {/* Quiz Modal */}
      {showQuizForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <QuizForm
              lessonId={selectedLessonId}
              initialQuiz={selectedQuiz}
              onCancel={() => setShowQuizForm(false)}
              onQuizSaved={handleQuizSaved}
            />
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Lessons</h2>
        <button
          onClick={() => navigate(`/modules/${moduleId}/lessons/create`)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded"
        >
          <Plus size={18} /> Add Lesson
        </button>
      </div>

      {/* Lessons Grid */}
      {lessons.length === 0 ? (
        <p className="text-gray-600">No lessons yet</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lessons.map((lesson) => (
            <div
              key={lesson._id}
              className="relative bg-white p-4 rounded shadow hover:shadow-md transition"
            >
              {/* Actions */}
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() =>
                    navigate(`/modules/${moduleId}/lessons/${lesson._id}/edit`)
                  }
                  className="text-blue-600 hover:text-blue-800"
                  title="Edit"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDeleteLesson(lesson._id)}
                  className="text-red-600 hover:text-red-800"
                  title="Delete"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Content */}
              <h3 className="font-medium mb-1">{lesson.title}</h3>
              <p className="text-sm text-gray-500">
                Type: {lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1)}
              </p>

              {/* Show Add/Edit Quiz for quiz lessons */}
              {lesson.type === "quiz" && (
                <div className="mt-3">
                  {isLoadingQuizzes && selectedLessonId === lesson._id ? (
                    <p className="text-xs text-gray-400">Loading quizzes...</p>
                  ) : quizzes.length > 0 && selectedLessonId === lesson._id ? (
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold">Quizzes</h4>
                      <ul className="space-y-1">
                        {quizzes.map((quiz) => (
                          <li
                            key={quiz._id}
                            className="flex justify-between items-center bg-gray-100 px-2 py-1 rounded"
                          >
                            <span className="text-sm">{quiz.title}</span>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleOpenQuizForm(lesson._id, quiz)}
                                className="text-blue-600 hover:text-blue-800 text-xs"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteQuiz(quiz._id)}
                                className="text-red-600 hover:text-red-800 text-xs"
                              >
                                Delete
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => handleOpenQuizForm(e, lesson._id)}
                      className="mt-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded text-sm"
                    >
                      Add Quiz
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LessonList;
