import React from 'react';
import ReactDOM from 'react-dom';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import App from './App';
import Allroutes from './allRoutes';
 
  //lists of roads and routes 
  const roadclass = [{"groupNames":"Select Road Class"},{"groupNames":"B1"},{"groupNames":"B2"},{"groupNames":"014148"},{"groupNames":"014086"},{"groupNames":"014117"},{"groupNames":"014067"},{"groupNames":"015000"},{"groupNames":"010152"},{"groupNames":"010014"},{"groupNames":"010028"},{"groupNames":"010000"},{"groupNames":"014179"},{"groupNames":"010054"},{"groupNames":"010069"},{"groupNames":"001095"},{"groupNames":"010082"},{"groupNames":"010096"},{"groupNames":"001024"},{"groupNames":"001054"},{"groupNames":"010110"},{"groupNames":"010124"},{"groupNames":"010138"},{"groupNames":"027000"},{"groupNames":"001000"},{"groupNames":"010205"},{"groupNames":"014209"},{"groupNames":"001115"},{"groupNames":"001145"},{"groupNames":"015014"},{"groupNames":"010180"},{"groupNames":"010166"}];
  const routeclass = [{"routeNames":"Select Route Class"},{"routeNames":"B1-Secondary"},{"routeNames":"B1-Primary"},{"routeNames":"2N001"},{"routeNames":"2N002"},{"routeNames":"2N004"},{"routeNames":"2N005"},{"routeNames":"2D005"},{"routeNames":"2N003"}];

  //changing lists to options
  const roadclassOption = roadclass.map((road) =>
      <option value={road.groupNames} >{road.groupNames}</option>
  );
  const routeclassOption = routeclass.map((route) =>
      <option value={route.routeNames}>{route.routeNames}</option>
  );

  //wrapping options(as passed) inside a select tag
  const SelectTag = (props) => {
      //TODO: Figure to add id
      return(
          <select className="form-control">{props.snippet}</select>
      )
  }

  
  //rendering them to DOM
  ReactDOM.render(
      <div>
          <SelectTag snippet={roadclassOption}/>
          <SelectTag snippet={routeclassOption}/>
          <App/>
      </div>
      ,
    document.getElementById("root")
 );