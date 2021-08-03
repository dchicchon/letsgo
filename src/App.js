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
const AnyReactComponent = ({ text }) => <div>{text}</div>;

const SimpleMap = ({ handleApiLoaded, coordinates }) => {
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
        defaultZoom={11}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
      >
        {/* <AnyReactComponent lat={59.955} lng={30.33} text={"My Marker"} /> */}
      </GoogleMapReact>
    </div>
  );
};

const App = () => {
  const [location, setLocation] = useState("");
  const [apiReady, setApiReady] = useState(false);
  const [map, setMap] = useState(null);
  const [coordinates, setCoordinates] = useState([59.95, 30.33]);
  const [googleMaps, setGoogleMaps] = useState(null);

  const handleOnPlacesChanged = (places) => {
    console.log("HANDLE ON PLACES CHANGED APP");
    const lat = places[0].geometry.location.lat();
    const lng = places[0].geometry.location.lng();
    console.log(`LAT: ${lat} LNG: ${lng}`);
    setCoordinates([lat, lng]);
  };

  const handleApiLoaded = (map, maps) => {
    if (map && maps) {
      setMap(map);
      setGoogleMaps(maps);
      setApiReady(true);
    }
  };
  return (
    <>
      <Navbar bg="light" expand="lg" style={{ borderBottom: "1px solid grey" }}>
        <Navbar.Brand href="#" className="mx-5">
          Let's Go
        </Navbar.Brand>
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="mr-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          ></Nav>
          {apiReady && (
            <SearchBox
              placeholder={""}
              onPlacesChanged={handleOnPlacesChanged}
              maps={googleMaps}
            />
          )}
        </Navbar.Collapse>
      </Navbar>
      <Container className="m-0">
        <Row>
          <Col md="10">
            <SimpleMap
              coordinates={coordinates}
              handleApiLoaded={handleApiLoaded}
            />
          </Col>
          <Col>
            <h4>Itinerary</h4>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default App;
