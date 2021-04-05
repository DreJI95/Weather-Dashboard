

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
                $(".current-card").attr("hidden",false);
                $(".forecast-card").attr("hidden",false);
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

    var weatherIconUrl = "http://openweathermap.org/img/wn/"+weatherInfo.weather[0].icon+"@2x.png"

    var today = dayjs().format('(DD/MM/YYYY)');
    $(".current-city").text(weatherInfo.name+" "+today+" ");
    $(".current-city").append("<img src="+weatherIconUrl+" alt=\"weather icon\" class=weather-icon></img>")
    $("#current-day").text("Temp: "+weatherInfo.main.temp+" C "+"Wind: "+weatherInfo.wind.speed+"MPH "+"Humidex: "+weatherInfo.main.humidity+"% ");
};

var showForecastWeather = function(forecastInfo) {

   for (i=0; i < forecastInfo.list.length; i++){

    var weatherIconUrl = "http://openweathermap.org/img/wn/"+forecastInfo.list[i].weather[0].icon+"@2x.png"

    var icon = ("<img src="+weatherIconUrl+" alt=\"weather icon\" class=weather-icon></img>")

    var today = dayjs(i).format('(DD/MM/YYYY)');

    var weatherText = ("Temp: "+forecastInfo.list[i].main.temp+" C "+"Wind: "+forecastInfo.list[i].wind.speed+"MPH "+"Humidex: "+forecastInfo.list[i].main.humidity+"% ");

    $("#day-plus-"+(i+1).toString()).text("");
    $("#day-plus-"+(i+1).toString()).append("<h5>"+today+"</h5>");
    $("#day-plus-"+(i+1).toString()).append(icon);
    $("#day-plus-"+(i+1).toString()).append("<p>"+weatherText+"</p>");

   }
}