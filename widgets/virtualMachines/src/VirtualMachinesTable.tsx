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
    // static propTypes: any;

    // static initialState = {
    //     //gsnData:{result: PropTypes.arrayOf(GSNBusinessServiceProps)},
    //     detailedData:[],
    //     loading:"nazdar"
    // };

    constructor(props: VirtualMachinesDataProps) {
        super(props);
        console.log("VirtualMachinesTable ctor:");
        //this.state = this.initialState;
        this.state = {
            detailedData: [],
            loading:false
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
        console.log("VirtualMachinesTable componentDidUpdate..."); 
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

    //melo by odfiltrovat a zobrazit jen jeden radek:
    getParrent=(filteredDeploymentParentId:any)=> {
        const { toolbox } = this.props;
        const { widget } = this.props;
        //console.log("GetParrent for:"+filteredDeploymentParentId);
        //const params = {deploymentId: filteredId };
        //this.fetchGridData(params);
        toolbox.getContext().setValue('filteredDeploymentParentId', filteredDeploymentParentId);
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
    renderHtmlParrentButton=(item:any)=> {
        //tlacitko se bude zobrazovat pouze pokud je v labelech "csys-obj-parent"
        
        let parrentId = this.isItForParrentButton(item);
        

        if (parrentId!=0) {

            return (<Button
                icon="wizard"
                content="Get parrent"
                basic
                labelPosition="left"
                title="Get parrent"
                        onClick={(event: Event) => {
                            event.stopPropagation();
                            this.getParrent(parrentId);
                 } } />)
        }
        else {
            return (<Button
                icon="wizard"
                content="No parrent"
                basic
                labelPosition="left"
                title="No parrent"
                        onClick={(event: Event) => {
                            event.stopPropagation();
                            this.getParrent(item.id);
                 }}/>)
        }

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
    getDOs= (item:any) => {
        let returnValue = "init";
        try {
            if (this.state.detailedData!=null && this.state.detailedData.length>0) {
                
                let _index = -1;//this.state.detailedData.indexOf(item.id);

                for (let index = 0; index < this.state.detailedData.length; index++) {
                    const element = this.state.detailedData[index];
                    if (element.deployment_id==item.id) {
                        _index=index;
                         break;
                    }

                }

                if (_index!=-1) {
                    try {
                        returnValue=JSON.stringify(this.state.detailedData[_index]["parameters"]["inputs"]);
                    } catch (error) {
                        console.log(error);
    
                        try {
                            returnValue=JSON.stringify(this.state.detailedData[_index]["parameters"]["inputs"]["location"]);
                        } catch (error) {
                            console.log(error);
                        }
                        returnValue="err";
    
                    } 
                }

            }  
            
        } catch (error) {
            console.log(error);
        }
        return returnValue;
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

            //TODO trapna podminka, abych zbytecne nevolal, ale volani je asi tak dost?
            // if (detailedData.indexOf(_item.id != -1)) {
            //     console.log("loadDetailedData:zbytecne volani");
            //     return;
            // }
            const _dataFromExternalSource = await toolbox.getWidgetBackend().doGet('get_vm_detailsData', { params });

            //zajisteni unikatnosti: deployment_id
            //TODO 8. element v poli???
            // if (detailedData.length==0) {
            //     detailedData.push(_dataFromExternalSource[0]);
            // }

            detailedData.indexOf(_dataFromExternalSource[0].deployment_id) === -1 ? detailedData.push(_dataFromExternalSource[0]) : console.log("This item already exists");

            this.setState({detailedData});

        } catch (error) {
            console.log(error);
        }

    };
    render() {
        /* eslint-disable no-console, no-process-exit */
        const { data, toolbox, widget } = this.props;
        const { DataTable } = Stage.Basic;
        const manager = toolbox.getManager();
        const tenantName = manager.getSelectedTenant();

        return (
            <div>

                <DataTable
                    className="agentsTable table-scroll"
                    fetchData={this.fetchGridData}
                    
                    sortColumn={widget.configuration.sortColumn}
                    sortAscending={widget.configuration.sortAscending}
                    deploymentId
                    searchable
                >

                    <DataTable.Column label="Id" name="id"/>
                    <DataTable.Column label="Name" name="labels"/>
                    <DataTable.Column label="OS" name="os" />
                    <DataTable.Column label="IP" name="ip" />
                    <DataTable.Column label="CPUs" name="cpus" />
                    <DataTable.Column label="RAM" name="ram" />
                    <DataTable.Column label="Azure size" name="azure_size" />
                    <DataTable.Column label="Azure location" name="azure_location" />
                    <DataTable.Column label="Environment" name="environment" />
                    <DataTable.Column label="Parent deployment" name="parent_deployment" />
                    <DataTable.Column label="" name="" />
                    <DataTable.Column label="Actions" name="actions" name="class" />

                    {_.map(data.items, item => (                   
                            <DataTable.RowExpandable key={item.id}>
                            <DataTable.Row 
                                key={`${item.id}_main`}
                                id={`${item.id}_main`}>

                                <DataTable.Data>{item.id}</DataTable.Data>
                                <DataTable.Data>{item.display_name}</DataTable.Data>

                                <DataTable.Data>{ this.getDOs(item)}</DataTable.Data>
                                <DataTable.Data>{item.ip}</DataTable.Data>
                                <DataTable.Data>{item.cpus}</DataTable.Data>
                                <DataTable.Data>{item.ram}</DataTable.Data>
                                <DataTable.Data>{item.azure_size}</DataTable.Data>
                                <DataTable.Data>{item.azure_location}</DataTable.Data>

                                <DataTable.Data>{item.environment}</DataTable.Data>
                                <DataTable.Data>{this.renderHtmlParrentButton(item)}</DataTable.Data>
                                <DataTable.Data><Button icon="add" content={'Show details'} onClick={() => this.onRowClick(item)} /></DataTable.Data>
                                <DataTable.Data>

                                    <DeploymentActionButtons
                                        buttonTitle='Actions'
                                        deploymentId={item.id}
                                        fetchedDeploymentState={this.getDataForDeploymentId(item)}
                                        toolbox={toolbox}
                                        redirectToParentPageAfterDelete={!widget.configuration.preventRedirectToParentPageAfterDelete}
                                    />

                                </DataTable.Data>

                            </DataTable.Row>

                            <DataTable.Row
                                key={`${item.id}_ext`}
                                style={{ display: 'none' }}
                                id={`${item.id}_ext`}>
                                    <DataTable.Data colSpan={11}>
                                        <div className='virtualMachineMainLayout'>
                                            <div style={{width:"50%"}}><DataDisksTableVM widget={widget} data={data} toolbox={toolbox} ></DataDisksTableVM></div>
                                            <div style={{width:"50%"}}><RequestsTableVM widget={widget} data={data} toolbox={toolbox} ></RequestsTableVM></div>
                                        </div>
                                    </DataTable.Data>
                                    <DataTable.Data>{JSON.stringify(item)}</DataTable.Data>
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
