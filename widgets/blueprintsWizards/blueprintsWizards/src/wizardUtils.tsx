
export default function getDeploymentInputsByCategories( _deploymentInputs: Record<string, unknown>, category:string) {

    const inputsWithoutValues: Record<string, unknown> = {};
    
    _.forEach(_deploymentInputs, (inputObj, inputName) => {

        let tt = inputObj; //TODO out?
        String(tt);
        
        //TODO: following to some config file?

        if (category=="general") {
            if (inputName=="location") {
                inputsWithoutValues[inputName] = _deploymentInputs["location"];
            }
            if (inputName=="product_name") {
                inputsWithoutValues[inputName] = _deploymentInputs["product_name"];
            }
            if (inputName=="quantity") {
                inputsWithoutValues[inputName] = _deploymentInputs["quantity"];
            }
            if (inputName=="environment") {
                inputsWithoutValues[inputName] = _deploymentInputs["environment"];
            }
            if (inputName=="network_segment") {
                inputsWithoutValues[inputName] = _deploymentInputs["network_segment"];
            }
        }

        if (category=="clustering") {
            if (inputName=="availability_zone") {
                inputsWithoutValues[inputName] = _deploymentInputs["availability_zone"];
            }
            if (inputName=="ha_concept") {
                inputsWithoutValues[inputName] = _deploymentInputs["ha_concept"];
            }
            if (inputName=="availability_set") {
                inputsWithoutValues[inputName] = _deploymentInputs["availability_set"];
            }
        }

        if (category=="gsn") {
            if (inputName=="business_unit") {
                inputsWithoutValues[inputName] = _deploymentInputs["business_unit"];
            }
            if (inputName=="impact") {
                inputsWithoutValues[inputName] = _deploymentInputs["impact"];
            }
            if (inputName=="impacted_region") {
                inputsWithoutValues[inputName] = _deploymentInputs["impacted_region"];
            }
            if (inputName=="impacted_country") {
                inputsWithoutValues[inputName] = _deploymentInputs["impacted_country"];
            }
            if (inputName=="business_service") {
                inputsWithoutValues[inputName] = _deploymentInputs["business_service"];
            }
        }

        if (category=="swconfig") {
            if (inputName=="sw_apps") {
                inputsWithoutValues[inputName] = _deploymentInputs["sw_apps"];
            }
        }

        if (category=="vmconfig") {
            if (inputName=="vm_size") {
                inputsWithoutValues[inputName] = _deploymentInputs["vm_size"];
            }
            if (inputName=="disk_size") {
                inputsWithoutValues[inputName] = _deploymentInputs["disk_size"];
            }
            if (inputName=="os_disk_type") {
                inputsWithoutValues[inputName] = _deploymentInputs["os_disk_type"];
            }
            if (inputName=="data_disks") {
                inputsWithoutValues[inputName] = _deploymentInputs["data_disks"];
            }           
        }

    });

    //TODO sort by order
    const orderedInputsWithoutValues: Record<string, unknown> =  getDeploymentInputsOrderByCategories(inputsWithoutValues, category);
    return orderedInputsWithoutValues;

}   


const generalOrder = ["product_name", "quantity","environment","location", "network_segment"];
const clusteringOrder = ["ha_concept","availability_zone","availability_set"];
const vmconfigOrder = ["vm_size","os_disk_type","disk_size","data_disks"];
const swconfigOrder = ["sw_apps"];
const gsnOrder = ["business_unit","impact","impacted_region","impacted_country","business_service"];

export function getInputsOrderByCategories (_inputs: Record<string, any>) {

    const orderedInputsWithoutValues: Record<string, unknown> = {};

    const allInputsOrder = generalOrder.concat(clusteringOrder,vmconfigOrder,swconfigOrder,gsnOrder);
    //console.log("allInputsOrder");
    //console.log(allInputsOrder);

    for (let index = 0; index < allInputsOrder.length; index++) {
        const element = allInputsOrder[index];
        if (_inputs[element]!=null) {
            orderedInputsWithoutValues[element]=_inputs[element];
        }
    }
    //console.log("getInputsOrderByCategories:");
    //console.log(orderedInputsWithoutValues);
    return orderedInputsWithoutValues;
}


export function getDeploymentInputsOrderByCategories( _deploymentInputs: Record<string, unknown>, category:string) {

    //TODO sort by order
    const orderedInputsWithoutValues: Record<string, unknown> = {};

    // TODO - change to general function
    if (category=="general") {
        for (let index = 0; index < generalOrder.length; index++) {
            const element = generalOrder[index];
            if (_deploymentInputs[element]!=null) {
                orderedInputsWithoutValues[element]=_deploymentInputs[element];
            }
        }
    }
    
    if (category=="clustering") {
        
        for (let index = 0; index < clusteringOrder.length; index++) {
            const element = clusteringOrder[index];
            if (_deploymentInputs[element]!=null) {
                orderedInputsWithoutValues[element]=_deploymentInputs[element];
            }
        }
    }

    if (category=="vmconfig") {

        for (let index = 0; index < vmconfigOrder.length; index++) {
            const element = vmconfigOrder[index];
            if (_deploymentInputs[element]!=null) {
                orderedInputsWithoutValues[element]=_deploymentInputs[element];
            }
        }
    }

    if (category=="swconfig") {
        
        for (let index = 0; index < swconfigOrder.length; index++) {
            const element = swconfigOrder[index];
            if (_deploymentInputs[element]!=null) {
                orderedInputsWithoutValues[element]=_deploymentInputs[element];
            }
        }
    }

    if (category=="gsn") {

        for (let index = 0; index < gsnOrder.length; index++) {
            const element = gsnOrder[index];
            if (_deploymentInputs[element]!=null) {
                orderedInputsWithoutValues[element]=_deploymentInputs[element];
            }
        }
    }

    // console.log("orderedInputsWithoutValues:");
    // console.log(orderedInputsWithoutValues);
    return orderedInputsWithoutValues;
}
