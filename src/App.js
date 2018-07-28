import React, { Component } from "react";
import "./App.css";
import Burger from "./Burger";
import Places from "./Places";
import Map from "./Map";
import escapeRegExp from "escape-string-regexp";
import sortBy from "sort-by";

class App extends Component {
  state = {
    markers: [],
    placesLocations: [
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
    ],
    listedPlaces: [],
    map: null,
    query: '',
    selectedPlace: '',
    infoWindows: []
  };
  componentDidMount() {
    //check if the script has not been looded yet(google is undefined)
    if (!window.google) {
        var scriptElement = document.createElement('script');
        scriptElement.type = 'text/javascript';
        scriptElement.src = `https://maps.google.com/maps/api/js?key=AIzaSyCFLgAmdZmi8GXGUAasIOWJ-cbYhuoXkyE`;
        //x is the first script element in the file
        var x = document.getElementsByTagName('script')[0];
        //insert map script before it
        x.parentNode.insertBefore(scriptElement, x);
        scriptElement.addEventListener('load', e => {
          //initiate the map then
          this.onScriptLoad()
        })
    } else {
        //if the script has been looded, then initiate the map
        this.onScriptLoad()
      }
}
componentDidUpdate() {

  //console.log(this.state.listedPlaces)
  //console.log(this.state.query)

  if (this.state.query) {
    this.state.markers.forEach(marker => {
      marker.setMap(null)
    })
    this.state.listedPlaces.forEach(marker => {
      marker.setMap(this.state.map)
    })
  } else {
    this.state.markers.forEach(marker => {
      marker.setMap(this.state.map)
    })
  }
   if (this.state.selectedPlace) {
    this.state.listedPlaces.forEach(place => {
      if (place.title === this.state.selectedPlace) {
        place.setAnimation(window.google.maps.Animation.BOUNCE)
        setTimeout( () => {
          place.setAnimation(null);
      }, 400)
      var selectedInfoWindow = this.state.infoWindows[0]
      selectedInfoWindow.setContent(place.title)
      selectedInfoWindow.addListener('closeclick', function() {
        selectedInfoWindow.place = null;
      });
      selectedInfoWindow.open(this.state.map, place);
      }
      
    })
    this.setState({
      selectedPlace: ''
    })
  }
}
  onScriptLoad = () => {
    var map = new window.google.maps.Map(
        document.getElementById("map"),
        this.parameters);
        this.setState({
          map,
        })
        this.makeMarkers(map)
      }

  makeMarkers = (map) => {
    var bounds = new window.google.maps.LatLngBounds();
        console.log('hi')
        this.state.placesLocations.forEach((place, index) => {
          var position = place.position;
          var title = place.title;
          var id = index;
          var marker = new window.google.maps.Marker({
            position,
            title,
            map,
            id,
            animation: window.google.maps.Animation.DROP
          });
          marker.addListener('click', function() {
            showInfoWindow(this, infoWindow);
          });
          this.setState(state => ({
            listedPlaces: state.listedPlaces.concat(marker)
          }));
          this.state.listedPlaces.sort(sortBy('title'))
          this.setState(state => ({
            markers: state.markers.concat(marker)
          }));
          this.state.markers.sort(sortBy('title'))
          bounds.extend(marker.position);
        });
        map.fitBounds(bounds);
        var showInfoWindow = (marker, infoWindow) => {
          infoWindow.addListener('closeclick', function() {
            infoWindow.marker = null;
          });
          infoWindow.setContent(marker.title)
          infoWindow.open(map, marker);
        }
        /*declare the infoWindow out of the array looping (One infoWindow for all)
         *with a content set when it is open. This to avoid having multiple 
         *infoWindows at the same time.*/
        var infoWindow = new window.google.maps.InfoWindow({
          content: ''
        });
        //create a state of infoWindow to be able to use it outside of  makeMarker function.
        this.setState(state => ({
          infoWindows: state.infoWindows.concat(infoWindow)
        }))
  }
        
  testMe = query => {
    console.log(query);
    if (query) {
      const searchText = new RegExp(escapeRegExp(query), "i");
      
      this.setState(state => ({
        listedPlaces: state.markers.filter(marker =>
          searchText.test(marker.title)
        )
      }));
      this.setState({
        query: query
      })
    } else {
      this.setState(state => ({
        listedPlaces: state.markers
      }));
      this.state.listedPlaces.sort(sortBy('title'))
      this.setState({
        query: query
      })
    }
  };

  selectPlace = (selectedPlace) => {

    this.setState({
      selectedPlace
    })
    
  } 


  render() {

    return (
      
      <div className="App">
        <Burger />
        <Places 
          listedPlaces={this.state.listedPlaces} 
          testMe={this.testMe}
          selectPlace={this.selectPlace}
        />
        <Map
          parameters={{
            center: { lat: 34.900253, lng: 33.623172 },
            zoom: 13
          }}
        />
      </div>
    );
  }
}

export default App;
