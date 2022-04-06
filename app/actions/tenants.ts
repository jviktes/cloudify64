// @ts-nocheck File not migrated fully to TS

import log from 'loglevel';
import type { ThunkAction, AnyAction } from 'redux';
import * as types from './types';
import Manager from '../utils/Manager';
import { setAppLoading } from './appState';
import { setEditMode } from './config';
import { clearContext } from './context';
import { reloadUserAppData } from './userApp';
import { ReduxState } from '../reducers';

function requestTenants() {
    return {
        type: types.REQ_TENANTS
    };
}

function recieveTenants(tenants) {
    return {
        type: types.RES_TENANTS,
        tenants,
        receivedAt: Date.now()
    };
}

function errorTenants(err) {
    return {
        type: types.ERR_TENANTS,
        error: err,
        receivedAt: Date.now()
    };
}

export function getTenants(): ThunkAction<void, ReduxState, never, AnyAction> {
    return (dispatch, getState) => {
        dispatch(requestTenants());
        const managerAccessor = new Manager(getState().manager);
        return managerAccessor
            .doGet('/tenants', { params: { _include: 'name', _get_all_results: true } })
            .then(tenants => {
                dispatch(recieveTenants(tenants));
                return tenants;
            })
            .catch(err => {
                log.error(err);
                dispatch(errorTenants(err.message));
                return Promise.reject(err);
            });
    };
}

export function selectTenant(tenantName) {
    return {
        type: types.SELECT_TENANT,
        tenant: tenantName
    };
}

export function changeTenant(tenantName) {
    return dispatch => {
        dispatch(setAppLoading(true));
        dispatch(setEditMode(false));
        dispatch(clearContext());
        dispatch(selectTenant(tenantName));
        dispatch(reloadUserAppData());
    };
}
