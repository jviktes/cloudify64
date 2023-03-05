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
    // static propTypes: any;

    constructor(props: RequestsTableVMProps) {
        super(props);
    }

    componentDidMount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().on('vm:selectVM', this.loadRequestData, this);
    }

    loadRequestData() {
        alert("Loading request data");
    }

    fetchGridData = fetchParams => {
        //console.log("fetchGridData:"+JSON.stringify(fetchParams)); 
        //fetchGridData:{"gridParams":{"_search":"x","currentPage":1,"pageSize":0,"sortColumn":"","sortAscending":true}}
        const { toolbox } = this.props;
        return toolbox.refresh(fetchParams);
    };


    render() {
        /* eslint-disable no-console, no-process-exit */
        const { data, toolbox, widget } = this.props;
        console.log(data);

        return (
            <div>
                <div>List of requests:</div>
            </div>
        );
    }
}



RequestsTableVM.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    data: PropTypes.array
};
