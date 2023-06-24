import React from 'react';
import { Map, Marker, NavigationControl, Popup} from "react-map-gl";
import maplibregl from 'maplibre-gl';
import {useState,useEffect } from "react";
import 'maplibre-gl/dist/maplibre-gl.css';
import './App.css';
import {FaMapMarker} from "react-icons/fa"
import {MdStarRate} from "react-icons/md"
import axios from "axios"
import {format} from "timeago.js"
import Register from './Components/register';
import Login from './Components/login';


function App() {
    const myStorage = window.localStorage;
    const [currentUsername, setCurrentUsername] = useState(myStorage.getItem("user"));
    const [pins, setPins] = useState([]);
    const [currentPlaceId, setCurrentPlaceId] = useState(null);
    const [newPlace, setNewPlace] = useState(null);
    const [title, setTitle] = useState(null);
    const [desc, setDesc] = useState(null);
    const [star, setStar] = useState(0);
    const [showRegister, setShowRegister] = useState(false);
    const [showLogin, setShowLogin] = useState(false);

    const [viewport, setViewport] = useState({
        latitude: 28.612894,
        longitude: 77.229446,
        zoom: 3.5,
      }); 

      useEffect(() => {
        const getPins = async () => {
          try {
            const res = await axios.get("/pins");
            setPins(res.data);
          } catch (err) {
            console.log(err);
          }
        };
        getPins();
      }, []);

      const handleMarkerClick = (id, lat, long) => {
        setCurrentPlaceId(id);
        setViewport({ ...viewport, latitude: lat, longitude: long });
      };

      const handleAddClick = (e) => {
        const long = e.lngLat.lng;
        const lat = e.lngLat.lat;
        setNewPlace({
          lat,
          long,
        });
        // console.log(e.lngLat.lng)
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        const newPin = {
          username: currentUsername,
          title,
          desc,
          rating: star,
          lat: newPlace.lat,
          long: newPlace.long,
        };
    
        try {
          const res = await axios.post("/pins", newPin);
          setPins([...pins, res.data]);
          setNewPlace(null);
        } catch (e) {
          console.log(e);
        }
      };

      const handleLogout = () => {
        setCurrentUsername(null);
        myStorage.removeItem("user");
      };
      const handleLogin = () => {
        setShowRegister(false);
        setShowLogin(true);
      };
      const handleRegister = () => {
        setShowRegister(true);
        setShowLogin(false);
      };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <Map
        width="100%"
        height="100%"
        mapLib={maplibregl} 
        initialViewState={viewport}
        transitionDuration={200}
        onMove={(event) => setViewport({ ...viewport, latitude: event.target.getCenter().lat, longitude: event.target.getCenter().lng })}
        onZoom={(event) => setViewport({ ...viewport, zoom: event.target.getZoom()})}
        mapStyle="https://api.maptiler.com/maps/streets/style.json?key=wgD4cZi6ZVYNcef3TWqD"
        onDblClick={handleAddClick}>
        {pins.map((p)=>(
             <>
                <Marker
                    latitude={p.lat}
                    longitude={p.long}
                    offsetLeft={-3.5*viewport.zoom}
                    offsetTop={-7*viewport.zoom}>
                    <FaMapMarker
                        style={{
                            fontSize: 7 * viewport.zoom,
                            color:currentUsername === p.username ? "tomato" : "slateblue",
                            cursor: "pointer",
                        }}
                        onClick={()=>handleMarkerClick(p.id,p.lat,p.long)}
                    />
                </Marker>
                {p.id === currentPlaceId &&
                    <Popup
                        latitude={p.lat}
                        longitude={p.long}
                        closeButton={true}
                        closeOnClick={false}
                        anchor="left"
                        onClose={()=> setCurrentPlaceId(null)}>
                        <div className="card">
                            <label>Place</label>
                            <h4 className="place">{p.title}</h4>
                            <label>Review</label>
                            <p className="desc">{p.desc}</p>
                            <label>Rating</label>
                            <div className="stars">
                                {Array(p.rating).fill(<MdStarRate className="star" />)}
                            </div>
                            <label>Information</label>
                            <span className="username">
                                Created by <b>{p.username}</b>
                            </span>
                            <span className="date">{format(p.createdAt)}</span>
                            </div>
                    </Popup>
                }
            </>
        ))}
        {newPlace &&(
            <Popup
                latitude={newPlace.lat}
                longitude={newPlace.long}
                closeButton={true}
                closeOnClick={false}
                anchor="left"
                onClose={()=> setNewPlace(null)}>
                <div>
                    <form onSubmit={handleSubmit}>
                    <label>Title</label>
                    <input
                        placeholder="Enter a title"
                        autoFocus
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <label>Description</label>
                    <textarea
                        placeholder="Say us something about this place."
                        onChange={(e) => setDesc(e.target.value)}
                    />
                    <label>Rating</label>
                    <select onChange={(e) => setStar(e.target.value)}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                    <button type="submit" className="submitButton">
                        Add Pin
                    </button>
                    </form>
                </div>
            </Popup>
        )}
        {currentUsername===null? (
            <div className='buttons'>
              <button className='button login' onClick={handleLogin}>Login</button>
              <button className='button register' onClick={handleRegister}>Register</button>
            </div>
          ):(<button className='button logout' onClick={handleLogout}>Log out</button>
        )}
        {showRegister && <Register setShowRegister={setShowRegister}/>}
        {showLogin && (
          <Login 
            setShowLogin={setShowLogin}
            setCurrentUsername={setCurrentUsername} 
            myStorage={myStorage}/>
        )}
        <NavigationControl position="top-left" />
      </Map>
    </div>
  );
}

export default App;