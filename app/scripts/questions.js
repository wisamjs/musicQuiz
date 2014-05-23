//Giving closures a try. Loving it.

var questions = function() {
  var allQuestions = ['Which artist created the album {album}?'];
  var currentQuestion='Which artist created the album {album}?';

  return {
    get: function() {
      return currentQuestion;
    },

    set: function(album) {
      this.replace(album,'{album}');
    },

    reset: function(){
      currentQuestion = allQuestions[0];
    },
    replace: function(value,placeholder){
      currentQuestion = currentQuestion.substring(0,currentQuestion.indexOf(placeholder))+
      value+currentQuestion.substring(currentQuestion.indexOf(placeholder)+placeholder.length,currentQuestion.length);
    }
  };
}();

/*
* Which artist created album 'X'?
* When was the album {X}' created?
* True or False: Song 'Y' from Artist 'Z' is in Album 'X'?
*/

//keep track of questions
//current question