import { SET_SITE_LANG, SET_PAGE_TITLE, SET_PAGE_SUB_TITLE, SET_SET_SETTINGS } from '../_types';
import * as func from '../../providers/functions';

const initialState = {
    pageTitle: 'AutoUniverse',
    pageSubTitle: '',
    lang: 'en',

    carparts: func.getStorageJson('carparts'),
    locations: func.getStorageJson('locations'),
    settings: func.getStorageJson('settings'),

    navigation: {
        items: [
            {
                name: 'Dashboard',
                url: '/dashboard',
                icon: 'icon-speedometer'
            },
            {
                name: 'Auto Parts',
                url: '/autoparts',
                icon: 'icon-wrench',
                children: [
                    { name: 'Dealers', url: '/autoparts/dealers' },
                    { name: 'AutoParts', url: '/autoparts/autoparts' },
                    { name: 'Orders', url: '/autoparts/order' },
                ]
            },
            {
                name: 'Mechanics',
                url: '/mechanics',
                icon: 'icon-anchor',
                children: [
                    { name: 'Mechanics', url: '/mechanics' },
                    { name: 'Orders', url: '/mechanics/orders' }
                ]
            },
            {
                name: 'Emergencies',
                url: '/emergencies',
                icon: 'icon-fire',
                children: [
                    { name: 'Emergency Services', url: '/emergencies' },
                    { name: 'Manage Categories', url: '/emergencies/categories' },
                    { name: 'Orders', url: '/emergencies/orders' }
                ]
            },
            {
                name: 'Auto Services',
                url: '/autoservices',
                icon: 'icon-cursor',
                children: [
                    { name: 'Other Auto Services', url: '/autoservices' },
                    { name: 'Manage Categories', url: '/autoservices/categories' },
                    { name: 'Orders', url: '/autoservices/orders' }
                ]
            },
            {
                name: 'Expert Advice',
                url: '/expertadvices',
                icon: 'icon-speedometer',
                children: [
                    { name: 'Expert advice', url: '/expertadvices' },
                    { name: 'Manage Categories', url: '/expertadvices/categories' }
                ]
            },
            {
                name: 'Users',
                url: '/users',
                icon: 'icon-user',
                children: [
                    { name: 'Normal users', url: '/users/normal' },
                    { name: 'Admin users', url: '/users/admin' }
                ]
            },
            {
                name: 'Reports',
                url: '/reports',
                icon: 'icon-chart',
                children: [
                    { name: 'Subscriptions', url: '/reports/subscriptions' },
                    { name: 'Rating', url: '/reports/rating' },
                    { name: 'Auto parts dealers', url: '/reports/dealers' },
                    { name: 'Join date', url: '/reports/joindate' },
                    { name: 'Views', url: '/reports/views' },
                    { name: 'Orders', url: '/reports/orders' }
                ]
            },
            {
                name: 'Setup',
                url: '/setup',
                icon: 'icon-settings',
                children: [
                    { name: 'Subscriptions', url: '/setup/subscriptions' }
                ]
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