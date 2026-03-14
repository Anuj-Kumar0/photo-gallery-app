import { useState, useReducer, useEffect, useCallback, useMemo } from "react";
import { FaHeart } from "react-icons/fa";
import useFetchPhotos from "./hooks/useFetchPhotos";

/*REDUCER*/

function favouritesReducer(state, action) {
  switch (action.type) {
    case "TOGGLE_FAVOURITE":
      if (state.includes(action.payload)) {
        return state.filter((id) => id !== action.payload);
      } else {
        return [...state, action.payload];
      }
    default:
      return state;
  }
}

/*LOCAL STORAGE INIT*/

function initFavourites() {
  const stored = localStorage.getItem("favourites");
  return stored ? JSON.parse(stored) : [];
}

function App() {
  const { photos, loading, error } = useFetchPhotos();
  const [search, setSearch] = useState("");
  const [favourites, dispatch] = useReducer(
    favouritesReducer,
    [],
    initFavourites
  );

  const handleSearch = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  /*SAVE TO LOCAL STORAGE*/

  useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(favourites));
  }, [favourites]);

  /*SEARCH FILTER*/

  const filteredPhotos = useMemo(() => {
    return photos.filter((photo) =>
      photo.author.toLowerCase().includes(search.toLowerCase())
    );
  }, [photos, search]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gradient-to-br from-slate-100 to-slate-200">

        <div className="w-20 h-20 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin shadow-xl"></div>

        <p className="text-xl font-semibold text-gray-700 tracking-wide">
          Fetching stunning photos...
        </p>

      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-xl">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-indigo-100 via-white to-purple-100">
      <h1 className="text-4xl font-extrabold text-center mb-10 text-indigo-700 tracking-wide">
        Photo Gallery
      </h1>
      {/* SEARCH INPUT */}
      <div className="mb-10 flex justify-center">
        <div className="relative w-full max-w-lg">
          <input
            type="text"
            placeholder="Search photos by author..."
            value={search}
            onChange={handleSearch}
            className="w-full pl-5 pr-4 py-3 rounded-full border border-gray-300 shadow-md focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-300"
          />
        </div>
      </div>

      {/* PHOTO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredPhotos.map((photo) => {
          const isFavourite = favourites.includes(String(photo.id));

          return (
            <div
              key={photo.id}
              className="bg-white rounded-xl shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl"
            >
              <img
                src={photo.download_url}
                alt={photo.author}
                className="w-full h-56 object-cover transition-transform duration-500 hover:scale-110"
              />

              <div className="flex items-center justify-between p-4 bg-gray-50">
                <p className="text-sm font-semibold text-gray-700">
                  {photo.author}
                </p>

                <button
                  onClick={() =>
                    dispatch({
                      type: "TOGGLE_FAVOURITE",
                      payload: String(photo.id),
                    })
                  }
                  className={`text-xl transition transform duration-300 ${isFavourite
                    ? "text-red-500 scale-125"
                    : "text-gray-400 hover:text-red-400 hover:scale-110"
                    }`}
                >
                  <FaHeart />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}

export default App;