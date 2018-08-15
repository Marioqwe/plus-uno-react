import React from 'react';

import undo from '../../images/undo.png';
import GameModel from '../models';
import LocalStorageManager from '../local-storage';
import Header from './Header';
import Footer from './Footer';
import Grid from './Grid';
import MessageView from './MessageView';

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            renderFlag: false,
        };
        this.storageManager = new LocalStorageManager();
        this.setup();
    }

    setup() {
        const savedState = this.storageManager.getGameState();
        if (savedState) {
            this.model = GameModel.load(savedState);
        } else {
            this.model = new GameModel(1);
        }
    }

    forceRender() {
        const { renderFlag } = this.state;
        this.setState({ renderFlag: !renderFlag });
    }

    handleClick = (e, tileIndex) => {
        this.model.selectTileAt(tileIndex);
        this.storageManager.setGameState(this.model.serialize());
        this.forceRender();
    };

    handleUndo = () => {
        this.model.undoMove();
        this.forceRender();
    };

    handleNextLevel = (e) => {
        this.model = new GameModel(this.model.level + 1);
        this.storageManager.setGameState(this.model.serialize());
        this.forceRender();
    };

    handleNewGame = (e) => {
        this.storageManager.clearGameState();
        this.model = new GameModel(1);
        this.forceRender();
    };

    render() {
        return (
            <div className="main-container">
                <Header didClickNewGame={this.handleNewGame} />
                <hr className="divider" />
                <div className="gameboard">
                    <div className="stats">
                        <div>
                            Moves&nbsp;&nbsp;
                            <span>
                    {this.model.numMoves}
                    </span>
                        </div>
                        <div>
                            Level&nbsp;&nbsp;
                            <span>
                                {this.model.level}
                            </span>
                        </div>
                    </div>
                    {!this.model.levelCompleted ? (
                        <Grid tiles={this.model.grid.tiles} onTileClick={this.handleClick} />
                    ) : (
                        <MessageView onContinueButtonClick={this.handleNextLevel} />
                    )}
                    <div className="buttons">
                        <img src={undo} className="undo-button" onClick={this.handleUndo} />
                    </div>
                </div>
                <hr className="divider" />
                <Footer />
                <hr className="divider" />
                <p>Created by <a href="https://github.com/Marioqwe">Marioqwe</a></p>
            </div>
        );
    }
}

export default Game;
