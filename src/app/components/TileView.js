import React from 'react';
import PropTypes from 'prop-types';

/**
 *  A tile is a view with an associated value displayed at its center.
 */
const TileView = ({
    status,
    onClick,
    value,
}) => {
    const tileStatus = status ? `tile-${status}` : 'tile';
    return (
        <div className={`${tileStatus} tile-${value}`} onClick={e => onClick(e)}>
            <span className="tile-value">
                {value}
            </span>
        </div>
    )
};

TileView.propTypes = {
    /** The status determines the style of the tile view. */
    status: PropTypes.string.isRequired,

    /** Called when the tile view is clicked.
     *
     * @param {object} e - The click event.
     * */
    onClick: PropTypes.func.isRequired,

    /** The value to be displayed in the tile view. */
    value: PropTypes.number.isRequired,
};

export default TileView;
