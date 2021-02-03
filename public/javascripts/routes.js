/* eslint-disable no-undef */
let map;

// eslint-disable-next-line no-unused-vars
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 51.05011, lng: -114.08529 },
        zoom: 12,
    });
    showDumpsters();
    init();
}

let selection = false;
let selected = {};
let markers = {};
let defaultIcon = '/icons/trash.png';
let selectedIcon = '/icons/trash_blue.png';
let fullIcon = '/icons/trash_red.png';


function highlightRoute(sensorId) {
    markers[sensorId].setOpacity(1.0);
    Object.keys(routes).forEach(d => {
        if (routes[d].includes(sensorId)) {
            routes[d].forEach(s => {
                markers[s].setOpacity(1.0);
            });
        }
    });
}

function setOpacity() {
    Object.values(markers).forEach(
        m => {
            if (selection && selected[m.SensorID]) {
                ;
            } else {
                m.setOpacity(m.defaultOpacity);
            }

        }
    );
}


function addMarker(dumpster, map) {

    let lat = dumpster.Latitude;
    let lng = dumpster.Longitude;
    const marker = new google.maps.Marker({
        position: { lat: lat, lng: lng },
        map: map,
        icon: defaultIcon,
        opacity: 0.3
    });
    marker.defaultOpacity = 0.3;
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
        highlightRoute(dumpster.SensorID);
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

function draw() {
    let sensorData = Object.values(sensors);

    sensorData.forEach(element => {
        addMarker(element, map);
    });
    let routesKey = Object.keys(routes);
    routesKey.forEach(element => {
        drawLine(routes[element].map(k => sensors[k]), drivers[element]);
    });
}

let driverID = 0;
let driverName = '';

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



function drawLine(nodes, driver) {
    let color = stringToColour(driver.FirstName + driver.LastName);
    console.log("Coords", nodes);
    nodes.forEach(sensor => {
        markers[sensor.SensorID].setOpacity(0.7);
        markers[sensor.SensorID].defaultOpacity = 0.7;
    });
    let coords = nodes.map(node => {
        return {
            lat: node.Latitude,
            lng: node.Longitude
        };
    });

    const line = new google.maps.Polyline({
        path: coords,
        geodesic: true,
        strokeColor: color,
        strokeOpacity: 1.0,
        strokeWeight: 5,
    });
    line.setMap(map);

    const contentString =
        '<div id="body">' +
        '<p>'+ driver.FirstName +' '+ driver.LastName +'</p>' +
        '</div>';

    const infowindow = new google.maps.InfoWindow({
        content: contentString,
    });


    google.maps.event.addListener(line,'mouseover', (e) => {

        line.setOptions({ strokeColor: '#ff0000' });
        infowindow.setPosition(e.latLng); 
        infowindow.open(map);
    });

    line.addListener('mouseout', () => {

        line.setOptions({ strokeColor: color });
        infowindow.close();
    });

}


function init() {
    $(document).ready(function () {
        $('.btn.assign-driver').click(function () {
            $('.background').toggle();
        });

        $('.btn.next').click(function () {
            driverID = $('#driver').val();
            driverName = $('#driver option:selected').text().trim();
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
