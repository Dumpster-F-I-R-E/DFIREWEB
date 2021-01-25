/* eslint-disable no-undef */
let map;

// eslint-disable-next-line no-unused-vars
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 51.05011, lng: -114.08529 },
        zoom: 12,
    });
    showDumpsters();
    // google.maps.event.addListener(map, 'idle', showDumpsters);
    drawOnMap();
    init();
}

let selection = false;
let selected = {};
let markers = [];
let defaultIcon = 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_red.png';
let selectedIcon = 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_black.png';


function addMarker(dumpster, map) {


    let lat = dumpster.Latitude;
    let lng = dumpster.Longitude;
    const marker = new google.maps.Marker({
        position: { lat: lat, lng: lng },
        map: map,
        icon: defaultIcon,
    });
    marker.SensorID = dumpster.SensorID;
    markers.push(marker);

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

        infowindow.open(map, marker);
    });

    marker.addListener('mouseout', () => {

        infowindow.close();
    });
}

var coords = [];
const polygons = [];

function similar(latLng1, latLng2) {
    const variation = 0.005 * 2 ** (12 - map.zoom);
    if (
        Math.abs(latLng1.lat - latLng2.lat) < variation &&
        Math.abs(latLng1.lng - latLng2.lng) < variation
    ) {
        return true;
    }
    return false;
}

const colors = ['#2980B9', '#D35400', '#16A085', '#34495E', '#8E44AD'];
var counter = 0;
var color = colors[counter];

function clickOnMap(latLng) {
    console.log(latLng);
    // Construct the polygon.
    if (coords.length > 1 && similar(latLng, coords[0])) {
        console.log('Draw Polygon');

        let polygon = new google.maps.Polygon({
            paths: coords,
            strokeColor: color,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: color,
            fillOpacity: 0.35,
        });
        polygon.setMap(map);
        counter = (counter + 1) % colors.length;
        color = colors[counter];
        polygons.push(polygon);
        coords = [];
    } else {
        coords.push(latLng);
    }

    const flightPath = new google.maps.Polyline({
        path: coords,
        geodesic: true,
        strokeColor: color,
        strokeOpacity: 1.0,
        strokeWeight: 2,
    });
    flightPath.setMap(map);
}

function drawOnMap() {
    // Configure the click listener.
    map.addListener('click', (mapsMouseEvent) => {
        latLng = mapsMouseEvent.latLng.toJSON();

        let radius = 200 * 2 ** (12 - map.zoom);
        let strokeColor = color;
        if (coords.length == 0) {
            strokeColor = '#FFFFFF';
        }
        const circle = new google.maps.Circle({
            strokeColor: strokeColor,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: color,
            fillOpacity: 0.35,
            map,
            center: latLng,
            radius: radius,
        });
        circle.addListener('click', () => {
            clickOnMap(circle.center.toJSON());
        });
        clickOnMap(latLng);
    });

}

function showDumpsters() {
    fetch('/api/dumpsters', {
        method: 'get',
    })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            console.log(data);
            data.forEach((dumpster) => {
                addMarker(dumpster, map);
            });
        })
        .catch((err) => console.log(err));
}

let driverID = 0;
let driverName = '';

function updateMarkers() {
    markers.forEach(item => {
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


function drawCircle(marker) {
    console.log('Drawing circles..');
    color = stringToColour(driverName);
    const circle = new google.maps.Circle({
        strokeColor: color,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: color,
        fillOpacity: 0.35,
        map,
        center: marker.getPosition(),
        radius: 2000,
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
            if (e.target == background ){
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
            markers.forEach(item => {
                if (selected[item.SensorID]) {
                    s.push(item.SensorID);
                    drawCircle(item);
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
