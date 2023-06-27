//// @ts-nocheck File not migrated fully to TS
import type { FunctionComponent } from 'react';
import { VM_Sizes_No_PremiumSSD } from '../../../../blueprintsWizards/src/DataDiskOptions';
import FileActions from '../../../../common/src/actions/FileActions';
import DeploymentActions from '../../../../common/src/deployments/DeploymentActions';
import { OnChange } from '../../../../common/src/inputs/types';
import DeploymentIdContext from '../../../../common/src/inputs/utils/deploymentIdContext';
import getInputFieldInitialValue from '../../../../common/src/inputs/utils/getInputFieldInitialValue';
import getUpdatedInputs from '../../../../common/src/inputs/utils/getUpdatedInputs';

import { executeWorkflow, getWorkflowName } from './common';

import ExecuteWorkflowInputs from './ExecuteWorkflowInputs';
import type {
    Errors,
    OnCheckboxChange,
    OnDateInputChange,
    Workflow,
    WorkflowOptions,
    WorkflowParameters
} from './types';
import { _getLocation } from '../../VMHelpers';


const t = Stage.Utils.getT('widgets.common.deployments.execute');

export interface ExecuteWorkflowModalProps {
    deploymentId?: string;
    deploymentName?: string;
    deployments?: string[];
    hideOptions?: boolean;
    onExecute?: (workflowParameters: WorkflowParameters, workflowOptions: WorkflowOptions) => void;
    onHide: () => void;
    toolbox: Stage.Types.Toolbox;
    workflow: Workflow | string;
    open: boolean;
    parametresModal:any;
    vmSize:any;
}

const ExecuteWorkflowModal: FunctionComponent<ExecuteWorkflowModalProps> = ({
    deploymentId = '',
    deploymentName,
    deployments = [],
    //hideOptions = false,
    onExecute = _.noop,
    onHide,
    toolbox,
    workflow,
    open,
    parametresModal,
    vmSize,
}) => {
    if (_.isString(workflow) && !(_.isString(deploymentId) && deploymentId)) {
        throw Error(
            `Invalid prop \`deploymentId\` supplied to \`ExecuteWorkflowModal\`. ` +
                `When \`workflow\` prop is specified as a string, \`deploymentId\` must be provided. ` +
                `Validation failed.`
        );
    }

    const {
        Hooks: { useErrors, useBoolean, useOpenProp, useInput, useResettableState }
    } = Stage;
    const { useEffect } = React;

    const { errors, setMessageAsError, clearErrors, setErrors } = useErrors();
    const [isLoading, setLoading, unsetLoading] = useBoolean();
    const [dryRun, setDryRun, clearDryRun] = useInput(false);
    const [isFileLoading, setFileLoading, unsetFileLoading] = useBoolean();

    const [force, setForce, clearForce] = useInput(false); 

    const [queue, setQueue, clearQueue] = useInput(false);
    const [schedule, setSchedule, clearSchedule] = useInput(false);
    const [scheduledTime, setScheduledTime, clearScheduleTime] = useInput('');
    const [baseWorkflowParams, setBaseWorkflowParams, resetBaseWorkflowParams] = useResettableState({});
    const [userWorkflowParams, setUserWorkflowParams, resetUserWorkflowParams] = useResettableState({});

    const workflowName = getWorkflowName(workflow);

    function setWorkflowParams(workflowResource: Workflow) {


        if (workflow?.name=="request_user_account") {
            //TODO toto je je mozna fake: mel bych dostavat cely seznam a pro SQL budu pouzivat cely seznam, pro plain OS a zbytek jen 2 pole:    
            //TODO lepsi zjisteni SQL a OS a jinych typu...
            if (parametresModal.blueprint_id.indexOf("SQL")) {
                workflow.parameters.account_role.constraints = [
                    {
                    "valid_values": 
                       [
                       "Administrator",
                       "RemoteDesktopUser",
                       "MSSQL-Public",
                       "MSSQL-DataReader",
                       "MSSQL-DataWriter",
                       "MSSQL-AgentReader",
                       "MSSQL-DBSSISAdmin",
                       ]
                    }
               ]
            }
            else {
                workflow.parameters.account_role.constraints = [
                    {
                    "valid_values": 
                       [
                        "Administrator",
                        "RemoteDesktopUser",
                       ]
                    }
               ]
            }

        }

        if (workflow?.name=="request_service_account") {

            //TODO lepsi zjisteni SQL a OS a jinych typu...
            if (parametresModal.blueprint_id.indexOf("SQL")) {
                workflow.parameters.account_role.constraints = [
                    {
                    "valid_values": 
                       [
                       "Services",
                       "ScheduledJobs",
                       "Administrator",
                       "MSSQL-DBOwner",
                       "MSSQL-SysAdmin",
                       "MSSQL-AgentReader",
                       "MSSQL-DBSSISAdmin",
                       ]
                    }
               ]
            }
            else {
                workflow.parameters.account_role.constraints = [
                    {
                    "valid_values": 
                       [
                        "Services",
                        "ScheduledJobs",
                       ]
                    }
               ]
            }

        }

        //uprava disku, aby se nemohli vybrat premiove pokud k tomu neni vm_size:
        if (workflow?.name=="add_disk") {

            let canBePremiumDisks=VM_Sizes_No_PremiumSSD.includes(vmSize.azure_size);

            try {
                let _baseWorkflowParams = workflowResource.parameters;
                if (canBePremiumDisks){
                    _baseWorkflowParams.disk_type.constraints = [
                         {
                         "valid_values": 
                            [
                            "Standard HDD",
                            "Standard SSD"
                            ]
                         }
                    ]
                }
                else {
                    _baseWorkflowParams.disk_type.constraints = [
                         {
                         "valid_values": 
                            [
                                "Standard HDD",
                                "Standard SSD",
                                "Premium SSD"
                            ]
                         }
                    ]
                }

                setBaseWorkflowParams(_baseWorkflowParams);
                
            } catch (error) {
                
            }
        }
        else {
            setBaseWorkflowParams(workflowResource.parameters);
        }
        
        //TODO: zde se nastavuje defautni hodnota force na false
        if (workflow?.name=="uninstall") {
            setForce(true);
            //toto nefunguje:
            let _remappadValues= {ignore_failure:true};
            setUserWorkflowParams(_remappadValues);
        }
        //console.log(parametresModal);
        else if (workflowResource.name=="remove_disk") {
            let _remappadValues= {lun:parametresModal.lun};
            setUserWorkflowParams(_remappadValues);
        }
        else if (workflowResource.name=="revoke_user_account") {
            let _remappadValues= {account_role:parametresModal.role,user_id:parametresModal.user_id};
            setUserWorkflowParams(_remappadValues);
        }
        else if (workflowResource.name=="revoke_service_account") {
            let _remappadValues= {service_account_name:parametresModal.service_account_name};
            setUserWorkflowParams(_remappadValues);
        }

        else if (workflowResource.name=="revoke_app_admin_account") {
            let _remappadValues= {account_role:parametresModal.role,user_id:parametresModal.user_id};
            setUserWorkflowParams(_remappadValues);
        }
        else if (workflowResource.name=="revoke_sys_admin_account") {
            let _remappadValues= {user_id:parametresModal.user_id};
            setUserWorkflowParams(_remappadValues);
        }

        else {
            setUserWorkflowParams(
                _.mapValues(workflowResource.parameters, parameterData =>
                    getInputFieldInitialValue(parameterData.default, parameterData.type)
                )
            );
        }

    }

    useOpenProp(open, () => {
        clearErrors();
        unsetLoading();
        clearDryRun();
        unsetFileLoading();
        clearForce();
        clearQueue();
        clearSchedule();
        clearScheduleTime();
        resetUserWorkflowParams();
        resetBaseWorkflowParams();

        const actions = new DeploymentActions(toolbox);
        if (typeof workflow === 'string') {
            setLoading();
            actions
                .doGetWorkflows(deploymentId)
                .then(({ workflows }) => {
                    const selectedWorkflow = _.find(workflows, { name: workflowName });

                    if (selectedWorkflow) {
                        setWorkflowParams(selectedWorkflow);
                    } else {
                        const deploymentNameAndId = Stage.Utils.formatDisplayName({
                            id: deploymentId,
                            displayName: deploymentName
                        });
                        setErrors(t('errors.workflowError', deploymentNameAndId, workflowName));
                    }
                })
                .catch(setMessageAsError)
                .finally(unsetLoading);
        } else {
            setWorkflowParams(workflow);
        }
    });

    useEffect(() => {
        clearQueue();
        clearErrors();
    }, [dryRun, force, schedule, scheduledTime]);

    const deploymentsList: string[] = _.isEmpty(deployments) ? _.compact([deploymentId]) : deployments;
    const contextDeploymentId = _.head(deploymentsList);

    function onApprove() {
        clearErrors();

        executeWorkflow({
            deploymentsList,
            setLoading,
            toolbox,
            workflow,
            baseWorkflowInputs: baseWorkflowParams,
            userWorkflowInputsState: userWorkflowParams,
            schedule,
            scheduledTime,
            force,
            dryRun,
            queue,
            unsetLoading,
            clearErrors,
            onExecute,
            onHide,
            workflowName
        }).catch((err: Errors) => {
            if (typeof err === 'string') {
                setErrors({ errors: err });
            } else {
                setErrors(err);
            }
            unsetLoading();
        });
    }

    function handleYamlFileChange(file: File) {
        if (!file) {
            return;
        }

        const actions = new FileActions(toolbox);
        setFileLoading();

        actions
            .doGetYamlFileContent(file)
            .then((yamlInputs: any) => {
                clearErrors();
                setUserWorkflowParams(getUpdatedInputs(baseWorkflowParams, userWorkflowParams, yamlInputs));
            })
            .catch((err: string | { message: string }) =>
                setErrors({ yamlFile: t('errors.yamlFileError', { message: _.isString(err) ? err : err.message }) })
            )
            .finally(unsetFileLoading);
    }

    const onWorkflowInputChange: OnChange = (_event, field) => {
        setUserWorkflowParams({
            ...userWorkflowParams,
            ...Stage.Basic.Form.fieldNameValue(
                field as { name: string; value: unknown; type: string; checked?: string | undefined }
            )
        });
    };

    const setDeploymentIputs=(fieldName: string,fieldNameValue: string) => 
    {
        console.log("setDeploymentIputs:"+fieldName + ";"+fieldNameValue);

        //TODO: toto prepisovalo hodnoty, co byly v userWorkflowParams a fieldName misto account_role
        //let _remappadValues= {fieldName:fieldNameValue};
        //setUserWorkflowParams(_remappadValues);
        
        //Record newValues = {"account_role":fieldNameValue};

        setUserWorkflowParams(getUpdatedInputs(baseWorkflowParams, userWorkflowParams, {"account_role":fieldNameValue}));

        console.log(userWorkflowParams);

        // setUserWorkflowParams({
        //     ...userWorkflowParams,
        //     ...Stage.Basic.Form.fieldNameValue(
        //         field as { name: string; value: unknown; type: string; checked?: string | undefined }
        //     )
        // });

    }

    toolbox.getEventBus().on('workflow:setIputs', setDeploymentIputs, this);


    const { ApproveButton, CancelButton, Form, Icon, Modal } = Stage.Basic;

    let headerKey = 'header.';
    if (!_.isEmpty(deploymentsList)) {
        if (_.size(deploymentsList) > 1) {
            headerKey += 'multipleDeployments';
        } else {
            headerKey += 'singleDeployment';
        }
    } else {
        headerKey += 'noDeployment';
    }

    const clearErrorsAndQueue = () => {
        clearErrors();
        clearQueue();
    };

    const onForceChange: OnCheckboxChange = (_event, field) => {
        clearErrorsAndQueue();
        setForce(field.checked);
    };
    const onDryRunChange: OnCheckboxChange = (_event, field) => {
        clearErrorsAndQueue();
        setDryRun(field.checked);
    };
    const onQueueChange: OnCheckboxChange = (_event, field) => {
        clearForce();
        clearDryRun();
        clearSchedule();
        clearScheduleTime();
        clearErrors();
        setQueue(field.checked);
    };
    const onScheduleChange: OnCheckboxChange = (_event, field) => {
        clearErrorsAndQueue();
        setSchedule(field.checked);
    };
    const onScheduledTimeChange: OnDateInputChange = (_event, field) => {
        clearErrorsAndQueue();
        setScheduledTime(field.value);
    };

    return (
        <Modal open={open} onClose={onHide} className="executeWorkflowModal">
            <Modal.Header>
                <Icon name="cogs" />{' '}
                {t(headerKey, {
                    workflowName,
                    deploymentId: Stage.Utils.formatDisplayName({
                        id: contextDeploymentId,
                        displayName: deploymentName
                    })
                })}
            </Modal.Header>

            <Modal.Content>
                <Form loading={isLoading} errors={errors} scrollToError onErrorsDismiss={clearErrors}>
                    <DeploymentIdContext.Provider value={contextDeploymentId}>
                        <ExecuteWorkflowInputs
                            toolbox={toolbox}

                            baseWorkflowInputs={baseWorkflowParams}
                            userWorkflowInputsState={userWorkflowParams}

                            onYamlFileChange={handleYamlFileChange}
                            onWorkflowInputChange={onWorkflowInputChange}
                            fileLoading={isFileLoading}
                            errors={errors}
                            force={force}
                            dryRun={dryRun}
                            queue={queue}
                            schedule={schedule}
                            scheduledTime={scheduledTime}
                            onForceChange={onForceChange}
                            onDryRunChange={onDryRunChange}
                            onQueueChange={onQueueChange}
                            onScheduleChange={onScheduleChange}
                            onScheduledTimeChange={onScheduledTimeChange}
                            workflowName={workflowName}
                        />
                    </DeploymentIdContext.Provider>
                </Form>
            </Modal.Content>

            <Modal.Actions>
                <CancelButton onClick={onHide} disabled={isLoading} />
                <ApproveButton onClick={onApprove} disabled={isLoading} content={t('execute')} icon="cogs" />
            </Modal.Actions>
        </Modal>
    );
};

export default ExecuteWorkflowModal;
