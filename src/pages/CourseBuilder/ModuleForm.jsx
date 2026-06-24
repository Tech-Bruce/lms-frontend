import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  order: Yup.number().required("Order is required").min(1),
});

const ModuleForm = ({ initialValues, onSubmit, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {initialValues._id ? "Edit Module" : "Add Module"}
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              {/* Title */}
              <div>
                <label className="block font-medium mb-1">Title</label>
                <Field
                  name="title"
                  className="w-full border px-3 py-2 rounded-md"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-medium mb-1">Description</label>
                <Field
                  as="textarea"
                  name="description"
                  rows="3"
                  className="w-full border px-3 py-2 rounded-md"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Order */}
              <div>
                <label className="block font-medium mb-1">Order</label>
                <Field
                  type="number"
                  name="order"
                  className="w-full border px-3 py-2 rounded-md"
                />
                <ErrorMessage
                  name="order"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
                  {initialValues._id ? "Update" : "Create"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ModuleForm;
