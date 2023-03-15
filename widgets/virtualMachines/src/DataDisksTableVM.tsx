// @ts-nocheck File not migrated fully to TS
import PropTypes, { bool } from 'prop-types';
import type { Tests } from './types';
import { Button } from 'semantic-ui-react';
import { identity } from 'lodash';
import { castArray } from 'lodash';
import DeploymentActionButtons from './deploymentActionButtons/src/DeploymentActionButtons';
import { dataSortingKeys } from '../../tokens/src/TokensTable.consts';

interface DataDisksTableVMProps {
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
export default class DataDisksTableVM extends React.Component<DataDisksTableVMProps> {
   
    static initialState = {
        diskData:{},
    };

    constructor(props: DataDisksTableVMProps) {
        super(props);
        this.state = this.initialState;
    }

    componentDidMount() {
        const { toolbox, vmData } = this.props;
        let _eventName= 'vm:selectVM' + vmData.id;
        toolbox.getEventBus().on(_eventName, this.loadDiskData, this);
    }

    getDataForDeploymentId = (item:any) => {

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

    getUniqueRowIndex= () => {
        return Math.random().toString(36).slice(2, 11);
    }

    loadDiskData = async (_item:any) =>{
        //console.log(_item);
        const { toolbox } = this.props;
        const manager = toolbox.getManager();
        const tenantName=manager.getSelectedTenant();
        
        let params = {};
        params.tenant = tenantName;
        params.id = _item.id;

        //console.log("params:");
        //console.log(params);

        const _dataFromExternalSource = await toolbox.getWidgetBackend().doGet('get_vm_dataDiskData', { params }); //nactu data,
        const diskData = [] ;
        _dataFromExternalSource.forEach(_disk => {
            try {
                diskData.push(_disk["inputs"])
            } catch (error) {
                console.log(error);
            }
        });

        //const diskData =  _dataFromExternalSource;
        //console.log(diskData);

        this.setState({diskData}); //tady je pole hodnot ve value
        return diskData;
    }

    render() {
        /* eslint-disable no-console, no-process-exit */
        const { data, toolbox, widget,vmData } = this.props;
        const { DataTable } = Stage.Basic;

            if (this.state==null) {
                return (
                    <div>
                        <div ></div>
                    </div>
                );
            }
    
            if (this.state.diskData==null) {
                return (
                    <div>
                        <div></div>
                    </div>
                );
            }

            return (<div>
                <div><span style={{fontWeight:"bold"}}>Data disks</span></div>

                <DataTable className="" noDataMessage="There are no data disks">
                    <DataTable.Column label="Label" name="label"/>
                    {/* <DataTable.Column label="Mountpoint" name="mountpoint"/> */}
                    <DataTable.Column label="Disk type" name="disk_type" />
                    <DataTable.Column label="Disk size (GiB)" name="disk_size" />
                    <DataTable.Column label="Host caching" name="host_caching" />
                    {/* <DataTable.Column label="Actions" name="actions"/> */}

                    {_.map(this.state.diskData, item => (      
                                      
                            <DataTable.Row
                                key={this.getUniqueRowIndex()}
                                id={this.getUniqueRowIndex()}
                            >
                                <DataTable.Data>{JSON.stringify(item.label)}</DataTable.Data>
                                {/* <DataTable.Data>{JSON.stringify(item.mountpoint)}</DataTable.Data> */}
                                <DataTable.Data>{item.disk_type}</DataTable.Data>
                                <DataTable.Data>{item.disk_size}</DataTable.Data>
                                <DataTable.Data>{item.host_caching}</DataTable.Data>

                                {/* <DataTable.Data>

                                    <DeploymentActionButtons
                                            buttonTitle='Disk actions'
                                            deploymentId={vmData.id}
                                            fetchedDeploymentState={this.getDataForDeploymentId(vmData)}
                                            toolbox={toolbox}
                                            redirectToParentPageAfterDelete={!widget.configuration.preventRedirectToParentPageAfterDelete}
                                        />
                                </DataTable.Data> */}

                            </DataTable.Row>
                    ))}
                </DataTable>
            </div>)
        
    }
}

DataDisksTableVM.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    data: PropTypes.array
};
