import type { FunctionComponent } from 'react';
import { useEffect } from 'react';
import { Icon } from 'semantic-ui-react';
import { Workflow } from '../executeWorkflow';
import ExecuteWorkflowModal from '../executeWorkflow/ExecuteWorkflowModal';
import WorkflowsMenu from '../executeWorkflow/WorkflowsMenu';

type FetchedDeploymentState =
    // eslint-disable-next-line camelcase
    | { status: 'success'; data: { display_name: string; workflows: Workflow[] };tooltip:any}
    | { status: 'loading';tooltip:any}
    | { status: 'error'; error: Error;tooltip:any }
    | { status: 'waiting';tooltip:any};

const isDeploymentFetched = (state: FetchedDeploymentState): state is FetchedDeploymentState & { status: 'success' } =>
    state.status === 'success';

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

    useEffect(() => {
        if (fetchedDeploymentState.status === 'error') {
            log.error('Error when fetching deployment data', fetchedDeploymentState.error);
        }
    }, [fetchedDeploymentState]);

    const buttonsDisabled = !deploymentId || ['error', 'loading'].includes(fetchedDeploymentState.status);
    const workflows = isDeploymentFetched(fetchedDeploymentState) ? fetchedDeploymentState.data.workflows : [];


    const renderWorkMenu=()=>{
        if (fetchedDeploymentState.status=="success") {
            return (<WorkflowsMenu
                workflows={workflows}
                trigger={
                    <Button
                        className="executeWorkflowButton icon"
                        color="teal"
                        icon="cogs"
                        disabled={buttonsDisabled}
                        title={fetchedDeploymentState.tooltip}
                    />
                }
                onClick={setWorkflow}
            />)
        }
        if (fetchedDeploymentState.status=="loading") {
            return (<Icon name="spinner" loading disabled title={fetchedDeploymentState.tooltip} />)
            // <WorkflowsMenu
            //     workflows={workflows}
            //     trigger={
            //         <Button
            //             className="executeWorkflowButton icon"
            //             color="teal"
            //             icon="cogs"
            //             disabled={buttonsDisabled}
            //             title={fetchedDeploymentState.tooltip}
            //         />
            //     }
            //     onClick={setWorkflow}
            // />
        }
        if (fetchedDeploymentState.status=="error") {
            return (<Icon name="stop" color="red" title={fetchedDeploymentState.tooltip} />)
        }
        if (fetchedDeploymentState.status=="waiting") {
            return (<WorkflowsMenu
                workflows={workflows}
                trigger={
                    <Button
                        className="executeWorkflowButton icon"
                        color="teal"
                        icon="cogs"
                        disabled={buttonsDisabled}
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

            {isDeploymentFetched(fetchedDeploymentState) && deploymentId && workflow && (
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
