
$(document).ready(function(){

	//Decided to practice using closures
	var music = function(){
		var apiKey = '697800e6a9fe10f5c42eab30c9ef6cb4';
		var format = 'json';
		var artists=[];
		var response;
		var score = 0;
		var lives = 3;

		return{
			//Calls ajax request that
			//accepts additional ajax parameters
			//an index used for a callback
			//and a callback function referred
			//to as parse
			getResponse: function(ajaxParams,callIndex,parse){
				ajaxParams.api_key = apiKey;
				ajaxParams.format = format;
				$.ajax({
					url: 'http://ws.audioscrobbler.com/2.0/',
					type: 'GET',
					data: ajaxParams,
					dataType: 'jsonp',
					success: function(response) {
						parse(response,callIndex);
					}
				});
			},
			//Adds similar artists to the ones
			//in the artist array.
			getSimilarArtists:function(){
				for (var i = 0; i< artists.length; i++){

					//quick hack to get music.generate to work after the last ajax call.
					//had issues with asynchronouse calls, so used an if statement
					//to call additional parameters once all previous
					//api calls in the loop are made.
					// I encounter a similar situation when I call generate()
					// but I fix this problem by using the 'callIndex' parameter
					if (i === artists.length -1 ){
						this.getResponse({'artist':artists[i],'method':'artist.getsimilar'},i,function(response){
							
							//Get random number between 1 and the number of albums
							//the artist has (not inclusive)
							var numArtists = response.similarartists.artist.length;
							var randomNum = _.random(1,numArtists-1);
							var artist = response.similarartists.artist[randomNum].name;
							
							//Loop to make sure we only add unique artists
							//that haven't been added before
							while (artists.indexOf(artist) === -1){
								if (artists.indexOf(artist) !== -1){
									//if artist already exists, get another random artist.
									//Will make a note to improve this in case next artist
									//is also not unique
									randomNum = randomNum = _.random(1,numArtists-1);
									artist = response.similarartists.artist[randomNum].name;
									
								}

								music.addArtist(artist);


							}

							//generate data and display on callback
							music.generate(function(){
								music.display();
							});
						
						});
					}
					else{
						this.getResponse({'artist':artists[i],'method':'artist.getsimilar'},i,function(response){
							
						
							//Get random number between 1 and the number of albums
							//the artist has (not inclusive)							
							var numArtists = response.similarartists.artist.length;
							var randomNum = _.random(1,numArtists-1);
							var artist = response.similarartists.artist[randomNum].name;

							//Loop to make sure we only add unique artists
							//that haven't been added before							
							while (artists.indexOf(artist) === -1){
								if (artists.indexOf(artist) !== -1){
									//if artist already exists, get another random artist.
									//Will make a note to improve this in case next artist
									//is also not unique									
									randomNum = randomNum = _.random(1,numArtists-1);
									artist = response.similarartists.artist[randomNum].name;
					
								}
								music.addArtist(artist);
								music.shuffleArtists();
							}
						
						});
					}
				}	
			},
			//adds artist to array
			addArtist: function(artist){
				artists.push(artist);
			},
			//returns artists in array
			getArtists: function(){
				return artists;
			},
			//shuffles order of artist array
			shuffleArtists: function(){
				artists = _.shuffle(artists);
			},
			//removes all artists from array
			clearArtists: function(){
				artists = [];

			},
			//generates data for trivia
			//by making multiple ajax calls
			generate: function( display){
				
				var randNum;
				var albumArtistMap = [];
				var randArtists = [];


				//pick 4 random artists
				while (randArtists.length < 4){
					
					randNum = _.random(1,this.getArtists().length-1);

					//if unique random number, add to array and artist-album map
					if (randArtists.indexOf(this.getArtists()[randNum]) === -1){
						randArtists.push(this.getArtists()[randNum]);
						albumArtistMap.push({'artist':this.getArtists()[randNum]});
					}
					
				}




				//ajax call for each random artist in map to get album
				for (var i = 0; i< albumArtistMap.length; i++){

					var artist = albumArtistMap[i].artist;
					//ajax call for each random number to get album name
					this.getResponse({'artist':artist,'method':'artist.gettopalbums'},i, function(response, callIndex){

						//pick random album and save into an array

						//if there is no 'album' field then ignore ajax request
						if (response.topalbums.hasOwnProperty('album')){
							var numAlbums = response.topalbums.album.length;
							randNum = _.random(1,numAlbums-1);
							
							albumArtistMap[callIndex].album = response.topalbums.album[randNum].name;
							
						}
						if (callIndex === albumArtistMap.length -1 ){
							
							//save question, answer and albumArtistMap
							trivia.setCurrentQuestion(albumArtistMap[callIndex].artist);
							trivia.setCurrentAnswer(albumArtistMap[callIndex].album);
							trivia.addTriviaMap(albumArtistMap);
						}

						//call display callback
						display();
					
					});						
					
					
				}
			},
			//Displays data onto the html
			display: function(){
				trivia.shuffleTriviaMap();

				//remove classes from previous question
				$('li').removeClass('correct');
				$('li').removeClass('incorrect');

				$('.score').empty().append(music.getScore());

				//display question
				$('.question').empty().append(trivia.getCurrentQuestion());

				for (var i = 0; i< trivia.getTriviaMap().length;i++){
					$('.choice'+(i+1)).empty().append(trivia.getTriviaMap()[i].album);
				}

			},
			//adds 5 points to score
			updateScore: function(){
				score= score + 5;
			},
			//returns the score
			getScore: function(){
				return score;
			},
			//sets the score to 0
			resetScore: function(){
				score = 0;
			},
			//reduces user 'lives' by 1
			//on the screen and in variable
			loseLife: function(){
				$('.lives-icon'+lives).fadeOut();
				lives--;
			},
			//returns the number of lives
			getLives: function(){
				return lives;
			},
			//resets lives to 0,
			//and resets any hidden lives on screen
			resetLives: function(){
				$( ".life" ).each(function( index ) {
					$(this).fadeIn();
				});
				lives = 3;
			},
			//init function that begins the process
			init: function(artist1,artist2,artist3){
				music.addArtist(artist1);
				music.addArtist(artist2);
				music.addArtist(artist3);

				music.getSimilarArtists();

			},
		};

	}();

	//displays initial user view
	$('.quiz').hide();
	$('.results').hide();

	//user submits form
	$( "form" ).on( "submit", function( event ) {
  		event.preventDefault();
  		music.init($('.artist1').val(),$('.artist2').val(),$('.artist3').val());
  		$('.user-input').fadeOut();
  		$('.quiz').fadeIn();

	});

	//clicking on choice
	$('.quiz li').on('click',function(){
		// check answer
		var isCorrect = trivia.verifyChoice($(this).text());

		if (isCorrect){
			$(this).addClass('correct');
			music.updateScore();


			
		}else{
			$(this).addClass('incorrect');
			music.loseLife();
			if (music.getLives() === 0){
				$('.quiz').hide();
				$('.results').fadeIn();
				$('.results').append('<p>Final Score: ' + music.getScore()+ ' </p>');



			}
		}
		//get next question
		//by regenerating
		music.generate(function(){
			music.display();
		});

	});

	//user hits 'Start Over'
	$('.restart').on('click',function(){
		music.resetScore();
		music.resetLives();
		music.clearArtists();
		$('.quiz').fadeOut();
		$('.results').fadeOut();
		$('.user-input').fadeIn();



	});


});