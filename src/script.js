let ipURL = 'https://json.geoiplookup.io/';
let key = '051f2c33e4acf0eb6efa3eaab379t3o3';
var city = '';

axios.get(ipURL).then(function(response){
    console.log(response);
    city = response.data.region;
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

    let weekForecastElement = document.querySelector("#week-weather-forecast");
    var ForecastHtml = "";

    response.data.daily.every(function(day, index){
        console.log(day);
        console.log(index);
        ForecastHtml += `<div class="week-weather-container d-lg-flex flex-lg-row flex-column col-2 container ">
                <div class="week-weather col-6">
                    <b class="week-day-date d-block">
                    ${formatDate(false, day.time)}
                    </b>
                    <p class="week-day-temp">${(Math.round(day.temperature.maximum)<10)?"0"+Math.round(day.temperature.maximum):Math.round(day.temperature.maximum)}°C
                    ${(Math.round(day.temperature.minimum)<10)?"0"+Math.round(day.temperature.minimum):Math.round(day.temperature.minimum)}°C
                    </p>

                </div>
                <img class="week-day-icon img-fluid col-6"  src="${day.condition.icon_url}"  />
            </div>`;
        if(index==4){
            return false;
        }
        return true;

    })
    weekForecastElement.innerHTML = ForecastHtml;

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

var currentDate = document.querySelector("#current-date");
var currentTime = document.querySelector("#current-time");
currentDate.innerHTML = formatDate();
currentTime.innerHTML = formatTime();

function formatDate( toggleFomrat = true, timestamp = 0){

    var dateData = (timestamp == 0) ? new Date() : new Date(timestamp*1000);
    var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];
;
    var day = dateData.getDay();
    var date = dateData.getDate();
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




