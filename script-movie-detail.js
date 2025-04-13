let movieId;
let currentMovie = null;

const getMovieById = async (id) => {
    try{
        const response = await fetch (`${API_URL}/movie/${id}`,{
            headers: {
                Authorization: `Bearer ${API_TOKEN}`,
            },
        });
    const data = await response.json();
    currentMovie = data;

    renderMovieDetail(data);

    const cast = await getCasters(id);
    renderMovieCasts(cast);

    }catch(error){
        alert(`Gagal Mendapatkan Detail Movie : ${error}`);
        console.log(`Terjadi Kesalahan : ${error}`);
    } 

};

//! Render Detail Movie
const renderMovieDetail = (detail) => {
    // console.log(detail)
    document.querySelector(".movie-poster").src = IMAGE_URL + detail.poster_path;
    document.querySelector("#movie-detail").style.backgroundImage = `url('${IMAGE_URL + detail.backdrop_path}')`;
    document.querySelector(".movie-poster").alt = detail.title;
    document.querySelector(".movie-title").textContent = detail.title;
    document.querySelector(".rating").textContent = detail.vote_average.toFixed(1);
    document.querySelector(".release-date").textContent = detail.release_date;
    document.querySelector(".movie-overview").textContent = detail.overview;
    document.querySelector(".movie-genres").innerHTML = detail.genres
    .map((g) => /*html*/`<span class="genre-box">${g.name}</span>`)
    .join("");

    document.querySelector(".trailer-watchlist").innerHTML = /*html*/`

    <button class="btn-trailer">Watch Trailer</button>
    <button class="btn-watchlist" data-movie-id = "${detail.id}">Add to Watchlist</button>`;

    const modalTrailer = document.querySelector(".modal-trailer");
    const buttonWatchTrailer = document.querySelector(".btn-trailer");
    //! Ketika tombol watch trailer di klik
    buttonWatchTrailer.addEventListener("click", async(e)=>{
        e.preventDefault();
        const trailer = await getVideo(movieId);
    
        if (!trailer) {
            alert("Trailer tidak tersedia untuk film ini.");
            return;
        }
    
        renderTrailer(trailer);
        modalTrailer.classList.add("show");
    })
    //! Ketika diluar area modal di klik
    modalTrailer.addEventListener("click", (e)=>{
        if(e.target == modalTrailer){
            modalTrailer.classList.remove("show")
        }
    })


    addEventWatchlistMovies();
    checkWatchlistStatus();
  };

const getVideo = async(id) =>{
    try{
        const response  = await fetch(`${API_URL}/movie/${id}/videos`,OPTIONS)
        const data = await response.json()

        const trailer = data.results.filter((video)=>{
            return video.type === "Trailer"
        })[0];

        return trailer;
    }catch(error){
        alert("gagal mendapatkan video trailer")
        console.error("error fetching movie trailer:", error)
    }
};

const renderTrailer = (trailer) =>{
    const modalBody = document.querySelector(".modal-body");
    modalBody.innerHTML = /*html*/`
    <iframe
    src="https://www.youtube.com/embed/${trailer.key}" frameborder="0"
    ></iframe>
    `
}

const getCasters = async(movieId) =>{
    try{
        const response = await fetch(`${API_URL}/movie/${movieId}/credits`,OPTIONS)
        const data = await response.json()

        renderModalCasters(data.cast)
        return data.cast //ini bentuknya array

        
    }catch(error){
        alert("gagal mendapatkan casters")
        console.error("error fetching casters:", error)
    }
}


const renderMovieCasts = (cast) =>{
    const casters = document.querySelector(".container-casters")

    const slicedCaster = cast.slice(0,3);
    casters.innerHTML = slicedCaster.map((cast) => /*html*/`
    
    <div class="caster">
        <img src="${IMAGE_URL + cast.profile_path}" alt="${cast.name}">
    </div>
    `).join("")


    const modalCast = document.querySelector(".modal-cast");
    const casters1 = document.querySelectorAll(".caster");
    
    casters1.forEach((caster) => {
        caster.addEventListener("click", () => {
            
            modalCast.classList.add("show")
               
        });
    });
    
    modalCast.addEventListener("click", (e) => {
        if (e.target == modalCast) {
            modalCast.classList.remove("show");
        }
    });

}

const renderModalCasters = (casters) => {
    const castersElements = document.querySelector(".container-overflow");

    const filteredCasters = casters.filter((cast) => cast.profile_path !== null);
    castersElements.innerHTML = filteredCasters.map((cast) => /*html*/`
    
    <div class="card-cast">
    
            <div class="profile-box">
              <img src="${IMAGE_URL + cast.profile_path}" alt="${cast.name}">
            </div>
            <div class="cast-info">
              <p class="cast-name"> ${cast.name}</p>
              <p class="cast-character">${cast.character}</p>
            </div>

    </div>
    `).join("")
};

//! Function Check Status Watchlist (Add & Remove)
const checkWatchlistStatus = () => {
    const watchlistButton = document.querySelector(".btn-watchlist");
    const watchlistMovies = JSON.parse(localStorage.getItem("watchlist-movies")) || [];

    const isExist = watchlistMovies.some((movie) => movie.id == currentMovie.id);

    if (isExist) {
        watchlistButton.textContent = "Remove from Watchlist";
        watchlistButton.classList.add("watchlisted");
        watchlistButton.classList.add("text-white");
    } else {
        watchlistButton.textContent = "Add to Watchlist";
        watchlistButton.classList.remove("watchlisted");
        watchlistButton.classList.remove("text-white");

    }
};





//! Funtion Menambahkan Movie Ke Halaman Watchlist
const addEventWatchlistMovies = () => {
    const watchlistButton = document.querySelector(".btn-watchlist")

    watchlistButton.addEventListener("click",() => {
        const movieId = currentMovie.id; // Gunakan ID dari currentMovie
        let watchlistMovies = JSON.parse(localStorage.getItem("watchlist-movies")) || [];

        const isExist = watchlistMovies.some((movie) => movie.id == movieId);

        if(isExist){
            watchlistMovies = watchlistMovies.filter((movie) => movie.id != movieId);
            localStorage.setItem("watchlist-movies", JSON.stringify(watchlistMovies));
            alert("Film berhasil dihapus dari Watchlist");
        }else{

            watchlistMovies.unshift(currentMovie);
            localStorage.setItem("watchlist-movies", JSON.stringify(watchlistMovies));

            alert("Film Berhasil Ditambahkan Ke Watchlist")
        }
        checkWatchlistStatus();
    });
}

//! Awal Dari Sini
//! window adalah object global di browser
window.addEventListener("DOMContentLoaded", () => {
    const queryParams = new URLSearchParams(window.location.search);
    movieId = queryParams.get("id");
    console.log(`movieID ; `,movieId);

    getMovieById(movieId);

    document.querySelector(".loading").classList.add("hide");
});
















