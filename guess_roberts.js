//============================================================================|
// Clifton Roberts                                                            |
// CSC-333 Program Language Theory                                            |
// Programming Assignment - JavaScript                                        |
// Fall 2014                                                                  |
//============================================================================|
// Globals
var iRandomNumber = Math.floor((Math.random() * 100) + 1);
var iLives = 7;
var iTime = 10;
var sGuesses = "";
var timer;
//============================================================================|
// playGame()                                                                 |
//----------------------------------------------------------------------------|
// Upon pressing the Play Game button, it disappears, shows the Game div,     |
// randomly generates a number between 1 and 100, and starts the timer.       |
//============================================================================|
function playGame()
{
    // Make sure the document has loaded fully.
    $(document).ready(function()
    {
        // Show the Game elements and hide the Play Game button.
        $("#game").removeClass("hidden");
        $("#btnPlayGame").hide();
        
        // The error message should be hidden initially.
        $("#error").hide();
    });
    
    // Start the timer.
    timer = setTimeout(updateTimer, 1000);
}
//============================================================================|
// updateTimer()                                                              |
//----------------------------------------------------------------------------|
// This function is called by the timer once a second has passed. A second is |
// decremented from the player's total remaining time. If the new time is 0,  |
// the player has waited too long to make a guess and loses a life. The timer |
// is then set again.                                                         |
//============================================================================|
function updateTimer()
{
    // Subtract a second from the player's time.
    iTime -= 1;
    document.getElementById("time").innerHTML = iTime;
    
    // If time is 0, the player loses a life.
    if (iTime === 0)
    {
        loseALife();
    }
    // Otherwise, the clock keeps ticking.
    else
    {
        timer = setTimeout(updateTimer, 1000);
    }
}
//============================================================================|
// resetTimer()                                                               |
//----------------------------------------------------------------------------|
// This function effectively resets the timer back to 10 seconds. It should   |
// called when the player makes a valid guess or when the timer runs to 0     |
// while lives remain.                                                        |
//============================================================================|
function resetTimer()
{
    // Cancel the current timer.
    clearTimeout(timer);
    
    // Reset the timer.
    iTime = 10;
    document.getElementById("time").innerHTML = iTime;
    timer = setTimeout(updateTimer, 1000);
}
//============================================================================|
// loseALife()                                                                |
//----------------------------------------------------------------------------|
// This function is called when the timer runs to 0 and the player loses a    |
// life. An error message indicating this action is shown and the timer is    |
// reset. Gameover occurs when no lives remain.                               |
//============================================================================|
function loseALife()
{
    // Subtract a life from the player.
    iLives -= 1;
    document.getElementById("lives").innerHTML = iLives;
    
    // Tell the player a life has been lost.
    $("#error").hide();
    var sErrorMessage = "You've waited too long and lost a life!";
    document.getElementById("error").innerHTML = sErrorMessage;
    $("#error").show(250);
    
    // If no lives remain, the player loses the game.
    if (iLives === 0)
    {
        gameOver();
    }
    else
    {
        // Reset the timer.
        resetTimer();
    }
}
//============================================================================|
// submitGuess()                                                              |
//----------------------------------------------------------------------------|
// This function handles a great deal of the game's logic and is called when  |
// the player submits a guess. The guess is first checked to be non-null and  |
// in the valid range [1, 100]. Nonvalid guesses trigger an error message but |
// do not reset the timer. Incorrect valid guesses trigger a too high or too  |
// low hint, result in the loss of one of the player's lives, and reset the   |
// timer. If no lives remain, the player loses the game.                      |
//============================================================================|
function submitGuess()
{   
    // Get the user's guess.
    var guess = document.getElementById("txtGuess").value;
    
    // Hide the error message in case it is present.
    $("#error").hide();
    
    // The guess must be a number between 1 and 100.
    if (guess.length > 0 && !isNaN(guess) && guess >= 1 && guess <= 100)
    {
        // Reset the timer.
        resetTimer();
        
        // Check the guess against the random number.
        if (guess == iRandomNumber)
        {
            // You win the game.
            if(confirm("You win the game! Play again?"))
            {
               // Reset all the things.
                resetPlayerAttributes();
            }
            else
            {
                // Redirect the player to the exit game page.
                location.href="exitgame.html";
            }
        }
        else
        {
            // You lose a life.
            iLives -= 1;
            document.getElementById("lives").innerHTML = iLives;
            
            // If you are out of lives, you lose the game.
            if (iLives === 0)
            {
                gameOver();
                return;
            }
            
            // Update the guesses made list.
            if (sGuesses.length === 0) sGuesses = guess;
            else sGuesses += ", " + guess;
            document.getElementById("guesses").innerHTML = sGuesses;
            
            // The number was too high.
            if (guess > iRandomNumber)
            {
                var sErrorMessage = "Sorry, your guess " + guess +
                    " is too high. You have " + iLives + " guesses remaining.";
            }
            // The number was too low.
            else
            {
                var sErrorMessage = "Sorry, your guess " + guess +
                    " is too low. You have " + iLives + " guesses remaining.";
            }
            
            // Show the appropriate error message.
            document.getElementById("error").innerHTML = sErrorMessage;
            $("#error").show(250);
        }
    }
    // Otherwise the guess is invalid. Produce and display an error message.
    else
    {
        var sErrorMessage = "Your guess is not a number between 1 and 100!";
        document.getElementById("error").innerHTML = sErrorMessage;
        $("#error").show(250);
    }
}
//============================================================================|
// gameOver()                                                                 |
//----------------------------------------------------------------------------|
// This function handles the game loss scenario. The player is notified that  |
// he has lost the game and is asked to play again. If the player chooses to  |
// play again, the player's attributes (time, guesses, guesses made) are      |
// reset and the game begins again. Otherwise, all input forms are disabled.  |
//============================================================================|
function gameOver()
{
    // Display confirm dialog asking if the player wants to play again.
    // If so, reset all the player's attributes and start over.
    if (confirm("You lost the game! Better luck next time. Play again?"))
    {
        resetPlayerAttributes();
    }
    // Otherwise, go to the exit game page.
    else
    {
        location.href="exitgame.html";
    }
}
//============================================================================|
// restartGame()                                                              |
//----------------------------------------------------------------------------|
// This function is called when the player presses the Restart button. There  |
// is a different confirmation dialog shown than the reset that occurs when   |
// the player wins or loses and chooses to play again.                        |
//============================================================================|
function restartGame()
{
    // Make sure the player wants to restart the game.
    if (confirm("Are you sure you want to restart the game?"))
    {
        resetPlayerAttributes();
    }
}
//============================================================================|
// resetPlayerAttributes()                                                    |
//----------------------------------------------------------------------------|
// Handles the bulk of the logic for restarting the game. All of the player's |
// attributes must be reset and redisplayed, along with the timer. Also, any  |
// lingering error messages are hidden and a new random number is generated.  |
//============================================================================|
function resetPlayerAttributes()
{
    // Cancel the current timer.
    clearTimeout(timer);
    
    // Generate a new random number.
    iRandomNumber = Math.floor((Math.random() * 100) + 1);
    
    // Reset and redisplay all the player's attributes.
    iLives = 7;
    iTime = 10;
    sGuesses = "";
    document.getElementById("lives").innerHTML = iLives;
    document.getElementById("time").innerHTML = iTime;
    document.getElementById("guesses").innerHTML = sGuesses;
    var txtGuess = document.getElementById("txtGuess");
    txtGuess.value = "";
    
    // Start a new timer.
    timer = setTimeout(updateTimer, 1000);
    
    // Hide all lingering error messages.
    $("#error").hide();
}
//============================================================================|
// exitGame()                                                                 |
//----------------------------------------------------------------------------|
// This function asks the player to confirm whether or not they want to quit  |
// the game. If so, they are brought to the exit game page. This is because   |
// you cannot close a tab or window that you did not open using JavaScript.   |
//============================================================================|
function exitGame()
{
    // Make sure the player wants to quit the game.
    if (confirm("Are you sure you want to quit the game?"))
    {
        // Redirect the player to the exit game page.
        location.href="exitgame.html";
    }
}