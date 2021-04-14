import { LEVEL, OBJECT_TYPE } from "./setup.js";
import { randomMovement } from "./GhostMoves.js";

// Classes
import GameBoard from "./GameBoard.js";
import Pacman from "./Pacman.js";
import Ghost from "./Ghost.js";

// Sounds -->  not working??
// import soundDot from "/sounds/munch.wav";
// import soundPill from "/sounds/pill.wav";
// import soundGameStart from "/sounds/game_start.wav";
// import soundGameOver from "/sounds/death.wav";
// import soundGhost from "/sounds/eat_ghost.wav";

// DOM ELEMENTS
const gameGrid = document.querySelector(`#game`);
const scoreTable = document.querySelector(`#score`);
const startButton = document.querySelector(`#start-button`);

// Game Constants (const UPPERCASE = cannot change in value)
const POWER_PILL_TIME = 10000; //ms
const GLOBAL_SPEED = 80; //ms
const gameBoard = GameBoard.createGameBoard(gameGrid, LEVEL);

// Initial Setup
let score = 0;
let timer = null;
let gameWin = false;
let powerPillActive = false;
let powerPillTimer = null;

// ------ AUDIO ------
// function playAudio(audio) {
//     var soundEffect = new Audio(audio)
//     soundEffect.play();
// }

// ----- GAME CONTROLLER -----
function gameOver(pacman, grid) {
    // playAudio(soundGameOver);

    // Removing addEventListener in startGame() function
    document.removeEventListener(`keydown`, (e) => 
        pacman.handleKeyInput(e, gameBoard.objectExist)
    );

    gameBoard.showGameStatus(gameWin);

    // stop game loop and clear timer
    clearInterval(timer);

    // make start game button reappear by removing 'hide' class
    startButton.classList.remove(`hide`);
}

// To check if pacman collided with a ghost:
function checkCollision(pacman, ghosts) {
    const collidedGhost = ghosts.find((ghost) => pacman.pos === ghost.pos);

    // if collided with ghost, check to see if pacman ate a powerpill -- if pacman ate a powerpill, will remove ghost / else pacman did not eat powerpill, pacman will die
    if (collidedGhost) {
        if (pacman.powerPill) {
            // playAudio(soundGhost);

            gameBoard.removeObject(collidedGhost.pos, [
                OBJECT_TYPE.GHOST,
                OBJECT_TYPE.SCARED,
                collidedGhost.name
            ]);
            // send collidedGhost back to startPos and give pacman score
            collidedGhost.pos = collidedGhost.startPos;
            score += 100;
        } else {
            gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.PACMAN]);
            gameBoard.rotateDiv(pacman.pos, 0);
            gameOver(pacman, gameGrid);
        }
    }
}

// Function to move pacman and ghosts
function gameLoop(pacman, ghosts) {
    // 1. Move Pacman
    gameBoard.moveCharacter(pacman);
    // 2. Check Ghost collision on the old positions
    checkCollision(pacman, ghosts);
    // 3. Move ghosts - forEach loop calling on moveCharacter function in gameBoard
    ghosts.forEach((ghost) => gameBoard.moveCharacter(ghost));
    // 4. Do a new ghost collision check on the new positions
    checkCollision(pacman, ghosts);

    // 5. Check if pacman eats a dot
    // If "object_type.dot exists on gameboard at pacman position, remove object_type.dot (from array created) at pacman position from gameboard, and remove 1 from dotCount and add 10 to player score"
    if (gameBoard.objectExist(pacman.pos, OBJECT_TYPE.DOT)) {
        // playAudio(soundDot);
        
        // remove dot from gameBoard
        gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.DOT]);
        // remove 1 dot from dotCount
        gameBoard.dotCount--;
        // give score from eating dot
        score += 10;
    }

    // 6. Check if Pacman eats a powerPill
    // If "object_type.pill exists on gameboard at pacman position, remove pill from array we created in JS named: OBJECT_TYPE"
    if (gameBoard.objectExist(pacman.pos, OBJECT_TYPE.PILL)) {
        // playAudio(soundPill);

        gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.PILL]);

        // have to set powerPill
        pacman.powerPill = true;
        score += 50;

        // clear powerPillTimer (so timer isn't still running from previous powerPIll)
        clearTimeout(powerPillTimer);
        // reset powerPillTimer to POWER_PILL_TIME 
        powerPillTimer = setTimeout(
            () => (pacman.powerPill = false),
            POWER_PILL_TIME
        );
    }

    // 7. Change ghost scare mode depending on powerPill - just want to run when powerPill is ate
    if (pacman.powerPill !== powerPillActive) {
        // will switch between true and false: if powerPillActive is true, pacman.powerPill will be false and vice versa
        powerPillActive = pacman.powerPill;
        // to make ghost.isScared true when pacman.powerPill is true
        ghosts.forEach((ghost) => (ghost.isScared = pacman.powerPill))
    }

    // 8. Check if all dots have been eaten
    if (gameBoard.dotCount === 0) {
        gameWin = true;
        gameOver(pacman, ghosts);
    }

    // 9. Show the score 
    scoreTable.innerHTML = score;
}


function startGame() {
    // playAudio(soundGameStart);

    // Upon clicking 'start game' startButton - reset values
    gameWin = false;
    powerPillActive = false;
    score = 0;

    // hiding (display: none in css) the start button after game starts
    startButton.classList.add('hide');

    // create a new gamegrid upon new game start
    gameBoard.createGrid(LEVEL);

    // create new Pacman(speed 2, position 287)
    const pacman = new Pacman(2, 287);

    // add PACMAN object from OBJECT_TYPE list and placing at position 287 addObject(position, [array with classes-object])
    gameBoard.addObject(287, [OBJECT_TYPE.PACMAN]);

    // adding event listener for controls: listen for 'keydown' , then inline arrow function for event that calls on handleKeyInput method from pacman.js file and passing in event(e) & calling on objectExist() method  from gameboard.js file 
    // objectExist from gameBoard.js will need to be binded or will return undefined. (NOTE: Can change objectExist method into inline arrow function for it to run) add gameBoard.objectExist.bind(gameBoard) to bind.)

    document.addEventListener(`keydown`, (e) => 
        pacman.handleKeyInput(e, gameBoard.objectExist)
    );

    // Create ghosts: new Ghost(speed, position, randomMovement, name)
    const ghosts = [
        new Ghost(5, 188, randomMovement, OBJECT_TYPE.BLINKY),
        new Ghost(4, 209, randomMovement, OBJECT_TYPE.PINKY),
        new Ghost(3, 230, randomMovement, OBJECT_TYPE.INKY),
        new Ghost(2, 251, randomMovement, OBJECT_TYPE.CLYDE)
    ]

    timer = setInterval(() => gameLoop(pacman, ghosts), GLOBAL_SPEED);
}


// Initialize game
startButton.addEventListener('click', startGame);