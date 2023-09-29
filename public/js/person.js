function toggleFollow(but) {
    if (but.innerHTML === "Follow +") {
        but.innerHTML = "Unfollow"
        but.classList.remove("btn-outline-primary")
        but.classList.add("btn-outline-danger")

        follow();

    } else {
        but.classList.remove("btn-outline-danger")
        but.classList.add("btn-outline-primary")
        but.innerHTML = "Follow +"

        follow();
    }
}

function follow() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "./toggleFollow");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({"removeThisPerson": document.getElementById("pageName").innerHTML}))
}