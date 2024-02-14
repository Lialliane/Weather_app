let ipURL = 'http://ip-api.com/json/';
let timeURL = "http://worldtimeapi.org/api/";
axios.get(ipURL).then(function(response){
    console.log(response)
});

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


