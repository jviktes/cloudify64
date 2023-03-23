// @ts-nocheck File not migrated fully to TS
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import DeploymentActionButtons from '../src/deploymentActionButtons/src/DeploymentActionButtons';
import DataDisksTableVM from './DataDisksTableVM';
import ExecutionsTableVM from './ExecutionsTableVM';
import RequestsTableVM from './RequestsTableVM';

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
    static propTypes: {
        // eslint-disable-next-line react/forbid-prop-types
        data: PropTypes.Requireable<any[]>;
    };

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
        const { data, toolbox } = this.props;
        toolbox.getEventBus().on('deployments:refresh', this.refreshData, this);

        console.log("componentDidMount:"+JSON.stringify(data)); 
        {_.map(data.items, item => (        

            this.loadDetailedData(item)
        ))}
   }

    componentDidUpdate(prevProps: Readonly<VirtualMachinesDataProps>, prevState: Readonly<{}>, snapshot?: any): void {
        //console.log("VirtualMachinesTable componentDidUpdate..."); 

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
    workFlowsVMWaitingToApproval=(item:any)=> {
        let outWorks = [];
        let workflows=item.workflows
        for (const key in workflows) {
            if (Object.prototype.hasOwnProperty.call(workflows, key)) {
                const _workFlowItem = workflows[key];
                if (_workFlowItem.name=="approve_or_reject"){
                    outWorks.push(_workFlowItem);
                }
            }
        }
        return outWorks;
    };
    getProgressText = (latestExec:any)=> {

        try {
            if (latestExec.Total_operations!=0) {
                return Math.floor(latestExec.Finished_operations/latestExec.Total_operations*100);
            }
            else {
                return "running";
            }

        } catch (error) {
            return "running";
        }

    }
    getDataForDeploymentId = (itemVM:any,detailedData:any) => {

        //detailedData by mely obshovat sub-deployments a k nim nacetle executions.
        //=> potrebuju najit posledni bezici execution z moznych sub-deploymentu:
        //             _diksObj.executionAllData = element.executionAllData;
        //             _dataDisk.push(_diksObj);

        //najdu latest execution, toto pouziju pouze pro stavy loading, waiting nebo error:
        let latestRunningExecution = {};
        latestRunningExecution.DateTime = "";
        latestRunningExecution.Tooltip = "";
        latestRunningExecution.Error = "";
        latestRunningExecution.CreatedBy = "";
        latestRunningExecution.Status = "";
        latestRunningExecution.Finished_operations=0;
        latestRunningExecution.Total_operations=0;

        let combinedExecutions = [];

        if (detailedData!=undefined) {
                //VM:
                let _vmExecutions = itemVM.executionAllData[0].items;
                combinedExecutions = _vmExecutions;
                try {
                    detailedData.forEach(_deployment => {
                        let _execs = [];

                        try {
                            _execs = _deployment.executionAllData[0].items;
                            if (_execs!=null) {
                                combinedExecutions = combinedExecutions.concat(_deployment.executionAllData[0].items);
                            }
                        } catch (error) {
                            
                        }
                    });
                } catch (error) {
                    
                }
                if (combinedExecutions.length>0) {
                    let latestExec = combinedExecutions.reduce((a, b) => (a.created_at > b.created_at ? a : b));
        
                    latestRunningExecution.DateTime =latestExec.created_at;
                    latestRunningExecution.Error = latestExec.error;
                    latestRunningExecution.CreatedBy = latestExec.created_by;
                    latestRunningExecution.Status = latestExec.status;
                    latestRunningExecution.Finished_operations=latestExec.finished_operations;
                    latestRunningExecution.Total_operations=latestExec.total_operations;

                    if(latestExec["blueprint_id"].toUpperCase().indexOf("AZURE-RHEL-SINGLE-VM")!=-1) {
                        latestRunningExecution.Tooltip = "Virtual machine provisioning / update - RHEL";
                    }
                    if(latestExec["blueprint_id"].toUpperCase().indexOf("AZURE-WS-SINGLE-VM")!=-1) {
                        latestRunningExecution.Tooltip = "Virtual machine provisioning / update - Windows Server";
                    }
                    if(latestExec["blueprint_id"].toUpperCase().indexOf("AZURE-DATA-DISK")!=-1) {
                        latestRunningExecution.Tooltip = "Data disks management operation";
                    }
                    if(latestExec["blueprint_id"].toUpperCase().indexOf("JEA-")!=-1) {
                        latestRunningExecution.Tooltip = "Privileged access request - Windows Server";
                    }
                    if(latestExec["blueprint_id"].toUpperCase().indexOf("CYBERARK-ACCOUNT")!=-1) {
                        latestRunningExecution.Tooltip = "Privileged access request - RHEL";
                    }  
                    

                    //vyhodnoceni approval:
                    //podminky: "latest_execution_status": "completed" 
                    //AND latestRunningExecution.Error.contains ("breakpoint_plugin.resources.breakpoint.start")
                    let internalStatus = "";

                    if ((itemVM["latest_execution_status"] == "completed") && (latestRunningExecution?.Error?.toLowerCase().indexOf("breakpoint_plugin.resources.breakpoint.start")!=-1)) {
                        internalStatus = "waitingToApproval";
                    }
                    else {
                        internalStatus=itemVM["latest_execution_status"];
                    }

                    if (internalStatus== "in_progress"  || latestRunningExecution?.Status=="pending" || latestRunningExecution?.Status=="started") {
                        return (
                            {
                                status: 'loading',
                                tooltip:(latestRunningExecution.Tooltip + "(Executed by: "+latestRunningExecution.CreatedBy+",Progress (%):"+this.getProgressText(latestRunningExecution)+")")
                            }
                        )
                    }
                    else if (internalStatus == "failed") {
                        return (
                            {
                                status: 'error', //TODO - pokud je chyba, co s tím???
                                data: {
                                    display_name: itemVM.display_name,
                                    workflows: this.workFlowsVM(itemVM),
                                },
                                error: latestRunningExecution.Error,
                                tooltip:latestRunningExecution.Error, 
                            }
                        )
                    }

                    else if (internalStatus == "waitingToApproval") {
                        return (
                            {
                                status: 'waitingToApproval',
                                data: {
                                    display_name: itemVM.display_name,
                                    workflows: this.workFlowsVMWaitingToApproval(itemVM),
                                },
                                tooltip:"Waiting to approval"
                            }
                        )
                    }
                    else if (internalStatus == "completed") {
                        return (
                            {
                                status: 'success',
                                data: {
                                        display_name: itemVM.display_name,
                                        workflows: this.workFlowsVM(itemVM),
                                    },
                                tooltip:"Actions"}
                            )
                    }
                    else {
                        return null;
                    }
                }

        }
        else {
            return (
                {
                    status: 'loading',
                    tooltip:latestRunningExecution.Tooltip
                }
            )
        }

    };

    // eslint-disable-next-line class-methods-use-this
    onRowClick(_item:any) {

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

    }

    onRowExecutionClick(_item:any) {

        //TODO --> zmena ikony (asi trojuhelnik nahoru/dolu)
        const el = document.getElementById(`${_item.id}_executions`);
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

    }

    getDetails=(item:any) => {
        
        let _display_name = "";
        let _ip="";
        let _cpus="";
        let _ram="";
        let _azure_size=""; 
        let _azure_location="";
        let _environment="";
        let _os="";

        try {
            
               
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
            else {
                return ""; 
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

            detailedData[params.id] = _dataFromExternalSource;
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
        let _dataDisk: any[] = [];
        try {
            data.forEach((element: { [x: string]: any; display_name: any;executionAllData: any;  }) => {
                if(element["blueprint_id"].indexOf("AZURE-Data-Disk")!=-1) {
                    let _diksObj = element["inputs"];
                    _diksObj.name = element.display_name;
                    _diksObj.executionAllData = element.executionAllData;
                    _dataDisk.push(_diksObj);
                }
            });
            return _dataDisk;
        } catch (error) {
            return _dataDisk;
        }
    }

    getPAMData = (data:any) => {
        let _dataPAM: any[]= [];
        try {
            data.forEach((element: { [x: string]: any; display_name: any; executionAllData: any; }) => {
                if(element["blueprint_id"].indexOf("CyberArk-Account")!=-1) {
                    let _diksObj = element["inputs"];
                    _diksObj.name = element.display_name;
                    _diksObj.executionAllData = element.executionAllData;
                    _dataPAM.push(_diksObj);
                }
            });
            return _dataPAM;
        } catch (error) {
            return _dataPAM;
        }
    }
    getExecutionData = (itemVM:any,detailedData:any) => {
        let combinedExecutions = [];
        if (detailedData!=undefined) {
            //VM:
            let _vmExecutions = itemVM.executionAllData[0].items;
            combinedExecutions = _vmExecutions;
            try {
                detailedData.forEach(_deployment => {
                    let _execs = [];

                    try {
                        _execs = _deployment.executionAllData[0].items;
                        if (_execs!=null) {
                            combinedExecutions = combinedExecutions.concat(_deployment.executionAllData[0].items);
                        }
                    } catch (error) {
                        
                    }
                });
            } catch (error) {
                
            }
        }

        try {
            combinedExecutions.sort(function(a,b){
                return new Date(b.created_at) - new Date(a.created_at);
              });
        } catch (error) {
            
        }

        return combinedExecutions;
    }
    render() {
        /* eslint-disable no-console, no-process-exit */
        const { data, toolbox, widget } = this.props;
        const { DataTable } = Stage.Basic;

        return (
            <div>

                <DataTable
                    className="table-scroll-vm"
                    fetchData={this.fetchGridData}
                    sortColumn={widget.configuration.sortColumn}
                    sortAscending={widget.configuration.sortAscending}
                    searchable
                >

                    <DataTable.Column label="Name" name="labels"/>
                    <DataTable.Column label="OS" name="os" />
                    <DataTable.Column label="IP" name="ip" />
                    <DataTable.Column label="CPUs" name="cpus" />
                    <DataTable.Column label="RAM (GiB)" name="ram" />
                    <DataTable.Column label="Azure size" name="azure_size" />
                    <DataTable.Column label="Azure location" name="azure_location" />
                    <DataTable.Column label="Environment" name="environment" />
                    <DataTable.Column label="" name="" />
                    <DataTable.Column label="Actions" name="actions" />
                    {/* <DataTable.Column label="" name="config" name="class" /> */}
                    {_.map(data.items, item => (    
                                        
                            <DataTable.RowExpandable key={item.id}>
                            <DataTable.Row 
                                key={`${item.id}_main`}
                                id={`${item.id}_main`}
                                >
                                {this.getDetails(item)}

                                <DataTable.Data>{item.display_name}</DataTable.Data>

                                <DataTable.Data>{item.os}</DataTable.Data>
                                <DataTable.Data>{item.ip}</DataTable.Data>
                                <DataTable.Data>{item.cpus}</DataTable.Data>
                                <DataTable.Data>{item.ram}</DataTable.Data>
                                <DataTable.Data>{item.azure_size}</DataTable.Data>
                                <DataTable.Data>{item.azure_location}</DataTable.Data>
                                <DataTable.Data>{item.environment}</DataTable.Data>

                             
                                <DataTable.Data>
                                    <Button icon="expand" onClick={() => this.onRowClick(item)} />
                                    <Button icon="clock" onClick={() => this.onRowExecutionClick(item)} />
                                    </DataTable.Data>
                                <DataTable.Data>

                                    <DeploymentActionButtons
                                        buttonTitle='Actions'
                                        deploymentId={item.id}
                                        fetchedDeploymentState={this.getDataForDeploymentId(item,this.state.detailedData[item.id])}
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
                                            <div style={{width:"50%"}}><DataDisksTableVM widget={widget} vmData={item} data={this.getDataDiskData(this.state.detailedData[item.id])} menuData={this.getDataForDeploymentId(item,this.state.detailedData[item.id])} toolbox={toolbox} ></DataDisksTableVM></div>
                                            <div style={{width:"50%"}}><RequestsTableVM widget={widget} vmData={item} data={this.getPAMData(this.state.detailedData[item.id])} menuData={this.getDataForDeploymentId(item,this.state.detailedData[item.id])} toolbox={toolbox} ></RequestsTableVM></div>
                                        </div>
                                    </DataTable.Data>
                            </DataTable.Row>

                            <DataTable.Row
                                key={`${item.id}_executions`}
                                style={{ display: 'none' }}
                                id={`${item.id}_executions`}>
                                    <DataTable.Data colSpan={11}>
                                            <div style={{width:"100%"}}><ExecutionsTableVM widget={widget} vmData={item} data={this.getExecutionData(item,this.state.detailedData[item.id])} toolbox={toolbox} ></ExecutionsTableVM></div>
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
