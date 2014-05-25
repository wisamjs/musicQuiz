//debugging
var test;

$(document).ready(function(){

	var music = function(){
		var apiKey = '697800e6a9fe10f5c42eab30c9ef6cb4';
		var format = 'json';
		//var ajaxParams = {'api_key': apiKey, 'format': 'json'};
		var artists=[];
		var response;

		return{
			//calls ajax request
			getResponse: function(ajaxParams,parse){
				ajaxParams.api_key = apiKey;
				ajaxParams.format = format;
				$.ajax({
					url: 'http://ws.audioscrobbler.com/2.0/',
					type: 'GET',
					data: ajaxParams,
					dataType: 'jsonp',
					success: function(response) {
						parse(response);
					}
				});
			},
			//adds similar artists to the ones provided
			//to the artists array.
			getSimilarArtists:function(){
				for (var i = 0; i< artists.length; i++){
					this.getResponse({'artist':artists[i],'method':'artist.getsimilar'},function(response){
						
					
						console.log(response);
						var numArtists = response.similarartists.artist.length;
						var randomNum = _.random(1,numArtists);
						var artist = response.similarartists.artist[randomNum].name;
						
						while (artists.indexOf(artist) === -1){
							if (artists.indexOf(artist) !== -1){
								randomNum = randomNum = _.random(1,numArtists);
								artist = response.similarartists.artist[randomNum].name;
								console.log(artist);
							}
							music.addArtist(artist);
							//music.shuffleArtists();
						}
					
					});
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
			generate: function(placeholder){
				//pick a randomNum answer.
				//parse api req for answer.

				var numArtists = music.getArtists().length;
				
				//a random artist index that will hold the right answer
				var randAnswerNum = _.random(1,numArtists);
				//array of wrong 'answer' artist indexes
				var randwrongAnswerNums=[];




				trivia.setCurrentAnswer(artists[randAnswerNum]);
				console.log(trivia.getCurrentAnswer());

				this.getResponse({'artist':trivia.getCurrentAnswer(),'method':'artist.gettopalbums'},function(response){
					var numAlbums = response.topalbums.album.length;
					randNum = _.random(1,numAlbums);
					console.log('We picked album ' + randNum + ' called ' + response.topalbums.album[randNum].name);

					//boolean for loop
					var isDone = false;

					while (randwrongAnswerNums.length !== 3){
						randNum = _.random(1,numArtists);

						//if random number hasn't been used before
						if (randNum != randAnswerNum && randwrongAnswerNums.indexOf(randNum) === -1){

							trivia.addTriviaChoice(music.getArtists()[randNum]);
							randwrongAnswerNums.push(randNum);

						}
					}
					console.log(randwrongAnswerNums);


				});

			},
			init: function(){
				music.addArtist('Led Zeppelin');
				music.addArtist('Pink Floyd');
				music.addArtist('Eagles');
				music.addArtist('Boston');

				music.getSimilarArtists(music.generate());
			}
		};

	}();

	test = music;
	music.init();
	$('li').each(function(i){
		console.log(trivia.getTriviaChoices()[i]);

	});

});