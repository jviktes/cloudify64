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
    nextButtonState:any,
    backButtonState:any,
}

export default function ClusteringStep(this: any, { toolbox, blueprint, index,title,deploymentInputs,errors,fileLoading,activeSection,onYamlFileChange,onDeploymentInputChange,nextButtonState,backButtonState}: DeploymentsInfoProps) {

    const category = "clustering";
    let _summary=category+":"+index+","+title+","+activeSection;
    JSON.stringify(_summary);

    //pokud neni chyba, ale tlacitko je disablovane, pak volam enablovani:
    if (nextButtonState==true) {
        toolbox.getEventBus().trigger('blueprint:enableNextButton');
    }
    return (
        
        <div style={{overflow: "visible",padding:"10px"}}>
            <DeploymentInputs
                toolbox={toolbox}
                blueprint={blueprint}
                onYamlFileChange={onYamlFileChange}
                fileLoading={fileLoading}
                onDeploymentInputChange={onDeploymentInputChange}
                deploymentInputs={getDeploymentInputsByCategories(deploymentInputs,category)}
                allDeploymentInputs = {deploymentInputs}
                errors={errors}
                gsnData = {{}}
                gsnCountries = {{}}
                gsnRegions= {{}}
                nextButtonState={nextButtonState}
                backButtonState={backButtonState}
            />
        </div>
    );
}