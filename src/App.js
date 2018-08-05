import React, { Component } from "react";
import "./App.css";
import Burger from "./Burger";
import Places from "./Places";
import Map from "./Map";
import escapeRegExp from "escape-string-regexp";
import sortBy from "sort-by";
import ReactDOM from "react-dom";
import InfoWindow from "./InfoWindow";
import cyprusflag from './cyprusflag.png'

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
    placeId: "",
    //from function getPlaces(). It contains the detailed info about places that are in places state
    venues: []
  };

  componentDidMount() {
    //get places dynamically from foursquare api
    this.getPlaces();
    /*setting time out to wait for the getPlaces to return a value and update places
    * state before loading map and markers*/
    setTimeout(() => {
      
      this.checkScriptLoad()
    }, 3000);
    //decide which layout to start with depending om viewport width
    this.layoutOnLoad()
    
    
  }

  componentDidUpdate() {
    this.removeFromTabOrder()
    this.checkTextBox()
    this.checkSelectedPlace()
    this.layoutOnResize()
    
  }

  checkScriptLoad = () => {
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
  }

  checkTextBox = () => {
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
  }

  selectPlace = selectedPlace => {
    this.setState({
      selectedPlace
    });
  };

  checkSelectedPlace = () => {
    if (this.state.selectedPlace) {
      console.log(this.state.selectedPlace);
      this.state.listedPlaces.forEach(listedPlace => {
        if (listedPlace.title === this.state.selectedPlace) {
          var map = this.state.map;
          const place = this.state.places.find(
            place => place.name === this.state.selectedPlace
          );
          this.showSelectedInfoWindow(listedPlace, map, place);
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
  }
  //initiate map and call makeMarkers()
  onScriptLoad = () => {
    
    //Styles from https://snazzymaps.com/style/18/retro
    var styles = [
      {
        featureType: "administrative",
        stylers: [
          {
            visibility: "off"
          }
        ]
      },
      {
        featureType: "poi",
        stylers: [
          {
            visibility: "simplified"
          }
        ]
      },
      {
        featureType: "road",
        elementType: "labels",
        stylers: [
          {
            visibility: "simplified"
          }
        ]
      },
      {
        featureType: "water",
        stylers: [
          {
            visibility: "simplified"
          }
        ]
      },
      {
        featureType: "transit",
        stylers: [
          {
            visibility: "simplified"
          }
        ]
      },
      {
        featureType: "landscape",
        stylers: [
          {
            visibility: "simplified"
          }
        ]
      },
      {
        featureType: "road.highway",
        stylers: [
          {
            visibility: "off"
          }
        ]
      },
      {
        featureType: "road.local",
        stylers: [
          {
            visibility: "on"
          }
        ]
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [
          {
            visibility: "on"
          }
        ]
      },
      {
        featureType: "water",
        stylers: [
          {
            color: "#84afa3"
          },
          {
            lightness: 52
          }
        ]
      },
      {
        stylers: [
          {
            saturation: -17
          },
          {
            gamma: 0.36
          }
        ]
      },
      {
        featureType: "transit.line",
        elementType: "geometry",
        stylers: [
          {
            color: "#3f518c"
          }
        ]
      }
    ];
    var map = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat: 34.900253, lng: 33.623172 },
      zoom: 13,
      styles: styles
    });
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
            bestPhoto={this.getBestPhoto()}
            id={place.id}
            category={this.getCategory()}
            likes={this.getLikes()}
            rating={this.getRating()}
            ratingColor={this.getRatingColor()}
          />,
          document.getElementById("infoWindow")
        );
        //Citation for the styling of info window :
        //http://en.marnoto.com/2014/09/5-formas-de-personalizar-infowindow.html
        const iwOuter = document.querySelector(".gm-style-iw");
        const iwBackground = iwOuter.previousSibling;
        if (iwBackground) {
          iwBackground.parentElement.removeChild(iwBackground);
        }
        const iwCloseBtn = iwOuter.nextElementSibling;
        iwCloseBtn.classList.add("iw-close-btn");
      });
      infoWindow.open(map, marker);
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
          getDetails={() => this.getDetails}
          address={address}
          bestPhoto={this.getBestPhoto()}
          category={this.getCategory()}
          likes={this.getLikes()}
          rating={this.getRating()}
          ratingColor={this.getRatingColor()}
        />,
        document.getElementById("infoWindow")
      );
      //Citation for the styling of info window :
      //http://en.marnoto.com/2014/09/5-formas-de-personalizar-infowindow.html
      const iwOuter = document.querySelector(".gm-style-iw");
      const iwBackground = iwOuter.previousSibling;
      if (iwBackground) {
        iwBackground.parentElement.removeChild(iwBackground);
      }
      const iwCloseBtn = iwOuter.nextElementSibling;
      iwCloseBtn.classList.add("iw-close-btn");
    });
    selectedInfoWindow.open(map, listedPlace);
  };

  filterPlaces = query => {
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
    fetch(
      `https://api.foursquare.com/v2/venues/search?ll=34.900253,33.623172&radius=10000&intent=browse&limit=2&client_id=${
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
            })
            .catch(error => console.log);
        })
      )
      .catch(error => console.log(error));
  };

  getBestPhoto = () => {
    const infoWindowWidth = document.getElementById('infoWindow').offsetWidth 
    if (this.state.placeId) {
      const bestPhotoObject = this.state.venues.find(
        venue => venue.id === this.state.placeId
      ).bestPhoto;
      
      
      const bestPhotoSize = (infoWindowWidth-2) + "x180";
      if (bestPhotoObject) {
        return bestPhotoObject.prefix + bestPhotoSize + bestPhotoObject.suffix;
      } else {
        return cyprusflag;
      }
    } else {
      return cyprusflag;
    }
  };

  getCategory = () => {
    if (this.state.placeId) {
      const categoriesArray = this.state.venues.find(
        venue => venue.id === this.state.placeId
      ).categories;
      if (categoriesArray) {
        return categoriesArray.map(category => category.name).join(", ");
      } else {
        return "No data available";
      }
    } else {
      return 'No data available. Please, try again later!'
    }
  };

  getName = () => {
    if (this.state.placeId) {
      const name = this.state.venues.find(
        venue => venue.id === this.state.placeId
      ).name;
      return name;
    } else {
      return 'No data available. Please, try again later!'
    }
  };


  getLikes = () => {
    if (this.state.placeId) {
      const likes = this.state.venues.find(
        venue => venue.id === this.state.placeId
      ).likes.summary;
      if (likes) {
        return likes;
      } else {
        return "No data available.";
      }
    } else {
      return "No data available. Please, try again later!";
    }
  };

  getRating = () => {
    if (this.state.placeId) {
      const venue = this.state.venues.find(
        venue => venue.id === this.state.placeId
      );
      const rating = venue.rating;
      if (rating) {
        return rating;
      } else {
        return "No data available.";
      }
    } else {
      return "No data available. Please, try again later!";
    }
  };

  getRatingColor = () => {
    if (this.state.placeId) {
      const venue = this.state.venues.find(
        venue => venue.id === this.state.placeId
      );
      const ratingColor = venue.ratingColor;
      if (ratingColor) {
        return "#" + ratingColor;
      } else {
        return "";
      }
    }
  };
  closeDrawer = () => {
    const drawer = document.getElementById("places-section");
    const rightSection = document.getElementById("right-section");
    const searchArea = document.getElementById("search-area");
    const header = document.getElementById("header");
    const burgerHeader = document.getElementById("burger-header");
    drawer.classList = ''
    rightSection.classList = ''
    burgerHeader.className = ''
    searchArea.className = ''
    header.className = ''
    drawer.classList.add('places-disappear')
    rightSection.classList.add('right-full-width')
    burgerHeader.classList.add('burger-header-visible')
    searchArea.classList.add('search-area-disappear-transition')
    searchArea.classList.add('search-area-disappear')
    header.classList.add('header-disappear')
    header.classList.add('header-disappear-transition')
  }
  openCloseDrawer = () => {
    const drawer = document.getElementById("places-section");
    const rightSection = document.getElementById("right-section");
    const searchArea = document.getElementById("search-area");
    const header = document.getElementById("header");
    const burgerHeader = document.getElementById("burger-header");
    if ((window.innerWidth > 900) && (drawer.classList.contains('places-section-width'))) {
      drawer.classList = ''
      rightSection.classList = ''
      burgerHeader.className = ''
      searchArea.className = ''
      header.className = ''
      drawer.classList.add('places-disappear')
      rightSection.classList.add('right-full-width')
      burgerHeader.classList.add('burger-header-visible')
      searchArea.classList.add('search-area-disappear-transition')
      searchArea.classList.add('search-area-disappear')
      header.classList.add('header-disappear')
      header.classList.add('header-disappear-transition')
    } else if ((window.innerWidth > 900) && (drawer.classList.contains('places-disappear'))) {
      drawer.classList = ''
      rightSection.classList = ''
      burgerHeader.className = ''
      searchArea.className = ''
      header.className = ''
      drawer.classList.add('places-section-width')
      rightSection.classList.add('right-section-width')
      burgerHeader.classList.add('burger-header-disappear')
      searchArea.classList.add('search-area-visible-transition')
      searchArea.classList.add('search-area-visible')
      header.classList.add('header-visible')
      header.classList.add('header-visible-transition')
    } else if ((window.innerWidth < 900) && (window.innerWidth > 500) && (drawer.classList.contains('places-disappear'))) {
      drawer.classList = ''
      rightSection.classList = ''
      burgerHeader.className = ''
      searchArea.className = ''
      header.className = ''
      drawer.classList.add('places-section-width')
      rightSection.classList.add('right-section-width')
      burgerHeader.classList.add('burger-header-disappear')
      searchArea.classList.add('search-area-visible-transition')
      searchArea.classList.add('search-area-visible')
      header.classList.add('header-visible')
      header.classList.add('header-visible-transition')
    } else if ((window.innerWidth < 900) && (window.innerWidth > 500) && (drawer.classList.contains('places-section-width'))) {
      drawer.classList = ''
      rightSection.classList = ''
      burgerHeader.className = ''
      searchArea.className = ''
      header.className = ''
      drawer.classList.add('places-disappear')
      rightSection.classList.add('right-full-width')
      burgerHeader.classList.add('burger-header-visible')
      searchArea.classList.add('search-area-disappear-transition')
      searchArea.classList.add('search-area-disappear')
      header.classList.add('header-disappear')
      header.classList.add('header-disappear-transition')
    } else if ((window.innerWidth < 500) &&  (drawer.classList.contains('places-disappear'))) {
      drawer.classList = ''
      rightSection.classList = ''
      burgerHeader.className = ''
      searchArea.className = ''
      header.className = ''
      drawer.classList.add('places-section-width')
      rightSection.classList.add('right-section-width')
      burgerHeader.classList.add('burger-header-disappear')
      searchArea.classList.add('search-area-visible-transition')
      searchArea.classList.add('search-area-visible')
      header.classList.add('header-visible')
      header.classList.add('header-visible-transition')
    } else if ((window.innerWidth < 500) && (drawer.classList.contains('places-section-width'))) {
      drawer.classList = ''
      rightSection.classList = ''
      burgerHeader.className = ''
      searchArea.className = ''
      header.className = ''
      drawer.classList.add('places-disappear')
      rightSection.classList.add('right-full-width')
      burgerHeader.classList.add('burger-header-visible')
      searchArea.classList.add('search-area-disappear-transition')
      searchArea.classList.add('search-area-disappear')
      header.classList.add('header-disappear')
      header.classList.add('header-disappear-transition')
    }
  }

  layoutOnLoad = () => {
    const drawer = document.getElementById("places-section");
      const rightSection = document.getElementById("right-section");
      const burgerHeader = document.getElementById("burger-header")
      const searchArea = document.getElementById("search-area");
      const header = document.getElementById("header");
      if (window.innerWidth < 900) {
        drawer.className =''
        rightSection.className = ''
        burgerHeader.className = ''
        drawer.classList.add('places-disappear')
        rightSection.classList.add('right-full-width')
        burgerHeader.classList.add('burger-header-visible')
      } else {
        drawer.className =''
        rightSection.className = ''
        burgerHeader.className = ''
        searchArea.className = ''
        header.className = ''
        drawer.classList.add('places-section-width')
        rightSection.classList.add('right-section-width')
        burgerHeader.classList.add('burger-header-disappear')
        searchArea.classList.add('search-area-visible-transition')
        searchArea.classList.add('search-area-visible')
        header.classList.add('header-visible')
        header.classList.add('header-visible-transition')
      }
  }

  layoutOnResize = () => {
    window.onresize = () => {
      const drawer = document.getElementById("places-section");
      const rightSection = document.getElementById("right-section");
      const burgerHeader = document.getElementById("burger-header")
      const searchArea = document.getElementById("search-area");
      const header = document.getElementById("header");
      if (window.innerWidth < 900) {
        drawer.className =''
        rightSection.className = ''
        burgerHeader.className = ''
        drawer.classList.add('places-disappear')
        rightSection.classList.add('right-full-width')
        burgerHeader.classList.add('burger-header-visible')
      } else {
        drawer.className =''
        rightSection.className = ''
        burgerHeader.className = ''
        searchArea.className = ''
        header.className = ''
        drawer.classList.add('places-section-width')
        rightSection.classList.add('right-section-width')
        burgerHeader.classList.add('burger-header-disappear')
        searchArea.classList.add('search-area-visible-transition')
        searchArea.classList.add('search-area-visible')
        header.classList.add('header-visible')
        header.classList.add('header-visible-transition')
      }
    }
  }

  removeFromTabOrder = () => {
    const iframeElement = document.getElementsByTagName('iframe')[0]
    if (iframeElement) {
      iframeElement.tabIndex = -1;
    }
    
  }

  render() {
    return (
      <main className="App" id="app">
        <Places
          listedPlaces={this.state.listedPlaces}
          filterPlaces={this.filterPlaces}
          selectPlace={this.selectPlace}
          closeDrawer={this.closeDrawer}
        />
        <section id="right-section" className="right-section-width">
          <Burger handleClick={this.openCloseDrawer} />
          <Map />
        </section>
      </main>
    );
  }
}

export default App;
