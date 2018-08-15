import React from 'react';
import PropTypes from 'prop-types';

/**
 *  The message view is shown every time a level is completed.
 */
const MessageView = ({ onContinueButtonClick }) => (
    <div className="message">
        <span className="message-title">
            Level completed!
        </span>
        <button className="message-button" onClick={e => onContinueButtonClick(e)}>
            Next Level
        </button>
    </div>
);

MessageView.propTypes = {
    /** Called when next level button is clicked.
     *
     * @param {object} - The click event.
     * */
    onContinueButtonClick: PropTypes.func
};

export default MessageView;
