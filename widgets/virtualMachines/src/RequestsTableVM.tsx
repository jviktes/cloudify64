// @ts-nocheck File not migrated fully to TS
import PropTypes, { bool } from 'prop-types';
import type { Tests } from './types';
import { Button } from 'semantic-ui-react';
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

        _dataFromExternalSource.forEach(_disk => {
            try {
                requestsData.push(_disk["inputs"])
            } catch (error) {
                console.log(error);
            }
        });

        this.setState({requestsData}); //tady je pole hodnot ve value
        return requestsData;
    }

    workFlowsPAMRequests=(workflows :Workflow[] )=> {
        let outWorks = [];
        for (const key in workflows) {
            if (Object.prototype.hasOwnProperty.call(workflows, key)) {
                const _workFlowItem = workflows[key];
                if (_workFlowItem.name=="add_disk"){
                    outWorks.push(_workFlowItem);
                }
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

    render() {
        /* eslint-disable no-console, no-process-exit */
        const { data, toolbox, widget } = this.props;
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
                    <div ></div>
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

                    <DataTable.Column label="Id" name="id"/>
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

                                <DataTable.Data>{JSON.stringify(item)}</DataTable.Data>
                                <DataTable.Data>{item.account_name}</DataTable.Data>
                                <DataTable.Data>{item.role}</DataTable.Data>
                                <DataTable.Data>{item.status}</DataTable.Data>
                                <DataTable.Data>{item.requestor}</DataTable.Data>

                                <DataTable.Data>

                                    <DeploymentActionButtons
                                            buttonTitle='PAM actions'
                                            deploymentId={item.id}
                                            fetchedDeploymentState={this.getDataForDeploymentId(item)}
                                            toolbox={toolbox}
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
