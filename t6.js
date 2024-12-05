let searchHistory = [];
let favorites = [];
let previousCountry = null;
const funFacts = {
    "India": "India has the largest democracy in the world.",
    "United States": "The United States is home to the Grand Canyon.",
    "Japan": "Japan has more than 6,800 islands.",
    "Brazil": "Brazil is the largest coffee producer in the world.",
    "Australia": "Australia is home to the Great Barrier Reef."
};

async function fetchCountry() {
    const countryName = document.getElementById('countryInput').value.trim();
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = "";

    if (!countryName) {
        alert("Please enter a country name.");
        return;
    }

    const url = `https://restcountries.com/v3.1/name/${countryName}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Country not found.");
        const data = await response.json();

        displayCountry(data[0]);
        updateHistory(data[0]);
        comparePopulation(data[0]);
        previousCountry = data[0];
        displayFunFact(countryName);
    } catch (error) {
        resultsDiv.innerHTML = `<p>Error: ${error.message}</p>`;
    }
}

async function fetchByRegion(region) {
    const url = `https://restcountries.com/v3.1/region/${region}`;
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `<p>Loading countries from ${region}...</p>`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Unable to fetch region data.");
        const data = await response.json();

        resultsDiv.innerHTML = `<h3>Countries in ${region}:</h3>`;
        data.forEach(country => {
            const countryButton = document.createElement('button');
            countryButton.textContent = country.name.common;
            countryButton.onclick = () => {
                document.getElementById('countryInput').value = country.name.common;
                fetchCountry();
            };
            countryButton.classList.add('region-country-button');
            resultsDiv.appendChild(countryButton);
        });
    } catch (error) {
        resultsDiv.innerHTML = `<p>Error: ${error.message}</p>`;
    }
}

function displayFunFact(countryName) {
    const triviaDiv = document.getElementById('trivia');
    const fact = funFacts[countryName] || "No trivia available for this country.";
    triviaDiv.innerHTML = `<p><strong>Fun Fact:</strong> ${fact}</p>`;
}

function comparePopulation(currentCountry) {
    const compareDiv = document.getElementById('compare');
    if (previousCountry) {
        const currentPopulation = currentCountry.population;
        const previousPopulation = previousCountry.population;
        const currentName = currentCountry.name.common;
        const previousName = previousCountry.name.common;

        let comparisonMessage = "";
        if (currentPopulation > previousPopulation) {
            comparisonMessage = `${currentName} has a larger population (${currentPopulation.toLocaleString()}) than ${previousName} (${previousPopulation.toLocaleString()}).`;
        } else if (currentPopulation < previousPopulation) {
            comparisonMessage = `${previousName} has a larger population (${previousPopulation.toLocaleString()}) than ${currentName} (${currentPopulation.toLocaleString()}).`;
        } else {
            comparisonMessage = `${currentName} and ${previousName} have the same population (${currentPopulation.toLocaleString()}).`;
        }

        compareDiv.innerHTML = `<p><strong>Population Comparison:</strong> ${comparisonMessage}</p>`;
    } else {
        compareDiv.innerHTML = `<p><strong>Population Comparison:</strong> No previous country to compare with.</p>`;
    }
}

function displayCountry(country) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <div class="country-card">
            <img src="${country.flags.svg}" alt="${country.name.common} Flag">
            <div>
                <h2>${country.name.common}</h2>
                <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
                <p><strong>Region:</strong> ${country.region}</p>
                <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
                <p><strong>Languages:</strong> ${country.languages ? Object.values(country.languages).join(", ") : "N/A"}</p>
                <button onclick="saveFavorite('${country.name.common}')">Add to Favorites</button>
            </div>
        </div>
    `;
}

function saveFavorite(countryName) {
    if (!favorites.includes(countryName)) {
        favorites.push(countryName);
    }
    displayFavorites();
}

function displayFavorites() {
    const favoritesDiv = document.getElementById('favorites');
    favoritesDiv.innerHTML = "<h3>Favorites:</h3>";
    favorites.forEach(country => {
        const favoriteItem = document.createElement('div');
        favoriteItem.textContent = country;
        favoritesDiv.appendChild(favoriteItem);
    });
}

function updateHistory(country) {
    const flag = country.flags.svg;
    const name = country.name.common;

    if (!searchHistory.some(entry => entry.name === name)) {
        searchHistory.push({ name, flag });
    }
    displayHistory();
}

function displayHistory() {
    const historyDiv = document.getElementById('history');
    historyDiv.innerHTML = "<h3>Search History:</h3>";

    searchHistory.forEach(({ name, flag }) => {
        const countryButton = document.createElement('button');
        countryButton.innerHTML = `<img src="${flag}" alt="${name} Flag" class="history-flag"> ${name}`;
        countryButton.onclick = () => {
            document.getElementById('countryInput').value = name;
            fetchCountry();
        };
        countryButton.classList.add('history-button');
        historyDiv.appendChild(countryButton);
    });
}
async function getRandomCountry() {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = "Fetching a random country...";

    try {
        const response = await fetch(`https://restcountries.com/v3.1/all`);
        if (!response.ok) throw new Error("Unable to fetch countries.");
        const data = await response.json();
        const randomCountry = data[Math.floor(Math.random() * data.length)];

        displayCountry(randomCountry);
        updateHistory(randomCountry);
        comparePopulation(randomCountry);
        previousCountry = randomCountry;
        displayFunFact(randomCountry.name.common);
    } catch (error) {
        resultsDiv.innerHTML = `<p>Error: ${error.message}</p>`;
    }
}
