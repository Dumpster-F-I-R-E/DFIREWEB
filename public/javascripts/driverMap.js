/* eslint-disable no-undef */
let map;

// eslint-disable-next-line no-unused-vars
function initMap() {
    directionsService = new google.maps.DirectionsService();

    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 51.05011, lng: -114.08529 },
        zoom: 12,
    });

    map.controls[google.maps.ControlPosition.LEFT_TOP].push(
        document.getElementById('legend')
    );

    showDumpsters();
    // init();
}

function storeLocation(position) {
    let req = {
        Latitude: position.coords.latitude,
        Longitude: position.coords.longitude,
    };
    $.post('/driver/update-location', req, function (data) {
        if (data.success) {
            console.log('success');
        } else {
            console.log(data.error);
            showMessage('Error', data.error, 'Error');
        }
    });

    showRoute(position);
}

function getLocation() {
    if (navigator.geolocation) {
        return navigator.geolocation.getCurrentPosition(
            storeLocation,
            permissionDenied
        );
    } else {
        alert('Geolocation error');
        console.log('Geolocation is not supported');
        showMessage(
            'Error',
            'Geolocation is not supported by this browser.',
            'Error'
        );
    }
}

function permissionDenied() {
    showMessage('GPS', 'Geolocation is not enabled');
    let coords = {
        latitude: depot.Latitude,
        longitude: depot.Longitude,
    };
    let position = {
        coords: coords,
    };
    showRoute(position);
}

function showRoute(position) {
    let coord = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
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

let depoIcon = '/icons/depot.png';

depots = {};

function drawDepot(depot) {
    let lat = depot.Latitude;
    let lng = depot.Longitude;
    const marker = new google.maps.Marker({
        position: { lat: lat, lng: lng },
        map: map,
        icon: depoIcon,
    });
    depot.marker = marker;
    depots[depot.DepotID] = depot;

    const contentString =
        '<div id="body">' +
        '<p>' +
        depot.Name +
        '<br>' +
        depot.Address +
        '</p>' +
        '</div>';

    const infowindow = new google.maps.InfoWindow({
        content: contentString,
    });

    google.maps.event.addListener(marker, 'mouseover', (e) => {
        infowindow.open(map);
    });

    marker.addListener('mouseout', () => {
        infowindow.close();
    });
}

function calculateAndDisplayRoute(position) {
    let renderOptions = {
        suppressMarkers: true,
    };
    const directionsRenderer = new google.maps.DirectionsRenderer(
        renderOptions
    );
    directionsRenderer.setMap(map);

    let destination = position;
    if (depot) {
        destination = {
            lat: depot.Latitude,
            lng: depot.Longitude,
        };
    }
    directionsService.route(
        {
            origin: position,
            destination: destination,
            travelMode: google.maps.TravelMode.DRIVING,
            optimizeWaypoints: true,
            waypoints: waypoints,
        },
        (response, status) => {
            if (status === 'OK') {
                console.log(response);
                directionsRenderer.setDirections(response);

                map.setZoom(12);
                map.setCenter(position);
                // render(response);
            } else {
                window.alert('Directions request failed due to ' + status);
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
    let opacity = 1.0;
    const marker = new google.maps.Marker({
        position: { lat: lat, lng: lng },
        map: map,
        icon: defaultIcon,
        opacity: opacity,
    });
    marker.defaultOpacity = opacity;
    marker.SensorID = dumpster.SensorID;
    markers[dumpster.SensorID] = marker;
    if (dumpster.FullnessLevel == 100) {
        marker.setIcon(fullIcon);
    }
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

let depot = null;
let drivers = {};

function showDumpsters() {
    clear();
    fetch('/api/my-route', {
        method: 'get',
    })
        .then((res) => res.json())
        .then((data) => {
            dumpsters = data.Dumpsters;
            depot = data.Depot;
            draw();
        });

    fetch('/api/depots', {
        method: 'get',
    })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            data.forEach((depot) => {
                drawDepot(depot);
            });
        })
        .catch((err) => console.log(err));
}

function clear() {
    Object.values(markers).forEach((i) => i.setMap(null));
    Object.values(depots).forEach((i) => i.marker.setMap(null));
}

function draw() {
    waypoints = dumpsters.map((s) => {
        return {
            location: {
                lat: s.Latitude,
                lng: s.Longitude,
            },
            stopover: true,
        };
    });
    // calculateAndDisplayRoute(waypoints);
    dumpsters.forEach((element) => {
        addMarker(element);
    });
    getLocation();
}
