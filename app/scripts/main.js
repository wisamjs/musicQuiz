//debugging
var test;
var mytest;

$(document).ready(function(){


	var music = function(){
		var apiKey = '697800e6a9fe10f5c42eab30c9ef6cb4';
		var format = 'json';
		//var ajaxParams = {'api_key': apiKey, 'format': 'json'};
		var artists=[];
		var response;
		var score = 0;
		var lives = 3;

		return{
			//calls ajax request
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
			//adds similar artists to the ones provided
			//to the artists array.
			getSimilarArtists:function(){
				for (var i = 0; i< artists.length; i++){

					//quick hack to get music.generate to work after the last ajax call.
					if (i === artists.length -1 ){
						this.getResponse({'artist':artists[i],'method':'artist.getsimilar'},i,function(response){
							
						
							var numArtists = response.similarartists.artist.length;
							var randomNum = _.random(1,numArtists-1);
							var artist = response.similarartists.artist[randomNum].name;
							
							while (artists.indexOf(artist) === -1){
								if (artists.indexOf(artist) !== -1){
									randomNum = randomNum = _.random(1,numArtists-1);
									artist = response.similarartists.artist[randomNum].name;
									
								}
								music.addArtist(artist);
								//music.shuffleArtists();

								music.generate(function(){
									music.display();
								});
							}
						
						});
					}
					else{
						this.getResponse({'artist':artists[i],'method':'artist.getsimilar'},i,function(response){
							
						
							
							var numArtists = response.similarartists.artist.length;
							var randomNum = _.random(1,numArtists-1);
							var artist = response.similarartists.artist[randomNum].name;
							
							while (artists.indexOf(artist) === -1){
								if (artists.indexOf(artist) !== -1){
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
			shuffleArtists: function(){
				artists = _.shuffle(artists);
			},
			//generates data for trivia
			//by making multiple ajax calls
			generate: function( display){
				//pick a randomNum answer.
				//parse api req for answer.

				
				var randNum;
				var albumArtistMap = [];
				var randArtists = [];


				//pick 4 random artists
				while (randArtists.length < 4){
					
					randNum = _.random(1,this.getArtists().length-1);

					//if unique random number, add to array
					if (randArtists.indexOf(this.getArtists()[randNum]) === -1){
						randArtists.push(this.getArtists()[randNum]);
						albumArtistMap.push({'artist':this.getArtists()[randNum]});
					}
					
				}




				//ajax call for each random artist to get album
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
							
							//set current question
							trivia.setCurrentQuestion(albumArtistMap[callIndex].artist);

							//set current answer
							trivia.setCurrentAnswer(albumArtistMap[callIndex].album);

							trivia.addTriviaMap(albumArtistMap);
						}

						display();
					
					});						
					
					
				}
			},
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
			updateScore: function(){
				score= score + 5;
			},
			getScore: function(){
				return score;
			},
			loseLife: function(){
				lives = lives -1;
			},
			init: function(){
				music.addArtist('Led Zeppelin');
				music.addArtist('Pink Floyd');
				music.addArtist('Eagles');
				music.addArtist('Wings');

				music.getSimilarArtists();

			},
		};

	}();

	test = music;
	music.init();

	//clicking on choice
	$('li').on('click',function(){
		// check answer
		var isCorrect = trivia.verifyChoice($(this).text());

		if (isCorrect){
			$(this).addClass('correct');
			music.updateScore();
			console.log('SCORE IS :   ' + music.getScore());


			
		}else{
			$(this).addClass('incorrect');
			music.loseLife();
		}

		music.generate(function(){
			music.display();
		});
		// if correct, change colour to green

		//if incorrect, change colour to red
		//and show correct answer in green



	});


});