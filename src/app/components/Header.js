import React from 'react';
import PropTypes from 'prop-types';

import logo from '../../images/logo_black.png';

/**
 * The header contains the game's logo and a button to start a new game.
 */
const Header = ({ didClickNewGame }) => (
    <div className="header">
        <img src={logo} className="logo"/>
        <button className="header-button" onClick={e => didClickNewGame(e)}>
            New Game
        </button>
    </div>
);

Header.propTypes = {
    /** New game button.
     *
     * @param {object} e - The click event.
     * */
    didClickNewGame: PropTypes.func.isRequired,
};

export default Header;
