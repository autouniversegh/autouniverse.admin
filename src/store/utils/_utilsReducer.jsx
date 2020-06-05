import { SET_SITE_LANG, SET_PAGE_TITLE, SET_PAGE_SUB_TITLE, SET_SET_SETTINGS } from '../_types';
import * as func from '../../providers/functions';

const initialState = {
    pageTitle: 'Auto Universe',
    pageSubTitle: '',
    lang: 'en',

    cars: func.getStorageJson('cars'),
    settings: func.getStorageJson('settings'),
    locations: func.getStorageJson('locations'),

    navigation: {
        items: [
            {
                name: 'Dashboard', url: '/dashboard', icon: 'icon-speedometer', code: ''
            },
            {
                name: 'Auto Parts', url: '/autoparts', icon: 'icon-wrench', code: 'itm',
                children: [
                    { name: 'Manage Dealers', url: '/autoparts/dealers', code: 'del' },
                    { name: 'Manage AutoParts', url: '/autoparts/autoparts', code: 'itm' },
                ]
            },
            {
                name: 'Mechanics', url: '/mechanics', icon: 'icon-anchor', code: 'mec',
                childrens: [
                    { name: 'Mechanics', url: '/mechanics', code: 'mec' },
                ]
            },
            {
                name: 'Emergencies', url: '/emergencies', icon: 'icon-fire', code: 'emg',
                children: [
                    { name: 'Manage Emergencies', url: '/emergencies', code: 'emg' },
                    { name: 'Manage Categories', url: '/emergencies/categories', code: 'emg_ctg' }
                ]
            },
            {
                name: 'Other Services', url: '/otherservices', icon: 'icon-cursor', code: 'aut',
                children: [
                    { name: 'Other Services', url: '/otherservices', code: 'aut' },
                    { name: 'Manage Categories', url: '/otherservices/categories', code: 'aut_ctg' },
                ]
            },
            {
                name: 'Expert Advice', url: '/expertadvices', icon: 'icon-speedometer', code: 'adv',
                children: [
                    { name: 'Expert advice', url: '/expertadvices', code: 'adv' },
                    { name: 'Manage Categories', url: '/expertadvices/categories', code: 'adv_ctg' }
                ]
            },
            {
                name: 'Users', url: '/users', icon: 'icon-user', code: 'usr',
                children: [
                    { name: 'Normal users', url: '/users/normal', code: 'usr_nom' },
                    { name: 'User access', url: '/users/access', code: 'usr_acc' },
                    { name: 'Admin users', url: '/users/admin', code: 'usr_adm' }
                ]
            },
            {
                name: 'Reports', url: '/reports', icon: 'icon-chart', code: 'rep',
                children: [
                    { name: 'Subscriptions', url: '/reports/subscriptions', code: 'rep_subs' },
                    { name: 'Reviews', url: '/reports/reviews', code: 'rep_rev' },
                    { name: 'Auto parts dealers', url: '/reports/dealers', code: 'rep_del' },
                    { name: 'Join date', url: '/reports/joindate', code: 'rep_join' },
                    { name: 'Views', url: '/reports/views', code: 'rep_views' },
                    { name: 'Orders', url: '/reports/orders', code: 'rep_orders' }
                ]
            },
            {
                name: 'Setup', url: '/setup', icon: 'icon-settings', code: 'set',
                children: [
                    { name: 'Subscriptions', url: '/setup/subscriptions', code: 'set_sub', },
                    { name: 'Services Description', url: '/setup/descriptions', code: 'set_desc', }
                ]
            },
            {
                name: 'Gallery', url: '/gallery', icon: 'fa fa-image', code: 'gal'
            },
        ]
    }
};

const utilsReducer = (state = initialState, action) => {
    switch (action.type) {
        default:
            return state;

        case SET_PAGE_TITLE:
            return {
                ...state,
                pageTitle: action.title
            }

        case SET_PAGE_SUB_TITLE:
            return {
                ...state,
                pageSubTitle: action.title
            };

        case SET_SITE_LANG:
            return {
                ...state,
                lang: action.lang
            };

        case SET_SET_SETTINGS:
            return {
                ...state,
                [action.key]: action.value
            };
    }
};


export default utilsReducer;