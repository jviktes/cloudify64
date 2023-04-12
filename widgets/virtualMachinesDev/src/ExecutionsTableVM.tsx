//// @ts-nocheck File not migrated fully to TS
import PropTypes, { bool } from 'prop-types';
import type { Tests } from './types';
import { Button, Icon, Item } from 'semantic-ui-react';
import { identity } from 'lodash';
import { castArray } from 'lodash';
import DeploymentActionButtons from './deploymentActionButtons/src/DeploymentActionButtons';
import { dataSortingKeys } from '../../tokens/src/TokensTable.consts';
import { ExecutionStatus } from '../../../app/components/shared';

interface ExecutionsTableVMProps {
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
export default class ExecutionsTableVM extends React.Component<ExecutionsTableVMProps> {

    constructor(props: ExecutionsTableVMProps) {
        super(props);
    }

    render() {
        /* eslint-disable no-console, no-process-exit */
        const {data } = this.props;
        const { DataTable } = Stage.Basic;

        return (
            <div>
                <div><span style={{fontWeight:"bold"}}>Executions</span></div>
                <DataTable>

                    <DataTable.Column label="Status" name="status_display"/>
                    <DataTable.Column label="Workflow" name="workflow_id" />
                    <DataTable.Column label="Created" name="created_at" />
                    <DataTable.Column label="Creator" name="created_by" />
                    <DataTable.Column label="Deployment ID" name="deployment_id"/>

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

ExecutionsTableVM.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    data: PropTypes.array
};
