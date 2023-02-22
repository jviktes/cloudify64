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

    const folder = '/opt/manager/resources/gsndata/';  

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
                let preparedData = result;
                console.log("Data from file:");
                //console.log(preparedData);
                res.send(preparedData);
            });
        });

})}


