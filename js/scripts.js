//Business Logic
function Player(name) {
  this.name = name;
  this.score = 0;
  this.turnScore = 0;
}

Player.prototype.roll = function() {
  let roll = (Math.floor(Math.random() * 6) + 1);
  if (roll === 1) {
    this.turnScore = 0;
  } else {
    this.turnScore += roll;
  }
  return roll;
};

Player.prototype.endTurn = function() {
  this.score += this.turnScore;
  this.turnScore = 0;
  return this.score >= 100;
};

//UI Logic
let player1 = new Player("player1");
let player2 = new Player("player2");
let versusAI = true;

function animateRoll(activePlayer, otherPlayer) {
  const playerDie = $("#" + activePlayer.name + "-roll");
  let count = 1;
  const intervalID = setInterval(function() {
    playerDie.attr("src", "css/images/dice" + count + ".png");
    if (count === 6) {
      count = 1;
    } else {
      count++;
    }
  }, 100);
  setTimeout(function() {
    clearInterval(intervalID);
    rollUI(activePlayer, otherPlayer);
  }, 1000);
}

function rollUI(activePlayer, otherPlayer) {
  const roll = activePlayer.roll();

  $("#" + activePlayer.name + "-roll").attr("src", "css/images/dice" + roll + ".png");
  $("#" + activePlayer.name + "-turn").text(activePlayer.turnScore);
  if (roll === 1 && versusAI === false) {
    activePlayer.endTurn();
    endTurnUI(activePlayer, otherPlayer);
  } else if (roll === 1 && versusAI === true && activePlayer === player1){
    activePlayer.endTurn();
    endTurnUI(activePlayer, otherPlayer);
    runAI();
  }
}

function endTurnUI(activePlayer, otherPlayer) {
  if (activePlayer.endTurn()) {
    $("#" + activePlayer.name + "-roll-btn").attr("disabled", true);
    $("#" + activePlayer.name + "-end").attr("disabled", true);
    $("#" + otherPlayer.name + "-roll-btn").attr("disabled", true);
    $("#" + otherPlayer.name + "-end").attr("disabled", true);

    $("#results h1").text(activePlayer.name + " Wins!");
    $("#results").removeClass("hidden");
  } else {
    $("#" + activePlayer.name + "-roll-btn").attr("disabled", true);
    $("#" + activePlayer.name + "-end").attr("disabled", true);

    $("#" + otherPlayer.name + "-roll-btn").removeAttr("disabled");
    $("#" + otherPlayer.name + "-end").removeAttr("disabled");
  }

  $("#" + activePlayer.name + "-score").text(activePlayer.score);
}

function resetUIText() {
  $("#" + player1.name + "-roll").text("");
  $("#" + player1.name + "-turn").text("0");
  $("#" + player1.name + "-score").text("0");

  $("#" + player2.name + "-roll").text("");
  $("#" + player2.name + "-turn").text("0");
  $("#" + player2.name + "-score").text("0");
}

//AI Logic
// function runAI (player2, player1){
//   //while (player2.turnScore < 20) {
//     rollUI(player2, player1);
//     if (player2.turnScore >= 20){
//       player2.endTurn();
//       // endTurnUI(player2, player1);
//     }
//   //}
// }

function runAI() {
  do {
    console.log(player2.turnScore);
    rollUI(player2, player1);
  } while (player2.turnScore != 0 && player2.turnScore < 20);
  endTurnUI(player2, player1);
}

$(document).ready(function () {
  resetUIText();
  
  if (versusAI === false){
    $("#player1-roll-btn").click(function() {
      animateRoll(player1, player2);
    });
    $("#player2-roll-btn").click(function() {
      animateRoll(player2, player1);
    });
  
    $("#player1-end").click(function() {
      endTurnUI(player1, player2);
    });
    $("#player2-end").click(function() {
      endTurnUI(player2, player1);
    });
  } else {
    $("#player1-roll-btn").click(function() {
      animateRoll(player1, player2);
    });

    $("#player1-end").click(function() {
      endTurnUI(player1, player2);
      runAI();
    });
  }

  $("#restart").click(function() {
    player1 = new Player("player1");
    player2 = new Player("player2");

    $("#" + player1.name + "-roll-btn").removeAttr("disabled");
    $("#" + player1.name + "-end").removeAttr("disabled");

    $("#results").addClass("hidden");
    resetUIText();
  });

});