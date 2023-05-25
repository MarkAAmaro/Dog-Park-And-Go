

function initMap() {
    var options = {
        zoom:8,
        center:{lat:29.4252,lng:-98.4946}
    }

    var map = new google.maps.Map(document.getElementById("map"), options);

    var marker = new google.maps.Marker({
        position:{lat:29.4260,lng:-98.4861},map:map
    //    icon: image
    });
}


initMap();