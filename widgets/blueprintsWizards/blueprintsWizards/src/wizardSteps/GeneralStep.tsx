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

export default  function GeneralStep(this: any, { toolbox, blueprint, index,title,deploymentInputs,errors,fileLoading,activeSection,onYamlFileChange,onDeploymentInputChange}: DeploymentsInfoProps) {
    

    
    //const [data, setData] = React.useState({});
    console.log("GeneralStep"+index+","+title+","+activeSection);
    //console.log(blueprint); 
    
      // const fetchOnline = async () => {
      //   const response = await fetch("https://jsonplaceholder.typicode.com/users");
      //   const data = await response.json();
      //   setData(data);
      // };

      // const fetchInternalData = async () => {
      //   const response = await toolbox.getWidgetBackend().doGet('files');
      //   const data = await response;
      //   setData(data);
      // };

    // fetchQuantity();
    //console.log("data:"+data); 

    const category = "general";

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
            />

            {/* <button onClick={fetchOnline}>Load example data from external source</button>
            <button onClick={fetchInternalData}>Load example data from internal source</button>

            <pre>{JSON.stringify(data, null, "  ")}</pre> */}
            </div>

    );
}