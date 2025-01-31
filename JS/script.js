const API_KEY = '86e6db5407f3601ec5b1981fa202757b';
const search = document.querySelector('.search-bar')
const input = document.querySelector('#input')

document.addEventListener('DOMContentLoaded', function () {
    const input = document.getElementById('input');
    input.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        displayCurrentWeather(event.target.value);
        event.target.value = '';
      }
    });
  });


async function getLatLon(city){

    const APY_KEY = '86e6db5407f3601ec5b1981fa202757b';
    const API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${APY_KEY}`;
    const response = await fetch(API_URL);
    const data = await response.json();
    return data;
    
}

async function getCurrentWeather(lat, lon){
    const APY_KEY = '86e6db5407f3601ec5b1981fa202757b';
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    const response = await fetch(API_URL);
    const data = await response.json();
    return data;
    // console.log(data);
    
}
async function displayCurrentWeather(city){
    const results  = await getLatLon(city);
    const {lat, lon, name} = results[0];
    const lat_cut = lat.toString().slice(0,4);
    const lon_cut = lon.toString().slice(0,4);
    const weather = await getCurrentWeather(lat_cut, lon_cut);
    const kelvin = 273.15;
    console.log(weather.weather[0].description);
    console.log(name);
    console.log(weather.weather[0].main);
    // console.log(weather.name);
      // Limpia el contenido dinámico
    document.querySelector('.current-weather').innerHTML = '';

    const div = document.createElement('div');
    div.classList.add('current-weather-details');
    div.innerHTML = `
    
                <h1>${name}</h1>
                <p>${weather.weather[0].description}</p>
                <h2 class="degree">
                    ${ (weather.main.temp - kelvin).toFixed(1)}°C
                </h2>
            `;
    const img = document.createElement('img');
    if(weather.weather[0].main === 'Clouds'){
        img.src = './weatherIcons/cloudy.png';
    }else if(weather.weather[0].main === 'Rain'){
        img.src = './weatherIcons/storm.png';
    }else if(weather.weather[0].main === 'Clear'){
        img.src = './weatherIcons/sun.png';
    }else if(weather.weather[0].main === 'Snow'){
        img.src = './weatherIcons/snow.png';
    }
    document.querySelector('.current-weather').appendChild(div);
    document.querySelector('.current-weather').appendChild(img);
    
   

}
// getLatLon('London');