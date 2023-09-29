function search(){
    window.open("http://localhost:3000/search","_self");
}

function submit() {

    newMovie = {}

    newMovie.Poster = document.getElementById("poster").value
    newMovie.Plot = document.getElementById("summary").value
    newMovie.Title = document.getElementById("movieName").value
    newMovie.Year = document.getElementById("year").value

    newMovie.Director = document.getElementById("director").value
    newMovie.imdbRating = document.getElementById("imdbScore").value
    newMovie.Actors = document.getElementById("actors").value
    newMovie.Writer = document.getElementById("writers").value
    newMovie.Awards = document.getElementById("awards").value
    newMovie.Genre = document.getElementById("genre").value
    
    

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
    
            if (this.readyState == 4 && this.status == 200) {
                alert(xhttp.responseText);
            }
        }

    xhttp.open("POST", "/movies");
    xhttp.setRequestHeader("Content-type", "application/json")
    xhttp.send(JSON.stringify(newMovie));

    document.getElementById("poster").value = "";
    document.getElementById("summary").value = "";
    document.getElementById("movieName").value = "";
    document.getElementById("year").value = "";

    document.getElementById("director").value = "";
    document.getElementById("imdbScore").value = "";
    document.getElementById("actors").value = "";
    document.getElementById("writers").value = "";
    document.getElementById("awards").value = "";
    document.getElementById("genre").value = "";  
}