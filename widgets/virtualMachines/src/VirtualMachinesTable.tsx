// @ts-nocheck File not migrated fully to TS
import PropTypes, { bool } from 'prop-types';
import type { Tests } from './types';
import { Button } from 'semantic-ui-react';
import { identity } from 'lodash';
import { castArray } from 'lodash';
import DeploymentActionButtons from '../src/deploymentActionButtons/src/DeploymentActionButtons';
import { dataSortingKeys } from '../../tokens/src/TokensTable.consts';

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

    constructor(props: VirtualMachinesDataProps) {
        super(props);
    }



    fetchGridData = fetchParams => {
        //console.log("fetchGridData:"+JSON.stringify(fetchParams)); 
        //fetchGridData:{"gridParams":{"_search":"x","currentPage":1,"pageSize":0,"sortColumn":"","sortAscending":true}}
        const { toolbox } = this.props;
        return toolbox.refresh(fetchParams);
    };

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
        const { toolbox } = this.props;
        toolbox.getEventBus().trigger('vm:selectVM',_item);
        //toolbox.getEventBus().trigger('blueprint:setDeploymentIputs', 'impacted_region', JSON.stringify(selectedRegions)); 
    }

    render() {
        /* eslint-disable no-console, no-process-exit */
        const { data, toolbox, widget } = this.props;
        const { DataTable } = Stage.Basic;
        const manager = toolbox.getManager();
        const tenantName = manager.getSelectedTenant();

        console.log(data);

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
                    <DataTable.Column label="Actions" name="actions" name="class" width="10%" />

                    {_.map(data.items, item => (                   
                            <DataTable.Row
                                key={`${item.id}_main`}
                                id={`${item.id}_main`}
                                onClick={() => this.onRowClick(item)}
                            >

                                <DataTable.Data>{item.id}</DataTable.Data>
                                <DataTable.Data>{item.name}</DataTable.Data>
                                <DataTable.Data>{item.os}</DataTable.Data>
                                <DataTable.Data>{item.ip}</DataTable.Data>
                                <DataTable.Data>{item.cpus}</DataTable.Data>
                                <DataTable.Data>{item.ram}</DataTable.Data>
                                <DataTable.Data>{item.azure_size}</DataTable.Data>
                                <DataTable.Data>{item.azure_location}</DataTable.Data>
                                <DataTable.Data>{item.environment}</DataTable.Data>
                                <DataTable.Data>{item.parent_deployment}</DataTable.Data>

                                <DataTable.Data>

                                    <DeploymentActionButtons
                                        deploymentId={item.id}
                                        fetchedDeploymentState={this.getDataForDeploymentId(item)}
                                        toolbox={toolbox}
                                        redirectToParentPageAfterDelete={!widget.configuration.preventRedirectToParentPageAfterDelete}
                                    />

                                </DataTable.Data>

                                {/* <DataTable.Data style={{ width: '10%' }}>{item.csys-obj-type}</DataTable.Data> */}
                                {/* {this.renderHtmlParrentButton(item)} */}
                            </DataTable.Row>
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
