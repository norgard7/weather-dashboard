//fetch the weather data for thecity being searched
const apiKey = "47258fcca94b473e911dca079badd565";
let lattitude = "";
let longitude = "";
//luxon date variables
let dt = luxon.DateTime.now();
//today displays date as dd/mm/yyyy
let today = dt.toLocaleString();

//displays weather information for current user chosen city
let currentCityEl = document.querySelector("#currentCity");
let forecastContainerEl = document.querySelector("#forecast-container");
let searchHistoryEl = document.querySelector("#searchHistory");
let submitBtnEl = document.querySelector("#submitBtn");
let searchCityEl = document.querySelector("#searchCity");
let icon = document.createElement("img");
let city = document.createElement("h2");


// left aside list of cities that populate for commonly picked weather
let defaultCityList = ["Minneapolis", "Chicago", "New York", "Orlando", "San Fransico", "Seattle", "Denver", "Alanta"];
let cityList = [];
submitBtnEl.addEventListener("click", function(event){
    event.preventDefault();
    let newCity = searchCityEl.value;
    getWeather(newCity);
    
})
searchHistoryEl.addEventListener("click", function(event){
    let element = event.target;
    if(element.matches("button") === true) {
        let search = element.textContent;
        getWeather(search);
    }
})

function init() {
    let storedCities = JSON.parse(localStorage.getItem("cities"));
    if(storedCities === null) {
        cityList = defaultCityList;
    }else {
        cityList = storedCities;
    }
    renderCities();
}
function renderCities() {
    searchHistoryEl.innerHTML = "";
    for(let i = 0; i <cityList.length; i++) {
        let cityDiv = document.createElement("button");
        cityDiv.classList.add("cityBtn");
        cityDiv.textContent = cityList[i];
        searchHistoryEl.appendChild(cityDiv);
    }
}

function storeCities(city) {
    if(cityList.includes(city)){
        return
    }
    cityList.unshift(city);
    cityList.pop();
    localStorage.setItem("cities", JSON.stringify(cityList));
}

let getWeather = function (city) {
    let apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial&appid='+apiKey;
    let api5Day = 'https://api.openweathermap.org/data/2.5/forecast?q='+ city + '&units=imperial&appid=' + apiKey;
// fetches the api url for todays data
    fetch(apiUrl)
    .then(function (response){
        if(response.ok){
        console.log(response);
        response.json().then(function (data) {
            lattitude = data.coord.lat;
            longitude = data.coord.lon;
            storeCities(city);
            renderCities();
            let oneCallApi = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lattitude + "&lon=" +longitude + "&appid=" + apiKey;
            fetch(oneCallApi)
            .then(function (response){
                if(response.ok){
                    console.log(response);
                    response.json().then(function (dataTwo) {
                        console.log(dataTwo);
                    currentWeather(data, dataTwo);
                    })
                }
            })
        })
        }else {
            alert('Error: ' + response.statusText);
        }   
    })
    //5 day forecast fetch
    fetch(api5Day)
    .then(function (response){
        if(response.ok){
        console.log(response);
        response.json().then(function (data5) {
            console.log(data5);
            fiveDayForecast(data5);
        })
        }else {
            alert('Error: ' + response.statusText);
        }   
    })
    
}
//pulls current weather data and displays on screen
let currentWeather = function(data,dataTwo) {
    let imgCode = data.weather[0].icon;
    let cityName= data.name;
    //temperature
    let tempValue = data.main.temp;
    let temp = document.createElement("p");
    temp.textContent ="Temp: " + tempValue + "℉";
    //wind
    let windValue = data.wind.speed;
    let wind = document.createElement("p");
    wind.textContent ="Wind: " + windValue + " MPH";
    //humidity
    let humidityValue = data.main.humidity;
    let humidity = document.createElement("p");
    humidity.textContent ="Humidity: " + humidityValue + "%";
    //uv Index
    let uviValue = dataTwo.current.uvi;
    let uviSpan = document.createElement("span");
    uviSpan.classList.add("uvi");
    //if statement changes the color of the uvi index
    if(uviValue < 3){
        uviSpan.style.backgroundColor = "lightgreen";
    } else if (uviValue < 6) {
        uviSpan.style.backgroundColor = "yellow";
    } else if ( uviValue < 8) {
        uviSpan.style.backgroundColor = "orange";
    } else if ( uviValue < 11) {
        uviSpan.style.backgroundColor = "red";
    }else {
        uviSpan.style.backgroundColor = "rebeccapurple";
    }
    
    uviSpan.textContent = uviValue;
    let uvi = document.createElement("p");
    uvi.textContent ="UV Index: ";
    uvi.appendChild(uviSpan);


    //displays icon on current weather
    currentCityEl.innerHTML="";
    icon.src = "https://openweathermap.org/img/w/" +imgCode + ".png";
    city.textContent = cityName + " (" + today + ")";
    city.appendChild(icon);
    currentCityEl.appendChild(city);
    currentCityEl.appendChild(temp);
    currentCityEl.appendChild(wind);
    currentCityEl.appendChild(humidity);
    currentCityEl.appendChild(uvi);
    currentCityEl.style.border="2px solid #393e46";

    
}

function fiveDayForecast(data) {
    forecastContainerEl.innerHTML = "";
    let header = document.createElement("h3");
    let forecastDiv = document.createElement('div');
    forecastDiv.classList.add("forecast");
    header.textContent = "5-day Forecast";
    forecastContainerEl.appendChild(header);
    forecastContainerEl.appendChild(forecastDiv);
    let forecastEl = document.querySelector(".forecast");
    // loop for 5-day forecast population
    for(let i = 0; i < 5; i++ ) {
    // luxon dates for 5 day forecast
    let date = document.createElement("h4");
    let day = dt.plus({days: i + 1}).toLocaleString();
    date.textContent = day;
    let dayCount = i * 8;
    //find the weather icon for this day
    let icon = document.createElement('img');
    let imgCode = data.list[dayCount + 5].weather[0].icon;
    //temperature
    let tempValue = data.list[dayCount + 5].main.temp;
    let temp = document.createElement("p");
    temp.textContent ="Temp: " + tempValue + "℉";
    //wind
    let windValue = data.list[dayCount + 5].wind.speed;
    let wind = document.createElement("p");
    wind.textContent ="Wind: " + windValue + " MPH";
    //humidity
    let humidityValue = data.list[dayCount + 5].main.humidity;
    let humidity = document.createElement("p");
    humidity.textContent ="Humidity: " + humidityValue + "%";
    
    //display icon and weather for 5-day forecast

    icon.src = "https://openweathermap.org/img/w/" +imgCode + ".png";
    let forecastBox = document.createElement("div");
    forecastBox.classList.add("forecastBox")
    forecastBox.appendChild(date);
    forecastBox.appendChild(icon);
    forecastBox.appendChild(temp);
    forecastBox.appendChild(wind);
    forecastBox.appendChild(humidity);
    forecastEl.appendChild(forecastBox);
    

    }
}
init();
