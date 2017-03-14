'use strict';

/* Services */

angular.module('services', ['ngResource'], function ($provide) {

    $provide.factory('Data', function ($resource) {
        return $resource('/assets/config', {}, {
            get: {url:'/data/get/aes', method: 'GET', isArray: false, crypt: true},
            query: {url:'/data/query', method: 'GET', isArray: false, crypt: true},
            queryNoDecrypt: {url:'/data/query', method: 'GET', isArray: false, crypt: true, decrypt: false},
            queryFullCrypt: {url:'/data/query', method: 'GET', isArray: false, fullcryptquery:true},
            queryNoCrypt: {url:'/data/get/aes', method: 'GET'},
            save: {url:'/data', method: 'POST', crypt: true},
            saveNoCrypt: {url:'/data', method: 'POST'},
            saveEnCrypt: {url:'/data', method: 'POST',  isArray: true, fullcryptbody:true,
                transformResponse: function (data, headers) {
                    return [{ body: data }];
                    //return data;
                }
            },
            saveDeCrypt: {url:'/data/decrypt', method: 'POST',  isArray: false, fullcryptbody:true, decryptbody:true, 
                transformResponse: function (data, headers) {
                    return data;
                }
            }
        });
    });
});
