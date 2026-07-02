let gameRunning = false;
let dropMaker;
let timerInterval;

let score = 0;
let timeLeft = 40;
let goal = 15;

let difficulty = "easy";

const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const goalDisplay = document.getElementById("goal");
const startBtn = document.getElementById("start-btn");
const gameContainer = document.getElementById("game-container");

const winningMessages = [
  "Amazing! You helped provide clean water!",
  "Great job! Communities thank you!",
  "You reached your goal! Every drop matters!"
];

const losingMessages = [
  "Keep trying! Every drop counts.",
  "Nice effort! Let's collect even more clean water.",
  "Don't give up! Communities still need your help."
];

const milestoneMessages = [
  "Great start!",
  "You're making a difference!",
  "Halfway there!",
  "Almost there!",
  "Amazing work!"
];

const clickSound = new Audio("sounds/click.mp3");
const winSound = new Audio("sounds/win.mp3");

document.querySelectorAll(".difficulty-btn").forEach(btn => {

  btn.addEventListener("click", () => {

    document.querySelectorAll(".difficulty-btn").forEach(b=>b.classList.remove("active"));

    btn.classList.add("active");

    difficulty = btn.dataset.mode;

    if(difficulty==="easy"){
      timeLeft=40;
      goal=15;
    }

    if(difficulty==="normal"){
      timeLeft=30;
      goal=20;
    }

    if(difficulty==="hard"){
      timeLeft=20;
      goal=25;
    }

    goalDisplay.textContent=goal;
    timeDisplay.textContent=timeLeft;

  });

});

startBtn.addEventListener("click", startGame);

function startGame(){

  if(gameRunning) return;

  gameRunning=true;

  score=0;

  scoreDisplay.textContent=score;

  if(difficulty==="easy"){
      timeLeft=40;
      goal=15;
  }

  if(difficulty==="normal"){
      timeLeft=30;
      goal=20;
  }

  if(difficulty==="hard"){
      timeLeft=20;
      goal=25;
  }

  goalDisplay.textContent=goal;
  timeDisplay.textContent=timeLeft;

  gameContainer.innerHTML="";

  startBtn.textContent="Game Running...";

  showMessage("Collect clean water before time runs out!");

  let speed=700;

  if(difficulty==="normal") speed=550;

  if(difficulty==="hard") speed=420;

  dropMaker=setInterval(createDrop,speed);

  timerInterval=setInterval(()=>{

      timeLeft--;

      timeDisplay.textContent=timeLeft;

      if(timeLeft<=0){

          endGame();

      }

  },1000);

}

function createDrop(){

    const drop=document.createElement("div");

    const isBadDrop=Math.random()<0.25;

    drop.className=isBadDrop?"water-drop bad-drop":"water-drop";

    drop.textContent=isBadDrop?"✖":"💧";

    const size=40+Math.random()*35;

    drop.style.width=size+"px";

    drop.style.height=size+"px";

    drop.style.left=Math.random()*(gameContainer.offsetWidth-size)+"px";

    let duration=4;

    if(difficulty==="normal") duration=3;

    if(difficulty==="hard") duration=2;

    drop.style.animationDuration=duration+"s";

    drop.addEventListener("pointerdown",()=>{

        if(!gameRunning) return;

        clickSound.play();

        if(isBadDrop){

            score=Math.max(0,score-2);

            showMessage("Dirty water! -2");

        }else{

            score++;

            showMessage("+1 Clean Water!");

        }

        scoreDisplay.textContent=score;

        checkMilestones();

        drop.remove();

    });

    gameContainer.appendChild(drop);

    drop.addEventListener("animationend",()=>drop.remove());

}

function checkMilestones(){

    if(score===5){

        showMessage(milestoneMessages[0]);

    }

    if(score===10){

        showMessage(milestoneMessages[1]);

    }

    if(score===15){

        showMessage(milestoneMessages[2]);

    }

    if(score===goal-3){

        showMessage(milestoneMessages[3]);

    }

}

function showMessage(text){

    document.getElementById("game-message").textContent=text;

}

function endGame(){

    gameRunning=false;

    clearInterval(dropMaker);

    clearInterval(timerInterval);

    const win=score>=goal;

    if(win){

        showConfetti();

        winSound.play();

    }

    const list=win?winningMessages:losingMessages;

    const random=list[Math.floor(Math.random()*list.length)];

    showMessage(random+" Final Score: "+score);

    startBtn.textContent="Play Again";

}

function showConfetti(){

    for(let i=0;i<30;i++){

        const confetti=document.createElement("div");

        confetti.className="confetti";

        confetti.textContent="🎉";

        confetti.style.left=Math.random()*100+"%";

        confetti.style.animationDuration=(2+Math.random()*2)+"s";

        gameContainer.appendChild(confetti);

        setTimeout(()=>confetti.remove(),3000);

    }

}