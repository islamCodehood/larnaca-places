import React, { Component} from 'react'

class Map extends Component {
    /*citation for this code snippet for lazy loading:
    *http://cuneyt.aliustaoglu.biz/en/using-google-maps-in-react-without-custom-libraries*/
    onScriptLoad = () => {
        var map = new window.google.maps.Map(
            document.getElementById("map"),
            this.props.parameters);
            this.props.onMapLoad(map)
        }

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
    render() {
        
        return (
            <div id="map-section"> 
                <div id="map" style={{ width: 500, height: 500 }}>
                </div>  
            </div>
            
        )
    }
}


export default Map