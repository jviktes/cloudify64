// @ts-nocheck File not migrated fully to TS
import PropTypes from 'prop-types';
import type { TestResult } from './types';
import TestResultsPropType from './props/TestResultsPropType';

interface TestResultProps {
    data: {
        items: PropTypes.array;
    };
    widget: Stage.Types.Widget;
    toolbox: Stage.Types.Toolbox;
}
// eslint-disable-next-line react/prefer-stateless-function
export default class TestDetails extends React.Component<TestResultProps> {
    // static propTypes: any;

    constructor(props: TestResultProps) {
        super(props);
        this.keyCount = 0;
        this.getKey = this.getKey.bind(this);
    }

    // react key generator:
    getKey() {
        this.keyCount += 1;
        return this.keyCount;
    }

    // eslint-disable-next-line class-methods-use-this
    renderTestResult(itemData) {
        if (itemData.result && itemData.result.toLowerCase().indexOf('passed') !== -1) {
            return <span style={{ color: 'green' }}>{itemData.result}</span>;
        }
        if (itemData.result && itemData.result.toLowerCase().indexOf('failed') !== -1) {
            return <span style={{ color: 'red' }}>{itemData.result}</span>;
        }
        return itemData.result;
    }

    // eslint-disable-next-line class-methods-use-this
    renderActualValues(itemData) {
        // replacing \\n --> <br>
        const content = itemData?.actual_value?.replace(/\\n/g, '<br>');
        return <div dangerouslySetInnerHTML={{ __html: content }} />;
    }

    render() {
        const { data, toolbox, widget } = this.props;
        /* eslint-disable no-console, no-process-exit */
        const { DataTable } = Stage.Basic;
        return (
            <div>
                <DataTable className="agentsTable table-scroll-details">
                    <DataTable.Column label="Code" />
                    <DataTable.Column label="Name" />
                    <DataTable.Column label="Class" />
                    <DataTable.Column label="Result" />
                    <DataTable.Column label="Description" />
                    <DataTable.Column label="Actual value" />
                    <DataTable.Column label="Expected value" />

                    {_.map(data, item => (
                        <DataTable.Row key={this.getKey()}>
                            <DataTable.Data>{item.code}</DataTable.Data>
                            <DataTable.Data>{item.name}</DataTable.Data>
                            <DataTable.Data>{item.class}</DataTable.Data>
                            <DataTable.Data>{this.renderTestResult(item)}</DataTable.Data>
                            <DataTable.Data>{item.description}</DataTable.Data>
                            <DataTable.Data>{this.renderActualValues(item)}</DataTable.Data>
                            <DataTable.Data>{item.expected_value}</DataTable.Data>
                        </DataTable.Row>
                    ))}
                </DataTable>
            </div>
        );
    }
}

TestDetails.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    data: PropTypes.array
};
