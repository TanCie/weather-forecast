const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');


const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const API_KEY = 'c9052764d1654bfba0a162105241909';

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hourIn12Hr = hour >= 13 ? hour % 12 : hour;
    const minutes = time.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM';

    timeEl.innerHTML = (hourIn12Hr < 10 ? '0'+hourIn12Hr : hourIn12Hr) + ':' + (minutes < 10 ? '0'+minutes : minutes) + ' ' + `<span id="am-pm">${ampm}</span>`;

    dateEl.innerHTML = days[day] + ', ' + date + ' ' + months[month];

}, 1000);

getWeatherData();

function getWeatherData() {
    navigator.geolocation.getCurrentPosition((success) => {
        console.log(success);

        let { latitude, longitude } = success.coords;
        fetch(`http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${latitude},${longitude}&days=7`).then(res => res.json()).then(data => {
            console.log(data);
            showWeatherData(data);
        })
    })
}

function showWeatherData(data) {
    let { humidity, pressure_in, wind_kph } = data.current;
    const { sunrise, sunset } = data.forecast.forecastday[0].astro;

    //timezone.innerHTML = data.location.tz_id;
    countryEl.innerHTML = data.location.lat + 'N ' + data.location.lon + 'E';

    currentWeatherItemsEl.innerHTML =
        `<div class="weather-item">
                  <div>Humidity</div>
                  <div>${humidity}%</div>
               </div>
               <div class="weather-item">
                  <div>Pressure</div>
                  <div>${pressure_in}</div>
               </div>
               <div class="weather-item">
                  <div>Wind Speed</div>
                  <div>${wind_kph}</div>
               </div>
               <div class="weather-item">
                  <div>Sunrise</div>
                  <div>${sunrise}</div>
               </div>
               <div class="weather-item">
                  <div>Sunset</div>
                  <div>${sunset}</div>
               </div>
               
               `;

    let otherDayForecast = ''

    data.forecast.forecastday.forEach((day, index) => {
        const { icon } = day.day.condition;
        const { mintemp_c, maxtemp_c } = day.day;
        if (index == 0) {
            currentTempEl.innerHTML = `
                <img src="https:${icon}" alt="weather-icon" class="w-icon">
                <div class="other">
                    <div class="day"> ${window.moment(day.date_epoch * 1000).format('ddd')} </div>
                    <div class="temp">Night - ${mintemp_c}&#176; C</div>
                    <div class="temp">Day - ${maxtemp_c}&#176;C</div>
                </div>
            `
            
        } else {

            otherDayForecast += `
                    <div class="weather-forecast-item">
                        <div class="day">${window.moment(day.date_epoch * 1000).format('ddd')}</div>
                        <img src="https:${icon}" alt="weather-icon" class="w-icon">
                        <div class="temp">Night - ${mintemp_c}&#176; C</div>
                        <div class="temp">Day - ${maxtemp_c}&#176;C</div>
                    </div>
                    `

        }
    })
    weatherForecastEl.innerHTML = otherDayForecast;
}



/* NOTE: to convert computer jargon to time:
    and add "cdn js moment" ajax link
   print this: window.moment(sunrise*1000).format('HH:mm a')
*/