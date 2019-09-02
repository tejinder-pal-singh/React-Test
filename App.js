import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import './Drawing'; 
function App() {
  const google = window.google
  const { DrawingManager } = require("DrawingManager");
  return (
    <div>
        <Map google={this.props.google} zoom={14} initialCenter={{lat: 44.15367513592, lng: -79.869583999}}
                >
    
        <Marker onClick={this.onMarkerClick}
                name={'Current location'} />

        <InfoWindow onClose={this.onInfoWindowClose}>
            <div>
              <h1>{this.state.selectedPlace.name}</h1>
            </div>
        </InfoWindow>

        <DrawingManager
          defaultDrawingMode={
            google.maps.drawing.OverlayType.POLYGON}
          defaultOptions={{
            drawingControl: true,
            drawingControlOptions: {
              position: google.maps.ControlPosition.TOP_CENTER,
              drawingModes: [
                google.maps.drawing.OverlayType.POLYGON
              ],  
              polygonOptions: {
                clickable: true,
                editable: true,
                fillColor: `#ffff00`,
                fillOpacity: 1,
                zIndex: 1,
              },
            }
      }}
    />
      </Map>
  </div>
  );
}

export default GoogleApiWrapper({
  apiKey: ('AIzaSyBYzHYszm9XakoMlhPlhkGiRdfi4K4EVAg')
})(Map)