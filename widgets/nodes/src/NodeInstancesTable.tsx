// @ts-nocheck File not migrated fully to TS

import InstanceModal from './NodeInstanceModal';
import NodeInstancePropType from './props/NodeInstancePropType';

const EMPTY_NODE_INSTANCE_OBJ = { id: '', relationships: [], runtime_properties: {} };

export default class NodeInstancesTable extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            showModal: false,
            instance: EMPTY_NODE_INSTANCE_OBJ
        };
    }

    closeInstanceModal = () => {
        this.setState({
            showModal: false,
            instance: EMPTY_NODE_INSTANCE_OBJ
        });
        return true;
    };

    showInstanceModal(instance) {
        this.setState({
            showModal: true,
            instance
        });
    }

    selectNodeInstance(item) {
        const { toolbox } = this.props;
        const selectedNodeInstanceId = toolbox.getContext().getValue('nodeInstanceId');
        const clickedNodeInstanceId = item.id;
        toolbox
            .getContext()
            .setValue(
                'nodeInstanceId',
                clickedNodeInstanceId === selectedNodeInstanceId ? null : clickedNodeInstanceId
            );
    }

    render() {
        const { instance: selectedInstance, showModal } = this.state;
        const { instances, widget } = this.props;
        const NO_DATA_MESSAGE = 'There are no Node Instances of selected Node available.';
        const { CopyToClipboardButton, DataTable, Icon } = Stage.Basic;

        return (
            <div>
                <DataTable className="nodesInstancesTable" noDataMessage={NO_DATA_MESSAGE}>
                    <DataTable.Column label="Instance" name="id" width="40%" />
                    <DataTable.Column label="Status" name="state" width="30%" />
                    <DataTable.Column label="Details" name="details" width="30%" />

                    {instances.map(instance => {
                        return (
                            <DataTable.Row
                                key={instance.id}
                                selected={instance.isSelected}
                                onClick={() => this.selectNodeInstance(instance)}
                            >
                                <DataTable.Data>
                                    {instance.id}
                                    <CopyToClipboardButton text={instance.id} className="rightFloated" />
                                </DataTable.Data>
                                <DataTable.Data>{instance.state}</DataTable.Data>
                                <DataTable.Data className="center aligned rowActions">
                                    <Icon
                                        bordered
                                        link
                                        className="table"
                                        onClick={event => {
                                            event.stopPropagation();
                                            this.showInstanceModal(instance);
                                        }}
                                    />
                                </DataTable.Data>
                            </DataTable.Row>
                        );
                    })}
                </DataTable>

                <InstanceModal
                    open={showModal}
                    onClose={this.closeInstanceModal}
                    widget={widget}
                    instance={selectedInstance}
                />
            </div>
        );
    }
}

NodeInstancesTable.propTypes = {
    instances: PropTypes.arrayOf(NodeInstancePropType).isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired,
    widget: Stage.PropTypes.Widget.isRequired
};
