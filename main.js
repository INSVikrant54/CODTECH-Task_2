const api = {
  key: "fcc8de7015bbb202209bbf0261babf4c",
  base: "https://api.openweathermap.org/data/2.5/"
}

const searchbox = document.querySelector('.search-box');
searchbox.addEventListener('keypress', setQuery);

function setQuery(evt) {
  if (evt.keyCode === 13) {
    getResults(searchbox.value);
  }
}

function getResults(query) {
  fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
    .then(weather => {
      return weather.json();
    }).then(weather => {
      displayResults(weather);
      localStorage.setItem('lastCity', query);
    });
}

function displayResults(weather) {
  let city = document.querySelector('.location .city');
  city.innerText = `${weather.name}, ${weather.sys.country}`;

  let now = new Date();
  let date = document.querySelector('.location .date');
  date.innerText = dateBuilder(now);

  let temp = document.querySelector('.current .temp');
  temp.innerHTML = `${Math.round(weather.main.temp)}<span>°c</span>`;

  let weatherIcon = getIcon(weather.weather[0].main, now);
  let weather_el = document.querySelector('.current .weather');
  weather_el.innerHTML = `<i class="fas ${weatherIcon}"></i><span class="weather-text">${weather.weather[0].main}</span>`;

  let hilow = document.querySelector('.hi-low');
  hilow.innerText = `${Math.round(weather.main.temp_min)}°c / ${Math.round(weather.main.temp_max)}°c`;
}

function dateBuilder(d) {
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = d.getMonth();
  let year = d.getFullYear();

  return `${day} ${date} ${months[month]} ${year}`;
}

function getIcon(weather, currentDate) {
  const hour = currentDate.getHours();
  const isDayTime = hour >= 6 && hour < 18;

  switch (weather) {
    case 'Clear':
      return isDayTime ? 'fa-sun' : 'fa-moon';
    case 'Clouds':
      return isDayTime ? 'fa-cloud-sun' : 'fa-cloud-moon';
    case 'Rain':
      return isDayTime ? 'fa-cloud-sun-rain' : 'fa-cloud-moon-rain';
    case 'Thunderstorm':
      return 'fa-cloud-bolt';
    case 'Drizzle':
      return 'fa-cloud-rain';
    default:
      return 'fa-cloud';
  }
}

// Load the last searched city from local storage on page load
window.addEventListener('load', () => {
  const lastCity = localStorage.getItem('lastCity');
  if (lastCity) {
    getResults(lastCity);
  }
});
