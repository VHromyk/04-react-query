import css from "./App.module.css";
import SearchBar from "../SearchBar/SearchBar.tsx";
import movieService from "../../services/movieService.ts";
import { Toaster } from "react-hot-toast";
import { useState } from "react";
import MovieGrid from "../MovieGrid/MovieGrid.tsx";
import type { Movie } from "../../types/movie.ts";
import Loader from "../Loader/Loader.tsx";
import ErrorMessage from "../ErrorMessage/ErrorMessage.tsx";
import MovieModal from "../MovieModal/MovieModal.tsx";
import { useQuery } from "@tanstack/react-query";
import ReactPaginateImport from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import type { ComponentType } from "react";

const ReactPaginate = ((ReactPaginateImport as unknown as { default?: unknown })
  .default ?? ReactPaginateImport) as ComponentType<ReactPaginateProps>;

console.log(ReactPaginate);

function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["movie", query, page],
    queryFn: () => movieService.search(query, page),
    enabled: !!query,
  });

  const onSubmitHandler = (query: string) => {
    setPage(1);
    setQuery(query);
  };

  const onSelectMovieHandler = (movie: Movie) => {
    if (movie) {
      setSelectedMovie(movie);
    }
  };

  const onCloseModalHandler = () => {
    setSelectedMovie(null);
  };

  const handlePageClick = (selectedItem: { selected: number }) => {
    setPage(selectedItem.selected + 1);
  };

  const totalPages = data?.total_pages ?? 0;

  return (
    <div className={css.app}>
      <SearchBar onSubmit={onSubmitHandler} />

      {isError && <ErrorMessage />}

      {isLoading && <Loader />}

      {data && data.results.length > 0 && (
        <>
          <MovieGrid onSelect={onSelectMovieHandler} movies={data.results} />

          {totalPages > 1 && (
            <ReactPaginate
              pageCount={totalPages}
              pageRangeDisplayed={3}
              marginPagesDisplayed={1}
              onPageChange={handlePageClick}
              forcePage={page - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}
        </>
      )}

      {selectedMovie && (
        <MovieModal
          selectedMovie={selectedMovie}
          onClose={onCloseModalHandler}
        />
      )}

      <Toaster />
    </div>
  );
}

export default App;
