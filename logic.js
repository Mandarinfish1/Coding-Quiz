
//variables for Javascript
//Using document.querySelector('#'). Can use document.getElementById(''). Using getElementById will get an element by a specific Id. Using document.querySelector lets you select elements by Id, attribute or class, etc. making it more versatile.

var quizKey = document.querySelector('#quiz');
var timeKey = document.querySelector('#timeClock');
var optionsKey  = document.querySelector('#options');
var submitBtn = document.querySelector('#submit');
var startBtn  = document.querySelector('#start');
var initialsKey  = document.querySelector('#initials');
var responseKey = document.querySelector('#response');

var openingPgKey  = document.querySelector('#openingpage');
var closingPgKey = document.querySelector('#closingpage');

let quizIndex = 0;
let timeClock =  60; 
let timerId;

function startQuiz() { 

  //Using .hidden to hide page. Can use Element.setAttribute(). Note: .hidden = true; will hide an element. Element.setAttribute() will "change" an attribute of an element. 
  
  openingPgKey.hidden = true;
  closingPgKey.hidden = true; 

  //Using .hidden = false; to unhide quizKey questions. Can use Element.removeAttribute(). Note: Element.removeAttribute() will remove a specified attribute from an element.

  quizKey.hidden = false;

  timerId = setInterval(runTime, 1000); //Note: Interval set to run 1000 millisecond = 1 second. setTimeout did not work. It stopped after 1 second.

  runQuestions();
}

function runQuestions()  {

  //function is to get questions from quiz.

  var nextQuestion = quiz[quizIndex];

  //Replace with current question. Using document.querySelector instead of document.getElementById.  

  var titleKey  = document.querySelector('#quiz-item');

  titleKey['textContent']  = nextQuestion['title'];

  //clearing out used questions. Can use 'innerHTML'. Using 'innerText' instead of 'innerHTML'. 'innerText' works but does behave differently. It will return the content but will not return html tags. 

  optionsKey['innerText'] = ''; 

      //for loop to loop over new questions. Breakdown: 1st Expression -> sets a variable before the loop starts (let i = 0), 2nd Expression -> defines the condition for the loop to run (i must be less than nextQuestion.options.length). 3rd Expression -> increases a value (i++) each time the code block in the loop has been executed.  Using bracket notation. 
      
    for (let i = 0; i < nextQuestion['options']['length']; i++)  {

      //new button created for (each) choice
    var option =  nextQuestion['options'][i];
    
      //using .createElement    Can use document.createElement
    var d = document;
    var optionNode = d.createElement('button');

      //using Element.value   Can use Element.setAttribute() Note: Both may not always be safe from (XSS) attacks on user input. Input validation may be needed..
    
    optionNode.className = 'option';

      //using Element.value     Can use Element.setAttribute()

    optionNode.value = 'option'; 

    optionNode['textContent'] = i +  1 + ' . ' + option;
    
    optionsKey.appendChild(optionNode);
    }
  }
 
function questionClick(event)  {
  const buttonKey = event['target'];
  
  //if the element that is clicked is not a choice button. Nothing will be done.

  if(!buttonKey.matches('.option')) {
   return;
 } 

  //check if the user guessed incorrectly
  
  if(buttonKey['value'] !== quiz[quizIndex].answer) {
    timeClock = timeClock - 15;
    if  (timeClock < 0) {
    timeClock = 0;
  }
  timeKey['textContent'] = timeClock;

  responseKey['textContent']  = 'Incorrect!';
  
  } else {

  responseKey['textContent']  = 'Correct!';
    
  }
      
  responseKey.className = 'response';
  
  setTimeout(function() {
    
  responseKey.className = 'response.hidden';
  }, 1000);

  //next question

  quizIndex++;

  //checking if there are no more userQuestions. Using else if statement. Can use || OR operator, or ?? nullish coalescing. They both behaved the same here but they also can behave differently in other cases... 

  if (timeClock  <=  0) {
  } else if (quizIndex === quiz.length)  {
    quizEnd();
  } else {
 runQuestions(); 
  }
}

function  quizEnd() {
  //stop timer
  clearInterval[timeKey];  
  
  //show end screen
  var closingPgKey  = document.querySelector('#closingpage');

  closingPgKey.hidden = false;
  
  //show final score
    var finalPointsKey  = document.querySelector('#finalPoints');
    finalPointsKey['textContent']  = timeClock;
    quizKey.hidden = true;
  }
  
function runTime()  {

  //Subtracting 1 from the timeClock. Also using - 1. Can use a postfixed operator called a decrement operator timeClock--; which subtracts 1 from it's operand. 
  
  timeClock = timeClock -= 1;

  //displays timeClock. Using [] brackets. Can use dot notation timeKey.textContent. Note: The textContent property sets or returns the text content of the specified node, and all its descendants(W3schools).
  
  timeKey['textContent'] = timeClock;
  
  //check if user ran out of time
  
    if (timeClock < 0 || timeClock == 0) { clearInterval(timerId) //leave this clearInterval here! timer goes into negative numbers and will not stop.
    quizEnd();

    
  }
}

    
  function  saveHighPoints()  {

    //get value of input box. Using .trimLeft() and .trimRight(). Can use .trimStart() and .trimEnd(). Trim removes white spaces, tabs, etc. from beginning of string and end of string. It does not change the original string or accept arguments. Can use trim() shortcut.

  var initials  = initialsKey.value.trimLeft().trimRight();

    //make sure value is not empty

    if  (initials !== '') {

    //get saved scores from localstorage. If there is not any, set to the array to empty.
        var highPoints  =
        JSON.parse(window.localStorage.getItem('highPoints'))  ||  [];

        //format new score object for current user
        var newPoints  = {
          points:timeClock,
          initials:initials, 
        };

        //save to localstoreage
        //using .splice() operator to add highPoints into newPoints. Note: .splice() is used to add, remove, replace elements from an array into certain locations in an array. Can use highPoints.push(newPoints); 

        highPoints.splice(newPoints);
        window.localStorage.setItem('highPoints', JSON.stringify(highPoints));

        //redirects to the next page

        window.location.href  = 'index.html';
    }
  }

  function  check(event)  {

    if (event.key === 'Enter')  {
      saveHighPoints();
    }
    
  }
      
  //user submit initials upon clicking button
  
  submitBtn.onmousedown = saveHighPoints;

  //to start quiz click button
  
  startBtn.onmousedown = startQuiz;

  //clicking on element containing choices
   
  optionsKey.onmousedown = questionClick;

  initialsKey.onkeyup = check;



function showHighPoints() {
 //retreiving scores form localStorage || set to empty array
 var highPoints = JSON.parse(window.localStorage.getItem('highPoints'))  ||  [];

 //sorting highPoints using .sort by point property in descending order from highest score to lowest score using b - a
 highPoints.sort(function (a , b) {
   return b.score - a.score;
 });

 for (var i = 0; i < highPoints.length; i += 1) {
  //create li tag for each high score
  var scoreItem = document.createElement('li');
  scoreItem['textContent'] = `${highPoints[i].initials}-${highPoints[i].score}`; //template literal
  

  //display on page
  var olEl = document.getElementById['highPoints'];
  olEl.appendChild(liTag);

  function clearHighPoints() {
   window.localStorage.removeItem('highPoints');
   window.location.reload();
  }
 }


  document.getElementById('clear').onclick = clearHighPoints;
}

  //run function when page loads
showHighPoints();
