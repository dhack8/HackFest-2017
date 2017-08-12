var express = require('express');
var request = require('request-promise-native');
var app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");

var forecastIOKey = "469e0510219cb2c1d7da0282251e37e0"; // FIXME : replace with your API key gained from forecast.io

function requestTemperature() {
  var url = "https://api.forecast.io/forecast/" + forecastIOKey + "/-41.2865,174.7762";

  return request({url: url, json: true}).then(data => {
    var temperature = data.currently.temperature;
    var celsius = (temperature - 32) * 5 / 9;

    return Math.round(celsius * 10) / 10;
  });
};

function determineFood(temperature) {
  if (temperature > 18) {
    return "ice cream"; 
  }
  else {
    return "fried noodles";
  }
}

app.get("/", (req, res) => {
  requestTemperature().then(temperature => {
    var food = determineFood(temperature);
    var test = "SWAG";
    var variables = {temperature, food, test};
    res.render("index.html.ejs", variables);
  });
});

app.listen(3000);
