import type { FunctionComponent } from 'react';
import { Icon } from 'semantic-ui-react';
import { eVMStates } from '../../eVMStates';
import { Workflow } from '../executeWorkflow';
import ExecuteWorkflowModal from '../executeWorkflow/ExecuteWorkflowModal';
import WorkflowsMenu from '../executeWorkflow/WorkflowsMenu';

type FetchedDeploymentStateComplete = { stateSummaryForDeployments:[],itemVM: any; workflows: Workflow[],childDeployment_Id:any};

interface DeploymentActionButtonsProps {
 
    fetchedDeploymentStateComplete: FetchedDeploymentStateComplete;
    toolbox: Stage.Types.Toolbox;
    redirectToParentPageAfterDelete: boolean;
    buttonTitle:string;
    currentDeployment:any;
    currentDeploymentId:any;
    parametresModal:any;
}

const DeploymentActionButtons: FunctionComponent<DeploymentActionButtonsProps> = ({
    fetchedDeploymentStateComplete,
    toolbox,
    currentDeployment,
    currentDeploymentId,
    parametresModal,
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

    const hasVMPAMRequests = () => {
        let _result = false;
        if (fetchedDeploymentStateComplete.stateSummaryForDeployments!=undefined) {
            fetchedDeploymentStateComplete.stateSummaryForDeployments.forEach(_deployment => {

                if(_deployment["blueprint_id"].toUpperCase().indexOf("JEA-")!=-1) {
                    
                    _result = true;
                }
                if(_deployment["blueprint_id"].toUpperCase().indexOf("CYBERARK-ACCOUNT")!=-1) {
                    _result = true;
                }  
            });
        }
        return _result;
    }

    const getCurrentLastExecution =(deployment_id:any) => {
        
        let stateSummaryForDeployments = [];

        if (fetchedDeploymentStateComplete.stateSummaryForDeployments!=undefined) {
                //VM:
                let _vmExecutions = fetchedDeploymentStateComplete.itemVM.executionAllData[0].items;

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

    const workFlowsPAMRequestWaitingToRevoke=(item:any)=> {
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
        let workflows=item.workflows;

        for (const key in workflows) {
            if (Object.prototype.hasOwnProperty.call(workflows, key)) {
                const _workFlowItem = workflows[key];

                if (_workFlowItem.name=="uninstall"){
                    _workFlowItem.isDisabled = hasVMPAMRequests();
                    if (_workFlowItem.isDisabled==true) {
                        _workFlowItem.tooltip = "Virtual machine has PAMs, please delete them before running unistall";
                    }
                    outWorks.push(_workFlowItem);
                }

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

        if (lastGeneralExecution!=null) {
            
            let internalStatus = lastGeneralExecution.status;

            if (internalStatus=="pending" || internalStatus=="started" || internalStatus=="queued") {
                return eVMStates.Loading;//'loading';
            }
            //toto vraci child (deployment pro PAM) za chybu:
            else if ((lastGeneralExecution?.error?.toLowerCase().indexOf("breakpoint_plugin.resources.breakpoint.start")!=-1)) {
              return eVMStates.WaitingToApproval;//"waitingToApproval";
            }
            //toto vraci VM (deployment pro VM) za chybu, pokud budu chtit zobrazovat pouze věci pro VM, pro tuto chybu vracet success? 
            else if ((lastGeneralExecution?.error?.toLowerCase().indexOf("grant_access_breakpoints")!=-1)) {
                return eVMStates.WaitingToApproval; // "waitingToApproval";
            }
            else if ((lastGeneralExecution?.error?.toLowerCase().indexOf("cloudify.interfaces.lifecycle.delete")!=-1)) {
                return eVMStates.WaitingToRevoke;
            }

            else if (internalStatus=="pending" || internalStatus=="started" || internalStatus=="queued") {
                return eVMStates.Loading;//'loading';
            }
            else if (internalStatus == "failed") {
                return eVMStates.Error;//'error';   
            }
            else if (internalStatus == "waitingToApproval") {
                return eVMStates.WaitingToApproval; //'waitingToApproval';
            }
            else if (internalStatus == "completed" || internalStatus == "terminated" ) {
                return eVMStates.Success;// 'success';
            }
            else {
                return  eVMStates.Default;// "uknown";
            }
            
        }
        else {
            return eVMStates.Loading;
            //return  'loading'; //pokud nejsou jeste data...
        } 

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

    const getWorkFlows = (_lastCurrentExecution:any,_lastCurrentStatus: eVMStates) => {

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
                if (_lastCurrentStatus==eVMStates.WaitingToApproval) {
                    workflows=workFlowsPAMRequestWaitingToApproval(fetchedDeploymentStateComplete.itemVM); //approve_or_reject na urovni deployment = zdenek...
                }
                else if (_lastCurrentStatus==eVMStates.WaitingToRevoke) {
                    workflows=workFlowsPAMRequestWaitingToRevoke(fetchedDeploymentStateComplete.itemVM); //approve_or_reject na urovni deployment = zdenek...
                }
                else {
                    workflows=workFlowsPAMRequests(fetchedDeploymentStateComplete.itemVM,currentDeployment); //revoke_app_admin_account na urovni VM
                }
            }
        }
 
        return workflows;

    }

    const getDeploymnetIdBasedOnStatus = (workflow:any)=> {

        //pokud je stav WaitingToApproval, pak se vraci jiny deployment:
        //let _lastCurrentExecution = getCurrentLastExecution(currentDeploymentId);
        //let  _lastCurrentStatus = getStatus(_lastCurrentExecution);

        if (workflow.name=="revoke_app_admin_account" ||  workflow.name=="revoke_sys_admin_account" ||  workflow.name=="revoke_service_account" || workflow.name=="revoke_user_account") {
            return fetchedDeploymentStateComplete.itemVM.id;
        }
        else {
            return currentDeploymentId;
        }
    }
    
    const getDeploymnetNameBasedOnStatus = (workflow:any)=> {

        //pokud je stav WaitingToApproval, pak se vraci jiny deployment:
        //let _lastCurrentExecution = getCurrentLastExecution(currentDeploymentId);
        //let  _lastCurrentStatus = getStatus(_lastCurrentExecution);

        if (workflow.name=="revoke_app_admin_account" ||  workflow.name=="revoke_sys_admin_account" ||  workflow.name=="revoke_service_account" || workflow.name=="revoke_user_account") {
            return fetchedDeploymentStateComplete.itemVM.display_name;
        }
        else if (workflow.name=="remove_disk") {
            return fetchedDeploymentStateComplete.itemVM.display_name;
        }
        else {
            return currentDeploymentId;
        }
    }

    const getToolTip =(_lastGeneralExecution:any, _status:eVMStates) => {
        let _toolTipText = "Actions";

        switch (_status) {
            case eVMStates.Loading:
                if (_lastGeneralExecution==null || fetchedDeploymentStateComplete.stateSummaryForDeployments==undefined) {
                    return "Loading..."
                }

                if(_lastGeneralExecution["blueprint_id"].toUpperCase().indexOf("AZURE-RHEL-SINGLE-VM")!=-1) {
                _toolTipText= "Virtual machine provisioning / update - RHEL";
                    
                }
                if(_lastGeneralExecution["blueprint_id"].toUpperCase().indexOf("AZURE-WS-SINGLE-VM")!=-1) {
                    _toolTipText = "Virtual machine provisioning / update - Windows Server";
                    
                }
                if(_lastGeneralExecution["blueprint_id"].toUpperCase().indexOf("AZURE-DATA-DISK")!=-1) {
                    _toolTipText = "Data disks management operation";
                    
                }
                if(_lastGeneralExecution["blueprint_id"].toUpperCase().indexOf("JEA-")!=-1) {
                    _toolTipText = "Privileged access request - Windows Server";
                
                }
                if(_lastGeneralExecution["blueprint_id"].toUpperCase().indexOf("CYBERARK-ACCOUNT")!=-1) {
                    _toolTipText= "Privileged access request - RHEL";
                }

                //try to add progress %
                try {
                    if (_lastGeneralExecution.Total_operations!=0) {
                        if (!Number.isNaN(Math.floor(_lastGeneralExecution.Finished_operations / _lastGeneralExecution.Total_operations * 100))) {
                            _toolTipText = _toolTipText +"(" +Math.floor(_lastGeneralExecution.Finished_operations/_lastGeneralExecution.Total_operations*100) +")";
                        }
                    }
                } catch (error) {
               
                }
                break;
             case eVMStates.Success:
                _toolTipText = "Actions";
                break;
            case eVMStates.Error:
                _toolTipText = "Error in task";
                _toolTipText = _toolTipText + "(" +_lastGeneralExecution.error+ ")";
                break;
            case eVMStates.WaitingToApproval:
                _toolTipText = "Waiting to approval";
                break;
            case eVMStates.WaitingToRevoke:
                    _toolTipText = "Waiting to revoke";
                    break;
            case eVMStates.Default:
                _toolTipText = "?";
                break;
            default:
                break;
        }

        return _toolTipText;
    }

    const renderWorkMenu=()=>{
        //for loading icon only:
        let _lastGeneralExecution = getLastGeneralExecution();
        let _computedGeneralStatus = getStatus(_lastGeneralExecution);
        let _computedTooTip = getToolTip(_lastGeneralExecution, _computedGeneralStatus);

        if (_computedGeneralStatus==eVMStates.Loading) {
            return (<Icon name="spinner" loading disabled title={_computedTooTip} />)
        }

        //specific deployment:
        let _lastCurrentExecution = getCurrentLastExecution(currentDeploymentId);
        let _lastCurrentStatus = getStatus(_lastCurrentExecution);
        _computedTooTip = getToolTip(_lastCurrentExecution, _lastCurrentStatus);

        let _computedWorkFlows = getWorkFlows(_lastCurrentExecution,_lastCurrentStatus);
        
        if (_lastCurrentStatus==eVMStates.Success) {
            return (<WorkflowsMenu
                workflows={_computedWorkFlows}
                trigger={
                    <Button
                        className="executeWorkflowButton icon"
                        color="teal"
                        icon="cogs"
                        disabled={false}
                        title={"Actions"}
                    />
                }
                onClick={setWorkflow}
            />)
        }
        if (_lastCurrentStatus==eVMStates.Loading) {
            return (<Icon name="spinner" loading disabled title={_computedTooTip} />)
        }
        if (_lastCurrentStatus==eVMStates.Error) {
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
        if (_lastCurrentStatus==eVMStates.WaitingToApproval || _lastCurrentStatus==eVMStates.WaitingToRevoke) {
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
        return <div></div>
    }
    //console.log(parametresModal);
    return (
        <div>

            {renderWorkMenu()}

            {workflow && (
                <ExecuteWorkflowModal
                    open
                    deploymentId={getDeploymnetIdBasedOnStatus(workflow)}
                    deploymentName={getDeploymnetNameBasedOnStatus(fetchedDeploymentStateComplete.itemVM.display_name)}
                    workflow={workflow}
                    parametresModal={parametresModal}
                    onHide={resetWorkflow}
                    toolbox={toolbox} 
                />
            )}
        </div>
    );
};
export default DeploymentActionButtons;
