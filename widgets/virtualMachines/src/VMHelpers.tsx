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
                    _ip=_getIPAdress(_inputs);
                    _cpus=_getCPU(_inputs);
                    _ram=_getRAM(_inputs);
                    _azure_size=_getAzureSize(_inputs); 
                    _azure_location=_getLocation(_inputs);
                    _environment=_getEnvironment(_inputs);
                    _os=_getOS(_inputs);
                    _display_name = item.id;
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
        return inputJson["reservation"]["ip"];
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
        return inputJson["size"]["id"];
    } catch (error) {
        return "";
    }
}
export function _getEnvironment (inputJson:any){
    try {
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
export function _getDataDisks(inputJson:any){
    try {
        return inputJson["data_disks"];
    } catch (error) {
        return "";
    }
};