/* eslint-disable no-undef */
let map;

// eslint-disable-next-line no-unused-vars
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 51.05011, lng: -114.08529 },
        zoom: 12,
    });

    // google.maps.event.addListener(map, 'idle', showDumpsters);
    drawOnMap();
}

function addMarker(dumpster, map) {
    // The marker, positioned at Uluru
    let lat = dumpster.lat;
    let lng = dumpster.lng;
    const marker = new google.maps.Marker({
        position: { lat: lat, lng: lng },
        map: map,
    });

    const contentString =
        '<div id="body">' +
        '<p>Fullness: ' +
        dumpster.fullness +
        '%<br>' +
        'Battery: ' +
        dumpster.battery +
        '%<br></p>' +
        '</div>';

    const infowindow = new google.maps.InfoWindow({
        content: contentString,
    });

    marker.addListener('click', () => {
        window.location = '/dumpster/' + dumpster.id;
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

function similar(latLng1, latLng2){
    const variation = 0.005 * 2**(12-map.zoom);
    if(Math.abs(latLng1.lat -latLng2.lat) < variation && Math.abs(latLng1.lng -latLng2.lng) < variation){
        return true;
    }
    return false;
}

const colors = [
    '#2980B9',
    '#D35400',
    '#16A085',
    '#34495E',
    '#8E44AD'
];
var counter = 0;
var color = colors[counter];

function clickOnMap(latLng){
    console.log(latLng);
     // Construct the polygon.  
     if(coords.length > 1 && similar(latLng,coords[0])){
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
    }else{
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
        
        let radius = 200 * 2**(12-map.zoom);
        let strokeColor = color;
        if (coords.length == 0 ){
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
