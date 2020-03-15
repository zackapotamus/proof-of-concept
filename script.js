$(document).ready(function() {
    var myMap = L.map('mapid').setView([33.7490, 84.3880], 13);
    var myLat, myLong;
    var myCity, myState;
    var responseDataEl = document.getElementById("response-data");
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoiZnVua2Fwb3RhbXVzIiwiYSI6ImNrN3RrZ3I0ZzBhZG0zZXAwcDE2cWJ0ZW8ifQ.Lo81UrYUl6eRUmh3MxzO6g'
    }).addTo(myMap);

    $.ajax({
        url: "http://ipinfo.io",
        method: "GET",
        data: {token: "d31c84f34635a4"}
    }).then(function(response) {
        console.log(response);
        responseDataEl.textContent += `${JSON.stringify(response, null, 2)}\n`;
        //console.log(JSON.stringify(response, null, 2))
        var latLong = response.loc.split(",");
        myLat = parseFloat(latLong[0]);
        myLong = parseFloat(latLong[1]);
        myMap.setView([myLat, myLong], 13);
        $.ajax({
            url: "https://api.openbrewerydb.org/breweries",
            method: "GET",
            data: {by_city: response.city, by_state: response.region, per_page: 50}
        }).then(function(response) {
            console.log(response)
            responseDataEl.textContent += `${JSON.stringify(response, null, 2)}\n`;
            //console.log(JSON.stringify(response, null, 2));
        });
    });
});