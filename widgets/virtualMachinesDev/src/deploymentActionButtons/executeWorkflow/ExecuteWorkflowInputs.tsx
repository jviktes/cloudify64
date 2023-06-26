//// @ts-nocheck File not migrated fully to TS
import type { FunctionComponent } from 'react';
import InputFields from '../../../../common/src/inputs/InputFields';
import { OnChange } from '../../../../common/src/inputs/types';

import type { BaseWorkflowInputs, OnCheckboxChange, OnDateInputChange, UserWorkflowInputsState } from './types';
import { Form } from 'semantic-ui-react';
import InputFieldsVM from './InputFieldsVM';

export interface CommonExecuteWorflowProps {
    baseWorkflowInputs: BaseWorkflowInputs;
    userWorkflowInputsState: UserWorkflowInputsState;
    force: boolean;
    dryRun: boolean;
    queue: boolean;
    schedule: boolean;
    scheduledTime: string;
    workflowName:string,
}

interface ExecuteWorkflowInputsProps extends CommonExecuteWorflowProps {
    errors: Record<string, string>;
    onYamlFileChange: (file: File) => void;
    fileLoading: boolean;
    onWorkflowInputChange: OnChange;
    onForceChange: OnCheckboxChange;
    onDryRunChange: OnCheckboxChange;
    onQueueChange: OnCheckboxChange;
    onScheduleChange: OnCheckboxChange;
    onScheduledTimeChange: OnDateInputChange;
    toolbox: Stage.Types.Toolbox;
    workflowName:string;
    
}

const ExecuteWorkflowInputs: FunctionComponent<ExecuteWorkflowInputsProps> = ({
    baseWorkflowInputs,
    userWorkflowInputsState,
    onWorkflowInputChange,
    errors,
    toolbox,
    workflowName}) => {
    if (workflowName=="uninstall") {
        return;
    }

    else {
        return (
            <>
                <InputFieldsVM
                    inputs={baseWorkflowInputs}
                    onChange={onWorkflowInputChange}
                    inputsState={userWorkflowInputsState} //sem nacpat predvyplnene hodnoty, tady je treba lun="";
                    errorsState={errors}
                    toolbox={toolbox}
                    //hidden={true}
                />
            </>
        );
    }

};

export default React.memo(ExecuteWorkflowInputs);
