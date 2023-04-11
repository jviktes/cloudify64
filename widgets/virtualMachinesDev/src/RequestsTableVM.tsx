//// @ts-nocheck File not migrated fully to TS
import PropTypes from 'prop-types';
import DeploymentActionButtons from './deploymentActionButtons/src/DeploymentActionButtons';

interface RequestsTableVMProps {
    data: {
        items: PropTypes.array;
        total: number;
        nodeId: string;
        nodeInstanceId: string;
    };
    vmData:any
    widget: Stage.Types.Widget;
    toolbox: Stage.Types.Toolbox;
    menuData:any;
}

// eslint-disable-next-line react/prefer-stateless-function
export default class RequestsTableVM extends React.Component<RequestsTableVMProps> {

    static initialState = {
        requestsData:{},
    };

    constructor(props: RequestsTableVMProps) {
        super(props);
        this.state = this.initialState;
    }

    // workFlowsPAMRequests=(item:any, vmData:any)=> {
    //     let outWorks = [];
    //     //    Approve / reject request (applies to * waiting requests)
    //     // Revoke (applies to Grant approved / Grant implemented requests)

    //     let workflows=item.workflows;
    //     for (const key in workflows) {
    //         if (Object.prototype.hasOwnProperty.call(workflows, key)) {
    //             const _workFlowItem = workflows[key];

    //             if (_workFlowItem?.name=="revoke_app_admin_account"){
    //                 if (vmData?.role=="aadminbu") {
    //                     //Revoke app admin account
    //                     outWorks.push(_workFlowItem);
    //                 }
    //             }
    //             if (_workFlowItem?.name=="revoke_sys_admin_account"){
    //                 if (vmData?.role=="sadminbu") {
    //                     //Revoke app admin account
    //                     outWorks.push(_workFlowItem);
    //                 }
    //             }
    //             try {
    //                 if (_workFlowItem.name=="revoke_service_account"){
    //                     if (vmData.id_blueprint_id.indexOf("JEA-Service-Account")!=-1) {
    //                         //Revoke app admin account
    //                         outWorks.push(_workFlowItem);
    //                     }
    //                 } 
    //             } catch (error) {
    //                 //console.log(error);
    //             }
    //             try {
    //                 if (_workFlowItem.name=="revoke_user_account"){
    //                     if (vmData.id_blueprint_id.indexOf("JEA-Account")!=-1) {
    //                         //Revoke app admin account
    //                         outWorks.push(_workFlowItem);
    //                     }
    //                 }
    //             } catch (error) {
    //                 //console.log(error);
    //             }    


    //         }
    //     }
    //     return outWorks;
    // };
    // workFlowsVMWaitingToApproval=(item:any)=> {
    //     let outWorks = [];
    //     let workflows=item.workflows
    //     for (const key in workflows) {
    //         if (Object.prototype.hasOwnProperty.call(workflows, key)) {
    //             const _workFlowItem = workflows[key];
    //             if (_workFlowItem.name=="approve_or_reject"){
    //                 outWorks.push(_workFlowItem);
    //             }
    //         }
    //     }
    //     return outWorks;
    // };
    // getDataForDeploymentId = (itemVM:any,item:any) => {
    //     const {menuData} = this.props;

    //     let returnMenuData = {};

    //     returnMenuData.status='success';
    //     returnMenuData.stateSummaryForDeployments=menuData.stateSummaryForDeployments;
    //     returnMenuData.latestRunningExecution=menuData.latestRunningExecution;
    //     returnMenuData.data = {
    //         display_name: menuData?.data?.display_name,
    //         workflows: [],
    //         type:menuData?.data?.type,
    //     };
    //     returnMenuData.error= "";//menuData.latestRunningExecution?.Error;
    //     returnMenuData.tooltip=menuData.latestRunningExecution?.Error; 

    //     //vyberu posledni:
    //     let _latestExec = returnMenuData.stateSummaryForDeployments[item.name].executions.reduce((a, b) => (a.created_at > b.created_at ? a : b));
    //     returnMenuData.error= _latestExec.error;
    //     //TODO?
    //     if (_latestExec?.status_display== "failed")
    //     {
    //         if (returnMenuData?.error.toLowerCase().indexOf("breakpoint_plugin.resources.breakpoint.start")!=-1) 
    //             {
    //                 returnMenuData.status= 'waitingToApproval';
    //             }
    //     }

    //     if (returnMenuData.status=='waitingToApproval') {
    //         returnMenuData.data.workflows=this.workFlowsVMWaitingToApproval(itemVM)
    //     }
    //     else {
    //         returnMenuData.data.workflows=this.workFlowsPAMRequests(itemVM,item)
    //     }

    //     //toto prebije vse:
    //     if (menuData.status=="loading") {
    //         returnMenuData.status= 'loading';
    //     }
    //     return returnMenuData;
    // };

    //TODO toto by melo byt vymisteno do DeploymentActionButtons:
    // getDeploymnetIdBasedOnStatus = (vmData:any,deploymentItem:any)=> {
    //     if (deploymentItem.status=='waitingToApproval') {
    //         return deploymentItem.name;
    //     }
    //     else {
    //         return vmData.id;
    //     }
    // }

    //show all data in tooltip as JSON:
    getExtraPAMInfo = (item:any)=> {
        let _extraData = JSON.stringify(item);
        return _extraData;
    }

    getRequestor = (item:any) => {
        let _requestor = "";
        try {
            item.executionAllData[0].items.forEach(element => {
                if (element.workflow_id=="create_deployment_environment") {
                    _requestor= element.created_by;
                }
             });
        } catch (error) {
            _requestor = "";
        }
        return _requestor;

    }
    //special processing for PAM status
    getPAMStatus = (item:any)=> {
        
        if (item==undefined) {
            return "Uknown #1";
        }
        else {
            try {
                let latestExec = item.executionAllData[0].items.reduce((a, b) => (a.created_at > b.created_at ? a : b));
                if (latestExec!=null) {
                      if (latestExec.workflow_id=="create_deployment_environment" || latestExec.workflow_id=="create_deployment_environment") {
                          return "New";
                      }
                      else if (latestExec?.error?.toLowerCase().indexOf("breakpoint_plugin.resources.breakpoint.start")!=-1) {
                          return "Grant access - pending approval";
                      }
                      else if (latestExec?.error?.toLowerCase().indexOf("cloudify.interfaces.lifecycle.delete")!=-1) {
                        return "Revoke access - pending approval";
                    }
                      else if (latestExec.workflow_id=="approve_or_reject" && (latestExec.status=="pending" || latestExec.status=="started" || latestExec.status=="queued")) {
                          return "In progress";
                      }
                      else if (latestExec.workflow_id=="install" && (latestExec.status=="pending" || latestExec.status=="started" || latestExec.status=="queued")) {
                        return "In progress";
                        }
                      else if (latestExec.workflow_id=="approve_or_reject" && (latestExec.status=="completed" || latestExec.status=="terminated")) {
                          return "Implemented";
                      }
                      else if (latestExec.workflow_id=="install" && (latestExec.status=="completed" || latestExec.status=="terminated")) {
                        return "Implemented";
                    }
                      else if (latestExec?.error?.toLowerCase().indexOf("breakpoint_plugin.resources.breakpoint.start")==-1 && (latestExec.status=="failed")) {
                          return "Failed";
                      }
                     else if (latestExec.workflow_id=="uninstall") {
                        return "In progress";
                        }
                      else {
                        return "";
                      }
                      
                }
                else {
                  return "Uknown #2";
                }
      
              } catch (error) {
                  return "Uknown #3";
              }
        }

    }
    getAccount = (item:any) => {

        try {
            var _blueprint = item.executionAllData[0].items.filter((obj: { workflow_id: string; }) => {
                return obj.workflow_id === "create_deployment_environment"
            })
    
            if (_blueprint[0]["blueprint_id"].indexOf("JEA-Service-Account")!=-1){ 
                return item?.service_account_name;
            }
            else {
                return item?.user_id;
            }
        } catch (error) {
            return "";
        }

    }
    render() {
        /* eslint-disable no-console, no-process-exit */
        const { toolbox, widget,data,menuData } = this.props;
        const { DataTable } = Stage.Basic;

        return (
            <div>
                <div><span style={{fontWeight:"bold"}}>PAM requests</span></div>
                <DataTable
                    noDataMessage="There are no PAM requests"
                >

                    <DataTable.Column label="Account name" name="account_name"/>
                    <DataTable.Column label="Role" name="role" />
                    <DataTable.Column label="Status" name="status" />
                    <DataTable.Column label="Requestor" name="requestor" />
                    <DataTable.Column label="Actions" name="actions"/>

                    {_.map(data, item => (      
                                      
                            <DataTable.Row>

                                <DataTable.Data>{this.getAccount(item)}</DataTable.Data>
                                <DataTable.Data>{item?.role}</DataTable.Data>
                                <DataTable.Data>{this.getPAMStatus(item)}</DataTable.Data>
                                <DataTable.Data>{this.getRequestor(item)}</DataTable.Data>
                                
                                <DataTable.Data>

                                    <DeploymentActionButtons
                                            buttonTitle='PAM actions'
                                            //deploymentId={item.name}
                                            fetchedDeploymentStateComplete={menuData}
                                            currentDeployment = {item}
                                            currentDeploymentId = {item.deployment_id}
                                            toolbox={toolbox}
                                            parametresModal={item}
                                            redirectToParentPageAfterDelete={!widget.configuration.preventRedirectToParentPageAfterDelete}
                                     />
                                </DataTable.Data>

                            </DataTable.Row>
                    ))}
                </DataTable>

            </div>
        );
    }
}



RequestsTableVM.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    data: PropTypes.array
};
