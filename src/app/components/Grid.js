import React from 'react';
import PropTypes from 'prop-types';

import TileView from './TileView';

/**
 *  A grid is a container for a group of tiles.
 */
const Grid = ({ onTileClick, tiles }) => (
    <div className="grid">
        {tiles.map((tile, index) => (
            <TileView
                key={index}
                value={tile.value}
                status={tile.status}
                onClick={e => onTileClick(e, index)}
            />
        ))}
    </div>
);

Grid.propTypes = {
    /** Called when a tile is clicked.
     *
     * @param {object} e - The click event.
     * @param {index} number - Index in grid of the clicked tile.
     */
    onTileClick: PropTypes.func,

    /** A list of objects corresponding to the data to be added to
     * tiles in the grid */
    tiles: PropTypes.arrayOf(
        PropTypes.shape({
            status: PropTypes.string.isRequired,
            value: PropTypes.number.isRequired,
        })
    ),
};

export default Grid;
