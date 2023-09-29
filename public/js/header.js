function logout() {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {

            location.reload();
        }
    }

    xhttp.open("GET", "/logout");
    xhttp.setRequestHeader("Content-type", "application/json")
    xhttp.send();
}