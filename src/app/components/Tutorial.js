import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import GameModel from '../models';
import LocalStorageManager from '../local-storage';
import TileView from './TileView';
import TextBubble from './TextBubble';

class Tutorial extends React.Component {
    static propTypes = {
        onCompleteTutorial: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            renderFlag: false,
            isContinueButtonVisible: false,
        };
        this.storageManager = new LocalStorageManager();
        this.model = new GameModel(undefined, 'tutorial');
        this.handleClick = this.handleClick.bind(this);
    }

    forceRender() {
        const { renderFlag } = this.state;
        this.setState({ renderFlag: !renderFlag });
    }

    handleClick(tileIndex) {
        this.model.selectTileAt(tileIndex);
        this.forceRender();
    }

    renderInstructions(yPos) {
        const instruction = this.model.getCurrentInstruction();
        return (
            <div className="speech-bubble-container">
                {Object.keys(instruction).map(key => {
                    const instructionForKey = instruction[key];
                    if (instructionForKey.position === yPos) {
                        const txtBubbleClass = classnames(
                            `${yPos === 'top' ? 'top-65' : ''}`,
                            `${key === String(1) ? 'left-50' : ''}`,
                        );
                        return (
                            <TextBubble
                                extraStyle={txtBubbleClass}
                                text={instructionForKey.message}
                                tipPos={`${yPos === 'top' ? 'bottom' : 'top'}`}
                            />
                        );
                    }
                    return null;
                })}
            </div>
        );
    }

    render() {
        const { onCompleteTutorial } = this.props;
        return (
            <div className="tutorial">
                <div/>
                <div className="tutorial-center-view">
                    {this.renderInstructions('top')}
                    <div className="tutorial-grid">
                        {this.model.grid.map((tile, index) => (
                            <TileView
                                key={index}
                                value={tile.value}
                                status={tile.status}
                                onClick={() => this.handleClick(index)}
                            />
                        ))}
                    </div>
                    {this.renderInstructions('bottom')}
                </div>
                <a className={`skip-tutorial-button ${this.model.tutorialCompleted ? 'black-font' : ''}`} onClick={onCompleteTutorial}>
                    {this.model.tutorialCompleted ? 'CONTINUE' : 'SKIP'}
                </a>
            </div>
        );
    }
}

export default Tutorial
