import type { FunctionComponent } from 'react';
import type { FullBlueprintData } from '../../common/src/blueprints/BlueprintActions';//'../blueprints/BlueprintActions'; //'../blueprints/BlueprintActions';
// import DataTypesButton from '../../common/src/inputs/DataTypesButton';
//import InputsHelpIcon from '../../common/src/inputs/InputsHelpIcon';
import InputFields from './InputFieldsWizard';
import type { OnChange } from '../../common/src/inputs/types';
// import YamlFileButton from '../../common/src/inputs/YamlFileButton';//../inputs/YamlFileButton';

// const t = Stage.Utils.getT('widgets.common.deployments.deployModal');

interface Props {
    blueprint: FullBlueprintData;
    onYamlFileChange: (file: File) => void;
    fileLoading: boolean;
    onDeploymentInputChange: OnChange;
    deploymentInputs: { [key: string]: unknown };
    allDeploymentInputs : { [key: string]: unknown };
    errors: Record<string, string>;
    toolbox: Stage.Types.Toolbox;
    gsnData:{};
    gsnCountries:{};
    gsnRegions:{};
}

const DeploymentInputs: FunctionComponent<Props> = ({
    blueprint,
    //onYamlFileChange,
    //fileLoading,
    onDeploymentInputChange,
    deploymentInputs,
    allDeploymentInputs,
    errors,
    toolbox,
    gsnData,
    gsnCountries,
    gsnRegions,
}) => {
    //const { Message } = Stage.Basic;
    //const deploymentHasInputs = !_.isEmpty(blueprint.plan.inputs);
    return (
        <>
            {blueprint.id && (
                <>
                </>
            )}
            
            <InputFields
                inputs={blueprint.plan.inputs}
                onChange={onDeploymentInputChange}
                inputsState={deploymentInputs}
                allDeploymentInputs = {allDeploymentInputs}
                errorsState={errors}
                toolbox={toolbox}
                dataTypes={blueprint.plan.data_types}
                gsnData = {gsnData}
                gsnCountries = {gsnCountries}
                gsnRegions={gsnRegions}
            />
        </>
    );
};

export default DeploymentInputs;
