// @ts-nocheck File not migrated fully to TS
import PropTypes, { bool } from 'prop-types';
import type { Tests } from './types';
import { Button } from 'semantic-ui-react';
import { identity } from 'lodash';
import { castArray } from 'lodash';
import DeploymentActionButtons from './deploymentActionButtons/src/DeploymentActionButtons';
import { dataSortingKeys } from '../../tokens/src/TokensTable.consts';

interface DataDisksTableVMProps {
    data: {
        items: PropTypes.array;
        total: number;
        nodeId: string;
        nodeInstanceId: string;
    };
    widget: Stage.Types.Widget;
    toolbox: Stage.Types.Toolbox;
    //dataDisk:any;
}

// eslint-disable-next-line react/prefer-stateless-function
export default class DataDisksTableVM extends React.Component<DataDisksTableVMProps> {
    // static propTypes: any;



    static initialState = {
        //gsnData:{result: PropTypes.arrayOf(GSNBusinessServiceProps)},
        dataDisk:{},
    };

    constructor(props: DataDisksTableVMProps) {
        super(props);
        this.state = this.initialState;
    }

    componentDidMount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().on('vm:selectVM', this.loadDataDiskData, this);
    }

     loadDataDiskData = async (_item:any) =>{
        console.log(_item);
        //alert("Loading data disk data");
        const { toolbox } = this.props;
        const manager = toolbox.getManager();
        const tenantName=manager.getSelectedTenant();
        
        let params = {};
        params.tenant = tenantName;
        //console.log("params:");
        //console.log(params);

        const _dataFromExternalSource = await toolbox.getWidgetBackend().doGet('get_vm_dataDiskData', { params }); //nactu data,

        const dataDisk =  _dataFromExternalSource;
        console.log(dataDisk);

        this.setState({dataDisk}); //tady je pole hodnot ve value
        return dataDisk;

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

        if (this.state.dataDisk==null) {
            return (
                <div>
                    <div >nic k zobrazeni</div>
                </div>
            );
        }

        return (
            <div>
                <div >Data disks: {JSON.stringify(this.state.dataDisk)}</div>
            </div>
        );
    }
}

DataDisksTableVM.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    data: PropTypes.array
};
