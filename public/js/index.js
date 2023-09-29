function login() {

    let username = document.getElementById("loginUsername").value;
    let password = document.getElementById("loginPassword").value;

    user = {"username" : username, "password" : password};
    user = JSON.stringify(user);

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {


            window.open('/',"_self");

        }
    }

    xhttp.open("POST", "/");
    xhttp.setRequestHeader("Content-type", "application/json")
    xhttp.send(user);

    document.getElementById("loginUsername").value = "";
    document.getElementById("loginPassword").value = "";

}
/*
function signUp() {    

    username = document.getElementById("username").value;
    password = document.getElementById("password").value;

    document.getElementById("username").value = "";
    document.getElementById("password").value = "";

    user = {"username":username, "password":password, "reviews":[]};
    user = JSON.stringify(user);

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://localhost:3000/index/"+user);
    xhttp.send(JSON.stringify(user));

}*/