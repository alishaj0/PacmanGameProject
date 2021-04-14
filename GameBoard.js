import { GRID_SIZE, CELL_SIZE, OBJECT_TYPE, CLASS_LIST } from "./setup.js";


// Object class in JS
class GameBoard {
    // constructor will run when this class is run and variables will be available in the instance of this class 
    constructor(DOMGrid) {
        this.dotCount = 0;
        this.grid = [];
        this.DOMGrid = DOMGrid;
    }

    // METHODS (methods inside a class are just "functions")
    // showGameStatus method to show whether won the game or not
    showGameStatus(gameWin) {
        const div = document.createElement(`div`);
        div.classList.add(`game-status`);
        div.innerHTML = `${gameWin ? 'WIN!' : 'GAME OVER!'}`;
        this.DOMGrid.appendChild(div);
    }

    // method to create grid for game
    createGrid(level) {
        // at every restart of game, want to reset dotCount to 0
        this.dotCount = 0;

        // reset grid to empty array - grid will be array with all positions
        this.grid = [];

        // to reset DOMGrid which is actual div's, to empty
        this.DOMGrid.innerHTML = '';

        // to reset styling to DOMGrid, GRID_SIZE and CELL_SIZE from css to make grid dynamic based on style from setup file
        this.DOMGrid.style.cssText = `grid-template-columns: repeat(${GRID_SIZE}, ${CELL_SIZE}px)`;

        // 'level' is array with all values for grid in setup file
        // 'forEach' loop to loop through each and every value within the 'LEVEL' array
        // looping through each element in LEVEL and creating a div for each element and adding a square with a class depending on the value of the square. & apply styling to set cell size on each element
        level.forEach((square) => {
            const div = document.createElement(`div`);
            div.classList.add(`square`, CLASS_LIST[square]);
            div.style.cssText = `width: ${CELL_SIZE}px; height: ${CELL_SIZE}px`;
            this.DOMGrid.appendChild(div);
            // to push new div into the 'this.grid' array above. 
            this.grid.push(div)

            // to add to 1 to dotCount on movement
            if (CLASS_LIST[square] === OBJECT_TYPE.DOT) this.dotCount++;
        });
    }

    // if in a specific position in grid, will add these classes
    addObject(pos, classes) {
        this.grid[pos].classList.add(...classes);
    }

    // if in a specific position in grid, will remove these classes
    removeObject(pos, classes) {
        this.grid[pos].classList.remove(...classes);
    }

    // to check if an class exists within grid (class called object in this case)
    // Changed to inline arrow function in order to bind method
    objectExist = (pos, object) => {
        return this.grid[pos].classList.contains(object);
    };

    // to rotate pacman within the game
    rotateDiv(pos, deg) {
        this.grid[pos].style.transform = `rotate(${deg}deg)`;
    }

    // Move characters : pacman and ghosts
    moveCharacter(character) {
            // ensure call shouldMove method shouldMove()
        if (character.shouldMove()) {
            const { nextMovePos, direction } = character.getNextMove(
                this.objectExist
            );
            const { classesToRemove, classesToAdd } = character.makeMove();
            
            // only for pacman
            if (character.rotation && nextMovePos !== character.pos) {
                this.rotateDiv(nextMovePos, character.dir.rotation);
                this.rotateDiv(character.pos, 0);
            }

            this.removeObject(character.pos, classesToRemove);
            this.addObject(nextMovePos, classesToAdd);

            character.setNewPos(nextMovePos, direction);
        }
    }

    // static method
    static createGameBoard(DOMGrid, level) {
        const board = new this(DOMGrid);
        board.createGrid(level);
        return board;
    }
}

export default GameBoard;