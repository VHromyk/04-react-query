import * as axios from "axios";
import toast from "react-hot-toast";

export const tmdb = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
    accept: "application/json",
  },
  params: { language: "en-US" },
});

export const movieService = {
  search: async (query: string, page = 1) => {
    const { data } = await tmdb.get("/search/movie", {
      params: { query, page, include_adult: false },
    });

    if (data.results.length === 0) {
      toast.error("No movies found for your request.");
      return;
    }
    return data;
  },
};

export default movieService;
