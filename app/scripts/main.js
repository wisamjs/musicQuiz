//debugging
var test;

$(document).ready(function(){

	var app = function(){
		return {
			display:function(){
				//display title
				//display img
				//display list elements
				//display title
			}

		};

	};

	var music = function(){
		var apiKey = '697800e6a9fe10f5c42eab30c9ef6cb4';
		var format = 'json';
		//var ajaxParams = {'api_key': apiKey, 'format': 'json'};
		var artists=[];
		var response;

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
							
						
							console.log(response);
							var numArtists = response.similarartists.artist.length;
							var randomNum = _.random(1,numArtists-1);
							var artist = response.similarartists.artist[randomNum].name;
							
							while (artists.indexOf(artist) === -1){
								if (artists.indexOf(artist) !== -1){
									randomNum = randomNum = _.random(1,numArtists-1);
									artist = response.similarartists.artist[randomNum].name;
									console.log(artist);
								}
								music.addArtist(artist);
								//music.shuffleArtists();

								music.generate(function(){
									trivia.display();
								});
							}
						
						});
					}
					else{
						this.getResponse({'artist':artists[i],'method':'artist.getsimilar'},i,function(response){
							
						
							console.log(response);
							var numArtists = response.similarartists.artist.length;
							var randomNum = _.random(1,numArtists-1);
							var artist = response.similarartists.artist[randomNum].name;
							
							while (artists.indexOf(artist) === -1){
								if (artists.indexOf(artist) !== -1){
									randomNum = randomNum = _.random(1,numArtists-1);
									artist = response.similarartists.artist[randomNum].name;
									console.log(artist);
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


				console.log(albumArtistMap);


				//ajax call for each random artist to get album
				for (var i = 0; i< albumArtistMap.length; i++){
					var artist = albumArtistMap[i].artist;
					//ajax call for each random number to get album name
					this.getResponse({'artist':artist,'method':'artist.gettopalbums'},i, function(response, callIndex){

						console.log(response);
						//pick random album and save into an array

						//if there is no 'album' field then ignore ajax request
						if (response.topalbums.hasOwnProperty('album')){
							var numAlbums = response.topalbums.album.length;
							randNum = _.random(1,numAlbums-1);
							
							albumArtistMap[callIndex].album = response.topalbums.album[randNum].name;
							trivia.addTriviaChoice(albumArtistMap[callIndex].album);
							
						}
						if (callIndex === albumArtistMap.length -1 ){

							//we have albums and artists
							// pick the winner
							//update on trivia

							trivia.setCurrentQuestion(albumArtistMap[0].artist);
							trivia.setCurrentAnswer(albumArtistMap[0].album);
						}

						display();
					
					});						
					
					
				}
			},
			init: function(generate){
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
		//change colour
		$(this).css('background','red');

	});



});