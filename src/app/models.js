const Tile = (value, status = 'new') => ({
    value: value,
    status: status,
});

class Grid {
    constructor(numTiles) {
        this.tiles = [];
        this.numTiles = numTiles;
    }

    map(func) {
        return this.tiles.map(func);
    }

    serialize() {
        return {
            tiles: this.tiles,
            numTiles: this.numTiles,
        }
    }
}

/**
 * The rules for PlusUno are simple; you tap a tile and:
 *
 * - If no other tile is currently selected, then mark the tapped tile as
 *   selected and return.
 * - If another tile is currently selected, then increase the value of the already
 *   selected tile by '1' and the value of the tapped tile by the value of the already
 *   selected tile.
 *
 * These rules must be followed in order for the move to be valid:
 *
 *  (1) No tile can have a value larger than the current level.
 *  (2) No tile can be merged with itself.
 *
 * The level is completed once all tiles have the same value.
 */
export default class GameModel {
    constructor(level, mode = 'normal') {
        this.history = [];
        this.level = mode === 'normal' ? level : 100;
        this.numMoves = 0;
        this.levelCompleted = false;
        this.mode = mode;
        this.initGrid();

        // Attributes only available in 'tutorial' mode.
        this.tutorialCompleted = mode === 'normal' ? null : false;
        this.currInstructionIndex = mode === 'normal' ? null : 0;
        this.instructions = mode === 'normal' ? null : [
            {0: {message: 'Tap me.', position: 'bottom'}},
            {1: {message: 'Tap me.', position: 'bottom'}},
            {0: {message: 'You tapped me first so I increased by ONE.', position: 'bottom'}},
            {1: {message: 'You tapped me seconds so I increased by the value of the tile you tapped first.', position: 'bottom'}},
            {0: {message: 'Tap me one more time.', position: 'bottom'}},
            {1: {message: 'Now tap me, I will increase by \'3\' and become \'7\'.', position: 'bottom'}, 0: {message: 'I will increase by \'1\' and become \'4\'.', position: 'top'}},
        ];
    }

    /**
     * Loads a game model from a serialized object.
     */
    static load = (state) => {
        const model = new GameModel(state.level, state.mode);
        model.grid = new Grid(state.grid.numTiles);
        model.grid.tiles = state.grid.tiles;
        model.levelCompleted = state.levelCompleted;
        model.numMoves = state.numMoves;
        model.prevTileIndex = state.prevTileIndex;
        model.history = state.history;

        return model;
    };

    /**
     * Initializes the grid in either 'normal' or 'tutorial' mode.
     *
     * A grid in 'normal' mode consists of 8 tiles with value 1 surrounding
     * a tile with value 0 at the center.
     *
     * A grid in 'tutorial' mode consists of 2 tiles with value 1.
     */
    initGrid() {
        if (this.mode === 'normal') {
            this.grid = new Grid(9);
            for (let i = 0; i < this.grid.numTiles; i++) {
                const tileValue = i === 4 ? 0 : 1;
                this.grid.tiles.push(Tile(tileValue));
            }
        } else {  // tutorial
            this.grid = new Grid(2);
            this.grid.tiles.push(Tile(1, 'pulsate'));
            this.grid.tiles.push(Tile(1));
        }
    }

    /**
     * Used only in tutorial mode.
     *
     * @return {boolean} - True if there are more instructions, false otherwise.
     */
    noMoreInstructions() {
        return this.currInstructionIndex > this.instructions.length - 1;
    }

    getCurrentInstruction() {
        if (this.noMoreInstructions()) {
            this.tutorialCompleted = true;
            return {};
        } else {
            return this.instructions[this.currInstructionIndex];
        }
    }

    /**
     * Return an object containing metadata about the game model. The
     * returned object is used to store the game state.
     *
     * @return {object} - Game state metadata.
     */
    serialize() {
        return {
            mode: this.mode,
            grid: this.grid.serialize(),
            level: this.level,
            levelCompleted: this.levelCompleted,
            numMoves: this.numMoves,
            prevTileIndex: this.prevTileIndex,
            history: this.history,
        };
    }

    /**
     * Set the status of all tiles to none.
     */
    resetStatus() {
        this.grid.tiles.map(tile => (tile.status = ''));
    }

    /**
     * If no tile is selected, selects the tile with given index. Otherwise,
     * attempts to merge the tile with given index and the previously
     * selected tile - if successful, increment the number of moves by 1 and
     * add the corresponding 'move' to the history array.
     *
     * @param {number} index - Index in grid of the tile to be selected.
     */
    selectTileAt(index) {
        if (this.levelCompleted) return;
        if (this.mode === 'tutorial') {
            this.selectTileAtInTutorialMode(index);
            return;
        }

        // Reset the status of all tiles so that animations work as intended.
        this.resetStatus();
        if (this.prevTileIndex === undefined) {
            this.prevTileIndex = index;
            this.grid.tiles[index].status = 'selected';
        } else {
            if (this.prevTileIndex === index) {
                this.prevTileIndex = undefined;
            } else {
                if (!this.merge(this.prevTileIndex, index)) {
                    this.prevTileIndex = undefined;
                    return;
                }

                this.history.push({
                    prevTileIndex: this.prevTileIndex,
                    tileIndex: index,
                });
                this.numMoves += 1;
                this.prevTileIndex = undefined;

                // Check to see if level has been completed.
                this.check();
            }
        }
    }

    /**
     * Simplified version of 'selectTileAt' used in tutorial mode.
     *
     * @param {number} index - Index in grid of the tile to be selected.
     */
    selectTileAtInTutorialMode(index) {
        if (this.prevTileIndex === undefined) {
            if (index !== 0 && !this.noMoreInstructions()) return;

            this.prevTileIndex = index;
            this.grid.tiles[index].status = 'selected';
            this.grid.tiles[(index + 1) % 2].status = this.noMoreInstructions() ? '' : 'pulsate';
            this.currInstructionIndex += 1;
        } else {
            if (this.prevTileIndex !== index) {
                if (!this.merge(this.prevTileIndex, index)) {
                    // If no more moves can be done then the tutorial is complete.
                    this.levelCompleted = true;
                    this.resetStatus();
                    return;
                }

                this.numMoves += 1;
                this.prevTileIndex = undefined;
                this.currInstructionIndex += 1;
                this.grid.tiles[0].status = this.noMoreInstructions() ? 'merged' : 'pulsate';
            }
        }
    }

    /**
     * Merge two tiles if their values are less than the current level.
     *
     * @param {number} prevTileIndex - The first-clicked tile's index.
     * @param {number} tileIndex - The second-clicked tile's index.
     *
     * @returns {boolean} true if the merge was successful, false otherwise.
     */
    merge(prevTileIndex, tileIndex) {
        const prevTile = this.grid.tiles[prevTileIndex];
        const tile = this.grid.tiles[tileIndex];

        const prevTileNewValue = prevTile.value + 1;
        const tileNewValue = tile.value + prevTile.value;
        if (prevTileNewValue >  this.level || tileNewValue > this.level) {
            return false;
        }

        tile.value = tileNewValue;
        prevTile.value = prevTileNewValue;
        prevTile.status = tile.status = 'merged';
        return true;
    }

    /**
     * Go back one move by popping the last element from the history array
     * and un-merging the corresponding tiles in the grid. Follow up by increasing
     * the number of moves by 1.
     */
    undoMove() {
        if (this.levelCompleted) return;
        if (this.history.length === 0) return;
        this.resetStatus();
        this.prevTileIndex = undefined;
        this.numMoves += 1;

        console.log(this.history);
        const prevMove = this.history.pop();
        console.log(prevMove);
        this.unmerge(prevMove.prevTileIndex, prevMove.tileIndex);
    }

    /**
     * Unmerge two tiles by subtracting 1 from the first-clicked tile's value;
     * then, take that value and subtract it from the second-clicked tile's value.
     *
     * @param {number} prevTileIndex - The first-clicked tile's index.
     * @param {number} tileIndex - The second-clicked tile's index.
     */
    unmerge(prevTileIndex, tileIndex) {
        const prevTile = this.grid.tiles[prevTileIndex];
        const tile = this.grid.tiles[tileIndex];

        prevTile.value = prevTile.value - 1;
        tile.value = tile.value - prevTile.value;
        prevTile.status = tile.status = 'new';
    }

    /**
     * Checks if all tiles' values have the same value. If yes,
     * set the levelCompleted attribute to true to signal the
     * current level has been cleared; return otherwise.
     */
    check() {
        for (let i = 0; i < this.grid.numTiles; i++) {
            const tile = this.grid.tiles[i];
            if (tile.value !== this.level) return
        }

        this.levelCompleted = true;
    }
}
