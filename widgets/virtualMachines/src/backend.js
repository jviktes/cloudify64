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
        let _filteredDeploymentParentId = params.filteredDeploymentParentId;
    
        let rawData = [];
        
        if (_filteredDeploymentParentId!=undefined  || _filteredDeploymentParentId!=null ) 
        {
            console.log("rawData search:");
            _searchParam = _filteredDeploymentParentId;
        }
    
        //https://cloudify-uat.dhl.com/console/sp/searches/deployments?_sort=-created_at&_size=50&
        //_include=id,display_name,site_name,blueprint_id,latest_execution_status,deployment_status,environment_type,latest_execution_total_operations,latest_execution_finished_operations,sub_services_count,sub_services_status,sub_environments_count,sub_environments_status
    
        //filter pro pouze VM:
        let filterRules = [{"key":"blueprint_id","values":["Single-VM"],"operator":"contains","type":"attribute"}];
        //filterRules = []; //zobrazi vsechny deploymenty...
        return helper.Manager.doPost('/searches/deployments', {
            params: {
                _include: 'id,display_name,workflows,labels,site_name,blueprint_id,latest_execution_status,deployment_status,environment_type,latest_execution_total_operations,latest_execution_finished_operations,sub_services_count,sub_services_status,sub_environments_count,sub_environments_status',
                _search:_searchParam
            },
            body: { filter_rules: filterRules },
            ...commonManagerRequestOptions
        })
            .then(data => {
                rawData = data.items;



                rawData = [
                    {
                        "id": "xa124ls401047",
                        "deployment_status": "requires_attention",
                        "sub_services_status": "requires_attention",
                        "sub_environments_status": null,
                        "sub_services_count": 2,
                        "sub_environments_count": 0,
                        "display_name": "xa124ls401047",
                        "latest_execution_finished_operations": 108,
                        "latest_execution_total_operations": 147,
                        "blueprint_id": "AZURE-RHEL-Single-VM-v9.5",
                        "site_name": null,
                        "latest_execution_status": "failed",
                        "environment_type": "",
                        "labels": [
                            {
                                "key": "csys-consumer-id",
                                "value": "xa124ls401047-disk-0",
                                "created_at": "2023-03-06T06:59:19.871Z",
                                "creator_id": 21
                            },
                            {
                                "key": "csys-obj-parent",
                                "value": "a3286a7b-4ec9-44a7-9323-29bd2c1d883a",
                                "created_at": "2023-03-06T06:51:01.343Z",
                                "creator_id": 21
                            },
                            {
                                "key": "csys-obj-type",
                                "value": "service",
                                "created_at": "2023-03-06T06:51:01.343Z",
                                "creator_id": 21
                            },
                            {
                                "key": "obj-type",
                                "value": "terraform",
                                "created_at": "2023-03-06T06:51:01.343Z",
                                "creator_id": 21
                            }
                        ]
                    }
                ];
               
                return Promise.all(rawData);
            })
            .then(data => res.send(data))
            .catch(error => next(error));
    });
    
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
                //rawData = data.items;
                //console.log('get_vm_requestsData results:');
                //console.log("data:");
                //console.log(data);
    
                //mock data:
    
                // let fake_data= {requestsData: []};
    
                // fake_data.requestsData.push({id:params.id, account_name:"vik1@dhl.com", role:"admin", status:"Grant waiting for approval",requestor:"vik1@dhl.com"});
                // fake_data.requestsData.push({id:params.id, account_name:"vik2@dhl.com", role:"user", status:"Grant implemented",requestor:"vik1@dhl.com"});
                // fake_data.requestsData.push({id:params.id, account_name:"vik3@dhl.com", role:"admin", status:"Grant waiting for approval",requestor:"vik1@dhl.com"});
                // fake_data.requestsData.push({id:params.id, account_name:"vik4@dhl.com", role:"admin", status:"Revocation approved",requestor:"vik1@dhl.com"});
                // fake_data.requestsData.push({id:params.id, account_name:"vik5@dhl.com", role:"admin", status:"Grant approved",requestor:"vik1@dhl.com"});
                // fake_data.requestsData.push({id:params.id, account_name:"vik6@dhl.com", role:"admin", status:"Grant waiting for approval",requestor:"vik1@dhl.com"});
                // fake_data.requestsData.push({id:params.id, account_name:"vik7@dhl.com", role:"user", status:"Grant approved",requestor:"vik1@dhl.com"});
                // fake_data.requestsData.push({id:params.id, account_name:"vik8@dhl.com", role:"admin", status:"GGrant implemented",requestor:"vik1@dhl.com"});
    
                //console.log(fake_data);
                //console.log(fake_data.requestsData);
    
    
                //console.log(spireDeployments);
    
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
    
        let _includesReqestString = `/executions?deployment_id=${_id}`; //pokus
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