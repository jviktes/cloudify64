// @ts-nocheck File not migrated fully to TS
import PropTypes, { bool } from 'prop-types';
import type { Tests } from './types';
import { Button, Icon, Item } from 'semantic-ui-react';
import { identity } from 'lodash';
import { castArray } from 'lodash';
import DeploymentActionButtons from './deploymentActionButtons/src/DeploymentActionButtons';
import { dataSortingKeys } from '../../tokens/src/TokensTable.consts';

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

    workFlowsPAMRequests=(item:any, vmData:any)=> {
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

    getDataForDeploymentId = (itemVM:any,item:any) => {

        //puvodni:
        // return (
        //     {
        //         status: 'success',
        //         data: {
        //                 display_name: item.display_name,
        //                 workflows: this.workFlowsPAMRequests(vmData,item),
        //             },
        //         }
        // )


        if (itemVM["latest_execution_status"] == "in_progress") {
            return (
                {
                    status: 'loading',
                    tooltip:"Processing"
                }
            )
        }
        else if (itemVM["latest_execution_status"] == "error") {
            return (
                {
                    status: 'error',
                    tooltip:"Error",
                    error: {} 
                }
            )
        }
        else if (itemVM["latest_execution_status"] == "waiting") {
            return (
                {
                    status: 'waiting',
                    data: {
                        display_name: itemVM.display_name,
                        workflows: [],
                    },
                    tooltip:"Waiting to approval"
                }
            )
        }
        else { //"completed"
            return (
                {
                    status: 'success',
                    data: {
                            display_name: itemVM.display_name,
                            workflows: this.workFlowsPAMRequests(itemVM,item),
                        },
                    tooltip:"Actions"}
                )
        }

    };



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

    render() {
        /* eslint-disable no-console, no-process-exit */
        const { toolbox, widget, vmData,data } = this.props;
        const { DataTable } = Stage.Basic;

        return (
            <div>
                <div><span style={{fontWeight:"bold"}}>PAM requests</span></div>
                <DataTable
                    noDataMessage="There are no PAM requests"
                >

                    {/* <DataTable.Column label="Id" name="id"/> */}
                    <DataTable.Column label="Account name" name="account_name"/>
                    <DataTable.Column label="Role" name="role" />
                    <DataTable.Column label="Status" name="status" />
                    <DataTable.Column label="Requestor" name="requestor" />
                    <DataTable.Column label="Actions" name="actions"/>

                    {_.map(data, item => (      
                                      
                            <DataTable.Row>

                                {/* <DataTable.Data>{JSON.stringify(item)}</DataTable.Data> */}
                                <DataTable.Data>{item?.user_id}</DataTable.Data>
                                <DataTable.Data>{item?.role}</DataTable.Data>
                                <DataTable.Data>{item?.status}</DataTable.Data>
                                <DataTable.Data>{this.getRequestor(item)}</DataTable.Data>
                                
                                <DataTable.Data>

                                    <DeploymentActionButtons
                                            buttonTitle='PAM actions'
                                            deploymentId={vmData.id}
                                            fetchedDeploymentState={this.getDataForDeploymentId(vmData,item)}
                                            toolbox={toolbox}
                                            redirectToParentPageAfterDelete={!widget.configuration.preventRedirectToParentPageAfterDelete}
                                        />
                                    <Icon name="info circle" title={this.getExtraPAMInfo(item)}></Icon>
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
