import React, { useState } from "react";
import Map from "./Components/Map";
import SearchBox from "./Components/SearchBox";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";

import "bootstrap/dist/css/bootstrap.min.css";

// https://stackoverflow.com/questions/61139662/how-to-implement-google-maps-search-box-in-a-react-application

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
  const [toggles, setToggles] = useState([]);

  const handleOnPlacesChanged = (places) => {
    console.log("Handle On places changed app");
    console.log(places);
    if (!places) {
      console.log("Places does not exist");
      try {
        console.log("places");
        console.log(places);
      } catch {
        console.error("Did not get places!");
      }
      return;
    }
    if (
      places[0].types.includes("locality") ||
      places[0].types.includes("political")
    ) {
      const lat = places[0].geometry.location.lat();
      const lng = places[0].geometry.location.lng();
      const newZoom = 12;
      setLocation({
        coords: [lat, lng],
        zoom: newZoom,
      });
    }
    // Multiple locations
    else if (places.length > 1) {
      const newZoom = 12;

      // Get the average for all of the places and set the correct lat and lng
      let sumLat = 0;
      let sumLng = 0;

      for (let i = 0; i < places.length; i++) {
        sumLat += places[i].geometry.location.lat();
        sumLng += places[i].geometry.location.lng();
      }

      const avgLat = sumLat / places.length;
      const avgLng = sumLng / places.length;
      setLocationList(places);
      setLocation({
        coords: [avgLat, avgLng],
        zoom: newZoom,
      });
    }
    // Single Location
    else if (places.length === 1) {
      const lat = places[0].geometry.location.lat();
      const lng = places[0].geometry.location.lng();
      let newZoom;
      newZoom = 15;
      setLocationList(places);
      setLocation({
        coords: [lat, lng],
        zoom: newZoom,
      });
    } else {
      console.log("Something Went Wrong!");
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
  const deleteDestination = (name) => {
    setDestinationList(destinationList.filter((item) => item.name !== name));
  };

  // We have our destination list. If an item is clicked, then we will change it to a destination marker
  return (
    <>
      <Container>
        <Row>
          <Col md="10" className="p-0">
            <Map
              coordinates={location["coords"]}
              handleApiLoaded={handleApiLoaded}
              zoom={location["zoom"]}
              locations={locationList}
              setLocationList={setLocationList}
              setDestinationList={setDestinationList}
              destinations={destinationList}
              toggles={toggles}
              googleMaps={apiReady.ready ? apiReady.googleMaps : null}
              map={apiReady.ready ? apiReady.map : null}
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
                    maps={apiReady.googleMaps}
                    map={apiReady.map}
                  />
                )}
              </Col>
              <Col>
                <CheckBoxGroup setToggles={setToggles} />
              </Col>
            </Row>
            <Row>
              <Col>
                {/* This should select a starting point */}
                <h6>Destinations</h6>
                <ListGroup>
                  {destinationList.map((destination, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col>
                          <h6>{destination.name}</h6>
                        </Col>
                        <Col>
                          <Button
                            onClick={() => deleteDestination(destination.name)}
                          >
                            X
                          </Button>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
};

const CheckBoxGroup = ({ setToggles }) => {
  const [value, setValue] = useState([]);

  const radios = [
    { name: "tourist_attraction", name_simple: "Tourist Attraction" },
    { name: "restaurant", name_simple: "Food" },
    { name: "points_of_interest", name_simple: "POI" },
  ];

  const handleChange = (val) => {
    // Check if val is empty or not
    if (val.length !== 0) {
      console.log("New Toggles!");
      console.log(val);
      // Set toggles needs to be a list of items
      let cleanArray = radios.filter((item, index) => val.includes(index));
      let toggleArray = cleanArray.map((item) => item.name);
      setToggles(toggleArray);
    } else {
      console.log("Reset Toggles");
      setToggles([]);
    }
    setValue(val);
    // if (value.length !== 0) {
    // setToggles(radios[value[0]].name);
    // }
  };

  return (
    <ToggleButtonGroup
      className="mb-2"
      type="checkbox"
      value={value}
      onChange={handleChange}
    >
      {radios.map((radio, index) => (
        <ToggleButton
          key={index}
          id={`tbg-btn-${index}`}
          value={index}
          variant={
            value.includes(index) ? "outline-primary" : "outline-secondary"
          }
        >
          {radio.name_simple}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default App;
