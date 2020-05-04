const gameContainer = document.getElementById('game');
let card1 = null;
let card2 = null;
let matches = 0;
let freeze = false;
let tries = 0;
let triesCounter = document.querySelector('#tries');
triesCounter.textContent = tries;
let bestScore = parseInt(localStorage.getItem('bestScore'));
let bestScoreCounter = document.querySelector('#best');
bestScoreCounter.textContent = bestScore;

const COLORS = [ 'red', 'blue', 'green', 'orange', 'purple', 'red', 'blue', 'green', 'orange', 'purple' ];

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
	let counter = array.length;

	// While there are elements in the array
	while (counter > 0) {
		// Pick a random index
		let index = Math.floor(Math.random() * counter);

		// Decrease counter by 1
		counter--;

		// And swap the last element with it
		let temp = array[counter];
		array[counter] = array[index];
		array[index] = temp;
	}

	return array;
}

let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
	for (let color of colorArray) {
		// create a new div
		const newDiv = document.createElement('div');

		// give it a class attribute for the value we are looping over
		newDiv.classList.add(color);
		newDiv.dataset.type = 'card';
		// call a function handleCardClick when a div is clicked on
		newDiv.addEventListener('click', handleCardClick);

		// append the div to the element with an id of game
		gameContainer.append(newDiv);
	}
}

// TODO: Implement this function!
function handleCardClick(e) {
	if (freeze) return;
	//This says that if the value of the variable freeze is set to true than skip this function, which will prevent more than 2 cards from being clicked at once
	if (e.target.classList.contains('flipped')) return;
	//This says that if the card being clicked on has the class of flipped to skip this function
	tries += 1;
	triesCounter.textContent = tries;
	let currentCard = e.target;
	currentCard.style.backgroundColor = currentCard.getAttribute('class');

	if (!card1 || !card2) {
		//This says that if card1 or card2 is set to null to run the following code after a card is clicked
		currentCard.classList.add('flipped');
		card1 = card1 || currentCard;
		//What this code is saying is, when you click on a card than card 1 will be set to the value of card1 or the current card being clicked
		card2 = currentCard === card1 ? null : currentCard;
		//What this code is saying is if the current card is strictly equal to card 1 (if you're clicking on the same card over and over) than card 2 will be set to null. If it's not the same card than card 2 will be set to the current card being clicked.
	}
	if (card1 && card2) {
		freeze = true;
		//This states that if card1 and card2 have a value stored in them to set the value of freeze to true so that no more cards can be clicked

		let flip1 = card1.className;
		let flip2 = card2.className;

		if (flip1 === flip2) {
			matches += 2;
			card1.removeEventListener('click', handleCardClick);
			card2.removeEventListener('click', handleCardClick);
			card1 = null;
			card2 = null;
			freeze = false;
		} else {
			setTimeout(function() {
				card1.style.backgroundColor = '';
				card2.style.backgroundColor = '';
				card1.classList.remove('flipped');
				card2.classList.remove('flipped');
				card1 = null;
				card2 = null;
				freeze = false;
			}, 1000);
		}
	}
	if (matches === COLORS.length) {
		alert('Game Over');
		restartButton.style.display = '';
		//my attempt at making a permanent high score
		let currentScore = triesCounter.textContent;
		if (!localStorage.bestScore || parseInt(localStorage.bestScore) === 0) {
			localStorage.setItem('bestScore', currentScore);
		} else if (Number(triesCounter.textContent) < parseInt(localStorage.bestScore)) {
			localStorage.bestScore = currentScore;
		}
	}
	//end of said attempt
}

// when the DOM loads
startButton = document.querySelector('#start');
restartButton = document.querySelector('#restart');
restartButton.style.display = 'none';

startButton.addEventListener('click', function(e) {
	createDivsForColors(shuffledColors);
	// restartButton.style.display = "";
});

restartButton.addEventListener('click', function() {
	const nChildren = gameContainer.childElementCount;
	let rCard = gameContainer.children;
	for (let i = 0; i < nChildren; i++) {
		gameContainer.removeChild(rCard[0]);
	}
	restartButton.style.display = 'none';
	triesCounter.textContent = 0;
	bestScoreCounter.textContent = parseInt(localStorage.bestScore);
});
