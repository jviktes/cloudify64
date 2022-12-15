// @ts-nocheck File not migrated fully to TS
import PropTypes from 'prop-types';
import type { Tests } from './types';
import TestsPropType from './props/TestsPropType';
import { Button } from 'semantic-ui-react';
import { identity } from 'lodash';
//import TestDetails from './TestDetails';

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
        console.log("fetchGridData:"+JSON.stringify(fetchParams)); 
        //fetchGridData:{"gridParams":{"_search":"x","currentPage":1,"pageSize":0,"sortColumn":"","sortAscending":true}}
        const { toolbox } = this.props;
        // fetchParams._search="pokus";
        // fetchParams.pageSize =20;
        // fetchParams.ii = "pica";
        // console.log("fetchGridData changed:"+JSON.stringify(fetchParams)); 
        return toolbox.refresh(fetchParams);
    };
    // fetchParams=(widget, toolbox)=> {
    //     console.log("VirtualMachinesTable fetchParams...");
    //     let deploymentId = "777";
    //     return {deployment_id: deploymentId};
    // };

    //melo by odfiltrovat a zobrazit jen jeden radek:
    getParrent=(filteredDeploymentParentId:any)=> {
        const { toolbox } = this.props;
        const { widget } = this.props;
        console.log("GetParrent for:"+filteredDeploymentParentId);
        //const params = {deploymentId: filteredId };
        //this.fetchGridData(params);
        toolbox.getContext().setValue('filteredDeploymentParentId', filteredDeploymentParentId);
    }

    render() {
        /* eslint-disable no-console, no-process-exit */
        const { data, toolbox, widget } = this.props;
        const { DataTable } = Stage.Basic;
        const manager = toolbox.getManager();
        const tenantName = manager.getSelectedTenant();

        //console.log(data);

        return (
            <div>
                <span>Current tenant: {tenantName}</span>
                <span>Version widget:{widget.definition.version}</span>
                <DataTable
                    className="agentsTable table-scroll"
                    fetchData={this.fetchGridData}
                    sortColumn={widget.configuration.sortColumn}
                    sortAscending={widget.configuration.sortAscending}
                    deploymentId
                    searchable
                >

                    <DataTable.Column label="Id" name="id" width="10%" />
                    <DataTable.Column label="Labels" name="labels" width="25%" />
                    <DataTable.Column label="Blueprint name" name="blueprint_id" name="class" width="10%" />
                    {/* <DataTable.Column label="Type" name="type" width="25%" /> */}
                    
                    <DataTable.Column label="Actions" name="actions" name="class" width="10%" />
                    {_.map(data.items, item => (                   
                            <DataTable.Row
                                key={`${item.id}_main`}
                                id={`${item.id}_main`}
                            >
                                <DataTable.Data style={{ width: '10%' }}>{item.id}</DataTable.Data>
                                <DataTable.Data style={{ width: '25%' }}>{JSON.stringify(item.labels)}</DataTable.Data>
                                <DataTable.Data style={{ width: '10%' }}>{item.blueprint_id}</DataTable.Data>
                                {/* <DataTable.Data style={{ width: '10%' }}>{item.csys-obj-type}</DataTable.Data> */}
                                <DataTable.Data style={{ width: '10%' }}>

                                    <Button
                                        icon="wizard"
                                        content="Get parrent"
                                        basic
                                        labelPosition="left"
                                        title="Get parrent"
                                                onClick={(event: Event) => {
                                                    event.stopPropagation();
                                                    this.getParrent(item.id);
                                         } } />

                                </DataTable.Data>
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
