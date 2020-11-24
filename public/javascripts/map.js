let map;

function initMap() {

    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 51.05011, lng: -114.08529 },
        zoom: 12,
    });
 

  google.maps.event.addListener(map, "idle", showDumpsters);
}

function addMarker(dumpster, map) {
    // The marker, positioned at Uluru
    let lat = dumpster.lat;
    let lng = dumpster.lng;
    const marker = new google.maps.Marker({
        position: { lat:lat, lng:lng },
        map: map,
    });

    const contentString =  
    '<div id="body">' +
     '<p>Fullness: '+dumpster.fullness + '%<br>'+
      'Battery: ' + dumpster.battery + '%<br></p>' +
    "</div>";

    const infowindow = new google.maps.InfoWindow({
          content: contentString,
    });


    marker.addListener("click", () => {
      window.location = '/dumpster/' + dumpster.id;
    });
  
  
    marker.addListener("mouseover", () => {
      infowindow.open(map, marker);
    });
  
    marker.addListener("mouseout", () => {
      infowindow.close();
    });
  
  
}


function showDumpsters(){
  fetch('/api/dumpsters', {
    method : 'get'
  }).then((res) => {
    return res.json();
  }).then( (data) => {
    console.log(data);
    data.forEach(dumpster => {
    addMarker(dumpster, map);
  });
}).catch((err) => console.log(err));
}