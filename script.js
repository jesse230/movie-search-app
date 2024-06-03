const API_KEY = 'c34c9af8'; // Replace with your OMDB API key
const API_URL = `http://www.omdbapi.com/?apikey=${API_KEY}&`;

const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const backButton = document.getElementById('back-button');
const resultsDiv = document.getElementById('results');
const movieDetailsDiv = document.getElementById('movie-details');
const movieInfoDiv = document.getElementById('movie-info');
const spinner = document.getElementById('spinner');
const recentlyViewedDiv = document.getElementById('recently-viewed');

const submitReviewButton = document.getElementById('submit-review');
const reviewerNameInput = document.getElementById('reviewer-name');
const reviewTextInput = document.getElementById('review-text');
const reviewsList = document.getElementById('reviews-list');

searchButton.addEventListener('click', searchMovies);
backButton.addEventListener('click', () => {
    resultsDiv.style.display = 'flex';
    movieDetailsDiv.style.display = 'none';
    backButton.style.display = 'none';
    recentlyViewedDiv.style.display = 'none';
});

submitReviewButton.addEventListener('click', submitReview);

let currentMovieId = null;

async function searchMovies() {
    const query = searchInput.value;
    if (!query) return;

    spinner.style.display = 'block';
    resultsDiv.innerHTML = '';

    const response = await fetch(`${API_URL}s=${query}`);
    const data = await response.json();

    spinner.style.display = 'none';

    if (data.Response === 'True') {
        displayResults(data.Search);
    } else {
        resultsDiv.innerHTML = '<p>No results found.</p>';
    }
}

function displayResults(movies) {
    resultsDiv.style.display = 'flex';
    movieDetailsDiv.style.display = 'none';
    recentlyViewedDiv.style.display = 'none';
    backButton.style.display = 'none';

    movies.forEach(movie => {
        const movieDiv = document.createElement('div');
        movieDiv.classList.add('movie');
        movieDiv.innerHTML = `
            <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'placeholder.jpg'}" alt="${movie.Title}">
            <h3>${movie.Title}</h3>
            <p>${movie.Year}</p>
        `;
        movieDiv.addEventListener('click', () => displayMovieDetails(movie.imdbID));
        resultsDiv.appendChild(movieDiv);
    });
}

async function displayMovieDetails(id) {
    spinner.style.display = 'block';

    const response = await fetch(`${API_URL}i=${id}`);
    const movie = await response.json();

    spinner.style.display = 'none';

    if (movie.Response === 'True') {
        resultsDiv.style.display = 'none';
        movieDetailsDiv.style.display = 'block';
        recentlyViewedDiv.style.display = 'block';
        backButton.style.display = 'inline-block';

        currentMovieId = movie.imdbID;

        movieInfoDiv.innerHTML = `
            <h2>${movie.Title}</h2>
            <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'placeholder.jpg'}" alt="${movie.Title}">
            <p><strong>Year:</strong> ${movie.Year}</p>
            <p><strong>Rated:</strong> ${movie.Rated}</p>
            <p><strong>Released:</strong> ${movie.Released}</p>
            <p><strong>Runtime:</strong> ${movie.Runtime}</p>
            <p><strong>Genre:</strong> ${movie.Genre}</p>
            <p><strong>Director:</strong> ${movie.Director}</p>
            <p><strong>Writer:</strong> ${movie.Writer}</p>
            <p><strong>Actors:</strong> ${movie.Actors}</p>
            <p><strong>Plot:</strong> ${movie.Plot}</p>
            <p><strong>Language:</strong> ${movie.Language}</p>
            <p><strong>Awards:</strong> ${movie.Awards}</p>
            <p><strong>IMDB Rating:</strong> ${movie.imdbRating}</p>
        `;

        addToRecentlyViewed(movie);
        displayReviews(movie.imdbID);
    } else {
        movieInfoDiv.innerHTML = '<p>Movie details not found.</p>';
    }
}

function addToRecentlyViewed(movie) {
    const recentlyViewedMovies = JSON.parse(localStorage.getItem('recentlyViewedMovies')) || [];

    const existingMovie = recentlyViewedMovies.find(m => m.imdbID === movie.imdbID);
    if (!existingMovie) {
        recentlyViewedMovies.push(movie);
        localStorage.setItem('recentlyViewedMovies', JSON.stringify(recentlyViewedMovies));
    }

    displayRecentlyViewed();
}

function displayRecentlyViewed() {
    const recentlyViewedMovies = JSON.parse(localStorage.getItem('recentlyViewedMovies')) || [];

    recentlyViewedDiv.innerHTML = '<h3>Recently Viewed Movies</h3>';

    recentlyViewedMovies.forEach(movie => {
        const movieDiv = document.createElement('div');
        movieDiv.classList.add('recently-viewed-movie');
        movieDiv.innerHTML = `
            <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'placeholder.jpg'}" alt="${movie.Title}">
            <p>${movie.Title} (${movie.Year})</p>
        `;
        movieDiv.addEventListener('click', () => displayMovieDetails(movie.imdbID));
        recentlyViewedDiv.appendChild(movieDiv);
    });
}

function submitReview() {
    const reviewerName = reviewerNameInput.value;
    const reviewText = reviewTextInput.value;

    if (!reviewerName || !reviewText) return;

    const reviews = JSON.parse(localStorage.getItem(`reviews_${currentMovieId}`)) || [];
    reviews.push({ name: reviewerName, text: reviewText });

    localStorage.setItem(`reviews_${currentMovieId}`, JSON.stringify(reviews));

    reviewerNameInput.value = '';
    reviewTextInput.value = '';

    displayReviews(currentMovieId);
}

function displayReviews(movieId) {
    const reviews = JSON.parse(localStorage.getItem(`reviews_${movieId}`)) || [];

    reviewsList.innerHTML = '';

    reviews.forEach(review => {
        const reviewDiv = document.createElement('div');
        reviewDiv.classList.add('review');
        reviewDiv.innerHTML = `
            <p><strong>${review.name}</strong></p>
            <p>${review.text}</p>
        `;
        reviewsList.appendChild(reviewDiv);
    });
}

// Display recently viewed movies on page load
window.onload = displayRecentlyViewed;
