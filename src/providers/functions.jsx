import moment from 'moment';
import axios from 'axios';

export const api = {
    space: 'on',
    apiKey: 'S89Fx2bxGxCgb3BleMqpq49MF8ZgkGQt6TxmxTx5scZk8tm8kqH1UwSJQvRqkNekUwhretxHu5',
    server_of: 'http://localhost/autouniverse/api/v1/api/',
    server_qa: 'http://qa-api.autouniversegh.com/v1/api/',
    server_on: 'http://api.autouniversegh.com/v1/api/'
}

export const initialize = () => {
    if (window.location.host.match(/localhost/i)) {
        api.space = 'of';
    } else if (window.location.host.match(/qa-/i)) {
        api.space = 'qa';
    } else {
        api.space = 'on';
    }
    api.apiURL = api[`server_${api.space}`];
    api.apiToken = getStorage('token');
}

export const app = {
    version: '1.0.0',
    dbpref: 'aua_'
}

export const dates = {
    yr: moment().format('YYYY')
}


// Storage
export const setStorage = (key, value) => {
    if (key && value) {
        localStorage.setItem(app.dbpref + key, value);
    }
}
export const getStorage = (key) => {
    const value = localStorage.getItem(app.dbpref + key);
    return value || '';
}
export const setStorageJson = (key, value) => {
    if (key && value) {
        localStorage.setItem(app.dbpref + key, JSON.stringify(value));
    }
}
export const getStorageJson = (key) => {
    if (key) {
        const value = localStorage.getItem(app.dbpref + key);
        return JSON.parse(value) || [];
    }
}
export const delStorage = (key) => {
    if (key) {
        localStorage.removeItem(app.dbpref + key);
    }
}


export const inArray = (needle, haystack) => {
    var length = haystack.length;
    for (var i = 0; i < length; i++) {
        if (haystack[i] === needle) return true;
    }
    return false;
}
export const mergeObj = (obj, src) => {
    for (var key in src) {
        if (src.hasOwnProperty(key)) obj[key] = src[key];
    }
    return obj;
}
export const getFileExtension = (filename) => {
    var ext = /^.+\.([^.]+)$/.exec(filename);
    return ext === null ? '' : ext[1];
}


// Data Request
initialize();
export const jsnData = (str) => {
    if (typeof str !== 'object') {
        var obj = {};
        var data = str.split('&');
        for (var key in data) {
            obj[data[key].split('=')[0]] = data[key].split('=')[1];
        }
        return obj;
    }
    return str;
}
export const serData = (obj) => {
    var str = [];
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
        }
    }
    return str.join('&');
}
export const apnData = (obj) => {
    const body = new FormData();
    for (var p in obj) {
        if (p === 'file') {
            body.append('file[0]', obj[p]);
        } else if (p === 'image') {
            body.append('image[0]', obj[p]);
        } else {
            body.append(p, obj[p]);
        }
    }
    return body;
}
export const post = async (action, data = {}, empty = false) => {
    let url = ((empty === false) ? api.apiURL + action : action);
    try {
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': api.apiKey + '.' + api.apiToken
            },
            body: JSON.stringify(data)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return { status: 606, result: 'Network request failed', error };
    }
}
export const get = async (action, data = {}, empty = false) => {
    let url = ((empty === false) ? api.apiURL + action : action);
    return axios({
        method: 'GET', url,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'x-access-token': api.apiKey + '.' + api.apiToken
        },
        params: data
    }).then(response => {
        const res = response.data;
        return res;
    }).catch(error => {
        return { status: 606, result: 'Network request failed', error };
    });
}
export const put = async (action, data = {}, empty = false) => {
    let url = ((empty === false) ? api.apiURL + action : action);
    try {
        let response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': api.apiKey + '.' + api.apiToken
            },
            body: JSON.stringify(data)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return { status: 606, result: 'Network request failed', error };
    }
}
export const delte = async (action) => {
    try {
        let response = await fetch(api.apiURL + action, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'x-access-token': api.apiKey + '.' + api.apiToken
            }
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return { status: 606, result: 'Network request failed', error: error };
    }
}
export const postFile = async (action, data = {}, empty = false) => {
    let url = ((empty === false) ? api.apiURL + action : action);
    try {
        // data['x-access-token'] = api.apiKey + '.' + api.apiToken;
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'x-access-token': api.apiKey + '.' + api.apiToken
            },
            body: apnData(data)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return { status: 606, result: 'Network request failed', error: error };
    }
}
export const getData = async (action, data = {}) => {
    try {
        const response = await fetch(api.apiURL + action, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        return response.json();
    }
    catch (error) {
        console.error(error);
    }
}

export const redirect = (to) => {
    window.location = to;
}

export const generateOptions = (length, step = 1) => {
    const arr = [];
    for (let value = 0; value < length; value += step) {
        arr.push(value);
    }
    return arr;
};

export const hasR = (role) => {
    let user = getStorageJson('user');
    let myRoles = ((user.role || {}).data || '').split(',');
    myRoles = ['*'];
    return (myRoles.includes(role) || myRoles.includes('*'));
};

export const chunk = (a, l) => {
    var results = [];

    while (a.length) {
        results.push(a.splice(0, l));
    }

    return results;
}