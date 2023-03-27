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
    menuData:any
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

    // workFlowsDataDisks=(workflows :Workflow[] )=> {
    //     let outWorks = [];
    //     for (const key in workflows) {
    //         if (Object.prototype.hasOwnProperty.call(workflows, key)) {
    //             const _workFlowItem = workflows[key];
    //             if (_workFlowItem.name=="resize_disk"){
    //                 outWorks.push(_workFlowItem);
    //             }
    //             if (_workFlowItem.name=="remove_disk"){
    //                 outWorks.push(_workFlowItem);
    //             }
    //         }
    //     }
    //     return outWorks;
    // };

    // getDataForDeploymentId = (item:any) => {

    //     const {menuData} = this.props;

    //     let returnMenuData = {};

    //     returnMenuData.status='success';
    //     returnMenuData.stateSummaryForDeployments=menuData.stateSummaryForDeployments;
    //     returnMenuData.latestRunningExecution=menuData.latestRunningExecution;
    //     returnMenuData.data = {
    //         display_name: menuData?.data?.display_name,
    //         workflows: this.workFlowsDataDisks(item.workflows),
    //         type:menuData?.data?.type,
    //     };
    //     returnMenuData.error= "";//;"menuData.latestRunningExecution?.Error";
    //     returnMenuData.tooltip=menuData.latestRunningExecution?.Error; 


    //     //vyberu posledni:
    //     let _latestExec = returnMenuData.stateSummaryForDeployments[item.name].executions.reduce((a, b) => (a.created_at > b.created_at ? a : b));
    //     returnMenuData.error= _latestExec.error;
    //     //"completed"
    //     if (_latestExec?.status_display== "failed") {
    //         returnMenuData.status= 'error';
    //     }

    //     //toto prebije vse:
    //     if (menuData.status=="loading") {
    //         returnMenuData.status= 'loading';
    //     }
       
    //     return returnMenuData;
    // }

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
        let _outputpath = "";

        try {
            _outputpath = item[0].path;
        } catch (error) {
            
        }

        // if (_vmData?.os.indexOf("Windows")!=-1) {

        //     _outputpath = item[0].path;

        // }
        // else {

        //     _outputpath = item[0].path;

        // }
        return _outputpath;

    }
    render() {
        /* eslint-disable no-console, no-process-exit */
        const { data, toolbox, widget,vmData,menuData } = this.props;
        const { DataTable } = Stage.Basic;

            return (<div>
                <div><span style={{fontWeight:"bold"}}>Data disks</span></div>

                <DataTable noDataMessage="There are no data disks">
                    <DataTable.Column label="Name" name="disk_name"/>
                    <DataTable.Column label={this.getTableLabelForMountPoint(vmData)} name="mountpoint"/>

                    <DataTable.Column label="LUN" name="lun"/>
                    <DataTable.Column label="Disk type" name="disk_type" />
                    <DataTable.Column label="Disk size (GiB)" name="disk_size" />

                    <DataTable.Column label="Actions" name="actions"/>

                    {_.map(data, item => (      
                                      
                            <DataTable.Row
                            >
                                <DataTable.Data title={this.getExtraDiskInfo(item)}>{(item.name)} <Icon name="info circle" title={this.getExtraDiskInfo(item)}></Icon></DataTable.Data>
                                <DataTable.Data>{this.getMountPointData(vmData,item?.mountpoint)}</DataTable.Data>
                                <DataTable.Data>{item.lun}</DataTable.Data>
                                <DataTable.Data>{item.disk_type}</DataTable.Data>
                                <DataTable.Data>{item.disk_size}</DataTable.Data>
  
                                <DataTable.Data>

                                    <DeploymentActionButtons
                                            buttonTitle='Disk actions'
                                            deploymentId={item.name}
                                            fetchedDeploymentStateComplete={menuData}
                                            toolbox={toolbox}
                                            currentDeployment = {item}
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
