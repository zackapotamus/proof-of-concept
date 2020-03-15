$(document).ready(function() {
    $.ajax({
        url: "http://ipinfo.io",
        method: "GET",
        data: {token: "d31c84f34635a4"}
    }).then(function(response) {
        console.log(response);
    });
});