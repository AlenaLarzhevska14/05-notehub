import { useEffect, useState } from "react";
import {
  useQuery,
  keepPreviousData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import css from "./App.module.css";
import { fetchNotes, deleteNote } from "../../services/noteService";
import Pagination from "../Pagination/Pagination";
import NoteList from "../NoteList/NoteList";
import SearchBox from "../SearchBox/SearchBox";
import { useDebouncedCallback } from "use-debounce";

function App() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isSuccess } = useQuery({
    queryKey: ["notes", searchQuery, page],
    queryFn: () => fetchNotes(searchQuery, page),
    placeholderData: keepPreviousData,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleSearch = useDebouncedCallback((searchText) => {
    setSearchQuery(searchText);
    setPage(1);
  }, 1000);

  // useEffect(() => {
  //   if (isSuccess && notes.length === 0) {
  //     toast.error("No notes found for your request.");
  //   }
  // }, [isSuccess, notes]);

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
        {/* Кнопка створення нотатки */}
      </header>

      {notes.length > 0 && <NoteList notes={notes} onDelete={handleDelete} />}
    </div>
  );
}

export default App;
