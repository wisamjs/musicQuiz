//Giving closures a try. Loving it.

var trivia = function() {
	var allQuestions = ['{artist} produced the album:','Which artist created the album {album}?'];
  	var currentTrivia={'question':'produced the album:'};
  	var triviaChoices=[];
  	var triviaMap = [];

  return {
  		getCurrentQuestion: function() {
  			return currentTrivia.question;
  		},
		//returns placeholder for currentQuestion
		getPlaceholder: function(){
			var currQuestion = this.getCurrentQuestion();
			return currQuestion.substring(currQuestion.indexOf('{'),currQuestion.indexOf('}')+1);
		},
		getCurrentAnswer: function(){
			return currentTrivia.answer;
		},
		setCurrentAnswer: function(answer){
			currentTrivia.answer=answer;
		},
		//sets currentQuestion
		setCurrentQuestion: function(artist) {
			currentTrivia.question = artist + ' '+ 'produced the album:';
		},
		//resets the currentQuestion to 
		//its original placeholder form
		reset: function(){
			currentTrivia.question = allQuestions[0];
		},
		//replaces placeholder with the value
		addTriviaMap: function(obj){
			triviaMap = obj;
		},
		getTriviaMap: function(obj){
			return triviaMap;
		},
		shuffleTriviaMap: function(){
			triviaMap = _.shuffle(triviaMap);
		},
		//check if choice is correct
		verifyChoice: function(choice){
			if (trivia.getCurrentAnswer() === undefined){
				console.log('ERROR UNDEFINED');
			}
			var userSubmitted = trivia.getCurrentAnswer() === choice;
			return userSubmitted;

		}
  };
}();