// @ts-nocheck File not migrated fully to TS
import PropTypes from 'prop-types';
import type { Tests } from './types';
import TestsPropType from './props/TestsPropType';
import TestDetails from './TestDetails';

interface TestDataProps {
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
export default class TestsTable extends React.Component<TestDataProps> {
    // static propTypes: any;

    constructor(props: TestDataProps) {
        super(props);
    }

    // eslint-disable-next-line class-methods-use-this
    onRowClick(_item) {
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

    /// render icon:
    // eslint-disable-next-line class-methods-use-this, react/sort-comp
    renderTestResultSummary(itemData) {
        if (itemData.testResultSummary && itemData.testResultSummary.toLowerCase().indexOf('succeeded') !== -1) {
            return <i aria-hidden="true" className="green checkmark icon" />;
        }
        if (itemData.testResultSummary && itemData.testResultSummary.toLowerCase().indexOf('failed') !== -1) {
            return <i aria-hidden="true" className="red remove icon" />;
        }
        return '';
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
                        <DataTable.RowExpandable key={item.id}>
                            <DataTable.Row
                                key={`${item.id}_main`}
                                onClick={() => this.onRowClick(item)}
                                id={`${item.id}_main`}
                            >
                                <DataTable.Data style={{ width: '10%' }}>{item.testDatum}</DataTable.Data>
                                <DataTable.Data style={{ width: '25%' }}>{item.virtualMachine}</DataTable.Data>
                                <DataTable.Data style={{ width: '10%' }}>{item.class}</DataTable.Data>
                                <DataTable.Data style={{ width: '10%' }}>
                                    {this.renderTestResultSummary(item)}
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

                            <DataTable.Row
                                onClick={() => this.onRowClick(item)}
                                key={`${item.id}_ext`}
                                style={{ display: 'none' }}
                                id={`${item.id}_ext`}
                            >
                                <DataTable.Data colSpan={7} style={{ marginLeft: 50 }}>
                                    <TestDetails widget={widget} data={item.testResultArray} toolbox={toolbox} />
                                </DataTable.Data>
                            </DataTable.Row>
                        </DataTable.RowExpandable>
                    ))}
                </DataTable>
            </div>
        );
    }
}

TestsTable.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    data: PropTypes.array
};
