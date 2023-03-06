// @ts-nocheck File not migrated fully to TS
import PropTypes, { bool } from 'prop-types';
import type { Tests } from './types';
import { Button } from 'semantic-ui-react';
import { identity } from 'lodash';
import { castArray } from 'lodash';
import DeploymentActionButtons from './deploymentActionButtons/src/DeploymentActionButtons';
import { dataSortingKeys } from '../../tokens/src/TokensTable.consts';

interface RequestsTableVMProps {
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
export default class RequestsTableVM extends React.Component<RequestsTableVMProps> {

    static initialState = {
        requestsData:{},
    };

    constructor(props: RequestsTableVMProps) {
        super(props);
        this.state = this.initialState;
    }

    componentDidMount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().on('vm:selectVM', this.loadRequestData, this);
    }

    loadRequestData = async (_item:any) =>{
        console.log(_item);
        //alert("Loading data disk data");
        const { toolbox } = this.props;
        const manager = toolbox.getManager();
        const tenantName=manager.getSelectedTenant();
        
        let params = {};
        params.tenant = tenantName;
        //console.log("params:");
        //console.log(params);

        const _dataFromExternalSource = await toolbox.getWidgetBackend().doGet('get_vm_requestsData', { params }); //nactu data,

        const requestsData =  _dataFromExternalSource;
        console.log(requestsData);

        this.setState({requestsData}); //tady je pole hodnot ve value
        return requestsData;
    }

    render() {
        /* eslint-disable no-console, no-process-exit */
        const { data, toolbox, widget } = this.props;
        const { DataTable } = Stage.Basic;

        //console.log(data);

        if (this.state==null) {
            return (
                <div>
                    <div >nic k zobrazeni</div>
                </div>
            );
        }

        if (this.state.requestsData==null) {
            return (
                <div>
                    <div >nic k zobrazeni</div>
                </div>
            );
        }

        return (
            <div>
                <div >Request data: {JSON.stringify(this.state.requestsData)}</div>
            </div>
        );
    }
}



RequestsTableVM.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    data: PropTypes.array
};
