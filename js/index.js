var map;
var lines = new Map();
var segmentArray = new Map();
var selectedLines = new Map();

$(document).ready(function() {

  var mapOptions = {
    zoom: 11,
    center: new google.maps.LatLng(44.15367513592, -79.869583999),
    gestureHandling: 'greedy',
    styles: [{
      featureType: "poi",
      stylers: [{
        visibility: "off"
      }]
    }]
  };

  map = new google.maps.Map(document.getElementById("map"), mapOptions);

  var drawingManager = new google.maps.drawing.DrawingManager({
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: ['polygon'],
      polygonOptions: {
        clickable: true,
        editable: true,
      }
    }
  });


  google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event) {
    if (event.type == 'polygon') {
      checkIfInsidePoly(event);
      let polys = [];
      polys.push(event.overlay);
      initDatatable();
    }
    google.maps.event.addListener(event.overlay, 'click', function(e) {

    });
    google.maps.event.addListener(event.overlay, 'rightclick', function(e) {
      this.setMap(null);
    });
  });
  drawingManager.setMap(map);


  roadclass.forEach((value, index) => {
    $("#roadclass").append('<option value="' + value.groupNames + '">' + value.groupNames + '</option>');
  });
  routeclass.forEach((value, index) => {
    $("#routeclass").append('<option value="' + value.routeNames + '">' + value.routeNames + '</option>');
  });

  $("#roadclass").on('change', function() {
    loadPoly("roadclass", $(this).val());
  });
  $("#routeclass").on('change', function() {
    loadPoly("routeclass", $(this).val());
  });


});



function loadPoly(type, _class) {
  let newarray = [];
  if (type === "roadclass") {
    newarray = allroutes.filter((val, ind) => {
      return (val.group_id === _class);
    });
  } else if (type === "routeclass") {
    newarray = allroutes.filter((val, ind) => {
      return (val.PartOfRoute === _class);
    });
  }

  if (lines.size > 0) {
    lines.forEach((val, index) => {
      val.forEach((poly, i) => {
        poly.setMap(null);
      });
    });
    lines.clear();
    selectedLines.clear();
  }
  if ($.fn.DataTable.isDataTable('#routestable')) {
    $('#routestable').DataTable().clear();
    $('#routestable').DataTable().destroy();
    $('#routestable').empty();
  }


  newarray.forEach(function(segment, index) {
    segmentArray.set(segment.SegmentId, segment);
    let clr = "#065eaa";
    let startDate = moment.utc(segment.gpsDateTime);
    let endDate = moment();
    var seconds = moment.duration(endDate.diff(startDate)).asHours();
    lines.set(segment.SegmentId, printOverlay(segment, clr));
  });
}


function printOverlay(segment, color) {
  let lines = [];
  if (segment.isMultiLine) {
    lines[segment.SegmentId.toString()] = [];

    segment.MultiRouteSegmentPoints.forEach(function(value, index) {
      let path = [];
      value.forEach(function(v, ind) {
        path.push(new google.maps.LatLng(v.Latitude, v.Longitude));
      });
      lines[segment.SegmentId].push(createPoly(path, color, segment.SegmentId));
    });
  } else {
    let path = [];
    segment.RouteSegmentPoints.forEach(function(v, ind) {
      path.push(new google.maps.LatLng(v.Latitude, v.Longitude));
    });
    lines[segment.SegmentId] = createPoly(path, color, segment);
  }
  return lines;
}

function createPoly(path, clr, segment) {
  let infoContent =
    "<b>" +
    (true ? "Route " : "Sidewalk Route ") +
    segment.StreetName +
    "</b><br/>" +
    "<span>" +
    segment.PartOfRoute +
    "</span>";
  let infoWindow = new google.maps.InfoWindow({
    content: infoContent,
    pixelOffset: new google.maps.Size(0, -10)
  });
  let poly = new google.maps.Polyline({
    strokeColor: clr,
    strokeOpacity: 1.0,
    strokeWeight: 10,
    map: map,
    routeID: segment.SegmentId,
    selected: false
  });

  poly.setPath(path);
  poly.addListener("click", function(e) {
    let segment = segmentArray.get(poly.routeID);
    if (!poly.selected) {
      poly.setOptions({
        strokeColor: "#fdc944"
      });
      poly.selected = true;
      selectedLines.set(poly.routeID, segment);
    } else {
      poly.setOptions({
        strokeColor: clr
      });
      poly.selected = false;
      selectedLines.delete(poly.routeID);
    }
    initDatatable();
  });

  return poly;
}

function checkIfInsidePoly(event) {
  let _rows = new Map();
  if (lines.size > 0) {
    lines.forEach((line, index) => {
      line.forEach((l, i) => {
        let arr = l.getPath().getArray();
        console.log(arr[0]);
        if (google.maps.geometry.poly.containsLocation(arr[0], event.overlay)) {
          let segment = segmentArray.get(l.routeID);
          if (!l.selected) {
            l.setOptions({
              strokeColor: "#fdc944"
            });
            l.selected = true;
            selectedLines.set(l.routeID, segment);
          } else {
            l.setOptions({
              strokeColor: "#065eaa"
            });
            l.selected = false;
            selectedLines.delete(l.routeID);
          }
        }
      });
    });
  }
}

function initDatatable() {
  let dataSet = [];

  selectedLines.forEach((segment, index) => {
    var dd = [
      segment.SegmentId,
      segment.StreetName,
      segment.PartOfRoute,
      segment.group_id
    ];
    dataSet.push(dd);
  });
  if ($.fn.DataTable.isDataTable('#routestable')) {
    $('#routestable').DataTable().clear();
    $('#routestable').DataTable().destroy();
    $('#routestable').empty();
  }
  console.log(dataSet);
  $('#routestable').DataTable({
    data: dataSet,
    columns: [{
        title: "Segment Id"
      },
      {
        title: "StreetName"
      },
      {
        title: "Route Class"
      },
      {
        title: "Road Class"
      }
    ]
  });

}
