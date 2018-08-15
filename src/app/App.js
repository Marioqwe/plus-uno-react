import React from 'react';

import Game from './components/Game';
import Tutorial from './components/Tutorial';
import LocalStorageManager from "./local-storage";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            didCompleteTutorial: false,
        };
        this.storageManager = new LocalStorageManager();
        this.handleCompleteTutorial = this.handleCompleteTutorial.bind(this);
    }

    handleCompleteTutorial() {
        this.setState({ didCompleteTutorial: true });
        this.storageManager.setTutorialState();
    }

    render() {
        if (this.storageManager.getTutorialState()) {
            return <Game />;
        } else {
            return <Tutorial onCompleteTutorial={this.handleCompleteTutorial}/>;
        }
    }
}

export default App;
