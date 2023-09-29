function addReview() {

    review = {};
    

    review.movieName = document.getElementById("movieTitle").innerHTML;

    review.score = document.getElementById("smallScore").value;
    review.summary = document.getElementById("theSummary").value;
    review.theReview = document.getElementById("theReview").value;

    document.getElementById("smallScore").value = '';
    document.getElementById("theSummary").value = '';
    document.getElementById("theReview").value = '';


    if ((isNaN(Number(review.score))) || (review.score < 1) || (review.score > 10) || (review.score === '')) {
        alert("Please enter an integer from 1 to 10 for score")
    } else {

        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "./reviews");
        xhttp.setRequestHeader("Content-type", "application/json")
        xhttp.send(JSON.stringify(review));

    }

    console.log(review)

}