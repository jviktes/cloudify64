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
   
    constructor(props: DataDisksTableVMProps) {
        super(props);
    }

    // componentDidMount() {
    //     const { toolbox } = this.props;
    //     toolbox.getEventBus().on('vm:selectVM', this.loadDataDiskData, this);
    // }

    // loadDataDiskData = async (_item:any) =>{
    //     console.log(_item);
    //     //alert("Loading data disk data");
    //     const { toolbox } = this.props;
    //     const manager = toolbox.getManager();
    //     const tenantName=manager.getSelectedTenant();
        
    //     let params = {};
    //     params.tenant = tenantName;
    //     params.id = _item.id;
    //     //console.log("params:");
    //     //console.log(params);

    //     const _dataFromExternalSource = await toolbox.getWidgetBackend().doGet('get_vm_dataDiskData', { params }); //nactu data,

    //     const dataDisk =  _dataFromExternalSource;
    //     console.log(dataDisk);

    //     this.setState({dataDisk}); //tady je pole hodnot ve value
    //     return dataDisk;

    // }

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

    getUniqueRowIndex= () => {
        return Math.random().toString(36).slice(2, 11);
    }

    render() {
        /* eslint-disable no-console, no-process-exit */
        const { data, toolbox, widget,vmData } = this.props;
        const { DataTable } = Stage.Basic;

        return (
            
            <div>
                <div >Data disks</div>

                <DataTable className="">
                    <DataTable.Column label="Label" name="label"/>
                    <DataTable.Column label="Mountpoint" name="mountpoint"/>
                    <DataTable.Column label="Disk type" name="disk_type" />
                    <DataTable.Column label="Disk size (GiB)" name="disk_size" />
                    <DataTable.Column label="Host caching" name="host_caching" />
    
                    {_.map(vmData.dataDisks, item => (      
                                      
                            <DataTable.Row
                                key={this.getUniqueRowIndex()}
                                id={this.getUniqueRowIndex()}
                            >
                                <DataTable.Data>{JSON.stringify(item.label)}</DataTable.Data>
                                <DataTable.Data>{JSON.stringify(item.mountpoint)}</DataTable.Data>
                                <DataTable.Data>{item.disk_type}</DataTable.Data>
                                <DataTable.Data>{item.disk_size}</DataTable.Data>
                                <DataTable.Data>{item.host_caching}</DataTable.Data>
                            </DataTable.Row>
                    ))}
                </DataTable>
            </div>
        );
    }
}

DataDisksTableVM.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    data: PropTypes.array
};
