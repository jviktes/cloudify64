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
        const { toolbox } = this.props;
        toolbox.getEventBus().on('vm:selectVM', this.loadRequestData, this);
    }

    loadRequestData = async (_item:any) =>{
        //console.log(_item);
        //alert("Loading data disk data");
        const { toolbox } = this.props;
        const manager = toolbox.getManager();
        const tenantName=manager.getSelectedTenant();
        
        let params = {};
        params.tenant = tenantName;
        params.id = _item.id;

        //console.log("params:");
        //console.log(params);

        const _dataFromExternalSource = await toolbox.getWidgetBackend().doGet('get_vm_requestsData', { params }); //nactu data,

        const requestsData =  _dataFromExternalSource;
        //console.log(requestsData);

        this.setState({requestsData}); //tady je pole hodnot ve value
        return requestsData;
    }

    getUniqueRowIndex= (item:any) => {
        return Math.random().toString(36).slice(2, 11);
    }


    getDataForDeploymentId = (item:any) => {

        
        // const fetchedDeploymentState: ComponentProps<typeof DeploymentActionButtons
        // // eslint-disable-next-line no-nested-ternary
        // >['fetchedDeploymentState'] = Stage.Utils.isEmptyWidgetData(data)
        // ? { status: 'loading' }
        // : data instanceof Error
        // ? { status: 'error', error: data }
        // : { status: 'success', data };

        //TODO - nyni jsou vsechny success --> pozor na errory atd.

        return (
            {
                status: 'success',
                data: {
                        display_name: item.display_name,
                        workflows: item.workflows,
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

                                <DataTable.Data>{item.id}</DataTable.Data>
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