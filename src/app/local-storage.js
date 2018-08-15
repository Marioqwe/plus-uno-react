window.fakeStorage = {
    _data: {},
    setItem: function (id, val) {
        return this._data[id] = String(val);
    },
    getItem: function (id) {
        return this._data.hasOwnProperty(id) ? this._data[id] : undefined;
    },
    removeItem: function (id) {
        return delete this._data[id];
    },
    clear: function () {
        return this._data = {};
    }
};

const localStorageSupported = () => {
    const testKey = 'test';
    const storage = window.localStorage;
    try {
        storage.setItem(testKey, '1');
        storage.removeItem(testKey);
        return true;
    } catch (error) {
        return false;
    }
};

export default class LocalStorageManager {
    constructor() {
        this.gameStateKey = 'gameStateKey';
        this.tutorialStateKey = 'tutorialStateKey';
        this.storage = localStorageSupported() ? window.localStorage : window.fakeStorage;
    }

    getTutorialState() {
        return this.storage.getItem(this.tutorialStateKey);
    }

    setTutorialState() {
        this.storage.setItem(this.tutorialStateKey, '1');
    }

    getGameState() {
        const stateJSON = this.storage.getItem(this.gameStateKey);
        return stateJSON ? JSON.parse(stateJSON) : null;
    }

    setGameState(gameState) {
        this.storage.setItem(this.gameStateKey, JSON.stringify(gameState));
    }

    clearGameState() {
        this.storage.removeItem(this.gameStateKey);
    }
}
