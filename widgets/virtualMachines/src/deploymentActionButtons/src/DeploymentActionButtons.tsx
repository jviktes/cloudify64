import type { FunctionComponent } from 'react';
//import { useEffect } from 'react';
import { Icon } from 'semantic-ui-react';
import { Workflow } from '../executeWorkflow';
import ExecuteWorkflowModal from '../executeWorkflow/ExecuteWorkflowModal';
import WorkflowsMenu from '../executeWorkflow/WorkflowsMenu';

type FetchedDeploymentState =
    // eslint-disable-next-line camelcase
    | { status: 'success';stateSummaryForDeployments:[],latestRunningExecution:any, data: { display_name: string; workflows: Workflow[] };tooltip:any}
    | { status: 'loading';stateSummaryForDeployments:[],latestRunningExecution:any,data: { display_name: string; workflows: Workflow[] };tooltip:any}
    | { status: 'error'; stateSummaryForDeployments:[],latestRunningExecution:any,data: { display_name: string; workflows: Workflow[] };error: Error;tooltip:any }
    | { status: 'waitingToApproval';stateSummaryForDeployments:[],latestRunningExecution:any,data: { display_name: string; workflows: Workflow[] };tooltip:any};

// const isDeploymentFetched = (state: FetchedDeploymentState): state is FetchedDeploymentState & { status: 'success' } =>
//     state.status === 'success';

interface DeploymentActionButtonsProps {
    deploymentId?: string | null;
    fetchedDeploymentState: FetchedDeploymentState;
    toolbox: Stage.Types.Toolbox;
    redirectToParentPageAfterDelete: boolean;
    buttonTitle:string;
}

const DeploymentActionButtons: FunctionComponent<DeploymentActionButtonsProps> = ({
    deploymentId,
    fetchedDeploymentState,
    toolbox
}) => {
    const {
        Basic: { Button },
        Hooks: { useResettableState }
    } = Stage;

    const [workflow, setWorkflow, resetWorkflow] = useResettableState<Workflow | null>(null);

    // useEffect(() => {
    //     if (fetchedDeploymentState.status === 'error') {
    //         log.error('Error when fetching deployment data', fetchedDeploymentState.error);
    //     }
    // }, [fetchedDeploymentState]);

    //const buttonsDisabled = !deploymentId || ['error', 'loading'].includes(fetchedDeploymentState.status);
    //const workflows = isDeploymentFetched(fetchedDeploymentState) ? fetchedDeploymentState.data.workflows : [];
    //const workflows = fetchedDeploymentState.data.workflows;

    const renderWorkMenu=()=>{
        if (fetchedDeploymentState.status=="success") {
            return (<WorkflowsMenu
                workflows={fetchedDeploymentState.data.workflows}
                trigger={
                    <Button
                        className="executeWorkflowButton icon"
                        color="teal"
                        icon="cogs"
                        disabled={false}
                        title={fetchedDeploymentState.tooltip}
                    />
                }
                onClick={setWorkflow}
            />)
        }
        if (fetchedDeploymentState.status=="loading") {
            return (<Icon name="spinner" loading disabled title={fetchedDeploymentState.tooltip} />)
        }
        if (fetchedDeploymentState.status=="error") {
            return (<WorkflowsMenu
                workflows={fetchedDeploymentState.data.workflows}
                trigger={
                    <Button
                        className="executeWorkflowButton icon"
                        color="red"
                        icon="cogs"
                        disabled={false}
                        title={fetchedDeploymentState.tooltip}
                    />
                }
                onClick={setWorkflow}
            />)
        }
        if (fetchedDeploymentState.status=="waitingToApproval") {
            return (<WorkflowsMenu
                workflows={fetchedDeploymentState.data.workflows}
                trigger={
                    <Button
                        className="executeWorkflowButton icon"
                        color="yellow"
                        icon="cogs"
                        disabled={false}
                        title={fetchedDeploymentState.tooltip}
                    />
                }
                onClick={setWorkflow}
            />)
        }
        return <div>Nothing to render</div>
    }


    return (
        <div>

            {renderWorkMenu()}

            {deploymentId && workflow && (
                <ExecuteWorkflowModal
                    open
                    deploymentId={deploymentId}
                    deploymentName={fetchedDeploymentState.data.display_name}
                    workflow={workflow}
                    onHide={resetWorkflow}
                    toolbox={toolbox}
                    
                />
            )}
        </div>
    );
};
export default DeploymentActionButtons;
