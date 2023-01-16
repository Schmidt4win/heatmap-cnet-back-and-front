import fetchWithDownloadTrack from "./fecthOnProgress.js";

const searchCtoField = document.querySelector("#input-cto");


var map, pointArray, heatmap;
var TILE_SIZE = 256;

const tomodatData = [];
let mapCoordinates = [];

window.addEventListener("load", async () => {
  if (checkLogin()) {
    loadMap();
  } else {
    window.location.href = "./index.html";
  }
});

function checkLogin() {
  const token = window.localStorage.getItem("token");
  return token ? true : false;
}

async function loadMap() {
  try {
    const data = await fetchWithDownloadTrack("https://api.heatmap.conectnet.net/tomodat");

    tomodatData.push(...data);

    mapCoordinates = tomodatData.map(
      (data) =>
        new google.maps.LatLng(data.coord?.lat, data.coord?.lng)
    );

    pointArray = new google.maps.MVCArray(mapCoordinates);

    heatmap = new google.maps.visualization.HeatmapLayer({
      data: pointArray,
      radius: getNewRadius(),
    });

    heatmap.setMap(map);

    google.maps.event.addListener(map, "zoom_changed", function () {
      heatmap.setOptions({ radius: getNewRadius() });
    });

    setMarkers();
    hideMarkers(markers);
  } catch (err) {
    console.error(err);
  }
}

//atualizar dados

const markers = []; //problema
const infoWindows = [];

function setMarkers() {
  tomodatData.forEach((data) => {
    let { lat, lng } = data.coord;
    const image = "./images/cto conect.png";
    markers.push(
      new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        map,
        title: data.name,
        icon: image,
      })
    );
  });

  const infoWindows = [];

  markers.forEach((marker) => {
    marker.addListener("click", () => {
      const pos = marker.position.toJSON();
      const clients = tomodatData.filter(data => {
        return data.name == marker.title && data.coord.lat == pos.lat && data.coord.lng == pos.lng
      }).map(result => result.clients);
      const infoWindow = getInfoWindow(pos, marker.title, clients);
      infoWindows.push(infoWindow);
      infoWindow.open({
        anchor: marker,
        map,
      });
      infoWindows.forEach((info) => {
        if (info.content != infoWindow.content) info.close();
      });
    });
  });
}

//Mercator --BEGIN--
function bound(value, opt_min, opt_max) {
  if (opt_min !== null) value = Math.max(value, opt_min);
  if (opt_max !== null) value = Math.min(value, opt_max);
  return value;
}

function degreesToRadians(deg) {
  return deg * (Math.PI / 180);
}

function radiansToDegrees(rad) {
  return rad / (Math.PI / 180);
}

function MercatorProjection() {
  this.pixelOrigin_ = new google.maps.Point(TILE_SIZE / 2, TILE_SIZE / 2);
  this.pixelsPerLonDegree_ = TILE_SIZE / 360;
  this.pixelsPerLonRadian_ = TILE_SIZE / (2 * Math.PI);
}

MercatorProjection.prototype.fromLatLngToPoint = function (latLng, opt_point) {
  var me = this;
  var point = opt_point || new google.maps.Point(0, 0);
  var origin = me.pixelOrigin_;

  point.x = origin.x + latLng.lng() * me.pixelsPerLonDegree_;

  // NOTE(appleton): Truncating to 0.9999 effectively limits latitude to
  // 89.189.  This is about a third of a tile past the edge of the world
  // tile.
  var siny = bound(Math.sin(degreesToRadians(latLng.lat())), -0.9999, 0.9999);
  point.y =
    origin.y +
    0.5 * Math.log((1 + siny) / (1 - siny)) * -me.pixelsPerLonRadian_;
  return point;
};

MercatorProjection.prototype.fromPointToLatLng = function (point) {
  var me = this;
  var origin = me.pixelOrigin_;
  var lng = (point.x - origin.x) / me.pixelsPerLonDegree_;
  var latRadians = (point.y - origin.y) / -me.pixelsPerLonRadian_;
  var lat = radiansToDegrees(2 * Math.atan(Math.exp(latRadians)) - Math.PI / 2);
  return new google.maps.LatLng(lat, lng);
};

var desiredRadiusPerPointInMeters = 200;
function getNewRadius() {
  var numTiles = 1 << map.getZoom();
  var center = map.getCenter();
  var moved = google.maps.geometry.spherical.computeOffset(
    center,
    10000,
    90
  ); /*1000 meters to the right*/
  var projection = new MercatorProjection();
  var initCoord = projection.fromLatLngToPoint(center);
  var endCoord = projection.fromLatLngToPoint(moved);
  var initPoint = new google.maps.Point(
    initCoord.x * numTiles,
    initCoord.y * numTiles
  );
  var endPoint = new google.maps.Point(
    endCoord.x * numTiles,
    endCoord.y * numTiles
  );
  var pixelsPerMeter = Math.abs(initPoint.x - endPoint.x) / 10000.0;
  var totalPixelSize = Math.floor(
    desiredRadiusPerPointInMeters * pixelsPerMeter
  );

  return totalPixelSize;
}

function initialize() {
  var mapOptions = {
    zoom: 15,
    center: new google.maps.LatLng(-29.580137, -50.901022),
    mapTypeId: google.maps.MapTypeId.roadmap,
  };
  map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
  const input = document.getElementById("sasked");
  const searchBox = new google.maps.places.SearchBox(input);

  searchBox.addListener("places_changed", () => {
    const places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    // markers.forEach((marker) => {
    //   marker.setMap(null);
    // });
    //  markers = []; //conflita com esse

    // For each place, get the icon, name and location.
    const bounds = new google.maps.LatLngBounds();

    places.forEach((place) => {
      if (!place.geometry || !place.geometry.location) {
        console.log("Returned place contains no geometry");
        return;
      }

      const icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25),
      };

      // Create a marker for each place.
      markers.push(
        new google.maps.Marker({
          map,
          icon,
          title: place.name,
          position: place.geometry.location,
        })
      );
      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });

  document
    .getElementById("toggle-heatmap")
    .addEventListener("click", toggleHeatmap);
  document
    .getElementById("change-gradient")
    .addEventListener("click", changeGradient);
  document
    .getElementById("change-opacity")
    .addEventListener("click", changeOpacity);
  document
    .getElementById("change-radius")
    .addEventListener("click", changeRadius);
  document
    .getElementById("get-location")
    .addEventListener("click", getLocation, showPosition);
}

function toggleHeatmap() {
  heatmap.setMap(heatmap.getMap() ? null : map);
}

function changeGradient() {
  const gradient = [
    "rgba(0, 255, 255, 0)",
    "rgba(0, 255, 255, 1)",
    "rgba(0, 191, 255, 1)",
    "rgba(0, 127, 255, 1)",
    "rgba(0, 63, 255, 1)",
    "rgba(0, 0, 255, 1)",
    "rgba(0, 0, 223, 1)",
    "rgba(0, 0, 191, 1)",
    "rgba(0, 0, 159, 1)",
    "rgba(0, 0, 127, 1)",
    "rgba(63, 0, 91, 1)",
    "rgba(127, 0, 63, 1)",
    "rgba(191, 0, 31, 1)",
    "rgba(255, 0, 0, 1)",
  ];

  heatmap.set("gradient", heatmap.get("gradient") ? null : gradient);
}

function changeRadius() {
  heatmap.set("radius", heatmap.get("radius") ? null : 200);
}

function changeOpacity() {
  heatmap.set("opacity", heatmap.get("opacity") ? null : 1.2);
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function showPosition(position) {
  var lat = position.coords.latitude;
  var lng = position.coords.longitude;
  const image = "./images/street-view-icon.png";
  map.setCenter(new google.maps.LatLng(lat, lng));

  let marker = new google.maps.Marker({
    position: new google.maps.LatLng(lat, lng),
    map,
    title: "Estou aqui!",
    icon: image,
  });

  let infosaske = new google.maps.LatLng(lat, lng).toJSON();
  let infoWindow = new google.maps.InfoWindow({
    content: `<a href="https://www.google.com/maps/search/?api=1&query=${infosaske.lat},${infosaske.lng}" target="_blank">Estou aqui!</a>`,
  });

  marker.addListener("click", function () {
    infoWindow.open({
      anchor: marker,
      map,
    });
  })

  // Configure the click listener.
  map.addListener("click", (mapsMouseEvent) => {
    // Close the current InfoWindow.
    infoWindow.close();
    marker.setMap(null);
    // Create a new InfoWindow.
    infoWindow = new google.maps.InfoWindow({
      position: mapsMouseEvent.latLng,
    });

    const contentinfosaske =
      '<div id="content">' +
      '<div id="siteNotice">' +
      "</div>" +
      '<div id="bodyContent">' +
      '<a href="' +
      "https://www.google.com/maps/search/?api=1&query=" +
      mapsMouseEvent.latLng.toJSON().lat +
      "," +
      mapsMouseEvent.latLng.toJSON().lng +
      '" target="_blank">' +
      "Ir ao Maps!</a> " +
      "</div>" +
      "</div>";
    infoWindow.setContent(contentinfosaske);

    infoWindow.open(map);

  });

}

function showMarkers(array) {
  array.forEach((marker) => marker.setMap(map));
}

function hideMarkers(array) {
  array.forEach((marker) => marker.setMap(null));
}

function logout() {
  window.localStorage.clear();
  window.location.href = "./index.html";
}

function renderClientsList(clients) {
  let list = "";

  clients[0].forEach(client => {
    let item = `<li>${client}</li>`;

    list += item;
  })

  return list;
}

function getInfoWindow(pos, cto, clients) {
  return new google.maps.InfoWindow({
    content: `
      <div class="text-center pb-3">
        <a href="https://www.google.com/maps/search/?api=1&query=${pos.lat}, ${pos.lng}" target="_blank">${cto}<a/>
      </div>
      <div>
        <ul>
          ${renderClientsList(clients)}
        </ul>
      </div>
    `,
  });
}

export function filterCto(query) {
  let filterdMarkers = [];
  if (query != "") {
    filterdMarkers = markers.filter(
      (marker) => marker.title.indexOf(query.toUpperCase()) > -1
    );

    if (filterdMarkers.length) {
      showMarkers(filterdMarkers);
      hideMarkers(markers.filter((marker) => !filterdMarkers.includes(marker)));
    }
  } else {
    hideMarkers(markers);
  }
}

searchCtoField.addEventListener("keyup", function () {
  filterCto(this.value);
});

searchCtoField.addEventListener("change", function () {
  filterCto(this.value);
});

export function setCenter(lat, lng) {
  map.setCenter({ lat, lng });
  map.setZoom(18);
}

window.initialize = initialize;


///https://www.google.com/maps/search/?api=1&query=36.26577,-92.54324
///assim deve ser a url pra compartilhar
