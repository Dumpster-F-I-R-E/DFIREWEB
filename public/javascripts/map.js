let map;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 51.05011, lng: -114.08529 },
        zoom: 12,
    });
    const marker = new google.maps.Marker({
        position: { lat: 51.05011, lng: -114.08529 },
        map: map,
    });
    // map.addListener('idle', function () {
       
    // });

}

function addMarker(lat1, lng1) {
    // The marker, positioned at Uluru
    const marker = new google.maps.Marker({
        position: { lat: lat1, lng: lng1 },
        map: map,
    });
}