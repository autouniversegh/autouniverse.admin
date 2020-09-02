/* eslint-disable array-callback-return */
import moment from 'moment';
import axios from 'axios';

export const api = {
    space: 'qa',
    headers: {},
    headersFile: {},

    key_of: 'S89Fx2bxGxCgb3BleMqpq49MF8ZgkGQt1TxmxTx5scZk8tm8kqH1UwSJQvRqkNekUwhretxHu1',
    key_qa: 'S89Fx2bxGxCgb3BleMqpq49MF8ZgkGQt4TxmxTx5scZk8tm8kqH1UwSJQvRqkNekUwhretxHu4',
    key_on: 'S89Fx2bxGxCgb3BleMqpq49MF8ZgkGQt6TxmxTx5scZk8tm8kqH1UwSJQvRqkNekUwhretxHu6',

    server_of: 'http://localhost/autouniverse/api/v1/',
    server_qa: 'http://qa-api.autouniversegh.com/v1/',
    server_on: 'http://api.autouniversegh.com/v1/',

    platform_of: 'localhost',
    platform_qa: 'qa-admin.autouniversegh.com',
    platform_on: 'admin.autouniversegh.com',
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
    api.apiKey = api[`key_${api.space}`];
    api.apiPlatform = api[`platform_${api.space}`];
    api.apiToken = getStorage('token');

    api.headers = {
        'Platform': `${api.apiPlatform}/${app.version}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'buv-access-token': api.apiKey + '.' + api.apiToken
    };
    api.headersFile = {
        'Platform': `${api.apiPlatform}/${app.version}`,
        'Accept': 'application/json',
        'buv-access-token': api.apiKey + '.' + api.apiToken
    };
}

export const app = {
    version: '1.0.0',
    dbpref: 'aua_'
}

export const dates = {
    yr: moment().format('YYYY'),
    td: moment().format('YYYY-MM-DD')
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
    let body = new FormData();
    for (var p in obj) {
        if (p === 'file') {
            body.append('file[0]', obj[p]);
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
            headers: api.headers,
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
        headers: api.headers,
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
            headers: api.headers,
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
            headers: api.headers
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return { status: 606, result: 'Network request failed', error: error };
    }
}
export const postFile = async (action, data = {}) => {
    try {
        let response = await fetch(api.apiURL + action, {
            method: 'POST',
            headers: api.headersFile,
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

export const locationOptions = (locations) => {
    let lptions = [];
    Object.keys(locations).map(region => {
        let cities = [];
        Object.keys(locations[region]).map(city => {
            let areas = [];
            locations[region][city].areas.map(area => {
                areas.push({ value: area, label: area });
            });
            cities.push({ value: city, label: city, children: areas });
        });
        lptions.push({ value: region, label: region, children: cities });
    });
    return lptions;
}

export const hasR = (role) => {
    let user = getStorageJson('user');
    let myRoles = ((user.access || {}).access || '').split(',');
    // myRoles = ['mec', 'aut', 'delss'];
    return (myRoles.includes(role) || myRoles.includes('*'));
};

export const chunk = (a, l) => {
    return new Promise(function (resolve) {
        var results = [];
        while (a.length) {
            results.push(a.splice(0, l));
        }
        resolve(results);
    });
}