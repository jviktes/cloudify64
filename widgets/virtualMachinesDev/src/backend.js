/* eslint-disable no-console, no-process-exit */
// @ts-nocheck File not migrated fully to TS
module.exports = async function(r) {

    r.register('get_vm_deployments', 'GET', (req, res, next, helper) => {
        const _ = require('lodash');
        console.log('get_vm_deployments...');
        const { headers } = req;
        const commonManagerRequestOptions = {
            headers: {
                tenant: headers.tenant,
                cookie: headers.cookie
            }
        };
        // parsing parametres:
        const params = { ...req.query };
        console.log(params);
        let _searchParam = params._search;
        let _sortParam = params._sort;
        let _size = params._size;
        let _offset = params._offset;

        let filterRules = [{"key":"blueprint_id","values":["Single-VM"],"operator":"contains","type":"attribute"}];

        return helper.Manager.doPost('/searches/deployments', {
            params: {
                _include: 'id,display_name,workflows,labels,site_name,blueprint_id,latest_execution_status,deployment_status,environment_type,latest_execution_total_operations,latest_execution_finished_operations,sub_services_count,sub_services_status,sub_environments_count,sub_environments_status',
                _search:_searchParam,
                _sort:_sortParam,
                _size:_size,
                _offset:_offset,
            },
            body: { filter_rules: filterRules },
            ...commonManagerRequestOptions
        })
            .then(data => {

                //nacteni detailu (os, apod.), TODO: nactou se vsechny? pokud ne, zajima me asi jen:
                //create_deployment_environment a posledni bezici
                const executionsPromises = _.map(data.items, deployment => 
                    helper.Manager.doGet(`/executions?deployment_id=${deployment.id}`, commonManagerRequestOptions)
                );
                return Promise.all([data, ...executionsPromises]); 
                })
                .then(([data, ...executionsPromises]) => {

                    data.items.forEach(_vm => {
                        //sparovani rawData(=vm) s executionsDaty, executionData potrebuju pro create_deployment_environment a nacteni detailu os, ram apod.
                        _vm.executionAllData = [];
                        executionsPromises.forEach(exObj => {
                            if (exObj.items[0].deployment_id==_vm.id) {
                                _vm.executionAllData.push(exObj);
                            }
                        });
                    }); 
                    //dotazy na capabilites:
                    const capabilitesPromises = _.map(data.items, deployment => 
                        helper.Manager.doGet(`/deployments/${deployment.id}/capabilities`, commonManagerRequestOptions)
                    );
                    return   Promise.all([data, ...capabilitesPromises]);   
                })
                .then(([data, ...capabilitesPromises]) => {

                    data.items.forEach(_vm => {
                        //sparovani rawData(=vm) s capabilitesDaty
                        _vm.capabilities = [];
                        capabilitesPromises.forEach(exObj => {
                            if (exObj.deployment_id==_vm.id) {
                                _vm.capabilities.push(exObj);
                            }
                        });
                    }); 
                    return data; 
                })
                .then(data => res.send(data))
                .catch(error => next(error));
    });
    //nacteni detailu: pro deployment reprezentujici VM vyberu podrizene deploymenty = Datadisky nebo PAM requesty a k nim pak nanactu jejich executions: 
    r.register('get_vm_detailsData2', 'GET', (req, res, next, helper) => {
        const _ = require('lodash');
        console.log('get_vm_dataDiskData...');
        const { headers } = req;
        const commonManagerRequestOptions = {
            headers: {
                tenant: headers.tenant,
                cookie: headers.cookie
            }
        };
        // parsing parametres:
        const params = { ...req.query };
        let _id = params.id;
        console.log(params);
    
        let filterRules = [];
        let obj_filter = {"type":"label","key":"csys-obj-parent","operator":"any_of",values:[]};
        obj_filter.values.push(_id);
        filterRules.push(obj_filter);
    
        return helper.Manager.doPost('/searches/deployments', {
            body: { filter_rules: filterRules },
            ...commonManagerRequestOptions
        })
        .then(data => {
            rawData = data.items;

            //nacteni detailu (os, apod.),
            //TODO: mozna problem, pokud se nenactou vsechny, zajima me: create_deployment_environment pro PAM (requestor)
            const executionsPromises = _.map(rawData, deployment => 
                helper.Manager.doGet(`/executions?deployment_id=${deployment.id}`, commonManagerRequestOptions)
            );

            return Promise.all([rawData, ...executionsPromises]); 
            })
            .then(([rawData, ...executionsPromises]) => {

                rawData.forEach(_vm => {
                    //sparovani rawData(=vm) s executionsDaty, executionData potrebuju pro create_deployment_environment a nacteni detailu os, ram apod.
                    _vm.executionAllData = [];
                    executionsPromises.forEach(exObj => {
                        if (exObj.items[0].deployment_id==_vm.id) {
                            _vm.executionAllData.push(exObj);
                        }
                    });
                }); 
                //return rawData;

                //dotazy na capabilites:
                const capabilitesPromises = _.map(rawData, deployment => 
                    helper.Manager.doGet(`/deployments/${deployment.id}/capabilities`, commonManagerRequestOptions)
                );
                return   Promise.all([rawData, ...capabilitesPromises]);   
            })
            .then(([rawData, ...capabilitesPromises]) => {

                rawData.forEach(_vm => {
                    //sparovani rawData(=vm) s capabilitesDaty
                    _vm.capabilities = [];
                    capabilitesPromises.forEach(exObj => {
                        if (exObj.deployment_id==_vm.id) {
                            _vm.capabilities.push(exObj);
                        }
                    });
                }); 
                return rawData; 
            })
            .then(data => res.send(data))
            .catch(error => next(error));
    });
    //get root (parrent) blueprint info:
    r.register('get_loadRootBlueprint', 'GET', (req, res, next, helper) => {
        const _ = require('lodash');
        console.log('get_loadRootBlueprint...');
        const { headers } = req;
        const commonManagerRequestOptions = {
            headers: {
                tenant: headers.tenant,
                cookie: headers.cookie
            }
        };

        let filterRules = [];
        let obj_filterA = {"key":"csys-obj-type","values":["environment"],"operator":"any_of","type":"label"};
        filterRules.push(obj_filterA);
        let obj_filterB = {"key":"csys-obj-parent","values":[],"operator":"is_null","type":"label"};
        filterRules.push(obj_filterB);

        return helper.Manager.doPost('/searches/deployments', {
            params: {
                _include: 'id,display_name,labels,blueprint_id,environment_type',
            },
            body: { filter_rules: filterRules },
            ...commonManagerRequestOptions
        })
        .then(data => {
            rawData = data.items;
            return Promise.all(rawData);
        })
        .then(data => res.send(data))
        .catch(error => next(error));
});
    

/////////////

    r.register('get_vm_detailsData', 'GET', (req, res, next, helper) => {
        const _ = require('lodash');
        console.log('get_vm_detailsData...');
        const { headers } = req;
        const commonManagerRequestOptions = {
            headers: {
                tenant: headers.tenant,
                cookie: headers.cookie
            }
        };
        // parsing parametres:
        const params = { ...req.query };
        console.log(params);
        let _id = params.id;
    
        //return this.toolbox.getManager().doGet(`/executions/${id}?_include=parameters`);
        //https://cloudify-uat.dhl.com/console/sp/executions?_size=2&_offset=0&deployment_id=xa124ls410033&workflow_id=create_deployment_environment&deployment_id=xa124ls201053
        
        // let filterRules = [{"type":"label","key":"csys-obj-type","operator":"is_not","values" : ["environment"]},{"type": "label", "key":"csys-obj-parent", "operator": "any_of", "values" : ["xa12415401047"]}];
        // filterRules = [];
    
        let _includesReqestString = `/executions?_size=1&deployment_id=${_id}`;
    
        return helper.Manager.doGet(_includesReqestString, {
            ...commonManagerRequestOptions
        })
            .then(data => {
                rawData = data.items;
                return Promise.all(rawData);
            })
            .then(data => res.send(data))
            .catch(error => next(error));
    });
    
    r.register('get_vm_dataDiskData', 'GET', (req, res, next, helper) => {
        const _ = require('lodash');
        console.log('get_vm_dataDiskData...');
        const { headers } = req;
        const commonManagerRequestOptions = {
            headers: {
                tenant: headers.tenant,
                cookie: headers.cookie
            }
        };
        // parsing parametres:
        const params = { ...req.query };
        let _id = params.id;
        console.log(params);
    
       //TODO nastavit "values" : ["xa12415401047"]:
        //let filterRules = [{"type":"label","key":"csys-obj-type","operator":"is_not","values":["environment"]},{"type":"label","key":"csys-obj-parent","operator":"any_of","values":['xa12415401047']}];
    
        //{"filter_rules":[{"type":"label","key":"csys-obj-type","operator":"is_not","values":["environment"]},{"type":"label","key":"csys-obj-parent","operator":"any_of","values":["xa124ls401047"]}]}
    
        //filterRules = [{"type":"label","key":"csys-obj-type","operator":"is_not","values":["environment"]}]; //vraci 2 hodnoty
    
        //filterRules = [{"type":"label","key":"csys-obj-parent","operator":"any_of","values":["xa124ls401047"]}]; //vraci 1 hodnotu pro bleuprint id = azure
        let filterRules = [];
        let obj_filter = {"type":"label","key":"csys-obj-parent","operator":"any_of",values:[]};
        obj_filter.values.push(_id);
        filterRules.push(obj_filter);
    
        let outputData = [];
    
        return helper.Manager.doPost('/searches/deployments', {
            // params: {
            //     //_include: 'id,display_name,workflows,labels,site_name,blueprint_id,latest_execution_status,deployment_status,environment_type,latest_execution_total_operations,latest_execution_finished_operations,sub_services_count,sub_services_status,sub_environments_count,sub_environments_status',
            //     //_search:_searchParam
            // },
            body: { filter_rules: filterRules },
            ...commonManagerRequestOptions
        })
            .then(data => {
    
                //filter data disk + bluprint_id STARTSWITH 'AZURE-Data-Disk'
                data.items.forEach(element => {
                    //console.log(element);
                    if(element["blueprint_id"].indexOf("AZURE-Data-Disk")!=-1) {
                        outputData.push(element);
                    }
                    
                });
                return Promise.all(outputData);
            })
            .then(data => res.send(data))
            .catch(error => next(error));
    });
    
    r.register('get_vm_requestsData', 'GET', (req, res, next, helper) => {
        const _ = require('lodash');
        console.log('get_vm_requestsData...');
        const { headers } = req;
        const commonManagerRequestOptions = {
            headers: {
                tenant: headers.tenant,
                cookie: headers.cookie
            }
        };
        // parsing parametres:
        const params = { ...req.query };
        let _id = params.id;
        console.log(params);
    
        //{"filter_rules":[{"type":"label","key":"csys-obj-type","operator":"is_not","values":["environment"]},
       // {"type":"label","key":"csys-obj-parent","operator":"any_of","values":["xa124ls401047"]}]}
    
        //filterRules = [{"type":"label","key":"csys-obj-type","operator":"is_not","values":["environment"]}]; //vraci 2 hodnoty
    
        //filterRules = [{"type":"label","key":"csys-obj-parent","operator":"any_of","values":["xa124ls401047"]}]; //vraci 1 hodnotu pro bleuprint id = azure
    
        let filterRules = [];
        let obj_filter = {"type":"label","key":"csys-obj-parent","operator":"any_of",values:[]};
        obj_filter.values.push(_id);
    
        filterRules.push(obj_filter);
    
        let outputData = [];
    
        return helper.Manager.doPost('/searches/deployments', {
            // params: {
    
            // },
            body: { filter_rules: filterRules },
            ...commonManagerRequestOptions
        })
        .then(data => {

                data.items.forEach(element => {
                    //console.log(element);
                    if(element["blueprint_id"].indexOf("CyberArk-Account")!=-1) {
                        element.filterRules = filterRules;
                        outputData.push(element);
                    }
                });
    
                return Promise.all(outputData);
    
            })
            .then(data => res.send(data))
            .catch(error => next(error));
    
    });
    
    r.register('get_vm_pam_request_executions', 'GET', (req, res, next, helper) => {
        const _ = require('lodash');
        console.log('get_vm_detailsData...');
        const { headers } = req;
        const commonManagerRequestOptions = {
            headers: {
                tenant: headers.tenant,
                cookie: headers.cookie
            }
        };
        // parsing parametres:
        const params = { ...req.query };
        console.log(params);
        let _id = params.id;
    
        let _includesReqestString = `/executions?deployment_id=${_id}`;
        //https://cloudify-uat.dhl.com/console/sp/executions?_sort=-created_at&_size=5&_offset=0&deployment_id=xa124ls201046-sadminbu-zdenek.suchel&_include_system_workflows=false
        return helper.Manager.doGet(_includesReqestString, {
            ...commonManagerRequestOptions
        })
            .then(data => {
                rawData = data.items;
                //TODO: najit nejmladsi zaznam pro typ zaznamu "create_...envirnoment???" a kdo je creator, ten je pak Requestor pro zobrazeni...
                return Promise.all(rawData);
            })
            .then(data => res.send(data))
            .catch(error => next(error));
    });
    
}


                  // rawData = [
                //     {
                //         "id": "xa124ls401047",
                //         "deployment_status": "requires_attention",
                //         "sub_services_status": "requires_attention",
                //         "sub_environments_status": null,
                //         "sub_services_count": 2,
                //         "sub_environments_count": 0,
                //         "display_name": "xa124ls401047",
                //         "latest_execution_finished_operations": 108,
                //         "latest_execution_total_operations": 147,
                //         "blueprint_id": "AZURE-RHEL-Single-VM-v9.5",
                //         "site_name": null,
                //         "latest_execution_status": "failed",
                //         "environment_type": "",
                //         "labels": [
                //             {
                //                 "key": "csys-consumer-id",
                //                 "value": "xa124ls401047-disk-0",
                //                 "created_at": "2023-03-06T06:59:19.871Z",
                //                 "creator_id": 21
                //             },
                //             {
                //                 "key": "csys-obj-parent",
                //                 "value": "a3286a7b-4ec9-44a7-9323-29bd2c1d883a",
                //                 "created_at": "2023-03-06T06:51:01.343Z",
                //                 "creator_id": 21
                //             },
                //             {
                //                 "key": "csys-obj-type",
                //                 "value": "service",
                //                 "created_at": "2023-03-06T06:51:01.343Z",
                //                 "creator_id": 21
                //             },
                //             {
                //                 "key": "obj-type",
                //                 "value": "terraform",
                //                 "created_at": "2023-03-06T06:51:01.343Z",
                //                 "creator_id": 21
                //             }
                //         ]
                //     }
                // ];