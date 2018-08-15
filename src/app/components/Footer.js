import React from 'react';

/**
 * A Footer contains misc links/text related to the game.
 */
const Footer = () => (
    <div className="footer">
        <p className="footer-text">
            HOW TO PLAY: Make all tiles' values equal to the current level. Keep in mind that a tile's value cannot be greater than the current level nor can you combine a tile with itself.
        </p>
    </div>
);

export default Footer;
