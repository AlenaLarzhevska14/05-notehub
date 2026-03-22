import { useMutation, useQueryClient } from "@tanstack/react-query";
import css from "./NoteForm.module.css";
import { ErrorMessage, Field, Form, Formik } from "formik";
import type { FormikHelpers } from "formik";
import * as Yup from "yup";
import { createNote } from "../../services/noteService";
import type { NewNote, NoteTag } from "../../types/note";

interface NoteFormProps {
  onCancel: () => void;
}

const initialValues: NewNote = {
  title: "",
  content: "",
  tag: "Todo",
};

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Minimum 3 characters")
    .max(50, "Maximum 50 characters")
    .required("Title is required"),
  content: Yup.string().max(500, "Maximum 500 characters"),
  tag: Yup.mixed<NoteTag>()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
    .required("Tag is required"),
});

export default function NoteForm({ onCancel }: NoteFormProps) {
  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationFn: createNote,
  });

  const handleSubmit = async (
    values: NewNote,
    { resetForm }: FormikHelpers<NewNote>
  ) => {
    try {
      await createMutation.mutateAsync(values);
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
      resetForm();
      onCancel();
    } catch {
      return;
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field id="title" type="text" name="title" className={css.input} />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>
          <Field
            as="textarea"
            id="content"
            name="content"
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage name="content" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>
          <Field as="select" id="tag" name="tag" className={css.select}>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage name="tag" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button
            type="button"
            className={css.cancelButton}
            onClick={onCancel}
            disabled={createMutation.isPending}
          >
            Cancel
          </button>

          <button
            type="submit"
            className={css.submitButton}
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? "Creating..." : "Create note"}
          </button>
        </div>

        {createMutation.isError && (
          <span className={css.error}>Failed to create note.</span>
        )}
      </Form>
    </Formik>
  );
}
