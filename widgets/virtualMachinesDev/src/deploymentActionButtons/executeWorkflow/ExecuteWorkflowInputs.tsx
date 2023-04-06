// @ts-nocheck File not migrated fully to TS
import type { FunctionComponent } from 'react';
import InputFields from '../../../../common/src/inputs/InputFields';
import InputsHelpIcon from '../../../../common/src/inputs/InputsHelpIcon';
import { OnChange } from '../../../../common/src/inputs/types';
import YamlFileButton from '../../../../common/src/inputs/YamlFileButton';

import type { BaseWorkflowInputs, OnCheckboxChange, OnDateInputChange, UserWorkflowInputsState } from './types';

const t = Stage.Utils.getT('widgets.common.deployments.execute');

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
                inputsState={userWorkflowInputsState} //sem nacpat predvyplnene hodnoty, tady je treba lun="";
                errorsState={errors}
                toolbox={toolbox}
                // hidden={true}
            />
        </>
    );
};

export default React.memo(ExecuteWorkflowInputs);
