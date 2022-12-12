/* eslint-disable no-console, no-process-exit */

// @ts-nocheck File not migrated fully to TS
module.exports = function(r) {
    r.register('files', 'GET', (req, res, next, helper) => {
    console.log("Dotaz:");
    helper.Request.doGet(`http://localhost:3000/array`)
    .then(data => {
        console.log(data);
        res.send(data);
    })
    .catch(err => {
        dispatch(errorClusterStatus(err));
    });
});
}
module.exports = function(r) {
    r.register('quantity', 'GET', (req, res, next, helper) => {
    console.log("quantity");
    helper.Request.doGet(`http://localhost:3000/quantity`)
    .then(data => {
        console.log(data);
        res.send(data);
    })
    .catch(err => {
        dispatch(errorClusterStatus(err));
    });
});
}
module.exports = function(r) {
    //nacteni z externi sluzby:
    r.register('gsn', 'GET', (req, res, next, helper) => {
    console.log("gsn backend");
    helper.Request.doGet(`http://localhost:3000/gsn`)
    .then(data => {
        console.log(data);
        res.send(data);
    })
    .catch(err => {
        dispatch(errorClusterStatus(err));
    });
});
}
module.exports = async function(r) {
    r.register('GSNAPI', 'GET', (req, res, next, helper) => {

    console.log("GSNAPI");
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
    
    const folder = '/opt/manager/resources/gsndata/';  
    ///opt/manager/resources/gsndata/
    const processedDataToJson = data => {

        let outputData = [];

        for (const [key, value] of Object.entries(data)) {

            let _fileName = key; //key = file name = <VM-name>-<ACT-class>-<ACT-set>-<timestamp>.log 

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
    console.log(folder);

    let promises = [];

        fs.readdir(folder, (err, files) => {
            if (!files) {
                console.log("no files");
                return res.send();
            }

            files.forEach(file => {
                {
                    result="";
                    
                    let _promise = new Promise(function(resolve, reject) {
                         resolve(fs.readFile(folder+"/"+file));
                    });
                    promises.push(_promise);

                    _promise.then(
                
                        (_result) => { 
                            console.log(file);
                            //console.log(_result.toString());
                            result = JSON.parse(_result.toString());
                        }
                    );
                }
            });

            Promise.all(promises).then((_res) => {

                //let preparedData = processedDataToJson(result);
                let preparedData = result;
                console.log("Data from file:");
                //console.log(preparedData);
                res.send(preparedData);
            });
        });

})}


