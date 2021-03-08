/* eslint-disable no-undef */
let map;

// eslint-disable-next-line no-unused-vars
function initMap() {
    directionsService = new google.maps.DirectionsService();

    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 51.05011, lng: -114.08529 },
        zoom: 14,
    });

    map.controls[google.maps.ControlPosition.LEFT_TOP].push(
        document.getElementById('legend')
    );

    showDumpsters();
    init();
}

function calculateAndDisplayRoute(waypoints, driverId) {
    console.log(waypoints);
    let depot = routes[driverId].Route.Depot;
    let position = {
        lat: depot.Latitude,
        lng: depot.Longitude,
    };
    let origin = {
        lat: depot.Latitude,
        lng: depot.Longitude,
    };
    for (var i in drivers) {
        if (drivers[i].UserID == driverId && drivers[i].Latitude) {
            origin.lat = drivers[i].Latitude;
            origin.lng = drivers[i].Longitude;
        }
    }
    directionsService.route(
        {
            origin: origin,
            destination: position,
            travelMode: google.maps.TravelMode.DRIVING,
            optimizeWaypoints: true,
            waypoints: waypoints,
        },
        (response, status) => {
            if (status === 'OK') {
                console.log(response);
                // directionsRenderer.setDirections(response);
                render(response, driverId);
            } else {
                window.alert('Directions request failed due to ' + status);
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
        lines[driverId].forEach((line) => {
            line.setOptions({
                strokeOpacity: 1.0,
            });
        });
    }

    if (routes[driverId]) {
        routes[driverId].Route.Dumpsters.forEach((s) => {
            markers[s.DumpsterID].setOpacity(1.0);
            markers[s.DumpsterID].setAnimation(google.maps.Animation.BOUNCE);
        });
    }
}

function deselectPath(driverId) {
    if (lines[driverId]) {
        lines[driverId].forEach((line) => {
            line.setOptions({ strokeOpacity: 0.5 });
        });
    }

    if (routes[driverId]) {
        routes[driverId].Route.Dumpsters.forEach((s) => {
            markers[s.DumpsterID].setOpacity(
                markers[s.DumpsterID].defaultOpacity
            );
            markers[s.DumpsterID].setAnimation(null);
        });
    }
}

lines = {};
depots = {};
let depoIcon = '/icons/depot.png';

function drawDepot(depot) {
    depots[depot.DepotID] = depot;
    let lat = depot.Latitude;
    let lng = depot.Longitude;
    const marker = new google.maps.Marker({
        position: { lat: lat, lng: lng },
        map: map,
        icon: depoIcon,
    });
    depot.marker = marker;

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
        infowindow.open(map, marker);
    });

    marker.addListener('mouseout', () => {
        infowindow.close();
    });
}

let allLines = [];

function drawRoute(points, driverId) {
    let driver = routes[driverId].Driver;

    let name = driver.FirstName + ' ' + driver.LastName;
    let color = stringToColour(name);

    var line = new google.maps.Polyline({
        path: points,
        strokeColor: color,
        strokeOpacity: 0.5,
        strokeWeight: 3,
    });

    var line2 = new google.maps.Polyline({
        path: points,
        strokeColor: color,
        strokeOpacity: 0.001,
        strokeWeight: 20,
        map: map,
    });
    allLines.push(line, line2);
    line.setMap(map);
    line.defaultColor = color;

    if (!lines[driverId]) lines[driverId] = [];

    lines[driverId].push(line);

    const contentString = '<div id="body">' + '<p>' + name + '</p>' + '</div>';

    const infowindow = new google.maps.InfoWindow({
        content: contentString,
    });

    google.maps.event.addListener(line2, 'mouseover', (e) => {
        // line.setOptions({ strokeColor: '#ff0000' });
        selectPath(driverId);
        infowindow.setPosition(e.latLng);
        infowindow.open(map);
    });

    line2.addListener('mouseout', () => {
        deselectPath(driverId);
        infowindow.close();
    });
}

let carIcon = '/icons/car.svg';

function drawDriver(driver) {
    let lat = driver.Latitude;
    let lng = driver.Longitude;
    let paths =
        'M 13.75 0 L 8.25 0 C 6.792969 0 5.609375 1.621094 5.609375 3.078125 L 5.609375 19.359375 C 5.609375 20.816406 6.792969 22 8.25 22 L 13.75 22 C 15.207031 22 16.390625 20.816406 16.390625 19.359375 L 16.390625 3.078125 C 16.390625 1.621094 15.207031 0 13.75 0 Z M 15.925781 6.636719 L 15.925781 12.09375 L 14.652344 12.257812 L 14.652344 10.007812 Z M 15.257812 5.039062 C 14.78125 6.863281 14.21875 9.019531 14.21875 9.019531 L 7.78125 9.019531 L 6.738281 5.039062 C 6.742188 5.039062 10.894531 3.628906 15.257812 5.039062 Z M 7.363281 10.15625 L 7.363281 12.257812 L 6.085938 12.09375 L 6.085938 6.785156 Z M 6.085938 17.746094 L 6.085938 12.902344 L 7.363281 13.0625 L 7.363281 16.894531 Z M 6.8125 19.125 L 7.851562 17.5625 L 14.292969 17.5625 L 15.332031 19.125 Z M 14.652344 16.75 L 14.652344 13.066406 L 15.925781 12.898438 L 15.925781 17.601562 Z M 14.652344 16.75 ';
    let color = stringToColour(driver.FirstName + ' ' + driver.LastName);
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
        position: { lat: lat, lng: lng },
        map: map,
        icon: icon,
    });
    driver.marker = marker;

    const contentString =
        '<div id="body">' +
        '<p>' +
        driver.FirstName +
        ' ' +
        driver.LastName +
        '</p>' +
        '</div>';

    const infowindow = new google.maps.InfoWindow({
        content: contentString,
    });

    marker.addListener('mouseover', () => {
        console.log('mouseover car', carIcon);
        infowindow.open(map, marker);
    });

    marker.addListener('mouseout', () => {
        infowindow.close();
    });
}

function drawDrivers(drivers) {
    for (var i in drivers) {
        if (drivers[i].Latitude && drivers[i].Longitude) drawDriver(drivers[i]);
    }
}

let selection = false;
let selected = {};
let markers = {};
let defaultIcon = '/icons/trash.png';
let grayIcon = '/icons/trash_gray.png';
let selectedIcon = '/icons/trash_blue.png';
let fullIcon = '/icons/trash_red.png';

function addMarker(dumpster) {
    let lat = dumpster.Latitude;
    let lng = dumpster.Longitude;
    let opacity = 0.8;
    let icon = grayIcon;
    if (dumpster.DriverID) {
        icon = defaultIcon;
    }
    const marker = new google.maps.Marker({
        position: { lat: lat, lng: lng },
        map: map,
        icon: icon,
        opacity: opacity,
    });
    marker.defaultOpacity = opacity;
    marker.DumpsterID = dumpster.DumpsterID;
    markers[dumpster.DumpsterID] = marker;
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

    marker.addListener('click', () => {
        if (selection) {
            if (selected[marker.DumpsterID]) {
                selected[marker.DumpsterID] = false;
                marker.setIcon(defaultIcon);
            } else {
                selected[marker.DumpsterID] = true;
                marker.setIcon(selectedIcon);
            }
        } else {
            window.location = '/dumpster/' + dumpster.DumpsterID;
        }
    });

    marker.addListener('mouseover', () => {
        selectPath(dumpster.DriverID);
        infowindow.open(map, marker);
    });

    marker.addListener('mouseout', () => {
        deselectPath(dumpster.DriverID);
        infowindow.close();
    });
}

var dumpsters = {};
var routes = {};

function showDumpsters() {
    clear();
    fetch('/api/routes', {
        method: 'get',
    })
        .then((res) => res.json())
        .then((data) => {
            dumpsters = data.Dumpsters;
            routes = data.Routes;
            fetch('/api/drivers', {
                method: 'get',
            })
                .then((res) => {
                    return res.json();
                })
                .then((data) => {
                    drivers = data;
                    drawDrivers(drivers);
                    $('#driver').html('');
                    $.each(data, function (i, item) {
                        $('#driver').append(
                            $('<option>', {
                                value: item.UserID,
                                text: item.FirstName + ' ' + item.LastName,
                            })
                        );
                    });
                })
                .then(() => {
                    draw();
                })
                .catch((err) => console.log(err));
        });

    fetch('/api/depots', {
        method: 'get',
    })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            console.log('Finished fetching depots');
            data.forEach((depot) => {
                drawDepot(depot);
            });
        })
        .catch((err) => console.log(err));
}

function clear() {
    Object.values(markers).forEach((i) => i.setMap(null));
    Object.values(depots).forEach((i) => i.marker.setMap(null));
    Object.values(allLines).forEach((i) => i.setMap(null));
}

function draw() {
    for (let driverId in routes) {
        let waypoints = routes[driverId].Route.Dumpsters.map((d) => {
            dumpsters[d.DumpsterID].DriverID = driverId;
            return {
                location: {
                    lat: d.Latitude,
                    lng: d.Longitude,
                },
                stopover: true,
            };
        });

        calculateAndDisplayRoute(waypoints, driverId);
    }

    let sensorData = Object.values(dumpsters);
    sensorData.forEach((element) => {
        addMarker(element);
    });

    drawLegend();
}

function drawLegend() {
    var legend = document.getElementById('legend');
    legend.innerHTML = '';
    for (var driver in routes) {
        var name =
            routes[driver].Driver.FirstName +
            ' ' +
            routes[driver].Driver.LastName;
        var color = stringToColour(name);
        var div = document.createElement('div');
        console.log(driver, name);
        div.innerHTML =
            "<div class='dot' style=\"background-color:" +
            color +
            '"></div>' +
            name;
        legend.appendChild(div);
    }
}

function updateMarkers() {
    Object.values(markers).forEach((item) => {
        if (selected[item.DumpsterID]) {
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
        var value = (hash >> (i * 8)) & 0xff;
        colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
};

var driverSelect = 0;
function init() {
    $(document).ready(function () {
        let driverID = 0;
        $('.btn.assign-driver').click(function () {
            driverSelect = 0;
            $('.background .title').text('Assign Driver');
            $('.background').toggle();
        });

        $('.btn.clear-driver').click(function () {
            driverSelect = 1;
            $('.background .title').text('Clear Driver');
            $('.background').toggle();
        });

        $('.btn.optimize-routes').click(function () {
            $.get('/routes/optimize', function () {
                window.location = '/routes';
            });
        });
        $('.btn.clear-routes').click(function () {
            $.get('/routes/clear', function () {
                window.location = '/routes';
            });
        });

        $('.btn.next').click(function () {
            driverID = $('#driver').val();
            $('.background').toggle();
            if (driverSelect == 0) {
                console.log('Select Dumpsters');
                $('.select-dumpsters').show();
                $('#map').focus();
                selection = true;
            } else if (driverSelect == 1) {
                console.log('Clear Dumpsters');
                let req = {
                    DriverID: driverID,
                };
                $.post('/api/clear-driver', req, function (data) {
                    if (data.success) {
                        showDumpsters();
                    } else {
                        showMessage('Error', data.error);
                    }
                });
            }
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
            console.log('selected', selected);
            Object.values(markers).forEach((item) => {
                if (selected[item.DumpsterID]) {
                    s.push(item.DumpsterID);
                }
            });

            let req = {
                DriverID: driverID,
                Dumpsters: s,
            };
            console.log('req', req);
            $.post('/api/assign-driver', req, function (data) {
                if (data.success) {
                    console.log('success');
                    showMessage('Message', 'Driver is assigned!');
                    // location.href = "/dumpster/" + data.sensor.DumpsterID;
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
}
