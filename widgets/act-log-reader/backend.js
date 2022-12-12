/* eslint-disable no-console, no-process-exit */
// @ts-nocheck File not migrated fully to TS
module.exports = async function(r) {
    r.register('filesAPI', 'GET', (req, res, next, helper) => {

    console.log("filesAPI");
    const moment = require('moment');
    const lodash = require('lodash');
    const fs = require('fs-extra');

    // parsing parametres:
    const params = { ...req.query };
    console.log(params);

    const _sortParam = lodash.castArray(params._sort)[0];
    const _searchParam = lodash.castArray(params._search)[0];
    const _sizeParam = lodash.castArray(params._size)[0];
    const _tenantName =  lodash.castArray(params.tenant)[0];   
    //<archive-root-folder>\<tentant-ID> 
    const folder = '/opt/manager/resources/archive/'+_tenantName +'/';  
    
    //TODO tady nějaka authorizace:
    //const _actualTenant = helper.Manager.getSelectedTenant();
    //console.log("Actual tenant: "+_actualTenant);

    var uniqueID = function () {
        // Math.random should be unique because of its seeding algorithm.
        // Convert it to base 36 (numbers + letters), and grab the first 9 characters
        // after the decimal.
        return '_' + Math.random().toString(36).slice(2, 11);
      };

    const processedDataToJson = data => {

        let outputData = [];

        for (const [key, value] of Object.entries(data)) {

            let _fileName = key; //key = file name = <VM-name>-<ACT-class>-<ACT-set>-<timestamp>.log 
            console.log("processedDataToJson:"+_fileName);
            //console.log("processedDataToJson:"+value);
            //funkce pro splitting:
            const _parametresFromFile = _fileName.split("-");

            let _VMFromFileName = _parametresFromFile[0];
            let _actClassFromFileName = _parametresFromFile[1];
            let _actSetFromFileName = _parametresFromFile[2];
            let _actTimeStampFromFileName = _parametresFromFile[3].slice(0, -4); //YYYYMMDDhhmmss 

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

                res.send(preparedData);
            });
        });

})}