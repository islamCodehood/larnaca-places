import React, { Component } from "react";
import "./App.css";
import Burger from "./Burger";
import Places from "./Places";
import Map from "./Map";
import escapeRegExp from "escape-string-regexp";
import sortBy from "sort-by";
import ReactDOM from "react-dom";
import InfoWindow from "./InfoWindow";

class App extends Component {
  state = {
    markers: [],
    placesLocations: [
      {
        title: "Amorgos Boutique Hotel",
        position: { lat: 34.913244, lng: 33.636832 }
      },
      {
        title: "Aldente Cucina Italiana",
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
        title: "Dionyssos Restaurant",
        position: { lat: 34.910903, lng: 33.63767 }
      },
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
        title: "To Kafe Tis Chrysanthi's",
        position: { lat: 34.912564, lng: 33.635739 }
      }
    ],
    listedPlaces: [],
    map: null,
    query: "",
    selectedPlace: "",
    infoWindows: [],
    placeId: [],
    clientId: "ZBPGPJ4YEZFLSXOFYWBMIWDYVA3I211NBJXN1T5ZCV3PEI0C",
    clientSecret: "5GWJZPVSPM5XYL1CMQQK1J1YW2QQGQKADZ5VTYQISTWYC4TX"
  };
  componentDidMount() {
    //citation: http://cuneyt.aliustaoglu.biz/en/using-google-maps-in-react-without-custom-libraries/
    //check if the script has not been looded yet(google is undefined)
    if (!window.google) {
      var scriptElement = document.createElement("script");
      scriptElement.type = "text/javascript";
      scriptElement.src = `https://maps.google.com/maps/api/js?libraries=places&key=AIzaSyCFLgAmdZmi8GXGUAasIOWJ-cbYhuoXkyE`;
      //x is the first script element in the file
      var x = document.getElementsByTagName("script")[0];
      //insert map script before it
      x.parentNode.insertBefore(scriptElement, x);
      scriptElement.addEventListener("load", e => {
        //initiate the map then
        this.onScriptLoad();
      });
    } else {
      //if the script has been looded, then initiate the map
      this.onScriptLoad();
    }
    
    //get places' ids
    /*     this.state.placesLocations.forEach(place => {
      fetch(`https://api.foursquare.com/v2/venues/search?name=${(place.title).replace(/ /g, '+')}&city=larnaca&ll=${place.position.lat},${place.position.lng}&intent=match&client_id=${this.state.clientId}&client_secret=${this.state.clientSecret}&v=20180729`)
      .then(data => data.json()).then(data => place.id = data.response.venues[0].id)
    }) */
  }
  componentDidUpdate() {
    //console.log(this.state.placeId)
    //console.log(this.state.listedPlaces)
    //console.log(this.state.query)
    if (this.state.query) {
      this.state.markers.forEach(marker => {
        marker.setMap(null);
      });
      this.state.listedPlaces.forEach(marker => {
        marker.setMap(this.state.map);
      });
    } else {
      this.state.markers.forEach(marker => {
        marker.setMap(this.state.map);
      });
    }
    ///////////////////////////////////////////////////////////////
    if (this.state.selectedPlace) {
      this.state.listedPlaces.forEach(place => {
        if (place.title === this.state.selectedPlace) {
          //////Animation part
          place.setAnimation(window.google.maps.Animation.BOUNCE);
          setTimeout(() => {
            place.setAnimation(null);
          }, 400);
          ///////InfoWindow part
          var map = this.state.map;
          this.showSelectedInfoWindow(place, map);
          //selectedInfoWindow.setContent(place.title + '<br>location:'+ place.position + '<br><button id="infoWindowButton">know more</button>')
        }
      });
      this.setState({
        selectedPlace: ""
      });
    }
    //////////////////////////////////////////////////////////////////////////
  }
  onScriptLoad = () => {
    var map = new window.google.maps.Map(
      document.getElementById("map"),
      this.parameters
    );
    this.setState({
      map
    });
    this.makeMarkers(map);
  };

  makeMarkers = map => {
    var bounds = new window.google.maps.LatLngBounds();
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
      marker.addListener("click", function() {
        showInfoWindow(this, map);
      });
      this.setState(state => ({
        listedPlaces: state.listedPlaces.concat(marker)
      }));
      this.state.listedPlaces.sort(sortBy("title"));
      this.setState(state => ({
        markers: state.markers.concat(marker)
      }));
      this.state.markers.sort(sortBy("title"));
      bounds.extend(marker.position);
    });
    map.fitBounds(bounds);

    /*declare the infoWindow out of the array looping (One infoWindow for all)
         *with a content set when it is open. This to avoid having multiple 
         *infoWindows at the same time.*/
    var infoWindow = new window.google.maps.InfoWindow({
      content: '<div id="infoWindow">'
    });
    //create a state of infoWindow to be able to use it outside of  makeMarker function.
    this.setState(state => ({
      infoWindows: state.infoWindows.concat(infoWindow)
    }));
    var showInfoWindow = (marker, map) => {
      infoWindow.addListener("closeclick", function() {
        infoWindow.marker = null;
      });
      console.log(marker.position.lat())
      //citation: http://cuneyt.aliustaoglu.biz/en/using-google-maps-in-react-without-custom-libraries/
      infoWindow.addListener("domready", () => {
        ReactDOM.render(<InfoWindow 
                          title={marker.title} 
                          lat={marker.position.lat()} 
                          lng={marker.position.lng()}
                          getId={this.getId}
                        />, 
          document.getElementById("infoWindow"));
      });
      infoWindow.open(map, marker);
    };
  };

  /* showInfoWindow = (marker, map) => {
    infoWindow.addListener('closeclick', function() {
      infoWindow.marker = null;
    });
    infoWindow.setContent(marker.title + '<br>location:'+ marker.position + `<br><button id="infoWindowButton" type="button" title=${marker.title} onClick=${() => this.handleClick}>know more</button>`)
    infoWindow.open(map, marker);
  } */

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
      });
    } else {
      this.setState(state => ({
        listedPlaces: state.markers
      }));
      this.state.listedPlaces.sort(sortBy("title"));
      this.setState({
        query: query
      });
    }
  };

  selectPlace = selectedPlace => {
    this.setState({
      selectedPlace
    });
  };

  showSelectedInfoWindow = (place, map) => {
    const selectedInfoWindow = this.state.infoWindows[0];
    selectedInfoWindow.addListener("closeclick", function() {
      selectedInfoWindow.place = null;
    });
    selectedInfoWindow.addListener("domready", () => {
      ReactDOM.render(<InfoWindow 
                        title={place.title} 
                        lat={place.position.lat()} 
                        lng={place.position.lng()}
                        getId={this.getId}
                      />, 
        document.getElementById("infoWindow"));
    });
    selectedInfoWindow.open(map, place);
  };

  getId = (title, lat, lng) => {
    fetch(`https://api.foursquare.com/v2/venues/search?name=${(title).replace(/ /g, '+')}&city=larnaca&ll=${lat},${lng}&intent=match&client_id=${this.state.clientId}&client_secret=${this.state.clientSecret}&v=20180730`)
    .then(data => data.json())
    .then(data => {
       this.setState({
        placeId: data.response.venues[0].id
      })
    }).catch(error => {console.log(error)})
  }

  render() {
    return (
      <div className="App">
        <Burger />
        <Places
          listedPlaces={this.state.listedPlaces}
          testMe={this.testMe}
          selectPlace={this.selectPlace}
          filterPlace={this.filterPlace}
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
