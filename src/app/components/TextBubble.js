import React from 'react';
import PropTypes from 'prop-types';
import invariant from 'invariant';
import classnames from 'classnames';

/**
 * A text bubble displays a given text inside a 'bubble'.
 */
const TextBubble = ({ extraStyle, text, tipPos }) => {
    invariant(tipPos === 'top' || 'bottom',
        `"${tipPos}" is not a valid "tipPos" for a TextBubble. ` +
        `Choose either "top" or "bottom".`
    );

    const className = classnames(
        `speech-bubble-${tipPos}`,
        extraStyle,
    );

    return (
        <div className="speech-bubble-container">
            <div className={className}>
                <p style={{padding: 16}}>
                    {text}
                </p>
            </div>
        </div>
    );
};

TextBubble.propTypes = {
    /** The text to be displayed in the text bubble.  */
    text: PropTypes.string,

    /** Either 'top' or 'bottom'. Indicates where the bubble's tip is placed. */
    tipPos: PropTypes.string,
};

TextBubble.defaultProps = {
    text: '',
    tipPos: 'top',
};

export default TextBubble;
