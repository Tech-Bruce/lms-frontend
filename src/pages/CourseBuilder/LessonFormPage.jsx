import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LessonForm from "./LessonForm";
import { useGetLessonByIdQuery } from "../../redux/LessionApi";

const LessonFormPage = () => {
  const { moduleId, lessonId } = useParams();
  const navigate = useNavigate();

  const { data: lessonData, isLoading } = useGetLessonByIdQuery(lessonId, {
    skip: !lessonId,
  });

  const [initialValues, setInitialValues] = useState({
    title: "",
    content: "",
    videoUrl: "",
    pdfUrl: "",
    type: "video",
    order: 1,
    duration: 0,
  });

  useEffect(() => {
    if (lessonId && lessonData) {
      setInitialValues(lessonData);
    }
  }, [lessonId, lessonData]);

  const handleSuccess = () => {
    navigate(`/modules/${moduleId}/lessons`);
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="w-full min-h-screen p-10 bg-slate-50">
      <div className="bg-white p-6 rounded shadow  mx-auto">
        <h2 className="text-lg font-bold mb-4">
          {lessonId ? "Edit Lesson" : "Add Lesson"}
        </h2>
        <LessonForm
          moduleId={moduleId}
          initialValues={initialValues}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
};

export default LessonFormPage;
