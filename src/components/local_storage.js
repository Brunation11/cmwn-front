'use strict';

var Storage = function () {
    var data;

    function setData(newData) {
        data = JSON.stringify(newData);
        window.name = data;
    }

    function clearData() {
        window.name = '';
    }

    function getData() {
        var newData = window.name;
        return newData ? JSON.parse(newData) : {};
    }

    // initialise if there's already data
    data = getData();

    function numKeys() {
        var k;
        var n = 0;
        for (k in data) {
            if (data.hasOwnProperty(k)) n += 1;
        }
        return n;
    }

    return {
        clear: function () {
            data = {};
            clearData();
            this.length = numKeys();
        },
        getItem: function (key) {
            key = encodeURIComponent(key);
            return data[key] === undefined ? null : data[key];
        },
        key: function (i) {
            var k;
            var ctr = 0;
            for (k in data) {
                if (ctr === i) return decodeURIComponent(k);
                else ctr++;
            }
            return null;
        },
        removeItem: function (key) {
            key = encodeURIComponent(key);
            delete data[key];
            setData(data);
            this.length = numKeys();
        },
        setItem: function (key, value) {
            key = encodeURIComponent(key);
            data[key] = String(value);
            setData(data);
            this.length = numKeys();
        },
        length: 0
    };
};

var setStorage = function () {
    window._localStorage = new Storage();
    window._sessionStorage = new Storage();
};


var LocalStorage = {
    polyfill: function () {
        try {
            //will fail in private safari
            window.localStorage.setItem('testKey', '1');
            window.localStorage.removeItem('testKey');
        } catch(error) {
            setStorage();
        }
    },
    testDom: function () {
        var localStorage = {
            cmwn_token: '', //eslint-disable-line camelcase
            setItem: function (key, val) {
                this[key] = val;
            },
            getItem: function () {
                return '';
            }
        };

        try {
            global.window.localStorage = localStorage; //eslint-disable-line no-undef
        } catch(error) {
            global.window._localStorage = localStorage; //eslint-disable-line no-undef
        }
    },
    getItem: function (key) {
        var item;
        try {
            item = window.localStorage.getItem(key);
        } catch(error) {
            item = window._localStorage.getItem(key);
        }
        return item;
    },
    setItem: function (key, value) {
        try {
            window.localStorage.setItem(key, value);
        } catch(error) {
            window._localStorage.setItem(key, value);
        }
    },
    storage: function () {
        var storage;
        try {
            storage = window.localStorage;
        } catch(error) {
            storage = window._localStorage;
        }
        return storage;
    }
};

export default LocalStorage;
