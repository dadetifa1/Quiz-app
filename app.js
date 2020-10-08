/**
 * Example store structure
 */
const store = {
  // 5 or more questions are required
  questions: [
    {
      question: 'Nigeria’s booming film industry is called?',
      answers: [
        'Hollywood',
        'Nollywood',
        'Sun city',
        'Bollywood'
      ],
      correctAnswer: 'Nollywood'
    },
    {
      question: 'Who is the best Afro beats artist?',
      answers: [
        'Burna Boy',
        'Wizkid',
        'Davido',
        'Mr Eazi'
      ],
      correctAnswer: 'Burna Boy'
    },
    {
      question: 'Nigeria is the African continent’s largest economy, as well as its largest _______ producer.',
      answers: [
        'Cocoa',
        'Gemstone',
        'oil',
        'Rubber'
      ],
      correctAnswer: 'oil'
    },
    {
      question: 'How many ethnic groups are in Nigeria?',
      answers: [
        '3',
        '20',
        '75',
        '250'
      ],
      correctAnswer: '250'
    },
    {
      question: 'In 1991, Nigeria’s capital city changed from Lagos to?',
      answers: [
        'Abuja',
        'Cairo',
        'Dakar',
        'Nairobi'
      ],
      correctAnswer: 'Abuja'
    }
  ],
  quizStarted: false,
  questionNumber: 0,
  score: 0
};

/**
 * 
 * Technical requirements:
 * 
 * Your app should include a render() function, that regenerates the view each time the store is updated. 
 * See your course material and access support for more details.
 *
 * NO additional HTML elements should be added to the index.html file.
 *
 * You may add attributes (classes, ids, etc) to the existing HTML elements, or link stylesheets or additional scripts if necessary
 *
 * SEE BELOW FOR THE CATEGORIES OF THE TYPES OF FUNCTIONS YOU WILL BE CREATING 👇
 * 
 */

/********** TEMPLATE GENERATION FUNCTIONS **********/
function loadMsgPagetxt(){
  return `<div class="welcome">
      <form>
        <p>
          Hello! Begin the quiz by pressing the button.
        </p>
        
        <button type="submit" id="start" >Start</button>
      </form>
    </div>`
}

/*
   * HTML question number and the score
   * 
   * 
   */
  function loadQuestionAndScoretxt() {
    return `
      <h3 class="question-and-score">Question Number: <span>${store.questionNumber + 1}</span> / <span>${store.questions.length}</span></h3>
      <h3 class="question-and-score">Score:  <span>${store.score}</span> / <span>${store.questions.length}</span></h3>
    `;
  }

  /*
   * HTML to display one question
   */
  function loadQuestionstxt() {
    let currentQuestion = store.questions[store.questionNumber];
    return `
      <form id="question-form" class="question-form">
        <fieldset>
          <div class="question">
            <legend> ${currentQuestion.question}</legend>
          </div>
          <div class="options">
            <div class="answers">
              ${loadAnswerstxt()}
            </div>
          </div>
          <button type="submit" id="submit-answer-btn" tabindex="5">Submit</button>
          <button type="button" id="next-question-btn" tabindex="6"> Next question</button>
        </fieldset>
      </form >
    `;
  }

  /*
   * list of possible answers for
   * one question
   */
  function loadAnswerstxt() {
    const answersArray = store.questions[store.questionNumber].answers
    let answersHtml = '';
    let i = 0;
  
    answersArray.forEach(answer => {
      answersHtml += `
        <div id="option-container-${i}">
          <input type="radio" name="options" data-container-id="${i}" id="option${i + 1}" value= "${answer}" tabindex ="${i + 1}" required> 
          <label for="option${i + 1}"> ${answer}</label>
        </div>
      `;
      i++;
    });
    return answersHtml;
  }

  /**
   * Question status.
   */
  function loadQuestionStatusTxt(status) {
    let correctAnswer = store.questions[store.questionNumber].correctAnswer;
    
    if (status === 'correct') {
      return `<div class="right-answer">That is correct!</div>`;
    }
    else if (status === 'incorrect') {
      return `<div class="wrong-answer">That is incorrect. The correct answer is ${correctAnswer}.</div>`;
    }
  }

  /*
   *  HTML for the results screen
   */
  function loadResultstxt() {
    return `
      <div class="results">
        <form id="js-restart-quiz">
          <fieldset>
            <div class="row">
              <div class="col-12">
                <legend>Your Score is: ${store.score}/${store.questions.length}</legend>
              </div>
            </div>
          
            <div class="row">
              <div class="col-12">
                <button type="button" id="restart"> Restart Quiz </button>
              </div>
            </div>
          </fieldset>
      </form>
      </div>
    `;
  }
/********** RENDER FUNCTION(S) **********/
function render(){
  if(areThereStillMoreQuestions()){
    $('main').html(loadQuestionAndScoretxt() + loadQuestionstxt());
  }else if(areAllTheQuestionsAnswered()){
    $('main').html(loadResultstxt());
  }
  else {
    $('main').html(loadMsgPagetxt());
  }
}
// This function conditionally replaces the contents of the <main> tag based on the state of the store

/********** EVENT HANDLER FUNCTIONS **********/
function handleStartClick() {
  $('main').on('click', '#start', (event) => {
    store.quizStarted = true;
    render();
  });
}

/*
* Handles the submission of the question form
*/
function handleQuestionFormSubmission() {
  $('body').on('submit', '#question-form', function (event) {
    event.preventDefault();
    const currentQuestion = store.questions[store.questionNumber];
    
    let selectedOption = $('input[name=options]:checked').val();
        
    let optionContainerId = `#option-container-${$('input[name=options]:checked').data('container-id')}`;

    if (selectedOption === currentQuestion.correctAnswer) {
      store.score++;
      $(optionContainerId).append(loadQuestionStatusTxt('correct'));
    }
    else {
      $(optionContainerId).append(loadQuestionStatusTxt('incorrect'));
    }

    // move to the next question
    store.questionNumber++;
    // hide the submit button
    $('#submit-answer-btn').hide();
    // disable all inputs
    $('input[type=radio]').each(() => {
      $('input[type=radio]').attr('disabled', true);
    });
    // show the next button
    $('#next-question-btn').show();

  });
}

  /*
   * Handles the click of the "next" button
   */
  function handleNextQuestionClick() {
    $('body').on('click', '#next-question-btn', (event) => {
      render();
    });
  }

  /*
   * Handles the click of the "restart" button
   */
  function handleRestartButtonClick() {
    $('body').on('click', '#restart', () => {
      restartQuiz();
      render();
    });
  }
// These functions handle events (submit, click, etc)



/********** Utility FUNCTIONS **********/
function restartQuiz() {
  store.quizStarted = false;
  store.questionNumber = 0;
  store.score = 0;
}

function areAllTheQuestionsAnswered(){
  return store.quizStarted && store.questionNumber === store.questions.length;
}

function areThereStillMoreQuestions(){
  return store.quizStarted && store.questionNumber < store.questions.length;
}


function startQuizApp() {
  render();
  handleStartClick();
  handleNextQuestionClick();
  handleQuestionFormSubmission();
  handleRestartButtonClick();
}

$(startQuizApp);