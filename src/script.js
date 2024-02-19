let ipURL = 'https://ipapi.co/json/';
let key = '051f2c33e4acf0eb6efa3eaab379t3o3';
var city = '';

axios.get(ipURL).then(function(response){
    console.log(response);
    city = response.data.city;
    let weatherUrlShort = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${key}&units=metric`;
    console.log(weatherUrlShort);
    axios.get(weatherUrlShort).then(updateCity).catch(showErrorAfterSubmit);
    }).catch(showErrorAfterSubmit);



function updateCity(response){
    console.log(response);
    console.log(response.data);
     if(response.data.status=="not_found"){
        showError("not-found");
     }
    else{
        let city = document.querySelector("#city-name");
        let currentTemp = document.querySelector("#current-temp");
        let weatherCondition = document.querySelector("#weather-condition");
        let currentWeatherIcon = document.querySelector("#current-weather-icon");
        let humidity = document.querySelector("#humidity");
        let pressure = document.querySelector("#pressure");
        let windSpeed = document.querySelector("#wind-speed");
        let feelsLike = document.querySelector("#feels-like");
        city.innerHTML = response.data.city;
        currentTemp.innerHTML = Math.round(response.data.temperature.current) + "°C";
        weatherCondition.innerHTML = response.data.condition.description;
        currentWeatherIcon.setAttribute("src", response.data.condition.icon_url);
        humidity.innerHTML = response.data.temperature.humidity + "%";
        pressure.innerHTML = response.data.temperature.pressure;
        windSpeed.innerHTML = response.data.wind.speed + ' km/h';
        feelsLike.innerHTML = Math.round(response.data.temperature.feels_like) + "°C";

        let weatherUrlLong = `https://api.shecodes.io/weather/v1/forecast?lat=${response.data.coordinates.latitude}&lon=${response.data.coordinates.longitude}&key=${key}&units=metric`;
        axios.get(weatherUrlLong).then(updateDetailsAndWeek).catch(showErrorAfterSubmit);
     }
}

function updateDetailsAndWeek(response){
    console.log(response);
    let maxTemp = document.querySelector("#max-temp");
    let minTemp = document.querySelector("#min-temp");
    maxTemp.innerHTML = Math.round(response.data.daily[0].temperature.maximum) + "°C";
    minTemp.innerHTML = Math.round(response.data.daily[0].temperature.minimum) + "°C";

    let weekWeather = document.querySelector("#week-weather-forecast");
    let dayOneTemp = document.querySelector("#day-1-temp");
    let dayOneIcon = document.querySelector("#day-1-icon");
    let dayTwoTemp = document.querySelector("#day-2-temp");
    let dayTwoDate = document.querySelector("#day-2-date");
    let dayTwoIcon = document.querySelector("#day-2-icon");
    let dayThreeTemp = document.querySelector("#day-3-temp");
    let dayThreeDate = document.querySelector("#day-3-date");
    let dayThreeIcon = document.querySelector("#day-3-icon");

    dayOneTemp.innerHTML = Math.round(response.data.daily[1].temperature.day) + "°C";
    dayOneIcon.setAttribute("src", response.data.daily[1].condition.icon_url);
    dayTwoTemp.innerHTML = Math.round(response.data.daily[2].temperature.day) + "°C";
    dayTwoDate.innerHTML = formatDate(1, false);
    dayTwoIcon.setAttribute("src", response.data.daily[2].condition.icon_url);
    dayThreeTemp.innerHTML = Math.round(response.data.daily[3].temperature.day) + "°C";
    dayThreeDate.innerHTML = formatDate(2, false);
    dayThreeIcon.setAttribute("src", response.data.daily[3].condition.icon_url);
}

let form = document.querySelector("form");
let searchField = document.querySelector("#search-field");

searchField.addEventListener("keydown", function(event){
    setTimeout(function(){
        let input = document.querySelector("#search-field");
        let error = document.querySelector(".error");
        if(!input.validity.valid){
            showError();
            return;
        }

        else if (event.keyCode === 13)
            return;
        else {
            error.innerHTML = "";
            error.classList.remove("error-message");
        }
    },500);
})
form.addEventListener("submit", function(event){
    event.preventDefault();
    city = document.querySelector("#search-field").value;
    let weatherUrlShort = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${key}&units=metric`;
    axios.get(weatherUrlShort).then(updateCity).catch(showErrorAfterSubmit);
})

var currentDate = document.querySelector("#current-date");
var currentTime = document.querySelector("#current-time");
currentDate.innerHTML = formatDate();
currentTime.innerHTML = formatTime();

function formatDate(dayOffSet = 0, toggleFomrat = true){
    var dateData = new Date();
    var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];
;
    var day = dateData.getDay();
    var date = dateData.getDate()+dayOffSet;
    var month = dateData.getMonth();
    var year = dateData.getFullYear();
    if(toggleFomrat){

        return `${dayNames[day]}, ${date}/${month}/${year}`
    }
    else
        return `${monthNames[month]} ${date}`;
}

function formatTime(){
    var dateData = new Date();
    var timeReg = /[(].*[)]/;
    var timeZone = dateData.toString().match(timeReg).toString().replace("(", "").replace(")", "");
    var hours = dateData.getHours();
    var minutes = dateData.getMinutes();
    if (minutes < 10){
        minutes = "0" + minutes;
    }
    if (hours < 10){
        hours = "0" + hours;
    }
    return  `${hours}:${minutes} ${timeZone}`;
}


let expandButton = document.querySelector(".additional-details-button");
let additionalDetails = document.querySelector("#additional-details-container");
var open = false;

expandButton.addEventListener("click", function(){
    open = !open;
    let additionalDetails = document.querySelector("#additional-details-container");
    let weekWather = document.querySelector("#week-weather-forecast");
    let arrow = document.querySelector("#arrow");

    if(open){
        additionalDetails.classList.add("animationConainer1");
        weekWather.classList.add("animationConainer2");
        arrow.classList.add("rotateArrowOpen");
        additionalDetails.classList.remove("animationConainer1Reverse");
        weekWather.classList.remove("animationConainer2Reverse");
        arrow.classList.remove("rotateArrowClose");
    }
    else{
        additionalDetails.classList.add("animationConainer1Reverse");
        weekWather.classList.add("animationConainer2Reverse");
        arrow.classList.add("rotateArrowClose");
        additionalDetails.classList.remove("animationConainer1");
        weekWather.classList.remove("animationConainer2");
        arrow.classList.remove("rotateArrowOpen");

    }

})


function showError(error){
    var errorMessage = '';
    let input = document.querySelector("#search-field");
    let errorElement = document.querySelector(".error");
    console.log(input.validity);
    console.log(error);

     if(input.validity.valueMissing){
        errorMessage = "You need to enter a city";
    }
    else if(input.validity.typeMismatch){
        errorMessage = "Please enter a valid city name";
    }
    else if(input.validity.patternMismatch){
        errorMessage = "Please enter letters only";
    }

    else if(error=="not-found"){
        errorMessage = "Please enter a valid city name";
    }

    errorElement.classList.add("error-message");
    errorElement.innerHTML = errorMessage;
}

function showErrorAfterSubmit(error){
    var errorMessage = 'Sorry, something went wrong. Please try again';
    let errorElement = document.querySelector(".error");

    errorElement.classList.add("error-message");
    errorElement.innerHTML = errorMessage;
}
