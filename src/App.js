import React, { useState, useRef, useCallback, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
// import "./App.css";
// GOOGLE MAPS
// https://www.npmjs.com/package/google-map-react
import GoogleMapReact from "google-map-react";

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";

// https://stackoverflow.com/questions/61139662/how-to-implement-google-maps-search-box-in-a-react-application
const SearchBox = ({ maps, onPlacesChanged, placeholder }) => {
  const input = useRef(null);
  const searchBox = useRef(null);

  const handleOnPlacesChanged = useCallback(() => {
    console.log("HANDLE ON PLACES CHANGED CALLBACK");

    if (onPlacesChanged) {
      onPlacesChanged(searchBox.current.getPlaces());
    }
  }, [onPlacesChanged, searchBox]);

  useEffect(() => {
    if (!searchBox.current && maps) {
      searchBox.current = new maps.places.SearchBox(input.current);
      searchBox.current.addListener("places_changed", handleOnPlacesChanged);
    }

    return () => {
      if (maps) {
        searchBox.current = null;
        maps.event.clearInstanceListeners(searchBox);
      }
    };
  }, [maps, handleOnPlacesChanged]);

  return <input ref={input} placeholder={placeholder} type="text" />;
};
const Marker = ({ text }) => {
  return <div>{text}</div>;
};

const SimpleMap = ({ handleApiLoaded, coordinates, zoom, locations }) => {
  useEffect(() => {
    console.log("RENDER MAP");
    console.log("COORDS");
    console.log(coordinates);
  }, [coordinates]);
  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{
          key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
          libraries: "places",
        }}
        center={{ lat: coordinates[0], lng: coordinates[1] }}
        zoom={zoom}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
      >
        {locations.map((location, index) => (
          <Marker
            key={index}
            lat={location.geometry.location.lat()}
            lng={location.geometry.location.lng() }
            text={"My Marker"}
          />
        ))}
      </GoogleMapReact>
    </div>
  );
};

const App = () => {
  const [apiReady, setApiReady] = useState({
    map: null,
    ready: false,
    googleMaps: null,
  });
  const [location, setLocation] = useState({
    coords: [40.7127753, -74.0059728],
    zoom: 12,
  });
  const [locationList, setLocationList] = useState([]);
  const [destinationList, setDestinationList] = useState([]);

  const handleOnPlacesChanged = (places) => {
    console.log("HANDLE ON PLACES CHANGED APP");

    if (places) {
      const lat = places[0].geometry.location.lat();
      const lng = places[0].geometry.location.lng();
      console.log(`LAT: ${lat} LNG: ${lng}`);
      console.log(places);
      let newZoom;
      if (
        places[0].types.includes("locality") ||
        places[0].types.includes("political")
      ) {
        console.log("This is a city");
        console.log(places[0].types);
        newZoom = 12;
        setLocation({
          coords: [lat, lng],
          zoom: newZoom,
        });
      }
      // Multiple locations
      else if (places.length > 1) {
        setLocationList(places);
        setLocation((prevState) => ({
          ...prevState,
          zoom: newZoom,
        }));
      }
      // Single Location
      else {
        console.log("This is not a city");
        console.log(places[0].types);
        newZoom = 15;
        setLocationList(places);
        setLocation({
          coords: [lat, lng],
          zoom: newZoom,
        });
      }
    }
  };

  const handleApiLoaded = (map, maps) => {
    if (map && maps) {
      setApiReady({
        map: map,
        ready: true,
        googleMaps: maps,
      });
    }
  };
  return (
    <>
      <Container className="m-0">
        <Row>
          <Col md="10" className="p-0">
            <SimpleMap
              coordinates={location["coords"]}
              handleApiLoaded={handleApiLoaded}
              zoom={location["zoom"]}
              locations={locationList}
            />
          </Col>
          <Col md="2" style={{ borderLeft: "1px solid black" }}>
            <Row>
              <Col>
                <h5 className="mt-2">Itinerary</h5>
                {apiReady && (
                  <SearchBox
                    placeholder="Search"
                    onPlacesChanged={handleOnPlacesChanged}
                    maps={apiReady["googleMaps"]}
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col>
                {/* This should select a starting point */}
                <h6>Starting Point</h6>
                <ul>
                  {destinationList.map((destination) => (
                    <li>{destination}</li>
                  ))}
                </ul>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default App;
