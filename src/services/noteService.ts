import axios from "axios";
import type { Note, NoteTag } from "../types/note";

const token = import.meta.env.VITE_NOTEHUB_TOKEN;

interface NotesHttpResponse {
  notes: Note[];
  totalPages: number;
}

// interface FetchNotesParams {
//   page: number;
//   perPage: number;
//   search?: string;
// }
interface NewNote {
  title: string;
  content: string;
  tag: NoteTag;
}

const api = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const fetchNotes = async (
  searchQuery: string,
  page: number
): Promise<NotesHttpResponse> => {
  const { data } = await api.get<NotesHttpResponse>("/notes", {
    params: {
      search: searchQuery,
      page,
      perPage: 12,
    },
  });

  return data;
};

export const createNote = async (newNote: NewNote): Promise<Note> => {
  const { data } = await api.post<Note>("/notes", newNote);

  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await api.delete<Note>(`/notes/${id}`);

  return data;
};
