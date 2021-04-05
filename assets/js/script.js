

var addToSearchHistory = function (currentSelectedCity) {
    
    if(document.getElementById(currentSelectedCity))
    {
        return 0;
    }
    else{
    var historyButton = $(".search-history").append("<li><button type=\"button\" id=\""+currentSelectedCity+"\"></button></li>");
    historyButton.find("#"+currentSelectedCity).addClass("btn btn-secondary search-city-button");
    historyButton.find("#"+currentSelectedCity).text(currentSelectedCity);
    }
}

$(".search-city-button").click( function()
{
    event.preventDefault;

    var city = $(".city-name-input").val().trim();

    var weatherApiUrl = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&units=metric&APPID=ab5543a0004ddf7308f14dbe112934c4";

    fetch(weatherApiUrl).then(function(response)
    {
        if (response.ok) {
            response.json().then(function(data) {
              showCurrentWeather(data);
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

var showCurrentCityForecast = function (city)
{
    var weatherApiUrl = "https://api.openweathermap.org/data/2.5/forecast?q="+city+"&cnt=5&APPID=ab5543a0004ddf7308f14dbe112934c4";

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

var showCurrentWeather = function(weatherInfo) {
    console.log(weatherInfo);

    var today = dayjs().format('(DD/MM/YYYY)');
    $(".current-city").text(weatherInfo.name+" "+today+" "+weatherInfo.weather.icon);
    $("#current-day").text(weatherInfo.main.temp+" C "+weatherInfo.wind.speed+"MPH "+weatherInfo.main.humidity+"% ");

}

var showForecastWeather = function(forecastInfo) {
   console.log(forecastInfo);

   for (i=0; i < forecastInfo.list.length; i++){

    var today = dayjs(i).format('(DD/MM/YYYY)');
    $("#day-plus-"+(i+1).toString()).text(today+" "+forecastInfo.list[i].main.temp+" C "+forecastInfo.list[i].wind.speed+"MPH "+forecastInfo.list[i].main.humidity+"% ");

   }
}