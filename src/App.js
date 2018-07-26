import React, { Component } from "react";
import "./App.css";
import Burger from "./Burger";
import Places from "./Places";
import Map from "./Map";

class App extends Component {
  state = {
    markers: [],
    placesLocations : [
      { title: "Salt Lake", position: { lat: 34.885737, lng: 33.614779 } },
      {
        title: "Amorgos Boutique Hotel",
        position: { lat: 34.913244, lng: 33.636832 }
      },
      {
        title: "Flamingo Beach Hotel",
        position: { lat: 34.893684, lng: 33.6383 }
      },
      {
        title: "Aldente Cucina Italiana Restaurant",
        position: { lat: 34.913387, lng: 33.637663 }
      },
      {
        title: "Maqam Al-Sultan Restaurant",
        position: { lat: 34.910983, lng: 33.637658 }
      },
      {
        title: "Hobos Steak House",
        position: { lat: 34.914777, lng: 33.637663 }
      },
      {
        title: "Les Palmiers Beach Hotel",
        position: { lat: 34.914048, lng: 33.637864 }
      },
      {
        title: "The Medieval Castle of Larnaka",
        position: { lat: 34.910271, lng: 33.637694 }
      },
      { title: "Larnaca Marina", position: { lat: 34.917673, lng: 33.638907 } },
      {
        title: "Dionyssos Restaurant",
        position: { lat: 34.910903, lng: 33.63767 }
      },
      { title: "Flamingo Park", position: { lat: 34.900782, lng: 33.626208 } },
      {
        title: "Pierides Museum",
        position: { lat: 34.916148, lng: 33.636261 }
      },
      {
        title: "Larnaca Municipal Art Gallery",
        position: { lat: 34.916932, lng: 33.63751 }
      },
      {
        title: "Larnaka Municipal Market",
        position: { lat: 34.912448, lng: 33.635955 }
      },
      {
        title: "METRO Supermarket Larnaca",
        position: { lat: 34.921297, lng: 33.624647 }
      },
      {
        title: "To Kafe Tis Chrysanthi's",
        position: { lat: 34.912564, lng: 33.635739 }
      },
      {
        title: "Larnaca International Airport",
        position: { lat: 34.87234, lng: 33.620352 }
      }
    ]
  }
  onMapLoad = map => {
    var bounds = new window.google.maps.LatLngBounds();
    this.state.placesLocations.forEach((place, index) => {
      var position = place.position;
      var title = place.title;
      var marker = new window.google.maps.Marker({
        position,
        title,
        map,
        animation: window.google.maps.Animation.DROP,
        id: index
      });
      this.setState(state => ({
        markers: state.markers.concat(marker)
      }))
      bounds.extend(marker.position);
    })
    map.fitBounds(bounds);
    // console.log(this.state.markers)
  };

  render() {
    return (
      <div className="App">
        <Burger />
        <Places markers={this.state.markers} />
        <Map
          parameters={{
            center: { lat: 34.900253, lng: 33.623172 }
          }}
          onMapLoad={this.onMapLoad}
        />
      </div>
    );
  }
}

export default App;
