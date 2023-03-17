// @ts-nocheck File not migrated fully to TS
import PropTypes, { bool } from 'prop-types';
import type { Tests } from './types';
import { Button, Icon, Item } from 'semantic-ui-react';
import { identity } from 'lodash';
import { castArray } from 'lodash';
import DeploymentActionButtons from './deploymentActionButtons/src/DeploymentActionButtons';
import { dataSortingKeys } from '../../tokens/src/TokensTable.consts';
import { Workflow } from '../../common/src/executeWorkflow';

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
        let _eventName= 'vm:selectVM_data_disks_' + vmData.id;
        toolbox.getEventBus().on(_eventName, this.loadDiskData, this);
    }

    workFlowsDataDisks=(workflows :Workflow[] )=> {
        let outWorks = [];
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

    getDataForDeploymentId = (item:any) => {

        return (
            {
                status: 'success',
                data: {
                        display_name: item.display_name,
                        workflows: this.workFlowsDataDisks(item.workflows),
                    },
                }
        )

    };

    getUniqueRowIndex= () => {
        return Math.random().toString(36).slice(2, 11);
    }

    loadDiskData = async (_item:any) =>{

        const { toolbox } = this.props;
        const manager = toolbox.getManager();
        const tenantName=manager.getSelectedTenant();
        
        let params = {};
        params.tenant = tenantName;
        params.id = _item.id;

        const _dataFromExternalSource = await toolbox.getWidgetBackend().doGet('get_vm_dataDiskData', { params }); //nactu data,
        const diskData = [] ;
        _dataFromExternalSource.forEach(_disk => {
            try {
                let diskObject = _disk["inputs"];
                diskObject.name=_disk.id;
                diskData.push(diskObject);
            } catch (error) {
                console.log(error);
            }
        });

        this.setState({diskData}); //tady je pole hodnot ve value
        return diskData;
    }
    getExtraDiskInfo = (item:any)=> {
        let _extraData = "Host caching: "+item.host_caching + "Disk label: " + item.label;
        return _extraData;
    }
    getTableLabelForMountPoint = (_vmData:any) => {
        if (_vmData?.os.indexOf("Windows")!=-1) {
            return ("Disk letter");
        }
        else {
            return ("Mount point");
        }
    };
    getMountPointData = (_vmData:any,item:any) => {
        if (_vmData?.os.indexOf("Windows")!=-1) {
            return (item[0].path);
        }
        else {
            return (item[0].path);
        }
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
                    <DataTable.Column label="Name" name="disk_name"/>
                    <DataTable.Column label={this.getTableLabelForMountPoint(vmData)} name="mountpoint"/>

                    <DataTable.Column label="LUN" name="lun"/>
                    <DataTable.Column label="Disk type" name="disk_type" />
                    <DataTable.Column label="Disk size (GiB)" name="disk_size" />

                    <DataTable.Column label="Actions" name="actions"/>

                    {_.map(this.state.diskData, item => (      
                                      
                            <DataTable.Row
                                // key={this.getUniqueRowIndex()}
                                // id={this.getUniqueRowIndex()}
                            >
                                <DataTable.Data title={this.getExtraDiskInfo(item)}>{(item.name)} <Icon name="info circle" title={this.getExtraDiskInfo(item)}></Icon></DataTable.Data>
                                <DataTable.Data>{getMountPointData(item.mountpoint)}</DataTable.Data>
                                <DataTable.Data>{item.lun}</DataTable.Data>
                                <DataTable.Data>{item.disk_type}</DataTable.Data>
                                <DataTable.Data>{item.disk_size}</DataTable.Data>
  
                                <DataTable.Data>

                                    <DeploymentActionButtons
                                            buttonTitle='Disk actions'
                                            deploymentId={vmData.id}
                                            fetchedDeploymentState={this.getDataForDeploymentId(vmData)}
                                            toolbox={toolbox}
                                            redirectToParentPageAfterDelete={!widget.configuration.preventRedirectToParentPageAfterDelete}
                                        />
                                </DataTable.Data>

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
