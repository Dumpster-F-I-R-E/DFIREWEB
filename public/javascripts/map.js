/* eslint-disable no-undef */
let map;

// eslint-disable-next-line no-unused-vars
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 51.05011, lng: -114.08529 },
        zoom: 12,
    });

    google.maps.event.addListener(map, 'idle', showDumpsters);
}

function addDepot(lat,lng){
    var iconBase = '/images/depot-2.png';

    const marker = new google.maps.Marker({
        position: { lat: lat, lng: lng },
        map: map,
        icon: iconBase
    });
}

function addMarker(dumpster, map) {
    // The marker, positioned at Uluru
    let lat = dumpster.Latitude;
    let lng = dumpster.Longitude;
    const marker = new google.maps.Marker({
        position: { lat: lat, lng: lng },
        map: map,
    });

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
        window.location = '/dumpster/' + dumpster.SensorID;
    });

    marker.addListener('mouseover', () => {
        infowindow.open(map, marker);
    });

    marker.addListener('mouseout', () => {
        infowindow.close();
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
