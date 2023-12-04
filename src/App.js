// import logo from './logo.svg';
// import './App.css';
import axios from 'axios';
import { useState } from "react";
var formatcoords = require('formatcoords');



function App() {
  const [ data, setData] = useState({});
  const [ location, setLocation] = useState("")
  const [ lat, setLat] = useState( 0 );
  const [ lon, setLon] = useState( 0 );

  // const urlCityToLatAndLon = "https://api.openweathermap.org/geo/1.0/direct?q=london&limit=5&appid=ace169a15680d1dde5416508dd0789fc"
  // const url = `https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid=ace169a15680d1dde5416508dd0789fc`;
  // const url = "https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid=ace169a15680d1dde5416508dd0789fc";


  const searchLocation = (event) => {
    if( event.key === 'Enter'){

      
      const urlLocation = `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=${process.env.REACT_APP_OPENWEATHER_API_KEY}`;
      // console.log( `City: ${location} | urlLocation: ..${urlLocation}..`);
      console.log( `City: ${location}`);
      axios.get(urlLocation).then( (response) => {
      
        try {
          // console.log( response);
          // console.log( response.data );
          var coords = formatcoords( response.data[0].lat, response.data[0].lon);
          var str = coords.format('DD MM ss X',{latLonSeparator: ', ',  decimalPlaces: 0});
          var [ latStr, lonStr ] = str.split( ",").map( el => el.trim());
          
          setLat( latStr ) ;
          setLon( lonStr ) ;
          console.log(`${str}\nLat:${response.data[0].lat}, Lon=${response.data[0].lon}`);
          const urlLatAndLonToWeatherInfo = `https://api.openweathermap.org/data/2.5/weather?lat=${response.data[0].lat}&lon=${response.data[0].lon}&units=imperial&appid=${process.env.REACT_APP_OPENWEATHER_API_KEY}`;
          // console.log( `urlLatAndLonToWeatherInfo: ${urlLatAndLonToWeatherInfo}`);
          
          
          axios.get(urlLatAndLonToWeatherInfo).then( (response) => {
            setData( response.data );
          })
        }catch(err){
          console.log(`Error: ${err}`)
        }

      })
    }
  }

  return (
    <div className="App">
      <div className="search">
        <input 
          value={location} 
          onChange={ event => setLocation(event.target.value)} 
          onKeyPress={searchLocation}
          placeholder='Enter Location..'
          type="text" />
      </div> {/* //serach box */}

      <div className="container">
        <div className="top">
          <div className="location">
            <p>{data.name}</p>
          </div>
          <div className="temp">
            {data.main ? <h1>{data.main.temp.toFixed()} °F</h1> : null}
          </div>
          <div className="description">
          {data.weather ? <p>{(data.weather[0].description)}</p> : null}
          </div>
          <p className="lat">
            latitude
          </p>
            { data.coord ? <p>{lat}</p> : null}
          <p className="lon">
            longitude
          </p>
            { data.coord ? <p>{lon}</p> : null}
        </div>{/* top */ }

        <div className="bottom">
          <div className="feels">
            {data.main ? <p className='bold'>
            {data.main.feels_like.toFixed()} °F</p> : null }
            <p>Feels like</p>
          </div>
          <div className="humidity">
          { data.main ? <p className='bold'>{data.main.humidity} %</p> : null }
            <p>Humidity</p>
          </div>
          <div className="wind">
          { data.wind ? <p className='bold'>{data.wind.speed.toFixed()} MPH </p> : null }
            
            <p>Wind Speed</p>
          </div>
        </div> {/* //bottom */}
      
      </div> {/* //container */}
     
     
    </div>
  );
}

export default App;
