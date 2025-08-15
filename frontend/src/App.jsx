import "mapbox-gl/dist/mapbox-gl.css";
import Map, { Marker, Popup } from "react-map-gl/mapbox";
import { Room, Star } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "timeago.js";
import "./App.css";

function App() {
  const [viewState, setViewState] = useState({
    longitude: 81.08,
    latitude: 15.04,
    zoom: 5, // zoomed out to see most of India
  });
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const currentUsername = "john";
  const [newPlace, setNewPlace] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    review: "",
    rating: 0,
  });

  const getPins = async () => {
    try {
      const res = await axios.get("/api/pins");
      setPins(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewState((prev) => ({ ...prev, longitude: long, latitude: lat }));
  };

  const handleAddClick = (e) => {
    const { lng, lat } = e.lngLat;
    setNewPlace({ lat, lng });
    setViewState((prev) => ({
      ...prev,
      longitude: lng,
      latitude: lat,
      zoom: 6,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addNewLocation = async () => {
    try {
      const newPin = {
        username: currentUsername,
        title: formData.title,
        desc: formData.review,
        rating: Number(formData.rating),
        lat: newPlace.lat,
        long: newPlace.lng,
      };

      const response = await axios.post("/api/pins", newPin);
      setPins([...pins, response.data]);
    } catch (error) {
      console.log(error);
    } finally {
      setFormData({ title: "", review: "", rating: 0 });
      setNewPlace(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addNewLocation();
  };

  // we want to fetch pins on initial load
  useEffect(() => {
    getPins();
  }, []);

  return (
    <Map
      {...viewState}
      onMove={(evt) => setViewState(evt.viewState)}
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
      style={{ width: "100%", height: "100vh" }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      onDblClick={handleAddClick}
      transitionDuration={200}
      doubleClickZoom={false}
    >
      {pins?.map((pin) => (
        <React.Fragment key={pin._id}>
          <Marker longitude={pin.long} latitude={pin.lat} anchor="bottom">
            <Room
              onClick={() => handleMarkerClick(pin._id, pin.lat, pin.long)}
              style={{
                fontSize: viewState.zoom * 5,
                color: pin.username === currentUsername ? "red" : "slateblue",
                cursor: "pointer",
              }}
            />
          </Marker>
          {pin._id === currentPlaceId && (
            <Popup
              longitude={pin.long}
              latitude={pin.lat}
              anchor="left"
              closeButton={true}
              closeOnClick={false}
              onClose={() => setCurrentPlaceId(null)}
            >
              <div className="card">
                <label>Place</label>
                <h4 className="place">{pin.title}</h4>
                <label>Review</label>
                <p className="desc">{pin.desc}</p>
                <label>Rating</label>
                <div className="stars">
                  {[...Array(pin.rating)].map((_,i) =><Star key={i} className="star" /> )}
                </div>
                <label>Information</label>
                <span className="username">
                  Created by <b>{pin.username}</b>
                </span>
                <span className="date">{format(pin.createdAt)}</span>
              </div>
            </Popup>
          )}
        </React.Fragment>
      ))}
      {newPlace && (
        <Popup
          longitude={newPlace.lng}
          latitude={newPlace.lat}
          anchor="left"
          closeButton={true}
          closeOnClick={false}
          onClose={() => setNewPlace(null)}
        >
          <div>
            <form onSubmit={handleSubmit}>
              <label>Title</label>
              <input
                placeholder="Enter a title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
              <label>Review</label>
              <textarea
                placeholder="Say us something about this place"
                name="review"
                value={formData.review}
                onChange={handleChange}
                required
              ></textarea>
              <label>Rating</label>
              <select
                required
                name="rating"
                value={formData.rating}
                onChange={handleChange}
              >
                <option value="">Select rating</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </select>
              <button className="submitButton" type="submit">
                Add Pin
              </button>
            </form>
          </div>
        </Popup>
      )}
    </Map>
  );
}

export default App;
