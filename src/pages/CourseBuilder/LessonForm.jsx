import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import RichTextEditor from "./RichTextEditor";
import {
  useCreateLessonMutation,
  useUpdateLessonMutation,
} from "../../redux/LessionApi";
import { toast } from "react-toastify";

const LessonForm = ({ moduleId, initialValues = {} }) => {
  const [createLesson] = useCreateLessonMutation();
  const [updateLesson] = useUpdateLessonMutation();

  const defaultValues = {
    title: "",
    type: "video",
    content: "",
    videoUrl: "",
    pdfFile: null, // ✅ store uploaded file
    order: 1,
    duration: 0,
    ...initialValues,
  };

  const validationSchema = Yup.lazy((values) => {
    let schema = {
      title: Yup.string().required("Lesson title is required"),
      type: Yup.string().required("Lesson type is required"),
      order: Yup.number().min(1, "Order must be at least 1").required("Order is required"),
      duration: Yup.number().min(0, "Duration cannot be negative"),
    };

    switch (values.type) {
      case "text":
        schema.content = Yup.string().required("Content is required for text lessons");
        break;
      case "video":
        schema.videoUrl = Yup.string()
          .url("Please enter a valid URL")
          .required("Video URL is required for video lessons");
        break;
      case "pdf":
        schema.pdfFile = Yup.mixed()
          .required("PDF file is required")
          .test("fileType", "Only PDF files are allowed", (file) =>
            !file || (file && file.type === "application/pdf")
          );
        break;
      default:
        break;
    }
    return Yup.object(schema);
  });

  return (
    <div className="mx-auto">
      <Formik
        enableReinitialize
        initialValues={defaultValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm, setSubmitting }) => {
          try {
            setSubmitting(true);

            // ✅ Build FormData instead of JSON
            const formData = new FormData();
            formData.append("title", values.title.trim());
            formData.append("type", values.type);
            formData.append("order", values.order);
            formData.append("duration", values.duration);

            if (values.type === "video") {
              formData.append("videoUrl", values.videoUrl.trim());
            }
            if (values.type === "text") {
              formData.append("content", values.content.trim());
            }
            if (values.type === "pdf" && values.pdfFile) {
              formData.append("pdfFile", values.pdfFile); // ✅ file append
            }

            let result;
            if (values._id) {
              result = await updateLesson({ id: values._id, data: formData }).unwrap();
              toast.success("Lesson updated successfully!");
            } else {
              if (!moduleId) {
                toast.error("Module ID is required to create a lesson");
                return;
              }
              formData.append("moduleId", moduleId);
              result = await createLesson(formData).unwrap();
              toast.success("Lesson created successfully!");
              resetForm();
            }

            console.log("Lesson saved:", result);
          } catch (error) {
            console.error("Lesson submission failed:", error);
            toast.error(error?.data?.message || error?.message || "Failed to save lesson");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, setFieldValue, setErrors, setTouched, isSubmitting, errors, touched }) => (
          <Form className="space-y-4 border p-4 rounded">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <Field
                name="title"
                className={`border p-2 w-full rounded ${
                  errors.title && touched.title ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter lesson title"
              />
              <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium mb-1">Type *</label>
              <Field
                as="select"
                name="type"
                className={`border p-2 w-full rounded ${
                  errors.type && touched.type ? "border-red-500" : "border-gray-300"
                }`}
                onChange={(e) => {
                  const newType = e.target.value;
                  setFieldValue("type", newType);
                  if (newType !== "video") setFieldValue("videoUrl", "");
                  if (newType !== "text") setFieldValue("content", "");
                  if (newType !== "pdf") setFieldValue("pdfFile", null);
                  setErrors({});
                  setTouched({});
                }}
              >
                <option value="video">Video</option>
                <option value="text">Text</option>
                <option value="pdf">PDF</option>
                <option value="quiz">Quiz</option>
              </Field>
              <ErrorMessage name="type" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Conditional fields */}
            {values.type === "video" && (
              <div>
                <label className="block text-sm font-medium mb-1">Video URL *</label>
                <Field
                  name="videoUrl"
                  className={`border p-2 w-full rounded ${
                    errors.videoUrl && touched.videoUrl ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="https://example.com/video.mp4"
                />
                <ErrorMessage name="videoUrl" component="div" className="text-red-500 text-sm mt-1" />
              </div>
            )}

            {values.type === "text" && (
              <div>
                <label className="block text-sm font-medium mb-1">Content *</label>
                <RichTextEditor
                  value={values.content || ""}
                  onChange={(html) => setFieldValue("content", html)}
                  placeholder="Enter lesson content..."
                />
                <ErrorMessage name="content" component="div" className="text-red-500 text-sm mt-1" />
              </div>
            )}

            {values.type === "pdf" && (
              <div>
                <label className="block text-sm font-medium mb-1">Upload PDF *</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setFieldValue("pdfFile", e.currentTarget.files[0])}
                  className="border p-2 w-full rounded"
                />
                {errors.pdfFile && touched.pdfFile && (
                  <div className="text-red-500 text-sm mt-1">{errors.pdfFile}</div>
                )}
              </div>
            )}

            {/* Order */}
            <div>
              <label className="block text-sm font-medium mb-1">Order *</label>
              <Field
                type="number"
                name="order"
                min="1"
                className={`border p-2 w-full rounded ${
                  errors.order && touched.order ? "border-red-500" : "border-gray-300"
                }`}
              />
              <ErrorMessage name="order" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
              <Field
                type="number"
                name="duration"
                min="0"
                className={`border p-2 w-full rounded ${
                  errors.duration && touched.duration ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="0"
              />
              <ErrorMessage name="duration" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className={`px-4 py-2 rounded text-white font-medium transition-colors ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? values._id
                    ? "Updating..."
                    : "Creating..."
                  : values._id
                  ? "Update Lesson"
                  : "Create Lesson"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LessonForm;
