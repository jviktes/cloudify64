import React from "react";
// import AccordionSectionWithDivider from "../../../common/src/components/accordion/AccordionSectionWithDivider";
import DeploymentInputs from "../DeploymentInputsWizard";
import getDeploymentInputsByCategories from '../../src/wizardUtils';

interface DeploymentsInfoProps {
    toolbox: Stage.Types.Toolbox;
    blueprint: any, 
    index: any, 
    title: any, 
    deploymentInputs: any, 
    errors: any, 
    fileLoading: any, 
    activeSection: any ,
    onYamlFileChange:any,
    onDeploymentInputChange:any,
}

export default function SWConfigStep(this: any, { toolbox, blueprint, index,title,deploymentInputs,errors,fileLoading,activeSection,onYamlFileChange,onDeploymentInputChange}: DeploymentsInfoProps) {

    console.log("SWConfigStep:"+index+","+title+","+activeSection);;
    //console.log(deploymentInputs);
    //console.log(title);


    const category = "swconfig";

    const orderedInputsWithoutValues=getDeploymentInputsByCategories(deploymentInputs,category);
    //console.log(orderedInputsWithoutValues);
    //only for demo!
    if (!orderedInputsWithoutValues) {
        return (<div style={{overflow: "visible",padding:"10px"}}>
        <DeploymentInputs
            toolbox={toolbox}
            blueprint={blueprint}
            onYamlFileChange={onYamlFileChange}
            fileLoading={fileLoading}
            onDeploymentInputChange={onDeploymentInputChange}
            deploymentInputs={orderedInputsWithoutValues}
            allDeploymentInputs = {deploymentInputs}
            errors={errors}
            gsnData = {{}}
            gsnCountries = {{}}
            gsnRegions= {{}}
        />
        </div>  )
    }
    else {
        return (
            <div style={{overflow: "visible",padding:"10px"}}>This product has no additional software configurations</div>
        )
    }
}