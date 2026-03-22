import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "../../services/noteService";
import type { Note } from "../../types/note";
import css from "./NoteList.module.css";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const deletingNoteId = deleteMutation.isPending ? deleteMutation.variables : null;

  return (
    <>
      <ul className={css.list}>
        {notes.map((note) => (
          <li key={note.id} className={css.listItem}>
            <h2 className={css.title}>{note.title}</h2>
            <p className={css.content}>{note.content}</p>
            <div className={css.footer}>
              <span className={css.tag}>{note.tag}</span>
              <button
                type="button"
                className={css.button}
                onClick={() => deleteMutation.mutate(note.id)}
                disabled={deletingNoteId === note.id}
              >
                {deletingNoteId === note.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </li>
        ))}
      </ul>

      {deleteMutation.isError && (
        <p className={css.content}>Failed to delete note.</p>
      )}
    </>
  );
}
