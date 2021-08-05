import React, { useRef, useCallback, useEffect } from "react";

// https://developers.google.com/maps/documentation/javascript/examples/places-searchbox#maps_places_searchbox-javascript
const SearchBox = ({ map, maps, onPlacesChanged, placeholder }) => {
    const input = useRef(null);
    const searchBox = useRef(null);

    const handleOnPlacesChanged = () => {
        console.log("HANDLE ON PLACES CHANGED CALLBACK");
        const places = searchBox.current.getPlaces();
        if (!places) {
            return
        }
        // Make sure to bias the searchBox to the maps current bounds
        // searchBox.current.setBounds(maps.getBounds);

        onPlacesChanged(searchBox.current.getPlaces());
    };

    useEffect(() => {
        if (!searchBox.current && maps) {

            searchBox.current = new maps.places.SearchBox(input.current);
            searchBox.current.addListener("places_changed", handleOnPlacesChanged);
            map.addListener('bounds_changed', () => {
                searchBox.current.setBounds(map.getBounds())
            })
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

export default SearchBox;