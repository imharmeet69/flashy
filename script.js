// Initialize or load cards from localStorage
let cards = JSON.parse(localStorage.getItem('flashcards')) || [];
let currentQuestion = 0;

// Get DOM elements
const questionInput = document.getElementById('questionInput');
const answerInput = document.getElementById('answerInput');
const flashcardForm = document.getElementById('flashcardForm');

// Only try to get elements that exist on the current page
const questionEl = document.querySelector(".question");
const loading = document.querySelector(".loading");
const percentage = document.querySelector(".percentage");
const buttons = document.querySelectorAll(".button");
const total = document.querySelector(".total");
const deleteBtn = document.querySelector("#delete")

// Handle form submission
if (flashcardForm) {
  flashcardForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent default form submission

    // Create a new flashcard object
    const flashcard = {
      question: questionInput.value,
      answer: answerInput.value
    };

    // Add to cards array and save to localStorage
    cards.push(flashcard);
    localStorage.setItem('flashcards', JSON.stringify(cards));

    // Redirect to index.html
    window.location.href = 'index.html';
  });
}

// Only try to access cards if we're on the index page
let question = '';
let answer = '';
if (questionEl && cards.length > 0) {
  question = cards[currentQuestion].question;
  answer = cards[currentQuestion].answer;
  questionEl.textContent = question;
}
  




// Safely set question text only when the element exists (avoids errors on input.html)
if (questionEl) {
  questionEl.textContent = question;
}

function updateProgress() {
  // If there are no cards, avoid division by zero and show 0/0
  if (!cards || cards.length === 0) {
    if (loading) loading.style.width = '0%';
    if (percentage) percentage.textContent = '0%';
    if (total) total.textContent = `0/0`;
    if (questionEl) questionEl.textContent = 'No cards available. Add some cards!';
    // Disable navigation buttons except Add (delete button may be kept)
    if (buttons && buttons.length) {
      buttons.forEach(btn => btn.disabled = true);
    }
    // Also ensure delete is disabled if present
    const del = document.querySelector('#delete');
    if (del) del.disabled = true;
    return;
  }

  // Ensure buttons are enabled when there are cards
  if (buttons && buttons.length) {
    buttons.forEach(btn => btn.disabled = false);
  }
  const del = document.querySelector('#delete');
  if (del) del.disabled = false;

  const progressPercent = ((currentQuestion + 1) / cards.length) * 100;
  if (loading) loading.style.width = Math.max(0, Math.min(100, progressPercent)) + "%";
  if (percentage) percentage.textContent = Math.round(Math.max(0, Math.min(100, progressPercent))) + "%";
  if (total) total.textContent = `${currentQuestion + 1}/${cards.length}`;
}

updateProgress();

function previous() {
  if(currentQuestion > 0) {
    currentQuestion--;
    // Reset the answer button state when changing cards
    const answerButton = Array.from(buttons).find(btn => 
      btn.innerText === "hide answer" || btn.innerText === "Answer"
    );
    if (answerButton) {
      answerButton.innerText = "Answer";
    }
    questionEl.textContent = cards[currentQuestion].question;
    updateProgress();
  }
}

function next() {
  if(currentQuestion < cards.length - 1) {
    currentQuestion++;
    // Reset the answer button state when changing cards
    const answerButton = Array.from(buttons).find(btn => 
      btn.innerText === "hide answer" || btn.innerText === "Answer"
    );
    if (answerButton) {
      answerButton.innerText = "Answer";
    }
    questionEl.textContent = cards[currentQuestion].question;
    updateProgress();
  }
}

function result() {
  // Get the current card's answer
  questionEl.innerHTML = cards[currentQuestion].answer;
}

buttons.forEach(btn => {
  btn.addEventListener("click", 
    function buttonFunctions() {
  if (btn.innerText === "Previous") {
    previous();
  } else if (btn.innerText === "Next") {
    next();
  } else if(btn.innerText === "Answer") {
    result();
    btn.innerText = "hide answer"
  } else if (btn.innerText === "hide answer") {
    questionEl.textContent = cards[currentQuestion].question;
    btn.innerText = "Answer";
  }
}
  );
})

function deleteCard() {
  // Remove the current card from the array
  cards.splice(currentQuestion, 1);
  
  // Save the updated cards to localStorage
  localStorage.setItem('flashcards', JSON.stringify(cards));
  
  if (cards.length === 0) {
    // If no cards left, show message and update UI
    questionEl.textContent = "No cards available. Add some cards!";
    updateProgress();
    // Disable buttons when no cards are left
    buttons.forEach(btn => {
      if (btn.id !== "delete") {
        btn.disabled = true;
      }
    });
  } else {
    // If we deleted the last card in the array, move to the previous card
    if (currentQuestion >= cards.length) {
      currentQuestion = cards.length - 1;
    }
    // Update the display
    questionEl.textContent = cards[currentQuestion].question;
    updateProgress();
  }
}

// Add click event listener for delete button
if (deleteBtn) {
  deleteBtn.addEventListener("click", deleteCard);
}
