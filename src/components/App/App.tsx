import { useState } from "react";
import {
  useQuery,
  keepPreviousData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";

import css from "./App.module.css";
import { fetchNotes, deleteNote, createNote } from "../../services/noteService";
import type { NoteTag } from "../../types/note";

import Pagination from "../Pagination/Pagination";
import NoteList from "../NoteList/NoteList";
import SearchBox from "../SearchBox/SearchBox";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";

interface NoteFormValues {
  title: string;
  content: string;
  tag: NoteTag;
}

function App() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", searchQuery, page],
    queryFn: () => fetchNotes(searchQuery, page),
    placeholderData: keepPreviousData,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setIsModalOpen(false);
      setPage(1);
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleCreate = (values: NoteFormValues) => {
    createMutation.mutate(values);
  };

  const handleSearch = useDebouncedCallback((searchText: string) => {
    setSearchQuery(searchText);
    setPage(1);
  }, 1000);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error</p>;
  }

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={handleSearch} />

        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}

        <button
          type="button"
          className={css.button}
          onClick={() => setIsModalOpen(true)}
        >
          Create note +
        </button>
      </header>

      {notes.length > 0 && <NoteList notes={notes} onDelete={handleDelete} />}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onCancel={() => setIsModalOpen(false)}
            onSubmit={handleCreate}
          />
        </Modal>
      )}
    </div>
  );
}

export default App;
