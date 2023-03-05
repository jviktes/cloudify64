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

            data.items.forEach(element => {
                //console.log(element);
                spireDeployments.push(element);
            });

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

}