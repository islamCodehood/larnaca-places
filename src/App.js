import React, { Component } from "react";
import "./App.css";
import Burger from "./Burger";
import Places from "./Places";
import Map from "./Map";
import Modal from "./Modal"
import escapeRegExp from "escape-string-regexp";
import sortBy from "sort-by";
import ReactDOM from "react-dom";
import InfoWindow from "./InfoWindow";

class App extends Component {
  state = {
    //places searched dynamically using foursquare api from function getPlaces()
    places: [],
    //markers to be as a source for markers for listedPlaces
    markers: [],
    //markers to do work on them
    listedPlaces: [],
    //map value to be used outside the map onScriptLoad function
    map: null,
    //to check if there is any text in search form box to filter places
    query: "",
    //place selected when clicking a place in list tocompare its title with listedPlaces title
    selectedPlace: "",
    //to store the currently used infoWindo
    infoWindows: [],
    //client id and client secret to be used in fetching api from foursquare api (unchanged)
    clientId: "0FSPUJ55OAZ2XIZDWO54KRR5P4KYOGNW2MC21JPHGIQIJ0LG",
    clientSecret: "2GY12T2KTPRUUPYZYTEJATVFOU00T1D1PYDCMSJ22K5AONRQ",
    //to store the current marker (place) formattedAddress tom be used
    address: "",
    placeId: "",
    //from function getPlaces(). It contains the detailed info about places that are in places state
    venues: [],
    bestPhoto: "",
    category: [],
    title: "",
    likes: '',
    hours: '',
    rating: '',
    ratingColor: ''
  };

  componentDidMount() {
    //get places dynamically from foursquare api
    this.getPlaces();
    
    /*setting time out to wait for the getPlaces to return a value and update places
    * state before loading map and markers*/
    setTimeout(() => {
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
    }, 3000);
  }
  
  componentDidUpdate() {
    ////Check if the query contains any text to search for places
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
      console.log(this.state.selectedPlace)
      this.state.listedPlaces.forEach(listedPlace => {
        if (listedPlace.title === this.state.selectedPlace) {
          var map = this.state.map;
          const place = this.state.places.find(
            place => place.name === this.state.selectedPlace
          );
          this.showSelectedInfoWindow(listedPlace, map, place)
          //////Animation part
          listedPlace.setAnimation(window.google.maps.Animation.BOUNCE);
          setTimeout(() => {
            listedPlace.setAnimation(null);
          }, 400);
          
        }
      });
      this.setState({
        selectedPlace: ""
      });
    }
    //////////////////////////////////////////////////////////////////////////
  
  }
  selectPlace = selectedPlace => {
    this.setState({
      selectedPlace
    });
  };
//initiate map and call makeMarkers()
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
    this.state.places.forEach((place, index) => {
      var position = { lat: place.location.lat, lng: place.location.lng };
      var title = place.name;
      var id = index;
      var marker = new window.google.maps.Marker({
        position,
        title,
        map,
        id,
        animation: window.google.maps.Animation.DROP
      });
      marker.addListener("click", function() {
        
        showInfoWindow(this, map, place);
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
    var showInfoWindow = (marker, map, place) => {
      var address = place.location.formattedAddress.join(", ");
      this.setState({
        placeId: place.id
      });
      infoWindow.addListener("closeclick", function() {
        infoWindow.marker = null;
      });
      //citation: http://cuneyt.aliustaoglu.biz/en/using-google-maps-in-react-without-custom-libraries/
      infoWindow.addListener("domready", () => {
        ReactDOM.render(
          <InfoWindow
            title={marker.title}
            lat={marker.position.lat()}
            lng={marker.position.lng()}
            address={address}
            bestPhoto={this.state.bestPhoto}
            id={place.id}
            category={this.state.category.join(',')}
            showMore={this.showMore}
          />,
          document.getElementById("infoWindow")
        );
      });
      infoWindow.open(map, marker);
      this.getBestPhotoAndCategory();
    };
  };

  showSelectedInfoWindow = (listedPlace, map, place) => {
    const selectedInfoWindow = this.state.infoWindows[0];
    var address = place.location.formattedAddress.join(", ");
    this.setState({
      placeId: place.id
    });
    selectedInfoWindow.addListener("closeclick", function() {
      selectedInfoWindow.listedPlace = null;
    });
    selectedInfoWindow.addListener("domready", () => {
      ReactDOM.render(
        <InfoWindow
          title={listedPlace.title}
          lat={listedPlace.position.lat()}
          lng={listedPlace.position.lng()}
          //getId={this.getId}
          getDetails={() => this.getDetails}
          //getAddress={this.getAddress}
          address={address}
          bestPhoto={this.state.bestPhoto}
          category={this.state.category.join(',')}
          showMore={this.showMore}
        />,
        document.getElementById("infoWindow")
      );
    });
    selectedInfoWindow.open(map, listedPlace);
    this.getBestPhotoAndCategory();
  };

  testMe = query => {
    console.log(query);
    if (query) {
      //to test the query text (and ignore caps) against matching places names(marker title)
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

  getPlaces = () => {
    //fetch places from foursquare api using search venue then store them in places state
    fetch(
      `https://api.foursquare.com/v2/venues/search?ll=34.900253,33.623172&radius=10000&intent=browse&limit=3&client_id=${
        this.state.clientId
      }&client_secret=${this.state.clientSecret}&v=20180730`
    )
      .then(data => data.json())
      .then(data => data.response.venues)
      .then(venues =>
        venues.forEach(place => {
          console.log(place);
          this.setState(state => ({
            places: state.places.concat(place)
          }));
          //then fetch each place details using the place id and store these details in a venues state
          fetch(
            `https://api.foursquare.com/v2/venues/${place.id}?client_id=${
              this.state.clientId
            }&client_secret=${this.state.clientSecret}&v=20180730`
          )
            .then(data => data.json())
            .then(data => {
              console.log(data);
              this.setState(state => ({
                venues: state.venues.concat(data.response.venue)
              }));
            }).catch(error => console.log)
        })
      ).catch(error => console.log(error))
  };
  
 

  getBestPhotoAndCategory = () => {
    this.setState({
      bestPhoto: ''
    });
    this.setState({
      category: []
    });
    this.state.venues
      .filter(venue => venue.id === this.state.placeId)
      .forEach(venue => {
        if (venue.bestPhoto) {
          this.setState({
            bestPhoto: venue.bestPhoto.prefix + "300x200" + venue.bestPhoto.suffix
          });
        } else {
          this.setState({
            bestPhoto: ''
          });
        }
        if(venue.categories) {
          this.setState({
            category : venue.categories.map(category => category.name)
          });
        } else {
          this.setState({
            category : ['No Data Available']
          });
        }
      });

  };

  showMore = (title) => {
    this.setState({
      title,
    })
    this.state.venues
      .filter(venue => venue.id === this.state.placeId)
      .forEach(venue => {
        this.setState({
          likes: venue.likes.summary
        })
        this.setState({
          rating: venue.rating
        })
         this.setState({
          ratingColor: venue.ratingColor
        }) 
      })
    
  }

  openCloseDrawer = () => {
    const drawer = document.getElementById("places-section");
    const rightSection = document.getElementById("right-section");
    const searchArea = document.getElementById("search-area");
    const header = document.getElementById("header");
    const burgerHeader = document.getElementById("burger-header")
    if (drawer.clientWidth > 0) {
      drawer.style.width = 0;
      rightSection.style.width = "100%";
      searchArea.style.visibility = "hidden";
      header.style.visibility = "hidden";
      searchArea.style.transitionProperty = "visibility";
      header.style.transitionProperty = "visibility";
      searchArea.style.transitionDuration = "0.2s";
      header.style.transitionDuration = "0.2s";
      searchArea.style.transitionDelay = "0s";
      header.style.transitionDelay = "0s";
      burgerHeader.style.transitionProperty ="visibility"
      burgerHeader.style.transitionDuration = "1s"
      burgerHeader.style.visibility = "visible"
    } else {
      drawer.style.width = "25%";
      rightSection.style.width = "75%";
      searchArea.style.visibility = "visible";
      header.style.visibility = "visible";
      searchArea.style.transitionProperty = "visibility";
      header.style.transitionProperty = "visibility";
      searchArea.style.transitionDuration = "0.8s";
      header.style.transitionDuration = "0.8s";
      searchArea.style.transitionDelay = "0.7s";
      header.style.transitionDelay = "0.7s";
      burgerHeader.style.transitionProperty ="visibility"
      burgerHeader.style.transitionDuration = "0.7s"
      burgerHeader.style.visibility = "hidden"
    }
  };

  render() {
    return (
      <div className="App" id="app">
        <Places
          listedPlaces={this.state.listedPlaces}
          testMe={this.testMe}
          selectPlace={this.selectPlace}
        />
        <div id="right-section">
          <Burger handleClick={this.openCloseDrawer} />
          <Map
            parameters={{
              center: { lat: 34.900253, lng: 33.623172 },
              zoom: 13
            }}
          />
          <Modal 
            title={this.state.title}
            address={this.state.address}
            likes={this.state.likes}
            hours={this.state.hours}
            rating={this.state.rating}
          />
        </div>
      </div>
    );
  }
}

export default App;
