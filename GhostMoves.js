import { DIRECTIONS, OBJECT_TYPE } from './setup.js';

// Primitive random movement
export function randomMovement(position, direction, objectExist) {
    let dir = direction;
    let nextMovePos = position + dir.movement;

    // Create an array from the directions object keys (Grab all the keys and put in an array in order to get a random number/key from array)
    const keys = Object.keys(DIRECTIONS);

    // Dont want ghosts to run into wall or another ghost, have to check postitions - using while loop to calculate if next move (random number) is a wall or ghost, it will skip and go to next random move
    while (
        objectExist(nextMovePos, OBJECT_TYPE.WALL) ||
        objectExist(nextMovePos, OBJECT_TYPE.GHOST)
    ) {
        // Get a random key from the key array (created above)
        // Each key in array corresponds with direction
        const key = keys[Math.floor(Math.random() * keys.length)];

        // Set the next move
        dir = DIRECTIONS[key];
        // Set the next move - how to constantly change direction of ghost until dont have a wall or another ghost 
        nextMovePos = position + dir.movement;
    }   
    return { nextMovePos, direction: dir };
}