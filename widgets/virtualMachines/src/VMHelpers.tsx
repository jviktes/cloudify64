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
                _cpus=_getCPU(_inputsCapabilities);
                _ram=_getRAM(_inputsCapabilities);

                _display_name = item.id;
            }

            let _index = -1;
            if (item.executionAllData[0].items!=null){
                //hledani indexu ve vm, v execution pro create
                for (let index = 0; index < item.executionAllData[0].items.length; index++) {
                    const element = item.executionAllData[0].items[index];
                    if (element.workflow_id=="create_deployment_environment") {
                        _index=index;
                        break;
                    }
                }

                if (_index!=-1) {
                    let _inputs = item.executionAllData[0].items[_index]["parameters"]["inputs"];
                     _cpus=_getCPU(_inputs);
                     _ram=_getRAM(_inputs);
                    _os=_getOS(_inputs);
                }


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
export function _getCPU (inputJson:any){
    try {
        return inputJson["size"]["cpu"];
    } catch (error) {
        return "";
    }
}
export function _getRAM (inputJson:any){
    try {
        return inputJson["size"]["ram"];
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