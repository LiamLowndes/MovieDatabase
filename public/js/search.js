function search() {
    
    query = '?';

    if (document.getElementById("title")) {
        if (document.getElementById("title").value.length > 0) {
            query += "&title=" + document.getElementById("title").value;
        }
    } 

    if (document.getElementById("genre")) {
        if (document.getElementById("genre").value.length > 0) {
            query += "&genre=" + document.getElementById("genre").value;
        }
    } 
    
    if (document.getElementById("name")) {
        if (document.getElementById("name").value.length > 0) {
            query += "&name=" + document.getElementById("name").value;
        }
    }
    
    if (document.getElementById("year")) {
        if (document.getElementById("year").value.length > 0) {
            query += "&year=" + document.getElementById("year").value;
        }
    } 
    
    if (document.getElementById("minRating")) {
        if (document.getElementById("minRating").value.length > 0) {
            query += "&minrating=" + document.getElementById("minRating").value;
        }
    }
    
    if (document.getElementById("limit")) {
        if (document.getElementById("limit").value.length > 0) {
            query += "&limit=" + document.getElementById("limit").value;
        }
    }


    window.open(query,"_self");

};