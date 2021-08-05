import React, { useState, useRef, useCallback, useEffect } from "react";
import GoogleMapReact from "google-map-react";
import './index.css'
// GOOGLE MAPS
// https://www.npmjs.com/package/google-map-react
const Map = ({ handleApiLoaded, coordinates, zoom, locations, setDestinationList, destinations }) => {
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
                    <Location
                        key={index}
                        location={location}
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

            </GoogleMapReact>
        </div>
    );
};

const Location = ({ location, setDestinationList }) => {
    const [display, setDisplay] = useState(false);

    const addToDestinations = () => {
        // console.log(location);
        setDestinationList(oldList => [...oldList, location])
    }


    return (
        <div>
            <div title={location.name} className='pin bounce' onClick={addToDestinations} style={{ backgroundColor: 'blue', cursor: 'pointer' }} />
            <div className="pulse" />
        </div>);
};

const Destination = ({ destination }) => {

    const showBox = () => {
        console.log("Show box!")
    }
    return (
        <div>
            <div title={destination.name} className='pin bounce' onClick={showBox} style={{ backgroundColor: 'red', cursor: 'pointer' }} />
        </div>);

}


export default Map