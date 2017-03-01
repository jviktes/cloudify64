/**
 * Created by pposel on 09/02/2017.
 */

import 'isomorphic-fetch';
import {saveAs} from 'file-saver';

import log from 'loglevel';
let logger = log.getLogger("External");

export default class External {

    constructor(data) {
        this._data = data;
    }

    doGet(url,params) {
        return this._ajaxCall(url,'get',params) ;
    }

    doPost(url,params,data){
        return this._ajaxCall(url,'post',params,data) ;
    }

    doDelete(url,params,data){
        return this._ajaxCall(url,'delete',params,data) ;
    }

    doPut(url,params,data) {
        return this._ajaxCall(url,'put',params,data) ;
    }

    doDownload(url,fileName) {
        return this._ajaxCall(url,'get',null,null,fileName);
    }

    _ajaxCall(url,method,params,data,fileName) {
        var actualUrl = this._buildActualUrl(url, params);
        logger.debug(method + ' data. URL: ' + url);

        var headers = this._buildHeaders();

        var options = {
            method: method,
            headers: headers
        };

        if (data) {
            try {
                options.body = JSON.stringify(data)
            } catch (e) {
                logger.error('Error stringifying data. URL: '+actualUrl+' data ',data);
            }
        }

        if (fileName) {
            return fetch(actualUrl, options)
                .then(this._checkStatus)
                .then(response => response.blob())
                .then(blob => saveAs(blob, fileName));
        } else {
            return fetch(actualUrl, options)
                .then(this._checkStatus)
                .then(response => {
                    var contentType = _.toLower(response.headers.get('content-type'));
                    return contentType.indexOf('application/json') >= 0 ? response.json() : response.text();
                })
        }
    }

    _checkStatus(response) {
        if (response.ok) {
            return response;
        }

        var contentType = _.toLower(response.headers.get('content-type'));
        if (contentType.indexOf('application/json') >= 0) {
            return response.json()
                .then(resJson => Promise.reject({message: resJson.message || response.statusText}))
        } else {
            return Promise.reject({message: response.statusText});
        }
    }

    _buildActualUrl(url, data) {
        var queryString =  data ? (url.indexOf("?") > 0?"&":"?") + $.param(data, true) : '';
        return `${url}${queryString}`;
    }

    _buildHeaders() {
        var headers = {"Content-Type": "application/json"};
        if (this._data && this._data.basicAuth) {
            headers = Object.assign(headers, {"Authorization": `Basic ${this._data.basicAuth}`});
        };

        return headers;
    }

}
