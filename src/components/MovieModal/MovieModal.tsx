import { createPortal } from "react-dom";

import css from "./MovieModal.module.css";
import type { Movie } from "../../types/movie.ts";
import { useEffect } from "react";

interface IMovieModal {
  selectedMovie: Movie;
  onClose: () => void;
}

const MovieModal = ({ selectedMovie, onClose }: IMovieModal) => {
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div className={css.modal}>
        <button
          className={css.closeButton}
          aria-label="Close modal"
          onClick={onClose}
        >
          &times;
        </button>
        <img
          src={`https://image.tmdb.org/t/p/original/${selectedMovie.backdrop_path}`}
          alt="movie_title"
          className={css.image}
        />
        <div className={css.content}>
          <h2>{selectedMovie.title}</h2>
          <p>{selectedMovie.overview}</p>
          <p>
            <strong>Release Date:</strong> {selectedMovie.release_date}
          </p>
          <p>
            <strong>Rating:</strong> {selectedMovie.vote_average / 10}
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default MovieModal;
