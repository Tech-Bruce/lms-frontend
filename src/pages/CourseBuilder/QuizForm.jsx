import React from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import {
  useCreateQuizMutation,
  useUpdateQuizMutation,
} from "../../redux/quizApi";
import { toast } from "react-toastify";

const QuizForm = ({ lessonId, initialQuiz = null, onCancel }) => {
  const [createQuiz] = useCreateQuizMutation();
  const [updateQuiz] = useUpdateQuizMutation();

  const defaultValues = {
    title: "",
    questions: [
      {
        question: "",
        options: ["", "", "", ""],
        correctAnswerIndex: 0,
      },
    ],
    ...initialQuiz,
  };

  const validationSchema = Yup.object({
    title: Yup.string().required("Quiz title is required"),
    questions: Yup.array()
      .of(
        Yup.object({
          question: Yup.string().required("Question is required"),
          options: Yup.array()
            .of(Yup.string().required("Option cannot be empty"))
            .min(2, "At least 2 options are required")
            .max(6, "Maximum 6 options allowed"),
          correctAnswerIndex: Yup.number()
            .min(0, "Must select a correct answer")
            .required("Correct answer is required"),
        })
      )
      .min(1, "At least one question is required"),
  });

  const handleQuizSubmit = async (values, { setSubmitting }) => {
    try {
      setSubmitting(true);
      console.log("Submitting quiz:", values);
      console.log("Logging quiz data:", initialQuiz);
      console.log("Lesson ID:", lessonId);
      if (initialQuiz && initialQuiz._id) {
        await updateQuiz({ id: initialQuiz._id, ...values }).unwrap();
        toast.success("Quiz updated successfully");
      } else {
        if (!lessonId) {
          toast.error("Lesson ID is required to create a quiz");
          // return;
        }
        await createQuiz({ lessonId, ...values }).unwrap();
        toast.success("Quiz created successfully");
      }

      if (onCancel) onCancel();
    } catch (error) {
      console.error("Quiz submission failed:", error);

      let errorMessage = "Failed to save quiz. Please try again.";
      if (error?.data) {
        if (error.data.message) errorMessage = error.data.message;
        else if (error.data.error) errorMessage = error.data.error;
        else if (typeof error.data === "string") errorMessage = error.data;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 max-h-96 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {initialQuiz ? "Edit Quiz" : "Quiz Builder"}
        </h3>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ×
          </button>
        )}
      </div>

      <Formik
        initialValues={defaultValues}
        validationSchema={validationSchema}
        onSubmit={handleQuizSubmit}
      >
        {({ values, setFieldValue, isSubmitting, errors, touched }) => (
          <Form className="space-y-4">
            {/* Quiz Title */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Quiz Title <span className="text-red-500">*</span>
              </label>
              <Field
                name="title"
                className={`border p-2 w-full rounded ${
                  errors.title && touched.title
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Enter quiz title"
              />
              <ErrorMessage
                name="title"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Questions */}
            <FieldArray name="questions">
              {({ remove, push }) => (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-medium">
                      Questions <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        push({
                          question: "",
                          options: ["", "", "", ""],
                          correctAnswerIndex: 0,
                        })
                      }
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      Add Question
                    </button>
                  </div>

                  {values.questions.map((question, questionIndex) => (
                    <div
                      key={questionIndex}
                      className="border border-gray-200 rounded p-4 mb-4 bg-gray-50"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-gray-700">
                          Question {questionIndex + 1}
                        </h4>
                        {values.questions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => remove(questionIndex)}
                            className="text-red-500 hover:text-red-700 text-sm font-medium"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      {/* Question Text */}
                      <div className="mb-3">
                        <Field
                          name={`questions.${questionIndex}.question`}
                          as="textarea"
                          className={`border p-2 w-full rounded resize-none ${
                            errors.questions?.[questionIndex]?.question &&
                            touched.questions?.[questionIndex]?.question
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Enter your question here..."
                          rows="2"
                        />
                        <ErrorMessage
                          name={`questions.${questionIndex}.question`}
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      {/* Options */}
                      <div className="mb-3">
                        <label className="block text-sm font-medium mb-2">
                          Options:
                        </label>
                        <FieldArray name={`questions.${questionIndex}.options`}>
                          {({ remove: removeOption, push: pushOption }) => (
                            <div className="space-y-2">
                              {question.options.map((option, optionIndex) => (
                                <div
                                  key={optionIndex}
                                  className="flex items-center gap-2"
                                >
                                  <Field
                                    type="radio"
                                    name={`questions.${questionIndex}.correctAnswerIndex`}
                                    value={optionIndex}
                                    checked={
                                      question.correctAnswerIndex === optionIndex
                                    }
                                    onChange={() =>
                                      setFieldValue(
                                        `questions.${questionIndex}.correctAnswerIndex`,
                                        optionIndex
                                      )
                                    }
                                    className="text-green-600"
                                  />
                                  <Field
                                    name={`questions.${questionIndex}.options.${optionIndex}`}
                                    className={`border p-2 flex-1 rounded ${
                                      errors.questions?.[questionIndex]
                                        ?.options?.[optionIndex] &&
                                      touched.questions?.[questionIndex]
                                        ?.options?.[optionIndex]
                                        ? "border-red-500"
                                        : "border-gray-300"
                                    }`}
                                    placeholder={`Option ${optionIndex + 1}`}
                                  />
                                  {question.options.length > 2 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        removeOption(optionIndex);
                                        // Adjust correct answer index
                                        if (
                                          question.correctAnswerIndex >=
                                          question.options.length - 1
                                        ) {
                                          setFieldValue(
                                            `questions.${questionIndex}.correctAnswerIndex`,
                                            0
                                          );
                                        } else if (
                                          question.correctAnswerIndex >
                                          optionIndex
                                        ) {
                                          setFieldValue(
                                            `questions.${questionIndex}.correctAnswerIndex`,
                                            question.correctAnswerIndex - 1
                                          );
                                        }
                                      }}
                                      className="text-red-500 hover:text-red-700 text-sm px-2 py-1"
                                    >
                                      ×
                                    </button>
                                  )}
                                </div>
                              ))}

                              {question.options.length < 6 && (
                                <button
                                  type="button"
                                  onClick={() => pushOption("")}
                                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                >
                                  + Add Option
                                </button>
                              )}
                            </div>
                          )}
                        </FieldArray>
                        <ErrorMessage
                          name={`questions.${questionIndex}.options`}
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      {/* Correct Answer Indicator */}
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Correct Answer:</span>{" "}
                        Option {question.correctAnswerIndex + 1}
                        {question.options[question.correctAnswerIndex] &&
                          ` - "${question.options[question.correctAnswerIndex]}"`}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </FieldArray>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 rounded text-white font-medium ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {isSubmitting
                  ? "Saving..."
                  : initialQuiz
                  ? "Update Quiz"
                  : "Save Quiz"}
              </button>

              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={isSubmitting}
                  className={`px-4 py-2 border border-gray-300 rounded text-gray-700 ${
                    isSubmitting
                      ? "cursor-not-allowed opacity-50"
                      : "hover:bg-gray-50"
                  }`}
                >
                  Cancel
                </button>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default QuizForm;
