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
let icon = document.createElement("img");
let city = document.createElement("h2");


let getWeather = function (city) {
    let apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial&appid='+apiKey;
   

    fetch(apiUrl)
    .then(function (response){
        if(response.ok){
        console.log(response);
        response.json().then(function (data) {
            lattitude = data.coord.lat;
            longitude = data.coord.lon;
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
    
}

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
    let uvi = document.createElement("p");
    uvi.textContent ="UV Index: " + uviValue;

    icon.src = "https://openweathermap.org/img/w/" +imgCode + ".png";
    city.textContent = cityName + " (" + today + ")";
    currentCityEl.appendChild(city);
    currentCityEl.appendChild(icon);
    currentCityEl.appendChild(temp);
    currentCityEl.appendChild(wind);
    currentCityEl.appendChild(humidity);
    currentCityEl.appendChild(uvi);

    
}

