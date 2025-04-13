const API_TOKEN = 
    "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlODc3Yjg4ODU0N2ZhNjQ2YTMxNTU2N2MwMDZjNzUzMiIsIm5iZiI6MTc0NDA5Njk1OC44OTEsInN1YiI6IjY3ZjRjZWJlOGNmY2NmN2JhZmQ5NGQ4ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.0T-tOxGbz1rGr9mYpH5roH8GEC5ScqNgYobwT8rdZYg";

const API_URL = "https://api.themoviedb.org/3";

const IMAGE_URL = "https://image.tmdb.org/t/p/original"

const OPTIONS = {
    headers:{
        Authorization : `Bearer ${API_TOKEN}`,
    },
}

// Tambahkan deteksi halaman
const isFavoritePage = window.location.pathname.includes("movie-favorite.html");
const isWatchlistPage = window.location.pathname.includes("movie-watchlist.html");

// Fungsi render dari localStorage untuk tiap halaman
const renderFavoriteMovies = () => {
  const favoriteMovies = JSON.parse(localStorage.getItem("favorite-movies")) || [];
  renderMovies(favoriteMovies);
};

const renderWatchlistMovies = () => {
  const watchlistMovies = JSON.parse(localStorage.getItem("watchlist-movies")) || [];
  renderMovies(watchlistMovies);
};

//! Function Menambahkan Movie Ke Favorite di dalam Local Storage

const addEventFavoriteMovies = () => {
    const favoriteIconButtons = document.querySelectorAll(".favorite");
  
    favoriteIconButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const movieId = this.dataset.movieId;
        const currentMovie = movies.find((movie) => movie.id == movieId);

        if (!currentMovie && (isFavoritePage || isWatchlistPage)) {
            const allMovies = [
              ...(JSON.parse(localStorage.getItem("favorite-movies")) || []),
              ...(JSON.parse(localStorage.getItem("watchlist-movies")) || []),
            ];
            currentMovie = allMovies.find((movie) => movie.id == movieId);
          }
  
        // Ambil atau buat array kosong kalau belum ada di localStorage
        let favoriteMovies = JSON.parse(localStorage.getItem("favorite-movies")) || [];
  
        // Cek apakah movie sudah ada di favorite
        const movieIndex = favoriteMovies.findIndex((movie) => movie.id == movieId);

        
        if (movieIndex !== -1) {
        //   Jika sudah ada, hapus dari favorite
          favoriteMovies.splice(movieIndex, 1);
          localStorage.setItem("favorite-movies", JSON.stringify(favoriteMovies));

          const movieCard = this.closest(".movie-card");
          movieCard.remove();
          
          alert("Film berhasil dihapus dari Favorite");

         //  Render ulang sesuai halaman
         if (isFavoritePage) {
            renderFavoriteMovies();
          } else if (isWatchlistPage) {
            renderWatchlistMovies();
          } else {
            renderMovies(movies); // default
          }
          
        } else {
        //    Jika belum ada, tambahkan ke favorite
          favoriteMovies.unshift(currentMovie);
          localStorage.setItem("favorite-movies", JSON.stringify(favoriteMovies));
          this.classList.add("favorited");
          alert("Film berhasil ditambahkan ke Favorite");
        }
      });
    });
  };

const renderMovies = (movies) => {
    const moviesList = document.getElementById("movie-list");
    if (movies && movies.length > 0) {
      moviesList.innerHTML = movies
        .map((movie) => {

            let isFavorited = false;

            const favoritedMovies = JSON.parse(localStorage.getItem("favorite-movies"))
            console.log(favoritedMovies)
    
            if(favoritedMovies){
                favoritedMovies.forEach((favMovie) =>{

                    if(favMovie.id == movie.id){
                        isFavorited = true;
                    }

                });

            }
            
        return /*html*/ `
              
              <div class="movie-card">
              <a href="movie-detail.html?id=${movie.id}">
                  <img class="movie-poster" src="${
                    IMAGE_URL + movie.poster_path
                  }" alt="${movie.title}">
              </a>
                  <div class="movie-desc">
                      <h2>
                      <a href="movie-detail.html?id=${movie.id}">${movie.title}</a>
                      </h2>
                      <p class="line-clamp">${movie.overview}</p>
                  </div>
                  <div class ="movie-button-favorite" >
                      <div class="favorite ${isFavorited ? "favorited" :""}"  data-movie-id ="${movie.id}">
                          <svg width="32px" height="32px" viewBox="0 -2.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                  
                          <title>love [#1488]</title>
                              <g id="Page-1" stroke="none" stroke-width="1" fill-rule="evenodd">
                                  <g id="Dribbble-Light-Preview" transform="translate(-139.000000, -361.000000)" >
                                      <g id="icons" transform="translate(56.000000, 160.000000)">
                                          <path d="M103.991908,206.599878 C103.779809,210.693878 100.744263,212.750878 96.9821188,215.798878 C94.9997217,217.404878 92.0324261,217.404878 90.042679,215.807878 C86.3057345,212.807878 83.1651892,210.709878 83.0045394,206.473878 C82.8029397,201.150878 89.36438,198.971878 93.0918745,203.314878 C93.2955742,203.552878 93.7029736,203.547878 93.9056233,203.309878 C97.6205178,198.951878 104.274358,201.159878 103.991908,206.599878" id="love-[#1488]">
  
                          </path>
                                      </g>
                                  </g>
                              </g>
                          </svg>
                      </div>
                  </div>
              </div>
              </a>
              
              `
        })
        .join("");
  
      //? Menjalankan Function Menambah Favorite
        addEventFavoriteMovies();
    } else {
      moviesList.innerHTML =
        /*html*/
        `<h2 class="no-movies">No Movies Found</h2>`;
    }
  };