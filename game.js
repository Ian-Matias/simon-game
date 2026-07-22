var buttonColours = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var randomChosenColour = "";
var userClickedPattern = [];
var level = 0;
var started = false;
var isAnimating = false;
var difficultySpeed = 600; // default: Normal
var highScores = JSON.parse(localStorage.getItem("simonHighScores")) || {
  normal: { score: 0, name: "—" },
  hard: { score: 0, name: "—" },
  insane: { score: 0, name: "—" }
};

let demoMode = false;
let demoInterval = null;
let allowClicks = false;
let highScoreCelebrated = false;

let bgMusic = new Audio("sounds/synth.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.3; // adjust to taste


var currentDifficulty = "normal"; // default
updateHighScoreUI();
updateLeaderboardUI();
const SECRET_CODE = "1234"; // change to whatever you want

window.addEventListener("load", function () {
  demoMode = true;
  startDemoMode();

  bgMusic.play();   // ← start background music
});


function startDemoMode() {
  clearInterval(demoInterval);

  demoInterval = setInterval(() => {
    if (!demoMode) return;

    let colors = ["green", "red", "yellow", "blue"];
    let randomColor = colors[Math.floor(Math.random() * colors.length)];

    $("#" + randomColor).addClass("pressed");

    setTimeout(() => {
      $("#" + randomColor).removeClass("pressed");
    }, 300);

  }, 700);
}






// update UI on load
function updateHighScoreUI() {
  $("#high-score").text(
    "High Score (" + currentDifficulty + "): " + highScores[currentDifficulty].score
  );
}


function updateLeaderboardUI() {
  $("#lb-normal").text(highScores.normal.score + " — " + highScores.normal.name);
  $("#lb-hard").text(highScores.hard.score + " — " + highScores.hard.name);
  $("#lb-insane").text(highScores.insane.score + " — " + highScores.insane.name);
}





function nextSequence() {
  userClickedPattern = [];
  level++;
// ⭐ Live high score update (during gameplay)
// ⭐ Live high score update (during gameplay)
let scoreThisRound = level - 1;

if (scoreThisRound > highScores[currentDifficulty].score) {

  // Update high score value
  highScores[currentDifficulty].score = scoreThisRound;
  highScores[currentDifficulty].name = playerName;
  localStorage.setItem("simonHighScores", JSON.stringify(highScores));

  updateHighScoreUI();
  updateLeaderboardUI();

  // ⭐ Only celebrate ONCE
  if (!highScoreCelebrated) {
    highScoreCelebrated = true;

    // 🎉 Victory theme
    let victory = new Audio("sounds/victory.mp3");
    victory.volume = 0.9;
    victory.play();

    // 🌟 Neon banner
    $("#new-high-score-banner").show();
    setTimeout(() => {
      $("#new-high-score-banner").fadeOut(500);
    }, 3000);
  }
}


$("#level-title").text("Level " + level +);


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





$("#start-btn").on("click touchstart", function (e) {
  e.preventDefault();
  e.stopImmediatePropagation();

  playerName = $("#player-name").val().trim();

  if (!playerName) {
    $("#level-title").text("Enter your player name");
    return;
  }

  if (!currentDifficulty) {
    $("#level-title").text("Choose a difficulty mode");
    return;
  }

  demoMode = false;
  clearInterval(demoInterval);

  allowClicks = true;

  bgMusic.pause();          // ← stop background music
  bgMusic.currentTime = 0;  // ← optional reset

  $("#start-btn").removeClass("flicker").hide();
  $("#player-name-box").hide();
  $("#difficulty-select").hide();
  $("#leaderboard").hide();
  $("#restart-btn").hide();
  $("#reset-highscores-btn").hide();

  $("#level-title").text("Level " + level);

  nextSequence();
  started = true;
});






$(".difficulty-icon").on("click touchstart", function (e) {
  e.preventDefault();
  e.stopImmediatePropagation();

  difficultySpeed = Number($(this).data("speed"));
  currentDifficulty = $(this).data("mode");

  $(".difficulty-icon").removeClass("active");
  $(this).addClass("active");

  updateHighScoreUI();
});






$(".btn").on("touchstart click", function (e) {
  if (!allowClicks) return;
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

  allowClicks = false;

  $("#start-btn").show().addClass("flicker");
  $("#player-name-box").show();
  $("#difficulty-select").show();
  $("#leaderboard").show();
  $("#restart-btn").hide();
  $("#reset-highscores-btn").hide();

  $("#level-title").text("Press Start to Begin");

  demoMode = true;
  startDemoMode();

  bgMusic.play();   // ← play background music on home page
});


function checkAnswer(currentLevel) {

    if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
      if (userClickedPattern.length === gamePattern.length){
        setTimeout(function () {
          nextSequence();
        }, 1000);
      }
} else {
let wrong = new Audio("sounds/wrong.mp3");
wrong.volume = 0.4;
wrong.play();

let gameOverSound = new Audio("sounds/gameover.mp3");
gameOverSound.volume = 0.8;
gameOverSound.play();

// Fade-out effect
let fadeOut = setInterval(() => {
  if (gameOverSound.volume > 0.05) {
    gameOverSound.volume -= 0.05;   // decrease volume gradually
  } else {
    gameOverSound.volume = 0;
    clearInterval(fadeOut);
  }
}, 120); // fade speed (120ms per step)



if (navigator.vibrate) {
  navigator.vibrate([150, 100, 150]);
}

$("body").addClass("game-over");
$("#level-title").text("Game Over! Press Restart");

setTimeout(function () {
  $("body").removeClass("game-over");
}, 200);



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
  highScoreCelebrated = false; // ← reset celebration
}


