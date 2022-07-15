const cityNameEl = document.querySelector("#form1");

const searchBtn = document.querySelector('#searchBtn')

const clearHistoryBtn = document.querySelector('#clearHistoryBtn')

const searchHistory = []

function searchCity() {
    event.preventDefault();
    const city = cityNameEl.value.toUpperCase();
    if ((!searchHistory.includes(city)) && (city)) {
        //only runs if value not in array and their is no null value
        addToHistory(city);
        fetching(city);
    } else {
        alert("Please enter a city");
    }
    console.log(searchHistory)
}

function addToHistory(city) {
    if (searchHistory.length > 1) {
        for (let i = searchHistory.length - 1; i >= 0; i--) {
            //move search history down, limit to 10
            searchHistory[i + 1] = searchHistory[i];
        }
        searchHistory[0] = city;

        if (searchHistory.length > 10) {
            searchHistory[10] = null;
        }
    } else {
        searchHistory[1] = searchHistory[0];
        searchHistory[0] = city;
    }

    //saves updated history to local storage
    for (let i = 0; i < searchHistory.length; i++) {
        if (searchHistory[i] == null) {
            localStorage.removeItem(i);
        } else {
            localStorage.setItem(i, searchHistory[i]);
        }
    }

    displayHistory();

}

function displayHistory() {
    for (let i = 0; i < 10; i++) {
        if (searchHistory[i] == null) {
            $("#hist" + i).css("visibility", "hidden");
        } else {
            $("#hist" + i).text(searchHistory[i]);
            $("#hist" + i).css("visibility", "visible");
        }
    }
}

function loadHistory() {
    if (localStorage.getItem(0) == null) {
        localStorage.setItem(0, "AUSTIN");
        searchHistory[0] = "AUSTIN";
        fetching("AUSTIN");
    } else {
        for (let i = 0; i < 10; i++) {
            searchHistory[i] = localStorage.getItem(i);
        }
        console.log(searchHistory);
        fetching(searchHistory[0]);
    }
    displayHistory();
}

function fetching(city) {
    const APIkey = "3d0f9ed7efabdec23494e03578aee62e";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}&units=imperial`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const lat = data.coord.lat;
            const lon = data.coord.lon;
            const name = data.name;
            // console.log(name)
            return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely,alerts&appid=${APIkey}&units=imperial`)
                .then(response => response.json())
                .then(result => {
                    console.log(result)
                    displayInfo(result, name)
                })
                .catch(err => {
                    console.error('Request failed', err)
                })
        })
        .catch(err => {
            console.error('Request failed', err)
        })
}

function displayHistory() {
    console.log("display history" + searchHistory)
    for (let i = 0; i < 10; i++) {
        if (searchHistory[i] == null) {
            $("#hist" + i).css("visibility", "hidden");
        } else {
            $("#hist" + i).text(searchHistory[i]);
            $("#hist" + i).css("visibility", "visible");
        }
    }
}

function displayInfo(result, name) {
    document.querySelector('#cityName').textContent = name
    document.querySelector('#temp').innerHTML = "Temperature: " + result.current.temp
    document.querySelector('#humidity').innerHTML = "Humidity: " + result.current.humidity
    document.querySelector('#windSpeed').innerHTML = "Wind Speed: " + result.current.wind_speed
    document.querySelector('#uvIndex').innerHTML = "UV Index: " + result.current.uvi

    for (let i = 0; i < 6; i++) {
        tempMax = result.daily[i].temp.max;
        tempMin = result.daily[i].temp.min
        date = new Date(result.daily[i].dt * 1000);
        icon = `http://openweathermap.org/img/wn/${result.daily[i].weather[0].icon}@2x.png`;
        humidity = result.daily[i].humidity;
        windspd = result.daily[i].wind_speed;

        $("#date" + i).text(date.toLocaleDateString("en-US"));
        $("#temp" + i).text("High/Low: " + tempMax + "°F/" + tempMin + "°F");
        $("#icon" + i).attr("src", icon);
        $("#humidity" + i).text("Humidity: " + humidity + "%");
        $("#windspd" + i).text("Wind Speed: " + windspd + "mph");
    }
}

$(".search-history").on("click", "button", function () {
    fetching($(this).text());
});

// console.log(result.current)

function clear() {
    localStorage.clear();
}

loadHistory();

searchBtn.addEventListener("click", searchCity);

clearHistoryBtn.addEventListener("click", clear);




