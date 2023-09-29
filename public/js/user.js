function toggleEdit(but) {
    if (but.innerHTML === "Edit") {
        but.innerHTML = "Save Changes"
        but.classList.remove("btn-outline-primary")
        but.classList.add("btn-outline-success")

        edit();

    } else {
        but.classList.remove("btn-outline-success")
        but.classList.add("btn-outline-primary")
        but.innerHTML = "Edit"

        saveChanges();

    }
}

function toggleUpgrade(but) {
    if (but.innerHTML === "Become a contributing user") {
        but.innerHTML = "Remove contributing user privileges"
        but.classList.remove("btn-outline-primary")
        but.classList.add("btn-outline-danger")

        document.getElementById("con").innerHTML = "Contributor"

        upgrade();

    } else {

        but.classList.remove("btn-outline-danger")
        but.classList.add("btn-outline-primary")
        but.innerHTML = "Become a contributing user"

        document.getElementById("con").innerHTML = "Normal User"

        upgrade();

    }
}

function toggleFollow(but) {

    if (but.innerHTML === "Follow +") {

        but.innerHTML = "Unfollow"
        but.classList.remove("btn-outline-primary")
        but.classList.add("btn-outline-danger")

        follow();

    } else {

        but.innerHTML = "Follow +"
        but.classList.remove("btn-outline-danger")
        but.classList.add("btn-outline-primary")


        follow();

    }
}

function follow() {

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "./toggleFollow");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({"removeThisPerson": document.getElementById("pageName").innerHTML}));

}

function upgrade() {

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "./toggleCon");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();

}

function edit() {

    bio = document.getElementById("bioText").innerHTML;
    document.getElementById("bioText").remove();
    
    newBio = document.createElement("textarea");
    newBio.value = bio;
    newBio.id = "bioText";
    newBio.className = "editText"

    document.getElementById("bio").appendChild(newBio);

}

function saveChanges() {

    //show new bio on screen

    let bio = document.getElementById("bioText").value;
    document.getElementById("bioText").remove();
    
    newBio = document.createElement("p");
    newBio.innerHTML = bio;
    newBio.id = "bioText";
    newBio.classList.remove = "editText";

    document.getElementById("bio").appendChild(newBio);

    //POST new bio to update database

    //gets the current user ID
    userID = window.location.href.split("/");
    userID = userID[userID.length - 1]

    bio = {"bio": bio}

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "./user/" + userID + "/changeBio");
    xhttp.setRequestHeader("Content-type", "application/json")
    xhttp.send(JSON.stringify(bio));

}