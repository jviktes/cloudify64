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

    componentDidMount() {
        const { toolbox, vmData } = this.props;
        let _eventName= 'vm:selectVM_pam_requests_' + vmData.id;
        toolbox.getEventBus().on(_eventName, this.loadRequestData, this);
    }

    loadRequestData = async (_item:any) =>{
        const { toolbox } = this.props;
        const manager = toolbox.getManager();
        const tenantName=manager.getSelectedTenant();
        
        let params = {};
        params.tenant = tenantName;
        params.id = _item.id;

        const _dataFromExternalSource = await toolbox.getWidgetBackend().doGet('get_vm_requestsData', { params }); //nactu data,
        const requestsData = [];
        
        _dataFromExternalSource.forEach(_pamRequest => {
            try {
                let outObj = _pamRequest["inputs"];
                outObj.id = _pamRequest.id;
                requestsData.push(outObj)
            } catch (error) {
                console.log(error);
            }
        });
        //TODO: toto zatim volat nebudu:
        await this.loadDetailsExecution(requestsData);

        this.setState({requestsData}); //tady je pole hodnot ve value
        return requestsData;
    }

    loadDetailsExecution = async (requestsData:any) => {
        const { toolbox } = this.props;
        const manager = toolbox.getManager();
        const tenantName=manager.getSelectedTenant();
        let promises = [];
       
        try {
            requestsData.forEach(_pamRequest => {

                let params = {};
                params.tenant = tenantName;
                params.id = _pamRequest.id;

                let _dataExecutions="";
                    
                let _promise = new Promise(function(resolve, reject) {
                     resolve(toolbox.getWidgetBackend().doGet('get_vm_pam_request_executions', { params }));
                });
                promises.push(_promise);

                _promise.then(
            
                    (_dataExecutions) => { 

                        _pamRequest.executionData = _dataExecutions;
                        _dataExecutions.forEach(element => {
                            if (element.workflow_id=="create_deployment_environment") {
                                _pamRequest.requestor = element.created_by;
                            }
                        });
                        
                    }
                );
                Promise.all(promises).then((_res) => {
                    return requestsData;
                });
                
            });
        } catch (error) {
            console.log(error);
        }
        //return requestsData;
    }

    workFlowsPAMRequests=(workflows :Workflow[] )=> {
        let outWorks = [];
        //    Approve / reject request (applies to * waiting requests)
        // Revoke (applies to Grant approved / Grant implemented requests)
        for (const key in workflows) {
            if (Object.prototype.hasOwnProperty.call(workflows, key)) {
                const _workFlowItem = workflows[key];
                if (_workFlowItem.name=="approve_or_reject"){
                    outWorks.push(_workFlowItem);
                }
                if (_workFlowItem.name=="revoke_user_account"){
                    outWorks.push(_workFlowItem);
                }
            }
        }
        return outWorks;
    };

    getUniqueRowIndex= (item:any) => {
        return Math.random().toString(36).slice(2, 11);
    }

    getDataForDeploymentId = (item:any) => {

        return (
            {
                status: 'success',
                data: {
                        display_name: item.display_name,
                        workflows: this.workFlowsPAMRequests(item.workflows),
                    },
                }
        )
    };
    getExtraDiskInfo = (item:any)=> {
        let _extraData = JSON.stringify(item);
        return _extraData;
    }
    render() {
        /* eslint-disable no-console, no-process-exit */
        const { data, toolbox, widget, vmData } = this.props;
        const { DataTable } = Stage.Basic;

        //console.log(data);

        if (this.state==null) {
            return (
                <div>
                    <div ></div>
                </div>
            );
        }

        if (this.state.requestsData==null) {
            return (
                <div>
                    <div></div>
                </div>
            );
        }
        if (this.state.requestsData==undefined) {
            return (
                <div>
                    <div></div>
                </div>
            );
        }
        return (
            <div>
                <div><span style={{fontWeight:"bold"}}>PAM requests</span></div>
                <DataTable
                    className=""
                    noDataMessage="There are no PAM requests"
                >

                    {/* <DataTable.Column label="Id" name="id"/> */}
                    <DataTable.Column label="Account name" name="account_name"/>
                    <DataTable.Column label="Role" name="role" />
                    <DataTable.Column label="Status" name="status" />
                    <DataTable.Column label="Requestor" name="requestor" />
                    <DataTable.Column label="Actions" name="actions"/>

                    {_.map(this.state.requestsData, item => (      
                                      
                            <DataTable.Row
                                key={this.getUniqueRowIndex(item)}
                                id={this.getUniqueRowIndex(item)}
                            >

                                {/* <DataTable.Data>{JSON.stringify(item)}</DataTable.Data> */}
                                <DataTable.Data>{item?.user_id}</DataTable.Data>
                                <DataTable.Data>{item?.role}</DataTable.Data>
                                <DataTable.Data>{item?.status}</DataTable.Data>
                                {/* <DataTable.Data>{JSON.stringify(item?.executionData)}</DataTable.Data> */}
                                <DataTable.Data>{item?.requestor}</DataTable.Data>
                                
                                <DataTable.Data>

                                    <DeploymentActionButtons
                                            buttonTitle='PAM actions'
                                            deploymentId={vmData.id}
                                            fetchedDeploymentState={this.getDataForDeploymentId(vmData)}
                                            toolbox={toolbox}
                                            redirectToParentPageAfterDelete={!widget.configuration.preventRedirectToParentPageAfterDelete}
                                        />
                                    <Icon name="info circle" title={this.getExtraDiskInfo(item)}></Icon>
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
