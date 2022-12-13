// @ts-nocheck File not migrated fully to TS
import PropTypes from 'prop-types';
import type { Tests } from './types';
import TestsPropType from './props/TestsPropType';
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
        const { toolbox } = this.props;
        return toolbox.refresh(fetchParams);
    };

    refreshData() {
        const { toolbox } = this.props;
        toolbox.refresh();
    }

    render() {
        /* eslint-disable no-console, no-process-exit */
        const { data, toolbox, widget } = this.props;
        const { DataTable } = Stage.Basic;
        const manager = toolbox.getManager();
        const tenantName = manager.getSelectedTenant();

        // console.log(data);

        return (
            <div>
                <span>Current tenant: {tenantName}</span>
                <DataTable
                    className="agentsTable table-scroll"
                    fetchData={this.fetchGridData}
                    sortColumn={widget.configuration.sortColumn}
                    sortAscending={widget.configuration.sortAscending}
                    searchable
                >
                    <DataTable.Column label="Test date" name="testDatum" width="10%" />
                    <DataTable.Column label="Virtual machine" name="virtualMachine" width="25%" />
                    <DataTable.Column label="Test class" name="class" width="10%" />
                    <DataTable.Column label="Result" name="result" width="10%" />
                    <DataTable.Column label="Passed" name="passed" width="5%" />
                    <DataTable.Column label="Failed" name="failed" width="5%" />
                    <DataTable.Column label="File name" name="fileName" width="35%" />
                    {_.map(data.items, item => (                   
                            <DataTable.Row
                                key={`${item.id}_main`}
                                id={`${item.id}_main`}
                            >
                                <DataTable.Data style={{ width: '10%' }}>{item.testDatum}</DataTable.Data>
                                <DataTable.Data style={{ width: '25%' }}>{item.virtualMachine}</DataTable.Data>
                                <DataTable.Data style={{ width: '10%' }}>{item.class}</DataTable.Data>
                                <DataTable.Data style={{ width: '10%' }}>
                                    {item.testResultSummary}
                                </DataTable.Data>
                                <DataTable.Data style={{ width: '5%' }}>
                                    <span style={{ color: 'green' }}>{item.passedTestsCount}</span>
                                </DataTable.Data>
                                <DataTable.Data style={{ width: '5%' }}>
                                    <span style={{ color: 'red' }}>{item.failedTestsCount}</span>
                                </DataTable.Data>
                                <DataTable.Data style={{ width: '35%' }}>{item.fileName}</DataTable.Data>
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
