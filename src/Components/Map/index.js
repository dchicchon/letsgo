import React, { useState, useEffect } from "react";
import GoogleMapReact from "google-map-react";
import Button from "react-bootstrap/Button";
import "./index.css";

// PLACES LIBRARY
// https://developers.google.com/maps/documentation/javascript/places#place_search_requests
// GOOGLE MAPS
// https://www.npmjs.com/package/google-map-react
const Map = ({
  handleApiLoaded,
  coordinates,
  zoom,
  locations,
  setLocationList,
  setDestinationList,
  destinations,
  toggles,
  googleMaps,
  map,
}) => {
  useEffect(() => {
    console.log("RENDER MAP");
    if (googleMaps && toggles.length !== 0) {
      findToggleLocations();
    } else if (googleMaps && toggles.length === 0) {
      setToggleLocations([]);
    }
  }, [coordinates, toggles]);

  const [toggleLocations, setToggleLocations] = useState([]);

  const findToggleLocations = () => {
    console.log("Find Toggle Locations");
    console.log(toggles);
    //   Get the places service

    const service = new googleMaps.places.PlacesService(map);
    // make request

    // What we can do here, we can get the average of Lat and Lng for the Map Bounds
    const mapBounds = map.getCenter();
    console.log("Map Bounds");
    console.log(mapBounds);
    const pyrmont = new googleMaps.LatLng(mapBounds.lat(), mapBounds.lng());
    //   console.log(map.getBounds()); // returns LatLngBounds
    const request = {
      location: pyrmont, // it works!
      radius: "500",
      type: toggles,
    };

    //   console.log(places);
    service.nearbySearch(request, (results, status) => {
      if (status === googleMaps.places.PlacesServiceStatus.OK) {
        console.log("Found Items");
        console.log(results);
        setToggleLocations(results);
      }
    });
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{
          key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
          libraries: ["places"],
        }}
        center={{ lat: coordinates[0], lng: coordinates[1] }}
        zoom={zoom}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
      >
        {locations.map((location, index) => (
          <Location
            key={index}
            location={location}
            setLocationList={setLocationList}
            setDestinationList={setDestinationList}
            lat={location.geometry.location.lat()}
            lng={location.geometry.location.lng()}
          />
        ))}

        {destinations.map((destination, index) => (
          <Destination
            key={index}
            destination={destination}
            lat={destination.geometry.location.lat()}
            lng={destination.geometry.location.lng()}
          />
        ))}

        {toggleLocations.map((location, index) => (
          <ToggleLocation
            key={index}
            location={location}
            setDestinationList={setDestinationList}
            lat={location.geometry.location.lat()}
            lng={location.geometry.location.lng()}
          />
        ))}

        {/* Based on what toggle we have, lets make markers for those toggles */}
      </GoogleMapReact>
    </div>
  );
};

const ToggleLocation = ({ location, setDestinationList }) => {
  const addToDestinations = () => {
    setDestinationList((oldList) => [...oldList, location]);
  };
  return (
    <div>
      <div
        title={location.name}
        className="pin bounce"
        onClick={addToDestinations}
        style={{ backgroundColor: "orange", cursor: "pointer" }}
      />
      <div className="pulse" />
    </div>
  );
};

const Location = ({ location, setDestinationList, setLocationList }) => {
  const [display, setDisplay] = useState(false);

  const addToDestinations = () => {
    // Should remove this item from location and then set destination list
    setLocationList((oldList) => oldList.filter((item) => item !== location));
    setDestinationList((oldList) => [...oldList, location]);
  };

  return (
    <div>
      {/* Add a box on top of this pin to display and allow user to add to destinations */}
      {display && (
        <div className="info-box">
          {location.name}
          <Button onClick={addToDestinations}>+</Button>
        </div>
      )}
      <div
        title={location.name}
        className="pin bounce"
        onClick={() => setDisplay(!display)}
        style={{ backgroundColor: "blue", cursor: "pointer" }}
      />
      <div className="pulse" />
    </div>
  );
};

const Destination = ({ destination }) => {
  const [display, setDisplay] = useState(false);


  return (
    <div>
      {display && (
        <div className="info-box">
          {destination.name}
        </div>
      )}
      <div
        title={destination.name}
        className="pin bounce destination"
        onClick={() => setDisplay(!display)}
        style={{ backgroundColor: "red", cursor: "pointer" }}
      />
    </div>
  );
};

export default Map;
