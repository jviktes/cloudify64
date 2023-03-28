//// @ts-nocheck File not migrated fully to TS
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import DeploymentActionButtons from '../src/deploymentActionButtons/src/DeploymentActionButtons';
import DataDisksTableVM from './DataDisksTableVM';
import ExecutionsTableVM from './ExecutionsTableVM';
import RequestsTableVM from './RequestsTableVM';
import { getDetails } from './VMHelpers';

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
            lastLoadingDate:undefined,
            showBackButton:false,
        };
    }

    componentDidMount() {
        console.log("VirtualMachinesTable componentDidMount..."); 
        const { data, toolbox } = this.props;
        toolbox.getEventBus().on('deployments:refresh', this.refreshData, this);

        //console.log("componentDidMount:"+JSON.stringify(data)); 
        {_.map(data.items, item => (        

            this.loadDetailedData(item)
        ))}
   }

    componentDidUpdate(prevProps: Readonly<VirtualMachinesDataProps>, prevState: Readonly<{}>, snapshot?: any): void {
        //console.log("VirtualMachinesTable componentDidUpdate..."); 

        try {

            if (this.props.data.items.length==undefined){
                return;
            }

            let isAfter30s = false;
            if (this.state.lastLoadingDate==undefined) {
                isAfter30s=true;
            }
            else {
                if ((Date.now()-this.state.lastLoadingDate)>30000) {
                    isAfter30s=true;
                }
            }
            
            if (this.state.loading==false && isAfter30s) {
                console.log("componentDidUpdate call loading:"); 
                //spusteni volani celeho cyklu:
                    //this.setState({ loading: true });
                    if ( this.state.loading==false) {
                        this.setState({ loading: true });
                    }

                    {_.map(this.props.data.items, item => (
                        this.loadDetailedData(item)
                    ))}
                    //if (this.props.data.items.length!=undefined){
                        this.setState({lastLoadingDate:Date.now()});
                        this.setState({ loading: false });
                    //}    


            }
            
        } catch (error) {
            console.log(error);
        }
    };
    //melo by vracet deploymenty s parrantem = executions
    loadDetailedData = async (_item:any) =>{



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

    //itemVM = hlavni VM
    getMenuData = (itemVM:any,detailedData:any, deploymentId:any) => {

        return (
                {
                    stateSummaryForDeployments:detailedData,
                    display_name: itemVM.display_name,
                    childDeployment_Id:deploymentId,
                    itemVM: itemVM,
                    workflows: itemVM.workflows,
                }
            )
    }

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
    getExpandedButton (item:any) {
        //pokud v expanded data budou nejake chyby nebo waitingy, pak se tlacitko bude zobrazovat jinak:
        //nactu data pro

        let isAnyErrorInSubDeployments = false;
        let isAnyWaitingForWaitingForApprovalInSubDeployments = false;
        try {
            this.state.detailedData[item.id].forEach(_deployment => {

                try {
                    let latestExec= _deployment.executionAllData[0].items.reduce((a, b) => (a.created_at > b.created_at ? a : b));

                    //pokud je posledni beh problemovy, pak :

                    if ((latestExec?.error?.toLowerCase().indexOf("breakpoint_plugin.resources.breakpoint.start")!=-1)) {
                        isAnyWaitingForWaitingForApprovalInSubDeployments = true;
                      }
                        //   //toto vraci VM (deployment pro VM) za chybu, pokud budu chtit zobrazovat pouze věci pro VM, pro tuto chybu vracet success? 
                        //   if ((lastGeneralExecution?.error?.toLowerCase().indexOf("grant_access_breakpoints")!=-1)) {
                        //       return eVMStates.WaitingToApproval; // "waitingToApproval";
                        //   }

                      else if (latestExec.status == "failed") {
                          isAnyErrorInSubDeployments = true;
                      }
                      else if (latestExec.status == "waitingToApproval") {
                        isAnyWaitingForWaitingForApprovalInSubDeployments = true;
                      }
                } catch (error) {
                    
                }

            });
        } catch (error) {
            
        }
        if (isAnyErrorInSubDeployments==true) {
            return <Button icon="expand" color='red' onClick={() => this.onRowClick(item)} />;
        }
        if (isAnyWaitingForWaitingForApprovalInSubDeployments==true) {
            return <Button icon="expand" color='yellow' onClick={() => this.onRowClick(item)} />;
        }

        return <Button icon="expand" onClick={() => this.onRowClick(item)} />;

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

    fetchGridData = fetchParams => {
        const { toolbox } = this.props;
        return toolbox.refresh(fetchParams);
    };

    refreshData() {
        console.log("VirtualMachines refreshData...");

        const { data, toolbox } = this.props;

        {_.map(data.items, item => (        

            this.loadDetailedData(item)
        ))}

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
                    _diksObj.workflows = element["workflows"];
                    _diksObj.deployment_id = element.id;
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
                    _diksObj.workflows = element["workflows"];
                    _diksObj.deployment_id = element.id;
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
                                {getDetails(item)}

                                <DataTable.Data>{item.display_name}</DataTable.Data>

                                <DataTable.Data>{item.os}</DataTable.Data>
                                <DataTable.Data>{item.ip}</DataTable.Data>
                                <DataTable.Data>{item.cpus}</DataTable.Data>
                                <DataTable.Data>{item.ram}</DataTable.Data>
                                <DataTable.Data>{item.azure_size}</DataTable.Data>
                                <DataTable.Data>{item.azure_location}</DataTable.Data>
                                <DataTable.Data>{item.environment}</DataTable.Data>

                             
                                <DataTable.Data>
                                    {this.getExpandedButton(item)}
                                    <Button icon="clock" onClick={() => this.onRowExecutionClick(item)} />
                                    </DataTable.Data>
                                <DataTable.Data>

                                    <DeploymentActionButtons
                                        buttonTitle='Actions'
                                        //deploymentId={item.id}
                                        fetchedDeploymentStateComplete={this.getMenuData(item, this.state.detailedData[item.id], item.id)}
                                        toolbox={toolbox}
                                        currentDeployment={item}
                                        currentDeploymentId={item.id}
                                        redirectToParentPageAfterDelete={!widget.configuration.preventRedirectToParentPageAfterDelete} 
                                        parametresModal={item}                                    />
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
                                            <div style={{width:"50%"}}><DataDisksTableVM widget={widget} vmData={item} data={this.getDataDiskData(this.state.detailedData[item.id])} menuData={this.getMenuData(item,this.state.detailedData[item.id],item.id)}toolbox={toolbox} ></DataDisksTableVM></div>
                                            <div style={{width:"50%"}}><RequestsTableVM widget={widget} vmData={item} data={this.getPAMData(this.state.detailedData[item.id])} menuData={this.getMenuData(item,this.state.detailedData[item.id],item.id)} toolbox={toolbox} ></RequestsTableVM></div>
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
