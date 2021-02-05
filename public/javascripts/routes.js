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
    init();
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
    calculateAndDisplayRoute();
}


function calculateAndDisplayRoute(waypoints, driverId) {
    console.log(waypoints);
    let position = { lat: 51.15011, lng: -114.08529 };
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
                // directionsRenderer.setDirections(response);
                render(response, driverId);
            } else {
                window.alert("Directions request failed due to " + status);
            }
        }
    );
}

function render(result, driverId) {


    for (let index = 0; index < result.routes[0].legs.length; index++) {
        var myRoute = result.routes[0].legs[index];
        let points = [];
        for (var i = 0; i < myRoute.steps.length; i++) {
            for (var j = 0; j < myRoute.steps[i].lat_lngs.length; j++) {
                points.push(myRoute.steps[i].lat_lngs[j]);
            }
        }
        drawRoute(points, driverId);
    }


}

function selectPath(driverId) {
    if (lines[driverId]) {
        lines[driverId].forEach(line => {
            line.setOptions({
                strokeOpacity: 1.0,
            });
        });
    }

    if (routes[driverId]) {
        routes[driverId].forEach(s => {
            markers[s].setOpacity(1.0);
        });
    }

}

function deselectPath(driverId) {
    if (lines[driverId]) {
        lines[driverId].forEach(line => {
            line.setOptions({ strokeOpacity: 0.5, });
        });
    }

    if (routes[driverId]) {
        routes[driverId].forEach(s => {
            markers[s].setOpacity(markers[s].defaultOpacity);
        });
    }
}

lines = {};

function drawRoute(points, driverId) {

    let driver = drivers[driverId];

    let name = driver.FirstName + ' ' + driver.LastName;
    let color = stringToColour(name);

    var line = new google.maps.Polyline(
        {
            path: points,
            strokeColor: color,
            strokeOpacity: 0.5,
            strokeWeight: 3
        }
    );
    line.setMap(map);
    line.defaultColor = color;

    if (!lines[driverId])
        lines[driverId] = [];

    lines[driverId].push(line);

    const contentString =
        '<div id="body">' +
        '<p>' + name + '</p>' +
        '</div>';

    const infowindow = new google.maps.InfoWindow({
        content: contentString,
    });

    google.maps.event.addListener(line, 'mouseover', (e) => {

        // line.setOptions({ strokeColor: '#ff0000' });
        selectPath(driverId);
        infowindow.setPosition(e.latLng);
        infowindow.open(map);
    });

    line.addListener('mouseout', () => {

        deselectPath(driverId);
        infowindow.close();
    });


}


let selection = false;
let selected = {};
let markers = {};
let defaultIcon = '/icons/trash.png';
let selectedIcon = '/icons/trash_blue.png';
let fullIcon = '/icons/trash_red.png';


function addMarker(dumpster) {

    let lat = dumpster.Latitude;
    let lng = dumpster.Longitude;
    let opacity = 0.4;
    if (dumpster.DriverID) {
        opacity = 0.6;
        console.log("Driver ", dumpster.DriverID);
    }
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

    marker.addListener('click', () => {
        if (selection) {

            if (selected[marker.SensorID]) {
                selected[marker.SensorID] = false;
                marker.setIcon(defaultIcon);
            } else {
                selected[marker.SensorID] = true;
                marker.setIcon(selectedIcon);
            }


        } else {
            window.location = '/dumpster/' + dumpster.SensorID;
        }

    });

    marker.addListener('mouseover', () => {

        selectPath(dumpster.DriverID);
        infowindow.open(map, marker);

    });

    marker.addListener('mouseout', () => {
        setOpacity();
        infowindow.close();
    });
}

var sensors = {};
var drivers = {};
var routes = {};

function showDumpsters() {
    fetch('/api/routes', {
        method: 'get',
    })
        .then(res => res.json())
        .then(data => {
            sensors = data.Sensors;
            routes = data.Routes;
            drivers = data.Drivers;
            draw();
        });

}

function clear() {
    Object.values(markers).forEach(i => i.setMap(null));
}

function draw() {
    clear();

    let routesKey = Object.keys(routes);
    routesKey.forEach(element => {
        // drawLine(routes[element].map(k => sensors[k]), drivers[element]);
        let waypoints = routes[element].map(d => {
            sensors[d].DriverID = element;
            return {
                location: {
                    lat: sensors[d].Latitude,
                    lng: sensors[d].Longitude
                },
                stopover: true,
            };

        });

        calculateAndDisplayRoute(waypoints, element);

    });

    let sensorData = Object.values(sensors);
    sensorData.forEach(element => {
        addMarker(element);
    });

    drawLegend();
}

function drawLegend() {
    var legend = document.getElementById('legend');
    for (var driver in drivers) {
        var name = drivers[driver].FirstName + ' ' +drivers[driver].LastName;
        var color = stringToColour(name);
        var div = document.createElement('div');
        console.log(driver,name);
        div.innerHTML = '<div class=\'dot\' style="background-color:'+color+'"></div>' + name;
        legend.appendChild(div);
    }

}


function updateMarkers() {
    Object.values(markers).forEach(item => {
        if (selected[item.SensorID]) {
            item.setIcon(selectedIcon);
        } else {
            item.setIcon(defaultIcon);
        }
    });
}

var stringToColour = function (str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = '#';
    for (var i = 0; i < 3; i++) {
        var value = (hash >> (i * 8)) & 0xFF;
        colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
};

function init() {
    $(document).ready(function () {
        let driverID = 0;
        $('.btn.assign-driver').click(function () {
            $('.background').toggle();
        });

        $('.btn.next').click(function () {
            driverID = $('#driver').val();
            $('.background').toggle();
            console.log('Select Dumpsters');
            $('.select-dumpsters').show();
            $('#map').focus();
            selection = true;
        });

        $('div.background').click(function (e) {
            console.log(e);
            let background = document.getElementsByClassName('background')[0];
            if (e.target == background) {
                $('.background').hide();
            }

        });

        $('.btn.cancel').click(function () {
            selection = false;
            selected = {};
            $('.select-dumpsters').hide();
            updateMarkers();
        });
        $('.btn.apply').click(function () {
            let s = [];
            console.log("selected", selected);
            Object.values(markers).forEach(item => {
                if (selected[item.SensorID]) {
                    s.push(item.SensorID);
                }
            });

            let req = {
                DriverID: driverID,
                Sensors: s
            };
            console.log("req", req);
            $.post('/api/assign-driver', req, function (data) {
                if (data.success) {
                    console.log('success');
                    showMessage('Message', 'Driver is assigned!');
                    // location.href = "/dumpster/" + data.sensor.SensorID;
                    showDumpsters();
                } else {
                    console.log(data.error);
                    showMessage('Error', data.error, 'Error');
                }
            });

            selection = false;
            selected = {};
            $('.select-dumpsters').hide();
            updateMarkers();

        });
    });

    fetch('/api/drivers', {
        method: 'get',
    })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            console.log(data);
            $.each(data, function (i, item) {
                $('#driver').append($('<option>', {
                    value: item.UserID,
                    text: item.FirstName + ' ' + item.LastName
                }));
            });
        })
        .catch((err) => console.log(err));

}
