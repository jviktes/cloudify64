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

        let filterRules = [];
        //filter for Single machine only:
        let obj_filterSingleMachines = {"key":"blueprint_id","values":["Single-VM"],"operator":"contains","type":"attribute"};
        filterRules.push(obj_filterSingleMachines);
        //filter for unistalled machines:
        let obj_filterUnistall = {"type":"label","key":"vm_unistalled","operator":"is_null",values:[]};
        filterRules.push(obj_filterUnistall);

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


                //filter for unistall VM:

                for (let index = 0; index < data.items.length; index++) {
                    const item = data.items[index];
                    let _isUnistalled = false;
                    if (item.executionAllData[0].items!=null){

                        item.executionAllData[0].items.sort(function(a,b){
                            return new Date(b.created_at) - new Date(a.created_at);
                          });
        
                        let lastExec = item.executionAllData[0].items[0];
        
                        if (lastExec!=null) {
                            if (lastExec.workflow_id === "uninstall" && lastExec.status_display=="completed") {
                                _isUnistalled = true;
                            }
                        }
                        if (_isUnistalled) {
                            //TOOD: odmazani:
                            //data.items.splice(index, 1);
                            //await helper.Manager.doDelete(`/deployments/${item.deployment_id}`, { params: { force: 'true' } });

                            //prepare labels:
                            let labels = [];
                            item.labels.forEach(_lab => {
                                let _objLab = {};
                                _objLab[_lab.key] = _lab.value;
                                labels.push(_objLab);
                            });
                            labels.push({"vm_unistalled":"true"});
                            //add label vm_unistalled:
                            let _includesReqestString = `/deployments/${item.id}`;
                            helper.Manager.doPatch(_includesReqestString, {
                                ...commonManagerRequestOptions,
                                body: { labels }
                            });
                        }
                  }
                }

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
    

///////////// ONLY FO TESTING ////

r.register('get_vm_run_unistall_polling', 'GET', (req, res, next, helper) => {
    const _ = require('lodash');
    console.log('get_vm_run_unistall_polling...');
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
    //let filterRules = [{"key":"blueprint_id","values":["Single-VM"],"operator":"contains","type":"attribute"}];
    let _includesReqestString = `/deployments/${_id}`;
    
    //tady musim nacist labels:
    return helper.Manager.doGet(_includesReqestString, {
        //body: { filter_rules: filterRules },
        ...commonManagerRequestOptions
    })
    .then(data => {
        //rawData = data.items[0];
        let _strLabels = "";
        try {
            let labels = data.labels;

            //labels.push({run_audit_date:new Date().toLocaleString().replace(',','')});
            labels.push({key:"run_audit_date",value:"pokus"});

            //{key: "obj-type", value: "terraform", created_at: "2023-04-25T06:43:27.369Z", creator_id: 24}

            let objLabels = {"labels":labels};
            strLabels = JSON.stringify(objLabels);
            return objLabels;
            // const _promises = 
            // helper.Manager.doPatch(_includesReqestString, {
            //     ...commonManagerRequestOptions,
            //     body: { _strLabels }
            // });
            // return Promise.all(_promises)
            // .then((_promises) => {
            //     //return _promises; 
            //     return _strLabels;
            // });
        } catch (error) {
            
        }
        return _strLabels;

    })
    .then(data => res.send(data))
    .catch(error => next(error));

});


r.register('get_vm_run_unistall_polling2', 'GET', (req, res, next, helper) => {
    const _ = require('lodash');
    console.log('get_vm_run_unistall_polling...');
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
    let _includesReqestString = `/deployments/${_id}`;
    
    //tady musim nacist labels:
    return helper.Manager.doGet(_includesReqestString, {
        ...commonManagerRequestOptions
    })
    .then(data => {
        try {
            let _date = String(new Date().toLocaleString().replace(',',''));
            let labels = [];//= data.labels;

            data.labels.forEach(_lab => {
                let _objLab = {};
                _objLab[_lab.key] = _lab.value;
                labels.push(_objLab);
            });
            labels.push({"run_audit_date2":_date});

            // let _objLabels = [{"csys-consumer-id":"xa124ws601037-disk-0"},{"csys-obj-parent":"7e35f2cd-3e3d-44af-96e7-1ca866883f0e"},{"csys-obj-type":"service"},{"obj-type":"terraform"}];
            // _objLabels.push({"run_audit_date1":_date});
            //labels = _objLabels;

            helper.Manager.doPatch(_includesReqestString, {
                ...commonManagerRequestOptions,
                body: { labels }
            });
            return data.labels;
        } catch (error) {
            
        }

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
    
    r.register('filesVMAPI', 'GET', (req, res, next, helper) => {

        console.log("filesVMAPI");
        const moment = require('moment');
        const lodash = require('lodash');
        const fs = require('fs-extra');
    
        // parsing parametres:
        const params = { ...req.query };
        console.log(params);
    
        const _sortParam = lodash.castArray(params._sort)[0];
        const _searchParam = lodash.castArray(params._search)[0];
        const _tenantName =  lodash.castArray(params.tenant)[0];   
        const _sizeParam = parseInt(lodash.castArray(params._size)[0]);
        const _offsetparam = parseInt(lodash.castArray(params._offset)[0]);
    
        console.log(_tenantName);
        //<archive-root-folder>\<tentant-ID> 
        const folder = '/opt/manager/resources/archive/'+_tenantName +'/'; 
        
        // const folder = '/Users/romansebranek/DHL/testFolder/resources/archive';  //localhost: default_tenant
    
        //TODO tady nějaka authorizace:
        //const _actualTenant = helper.Manager.getSelectedTenant();
        //console.log("Actual tenant: "+_actualTenant);
    
        var uniqueID = function () {
            // Math.random should be unique because of its seeding algorithm.
            // Convert it to base 36 (numbers + letters), and grab the first 9 characters
            // after the decimal.
            return '_' + Math.random().toString(36).slice(2, 11);
          };
    
    
         
        const paginate=(data, offset, page_size)=> {
            const start_index = offset;
            const end_index = offset + page_size;
            
            const paginated_data = data.slice(start_index, end_index);
            return paginated_data;
          }
    
        const processedDataToJson = data => {
    
            let outputData = [];
    
            for (const [key, value] of Object.entries(data)) {
    
                let _fileName = key; //key = file name = <VM-name>-<ACT-class>-<ACT-set>-<timestamp>.log 
                console.log("processedDataToJson:"+_fileName);
                //console.log("processedDataToJson:"+value);
    
    
                //funkce pro splitting --> pozor muzou byt 2 verze (4 a 5 parametru v nazvu soubru)
                const _parametresFromFile = _fileName.split("-");
    
                let _VMFromFileName = "";
                let _actClassFromFileName = "";
                let _actSetFromFileName = "";
                let _actTimeStampFromFileName = "";//YYYYMMDDhhmmss 
    
                //console.log("_parametresFromFile.length:");
                //console.log(_parametresFromFile.length);
    
                if (_parametresFromFile.length==4) {
                    _VMFromFileName = _parametresFromFile[0];
                    _actClassFromFileName = _parametresFromFile[1];
                    _actSetFromFileName = _parametresFromFile[2];
                    _actTimeStampFromFileName = _parametresFromFile[3].slice(0, -4); //YYYYMMDDhhmmss 
                }
    
                if (_parametresFromFile.length==5) {
                    _VMFromFileName = _parametresFromFile[0];
                    _actClassFromFileName = _parametresFromFile[1]+"-"+_parametresFromFile[2];
                    _actSetFromFileName = _parametresFromFile[3];
                    _actTimeStampFromFileName = _parametresFromFile[4].slice(0, -4); //YYYYMMDDhhmmss 
                }
    
    
                //searching in VM, skipping if not included:
                if (_searchParam && _VMFromFileName.indexOf(_searchParam)== -1) {
                    continue;
                }
    
                let _testDateFormatted = moment(_actTimeStampFromFileName, 'YYYYMMDDhhmmss').format("YYYY-MM-DD hh:mm:ss");
    
                let _actual_value=[];
                let _expected_value=[];
                let _class = [];
                let _code = [];
                let _testResultArray = [];
                let _passedTestsCount = 0;
                let _warningTestsCount = 0;
                let _failedTestsCount = 0;
                let _testResultSummary = [];
    
                //filling test details into _testResultArray
                try {
                    if (value!=null || value!=undefined) {
                        value.results.forEach(_testData => {
                            _actual_value = _testData.actual_value;
                            _class = _testData.class;
                            _code = _testData.code;
                            _description= _testData.description;
                            _expected_value= _testData.expected_value;
                            _name= _testData.name;
        
                            _result = _testData.result;
                            if (_testData.result.toString().toLowerCase() && _testData.result.toString().toLowerCase().indexOf("passed")!== -1) {
                                _passedTestsCount++;
                            }
                            if (_testData.result.toString().toLowerCase() && _testData.result.toString().toLowerCase().indexOf("failed")!== -1) {
                                _failedTestsCount++;
                            }
                            if (_testData.result.toString().toLowerCase() && _testData.result.toString().toLowerCase().indexOf("warning")!== -1) {
                                _warningTestsCount++;
                            }
        
                            _testResultArray.push(
                                {
                                    "actual_value": _actual_value,
                                    "expected_value":  _expected_value,
                                    "class": _class,
                                    "code":  _code, 
                                    "description":  _description,
                                    "name":  _name,
                                    "result": _result,
                                }
                            );
                        });
                    }
                } catch (error) {
                    //console.log(error); Bohužel, zde to padá
    /*                 _testResultArray.push(
                        {
                            "actual_value": "Not valid file",
                            "expected_value":"",
                            "class": "",
                            "code":  "", 
                            "description":  "",
                            "name":  "",
                            "result": "",
                        }
                    ) */
                }
    
                if (_failedTestsCount===0 && _passedTestsCount>0) {
                    _testResultSummary = "Succeeded";    
                }
                else {
                    _testResultSummary = "Failed"; 
                }
    
                outputData.push({
                    "id":uniqueID(),
                    "fileName":_fileName, 
                    "virtualMachine": _VMFromFileName,
                    "class": _actClassFromFileName,
                    "code": _actSetFromFileName,
                    "testDatum": _testDateFormatted,
                    "requestor": value.requestor,
                    "deployment_id":value.deployment_id,
                    "deployment_name":value.deployment_name, 
                    "passedTestsCount" : _passedTestsCount,
                    "warningTestsCount" : _warningTestsCount,
                    "failedTestsCount": _failedTestsCount,
                    "testResultSummary": _testResultSummary,
                    "testResultArray":_testResultArray,
                });
            }
            
            return outputData;
    
        }
    
        let result ={};
    
        let promises = [];
    
            fs.readdir(folder, (err, files) => {
                if (!files) {
                    console.log("no files");
                    return res.send();
                }
    
                files.forEach(file => {
                    {
                        result[file]="";
                        //console.log(file);
                        let _promise = new Promise(function(resolve, reject) {
                             resolve(fs.readFile(folder+"/"+file));
                        });
                        promises.push(_promise);
    
                        _promise.then(
                    
                            (_result) => { 
                                //try {
                                    //console.log(_result.toString()); // toto OK
                                    result[file] = JSON.parse(_result.toString());
                                    //console.log("result[file]");
                                    //console.log(result[file]);
                                //} catch (error) {
                                    //console.log("problem");
                                //}
                            }
                        );
                    }
                });
    
                Promise.all(promises).then((_res) => {
    
                    let preparedData = processedDataToJson(result);
    
                    // sorting, TODO: substitude by generic!
                    if (_sortParam && _sortParam.indexOf("fileName")!== -1) {
                        console.log("sorting by field: -fileName-");
                        if (_sortParam.startsWith("-")) {
                            preparedData.sort((a,b) => (a.fileName < b.fileName) ? 1 : ((b.fileName < a.fileName) ? -1 : 0));
                        }
                        else {
                            preparedData.sort((a,b) => (a.fileName > b.fileName) ? 1 : ((b.fileName > a.fileName) ? -1 : 0));
                        }
                    }
    
                    if (_sortParam && _sortParam.indexOf("testDatum")!== -1) {
                        console.log("sorting by field: -testDatum-");
                        if (_sortParam.startsWith("-")) {
                            preparedData.sort((a,b) => (new moment(a.testDatum).format('YYYY-MM-DD hh:mm:ss') < new moment(b.testDatum).format('YYYY-MM-DD hh:mm:ss')) ? 1 : ((new moment(b.testDatum).format('YYYY-MM-DD hh:mm:ss') < new moment(a.testDatum).format('YYYY-MM-DD hh:mm:ss')) ? -1 : 0));
                        }
                        else {
                            preparedData.sort((a,b) => (new moment(a.testDatum).format('YYYY-MM-DD hh:mm:ss') > new moment(b.testDatum).format('YYYY-MM-DD hh:mm:ss')) ? 1 : ((new moment(b.testDatum).format('YYYY-MM-DD hh:mm:ss') > new moment(a.testDatum).format('YYYY-MM-DD hh:mm:ss')) ? -1 : 0));
                        }
                    }
    
                    if (_sortParam && _sortParam.indexOf("virtualMachine")!== -1) {
                        console.log("sorting by field: -virtualMachine-");
                        if (_sortParam.startsWith("-")) {
                            preparedData.sort((a,b) => (a.virtualMachine < b.virtualMachine) ? 1 : ((b.virtualMachine < a.virtualMachine) ? -1 : 0));
                        }
                        else {
                            preparedData.sort((a,b) => (a.virtualMachine > b.virtualMachine) ? 1 : ((b.virtualMachine > a.virtualMachine) ? -1 : 0));
                        }
                    }
    
                    if (_sortParam && _sortParam.indexOf("result")!== -1) {
                        console.log("sorting by field: -result-");
                        if (_sortParam.startsWith("-")) {
                            preparedData.sort((a,b) => (a.testResultSummary < b.testResultSummary) ? 1 : ((b.testResultSummary < a.testResultSummary) ? -1 : 0));
                        }
                        else {
                            preparedData.sort((a,b) => (a.testResultSummary > b.testResultSummary) ? 1 : ((b.testResultSummary > a.testResultSummary) ? -1 : 0));
                        }
                    }
    
                    if (_sortParam && _sortParam.indexOf("class")!== -1) {
                        console.log("sorting by field: -class-");
                        if (_sortParam.startsWith("-")) {
                            preparedData.sort((a,b) => (a.class < b.class) ? 1 : ((b.class < a.class) ? -1 : 0));
                        }
                        else {
                            preparedData.sort((a,b) => (a.class > b.class) ? 1 : ((b.class > a.class) ? -1 : 0));
                        }
                    }
                    
                    if (_sortParam && _sortParam.indexOf("passed")!== -1) {
                        console.log("sorting by field: -passed-");
                        if (_sortParam.startsWith("-")) {
                            preparedData.sort((a,b) => (a.passedTestsCount < b.passedTestsCount) ? 1 : ((b.passedTestsCount < a.passedTestsCount) ? -1 : 0));
                        }
                        else {
                            preparedData.sort((a,b) => (a.passedTestsCount > b.passedTestsCount) ? 1 : ((b.passedTestsCount > a.passedTestsCount) ? -1 : 0));
                        }
                    }
    
                    if (_sortParam && _sortParam.indexOf("failed")!== -1) {
                        console.log("sorting by field: -failed-");
                        if (_sortParam.startsWith("-")) {
                            preparedData.sort((a,b) => (a.failedTestsCount < b.failedTestsCount) ? 1 : ((b.failedTestsCount < a.failedTestsCount) ? -1 : 0));
                        }
                        else {
                            preparedData.sort((a,b) => (a.failedTestsCount > b.failedTestsCount) ? 1 : ((b.failedTestsCount > a.failedTestsCount) ? -1 : 0));
                        }
                    }
    
                    //tady vyberu kolik toho chci:
    
                    //_sizeParam = kolik
                    //_offsetparam = od čeho
    
                    const paginated_data = paginate(preparedData, _offsetparam, _sizeParam);
                    const dataOut = {};
                    dataOut.itemsData = paginated_data;
                    dataOut.total = preparedData.length;
    
                    //paginated_data.total = preparedData.length;
                    //console.log("paginated_data total:");
                    console.log(dataOut);
                    //console.log(paginated_data);
                    res.send(dataOut);
                });
            });
    
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