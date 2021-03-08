//JS structure same as iTunes structure discussed in class

//initial now playing call
ajax("https://api.themoviedb.org/3/movie/now_playing?api_key=0de022a6ca4bc424207ba2b72223a624&language=en-US&page=1", displayResults);

//search call
document.querySelector("#search-form").onsubmit = function(event) {
	event.preventDefault();

	//store search input
	let searchInput = document.querySelector("#search-id").value.trim();

	//create endpoint
	let endpoint = encodeURI("https://api.themoviedb.org/3/search/movie?api_key=0de022a6ca4bc424207ba2b72223a624&language=en-US&query=" + searchInput + "&page=1");

	//call ajax
	ajax(endpoint, displayResults);

}
function ajax(endpoint, returnFunction) {
	let httpRequest = new XMLHttpRequest();
	httpRequest.open("GET", endpoint);
	httpRequest.send();


	httpRequest.onreadystatechange = function(event) {
		event.preventDefault();
		console.log(httpRequest.readyState);

		//when response received
		if( httpRequest.readyState == 4) {
			//if response is successful
			if(httpRequest.status == 200) {
				returnFunction(httpRequest.responseText);
			}
			//if not check
			else {
				console.log(httpRequest.status);
			}

		}

	}
}

function displayResults(results) {
	//clear previous entries
	let movieRow = document.querySelector(".row-cols-2");

	if (movieRow.hasChildNodes()){
		while(movieRow.hasChildNodes()) {
			movieRow.removeChild(movieRow.lastChild);
		}
	}

	let convertedResults = JSON.parse(results);


	let searchResults = document.querySelector("span");
	searchResults.innerHTML = convertedResults.total_results;
	let searchVal = document.querySelector("strong");

	//only show first 20 results
	if (convertedResults.total_results < 20){
		
		searchVal.innerHTML = convertedResults.total_results;
	}
	else {
		searchVal.innerHTML = "20";
	}
	
	//data collection and formation into Bootstrap cards
	for(let i = 0; i < convertedResults.results.length; i++) {

		let column = document.createElement("div");
		column.classList.add("col");
		let movieCard = document.createElement("div");
		movieCard.classList.add("card");
		movieCard.classList.add("h-100");
		column.appendChild(movieCard);

		let moviePic = document.createElement("img");
		if (convertedResults.results[i].poster_path == null){
			moviePic.src = "images/imgNF.png"
		}
		else {
			moviePic.src = "https://image.tmdb.org/t/p/w300" + convertedResults.results[i].poster_path;
			moviePic.alt = convertedResults.results[i].original_title + " Poster";
		}
		
		moviePic.classList.add("card-img-top");
		movieCard.appendChild(moviePic);

		let movieTitle = document.createElement("h4");
		movieTitle.classList.add("card-title");
		movieTitle.innerHTML = convertedResults.results[i].original_title;
		movieCard.appendChild(movieTitle);

		let movieRelease = document.createElement("h6");
		movieRelease.classList.add("card-text");
		movieRelease.innerHTML = convertedResults.results[i].release_date;
		movieCard.appendChild(movieRelease);

		let hoverInfo = document.createElement("div");
		hoverInfo.classList.add("overlay");
		hoverInfo.innerHTML = "Rating: " + convertedResults.results[i].vote_average + " out of 10 <br><br> Numer of votes: " + 
									convertedResults.results[i].vote_count + "<br><br> Synopsis:<br>" + convertedResults.results[i].overview;
		movieCard.appendChild(hoverInfo);

		let movieRow = document.querySelector(".row-cols-2");
		movieRow.appendChild(column);
	}
}



