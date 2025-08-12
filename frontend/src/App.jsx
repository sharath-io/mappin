import "mapbox-gl/dist/mapbox-gl.css";
import Map, { Marker, Popup } from "react-map-gl/mapbox";
import { Room, Star } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "timeago.js";
import "./App.css";

function App() {
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [pins, setPins] = useState([]);
  const [viewState, setViewState] = useState({
    longitude: 81.08,
    latitude: 15.04,
    zoom: 5, // zoomed out to see most of India
  });
  
  const handleMarkerClick = (id) => {
    console.log('handling....',id)
    setCurrentPlaceId(id);
  };

  // we want to fetch pins on initial load
  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("/api/pins");
        console.log("from api ", res.data);
        setPins(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    getPins();
  }, []);

  return (
    <Map
      {...viewState}
      onMove={(evt) => setViewState(evt.viewState)}
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
      style={{ width: "100%", height: "100vh" }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
    >
      {pins?.map((pin) => (
        <React.Fragment key={pin._id}>
          <Marker longitude={pin.long} latitude={pin.lat} anchor="bottom">
            <Room
              onClick={() => handleMarkerClick(pin._id)}
              style={{ fontSize: viewState.zoom * 5, color: "red",cursor:"pointer" }}
            />
          </Marker>
          {pin._id === currentPlaceId && (
            <Popup longitude={pin.long} latitude={pin.lat} anchor="left" closeButton={true} closeOnClick={false} onClose={()=> setCurrentPlaceId(null)}>
              <div className="card">
                <label>Place</label>
                <h4 className="place">{pin.title}</h4>
                <label>Review</label>
                <p className="desc">{pin.desc}</p>
                <label>Rating</label>
                <div className="stars">
                  <Star className="star" />
                  <Star className="star" />
                  <Star className="star" />
                  <Star className="star" />
                  <Star className="star" />
                </div>
                <label>Information</label>
                <span className="username">
                  Created by <b>{pin.username}</b>
                </span>
                <span className="date">{format(pin.createdAt)}</span>
              </div>
            </Popup>
          )}
        </React.Fragment >
      ))}
    </Map>
  );
}

export default App;
