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
        //TODO vola se tady? nebo a v didUpdatu:
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



    isItForParrentButton=(item:any)=> {

        if (item.labels==undefined || item.labels==null  || item.labels==[]) {
            return 0;
        }
        //{"key":"csys-obj-type","value":"environment"
        for (const key in item.labels) {
            if (Object.prototype.hasOwnProperty.call(item.labels, key)) {
                const _label = item.labels[key];
                if (_label.key == "csys-obj-parent") {
                    return _label.value;
                }
            }
        }
        return 0;
    }

    getDeploymentIdFromContext = (toolbox: Stage.Types.Toolbox) => {
        //VIK: zde se nacte deploymentid
        const deploymentId = toolbox.getContext().getValue('deploymentId');
        // Deployment Actions Buttons widget does not support multiple actions, thus picking only one deploymentId
        const firstDeploymentId = castArray(deploymentId)[0] as WidgetParams['id'];
    
        return firstDeploymentId;
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


    // eslint-disable-next-line class-methods-use-this
    onRowClick(_item) {
        //trigger event a zobrazeni dataTable v tabulce:
        //trigger event a zobrazeni requests v tabulce:

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

        const { toolbox } = this.props;
        toolbox.getEventBus().trigger('vm:selectVM',_item);
    }

    getDetails=(item:any) => {
        
        const { DataTable } = Stage.Basic;

        let _ip="";
        let _cpus="";
        let _ram="";
        let _azure_size=""; 
        let _azure_location="";
        let _environment="";
        let _os="";
        let _dataDisks=[];
        try {
            if (this.state.detailedData!=null && this.state.detailedData.length>0) {
                
                let _index = -1;

                for (let index = 0; index < this.state.detailedData.length; index++) {
                    const element = this.state.detailedData[index];
                    if (element.deployment_id==item.id) {
                        _index=index;
                         break;
                    }

                }

                if (_index!=-1) {
                    try {
                        let _inputs=this.state.detailedData[_index]["parameters"]["inputs"];
                       
                        _ip=this._getIPAdress(_inputs);
                        _cpus=this._getCPU(_inputs);
                        _ram=this._getRAM(_inputs);
                        _azure_size=this._getAzureSize(_inputs); 
                        _azure_location=this._getLocation(_inputs);
                        _environment=this._getEnvironment(_inputs);
                        _os=this._getOS(_inputs);
                        _dataDisks = this._getDataDisks(_inputs);
                    } 
                    catch (error) {
                        console.log(error);
                    } 
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

        //returnValue=this.state.detailedData[_index]["parameters"]["inputs"];
        //returnValue = returnValue["os_name"]+"(version:"+ returnValue["os_version"]+ ")";

        try {
            if (inputJson["os_name"]!=undefined) {
                return inputJson["os_name"]+"(version:"+ inputJson["os_version"]+ ")";
            }
            
        } catch (error) {
            return "";
        }
    }
    _getDataDisks= (inputJson:any) => {

        // <DataTable.Data>{item.id}</DataTable.Data>
        // <DataTable.Data>{item.name}</DataTable.Data>
        // <DataTable.Data>{item.disk_type}</DataTable.Data>
        // <DataTable.Data>{item.disk_size}</DataTable.Data>
        // <DataTable.Data>{item.host_caching}</DataTable.Data>
        // "data_disks": [
        //     {
        //         "disk_type": "Standard SSD",
        //         "disk_size": 16,
        //         "host_caching": "None",
        //         "mountpoint": [
        //             {
        //                 "path": "/web"
        //             }
        //         ],
        //         "label": [
        //             "WEB"
        //         ],
        //         "required": true,
        //         "key": "_dgbcgukuv"
        //     },
        //     {
        //         "disk_type": "Standard SSD",
        //         "disk_size": 16,
        //         "host_caching": "None",
        //         "mountpoint": [
        //             {
        //                 "path": {
        //                     "concat": [
        //                         "/appl/",
        //                         {
        //                             "get_input": [
        //                                 "service_names",
        //                                 0,
        //                                 "service_name"
        //                             ]
        //                         }
        //                     ]
        //                 }
        //             }
        //         ],

        try {
            return inputJson["data_disks"];
        } catch (error) {
            return "";
        }
    };

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
            const _dataFromExternalSource = await toolbox.getWidgetBackend().doGet('get_vm_detailsData', { params });

            if (detailedData.indexOf(_dataFromExternalSource[0].deployment_id) === -1) {
                detailedData.push(_dataFromExternalSource[0]); 
            }
            else {
                console.log("This item already exists");
            }

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
        const { toolbox } = this.props;
        toolbox.refresh();
    };
    //melo by odfiltrovat a zobrazit jen jeden radek:
    getParrent=(filteredDeploymentParentId:any)=> {
        const { toolbox } = this.props;
        const { widget } = this.props;
        //console.log("GetParrent for:"+filteredDeploymentParentId);
        //const params = {deploymentId: filteredId };
        //this.fetchGridData(params);
        
        this.setState({ showBackButton: true });
        toolbox.getContext().setValue('filteredDeploymentParentId', filteredDeploymentParentId);
    }
    getAllVirtualMachines =()=> {
        const { toolbox } = this.props;
        const { widget } = this.props;
        console.log("getAllVirtualMachines..");

        this.setState({ showBackButton: false });
        toolbox.getContext().setValue('filteredDeploymentParentId', null);
    }
    renderHtmlParrentButton=(item:any)=> {
        //tlacitko se bude zobrazovat pouze pokud je v labelech "csys-obj-parent"
        const { data, toolbox, widget } = this.props;
        let parrentId = this.isItForParrentButton(item);
        let _content="Go to parent";

        if (item.parent_display_name!=undefined){
            _content = "Go to parent " + item.parent_display_name; 
        }

        if (parrentId!=0) {

            return (<Button
                icon="home"
                title={_content}
                        onClick={(event: Event) => {
                            event.stopPropagation();
                            this.getParrent(parrentId);
                 } } />)
        }

    };
    renderBackButton = () => {
        //console.log("renderBackButton..."+this.state.showBackButton);
        if (this.state.showBackButton==true) {
           return (<Button
            icon="home"
            onClick={(event: Event) => {
                        event.stopPropagation();
                        this.getAllVirtualMachines();
             }} />)
        }
    };
    showCurrentSettings = (item:any) => {
        const { data } = this.props;
        let _index = -1;
        for (let index = 0; index < this.state.detailedData.length; index++) {
            const element = this.state.detailedData[index];
            if (element.deployment_id==item.id) {
                _index=index;
                 break;
            }

        }

        let _indexData = -1;
        for (let index = 0; index < data.items.length; index++) {
            const element = data.items[index];
            if (element.id==item.id) {
                _indexData=index;
                 break;
            }
        }

        let _dataToShow = this.state.detailedData[_index];
        _dataToShow.workflows = data.items[_indexData].workflows;
        console.log(_dataToShow);
        alert(JSON.stringify(_dataToShow, null, "  "));
    };

    render() {
        /* eslint-disable no-console, no-process-exit */
        const { data, toolbox, widget } = this.props;
        const { DataTable,Icon } = Stage.Basic;
        const manager = toolbox.getManager();
        const tenantName = manager.getSelectedTenant();

        return (
            <div>

                {this.renderBackButton()}

                <DataTable
                    className="agentsTable table-scroll"
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
                    <DataTable.Column label="RAM" name="ram" />
                    <DataTable.Column label="Azure size" name="azure_size" />
                    <DataTable.Column label="Azure location" name="azure_location" />
                    <DataTable.Column label="Environment" name="environment" />
                    {/* <DataTable.Column label="Parent" name="parent_deployment" /> */}
                    <DataTable.Column label="" name="" />
                    <DataTable.Column label="Actions" name="actions" name="class" />
                    <DataTable.Column label="" name="config" name="class" />
                    {_.map(data.items, item => (    
                                        
                            <DataTable.RowExpandable key={item.id}>
                            <DataTable.Row 
                                key={`${item.id}_main`}
                                id={`${item.id}_main`}>

                                {/* <DataTable.Data>{item.id}</DataTable.Data> */}
                                <DataTable.Data>{item.display_name}</DataTable.Data>

                                {this.getDetails(item)}

                                <DataTable.Data>{item.os}</DataTable.Data>
                                <DataTable.Data>{item.ip}</DataTable.Data>
                                <DataTable.Data>{item.cpus}</DataTable.Data>
                                <DataTable.Data>{item.ram}</DataTable.Data>
                                <DataTable.Data>{item.azure_size}</DataTable.Data>
                                <DataTable.Data>{item.azure_location}</DataTable.Data>
                                <DataTable.Data>{item.environment}</DataTable.Data>

                                {/* <DataTable.Data>{this.renderHtmlParrentButton(item)}</DataTable.Data> */}
                                <DataTable.Data><Button icon="add" 
                                // content={'Show details'} 
                                onClick={() => this.onRowClick(item)} /></DataTable.Data>
                                <DataTable.Data>

                                    <DeploymentActionButtons
                                        buttonTitle='Actions'
                                        deploymentId={item.id}
                                        fetchedDeploymentState={this.getDataForDeploymentId(item)}
                                        toolbox={toolbox}
                                        redirectToParentPageAfterDelete={!widget.configuration.preventRedirectToParentPageAfterDelete}
                                    />
                                </DataTable.Data>

                                <DataTable.Data><Icon name="settings" link onClick={() => this.showCurrentSettings(item)} /></DataTable.Data>
                                
                            </DataTable.Row>

                            <DataTable.Row
                                key={`${item.id}_ext`}
                                style={{ display: 'none' }}
                                id={`${item.id}_ext`}>
                                    <DataTable.Data colSpan={11}>
                                        <div className='virtualMachineMainLayout'>
                                            <div style={{width:"50%"}}><DataDisksTableVM widget={widget} vmData={item} data={data} toolbox={toolbox} ></DataDisksTableVM></div>
                                            {/* <div style={{width:"50%"}}><RequestsTableVM widget={widget} data={data} toolbox={toolbox} ></RequestsTableVM></div> */}
                                        </div>
                                    </DataTable.Data>
                                    {/* <DataTable.Data>{JSON.stringify(item)}</DataTable.Data> */}
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
