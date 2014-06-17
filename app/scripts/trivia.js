'use strict';
var trivia = (function() {
	var allQuestions = [ '{artist} produced the album:', 'Which artist created the album {album}?' ],
		currentTrivia = { 'question':'produced the album:' },
		triviaMap = [];

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

		setCurrentQuestion: function(artist) {
			currentTrivia.question = artist + ' '+ 'produced the album:';
		},

		/* resets the currentQuestion to
		its original placeholder form */
		reset: function(){
			currentTrivia.question = allQuestions[0];
		},

		//replaces placeholder with the value
		addTriviaMap: function(obj){
			triviaMap = obj;
		},

		getTriviaMap: function(){
			return triviaMap;
		},

		shuffleTriviaMap: function(){
			triviaMap = _.shuffle(triviaMap);
		},

		//check if choice is correct
		verifyChoice: function(choice){
			var userSubmitted;
			if (trivia.getCurrentAnswer() === undefined){
				console.log('ERROR UNDEFINED');
			}
			userSubmitted = trivia.getCurrentAnswer() === choice;
			return userSubmitted;

		}
	};
}());