class Beverage {
    constructor(name, date_added, type, rating) {
        this._name = name;
        this._type = type || "";
        this.rating = rating;
        this.date = date_added || moment().now();
    }
    setRating(rating) {
        this._rating = rating < 1 ? 1 : rating > 5 ? 5 : rating;
    }
    set rating(value) {
        this.setRating(value);
    }
    get rating() {
        return this._rating;
    }
    get type() {
        return this._type;
    }
    set type(value) {
        this._type = value;
    }
}

class Brewery {
    constructor(name, date_added, rating, beverages) {
        this._name = name;
        this._beverages = beverages || [];
        this._rating = rating;
        this.date = date_added || moment().now();
    }
    setRating(rating) {
        this._rating = rating < 1 ? 1 : rating > 5 ? 5 : rating;
    }
    addBeverage(beverage) {
        this._beverages.push(beverage);
    }
    removeBeverage(beverage_name) {
        var ret = null;
        for (var i = 0; i < this._beverages.length; i++) {
            if (this._beverages[i].name === beverage_name) {
                ret = this._beverages.splice(i, 1);
                break;
            }
        }
        return ret;
    }
    removeBeverageAtIndex(index) {
        return this._beverages.splice(index, 1);
    }
    get beverages() {
        return this._beverages;
    }
}

class Profile {
    constructor(name, date_created, breweries) {
        this._name = name;
        this._breweries = breweries || [];
        this._date = date_created || moment.now();
    }
    get name() {
        return this._name;
    }
    set name(value) {
        this._name = value;
    }
    get date() {
        return this._date;
    }
    set date(value) {
        this._date = value;
    }
    get beverages() {
        return this._beverages;
    }
    addBrewery(brewery) {
        this._breweries.push(brewery);
    }
    removeBrewery(brewery_name) {
        for (var i = 0; i < this._breweries.length; i++) {
            if (this._breweries[i].name === brewery_name) {
                return this._breweries.splice(i, 1);
            }
        }
    }
    removeBreweryAtIndex(index) {
        return this._breweries.splice(index, 1);
    }
}

$(document).ready(function() {
    var myMap = L.map('mapid').setView([33.7490, 84.3880], 12);
    var myLat, myLong;
    var myCity, myState;
    var markers = [];
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
        url: "https://ipinfo.io",
        method: "GET",
        data: {token: "d31c84f34635a4"}
    }).then(function(response) {
        console.log(response);
        responseDataEl.textContent += `${JSON.stringify(response, null, 2)}\n`;
        //console.log(JSON.stringify(response, null, 2))
        var latLong = response.loc.split(",");
        myLat = parseFloat(latLong[0]);
        myLong = parseFloat(latLong[1]);
        myCity = response.city;
        myState = response.region;
        myMap.setView([myLat, myLong], 12);
        $.ajax({
            url: "https://api.openbrewerydb.org/breweries",
            method: "GET",
            data: {by_city: myCity, by_state: myState, per_page: 50}
        }).then(function(response) {
            console.log(response);
            responseDataEl.textContent += `${JSON.stringify(response, null, 2)}\n`;
            for (var i=0; i < response.length; i++) {
                // does it have lat/long?
                if (!response[i].longitude) continue;

                var marker = L.marker([parseFloat(response[i].latitude), parseFloat(response[i].longitude)]).addTo(myMap);
                marker.bindPopup(`<strong>${response[i].name}</strong><br>${response[i].brewery_type}`).openPopup();
                markers.push(marker);
            }
        });
    });
});