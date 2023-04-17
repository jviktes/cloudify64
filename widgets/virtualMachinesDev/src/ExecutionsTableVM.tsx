//// @ts-nocheck File not migrated fully to TS
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import { ExecutionStatus } from '../../../app/components/shared';

interface ExecutionsTableVMProps {
    data: {
        some(arg0: (item: any) => boolean): string | number | boolean | {} | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactNodeArray | React.ReactPortal | null | undefined;
        map(arg0: (item: any) => any): Iterable<unknown> | null | undefined;
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
export default class ExecutionsTableVM extends React.Component<ExecutionsTableVMProps> {

    static initialState = {
        executionRowVisibility:[],
        executionIdFilter:{},
    };
    constructor(props: ExecutionsTableVMProps) {
        super(props);
        this.state = ExecutionsTableVM.initialState;
    }

     onItemChange = (e: any, _value: any) => {
        console.log("onItemChange DataDisk:");
        console.log("DataDisk e.target:" + e);
        this.setState({executionIdFilter:_value});
    };

    // prepareDataToShow= (items:any)=> {
    //     if (this.state.executionIdFilter!=null) {
    //         return items.some(item => item.deployment_id == this.state.executionIdFilter);
    //     }
    //     else {
    //         return items;
    //     }    
    // }

    render() {
        /* eslint-disable no-console, no-process-exit */
        const {data } = this.props;
        const { DataTable } = Stage.Basic;


        // const uniques = [...new Set(data.map(item => item.deployment_id))];
        // const UniqueDeploymentidOptions = [];

        // uniques.forEach(element => {
        //     UniqueDeploymentidOptions.push({text: element, name: element, value: element});
        // });

        // let dataToShow = this.prepareDataToShow(data);

        return (
            <div>
                <div><span style={{fontWeight:"bold"}}>Executions</span></div>

                {/* <Form.Dropdown
                                name="disk_type"
                                selection
                                options={UniqueDeploymentidOptions}
                                value={UniqueDeploymentidOptions[0].value}
                                onChange={(e, { value }) => this.onItemChange(e.target, value)} /> */}

                <DataTable>

                    <DataTable.Column label="Status" name="status_display"/>
                    <DataTable.Column label="Workflow" name="workflow_id" />
                    <DataTable.Column label="Created" name="created_at" />
                    <DataTable.Column label="Creator" name="created_by" />
                    <DataTable.Column label="Deployment ID" name="deployment_id">
                        

                    </DataTable.Column>

                    {_.map(data, item => (      
                                      
                            <DataTable.Row>
                                <DataTable.Data>{<ExecutionStatus execution={item}/>}</DataTable.Data>
                                <DataTable.Data>{item?.workflow_id}</DataTable.Data>
                                <DataTable.Data>{item?.created_at}</DataTable.Data>
                                <DataTable.Data>{item?.created_by}</DataTable.Data>
                                <DataTable.Data>{item?.deployment_id}</DataTable.Data>
                            </DataTable.Row>
                    ))}

                </DataTable>

            </div>
        );
    }
}

// ExecutionsTableVM.propTypes = {
//     // eslint-disable-next-line react/forbid-prop-types
//     data: PropTypes.array
// };
