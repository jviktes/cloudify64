
export function getDetails (item:any){
        
    let _display_name = "";
    let _ip="";
    let _cpus="";
    let _ram="";
    let _azure_size=""; 
    let _azure_location="";
    let _environment="";
    let _os="";

    try {
        
        
            //informace z capabilities:
            if (item.capabilities[0].capabilities!=null) {
                let _inputsCapabilities = item.capabilities[0].capabilities;
                _ip=_getIPAdress(_inputsCapabilities);
                _azure_size=_getAzureSize(_inputsCapabilities); 
                _azure_location=_getLocation(_inputsCapabilities);
                _environment=_getEnvironment(_inputsCapabilities);
                //TODO:
                _cpus=_getCPU(item, _azure_size);
                _ram=_getRAM(item,_azure_size);

                _display_name = item.id;
            }

            //let _index = -1;
            if (item.executionAllData[0].items!=null){
                //hledani indexu ve vm, v execution pro create
                // for (let index = 0; index < item.executionAllData[0].items.length; index++) {
                //     const element = item.executionAllData[0].items[index];
                //     if (element.workflow_id=="create_deployment_environment") {
                //         _index=index;
                //         break;
                //     }
                // }

                  var _workflow = item.executionAllData[0].items.filter((obj: { workflow_id: string; }) => {
                    return obj.workflow_id === "create_deployment_environment"
                  })

                let _inputs = _workflow[0]["parameters"]["inputs"];
                _os=_getOS(_inputs);
                // if (_index!=-1) {
                //     let _inputs = item.executionAllData[0].items[_index]["parameters"]["inputs"];
                //      //_cpus=_getCPU(_inputs);
                //      //_ram=_getRAM(_inputs);
                //     _os=_getOS(_inputs);
                // }
            }

    } catch (error) {
        console.log(error);
    }

    item.ip=_ip;
    item.cpus=_cpus;
    item.ram=_ram;
    item.azure_size=_azure_size;
    item.azure_location=_azure_location;
    item.environment=_environment;
    item.os=_os;
    item.display_name=_display_name;
};

export function _getLocation (inputJson:any) {
    try {
        return inputJson["datacenter"];
    } catch (error) {
        return "";
    }
}
export function _getIPAdress (inputJson:any){
    try {
        //return inputJson["reservation"]["ip"];
        return inputJson["vm_ip"]; //from capabilites
    } catch (error) {
        return "";
    }
}
export function _getCPU (deployment:any,_azure_size:any){
    try {
        
        let _wfname="";
        if (deployment?.os.indexOf("Windows")!=-1) {
            _wfname = "resize_windows_vm";
        }
        if (deployment?.os.indexOf("RHEL")!=-1) {
            _wfname = "resize_rhel_vm";
        }
        //maybe old version of blueprits:
        if (_wfname=="") {
            _wfname = "resize_vm";
        }

        var _workflow = deployment.workflows.filter((obj: { name: string; }) => {
            return obj.name === _wfname
          })

        //maybe old version of blueprits:
        if (_workflow==null) {
            _wfname = "resize_vm";
            _workflow = deployment.workflows.filter((obj: { name: string; }) => {
                return obj.name === _wfname
            })
        }

        //console.log(vm_size); //(2 CPU, 8GB RAM, max 4 data disks)
        let _list_of_azure_sizes = _workflow[0].parameters.size.constraints[0].valid_values;

        let _index = -1;  
        for (let index = 0; index < _list_of_azure_sizes.length; index++) {
            const element = _list_of_azure_sizes[index];
            if (element.includes(_azure_size)) {
                _index=index;
                break;
            }
        }

        var  _vm_size_description = _list_of_azure_sizes[_index];
        let cpu = _vm_size_description.substring(_vm_size_description.indexOf("(")+1,_vm_size_description.indexOf("CPU"));
        cpu = cpu.replace(' ', '');
        return cpu;
    } catch (error) {
        return "";
    }
}

export function _getRAM (deployment:any,_azure_size:any){
    try {

        let _wfname="";
        if (deployment?.os.indexOf("Windows")!=-1) {
            _wfname = "resize_windows_vm";
        }
        if (deployment?.os.indexOf("RHEL")!=-1) {
            _wfname = "resize_rhel_vm";
        }

        let _workflow = deployment.workflows.filter((obj: { name: string; }) => {
            return obj.name === _wfname
        })

        //maybe old version of blueprits:
        if (_workflow==null) {
            _wfname = "resize_vm";
            _workflow = deployment.workflows.filter((obj: { name: string; }) => {
                return obj.name === _wfname
            })
        }

       let _list_of_azure_sizes = _workflow[0].parameters.size.constraints[0].valid_values;

          let _index = -1;  
          for (let index = 0; index < _list_of_azure_sizes.length; index++) {
              const element = _list_of_azure_sizes[index];
              if (element.includes(_azure_size)) {
                  _index=index;
                  break;
              }
          }
  
          var  _vm_size_description = _list_of_azure_sizes[_index];
        let _ram = _vm_size_description.substring(_vm_size_description.indexOf(",")+1,_vm_size_description.indexOf("RAM"));
        _ram = _ram.replace('GB', '').replace(' ', '');
        //console.log(vm_size); //(2 CPU, 8GB RAM, max 4 data disks)
        return _ram;
    } catch (error) {
        return "";
    }
}

export function _getAzureSize (inputJson:any){
    try {
        //return inputJson["size"]["id"];
        return inputJson["vm_size"]; //from capabilites
    } catch (error) {
        return "";
    }
}
export function _getEnvironment (inputJson:any){
    try {
        //return inputJson["environment"];
        return inputJson["environment"];
    } catch (error) {
        return "";
    }
}
export function _getOS (inputJson:any){

    try {
        if (inputJson["os_name"]!=undefined) {
            return inputJson["os_name"]+" (version: "+ inputJson["os_version"]+ ")";
        }
        else {
            return ""; 
        }
    } catch (error) {
        return "";
    }
}
// export function _getDataDisks(inputJson:any){
//     try {
//         return inputJson["data_disks"];
//     } catch (error) {
//         return "";
//     }
// };