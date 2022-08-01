/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// @ts-nocheck TODO remove when fixed

// This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

navigator.geolocation.getCurrentPosition(initAutocomplete);
navigator.geolocations;
function initAutocomplete(position) {
  const x = position.coords.latitude;
  const y = position.coords.longitude;
  const map = new google.maps.Map(
    document.getElementById('map') as HTMLElement,
    {
      center: { lat: x, lng: y },
      zoom: 17,
      mapTypeId: 'roadmap',
    }
  );
  const mark = new google.maps.Marker({
    position: { lat: x, lng: y },
    map,
  });

  // Create the search box and link it to the UI element.
  const input = document.getElementById('pac-input') as HTMLInputElement;
  // input.focus();
  const searchBox = new google.maps.places.SearchBox(input);

  map.controls.push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', () => {
    searchBox.setBounds(map.getBounds() as google.maps.LatLngBounds);
  });

  let markers: google.maps.Marker[] = [];

  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', () => {
    const places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach((marker) => {
      marker.setMap(null);
    });
    markers = [];
   // console.log(places);

    // For each place, get the icon, name and location.
    const bounds = new google.maps.LatLngBounds();

    places.forEach((place) => {
      if (!place.geometry || !place.geometry.location) {
        console.log('Returned place contains no geometry');
        return;
      }
      const icon = {
        url: place.icon as string,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25),
      };
     const add = place.formatted_address.split(',');

      console.log(place.formatted_address);
      // Create a marker for each place.
      markers.push(
        new google.maps.Marker({
          map,
          icon,
          title: place.name,
          position: place.geometry.location,
          
        })
      );
      markers.forEach((marker) => {
        marker.addListener('click', (mapsMouseEvent: any) => {
          document.getElementById('map').style.display = 'none';
          document.getElementById('pac-input').style.display = 'none';
          document.getElementById('page2').style.display = 'block';
          document.getElementById('nom').innerHTML = marker.getTitle();
        if (marker.getPosition()==place.geometry.location){
          document.getElementById('address').innerHTML=place.formatted_address;
          document.getElementById('cp').innerHTML = place.rating;
        }
        
        });
      });

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
}

declare global {
  interface Window {
    initAutocomplete: () => void;
  }
}

window.initAutocomplete = initAutocomplete;
export {};