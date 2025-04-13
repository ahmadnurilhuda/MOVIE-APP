const movies = JSON.parse(localStorage.getItem("watchlist-movies")) || [];
renderMovies(movies);