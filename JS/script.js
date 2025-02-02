const API_KEY = '86e6db5407f3601ec5b1981fa202757b';
const search = document.querySelector('.search-bar')
const input = document.querySelector('#input')

init();



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
    
    
}
async function displayCurrentWeather(city){
    const results  = await getLatLon(city);
    const {lat, lon, name} = results[0];
    const lat_cut = lat.toString().slice(0,4);
    const lon_cut = lon.toString().slice(0,4);
    const weather = await getCurrentWeather(lat_cut, lon_cut);
    const kelvin = 273.15;
    
      // Limpia el contenido 
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
    else if(weather.weather[0].main === 'Mist'){
        img.src = './weatherIcons/cloudy.png';
    }
        else{
        img.src = './weatherIcons/sun.png';
    }
    
    
    document.querySelector('.current-weather').appendChild(div);
    document.querySelector('.current-weather').appendChild(img);
    
   

}

async function displayAirConditions(city){
    const results = await getLatLon(city);
    const {lat, lon, name} = results[0];
    const lat_cut = lat.toString().slice(0,4);
    const lon_cut = lon.toString().slice(0,4);
    const weather = await getCurrentWeather(lat_cut, lon_cut);
    const kelvin = 273.15;

    const container = document.querySelector('.air-conditions-container');
    while (container.children.length > 1) {
    container.removeChild(container.lastChild);
}
    const div = document.createElement('div');
    div.classList.add('air-conditions');
    div.innerHTML = `
        <div class="air-conditions-left">
                        <div class="feels-like">
                            <p>Feels like <i class="fa-solid fa-temperature-quarter"></i></p>
                            <h3>${(weather.main.feels_like - kelvin).toFixed(1)}°C</h3>
                        </div
                    </div>
        <div class="air-conditions-right">
                        <div class="wind">
                            <p>Wind <i class="fa-solid fa-wind"></i></p>
                            <h3>${weather.wind.speed } m/s</h3>
                        </div>
                    </div>`;
                document.querySelector('.air-conditions-container').appendChild(div);
               
                
}

//async 5day/3 hour forecast
async function get5dayForecast(lat, lon){
    
    const APY_KEY = '86e6db5407f3601ec5b1981fa202757b';
    const API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    const response = await fetch(API_URL);
    const data = await response.json();
    return data;

    
}

async function display5dayForecast(city){
    const results = await getLatLon(city);
    const {lat, lon} = results[0];
    const lat_cut = lat.toString().slice(0,4);
    const lon_cut = lon.toString().slice(0,4);
    const forecast5day= await get5dayForecast(lat_cut, lon_cut);
    const {list} = forecast5day;
    // console.log(list);
    let forecast = [];
    forecast = list.filter(function(item){
        const hour = item.dt_txt.split(' ')[1];
        return hour === '09:00:00' || hour === '12:00:00' || hour === '18:00:00' || hour === '21:00:00'
        
    });
        const days = forecast.filter(function(day){
            const week = day.dt_txt.split(' ')[0];
            return week[0];
        });
        
        
        const week = days.filter((day) => day.dt_txt.split(' ')[1] === '09:00:00').slice(0, 5);
        

        //limpiar
        const container = document.querySelector('.sidebar');
            container.innerHTML = '';
            
        //include in dom
        const kelvin = 273.15;
        
        

        week.forEach((day)=>{
            const div = document.createElement('div');
            div.classList.add('day-forecast');
//
            const date = document.createElement('p')
            date.textContent = getWeekday(day.dt_txt.split(' ')[0]); //fecha del dia
            div.appendChild(date)

            const img = document.createElement('img');
            if(day.weather[0].main === 'Clouds'){
                img.src = './weatherIcons/cloudy.png';
            }else if(day.weather[0].main === 'Rain'){
                img.src = './weatherIcons/storm.png';
            }else if(day.weather[0].main === 'Clear'){
                img.src = './weatherIcons/sun.png';
            }else if(day.weather[0].main === 'Snow'){
                img.src = './weatherIcons/snow.png';
            }
            div.appendChild(img);

            const description = document.createElement('p')
            description.textContent = day.weather[0].main;
            div.appendChild(description);

            const temp = document.createElement('h2')
            temp.textContent = (day.main.temp - kelvin).toFixed(1) + "°C";
            div.appendChild(temp)

            container.appendChild(div)
            

        });
        }

        
    
    
    function init(){
        document.addEventListener('DOMContentLoaded', function () {
            const input = document.getElementById('input');
            input.addEventListener('keydown', function (event) {
              if (event.key === 'Enter') {
                displayCurrentWeather(event.target.value);
                displayAirConditions(event.target.value);
                display5dayForecast(event.target.value);
                event.target.value = '';
              }
            });
          });
    }
    

        function getWeekday(dateString) {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
        }
        
        


