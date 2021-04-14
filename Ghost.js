import { DIRECTIONS, OBJECT_TYPE } from './setup.js';

class Ghost {
    constructor(speed = 5, startPos, movement, name) {
        this.name = name;
        this.movement = movement;
            // saving startPos bc when Pacman eats a ghost he moves back to startPos
        this.startPos = startPos;
        this.pos = startPos;
        this.dir = DIRECTIONS.ArrowRight;
        this.speed = speed;
        this.timer = 0;
            // to keep track of if ghost is scared (if pacman has eaten powerPIll )
        this.isScared = false;
            // this.rotation=false; so that the ghosts do not rotate
        this.rotation = false;
    }

    shouldMove() {
        if (this.timer === this.speed) {
            this.timer = 0;
            return true;
        }
        this.timer++;
        return false;
    }

    getNextMove(objectExist) {
        // Call move algorithm here
        const { nextMovePos, direction } = this.movement(
            this.pos,
            this.dir,
            objectExist
        );
        return { nextMovePos, direction }
    }

    makeMove() {
        const classesToRemove = [OBJECT_TYPE.GHOST, OBJECT_TYPE.SCARED, this.name];
        let classesToAdd = [OBJECT_TYPE.GHOST, this.name];

        // Check if ghost is scared - classes to add
        if (this.isScared) classesToAdd = [...classesToAdd, OBJECT_TYPE.SCARED];

        return { classesToRemove, classesToAdd };
    }

    setNewPos(nextMovePos, direction) {
        this.pos = nextMovePos;
        this.dir = direction;

    }
}

export default Ghost;