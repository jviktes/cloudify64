/* eslint-disable no-console, no-process-exit */
// @ts-nocheck File not migrated fully to TS

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
            //TODO - nacitat pouze soubor GSN_real_data.json
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
                //TODO vybrat unikatni hodnoty a prednost maji ty s mladsi casovou znackou:
                //console.log("Data from file:");
                
                const uniqueItems = preparedData.result.reduce((accumulator, current) => {
                    if (!accumulator.find((item) => item.u_number === current.u_number)) {
                      accumulator.push(current);
                    }
                    return accumulator;
                  }, []);
                let _resData = {result:uniqueItems};  
                res.send(_resData);
            });
        });

})}


