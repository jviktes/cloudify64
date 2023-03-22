// @ts-nocheck File not migrated fully to TS
import PropTypes, { bool } from 'prop-types';
import type { Tests } from './types';
import { Button } from 'semantic-ui-react';
import { identity } from 'lodash';
import { castArray } from 'lodash';
import DeploymentActionButtons from '../src/deploymentActionButtons/src/DeploymentActionButtons';
import { dataSortingKeys } from '../../tokens/src/TokensTable.consts';
import DataDisksTableVM from './DataDisksTableVM';
import RequestsTableVM from './RequestsTableVM';
import inputs from '../../common/src/inputs';

interface VirtualMachinesDataProps {
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
export default class VirtualMachinesTable extends React.Component<VirtualMachinesDataProps> {

    constructor(props: VirtualMachinesDataProps) {
        super(props);
        console.log("VirtualMachinesTable ctor:");
        this.state = {
            detailedData: [],
            loading:false,
            showBackButton:false,
        };
    }

    componentDidMount() {
        console.log("VirtualMachinesTable componentDidMount..."); 
        const { data, toolbox, widget } = this.props;
        toolbox.getEventBus().on('deployments:refresh', this.refreshData, this);
        
        console.log("componentDidMount:"+JSON.stringify(data)); 
        {_.map(data.items, item => (        

            this.loadDetailedData(item)
        ))}
   }

    componentDidUpdate(prevProps: Readonly<VirtualMachinesDataProps>, prevState: Readonly<{}>, snapshot?: any): void {
        //console.log("VirtualMachinesTable componentDidUpdate..."); 
        const { data, toolbox, widget } = this.props;

        try {
            //pokud uz konecne dorazily data a state je nenacetly, pak takto updatuju state (=> loadDetails...)
            if (this.props.data.length!=0 && prevState.detailedData.length==0 && this.state.loading==false) {
                console.log("componentDidUpdate:"); 
                //spusteni volani celeho cyklu:
                    {_.map(this.props.data.items, item => (        
                        this.loadDetailedData(item)
                    ))}
                }
        } catch (error) {
            console.log(error);
        }

    }

    workFlowsVM=(item:any)=> {

        
                let outWorks = [];
                let workflows=item.workflows
                for (const key in workflows) {
                    if (Object.prototype.hasOwnProperty.call(workflows, key)) {
                        const _workFlowItem = workflows[key];
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
                        }

                        //TODO pouze pro Linux:
                        if (item?.os.indexOf("RHEL")!=-1) {
                            if (_workFlowItem.name=="request_app_admin_account"){
                                outWorks.push(_workFlowItem);
                            }

                            if (_workFlowItem.name=="request_sys_admin_account"){
                                outWorks.push(_workFlowItem);
                            }
                        }
                    }
                }
                return outWorks;
    };
        
    getDataForDeploymentId = (item:any) => {

        
        // const fetchedDeploymentState: ComponentProps<typeof DeploymentActionButtons
        // // eslint-disable-next-line no-nested-ternary
        // >['fetchedDeploymentState'] = Stage.Utils.isEmptyWidgetData(data)
        // ? { status: 'loading' }
        // : data instanceof Error
        // ? { status: 'error', error: data }
        // : { status: 'success', data };

        //TODO - nyni jsou vsechny success --> pozor na errory atd.

        // if (item["latest_execution_status"] == "in_progress") {
        //     return (
        //         {
        //             status: 'loading'
        //         }
        //     )
        // }
        //else {
            return (
                {
                    status: 'success',
                    data: {
                            display_name: item.display_name,
                            workflows: this.workFlowsVM(item),
                        },
                    }
            )
        //}

    };

    // eslint-disable-next-line class-methods-use-this
    onRowClick(_item) {


        //TODO --> zmena ikony (asi trojuhelnik nahoru/dolu)
        const el = document.getElementById(`${_item.id}_ext`);
        const elMain = document.getElementById(`${_item.id}_main`);
        if (el.style.display === 'none') {
            el.style.display = '';
            el.style.backgroundColor = '#e0e0e0';
            elMain.style.backgroundColor = '#e0e0e0';
        } else {
            el.style.display = 'none';
            el.style.backgroundColor = '';
            elMain.style.backgroundColor = '';
        }
        //TODO: volat pouze pri zobrazovani radku, pri skryti nevolat
        //trigger event a zobrazeni dataTable v tabulce:
        //trigger event a zobrazeni requests v tabulce:
        const { toolbox } = this.props;
        // let _eventNameDataDisks= 'vm:selectVM_data_disks_' + _item.id;
        // toolbox.getEventBus().trigger(_eventNameDataDisks,_item);

        // let _eventNamePamRequests= 'vm:selectVM_pam_requests_' + _item.id;
        // toolbox.getEventBus().trigger(_eventNamePamRequests,_item);

    }

    //render function, item = vm
    getDetails=(item:any) => {
        
        const { DataTable } = Stage.Basic;

        let _display_name = "";
        let _ip="";
        let _cpus="";
        let _ram="";
        let _azure_size=""; 
        let _azure_location="";
        let _environment="";
        let _os="";
        let _dataDisks=[];
        let _pamRequest = [];
        try {
            
                let _inputs = {};
                let _index = -1;
                if (item.executionAllData[0].items!=null){
                    //hledani indexu ve vm, v execution pro create
                    for (let index = 0; index < item.executionAllData[0].items.length; index++) {
                        const element = item.executionAllData[0].items[index];
                        if (element.workflow_id=="create_deployment_environment") {
                            _index=index;
                            break;
                        }
                    }
                    if (_index!=-1) {
                        let _inputs = item.executionAllData[0].items[_index]["parameters"]["inputs"];
                        _ip=this._getIPAdress(_inputs);
                        _cpus=this._getCPU(_inputs);
                        _ram=this._getRAM(_inputs);
                        _azure_size=this._getAzureSize(_inputs); 
                        _azure_location=this._getLocation(_inputs);
                        _environment=this._getEnvironment(_inputs);
                        _os=this._getOS(_inputs);
                        _dataDisks = this._getDataDisks(_inputs);
                        _display_name = item.id;
                    }
                }
 
        } catch (error) {
            console.log(error);
        }

        item.ip=_ip;
        item.cpus=_cpus;
        item.ram=_ram;
        item.azure_size=_azure_size;
        item.azure_location=_azure_location;
        item.environment=_environment;
        item.os=_os;
        item.dataDisks=_dataDisks;
        item.pamRequest = _pamRequest;
        item.display_name=_display_name;
    };
    _getLocation= (inputJson:any)=> {
        try {
            return inputJson["datacenter"];
        } catch (error) {
            return "";
        }
    }
    _getIPAdress = (inputJson:any)=> {
        try {
            return inputJson["reservation"]["ip"];
        } catch (error) {
            return "";
        }
    }
    _getCPU = (inputJson:any)=> {
        try {
            return inputJson["size"]["cpu"];
        } catch (error) {
            return "";
        }
    }
    _getRAM = (inputJson:any)=> {
        try {
            return inputJson["size"]["ram"];
        } catch (error) {
            return "";
        }
    }
    _getAzureSize = (inputJson:any)=> {
        try {
            return inputJson["size"]["id"];
        } catch (error) {
            return "";
        }
    }
    _getEnvironment = (inputJson:any)=> {
        try {
            return inputJson["environment"];
        } catch (error) {
            return "";
        }
    }
    _getOS = (inputJson:any)=> {

        try {
            if (inputJson["os_name"]!=undefined) {
                return inputJson["os_name"]+" (version: "+ inputJson["os_version"]+ ")";
            }
            
        } catch (error) {
            return "";
        }
    }
    _getDataDisks= (inputJson:any) => {
        try {
            return inputJson["data_disks"];
        } catch (error) {
            return "";
        }
    };
    //melo by vracet deploymenty s parrantem = executions
    loadDetailedData = async (_item:any) =>{

        if ( this.state.loading==false) {
            this.setState({ loading: true });
        }

        try {
            console.log("loadDetailedData:");
            //console.log(_item.id);
    
            const { toolbox } = this.props;
            const manager = toolbox.getManager();
            const tenantName=manager.getSelectedTenant();
            
            if (_item==null) {
                return null;
            }

            let params = {};
            params.tenant = tenantName;
            params.id = _item.id;

            if (params.id==null) {
                return null;
            }

            if (this.state==null) {
                return;
            }

            let detailedData=this.state.detailedData;
            const _dataFromExternalSource = await toolbox.getWidgetBackend().doGet('get_vm_detailsData2', { params });

            // _dataFromExternalSource.forEach(element => {
            //     detailedData.push(element); 
            // });

            detailedData[params.id] = _dataFromExternalSource;

            // if (detailedData.indexOf(_dataFromExternalSource[0].deployment_id) === -1) {
            //     detailedData.push(_dataFromExternalSource[0]); 
            // }
            // else {
            //     console.log("This item already exists");
            // }

            this.setState({detailedData});

        } catch (error) {
            console.log(error);
        }

    };

    fetchGridData = fetchParams => {
        const { toolbox } = this.props;
        return toolbox.refresh(fetchParams);
    };

    refreshData() {
        console.log("VirtualMachines refreshData...");
        const { toolbox } = this.props;
        toolbox.refresh();
    };

    getDataDiskData = (data:any) => {
        let _dataDisk = [];
        try {
            data.forEach(element => {
                if(element["blueprint_id"].indexOf("AZURE-Data-Disk")!=-1) {
                    let _diksObj = element["inputs"];
                    _diksObj.name = element.display_name;
                    _dataDisk.push(_diksObj);
                }
            });
            return _dataDisk;
        } catch (error) {
        }
    }

    getPAMData = (data:any, vmData:any) => {
        let _dataPAM= [];
        try {
            data.forEach(element => {
                if(element["blueprint_id"].indexOf("CyberArk-Account")!=-1) {
                    let _diksObj = element["inputs"];
                    _diksObj.name = element.display_name;
                    _diksObj.executionAllData = element.executionAllData;
                    _dataPAM.push(_diksObj);
                }
            });
            return _dataPAM;
        } catch (error) {
        }
    }

    render() {
        /* eslint-disable no-console, no-process-exit */
        const { data, toolbox, widget } = this.props;
        const { DataTable,Icon } = Stage.Basic;
        const manager = toolbox.getManager();
        const tenantName = manager.getSelectedTenant();

        return (
            <div>

                <DataTable
                    className="table-scroll-vm"
                    fetchData={this.fetchGridData}
                    sortColumn={widget.configuration.sortColumn}
                    sortAscending={widget.configuration.sortAscending}
                    searchable
                >

                    {/* <DataTable.Column label="Id" name="id"/> */}
                    <DataTable.Column label="Name" name="labels"/>
                    <DataTable.Column label="OS" name="os" />
                    <DataTable.Column label="IP" name="ip" />
                    <DataTable.Column label="CPUs" name="cpus" />
                    <DataTable.Column label="RAM (GiB)" name="ram" />
                    <DataTable.Column label="Azure size" name="azure_size" />
                    <DataTable.Column label="Azure location" name="azure_location" />
                    <DataTable.Column label="Environment" name="environment" />
                    {/* <DataTable.Column label="Parent" name="parent_deployment" /> */}
                    <DataTable.Column label="" name="" />
                    <DataTable.Column label="Actions" name="actions" name="class" />
                    {/* <DataTable.Column label="" name="config" name="class" /> */}
                    {_.map(data.items, item => (    
                                        
                            <DataTable.RowExpandable key={item.id}>
                            <DataTable.Row 
                                key={`${item.id}_main`}
                                id={`${item.id}_main`}
                                >
                                {this.getDetails(item)}
                                {/* <DataTable.Data>{item.id}</DataTable.Data> */}
                                <DataTable.Data>{item.display_name}</DataTable.Data>

                                <DataTable.Data>{item.os}</DataTable.Data>
                                <DataTable.Data>{item.ip}</DataTable.Data>
                                <DataTable.Data>{item.cpus}</DataTable.Data>
                                <DataTable.Data>{item.ram}</DataTable.Data>
                                <DataTable.Data>{item.azure_size}</DataTable.Data>
                                <DataTable.Data>{item.azure_location}</DataTable.Data>
                                <DataTable.Data>{item.environment}</DataTable.Data>

                             
                                <DataTable.Data><Button icon="expand" onClick={() => this.onRowClick(item)} /></DataTable.Data>
                                <DataTable.Data>

                                    <DeploymentActionButtons
                                        buttonTitle='Actions'
                                        deploymentId={item.id}
                                        fetchedDeploymentState={this.getDataForDeploymentId(item)}
                                        toolbox={toolbox}
                                        redirectToParentPageAfterDelete={!widget.configuration.preventRedirectToParentPageAfterDelete}
                                    />
                                </DataTable.Data>
                                {/* 
                                <DataTable.Data><Icon name="settings" link onClick={() => this.showCurrentSettings(item)} /></DataTable.Data>
                                 */}

                            </DataTable.Row>

                            <DataTable.Row
                                key={`${item.id}_ext`}
                                style={{ display: 'none' }}
                                id={`${item.id}_ext`}>
                                    <DataTable.Data colSpan={11}>
                                        <div className='virtualMachineMainLayout'>
                                            <div style={{width:"50%"}}><DataDisksTableVM widget={widget} vmData={item} data={this.getDataDiskData(this.state.detailedData[item.id])} toolbox={toolbox} ></DataDisksTableVM></div>
                                            <div style={{width:"50%"}}><RequestsTableVM widget={widget} vmData={item} data={this.getPAMData(this.state.detailedData[item.id],item)}  toolbox={toolbox} ></RequestsTableVM></div>
                                        </div>
                                    </DataTable.Data>
                            </DataTable.Row>

                            </DataTable.RowExpandable>
                    ))}
                </DataTable>
            </div>
        );
    }
}

VirtualMachinesTable.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    data: PropTypes.array
};
