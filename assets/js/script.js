var apiKey = APIKEY;
var uvIndexVal;

//pulls cities searched from local storage
var loadWeatherHistory = function(){
    var weatherArray = JSON.parse(localStorage.getItem("weatherStoredArray"));
    if (!weatherArray) {
        return 0;
    }
    else
    {
        for (var i = 0; i > weatherArray.length; i++) {
            addToSearchHistory(weatherArray[i]);
        }
    }
}
loadWeatherHistory();

//saves cities searched from local storage
var saveWeatherHistory = function(city){

    var weatherArray = JSON.parse(localStorage.getItem("weatherStoredArray"));

    if(!weatherArray)
    {
        weatherArray = [city];
    }
    else
    {
        if (!weatherArray.includes(city))
        {  weatherArray.push(city); }
    }

    localStorage.setItem("weatherStoredArray",JSON.stringify(weatherArray));
}

//appends the searched cities to the page history as buttons
var addToSearchHistory = function (currentSelectedCity) {
    
    if(document.getElementById(currentSelectedCity))
    {
        return 0;
    }
    else{
    var historyButton = $(".search-history").append("<li><button type=\"button\" id=\""+currentSelectedCity+"\"></button></li>");
    historyButton.find("#"+currentSelectedCity).addClass("btn btn-secondary search-history-button");
    historyButton.find("#"+currentSelectedCity).text(currentSelectedCity);
    saveWeatherHistory(currentSelectedCity);
    }
}

//event listener for search button
$(".search-city-button").click( function()
{
    event.preventDefault;

    var city = $(".city-name-input").val();

    var weatherApiUrl = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&units=metric&APPID="+apiKey;

    fetch(weatherApiUrl).then(function(response)
    {
        if (response.ok) {
            response.json().then(function(data) {
                $(".current-card").attr("hidden",false);
                $(".forecast-card").attr("hidden",false);

                var uvIndexApiUrl = "https://api.openweathermap.org/data/2.5/uvi?lat="+data.coord.lat+"&lon="+data.coord.lon+"&appid="+apiKey;
            
                fetch(uvIndexApiUrl).then(function(uvResponse)
                {
                    if (uvResponse.ok) {
                        uvResponse.json().then(function(uvData) {
                            uvIndexVal = (uvData.value);
                            showCurrentWeather(data,uvIndexVal);
                        });
                      } else {
                        alert("Error: \n" + uvResponse.statusText);
                      }
                }).catch(function(error) {
            
                    alert("Unable to connect to WeatherAPI"); 
                
                  });

              addToSearchHistory(city);
              showCurrentCityForecast(city);
            });
          } else {
            alert("Error: \n" + response.statusText);
          }
    }).catch(function(error) {

        alert("Unable to connect to WeatherAPI"); 
    
      });
});

//calls the api to populate the 5 day forecast
var showCurrentCityForecast = function (city)
{
    var weatherApiUrl = "https://api.openweathermap.org/data/2.5/forecast?q="+city+"&cnt=5&APPID="+apiKey;

    fetch(weatherApiUrl).then(function(response)
    {
        if (response.ok) {
            response.json().then(function(data) {
              showForecastWeather(data);
            });
          } else {
            alert("Error: \n" + response.statusText);
          }
    }).catch(function(error) {

        alert("Unable to connect to WeatherAPI"); 
    
      });
}


//Displays current weather conditions by appending elements to page
var showCurrentWeather = function(weatherInfo,uvIndexVal) {

    var weatherIconUrl = "https://openweathermap.org/img/wn/"+weatherInfo.weather[0].icon+"@2x.png"

    var today = dayjs().format('(DD/MM/YYYY)');
    $(".current-city").text(weatherInfo.name+" "+today+" ");
    $(".current-city").append("<img src="+weatherIconUrl+" alt=\"weather icon\" class=weather-icon></img>")
    $("#current-day").text("Temp: "+weatherInfo.main.temp+ "°C "+"Wind: "+weatherInfo.wind.speed+"MPH "+"Humidex: "+weatherInfo.main.humidity+"% "+"UV Index: "+uvIndexVal);
};

//Displays 5 day forecast weather conditions by appending elements to page
var showForecastWeather = function(forecastInfo) {

   for (i=0; i < forecastInfo.list.length; i++){

    var weatherIconUrl = "https://openweathermap.org/img/wn/"+forecastInfo.list[i].weather[0].icon+"@2x.png"

    var icon = ("<img src="+weatherIconUrl+" alt=\"weather icon\" class=weather-icon></img>")

    var today = dayjs(i).format('(DD/MM/YYYY)');

    var weatherText = ("Temp: "+forecastInfo.list[i].main.temp+" C "+"Wind: "+forecastInfo.list[i].wind.speed+"MPH "+"Humidex: "+forecastInfo.list[i].main.humidity+"% ");

    $("#day-plus-"+(i+1).toString()).text("");
    $("#day-plus-"+(i+1).toString()).append("<h5>"+today+"</h5>");
    $("#day-plus-"+(i+1).toString()).append(icon);
    $("#day-plus-"+(i+1).toString()).append("<p>"+weatherText+"</p>");

   }
}

$(".search-history-button").click( function(event)
{
    event.preventDefault;

    var city = $(event.target).text();

    $(".city-name-input").val(city);

    $(".search-city-button").trigger( "click" );
});