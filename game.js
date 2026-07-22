var buttonColours = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var randomChosenColour = "";
var userClickedPattern = [];
var level = 0;
var started = false;
var isAnimating = false;
var difficultySpeed = 600; // default: Normal
var highScores = JSON.parse(localStorage.getItem("simonHighScores")) || {
  easy: { score: 0, name: "—" },
  normal: { score: 0, name: "—" },
  hard: { score: 0, name: "—" },
  insane: { score: 0, name: "—" }
};

var currentDifficulty = "normal"; // default
updateHighScoreUI();
updateLeaderboardUI();
const SECRET_CODE = "1234"; // change to whatever you want



// update UI on load
function updateHighScoreUI() {
  $("#high-score").text(
    "High Score (" + currentDifficulty + "): " + highScores[currentDifficulty].score
  );
}


function updateLeaderboardUI() {
  $("#lb-easy").text(highScores.easy.score + " — " + highScores.easy.name);
  $("#lb-normal").text(highScores.normal.score + " — " + highScores.normal.name);
  $("#lb-hard").text(highScores.hard.score + " — " + highScores.hard.name);
  $("#lb-insane").text(highScores.insane.score + " — " + highScores.insane.name);
}





function nextSequence() {
  userClickedPattern = [];
  level++;
  $("#level-title").text("Level " + level);

  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);

  // Prevent starting during animation
  isAnimating = true;

  let i = 0;
const interval = setInterval(() => {
  let colour = gamePattern[i];

  $("#" + colour).addClass("pressed");
  setTimeout(() => {
    $("#" + colour).removeClass("pressed");
  }, 200);

  $("#" + colour).fadeIn(100).fadeOut(100).fadeIn(100);

  let audio = new Audio('sounds/' + colour + '.mp3');
  audio.play();

  i++;
  if (i >= gamePattern.length) {
    clearInterval(interval);
    isAnimating = false;
  }
}, difficultySpeed);


}

// Konami code sequence
const konamiCode = [
  "ArrowUp", "ArrowUDown",
  "ArrowLeft", "ArrowRight",
];

let konamiIndex = 0;

// Listen for key presses
document.addEventListener("keydown", function (e) {
  if (e.key === konamiCode[konamiIndex]) {
    konamiIndex++;

    // Completed!
    if (konamiIndex === konamiCode.length) {
      unlockResetFeature();
      konamiIndex = 0;
    }
  } else {
    konamiIndex = 0; // reset if wrong key
  }
});

function unlockResetFeature() {
  $("#reset-highscores-btn").show();

  // Neon unlock flash
  $("#reset-highscores-btn").css({
    borderColor: "#ff00ff",
    boxShadow: "0 0 25px #ff00ff, 0 0 45px #ff00ff"
  });

  setTimeout(() => {
    $("#reset-highscores-btn").css({
      borderColor: "#0ff",
      boxShadow: "0 0 15px #0ff"
    });
  }, 1200);
}


$("#start-btn").on("click touchstart", function (e) {
  e.preventDefault();
  e.stopImmediatePropagation();

  // Get player name
  playerName = $("#player-name").val().trim();

  // FIRST: Validate player name
  if (!playerName) {
    $("#level-title").text("Enter your player name");
    $("#player-name").addClass("error");
    setTimeout(() => $("#player-name").removeClass("error"), 500);
    return;
  }

  // SECOND: Validate difficulty mode
  if (!currentDifficulty) {
    $("#level-title").text("Choose a difficulty mode");
    $(".difficulty-icon").addClass("error");
    setTimeout(() => $(".difficulty-icon").removeClass("error"), 500);
    return;
  }

  // If both are valid → start game
  $("#start-btn").removeClass("flicker").hide();
  $("#leaderboard").hide();
  $("#difficulty-select").hide();
$("#reset-highscores-btn").hide();



  $("#level-title").text("Level " + level);

  nextSequence();
  started = true;
});









$(".difficulty-icon").on("click touchstart", function (e) {
  e.preventDefault();
  e.stopImmediatePropagation();

  difficultySpeed = Number($(this).data("speed"));
  currentDifficulty = $(this).data("mode");  // MUST be this

  $(".difficulty-icon").removeClass("active");
  $(this).addClass("active");

  $("#difficulty-select").hide();
  updateHighScoreUI();
});






$(".btn").on("touchstart click", function (e) {
  e.preventDefault();
  e.stopImmediatePropagation();

  let userChosenColour = $(this).attr("id");
  userClickedPattern.push(userChosenColour);

  // vibration on tap
  if (navigator.vibrate) {
    navigator.vibrate(50);
  }

  $(this).fadeIn(100).fadeOut(100).fadeIn(100);

  let audio = new Audio('sounds/' + userChosenColour + '.mp3');
  audio.play();

  checkAnswer(userClickedPattern.length - 1);
});



$("#restart-btn").on("click touchstart", function (e) {
  e.preventDefault();
  e.stopImmediatePropagation();

  startOver();

  $("#start-btn").show().addClass("flicker");
  $("#player-name-box").show();
  $("#leaderboard").hide();
  $("#difficulty-select").hide(); // stays hidden until Start validates
$("#reset-highscores-btn").hide();


  updateHighScoreUI();
  updateLeaderboardUI();
});




function checkAnswer(currentLevel) {

    if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
      if (userClickedPattern.length === gamePattern.length){
        setTimeout(function () {
          nextSequence();
        }, 1000);
      }
} else {
  let audio = new Audio('sounds/wrong.mp3');
  audio.play();

  if (navigator.vibrate) {
    navigator.vibrate([150, 100, 150]);
  }

  $("body").addClass("game-over");
  $("#level-title").text("Game Over! Press Restart");

  setTimeout(function () {
    $("body").removeClass("game-over");
  }, 200);

  // update high score
let scoreThisRound = level - 1;

if (scoreThisRound > highScores[currentDifficulty].score) {
  highScores[currentDifficulty].score = scoreThisRound;
  highScores[currentDifficulty].name = playerName;

  localStorage.setItem("simonHighScores", JSON.stringify(highScores));

  updateHighScoreUI();
  updateLeaderboardUI();

  // 🔊 Play high score sound
  let hsAudio = new Audio("sounds/highscore.mp3");
  hsAudio.volume = 0.7; // optional
  hsAudio.play();

  // 🌟 Show neon banner
  $("#new-high-score-banner").show();
  setTimeout(() => {
    $("#new-high-score-banner").fadeOut(500);
  }, 3000);
}

// show leaderboard on game over
$("#leaderboard").show();
$("#reset-highscores-btn").hide();

$("#restart-btn").show();
$("#start-btn").hide();

startOver();

}
}

$("#reset-highscores-btn").on("click", function () {
  $("#secret-reset-box").show();
});

$("#secret-code").on("input", function () {
  let entered = $(this).val();

  if (entered.length === 4) {
    if (entered === SECRET_CODE) {

      // Delete local storage
      localStorage.removeItem("simonHighScores");

      // Reset highScores object
      highScores = {
        easy: { score: 0, name: "—" },
        normal: { score: 0, name: "—" },
        hard: { score: 0, name: "—" },
        insane: { score: 0, name: "—" }
      };

      updateHighScoreUI();
      updateLeaderboardUI();

      // Neon success flash
      $("#secret-code").css({
        borderColor: "#00ff99",
        boxShadow: "0 0 20px #00ff99"
      });

      setTimeout(() => {
        $("#secret-reset-box").fadeOut(300);
        $("#secret-code").val("").css({
          borderColor: "#ff00ff",
          boxShadow: "0 0 15px #ff00ff"
        });
      }, 1000);

    } else {
      // Wrong code animation
      $("#secret-code").addClass("error");

      setTimeout(() => {
        $("#secret-code").removeClass("error");
        $("#secret-code").val("");
      }, 400);
    }
  }
});


function startOver() {
  level = 0;
  gamePattern = [];
  started = false;
  isAnimating = false;
  // DO NOT reset currentDifficulty
}

