import type { FunctionComponent } from 'react';
import { Icon } from 'semantic-ui-react';
import { Workflow } from '../executeWorkflow';
import ExecuteWorkflowModal from '../executeWorkflow/ExecuteWorkflowModal';
import WorkflowsMenu from '../executeWorkflow/WorkflowsMenu';

// type FetchedDeploymentState =
//     // eslint-disable-next-line camelcase
//     | { status: 'success';stateSummaryForDeployments:[],lastVMExecution:any,latestRunningExecution:any, data: { display_name: string; workflows: Workflow[] };tooltip:any}
//     | { status: 'loading';stateSummaryForDeployments:[],lastVMExecution:any,latestRunningExecution:any,data: { display_name: string; workflows: Workflow[] };tooltip:any}
//     | { status: 'error'; stateSummaryForDeployments:[],lastVMExecution:any,latestRunningExecution:any,data: { display_name: string; workflows: Workflow[] };error: Error;tooltip:any }
//     | { status: 'waitingToApproval';stateSummaryForDeployments:[],lastVMExecution:any,latestRunningExecution:any,data: { display_name: string; workflows: Workflow[] };tooltip:any};


type FetchedDeploymentStateComplete = { stateSummaryForDeployments:[],itemVM: any; workflows: Workflow[],childDeployment_Id:any};

// stateSummaryForDeployments:stateSummaryForDeployments,
// display_name: itemVM.display_name,
// childDeployment_Id:deploymentId,
// workflows: this.workFlowsVM(itemVM),

interface DeploymentActionButtonsProps {
    //deploymentId?: string | null;
    fetchedDeploymentStateComplete: FetchedDeploymentStateComplete;
    toolbox: Stage.Types.Toolbox;
    redirectToParentPageAfterDelete: boolean;
    buttonTitle:string;
    currentDeployment:any;
    currentDeploymentId:any;
}

const DeploymentActionButtons: FunctionComponent<DeploymentActionButtonsProps> = ({
    //deploymentId,
    fetchedDeploymentStateComplete,
    toolbox,
    currentDeployment,
    currentDeploymentId
}) => {
    const {
        Basic: { Button },
        Hooks: { useResettableState }
    } = Stage;

    const [workflow, setWorkflow, resetWorkflow] = useResettableState<Workflow | null>(null);

    const getLastGeneralExecution =() => {
            let combinedExecutions = [];

            let _vmExecutions = fetchedDeploymentStateComplete.itemVM.executionAllData[0].items;
            combinedExecutions=_vmExecutions;
            if (fetchedDeploymentStateComplete.stateSummaryForDeployments!=undefined) {
                fetchedDeploymentStateComplete.stateSummaryForDeployments.forEach(_deployment => {
                    let _execs = [];
    
                    try {
                        _execs = _deployment.executionAllData[0].items;
                        if (_execs!=null) {
                            combinedExecutions = combinedExecutions.concat(_deployment.executionAllData[0].items);
                        }
                    } catch (error) {
            
                    }
                });
            }


        if (combinedExecutions.length!=0) {
            let latestExec = combinedExecutions.reduce((a, b) => (a.created_at > b.created_at ? a : b));
            return latestExec;
        }
        else {
            return null;
        }

        
    }

    const getCurrentLastExecution =(deployment_id:any) => {
        
        let stateSummaryForDeployments = [];

        if (fetchedDeploymentStateComplete.stateSummaryForDeployments!=undefined) {
                //VM:
                let _vmExecutions = fetchedDeploymentStateComplete.itemVM.executionAllData[0].items;
                //stateSummaryForDeployments[fetchedDeploymentStateComplete.itemVM.display_name]=_vmExecutions;
                
                let stateDeploymentObjVM = {};
                stateDeploymentObjVM.executions = _vmExecutions;
                stateSummaryForDeployments[fetchedDeploymentStateComplete.itemVM.display_name]=stateDeploymentObjVM;
                //childs deployments:
                try {
                    fetchedDeploymentStateComplete.stateSummaryForDeployments.forEach(_deployment => {

                        let stateDeploymentObj = {};
                        stateDeploymentObj.executions = _deployment.executionAllData[0].items;
                        stateSummaryForDeployments[_deployment.id]=stateDeploymentObj;

                    });
                } catch (error) {
                    
                }
       }
       try {
        let latestExec = stateSummaryForDeployments[deployment_id].executions.reduce((a, b) => (a.created_at > b.created_at ? a : b));
            return latestExec;
        } catch (error) {
            return null;
       }
    }

    const workFlowsDataDisks=(item:any)=> {
        let outWorks = [];
        let workflows=item.workflows;
        for (const key in workflows) {
            if (Object.prototype.hasOwnProperty.call(workflows, key)) {
                const _workFlowItem = workflows[key];
                if (_workFlowItem.name=="resize_disk"){
                    outWorks.push(_workFlowItem);
                }
                if (_workFlowItem.name=="remove_disk"){
                    outWorks.push(_workFlowItem);
                }
            }
        }
        return outWorks;
    };

    const workFlowsPAMRequests=(item:any, vmData:any)=> {
        let outWorks = [];
        //    Approve / reject request (applies to * waiting requests)
        // Revoke (applies to Grant approved / Grant implemented requests)

        let workflows=item.workflows;
        for (const key in workflows) {
            if (Object.prototype.hasOwnProperty.call(workflows, key)) {
                const _workFlowItem = workflows[key];

                if (_workFlowItem?.name=="revoke_app_admin_account"){
                    if (vmData?.role=="aadminbu") {
                        //Revoke app admin account
                        outWorks.push(_workFlowItem);
                    }
                }
                if (_workFlowItem?.name=="revoke_sys_admin_account"){
                    if (vmData?.role=="sadminbu") {
                        //Revoke app admin account
                        outWorks.push(_workFlowItem);
                    }
                }
                try {
                    if (_workFlowItem.name=="revoke_service_account"){
                        if (vmData.id_blueprint_id.indexOf("JEA-Service-Account")!=-1) {
                            //Revoke app admin account
                            outWorks.push(_workFlowItem);
                        }
                    } 
                } catch (error) {
                    //console.log(error);
                }
                try {
                    if (_workFlowItem.name=="revoke_user_account"){
                        if (vmData.id_blueprint_id.indexOf("JEA-Account")!=-1) {
                            //Revoke app admin account
                            outWorks.push(_workFlowItem);
                        }
                    }
                } catch (error) {
                    //console.log(error);
                }    


            }
        }
        return outWorks;
    };
    const workFlowsPAMRequestWaitingToApproval=(item:any)=> {
        let outWorks = [];
        let workflows=item.workflows
        for (const key in workflows) {
            if (Object.prototype.hasOwnProperty.call(workflows, key)) {
                const _workFlowItem = workflows[key];
                if (_workFlowItem.name=="approve_or_reject"){
                    outWorks.push(_workFlowItem);
                }
            }
        }
        return outWorks;
    };

    const workFlowsVM=(item:any)=> {
        let outWorks = [];
        let workflows=item.workflows
        for (const key in workflows) {
            if (Object.prototype.hasOwnProperty.call(workflows, key)) {
                const _workFlowItem = workflows[key];
                if (_workFlowItem.name=="restart_vm"){
                    outWorks.push(_workFlowItem);
                }
                if (_workFlowItem.name=="run_audit"){
                    outWorks.push(_workFlowItem);
                }
                if (_workFlowItem.name=="add_disk"){
                    outWorks.push(_workFlowItem);
                }
                if (_workFlowItem.name=="add_ultra_disk"){
                    outWorks.push(_workFlowItem);
                }
                //TODO pouze pro WIN:
                if (item?.os.indexOf("Windows")!=-1) {
                    if (_workFlowItem.name=="request_user_account"){
                        outWorks.push(_workFlowItem);
                    }

                    if (_workFlowItem.name=="request_service_account"){
                        outWorks.push(_workFlowItem);
                    }

                    if (_workFlowItem.name=="resize_windows_vm"){
                        outWorks.push(_workFlowItem);
                    }

                }

                //TODO pouze pro Linux:
                if (item?.os.indexOf("RHEL")!=-1) {
                    if (_workFlowItem.name=="request_app_admin_account"){
                        outWorks.push(_workFlowItem);
                    }

                    if (_workFlowItem.name=="request_sys_admin_account"){
                        outWorks.push(_workFlowItem);
                    }

                    if (_workFlowItem.name=="resize_rhel_vm"){
                        outWorks.push(_workFlowItem);
                    }
                }
            }
        }
        return outWorks;
};

    const getStatus = (lastGeneralExecution:any) => {

        let returnStatus = "";

        if (lastGeneralExecution!=null) {
            
            let internalStatus = lastGeneralExecution.status;
            if ((lastGeneralExecution?.error?.toLowerCase().indexOf("breakpoint_plugin.resources.breakpoint.start")!=-1)) {
              internalStatus = "waitingToApproval";
            }

            if (internalStatus=="pending" || internalStatus=="started" || internalStatus=="queued") {
                        returnStatus='loading';
            }
            else if (internalStatus == "failed") {
                        returnStatus= 'error';   
            }
            else if (internalStatus == "waitingToApproval") {
                returnStatus='waitingToApproval';
            }
            else if (internalStatus == "completed" || internalStatus == "terminated" ) {
                returnStatus='success';
            }
            else {
                returnStatus = "uknown";
            }
            
        }
        else {
            returnStatus='loading'; //pokud nejsou jeste data...
        } 

        return returnStatus;
    }

    const getDeploymenttype = (_lastCurrentExecution:any) => {
        let deploymentType="";
        if(_lastCurrentExecution["blueprint_id"].toUpperCase().indexOf("AZURE-RHEL-SINGLE-VM")!=-1) {
            deploymentType = "vm";
            
        }
        if(_lastCurrentExecution["blueprint_id"].toUpperCase().indexOf("AZURE-WS-SINGLE-VM")!=-1) {
            deploymentType = "vm";
            
        }
        if(_lastCurrentExecution["blueprint_id"].toUpperCase().indexOf("AZURE-DATA-DISK")!=-1) {
            deploymentType = "dataDisks";
            
        }
        if(_lastCurrentExecution["blueprint_id"].toUpperCase().indexOf("JEA-")!=-1) {
            deploymentType = "pams";
           
        }
        if(_lastCurrentExecution["blueprint_id"].toUpperCase().indexOf("CYBERARK-ACCOUNT")!=-1) {
            deploymentType = "pams";
        }  
        return deploymentType;

    }

    const getWorkFlows = (_lastCurrentExecution:any,_lastCurrentStatus:any) => {

        //musim poznat, jestli se jedna o disky, vm nebo PAM a podle stavu, uzivatelskych roli atd. vracet seznam workwlows
      
        let workflows = [];
        if (_lastCurrentExecution!=null) {

            let deploymentType = getDeploymenttype(_lastCurrentExecution);

            if (deploymentType=="vm") {
                 workflows=workFlowsVM(fetchedDeploymentStateComplete.itemVM);
            }
            if (deploymentType=="dataDisks") {
                workflows=workFlowsDataDisks(fetchedDeploymentStateComplete.itemVM);
            }
            if (deploymentType=="pams") {
                if (_lastCurrentStatus=="waitingToApproval") {
                    workflows=workFlowsPAMRequestWaitingToApproval(fetchedDeploymentStateComplete.itemVM); //approve_or_reject na urovni deployment = zdenek...
                }
                else {
                    workflows=workFlowsPAMRequests(fetchedDeploymentStateComplete.itemVM,currentDeployment); //revoke_app_admin_account na urovni VM
                }
            }
        }
 

        return workflows;

    }

    const getDeploymnetIdBasedOnStatus = ()=> {

        //pokud je sta
        let _lastCurrentExecution = getCurrentLastExecution(currentDeploymentId);
        let _lastCurrentStatus = getStatus(_lastCurrentExecution);

        if (_lastCurrentStatus=='waitingToApproval') {
            return fetchedDeploymentStateComplete.itemVM.id;
        }
        else {
            return currentDeploymentId;
        }
    }
    
    const getToolTip =() => {
        // if(_lastCurrentExecution["blueprint_id"].toUpperCase().indexOf("AZURE-RHEL-SINGLE-VM")!=-1) {
        //     latestRunningExecution.Tooltip = "Virtual machine provisioning / update - RHEL";
            
        // }
        // if(_lastCurrentExecution["blueprint_id"].toUpperCase().indexOf("AZURE-WS-SINGLE-VM")!=-1) {
        //     latestRunningExecution.Tooltip = "Virtual machine provisioning / update - Windows Server";
            
        // }
        // if(_lastCurrentExecution["blueprint_id"].toUpperCase().indexOf("AZURE-DATA-DISK")!=-1) {
        //     latestRunningExecution.Tooltip = "Data disks management operation";
            
        // }
        // if(_lastCurrentExecution["blueprint_id"].toUpperCase().indexOf("JEA-")!=-1) {
        //     latestRunningExecution.Tooltip = "Privileged access request - Windows Server";
           
        // }
        // if(_lastCurrentExecution["blueprint_id"].toUpperCase().indexOf("CYBERARK-ACCOUNT")!=-1) {
        //     latestRunningExecution.Tooltip = "Privileged access request - RHEL";
            
        // }
        
        // getProgressText = (latestExec:any)=> {

        //     try {
        //         if (latestExec.Total_operations!=0) {
        //             return Math.floor(latestExec.Finished_operations/latestExec.Total_operations*100);
        //         }
        //         else {
        //             return "running";
        //         }
    
        //     } catch (error) {
        //         return "running";
        //     }
    
        // }

        return "tooltip text";
    }

    const renderWorkMenu=()=>{
        let _lastGeneralExecution = getLastGeneralExecution();
        let _computedGeneralStatus = getStatus(_lastGeneralExecution);

        let _lastCurrentExecution = getCurrentLastExecution(currentDeploymentId);
        let _lastCurrentStatus = getStatus(_lastCurrentExecution);
        let _computedWorkFlows = getWorkFlows(_lastCurrentExecution,_lastCurrentStatus);
        let _computedTooTip = getToolTip();

        if (_computedGeneralStatus=="loading") {
            return (<Icon name="spinner" loading disabled title={_computedTooTip} />)
        }

        if (_lastCurrentStatus=="success") {
            return (<WorkflowsMenu
                workflows={_computedWorkFlows}
                trigger={
                    <Button
                        className="executeWorkflowButton icon"
                        color="teal"
                        icon="cogs"
                        disabled={false}
                        title={_computedTooTip}
                    />
                }
                onClick={setWorkflow}
            />)
        }
        if (_lastCurrentStatus=="loading") {
            return (<Icon name="spinner" loading disabled title={_computedTooTip} />)
        }
        if (_lastCurrentStatus=="error") {
            return (<WorkflowsMenu
                workflows={_computedWorkFlows}
                trigger={
                    <Button
                        className="executeWorkflowButton icon"
                        color="red"
                        icon="cogs"
                        disabled={false}
                        title={_computedTooTip}
                    />
                }
                onClick={setWorkflow}
            />)
        }
        if (_lastCurrentStatus=="waitingToApproval") {
            return (<WorkflowsMenu
                workflows={_computedWorkFlows}
                trigger={
                    <Button
                        className="executeWorkflowButton icon"
                        color="yellow"
                        icon="cogs"
                        disabled={false}
                        title={_computedTooTip}
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

            {workflow && (
                <ExecuteWorkflowModal
                    open
                    deploymentId={getDeploymnetIdBasedOnStatus()}
                    deploymentName={fetchedDeploymentStateComplete.itemVM.display_name}
                    workflow={workflow}
                    onHide={resetWorkflow}
                    toolbox={toolbox} 
                />
            )}
        </div>
    );
};
export default DeploymentActionButtons;
