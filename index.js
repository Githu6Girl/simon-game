var gamePattern = [];
var userClickedPattern = [];
var buttonColours = ["red", "blue", "green", "yellow"];
var started = false;
var level = 0;

// Load best score from localStorage (or set it to 0 if it doesn't exist)
var bestScore = localStorage.getItem("bestScore") ? parseInt(localStorage.getItem("bestScore")) : 0;
$("#best-score").text("Best Score: " + bestScore);

// Function to generate a random color sequence
function nextSequence() {
    userClickedPattern = [];
    level++;
    $("#level-title").text("Level " + level);

    var randomNumber = Math.floor(Math.random() * 4);
    var randomChosenColour = buttonColours[randomNumber];
    gamePattern.push(randomChosenColour);

    $("#" + randomChosenColour)
        .fadeOut(100)
        .fadeIn(100)
        .css({
            "box-shadow": "0 0 40px white",
            "transform": "scale(1.1)"
        });

    setTimeout(function() {
        $("#" + randomChosenColour).css({
            "box-shadow": "none",
            "transform": "scale(1)"
        });
    }, 300);

    playSound(randomChosenColour);
}


function playSound(name) {
    var audio = new Audio("sounds/" + name + ".mp3");
    audio.play();
}

// Function to animate user clicks
function animatePress(currentColour) {
    $("#" + currentColour)
        .addClass("pressed")
        .css("box-shadow", "0 0 30px #ff66b2");

    setTimeout(function() {
        $("#" + currentColour).removeClass("pressed").css("box-shadow", "none");
    }, 200);
}

// Detect when a button is clicked by the user
$(".btn").click(function() {
    var userChosenColour = $(this).attr("id");
    userClickedPattern.push(userChosenColour);

    playSound(userChosenColour);
    animatePress(userChosenColour);

    checkAnswer(userClickedPattern.length - 1);
});

// Function to restart the game (Only with the restart button)
$("#restart-btn").click(() => {
    $("#restart-btn").fadeOut();
    startOver();
    nextSequence();
});


function startOver() {
    if (level > bestScore) {
        bestScore = level - 1; // Adjusted to count only completed levels
        localStorage.setItem("bestScore", bestScore); 
        $("#best-score").text("Best Score: " + bestScore); 
    }

    level = 0;
    gamePattern = [];
    started = false;
    $("#level-title").text("Level " + level);
}


function checkAnswer(currentLevel) {
    if (userClickedPattern[currentLevel] === gamePattern[currentLevel]) {
        console.log("Success");

        if (userClickedPattern.length === gamePattern.length) {
            setTimeout(() => { nextSequence(); }, 1000);
        }
    } else {
        console.log("Wrong");
        playSound("wrong");

        $("body").addClass("game-over");
        setTimeout(() => { $("body").removeClass("game-over"); }, 200);

        $("#level-title").text("Game Over 💔");
        $("#restart-btn").fadeIn(); 
    }
}
