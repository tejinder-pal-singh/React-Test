"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import Map from './map_container.js';
import ContentPanel from './reactcomponents/contentpanel.js';
import { Preloader, PageHeader } from './reactcomponents/page.js';

var e = React.createElement;

var MapContainer = function (_React$Component) {
  _inherits(MapContainer, _React$Component);

  function MapContainer(props) {
    _classCallCheck(this, MapContainer);

    var _this2 = _possibleConstructorReturn(this, (MapContainer.__proto__ || Object.getPrototypeOf(MapContainer)).call(this, props));

    console.log(props);
    _this2.state = {
      fetchType: props.type,
      fetchValue: props.value,
      companyID: props.companyID,
      mapOptions: props.mapOptions,
      map: null,
      lines: []
    };

    _this2.printOverlay = _this2.printOverlay.bind(_this2);
    _this2.createPoly = _this2.createPoly.bind(_this2);
    return _this2;
  }

  _createClass(MapContainer, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var map = new google.maps.Map(document.getElementById("map"), this.state.mapOptions);
      this.setState({ map: map });
    }
  }, {
    key: 'UNSAFE_componentWillReceiveProps',
    value: function UNSAFE_componentWillReceiveProps(newProps) {
      this.setState({
        fetchType: newProps.type,
        fetchValue: newProps.value
      });
      this.getRoutes(newProps.type, newProps.value);
      console.log(this.state);
    }
  }, {
    key: 'getRoutes',
    value: function getRoutes(type, value) {
      var _this3 = this;

      console.log(type, value);
      var _this = this;
      if (this.state.lines.length > 0) {
        var ll = this.state.lines;
        ll.forEach(function (line, index) {
          //line.setMap(null);
          console.log(line);
        });
      }
      if (type !== null && value !== null) {
        fetch("api/KMZ/GetSelectiveCompanyRoutes?cpy_id=" + this.state.companyID + "&type=" + type + "&value=" + value, {
          mode: "no-cors",
          method: "get"
        }).then(function (response) {
          return response.json();
        }).then(function (data) {
          console.log(data);
          if (data.length > 0) {
            var lines = [];
            var segmentArray = [];
            data.forEach(function (segment, index) {
              segmentArray[segment.SegmentId] = segment;
              var clr = "#065eaa";
              var startDate = moment.utc(segment.gpsDateTime);
              var endDate = moment();
              var seconds = moment.duration(endDate.diff(startDate)).asHours();
              lines.push(_this.printOverlay(segment, clr));
            });
            return lines;
          }
        }).then(function (lns) {
          _this3.setState({ lines: lns });
        });
      }
    }
  }, {
    key: 'printOverlay',
    value: function printOverlay(segment, color) {
      var _this = this;
      var lines = [];
      if (segment.isMultiLine) {
        lines[segment.SegmentId] = [];
        segment.MultiRouteSegmentPoints.forEach(function (value, index) {
          var path = [];
          value.forEach(function (v, ind) {
            path.push(new google.maps.LatLng(v.Latitude, v.Longitude));
          });
          lines[segment.SegmentId].push(_this.createPoly(path, color, segment.SegmentId));
        });
      } else {
        var path = [];
        segment.RouteSegmentPoints.forEach(function (v, ind) {
          path.push(new google.maps.LatLng(v.Latitude, v.Longitude));
        });
        lines[segment.SegmentId] = _this.createPoly(path, color, segment);
      }
      return lines;
    }
  }, {
    key: 'createPoly',
    value: function createPoly(path, clr, segment) {
      var infoContent = "<b>" + (true ? "Route " : "Sidewalk Route ") + segment.StreetName + "</b><br/>" + "<span>" + segment.PartOfRoute + "</span>";
      var infoWindow = new google.maps.InfoWindow({
        content: infoContent,
        pixelOffset: new google.maps.Size(0, -10)
      });
      var poly = new google.maps.Polyline({
        strokeColor: clr,
        strokeOpacity: 1.0,
        strokeWeight: 10,
        map: this.state.map,
        routeID: segment.SegmentId,
        selected: false
      });
      poly.setPath(path);
      var _this = this;
      poly.addListener("mouseover", function (e) {
        //poly.setMap(null);
        // poly.setOptions({
        //   strokeWeight: 10,
        //   strokeColor: "#fdc944"
        // });
        //poly.setMap(_this.state.map);
        if (!infoWindow.getMap()) {
          infoWindow.setPosition(e.latLng);
          infoWindow.open(_this.state.map, poly);
        }
      });
      poly.addListener("mouseout", function () {
        // poly.setOptions({
        //   strokeWeight: 3,
        //   strokeColor: clr
        // });
        infoWindow.close();
      });

      poly.addListener("click", function (e) {
        if (!poly.selected) {
          poly.setOptions({
            strokeColor: "#fdc944"
          });
          poly.selected = true;
        } else {
          poly.setOptions({
            strokeColor: clr
          });
          poly.selected = false;
        }
      });
      return poly;
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement('div', { id: 'map', style: { height: "600px" } });
    }
  }]);

  return MapContainer;
}(React.Component);

var MainPanle = function (_React$Component2) {
  _inherits(MainPanle, _React$Component2);

  function MainPanle(props) {
    var _this4$state;

    _classCallCheck(this, MainPanle);

    var _this4 = _possibleConstructorReturn(this, (MainPanle.__proto__ || Object.getPrototypeOf(MainPanle)).call(this, props));

    _this4.state = (_this4$state = {
      showPreloader: false,
      pageName: "Route Management",
      map: null,
      companyDetials: null,
      isError: false,
      lines: []
    }, _defineProperty(_this4$state, 'companyDetials', null), _defineProperty(_this4$state, 'fetchType', null), _defineProperty(_this4$state, 'fetchValue', null), _this4$state);

    _this4.filterChange = _this4.filterChange.bind(_this4);
    return _this4;
  }

  _createClass(MainPanle, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this5 = this;

      var _this = this;
      fetch("api/General/GetCompanyLocation").then(function (res) {
        return res.json();
      }).then(function (data) {
        if (data.length > 0) {
          var item = data[0];
          var lat = item.CPY_LATITUDE;
          var lng = item.CPY_LONGITUDE;
          var zoom = item.CPY_MAP_ZOOM_LEVEL;

          var mapOptions = {
            zoom: zoom || 6,
            center: new google.maps.LatLng(lat, lng),
            gestureHandling: "greedy",
            styles: [{
              featureType: "poi",
              stylers: [{
                visibility: "off"
              }]
            }]
          };

          _this5.setState({
            companyDetials: item,
            mapOptions: mapOptions
          });
        }
      }, function (error) {
        _this5.setState({
          isError: true,
          error: error
        });
      });
    }
  }, {
    key: 'filterChange',
    value: function filterChange(event) {
      this.setState({
        fetchType: event.target.id,
        fetchValue: event.target.value
      });
    }
  }, {
    key: 'render',
    value: function render() {
      if (this.state.companyDetials !== null) {
        return React.createElement(
          'div',
          null,
          React.createElement(Preloader, { show: this.state.showPreloader }),
          React.createElement(
            'div',
            { className: 'mainpanel', style: { marginLeft: "0px" } },
            React.createElement(PageHeader, { headerName: this.state.pageName }),
            React.createElement(ContentPanel, { oc: this.filterChange, companyID: this.state.companyDetials.CPY_ID, mapOptions: this.state.mapOptions, type: this.state.fetchType, value: this.state.fetchValue })
          )
        );
      }

      return React.createElement(
        'div',
        null,
        React.createElement(Preloader, { show: this.state.showPreloader }),
        React.createElement(
          'div',
          { className: 'mainpanel', style: { marginLeft: "0px" } },
          React.createElement(PageHeader, { headerName: this.state.pageName })
        )
      );
    }
  }]);

  return MainPanle;
}(React.Component);

var domContainer = document.querySelector("#route_management_container");
ReactDOM.render(React.createElement(MainPanle, null), domContainer);