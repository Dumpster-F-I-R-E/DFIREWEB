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

    const marker2 = new google.maps.Marker({
        position: { lat: 51.10011, lng: -114.08529 },
        map: map,
    });
    // map.addListener('idle', function () {
       
    // });

    const contentString =  
    '<div id="body">' +
    '<p>Fullness: 50%<br>'+
    'Battery: 80%<br>' +
    'Location: Cityhall</p>'+
    "</div>";

  const infowindow = new google.maps.InfoWindow({
    content: contentString,
  });

  
  marker.addListener("click", () => {
    window.location = '/dumpster/1';
  });


  marker.addListener("mouseover", () => {
    infowindow.open(map, marker);
  });

  marker.addListener("mouseout", () => {
    infowindow.close();
  });


}

function addMarker(lat1, lng1) {
    // The marker, positioned at Uluru
    const marker = new google.maps.Marker({
        position: { lat: lat1, lng: lng1 },
        map: map,
    });

    
}