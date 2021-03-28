/* eslint-disable no-undef */
let map;
let directionsRenderer;
let autoUpdate = true;

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

    // Create the initial InfoWindow.
    let infoWindow = new google.maps.InfoWindow({
        content: "Click the map to get Lat/Lng!",
        position: map.center,
    });
    infoWindow.open(map);
    // Configure the click listener.
    map.addListener("click", (mapsMouseEvent) => {
        // Close the current InfoWindow.
        infoWindow.close();
        // Create a new InfoWindow.
        infoWindow = new google.maps.InfoWindow({
            position: mapsMouseEvent.latLng,
        });
        infoWindow.setContent(
            JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
        );
        position = {
            coords: {
                latitude: mapsMouseEvent.latLng.lat(),
                longitude: mapsMouseEvent.latLng.lng()
            }
        };
        storeLocation(position);
        autoUpdate = false;
        infoWindow.open(map);
    });
    
    setInterval(update, 10000);
    showDumpsters();
    // init();
}

let position;
function update() {
    if(!autoUpdate)
        return;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (pos) {
                if (pos.coords.latitude == position.coords.latitude && pos.coords.longitude == position.coords.longitude) {
                    // Position has not changed.
                } else {
                    position = pos;
                    storeLocation(position);
                }

            },
            function () {
                // No geolocation.
            }
        );
    };
}

function findDistance(lat1, lon1, lat2, lon2) {

    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c; // in metres
    return d;
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

    for (let d in dumpsters) {
        let k = findDistance(req.Latitude, req.Longitude, dumpsters[d].Latitude, dumpsters[d].Longitude);
        if (k < 300) {
            showPopup(dumpsters[d].DumpsterID);
        }
    }

    showRoute(position);
}

function showPopup(dumpsterId) {
    $('.modal.popup').modal('toggle');
    $('.modal.popup .modal-title').text("Pickup");
    $('.modal.popup .modal-body').html('Did you pick up Dumpster ID:' + dumpsterId + ' ?');
    $('.modal .btn-success').click(function () {
        $('.modal.popup').modal().hide();
        let req = {
            DumpsterID: dumpsterId
        };
        $.post('/driver/update-pickup', req, function (data) {
            if (data.success) {
                console.log('success');
            } else {
                console.log(data.error);
                showMessage('Error', data.error, 'Error');
            }
        });
    });
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

function showRoute(pos) {
    let coord = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
    };
    position = pos;
    console.log(coord);
    drawPin(coord);
    calculateAndDisplayRoute(coord);
}

let pin;



function drawPin(position) {
    if(pin){
        pin.setMap(null);
    }
   
    let paths =
        'M 13.75 0 L 8.25 0 C 6.792969 0 5.609375 1.621094 5.609375 3.078125 L 5.609375 19.359375 C 5.609375 20.816406 6.792969 22 8.25 22 L 13.75 22 C 15.207031 22 16.390625 20.816406 16.390625 19.359375 L 16.390625 3.078125 C 16.390625 1.621094 15.207031 0 13.75 0 Z M 15.925781 6.636719 L 15.925781 12.09375 L 14.652344 12.257812 L 14.652344 10.007812 Z M 15.257812 5.039062 C 14.78125 6.863281 14.21875 9.019531 14.21875 9.019531 L 7.78125 9.019531 L 6.738281 5.039062 C 6.742188 5.039062 10.894531 3.628906 15.257812 5.039062 Z M 7.363281 10.15625 L 7.363281 12.257812 L 6.085938 12.09375 L 6.085938 6.785156 Z M 6.085938 17.746094 L 6.085938 12.902344 L 7.363281 13.0625 L 7.363281 16.894531 Z M 6.8125 19.125 L 7.851562 17.5625 L 14.292969 17.5625 L 15.332031 19.125 Z M 14.652344 16.75 L 14.652344 13.066406 L 15.925781 12.898438 L 15.925781 17.601562 Z M 14.652344 16.75 ';
    let color = 'purple';
    const icon = {
        // path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        path: paths,
        fillColor: color,
        fillOpacity: 0.9,
        strokeWeight: 0,
        rotation: 0,
        scale: 2,
        // anchor: new google.maps.Point(15, 30),
    };

    const marker = new google.maps.Marker({
        position: position,
        map: map,
        icon: icon,
    });  
    pin = marker;
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

    let destination = position;
    if (depot) {
        destination = {
            lat: depot.Latitude,
            lng: depot.Longitude,
        };
    }
    if(directionsRenderer != null) {
        directionsRenderer.setMap(null);
        directionsRenderer = null;
    }
    let renderOptions = {
        suppressMarkers: true,
    };
   
    directionsRenderer = new google.maps.DirectionsRenderer(renderOptions);
    
    directionsRenderer.setMap(map);
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


    var longpress = false;

    google.maps.event.addListener(marker, 'click', function (event) {
        if (longpress) {
            infowindow.open(map, marker);
        }
    });

    google.maps.event.addListener(marker, 'mousedown', function (event) {
        start = new Date().getTime();
    });

    google.maps.event.addListener(marker, 'mouseup', function (event) {
        end = new Date().getTime();
        longpress = (end - start < 500) ? false : true;
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

            draw();
        });


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
