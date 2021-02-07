/* eslint-disable no-undef */
let map;

// eslint-disable-next-line no-unused-vars
function initMap() {
    directionsService = new google.maps.DirectionsService();

    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 51.05011, lng: -114.08529 },
        zoom: 14,
    });

    map.controls[google.maps.ControlPosition.LEFT_TOP].push
        (document.getElementById('legend'));

    showDumpsters();
    init();
}

function calculateAndDisplayRoute(waypoints, driverId) {
    console.log(waypoints);
    let depot = routes[driverId].Route.Depot;
    let position = {
        lat: depot.Latitude,
        lng: depot.Longitude
    };
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
        routes[driverId].Route.Dumpsters.forEach(s => {
            markers[s.DumpsterID].setOpacity(1.0);
            markers[s.DumpsterID].setAnimation(google.maps.Animation.BOUNCE);

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
        routes[driverId].Route.Dumpsters.forEach(s => {
            markers[s.DumpsterID].setOpacity(markers[s.DumpsterID].defaultOpacity);
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
        '<p>' + depot.Name + '<br>' + depot.Address + '</p>' +
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

function drawRoute(points, driverId) { 

    let driver = routes[driverId].Driver;

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

    var line2 = new google.maps.Polyline(
        {
            path: points,
            strokeColor: color,
            strokeOpacity: 0.001,
            strokeWeight: 20,
            map: map
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
        opacity: opacity
    });
    marker.defaultOpacity = opacity;
    marker.DumpsterID = dumpster.DumpsterID;
    markers[dumpster.DumpsterID] = marker;
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
        .then(res => res.json())
        .then(data => {
            dumpsters = data.Dumpsters;
            routes = data.Routes;
            draw();
        });

    fetch('/api/depots', {
        method: 'get',
    })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            console.log("Finished fetching depots");
            data.forEach((depot) => {
                drawDepot(depot);
            });
        })
        .catch((err) => console.log(err));

}

function clear() {
    Object.values(markers).forEach(i => i.setMap(null));
    Object.values(depots).forEach(i => i.marker.setMap(null));
}

function draw() {
   

    for (let driverId in routes) {

        let waypoints = routes[driverId].Route.Dumpsters.map(d => {
            dumpsters[d.DumpsterID].DriverID = driverId;
            return {
                location: {
                    lat: d.Latitude,
                    lng: d.Longitude
                },
                stopover: true,
            };

        });

        calculateAndDisplayRoute(waypoints, driverId);

    }

    let sensorData = Object.values(dumpsters);
    sensorData.forEach(element => {
        addMarker(element);
    });

    drawLegend();
}

function drawLegend() {
    var legend = document.getElementById('legend');
    legend.innerHTML = '';
    for (var driver in routes) {
        var name = routes[driver].Driver.FirstName + ' ' + routes[driver].Driver.LastName;
        var color = stringToColour(name);
        var div = document.createElement('div');
        console.log(driver, name);
        div.innerHTML = '<div class=\'dot\' style="background-color:' + color + '"></div>' + name;
        legend.appendChild(div);
    }

}

function updateMarkers() {
    Object.values(markers).forEach(item => {
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
                if (selected[item.DumpsterID]) {
                    s.push(item.DumpsterID);
                }
            });

            let req = {
                DriverID: driverID,
                Dumpsters: s
            };
            console.log("req", req);
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
