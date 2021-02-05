/* eslint-disable no-undef */
let map;

// eslint-disable-next-line no-unused-vars
function initMap() {
    directionsService = new google.maps.DirectionsService();

    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 51.05011, lng: -114.08529 },
        zoom: 12,
    });

    map.controls[google.maps.ControlPosition.LEFT_TOP].push
        (document.getElementById('legend'));

    showDumpsters();
    // init();
}

function getLocation() {
    if (navigator.geolocation) {
        return navigator.geolocation.getCurrentPosition(showRoute);
    } else {
        console.log("Geolocation is not supported");
        showMessage('Error', "Geolocation is not supported by this browser.", 'Error');
    }
}

function showRoute(position) {
    let coord = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    };
    console.log(coord);
    drawPin(coord);
    calculateAndDisplayRoute(coord);
}

function drawPin(position) {
    const marker = new google.maps.Marker({
        position: position,
        map: map,
    });
    markers[-1] = marker;
}


var l;
function calculateAndDisplayRoute(position) {
    let renderOptions = {
        suppressMarkers: true
    };
    const directionsRenderer = new google.maps.DirectionsRenderer(renderOptions);
    directionsRenderer.setMap(map);

    directionsService.route(
        {
            origin: position,
            destination: position,
            travelMode: google.maps.TravelMode.DRIVING,
            optimizeWaypoints: true,
            waypoints: waypoints
        },
        (response, status) => {
            if (status === "OK") {
                console.log(response);
                directionsRenderer.setDirections(response);

                map.setZoom(12);
                map.setCenter(position);
                // render(response);
            } else {
                window.alert("Directions request failed due to " + status);
            }
        }
    );
}

let markers = {};
let defaultIcon = '/icons/trash.png';
let selectedIcon = '/icons/trash_blue.png';
let fullIcon = '/icons/trash_red.png';


function addMarker(dumpster) {

    let lat = dumpster.Latitude;
    let lng = dumpster.Longitude;
    let opacity = 0.4;
    const marker = new google.maps.Marker({
        position: { lat: lat, lng: lng },
        map: map,
        icon: defaultIcon,
        opacity: opacity
    });
    marker.defaultOpacity = opacity;
    marker.SensorID = dumpster.SensorID;
    markers[dumpster.SensorID] = marker;
    if (dumpster.FullnessLevel == 100) {
        marker.setIcon(fullIcon);
    };
    const contentString =
        '<div id="body">' +
        '<p>Fullness: ' +
        dumpster.FullnessLevel +
        '%<br>' +
        'Battery: ' +
        dumpster.BatteryLevel +
        '%<br></p>' +
        '</div>';

    const infowindow = new google.maps.InfoWindow({
        content: contentString,
    });


    marker.addListener('mouseover', () => {

        infowindow.open(map, marker);

    });

    marker.addListener('mouseout', () => {

        infowindow.close();
    });
}

var sensors = {};

function showDumpsters() {
    fetch('/api/my-route', {
        method: 'get',
    })
        .then(res => res.json())
        .then(data => {
            sensors = data;
            draw();
        });

}

function clear() {
    Object.values(markers).forEach(i => i.setMap(null));
}

function draw() {
    clear();
    waypoints = sensors.map(s => {
        return {
            location: {
                lat: s.Latitude,
                lng: s.Longitude
            },
            stopover: true,
        };
    });
    // calculateAndDisplayRoute(waypoints);
    sensors.forEach(element => {
        addMarker(element);
    });
    getLocation();

}


