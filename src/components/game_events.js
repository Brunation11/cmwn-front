/* eslint-disable max-lines */
import _ from 'lodash';

import HttpManager from 'components/http_manager';
import Toast from 'components/toast';
import Log from 'components/log';
import GLOBALS from 'components/globals';

import Skribble from 'components/game_events/skribble';

const BAD_FLIP = 'There was a problem registering your earned flip. Please try again in a little while';

var mediaCache = {};

var resolveFinalMediaState = function (segments, result, parentItem = {}) {
    var url = GLOBALS.API_URL + 'media';
    var splitSegments = segments.split('/');
    var nextSegment = splitSegments.shift();
    var isBase = false;
    var item;

    if (result) parentItem.items = result._embedded.items;

    //cache hit.
    //if (mediaCache[segments] != null) return mediaCache[segments];

    //base case. we have results and no further segments to resolve
    if (!nextSegment && result != null) {
        mediaCache[segments] = parentItem;
        return Promise.resolve(parentItem);
    }

    if (result != null) {
        item = _.find(result._embedded.media, i => i.name === nextSegment);
        //api is inconsistent. The following line can be removed once this is rectified
        if (!item) item = _.find(result._embedded.items, i => i.name === nextSegment);
        if (!item) return Promise.reject('Error: 404, provided media path ' + nextSegment + ' does not exist');
        url += '/' + item.media_id;
    } else {
        //initial case. no results, need the base media folders
        splitSegments.unshift(nextSegment);
        if (mediaCache['__base'] != null) {
            return Promise.resolve(resolveFinalMediaState(splitSegments.join('/'), mediaCache['__base'], item));
        }
        isBase = true;
    }

    if (item && mediaCache[item.media_id] != null) {
        return Promise.resolve(resolveFinalMediaState(splitSegments.join('/'), mediaCache[item.media_id], item));
    } else {
        return HttpManager.GET(url).then(server => {
            var id = isBase ? '__base' : item.media_id;
            mediaCache[id] = server.response;
            return resolveFinalMediaState(splitSegments.join('/'), server.response, item);
        });
    }
};

export default function (eventPrefix, gameId, _links, exitCallback) {
    var submitFlip = function (flip) {
        if (!_links.flip.href) {
            return;
        }
        HttpManager.POST({url: _links.flip.href}, {'flip_id': flip}).catch(err => {
            Toast.error(BAD_FLIP);
            Log.log('Server refused flip update', err, flip);
        });
    };

    var events;

    const DEFAULT_EVENTS = {
        flipped: function (e) {
            submitFlip(e.gameData.id);
        },
        flip: function (e) {
            submitFlip(e.gameData.id);
        },
        save: function (e) {
            var version = e.gameData.version || 1;
            if (_links.save_game == null) {
                Log.error('Something went wrong. No game save url was provided. Game data will not be saved');
                return;
            }
            HttpManager.POST(this.props.saveUrl.replace('{game_id}', gameId),
                {data: e.gameData, version});
        },
        exit: function () {
            exitCallback({fullscreenFallback: false});
        },
        init: function () {
        },
        getData: function () {
        },
        setData: function () {
        },
        getMedia: function (e) {
            var respond = e.respond;
            console.log('Requested path ' + e.gameData.path);
            e.gameData = e.gameData || {};
            e.gameData.path = e.gameData.path || 'skribble/menu';
            resolveFinalMediaState(e.gameData.path)
                .then(response => respond(response))
                .catch(err => Log.error(err));
        },
        getFriends: function (e) {
            /* eslint-disable */
            e.respond({
                "user":[
                    {
                            "user_id":"",
                            "username":"",
                            "email":"",
                            "first_name":"",
                            "middle_name":null,
                            "last_name":"",
                            "gender":null,
                            "birthdate":null,
                            "meta":null,
                            "created":"-0001-11-30 00:00:00",
                            "updated":"2016-06-27 15:10:20",
                            "deleted":null,
                            "type":null,
                            "external_id":null,
                            "_links":{
                                 "self":{
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/"
                                 }
                            },
                            "scope":0
                    },
                    {
                            "user_id":"c5ba111a-276d-11e6-a84d-f14176c57b43",
                            "username":"awalzer",
                            "email":"adam@ginasink.com",
                            "first_name":"Adam",
                            "middle_name":null,
                            "last_name":"Walzer",
                            "gender":"male",
                            "birthdate":null,
                            "meta":[

                            ],
                            "created":"2016-05-31 20:25:09",
                            "updated":"2016-05-31 20:25:09",
                            "deleted":null,
                            "type":"ADULT",
                            "external_id":null,
                            "_links":{
                                 "self":{
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/c5ba111a-276d-11e6-a84d-f14176c57b43"
                                 },
                                 "profile":{
                                        "label":"Profile",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/c5ba111a-276d-11e6-a84d-f14176c57b43"
                                 },
                                 "user_image":{
                                        "label":"Profile Image",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/c5ba111a-276d-11e6-a84d-f14176c57b43\/image"
                                 },
                                 "forgot":{
                                        "label":"Forgot Password",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/forgot"
                                 }
                            },
                            "scope":-1
                    },
                    {
                            "user_id":"97398124-2806-11e6-87d5-7a0e3fc185fc",
                            "username":"neat-narwhal003",
                            "email":"neat-narwhal003@changemyworldnow.com",
                            "first_name":"AIDEN",
                            "middle_name":null,
                            "last_name":"VARGAS",
                            "gender":"M",
                            "birthdate":"2010-03-09 00:00:00",
                            "meta":{
                                 "GRD CD":"310",
                                 "GRD LVL":"0K",
                                 "STREET NUM":"92-07",
                                 "STREET":"101 AVENUE",
                                 "APT":"",
                                 "CITY":"OZONE PARK",
                                 "ST":"NY",
                                 "ZIP":"11416",
                                 "HOME PHONE":"(347)968-4024",
                                 "ADULT LAST 1":"VARGAS",
                                 "ADULT FIRST 1":"YUDELKA",
                                 "ADULT PHONE 1":"(347)968-4024",
                                 "ADULT LAST 2":"",
                                 "ADULT FIRST 2":"",
                                 "ADULT PHONE 2":"",
                                 "ADULT LAST 3":"",
                                 "ADULT FIRST 3":"",
                                 "ADULT PHONE 3":"",
                                 "STUDENT PHONE":"",
                                 "MEAL CDE":"A",
                                 "YTD ATTD PCT":"73"
                            },
                            "created":"2016-06-01 14:39:05",
                            "updated":"2016-06-01 15:03:05",
                            "deleted":null,
                            "type":"CHILD",
                            "external_id":"239274335",
                            "_links":{
                                 "self":{
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/97398124-2806-11e6-87d5-7a0e3fc185fc"
                                 },
                                 "profile":{
                                        "label":"Profile",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/97398124-2806-11e6-87d5-7a0e3fc185fc"
                                 },
                                 "user_image":{
                                        "label":"Profile Image",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/97398124-2806-11e6-87d5-7a0e3fc185fc\/image"
                                 },
                                 "user_flip":{
                                        "label":"My Earned Flips",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/97398124-2806-11e6-87d5-7a0e3fc185fc\/flip"
                                 },
                                 "reset":{
                                        "label":"Reset Password",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/97398124-2806-11e6-87d5-7a0e3fc185fc\/reset"
                                 }
                            },
                            "scope":-1
                    },
                    {
                            "user_id":"97462460-2806-11e6-a496-da715025fa06",
                            "username":"active-bison003",
                            "email":"active-bison003@changemyworldnow.com",
                            "first_name":"ALEJANDRO",
                            "middle_name":null,
                            "last_name":"BARREIROS",
                            "gender":"M",
                            "birthdate":"2006-02-14 00:00:00",
                            "meta":[

                            ],
                            "created":"2016-06-01 14:39:05",
                            "updated":"2016-06-01 20:27:52",
                            "deleted":null,
                            "type":"CHILD",
                            "external_id":"228312260",
                            "_links":{
                                 "self":{
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/97462460-2806-11e6-a496-da715025fa06"
                                 },
                                 "profile":{
                                        "label":"Profile",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/97462460-2806-11e6-a496-da715025fa06"
                                 },
                                 "user_image":{
                                        "label":"Profile Image",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/97462460-2806-11e6-a496-da715025fa06\/image"
                                 },
                                 "user_flip":{
                                        "label":"My Earned Flips",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/97462460-2806-11e6-a496-da715025fa06\/flip"
                                 },
                                 "reset":{
                                        "label":"Reset Password",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/97462460-2806-11e6-a496-da715025fa06\/reset"
                                 }
                            },
                            "scope":-1,
                            "_embedded":{
                                 "image":{
                                        "image_id":"profiles\/ht1squvpymnvtjqakpsd",
                                        "url":"https:\/\/res.cloudinary.com\/changemyworldnow\/image\/upload\/v1464795179\/profiles\/ht1squvpymnvtjqakpsd.jpg",
                                        "is_moderated":true,
                                        "type":null,
                                        "created":"2016-06-01T15:33:03+0000",
                                        "updated":"2016-06-01T15:35:11+0000",
                                        "deleted":null,
                                        "_links":[

                                        ]
                                 }
                            }
                    },
                    {
                            "user_id":"9754f774-2806-11e6-8206-43f6b175f045",
                            "username":"green-caterpillar003",
                            "email":"green-caterpillar003@changemyworldnow.com",
                            "first_name":"ANA",
                            "middle_name":null,
                            "last_name":"RAMLAGAN",
                            "gender":"F",
                            "birthdate":"2007-03-12 00:00:00",
                            "meta":{
                                 "GRD CD":"130",
                                 "GRD LVL":"03",
                                 "STREET NUM":"93-01",
                                 "STREET":"102 STREET",
                                 "APT":"",
                                 "CITY":"RICHMOND HILL",
                                 "ST":"NY",
                                 "ZIP":"11418",
                                 "HOME PHONE":"(718)322-1238",
                                 "ADULT LAST 1":"MANGRU",
                                 "ADULT FIRST 1":"PAMELA",
                                 "ADULT PHONE 1":"(646)538-0319",
                                 "ADULT LAST 2":"RAMLAGAN",
                                 "ADULT FIRST 2":"MICHAEL",
                                 "ADULT PHONE 2":"(917)482-1960",
                                 "ADULT LAST 3":"",
                                 "ADULT FIRST 3":"",
                                 "ADULT PHONE 3":"",
                                 "STUDENT PHONE":"",
                                 "MEAL CDE":"1",
                                 "YTD ATTD PCT":"100"
                            },
                            "created":"2016-06-01 14:39:05",
                            "updated":"2016-06-01 14:39:05",
                            "deleted":null,
                            "type":"CHILD",
                            "external_id":"233425644",
                            "_links":{
                                 "self":{
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/9754f774-2806-11e6-8206-43f6b175f045"
                                 },
                                 "profile":{
                                        "label":"Profile",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/9754f774-2806-11e6-8206-43f6b175f045"
                                 },
                                 "user_image":{
                                        "label":"Profile Image",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/9754f774-2806-11e6-8206-43f6b175f045\/image"
                                 },
                                 "user_flip":{
                                        "label":"My Earned Flips",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/9754f774-2806-11e6-8206-43f6b175f045\/flip"
                                 },
                                 "reset":{
                                        "label":"Reset Password",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/9754f774-2806-11e6-8206-43f6b175f045\/reset"
                                 }
                            },
                            "scope":-1
                    },
                    {
                            "user_id":"937b9e46-2806-11e6-b84a-33d3a3681a50",
                            "username":"ARobinson@schools.nyc.gov",
                            "email":"ARobinson@schools.nyc.gov",
                            "first_name":"Asia",
                            "middle_name":"",
                            "last_name":"Robinson",
                            "gender":"F",
                            "birthdate":null,
                            "meta":[

                            ],
                            "created":"2016-06-01 14:38:59",
                            "updated":"2016-06-01 15:16:34",
                            "deleted":null,
                            "type":"ADULT",
                            "external_id":null,
                            "_links":{
                                 "self":{
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/937b9e46-2806-11e6-b84a-33d3a3681a50"
                                 },
                                 "profile":{
                                        "label":"Profile",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/937b9e46-2806-11e6-b84a-33d3a3681a50"
                                 },
                                 "user_image":{
                                        "label":"Profile Image",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/937b9e46-2806-11e6-b84a-33d3a3681a50\/image"
                                 },
                                 "forgot":{
                                        "label":"Forgot Password",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/forgot"
                                 }
                            },
                            "scope":-1
                     },
                     {
                            "user_id":"964437d2-2806-11e6-b002-8eb532838af7",
                            "username":"CoolTeacher",
                            "email":"BKhan2@schools.nyc.gov",
                            "first_name":"Bibi",
                            "middle_name":null,
                            "last_name":"Khan",
                            "gender":"F",
                            "birthdate":null,
                            "meta":[

                            ],
                            "created":"2016-06-01 14:39:03",
                            "updated":"2016-06-06 16:56:58",
                            "deleted":null,
                            "type":"ADULT",
                            "external_id":null,
                            "_links":{
                                 "self":{
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/964437d2-2806-11e6-b002-8eb532838af7"
                                 },
                                 "profile":{
                                        "label":"Profile",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/964437d2-2806-11e6-b002-8eb532838af7"
                                 },
                                 "user_image":{
                                        "label":"Profile Image",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/964437d2-2806-11e6-b002-8eb532838af7\/image"
                                 },
                                 "forgot":{
                                        "label":"Forgot Password",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/forgot"
                                 }
                            },
                            "scope":-1,
                            "_embedded":{
                                 "image":{
                                        "image_id":"profiles\/glo1b53d1yclunvxxoah",
                                        "url":"https:\/\/res.cloudinary.com\/changemyworldnow\/image\/upload\/v1465231287\/profiles\/glo1b53d1yclunvxxoah.jpg",
                                        "is_moderated":true,
                                        "type":null,
                                        "created":"2016-06-06T16:41:29+0000",
                                        "updated":"2016-06-06T17:54:04+0000",
                                        "deleted":null,
                                        "_links":[

                                        ]
                                 }
                            }
                     },
                     {
                            "user_id":"767b8dfc-38c2-11e6-b09e-de497bd83ae2",
                            "username":"pleasant-penguin005",
                            "email":"pleasant-penguin005@changemyworldnow.com",
                            "first_name":"Blaise",
                            "middle_name":null,
                            "last_name":"Zabini",
                            "gender":"M",
                            "birthdate":"2001-01-01 00:00:00",
                            "meta":{
                                 "GRD CD":"",
                                 "GRD LVL":"",
                                 "STREET NUM":"",
                                 "STREET":"",
                                 "APT":"",
                                 "CITY":"",
                                 "ST":"",
                                 "ZIP":"",
                                 "HOME PHONE":"",
                                 "ADULT LAST 1":"",
                                 "ADULT FIRST 1":"",
                                 "ADULT PHONE 1":"",
                                 "ADULT LAST 2":"",
                                 "ADULT FIRST 2":"",
                                 "ADULT PHONE 2":"",
                                 "ADULT LAST 3":"",
                                 "ADULT FIRST 3":"",
                                 "ADULT PHONE 3":"",
                                 "STUDENT PHONE":"",
                                 "MEAL CDE":"",
                                 "YTD ATTD PCT":""
                            },
                            "created":"2016-06-22 21:44:14",
                            "updated":"2016-06-24 15:41:46",
                            "deleted":null,
                            "type":"CHILD",
                            "external_id":"543",
                            "_links":{
                                 "self":{
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/767b8dfc-38c2-11e6-b09e-de497bd83ae2"
                                 },
                                 "profile":{
                                        "label":"Profile",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/767b8dfc-38c2-11e6-b09e-de497bd83ae2"
                                 },
                                 "user_image":{
                                        "label":"Profile Image",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/767b8dfc-38c2-11e6-b09e-de497bd83ae2\/image"
                                 },
                                 "user_flip":{
                                        "label":"My Earned Flips",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/767b8dfc-38c2-11e6-b09e-de497bd83ae2\/flip"
                                 },
                                 "reset":{
                                        "label":"Reset Password",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/767b8dfc-38c2-11e6-b09e-de497bd83ae2\/reset"
                                 }
                            },
                            "scope":-1
                     },
                     {
                            "user_id":"955266c8-2806-11e6-afc0-367ccd1f01a1",
                            "username":"bward2@schools.nyc.gov",
                            "email":"bward2@schools.nyc.gov",
                            "first_name":"Brenda",
                            "middle_name":"",
                            "last_name":"Ward",
                            "gender":"F",
                            "birthdate":null,
                            "meta":[

                            ],
                            "created":"2016-06-01 14:39:02",
                            "updated":"2016-06-01 14:39:05",
                            "deleted":null,
                            "type":"ADULT",
                            "external_id":null,
                            "_links":{
                                 "self":{
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/955266c8-2806-11e6-afc0-367ccd1f01a1"
                                 },
                                 "profile":{
                                        "label":"Profile",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/955266c8-2806-11e6-afc0-367ccd1f01a1"
                                 },
                                 "user_image":{
                                        "label":"Profile Image",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/955266c8-2806-11e6-afc0-367ccd1f01a1\/image"
                                 },
                                 "forgot":{
                                        "label":"Forgot Password",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/forgot"
                                 }
                            },
                            "scope":-1
                     },
                     {
                            "user_id":"9759ebd0-2806-11e6-ac0d-055f2c24adff",
                            "username":"genuine-guppy002",
                            "email":"genuine-guppy002@changemyworldnow.com",
                            "first_name":"BRENT",
                            "middle_name":null,
                            "last_name":"LUDENA",
                            "gender":"M",
                            "birthdate":"2009-06-15 00:00:00",
                            "meta":{
                                 "GRD CD":"110",
                                 "GRD LVL":"01",
                                 "STREET NUM":"100-24",
                                 "STREET":"89 AVENUE",
                                 "APT":"1",
                                 "CITY":"RICHMOND HILL",
                                 "ST":"NY",
                                 "ZIP":"11418",
                                 "HOME PHONE":"(347)781-1471",
                                 "ADULT LAST 1":"GOZALEZ",
                                 "ADULT FIRST 1":"NORMA",
                                 "ADULT PHONE 1":"",
                                 "ADULT LAST 2":"",
                                 "ADULT FIRST 2":"",
                                 "ADULT PHONE 2":"",
                                 "ADULT LAST 3":"",
                                 "ADULT FIRST 3":"",
                                 "ADULT PHONE 3":"",
                                 "STUDENT PHONE":"",
                                 "MEAL CDE":"1",
                                 "YTD ATTD PCT":"100"
                            },
                            "created":"2016-06-01 14:39:05",
                            "updated":"2016-06-01 14:39:05",
                            "deleted":null,
                            "type":"CHILD",
                            "external_id":"203638457",
                            "_links":{
                                 "self":{
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/9759ebd0-2806-11e6-ac0d-055f2c24adff"
                                 },
                                 "profile":{
                                        "label":"Profile",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/9759ebd0-2806-11e6-ac0d-055f2c24adff"
                                 },
                                 "user_image":{
                                        "label":"Profile Image",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/9759ebd0-2806-11e6-ac0d-055f2c24adff\/image"
                                 },
                                 "user_flip":{
                                        "label":"My Earned Flips",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/9759ebd0-2806-11e6-ac0d-055f2c24adff\/flip"
                                 },
                                 "reset":{
                                        "label":"Reset Password",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/9759ebd0-2806-11e6-ac0d-055f2c24adff\/reset"
                                 }
                            },
                            "scope":-1
                     },
                     {
                            "user_id":"974c5e48-2806-11e6-9fd6-6b1a79c333c3",
                            "username":"smart-jaguar005",
                            "email":"smart-jaguar005@changemyworldnow.com",
                            "first_name":"BRIANNA",
                            "middle_name":null,
                            "last_name":"ZUMAETA",
                            "gender":"F",
                            "birthdate":"2006-12-29 00:00:00",
                            "meta":{
                                 "GRD CD":"140",
                                 "GRD LVL":"04",
                                 "STREET NUM":"95-05",
                                 "STREET":"97 AVENUE",
                                 "APT":"PVT",
                                 "CITY":"OZONE PARK",
                                 "ST":"NY",
                                 "ZIP":"11416",
                                 "HOME PHONE":"(347)426-8326",
                                 "ADULT LAST 1":"ZUMAETA",
                                 "ADULT FIRST 1":"MERCEDES",
                                 "ADULT PHONE 1":"(347)824-6766",
                                 "ADULT LAST 2":"ZUMAETA",
                                 "ADULT FIRST 2":"JEAN XAVIER",
                                 "ADULT PHONE 2":"",
                                 "ADULT LAST 3":"ZUMAETA",
                                 "ADULT FIRST 3":"MIRIAM",
                                 "ADULT PHONE 3":"(718)835-6837",
                                 "STUDENT PHONE":"",
                                 "MEAL CDE":"1",
                                 "YTD ATTD PCT":"94"
                            },
                            "created":"2016-06-01 14:39:05",
                            "updated":"2016-06-01 14:39:05",
                            "deleted":null,
                            "type":"CHILD",
                            "external_id":"227319472",
                            "_links":{
                                 "self":{
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/974c5e48-2806-11e6-9fd6-6b1a79c333c3"
                                 },
                                 "profile":{
                                        "label":"Profile",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/974c5e48-2806-11e6-9fd6-6b1a79c333c3"
                                 },
                                 "user_image":{
                                        "label":"Profile Image",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/974c5e48-2806-11e6-9fd6-6b1a79c333c3\/image"
                                 },
                                 "user_flip":{
                                        "label":"My Earned Flips",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/974c5e48-2806-11e6-9fd6-6b1a79c333c3\/flip"
                                 },
                                 "reset":{
                                        "label":"Reset Password",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/974c5e48-2806-11e6-9fd6-6b1a79c333c3\/reset"
                                 }
                            },
                            "scope":-1
                     },
                     {
                            "user_id":"c60c6212-276d-11e6-8318-a6af8699cada",
                            "username":"bzatta",
                            "email":"bruno@ginasink.com",
                            "first_name":"Bruno",
                            "middle_name":null,
                            "last_name":"Zatta",
                            "gender":"male",
                            "birthdate":null,
                            "meta":[

                            ],
                            "created":"2016-05-31 20:25:09",
                            "updated":"2016-06-01 19:44:09",
                            "deleted":null,
                            "type":"ADULT",
                            "external_id":null,
                            "_links":{
                                 "self":{
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/c60c6212-276d-11e6-8318-a6af8699cada"
                                 },
                                 "profile":{
                                        "label":"Profile",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/c60c6212-276d-11e6-8318-a6af8699cada"
                                 },
                                 "user_image":{
                                        "label":"Profile Image",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/c60c6212-276d-11e6-8318-a6af8699cada\/image"
                                 },
                                 "forgot":{
                                        "label":"Forgot Password",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/forgot"
                                 }
                            },
                            "scope":-1
                     },
                     {
                            "user_id":"961c9cfe-2806-11e6-945f-adce6053946a",
                            "username":"CLeone4@schools.nyc.gov",
                            "email":"CLeone4@schools.nyc.gov",
                            "first_name":"Celia",
                            "middle_name":"",
                            "last_name":"Leone",
                            "gender":"F",
                            "birthdate":null,
                            "meta":[

                            ],
                            "created":"2016-06-01 14:39:03",
                            "updated":"2016-06-01 14:39:05",
                            "deleted":null,
                            "type":"ADULT",
                            "external_id":null,
                            "_links":{
                                 "self":{
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/961c9cfe-2806-11e6-945f-adce6053946a"
                                 },
                                 "profile":{
                                        "label":"Profile",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/961c9cfe-2806-11e6-945f-adce6053946a"
                                 },
                                 "user_image":{
                                        "label":"Profile Image",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/961c9cfe-2806-11e6-945f-adce6053946a\/image"
                                 },
                                 "forgot":{
                                        "label":"Forgot Password",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/forgot"
                                 }
                            },
                            "scope":-1
                     },
                     {
                            "user_id":"932bd208-2806-11e6-a193-3340320e0b83",
                            "username":"CLawson3@schools.nyc.gov",
                            "email":"CLawson3@schools.nyc.gov",
                            "first_name":"Charity",
                            "middle_name":"",
                            "last_name":"Lawson",
                            "gender":"F",
                            "birthdate":null,
                            "meta":[

                            ],
                            "created":"2016-06-01 14:38:58",
                            "updated":"2016-06-20 15:46:43",
                            "deleted":null,
                            "type":"ADULT",
                            "external_id":null,
                            "_links":{
                                 "self":{
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/932bd208-2806-11e6-a193-3340320e0b83"
                                 },
                                 "profile":{
                                        "label":"Profile",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/932bd208-2806-11e6-a193-3340320e0b83"
                                 },
                                 "user_image":{
                                        "label":"Profile Image",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/932bd208-2806-11e6-a193-3340320e0b83\/image"
                                 },
                                 "forgot":{
                                        "label":"Forgot Password",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/forgot"
                                 }
                            },
                            "scope":-1
                     },
                     {
                            "user_id":"c5901aae-276d-11e6-ab50-1dc44afbaee4",
                            "username":"manchuck",
                            "email":"chuck@ginasink.com",
                            "first_name":"Chuck",
                            "middle_name":null,
                            "last_name":"Reeves",
                            "gender":"male",
                            "birthdate":null,
                            "meta":[

                            ],
                            "created":"2016-05-31 20:25:09",
                            "updated":"2016-05-31 21:24:51",
                            "deleted":null,
                            "type":"ADULT",
                            "external_id":null,
                            "_links":{
                                 "self":{
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/c5901aae-276d-11e6-ab50-1dc44afbaee4"
                                 },
                                 "profile":{
                                        "label":"Profile",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/c5901aae-276d-11e6-ab50-1dc44afbaee4"
                                 },
                                 "user_image":{
                                        "label":"Profile Image",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/c5901aae-276d-11e6-ab50-1dc44afbaee4\/image"
                                 },
                                 "forgot":{
                                        "label":"Forgot Password",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/forgot"
                                 }
                            },
                            "scope":-1
                     },
                     {
                            "user_id":"761dd072-38c2-11e6-868c-b684063e0c11",
                            "username":"teacher2@changemyworldnow.com",
                            "email":"teacher2@changemyworldnow.com",
                            "first_name":"Cuthbert",
                            "middle_name":"",
                            "last_name":"Binns",
                            "gender":"M",
                            "birthdate":null,
                            "meta":[

                            ],
                            "created":"2016-06-22 21:44:13",
                            "updated":"2016-06-22 21:44:14",
                            "deleted":null,
                            "type":"ADULT",
                            "external_id":null,
                            "_links":{
                                 "self":{
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/761dd072-38c2-11e6-868c-b684063e0c11"
                                 },
                                 "profile":{
                                        "label":"Profile",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/761dd072-38c2-11e6-868c-b684063e0c11"
                                 },
                                 "user_image":{
                                        "label":"Profile Image",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/761dd072-38c2-11e6-868c-b684063e0c11\/image"
                                 },
                                 "forgot":{
                                        "label":"Forgot Password",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/forgot"
                                 }
                            },
                            "scope":-1
                     },
                     {
                            "user_id":"93cb6e8a-2806-11e6-bb2c-339595add339",
                            "username":"DAltman3@schools.nyc.gov",
                            "email":"DAltman3@schools.nyc.gov",
                            "first_name":"David",
                            "middle_name":"",
                            "last_name":"Altman",
                            "gender":"M",
                            "birthdate":null,
                            "meta":[

                            ],
                            "created":"2016-06-01 14:38:59",
                            "updated":"2016-06-01 14:39:05",
                            "deleted":null,
                            "type":"ADULT",
                            "external_id":null,
                            "_links":{
                                 "self":{
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/93cb6e8a-2806-11e6-bb2c-339595add339"
                                 },
                                 "profile":{
                                        "label":"Profile",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/93cb6e8a-2806-11e6-bb2c-339595add339"
                                 },
                                 "user_image":{
                                        "label":"Profile Image",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/93cb6e8a-2806-11e6-bb2c-339595add339\/image"
                                 },
                                 "forgot":{
                                        "label":"Forgot Password",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/forgot"
                                 }
                            },
                            "scope":-1
                     },
                     {
                            "user_id":"97534136-2806-11e6-91a4-134bc1c9f703",
                            "username":"silly-bison003",
                            "email":"silly-bison003@changemyworldnow.com",
                            "first_name":"DILRAAJ",
                            "middle_name":null,
                            "last_name":"MINHAS",
                            "gender":"M",
                            "birthdate":"2007-12-29 00:00:00",
                            "meta":{
                                 "GRD CD":"953",
                                 "GRD LVL":"02",
                                 "STREET NUM":"100-25",
                                 "STREET":"90 AVENUE",
                                 "APT":"2FL",
                                 "CITY":"RICHMOND HILL",
                                 "ST":"NY",
                                 "ZIP":"11418",
                                 "HOME PHONE":"(631)703-0510",
                                 "ADULT LAST 1":"KAUR",
                                 "ADULT FIRST 1":"HARJIT",
                                 "ADULT PHONE 1":"",
                                 "ADULT LAST 2":"",
                                 "ADULT FIRST 2":"",
                                 "ADULT PHONE 2":"",
                                 "ADULT LAST 3":"",
                                 "ADULT FIRST 3":"",
                                 "ADULT PHONE 3":"",
                                 "STUDENT PHONE":"",
                                 "MEAL CDE":"A",
                                 "YTD ATTD PCT":"94"
                            },
                            "created":"2016-06-01 14:39:05",
                            "updated":"2016-06-01 14:39:05",
                            "deleted":null,
                            "type":"CHILD",
                            "external_id":"215624834",
                            "_links":{
                                 "self":{
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/97534136-2806-11e6-91a4-134bc1c9f703"
                                 },
                                 "profile":{
                                        "label":"Profile",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/97534136-2806-11e6-91a4-134bc1c9f703"
                                 },
                                 "user_image":{
                                        "label":"Profile Image",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/97534136-2806-11e6-91a4-134bc1c9f703\/image"
                                 },
                                 "user_flip":{
                                        "label":"My Earned Flips",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/97534136-2806-11e6-91a4-134bc1c9f703\/flip"
                                 },
                                 "reset":{
                                        "label":"Reset Password",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/97534136-2806-11e6-91a4-134bc1c9f703\/reset"
                                 }
                            },
                            "scope":-1
                     },
                     {
                            "user_id":"973c468e-2806-11e6-a584-d611bd62828d",
                            "username":"nice-shark004",
                            "email":"nice-shark004@changemyworldnow.com",
                            "first_name":"ELISHA",
                            "middle_name":null,
                            "last_name":"MOSES",
                            "gender":"M",
                            "birthdate":"2011-04-01 00:00:00",
                            "meta":{
                                 "GRD CD":"350",
                                 "GRD LVL":"PK",
                                 "STREET NUM":"100-05",
                                 "STREET":"88 AVENUE",
                                 "APT":"2",
                                 "CITY":"RICHMOND HILL",
                                 "ST":"NY",
                                 "ZIP":"11418",
                                 "HOME PHONE":"(347)206-5010",
                                 "ADULT LAST 1":"MOSES",
                                 "ADULT FIRST 1":"TERRY",
                                 "ADULT PHONE 1":"",
                                 "ADULT LAST 2":"",
                                 "ADULT FIRST 2":"",
                                 "ADULT PHONE 2":"",
                                 "ADULT LAST 3":"",
                                 "ADULT FIRST 3":"",
                                 "ADULT PHONE 3":"",
                                 "STUDENT PHONE":"",
                                 "MEAL CDE":"A",
                                 "YTD ATTD PCT":"84"
                            },
                            "created":"2016-06-01 14:39:05",
                            "updated":"2016-06-03 17:46:51",
                            "deleted":null,
                            "type":"CHILD",
                            "external_id":"239274509",
                            "_links":{
                                 "self":{
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/973c468e-2806-11e6-a584-d611bd62828d"
                                 },
                                 "profile":{
                                        "label":"Profile",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/973c468e-2806-11e6-a584-d611bd62828d"
                                 },
                                 "user_image":{
                                        "label":"Profile Image",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/973c468e-2806-11e6-a584-d611bd62828d\/image"
                                 },
                                 "user_flip":{
                                        "label":"My Earned Flips",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/973c468e-2806-11e6-a584-d611bd62828d\/flip"
                                 },
                                 "reset":{
                                        "label":"Reset Password",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/973c468e-2806-11e6-a584-d611bd62828d\/reset"
                                 }
                            },
                            "scope":-1
                     },
                     {
                            "user_id":"7674ce2c-38c2-11e6-88e4-05c037349579",
                            "username":"loyal-tiger002",
                            "email":"loyal-tiger002@changemyworldnow.com",
                            "first_name":"Emily",
                            "middle_name":null,
                            "last_name":"McLean",
                            "gender":"F",
                            "birthdate":"2001-01-01 00:00:00",
                            "meta":{
                                 "GRD CD":"",
                                 "GRD LVL":"",
                                 "STREET NUM":"",
                                 "STREET":"",
                                 "APT":"",
                                 "CITY":"",
                                 "ST":"",
                                 "ZIP":"",
                                 "HOME PHONE":"",
                                 "ADULT LAST 1":"",
                                 "ADULT FIRST 1":"",
                                 "ADULT PHONE 1":"",
                                 "ADULT LAST 2":"",
                                 "ADULT FIRST 2":"",
                                 "ADULT PHONE 2":"",
                                 "ADULT LAST 3":"",
                                 "ADULT FIRST 3":"",
                                 "ADULT PHONE 3":"",
                                 "STUDENT PHONE":"",
                                 "MEAL CDE":"",
                                 "YTD ATTD PCT":""
                            },
                            "created":"2016-06-22 21:44:14",
                            "updated":"2016-06-22 21:44:14",
                            "deleted":null,
                            "type":"CHILD",
                            "external_id":"5432",
                            "_links":{
                                 "self":{
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/7674ce2c-38c2-11e6-88e4-05c037349579"
                                 },
                                 "profile":{
                                        "label":"Profile",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/7674ce2c-38c2-11e6-88e4-05c037349579"
                                 },
                                 "user_image":{
                                        "label":"Profile Image",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/7674ce2c-38c2-11e6-88e4-05c037349579\/image"
                                 },
                                 "user_flip":{
                                        "label":"My Earned Flips",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/7674ce2c-38c2-11e6-88e4-05c037349579\/flip"
                                 },
                                 "reset":{
                                        "label":"Reset Password",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/7674ce2c-38c2-11e6-88e4-05c037349579\/reset"
                                 }
                            },
                            "scope":-1
                     },
                     {
                            "user_id":"c5f13c3a-276d-11e6-a207-8c8b9265cffb",
                            "username":"emclean",
                            "email":"emily@ginasink.com",
                            "first_name":"Emily",
                            "middle_name":null,
                            "last_name":"Mclean",
                            "gender":"female",
                            "birthdate":null,
                            "meta":[

                            ],
                            "created":"2016-05-31 20:25:09",
                            "updated":"2016-05-31 20:25:09",
                            "deleted":null,
                            "type":"ADULT",
                            "external_id":null,
                            "_links":{
                                 "self":{
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/c5f13c3a-276d-11e6-a207-8c8b9265cffb"
                                 },
                                 "profile":{
                                        "label":"Profile",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/c5f13c3a-276d-11e6-a207-8c8b9265cffb"
                                 },
                                 "user_image":{
                                        "label":"Profile Image",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/user\/c5f13c3a-276d-11e6-a207-8c8b9265cffb\/image"
                                 },
                                 "forgot":{
                                        "label":"Forgot Password",
                                        "href":"https:\/\/api-dev.changemyworldnow.com\/forgot"
                                 }
                            },
                            "scope":-1
                     }
                ]
            });
            /* eslint-enable */
        }
    };

    events = DEFAULT_EVENTS;
    if (gameId === 'skribble') {
        events = _.defaults(Skribble, events);
    }
    return _.reduce(events, (a, v, k) => {
        a[eventPrefix + _.upperFirst(k)] = v;
        return a;
    }, {});
}
