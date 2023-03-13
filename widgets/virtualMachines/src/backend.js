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


    //https://cloudify-uat.dhl.com/console/sp/executions?_size=2&_offset=0&deployment_id=xa124ls410033&workflow_id=create_deployment_environment&deployment_id=xa124ls201053
    //https://cloudify-uat.dhl.com/console/sp/searches/deployments?_sort=-created_at&_size=50&_include=id,display_name,site_name,blueprint_id,latest_execution_status,deployment_status,environment_type,latest_execution_total_operations,
    //latest_execution_finished_operations,sub_services_count,sub_services_status,sub_environments_count,sub_environments_status
    return helper.Manager.doGet('/deployments', {
        params: {
            _include: 'id,display_name,workflows,labels,site_name,blueprint_id,latest_execution_status,deployment_status,environment_type,latest_execution_total_operations,latest_execution_finished_operations,sub_services_count,sub_services_status,sub_environments_count,sub_environments_status',
            _search:_searchParam
        },
        ...commonManagerRequestOptions
    })
        .then(data => {
            //rawData = data.items;

            //musim odfiltrovat pouze VM (tj. vse bez labelu...)
            if (_filteredDeploymentParentId==undefined) {

                data.items.forEach(item => {
                    if (item.labels==undefined || item.labels==null  || item.labels==[]) {
                        //rawData.push(item);
                    }
                    else {
                        let _foundParentLabel = false;
                        let _parrentId = -1;

                        for (const key in item.labels) {
                            if (Object.prototype.hasOwnProperty.call(item.labels, key)) {
                                const _label = item.labels[key];
                                if (_label.key == "csys-obj-parent") {
                                    _foundParentLabel=true;
                                    _parrentId = _label.value;
                                    break;
                                }

                            }
                        }
                        if (_foundParentLabel==true) {
                            let _index=-1
                            if (_parrentId!=0){
                                for (let index = 0; index < data.items.length; index++) {
                                    const element = data.items[index];
                                    if (element.id==_parrentId) {
                                        _index=index;
                                         break;
                                    }
                                }
                            }
                            if (_index!=-1) {
                                try {
                                    item.parent_display_name = data.items[_index].display_name;  
                                } catch (error) {
                                    
                                }
                            }  
                            
                            rawData.push(item);
                        }
                    }
                });

            } 
            else {
                //musim vracet pouze 1:
                data.items.forEach(item => {
                      if (item.id==_filteredDeploymentParentId) {


                        let _foundParentLabel = false;
                        let _parrentId = -1;

                        for (const key in item.labels) {
                            if (Object.prototype.hasOwnProperty.call(item.labels, key)) {
                                const _label = item.labels[key];
                                if (_label.key == "csys-obj-parent") {
                                    _foundParentLabel=true;
                                    _parrentId = _label.value;
                                    break;
                                }

                            }
                        }
                        if (_foundParentLabel==true) {
                            let _index=-1
                            if (_parrentId!=0){
                                for (let index = 0; index < data.items.length; index++) {
                                    const element = data.items[index];
                                    if (element.id==_parrentId) {
                                        _index=index;
                                         break;
                                    }
                                }
                            }
                            if (_index!=-1) {
                                try {
                                    item.parent_display_name = data.items[_index].display_name;  
                                } catch (error) {
                                    
                                }
                            }  
                            
                        }
                        rawData.push(item);
                      } 
                })
                //rawData = data.items;
            }
            //console.log(rawData);
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
    
    let _includesReqestString = "/executions?_size=1&deployment_id="+_id;

    return helper.Manager.doGet(_includesReqestString, {
        ...commonManagerRequestOptions
    })
        .then(data => {
            console.log('get_vm_detailsData results:');
            //console.log(data);
            return Promise.all(data.items);
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
    console.log(params);
    let _searchParam = params._search;
    let _filteredDeploymentParentId = params.filteredDeploymentParentId;

    let spireDeployments = [];

    if (_filteredDeploymentParentId!=undefined) 
    {
        console.log("spireDeployments search:");
        _searchParam = _filteredDeploymentParentId;
    }
    return helper.Manager.doGet('/deployments', {
        params: {
            _include: 'id,labels,blueprint_id,tenant_name,environment_type,workflows',
            _search:_searchParam
        },
        ...commonManagerRequestOptions
    })
        .then(data => {
            console.log('get_vm_dataDiskData results:');
            console.log("data:");
            console.log(data);

            //mock data:

            let fake_data= {diskData: []};
            fake_data.diskData.push({id:params.id, name:"C", disk_type:"SSD", disk_size:"1024",host_caching:"ReadOnly"});
            fake_data.diskData.push({id:params.id, name:"D", disk_type:"SSD", disk_size:"512",host_caching:"ReadOnly"});
            fake_data.diskData.push({id:params.id, name:"E", disk_type:"SSD", disk_size:"2048",host_caching:"None"});
            fake_data.diskData.push({id:params.id, name:"F", disk_type:"SSD", disk_size:"1024",host_caching:"None"});

            console.log(fake_data);
            console.log(fake_data.diskData);

            fake_data.diskData.forEach(element => {
                console.log(element);
                spireDeployments.push(element);
            });

            //console.log(spireDeployments);
            return Promise.all(spireDeployments);
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
    //console.log(params);
    let _searchParam = params._search;
    let _filteredDeploymentParentId = params.filteredDeploymentParentId;

    let spireDeployments = [];

    if (_filteredDeploymentParentId!=undefined) 
    {
        //console.log("spireDeployments search:");
        _searchParam = _filteredDeploymentParentId;
    }
    return helper.Manager.doGet('/deployments', {
        params: {
            _include: 'id,labels,blueprint_id,tenant_name,environment_type,workflows',
            _search:_searchParam
        },
        ...commonManagerRequestOptions
    })
        .then(data => {
            //console.log('get_vm_requestsData results:');
            //console.log("data:");
            //console.log(data);

            // Grant waiting for approval
            // Revocation waiting for approval
            // Grant approved
            // Revocation approved
            // Grant implemented

            //mock data:

            let fake_data= {requestsData: []};

            fake_data.requestsData.push({id:params.id, account_name:"vik1@dhl.com", role:"admin", status:"Grant waiting for approval",requestor:"vik1@dhl.com"});
            fake_data.requestsData.push({id:params.id, account_name:"vik2@dhl.com", role:"user", status:"Grant implemented",requestor:"vik1@dhl.com"});
            fake_data.requestsData.push({id:params.id, account_name:"vik3@dhl.com", role:"admin", status:"Grant waiting for approval",requestor:"vik1@dhl.com"});
            fake_data.requestsData.push({id:params.id, account_name:"vik4@dhl.com", role:"admin", status:"Revocation approved",requestor:"vik1@dhl.com"});
            fake_data.requestsData.push({id:params.id, account_name:"vik5@dhl.com", role:"admin", status:"Grant approved",requestor:"vik1@dhl.com"});
            fake_data.requestsData.push({id:params.id, account_name:"vik6@dhl.com", role:"admin", status:"Grant waiting for approval",requestor:"vik1@dhl.com"});
            fake_data.requestsData.push({id:params.id, account_name:"vik7@dhl.com", role:"user", status:"Grant approved",requestor:"vik1@dhl.com"});
            fake_data.requestsData.push({id:params.id, account_name:"vik8@dhl.com", role:"admin", status:"GGrant implemented",requestor:"vik1@dhl.com"});

            //console.log(fake_data);
            //console.log(fake_data.requestsData);

            fake_data.requestsData.forEach(element => {
                console.log(element);
                spireDeployments.push(element);
            });

            //console.log(spireDeployments);
            return Promise.all(spireDeployments);
        })
        .then(data => res.send(data))
        .catch(error => next(error));
});


}