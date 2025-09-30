/**
 * WORDLE CLONE - STUDENT IMPLEMENTATION
 * 
 * Complete the functions below to create a working Wordle game.
 * Each function has specific requirements and point values.
 * 
 * GRADING BREAKDOWN:
 * - Core Game Functions (60 points): initializeGame, handleKeyPress, submitGuess, checkLetter, updateGameState
 * - Advanced Features (30 points): updateKeyboardColors, processRowReveal, showEndGameModal, validateInput
 */

// ========================================
// CORE GAME FUNCTIONS (60 POINTS TOTAL)
// ========================================

/**
 * Initialize a new game
 * POINTS: 10
 * 
 * TODO: Complete this function to:
 * - Reset all game state variables
 * - Get a random word from the word list
 * - Clear the game board
 * - Hide any messages or modals
 */
function initializeGame() {
    // TODO: Reset game state variables
    currentWord = WordleWords.getRandomWord();
    //currentWord = '';  // Set this to a random word
    currentGuess = '';
    currentRow = 0;
    gameOver = false;
    gameWon = false;
    
    // TODO: Get a random word from the word list
    // HINT: Use WordleWords.getRandomWord()
    resetBoard();
    // TODO: Reset the game board
    // HINT: Use resetBoard()
    hideModal();
    //hidePrevMessage();
    // TODO: Hide any messages
    // HINT: Use hideModal() and ensure message element is hidden
    messageElement.classList.add('hidden'); //hides message element
    messageElement.textContent='';    //empties any previous text
    console.log('Game initialized!'); // Remove this line when implementing

}

/**
 * Handle keyboard input
 * POINTS: 15
 * 
 * TODO: Complete this function to:
 * - Process letter keys (A-Z)
 * - Handle ENTER key for word submission
 * - Handle BACKSPACE for letter deletion
 * - Update the display when letters are added/removed
 */
function handleKeyPress(key) {
    // TODO: Check if game is over - if so, return early
    if (gameOver) return;
    // TODO: Handle letter keys (A-Z)
    if(key=='ENTER') {
        if (isGuessComplete()) {submitGuess();}
        else {
            showMessage("Nalayak",'error',2000);
        }
        return;
    }
    if(key=='BACKSPACE') {
        console.log(" I AM HERE VRO\n");
        if (currentGuess.length>0) {
            const lengthTemp = currentGuess.length - 1;
            const currRow = currentRow;
            currentGuess = currentGuess.slice(0,-1);
            updateTileDisplay(getTile(currRow, lengthTemp), '');
        }
        return;
    }
    const pattern = /^[A-Z]$/
    if (!pattern.test(key)) {
        console.log("bruh\n");
        return;
    }
    if(currentGuess.length<WORD_LENGTH){
        const temp = currentGuess.length;
        currentGuess+=key;
        const tile = getTile(currentRow, currentGuess.length-1);
        updateTileDisplay(tile, key);    
    }
    

    // HINT: Use regex /^[A-Z]$/ to test if key is a letter
    // HINT: Check if currentGuess.length < WORD_LENGTH before adding
    // HINT: Use getTile() and updateTileDisplay() to show the letter
    
    // TODO: Handle ENTER key
    // HINT: Check if guess is complete using isGuessComplete()
    // HINT: Call submitGuess() if complete, show error message if not
    
    // TODO: Handle BACKSPACE key  
    // HINT: Check if there are letters to remove
    // HINT: Clear the tile display and remove from currentGuess
    
    console.log('Key pressed:', key); // Remove this line when implementing
}
/**
 * Submit and process a complete guess
 * POINTS: 20
 * 
 * TODO: Complete this function to:
 * - Validate the guess is a real word
 * - Check each letter against the target word
 * - Update tile colors and keyboard
 * - Handle win/lose conditions
 */
function submitGuess() {
    // TODO: Validate guess is complete
    // HINT: Use isGuessComplete()
    if (!isGuessComplete()) {
        showMessage("Word must be 5 letters 😭💔", 'error', 2000);
        return;
    }
    
    // TODO: Validate guess is a real word
    // HINT: Use WordleWords.isValidWord()
    if (!WordleWords.isValidWord(currentGuess)) {
        showMessage("Invalid Word!", 'error', 2000);
        shakeRow(currentRow);
        return;
    }
    // HINT: Show error message and shake row if invalid
    
    // TODO: Check each letter and get results
    // HINT: Use checkLetter() for each position
    // HINT: Store results in an array
    let arrRes = [];
    for (var i = 0; i < 5; i++) {
        arrRes[i]=checkLetter(currentGuess[i],i,currentWord);
    }
    for(let i = 0; i < 5; i++) {
        setTileState(getTile(currentRow,i),arrRes[i]);
    }

    // TODO: Update tile colors immediately
    // HINT: Loop through results and use setTileState()
    
    // TODO: Update keyboard colors
    // HINT: Call updateKeyboardColors()
    updateKeyboardColors(currentGuess,arrRes);
    // TODO: Check if guess was correct
    // HINT: Compare currentGuess with currentWord
    flag = true;
    for(var i = 0; i < 5; i++) {
        if(arrRes[i]!='correct') {
            flag = false;
        }
    }
    processRowReveal(currentRow,arrRes);

    // TODO: Update game state
    // HINT: Call updateGameState()
    updateGameState(flag);    
    // TODO: Move to next row if game continues
    // HINT: Increment currentRow and reset currentGuess
    if(!gameOver) {
        currentRow++;
        currentGuess='';
    }
    console.log('Guess submitted:', currentGuess); // Remove this line when implementing
}

/**
 * Check a single letter against the target word
 * POINTS: 10
 * 
 * TODO: Complete this function to:
 * - Return 'correct' if letter matches position exactly
 * - Return 'present' if letter exists but wrong position
 * - Return 'absent' if letter doesn't exist in target
 * - Handle duplicate letters correctly (this is the tricky part!)
 */
function checkLetter(guessLetter, position, targetWord) {
    // TODO: Convert inputs to uppercase for comparison
    guessLetter = guessLetter.toUpperCase();
    targetWord = targetWord.toUpperCase();
    guessTemp = currentGuess.toUpperCase();
    // TODO: Check if letter is in correct position
    // HINT: Compare targetWord[position] with guessLetter
    if (targetWord.includes(guessLetter)) {
        if (targetWord[position]==guessLetter) {
            return 'correct';
        } else {
            let num=0;
            let numOccurences=0;
            for (i = 0;i < targetWord.length;i++) {
                if (targetWord[i]==guessLetter) numOccurences++;
            }
            let correctNum=0;
            for (i = 0; i < guessTemp.length; i++) {
                if (guessTemp[i]==guessLetter && targetWord[i]==guessLetter) {
                    correctNum++;
                }
            }
            let yellowNum=0;
            for (i = 0; i < position;i++){
                if(guessTemp[i]==guessLetter && targetWord[i]!=guessLetter){
                    yellowNum++;
                }
            }
            let emptySpots=numOccurences-correctNum-yellowNum;
            if(emptySpots>0) return 'present'
            return 'absent'
        }
    } 
    console.log('Checking letter:', guessLetter, 'at position:', position); // Remove this line
    return 'absent'; // Replace with actual logic
    
    // TODO: Check if letter exists elsewhere in target
    // HINT: Use targetWord.includes() or indexOf()
    
    // TODO: Handle duplicate letters correctly
    // This is the most challenging part - you may want to implement
    // a more sophisticated algorithm that processes the entire word
    

}

/**
 * Update game state after a guess
 * POINTS: 5
 * 
 * TODO: Complete this function to:
 * - Check if player won (guess matches target)
 * - Check if player lost (used all attempts)
 * - Show appropriate end game modal
 */
function updateGameState(isCorrect) {
    // TODO: Handle win condition
    // HINT: Set gameWon and gameOver flags, call showEndGameModal
    if (isCorrect) {
        gameWon=true;
        gameOver=true;
        showEndGameModal(true, currentWord);
        return;
    } 
    if (currentRow+1>=MAX_GUESSES) {
        gameOver=true;
        showEndGameModal(false, currentWord);
    }

    // TODO: Handle lose condition  
    // HINT: Check if currentRow >= MAX_GUESSES - 1
    
    console.log('Game state updated. Correct:', isCorrect); // Remove this line
}

// ========================================
// ADVANCED FEATURES (30 POINTS TOTAL)
// ========================================

/**
 * Update keyboard key colors based on guessed letters
 * POINTS: 10
 * 
 * TODO: Complete this function to:
 * - Update each key with appropriate color
 * - Maintain color priority (green > yellow > gray)
 * - Don't downgrade key colors
 */
function updateKeyboardColors(guess, results) {
    // TODO: Loop through each letter in the guess
    guess=guess.toUpperCase();
    for (var i = 0; i < WORD_LENGTH;i++) {
        let currLetter = guess[i];
        let result = results[i];
        const ele = document.querySelector(`[data-key="${currLetter}"]`);
        if(!ele) continue;

        const state = ele.getAttribute('data-state');
        if(state=='correct'){
            continue; //no need to change bro
        }
        if(result=='correct'){
            updateKeyboardKey(currLetter,'correct');
        } else if (result=='present') {
            if(state!='correct') {
                updateKeyboardKey(currLetter,'present');
            }
        } else if (result=='absent') {
            if(state!='correct' && state!='present') {
                updateKeyboardKey(currLetter,'absent');
            }
        }
    }
    // TODO: Get the keyboard key element
    // HINT: Use document.querySelector with [data-key="LETTER"]
    
    // TODO: Apply color with priority system
    // HINT: Don't change green keys to yellow or gray
    // HINT: Don't change yellow keys to gray
    
    console.log('Updating keyboard colors for:', guess); // Remove this line
}

/**
 * Process row reveal (simplified - no animations needed)
 * POINTS: 5 (reduced from 15 since animations removed)
 * 
 * TODO: Complete this function to:
 * - Check if all letters were correct
 * - Trigger celebration if player won this round
 */
function processRowReveal(rowIndex, results) {
    // TODO: Check if all results are 'correct'
    // HINT: Use results.every() method
    const flag = results.every(result => result == 'correct');
    if(flag) {
        celebrateRow(rowIndex);
    }
    
    // TODO: If all correct, trigger celebration
    // HINT: Use celebrateRow() function
    
    console.log('Processing row reveal for row:', rowIndex); // Remove this line
}

/**
 * Show end game modal with results
 * POINTS: 10
 * 
 * TODO: Complete this function to:
 * - Display appropriate win/lose message
 * - Show the target word
 * - Update game statistics
 */
function showEndGameModal(won, targetWord) {
    // TODO: Create appropriate message based on won parameter
    // HINT: For wins, include number of guesses used
    // HINT: For losses, reveal the target word
    updateStats(won, currentRow+1);

    if (won) {
        //const messages = ["WOWWWW", "DUBSSSS", "Amazingggg", "Yayyyyy", "Niceeee", "Bruh i was worried for a sec"];
        showModal(true, targetWord, currentRow+1);
    } else {
        showModal(false, targetWord, 0);
    // TODO: Update statistics
    // HINT: Use updateStats() function
    }
    // TODO: Show the modal
    // HINT: Use showModal() function
    //showModal(message);
    console.log('Showing end game modal. Won:', won, 'Word:', targetWord); // Remove this line
}

/**
 * Validate user input before processing
 * POINTS: 5
 * 
 * TODO: Complete this function to:
 * - Check if game is over
 * - Validate letter keys (only if guess not full)
 * - Validate ENTER key (only if guess complete)
 * - Validate BACKSPACE key (only if letters to remove)
 */
function validateInput(key, currentGuess) {
    // TODO: Return false if game is over
    if (gameOver) return false;
    // TODO: Handle letter keys
    // HINT: Check if currentGuess.length < WORD_LENGTH
    const pattern = /^[A-Z]$/
    if(pattern.test(key)) {
        return currentGuess.length<WORD_LENGTH;
    }
    if(key == 'ENTER') {
        return currentGuess.length === WORD_LENGTH;
    }
    // TODO: Handle ENTER key
    // HINT: Check if currentGuess.length === WORD_LENGTH
    if (key == 'BACKSPACE') {
        return currentGuess.length > 0;
    }
    // TODO: Handle BACKSPACE key
    // HINT: Check if currentGuess.length > 0
    
    console.log('Validating input:', key); // Remove this line
    return true; // Replace with actual validation logic
}

// ========================================
// DEBUGGING HELPERS (REMOVE BEFORE SUBMISSION)
// ========================================

// Uncomment these lines for debugging help:
console.log('Current word:', currentWord);
console.log('Current guess:', currentGuess);
console.log('Current row:', currentRow);

console.log('Student implementation template loaded. Start implementing the functions above!'); 