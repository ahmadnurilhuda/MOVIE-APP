let movies = [];

const getMovies = async (url) => {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      // Accept : "Application/json",
      Authorization: `Bearer ${API_TOKEN}`,
    },
  });

  const data = await response.json();
  movies = data.results;


  renderMovies(data.results);
};

let currentPage = 1;
const renderPage = (page) => {
  currentPage = page;
  window.scrollTo(0, 0);
  getMovies(`${API_URL}/discover/movie?page=${page}`);
};

// ! Button Next & Previous Page
const btnNextPage = document.querySelector(".next-btn");
btnNextPage.addEventListener("click", () => {
  renderPage(currentPage + 1);
});

const btnPrevPage = document.querySelector(".prev-btn");
btnPrevPage.addEventListener("click", () => {
  if (currentPage > 1) {
    renderPage(currentPage - 1);
  }
});

//! Function Menampilkan Movie Di global.js

//! Funtion Manampilan Loading Saat Search
const isLoading = true;
const renderLoading = (isLoading) => {
  const moviesList = document.getElementById("movie-list");
  if (isLoading) {
    moviesList.innerHTML = /*html*/ `<h2 class="no-movies">Loading...</h2>`;
  }
};

// !Function Seacrh
const getMoviesByKeyword = async (keyword) => {
  // todo : Lakukan Request ke TMBD API(backend) dengan endpoint /search/movie?query=keyword

  try {
    renderLoading(true);
    const response = await fetch(`${API_URL}/search/movie?query=${keyword}`, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    //! Ambil Data Movie Dari Response Dijadikan Json
    const data = await response.json();
    //! Setelah Berhasil Mendapatkan Data Movie Dari API Jalankan Render Movies
    renderMovies(data.results);
  } catch (error) {
    alert(`Terjadi Kesalahan : ${error}`);
    console.log(`terjadi Kesalahan : ${error}`);
  }
};

getMovies(API_URL + `/discover/movie?page=1`);

//! Ketika Input Search diisi
const searchInput = document.querySelector(`#search-input`);
let timeout;
searchInput.addEventListener("keyup", (event) => {
  const keyword = event.target.value;
  if (keyword.length > 3) {
    //! Penjelasan alur program cleartimeout dan settimeout dibawah

    //? Ketika Input Search diisi, maka akan menjalankan fungsi getMoviesByKeyword(keyword)
    //? Fungsi getMoviesByKeyword(keyword) dipanggil setelah 500ms (5 detik)
    //? Fungsi getMoviesByKeyword(keyword) membutuhkan keyword sebagai argumen
    //? Jika keyword tidak diisi, maka akan menjalankan fungsi getMovies(API_URL+`/discover/movie?page=1`)

    clearTimeout(timeout);

    timeout = setTimeout(() => {
      getMoviesByKeyword(keyword);
    }, 500);
  } else {
    getMovies(API_URL + `/discover/movie?page=1`);
  }
});
