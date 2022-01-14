const link =
  "http://api.weatherstack.com/current?access_key=API_KEY";

const root = document.getElementById('root');
const popup = document.getElementById('popup');
const form = document.getElementById('form');
const textInput = document.getElementById('text-input');
const submitButton = document.getElementById('submit-button');
const close = document.getElementById('close');

let store = {
  city: "Moscow",
  feelslike: 0,
  temperature: 0,
  observationTime: "00:00 AM",
  isDay: "yes",
  desctiption: "",
  properties: {
    cloudcover: {},
    humidity: {},
    windSpeed: {},
    pressure: {},
    uvIndex: {},
    visibility: {},
  },
}

const fetchData = async () => {
  try {
    const query = localStorage.getItem('query') || store.city
    const result = await fetch(`${link}&query=${query}`);
    const data = await result.json();

    const {
      current: {
        cloudcover,
        temperature,
        humidity,
        observation_time: observationTime,
        pressure,
        visibility,
        is_day: isDay,
        weather_descriptions: description,
        wind_speed: windSpeed,
        weather_icons: icon,
      },
      location: {
        name
      }
    } = data;

    store = {
      ...store,
      isDay,
      city: name,
      temperature,
      humidity,
      observationTime,
      description: description[0],
      icon,
      properties: {
        cloudcover: `${cloudcover}%`,
        humidity: `${humidity}%`,
        windSpeed: `${windSpeed} km/h`,
        visibility: `${visibility}%`,
        pressure: `${pressure}%`,
        uvIndex: `${data.current.uv_index} / 100`,
      },
    };


    renderComponent();
  } catch (error) {
    console.log(error)
    alert('Вы ввели некоректные данные или я не оплатил сервис предоставляющий API )))')
  }
};

const renderProperty = (properties) => {

  const { icon } = store;
  return Object.entries(properties).map(item => {
    return `<div class="property">
    <div class="property-icon">
      <img src="${icon}" alt="">
    </div>
    <div class="property-info">
      <div class="property-info__value">${item[1]}</div>
      <div class="property-info__description">${item[0]}</div>
    </div>
  </div>`;
  })
    .join(' ')
};



const markup = () => {
  const { city, description, observationTime, temperature, icon, isDay, properties } = store;

  const containerClass = isDay === 'yes' ? 'is-day' : '';

  return `<div class="container ${containerClass}">
    <div class="top">
      <div class="city">
        <div class="city-subtitle">Weather Today in</div>
          <div class="city-title" id="city">
          <span>${city}</span>
        </div>
      </div>
      <div class="city-info">
        <div class="top-left">
        <img class="icon" src="${icon}" alt="" />
        <div class="description">${description}</div>
      </div>
    
      <div class="top-right">
        <div class="city-info__subtitle">as of ${observationTime}</div>
        <div class="city-info__title">${temperature}°</div>
      </div>
    </div>
  </div>
<div id="properties">${renderProperty(properties)}</div>
</div>`;
};

const renderComponent = () => {
  root.innerHTML = `${markup()}`;
  const city = document.getElementById('city');
  city.addEventListener('click', handleClick)
};



const handleClick = () => {
  popup.classList.toggle('active')
}

const formSubmit = event => {
  event.preventDefault()
  const value = store.city

  if (!value) {
    return null
  }
  localStorage.setItem('query', value)
}

const submitButtonHandler = () => {
  const value = textInput.value
  if (!value.trim().length) {
    return
  }
  store = {
    ...store,
    city: value
  }
  fetchData()
  popup.classList.toggle('active')
}

const closeHandler = () => {
  popup.classList.toggle('active')
}

form.addEventListener('submit', formSubmit)
form.addEventListener('onKeyDown', formSubmit)

submitButton.addEventListener('click', submitButtonHandler)
close.addEventListener('click', closeHandler)


fetchData();