document.getElementById('search-button').addEventListener('click', () => {
    console.log('Search button clicked'); // Add this line to check if the button click event is detected
    const query = document.getElementById('search-input').value;
    if (query) {
        console.log('Query:', query); // Add this line to check the value of the query
        searchMovies(query);
    }
});

async function searchMovies(query) {
    const apiKey = 'c34c9af8'; // Replace with your actual API key
    console.log('API Key:', apiKey); // Add this line to check the API key
    const response = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${apiKey}`);
    const data = await response.json();
    console.log('Search results:', data.Search); // Add this line to check the search results
    displayResults(data.Search);
}

function displayResults(movies) {
    const resultsDiv = document.getElementById('results');
    const movieDetailsDiv = document.getElementById('movie-details');

    resultsDiv.innerHTML = '';

    if (!movies || movies.length === 0) {
        resultsDiv.innerHTML = '<p>No results found</p>';
        return;
    }

    movies.forEach(movie => {
        const movieDiv = document.createElement('div');
        movieDiv.classList.add('movie');
        movieDiv.innerHTML = `
            <img src="${movie.Poster}" alt="${movie.Title}">
            <h3>${movie.Title}</h3>
            <p>${movie.Year}</p>
        `;
        movieDiv.addEventListener('click', () => {
            fetchMovieDetails(movie.imdbID);
            resultsDiv.style.display = 'none'; // Hide search results
            movieDetailsDiv.style.display = 'block'; // Display movie details
        });
        resultsDiv.appendChild(movieDiv);
    });
}


async function fetchMovieDetails(movieId) {
    const apiKey = 'c34c9af8'; // Replace with your actual API key
    const response = await fetch(`https://www.omdbapi.com/?i=${movieId}&apikey=${apiKey}`);
    const movie = await response.json();
    displayMovieDetails(movie);
}

function displayMovieDetails(movie) {
    const movieDetailsDiv = document.getElementById('movie-details');
    movieDetailsDiv.innerHTML = `
        <h2>${movie.Title}</h2>
        <img src="${movie.Poster}" alt="${movie.Title}">
        <p>${movie.Plot}</p>
        <p><strong>Genre:</strong> ${movie.Genre}</p>
        <p><strong>Released:</strong> ${movie.Released}</p>
        <p><strong>IMDB Rating:</strong> ${movie.imdbRating}</p>
    `;
}


