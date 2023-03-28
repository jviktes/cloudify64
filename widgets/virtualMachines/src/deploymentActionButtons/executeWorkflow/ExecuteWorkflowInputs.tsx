// @ts-nocheck File not migrated fully to TS
import type { FunctionComponent } from 'react';
import InputFields from '../../../../common/src/inputs/InputFields';
import InputsHelpIcon from '../../../../common/src/inputs/InputsHelpIcon';
import { OnChange } from '../../../../common/src/inputs/types';
import YamlFileButton from '../../../../common/src/inputs/YamlFileButton';

import type { BaseWorkflowInputs, OnCheckboxChange, OnDateInputChange, UserWorkflowInputsState } from './types';

const t = Stage.Utils.getT('widgets.common.deployments.execute');

// function renderActionCheckbox(name: string, checked: boolean, onChange: OnCheckboxChange) {
//     const { Checkbox } = Stage.Basic.Form;
//     return (
//         <Checkbox
//             name={name}
//             toggle
//             label={t(`actions.${name}.label`)}
//             help={t(`actions.${name}.help`)}
//             checked={checked}
//             onChange={onChange}
//         />
//     );
// }

// function renderCheckboxField(name: string, checked: boolean, onChange: OnCheckboxChange) {
//     const { Field } = Stage.Basic.Form;
//     return <Field>{renderActionCheckbox(name, checked, onChange)}</Field>;
// }

export interface CommonExecuteWorflowProps {
    baseWorkflowInputs: BaseWorkflowInputs;
    userWorkflowInputsState: UserWorkflowInputsState;
    force: boolean;
    dryRun: boolean;
    queue: boolean;
    schedule: boolean;
    scheduledTime: string;
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
}

const ExecuteWorkflowInputs: FunctionComponent<ExecuteWorkflowInputsProps> = ({
    baseWorkflowInputs,
    userWorkflowInputsState,
    onYamlFileChange,
    fileLoading,
    onWorkflowInputChange,
    errors,
    toolbox,
    force,
    dryRun,
    queue,
    schedule,
    scheduledTime,
    onForceChange,
    onDryRunChange,
    onQueueChange,
    onScheduleChange,
    onScheduledTimeChange
}) => {
    const { Message, Form, Header, Divider, DateInput } = Stage.Basic;
    return (
        <>
            <InputFields
                inputs={baseWorkflowInputs}
                onChange={onWorkflowInputChange}
                inputsState={userWorkflowInputsState}
                errorsState={errors}
                toolbox={toolbox}
                
            />
        </>
    );
};

export default React.memo(ExecuteWorkflowInputs);
