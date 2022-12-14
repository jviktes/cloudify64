// @ts-nocheck File not migrated fully to TS

import log from 'loglevel';
import * as types from './types';
import WidgetDataFetcher from '../utils/widgetDataFetcher';
import StageUtils from '../utils/stageUtils';

function widgetFetchReq(widgetId) {
    return {
        type: types.WIDGET_FETCH_LOADING,
        widgetId
    };
}

function widgetFetchError(widgetId, error) {
    return {
        type: types.WIDGET_FETCH_ERROR,
        widgetId,
        error
    };
}

function widgetFetchRes(widgetId, data) {
    return {
        type: types.WIDGET_FETCH_RES,
        widgetId,
        data,
        receivedAt: Date.now()
    };
}

function widgetFetchCanceled(widgetId) {
    return {
        type: types.WIDGET_FETCH_CANCELED,
        widgetId
    };
}

export function fetchWidgetData(widget, toolbox, paramsHandler) {
    return dispatch => {
        dispatch(widgetFetchReq(widget.id));

        const widgetDataFetcher = new WidgetDataFetcher(widget, toolbox, paramsHandler);

        const fetchPromise = widget.definition.fetchUrl
            ? widgetDataFetcher.fetchByUrls()
            : widgetDataFetcher.fetchByFunc();

        const cancelablePromise = StageUtils.makeCancelable(fetchPromise);

        const waitForPromise = cancelablePromise.promise
            .then(response => {
                dispatch(widgetFetchRes(widget.id, response));
                return response;
            })
            .catch(e => {
                if (e.isCanceled) {
                    log.log(`Widget '${widget.name}' data fetch canceled`);
                    dispatch(widgetFetchCanceled(widget.id));
                } else {
                    dispatch(widgetFetchError(widget.id, e));
                }

                throw e;
            });

        return {
            cancelablePromise,
            waitForPromise
        };
    };
}

export function clearWidgetsData() {
    return {
        type: types.WIDGET_DATA_CLEAR
    };
}
