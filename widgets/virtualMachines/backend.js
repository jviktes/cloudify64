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
            console.log('get_vm_deployments results:');
            console.log("data:");
            console.log(data);
            //spireDeployments = data.items;
            //OK console.log(data.metadata.pagination.total);

            //[{"key":"csys-obj-type","value":"environment", 

            //mock data:

            let fake_data= {items: []};
            fake_data.items.push({id:"aaa-bbb-ccc-1",labels:["label1","label2","label3"]});
            fake_data.items.push({id:"aaa-bbb-ccc-2",labels:["label1","label2","label3"]});

            console.log(fake_data);
            console.log(fake_data.items);

            fake_data.items.forEach(element => {
                console.log(element);
                spireDeployments.push(element);
            });


            //TODO nevim co tohle je:
            //odfiltrovani podle id:
            // if (_filteredDeploymentParentId!=undefined) {
            //     console.log("spireDeployments search:");
                
            //     //spireDeployments = spireDeployments[1];
            //     let spireDeploymentsFiltered = [];

            //     data.items.forEach(element => {
            //         //console.log(element);
            //         if (element.id==_filteredDeploymentParentId) {
            //             spireDeploymentsFiltered.push(element);
            //         }
            //     });

            //     return Promise.all(spireDeploymentsFiltered);

            // }

            //console.log(spireDeployments);
            return Promise.all(spireDeployments);
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
            console.log('get_vm_deployments results:');
            console.log("data:");
            console.log(data);

            //mock data:

            let fake_data= {diskData: []};
            fake_data.diskData.push({id:"data disk A"});
            fake_data.diskData.push({id:"data disk B"});

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
            console.log('get_vm_requestsData results:');
            console.log("data:");
            console.log(data);

            //mock data:

            let fake_data= {requestsData: []};
            fake_data.requestsData.push({id:"request  A"});
            fake_data.requestsData.push({id:"request  B"});

            console.log(fake_data);
            console.log(fake_data.requestsData);

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