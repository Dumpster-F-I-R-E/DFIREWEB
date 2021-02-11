/* eslint-disable no-undef */
let map;

// eslint-disable-next-line no-unused-vars
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 51.05011, lng: -114.08529 },
        zoom: 15,
    });

    google.maps.event.addListener(map, 'idle', showDumpsters);
}

let defaultIcon = '/icons/trash.png';
let selectedIcon = '/icons/trash_blue.png';
let fullIcon = '/icons/trash_red.png';
let depoIcon = '/icons/depot.png';


function drawDepot(depot) {

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
  
    
    marker.addListener('mouseover', () => {
        infowindow.open(map, marker);
    });

    marker.addListener('mouseout', () => {
        infowindow.close();
    });
}





function addMarker(dumpster, map) {
    // The marker, positioned at Uluru
    let lat = dumpster.Latitude;
    let lng = dumpster.Longitude;
    const marker = new google.maps.Marker({
        position: { lat: lat, lng: lng },
        map: map,
        icon: defaultIcon,
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

    if (dumpster.FullnessLevel == 100) {
        marker.setIcon(fullIcon);
    };
    const infowindow = new google.maps.InfoWindow({
        content: contentString,
    });

    marker.addListener('click', () => {
        window.location = '/dumpster/' + dumpster.DumpsterID;
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
