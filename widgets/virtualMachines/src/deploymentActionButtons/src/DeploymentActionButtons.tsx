import type { FunctionComponent } from 'react';
import { useEffect } from 'react';
import type { Workflow } from '../../../../common/src/executeWorkflow';

type FetchedDeploymentState =
    // eslint-disable-next-line camelcase
    | { status: 'success'; data: { display_name: string; workflows: Workflow[] } }
    | { status: 'loading' }
    | { status: 'error'; error: Error };

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
    toolbox,
    redirectToParentPageAfterDelete,
    buttonTitle
}) => {
    const {
        Basic: { Button },
        Hooks: { useResettableState }
    } = Stage;
    //const ExecuteWorkflowModal = Stage.Common.Workflows.ExecuteModal;
    //const WorkflowsMenu = Stage.Common.Workflows.Menu;
    const DeploymentActionsMenu = Stage.Common.Deployments.ActionsMenu;
    const DeploymentActionsModals = Stage.Common.Deployments.ActionsModals;

    const [activeAction, setActiveAction, resetActiveAction] = useResettableState<string | null>(null);
    //const [workflow, setWorkflow, resetWorkflow] = useResettableState<Workflow | null>(null);
    //const [workflow, resetWorkflow] = useResettableState<Workflow | null>(null);

    useEffect(() => {
        if (fetchedDeploymentState.status === 'error') {
            log.error('Error when fetching deployment data', fetchedDeploymentState.error);
        }
    }, [fetchedDeploymentState]);

    const buttonsDisabled = !deploymentId || ['error', 'loading'].includes(fetchedDeploymentState.status);
    const workflows = isDeploymentFetched(fetchedDeploymentState) ? fetchedDeploymentState.data.workflows : [];

    // const actions = Object.freeze({
    //     delete: 'delete',
    //     forceDelete: 'forceDelete',
    //     install: 'install',
    //     manageLabels: 'manageLabels',
    //     setSite: 'setSite',
    //     uninstall: 'uninstall',
    //     update: 'update'
    // });

    //const actions = Object();

    //vyber polozek --> TODO: doplnit konfiguraci...
    // const workFlowsDHL=(workflows :Workflow[] )=> {

    //     //
    //     console.log(workflows);
    //     let outWorks = [];
    //     for (const key in workflows) {
    //         if (Object.prototype.hasOwnProperty.call(workflows, key)) {
    //             const _workFlowItem = workflows[key];
    //             if (_workFlowItem.name=="validate_agents")
    //             outWorks.push(_workFlowItem);

    //         }
    //     }
    //     ;
    //     let _workFlowItem = { name: "toolbox.getContext().setValue('filteredDeploymentParentId', '12497956')", plugin:"", parameters:{},is_available:true};
        
    //     outWorks.push(_workFlowItem);
    //     return outWorks;
    // };

    //console.log(fetchedDeploymentState);

    return (
        <div>

            {/* workflows musim už tady přetřídit, co chci zobrazit atd. */}
            {/* TODO: jak tam pridat delete, musim se modlit, aby to bylo v seznamu a nemusel to nejak davat z  DeploymentActionsMenu*/}
            {/* TODO: jak sem pridat tlacitko pro get parrent?*/}
            {/* <WorkflowsMenu
                workflows={workFlowsDHL(workflows)}
                trigger={
                    <Button
                        className="executeWorkflowButton labeled icon"
                        color="teal"
                        icon="cogs"
                        disabled={buttonsDisabled}
                        content="Execute workflow"
                    />
                }
                onClick={setWorkflow}
            /> */}

            {/* VIK toto je menu pod kterym je menu pro deploymnety (instal, update atd.) 
            seznamy položek jsou natvrdo definované v common/src/deployments/DeploymentsActionMenu:
                    { name: actions.install, icon: 'play', permission: executeWorkflowPermission },
                    { name: actions.update, icon: 'edit', permission: 'deployment_update_create' },
                    { name: actions.setSite, icon: 'building', permission: 'deployment_set_site' },
                    { name: actions.manageLabels, icon: 'tags', permission: 'deployment_create' },
                    { name: actions.uninstall, icon: 'recycle', permission: executeWorkflowPermission },
                    { name: actions.delete, icon: 'trash alternate', permission: 'deployment_delete' },
                    { name: actions.forceDelete, icon: 'trash', permission: 'deployment_delete' }
            */}
            
            <DeploymentActionsMenu
                onActionClick={setActiveAction}
                toolbox={toolbox}
                trigger={
                    <Button
                        className="deploymentActionsButton labeled icon"
                        color="teal"
                        icon="content"
                        disabled={buttonsDisabled}
                        content={buttonTitle}
                    />
                }
                workflows={workflows}
            />

            {/* {isDeploymentFetched(fetchedDeploymentState) && deploymentId && workflow && (
                <ExecuteWorkflowModal
                    open
                    deploymentId={deploymentId}
                    deploymentName={fetchedDeploymentState.data.display_name}
                    workflow={workflow}
                    onHide={resetWorkflow}
                    toolbox={toolbox}
                />
            )} */}

            {isDeploymentFetched(fetchedDeploymentState) && deploymentId && activeAction && (
                <DeploymentActionsModals
                    activeAction={activeAction}
                    deploymentId={deploymentId}
                    deploymentName={fetchedDeploymentState.data.display_name}
                    onHide={resetActiveAction}
                    toolbox={toolbox}
                    redirectToParentPageAfterDelete={redirectToParentPageAfterDelete}
                />
            )}
        </div>
    );
};
export default DeploymentActionButtons;
