// @ts-nocheck File not migrated fully to TS
import PropTypes, { bool } from 'prop-types';
import type { Tests } from './types';
import { Button } from 'semantic-ui-react';
import { identity } from 'lodash';
import { castArray } from 'lodash';
import DeploymentActionButtons from '../src/deploymentActionButtons/src/DeploymentActionButtons';
import { dataSortingKeys } from '../../tokens/src/TokensTable.consts';

import VirtualMachinesTable from './VirtualMachinesTable';


interface VirtualMachineMainLayoutProps {
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
export default class VirtualMachineMainLayout extends React.Component<VirtualMachineMainLayoutProps> {
    // static propTypes: any;

    constructor(props: VirtualMachineMainLayoutProps) {
        super(props);
    }

    render() {
        /* eslint-disable no-console, no-process-exit */
        const { data, toolbox, widget } = this.props;
        //const { DataTable } = Stage.Basic;
        const manager = toolbox.getManager();
        const tenantName = manager.getSelectedTenant();

        //console.log(data);

        return (
            <div>
                <div>
                    <div style={{outerWidth:"100%"}}><VirtualMachinesTable widget={widget} data={data} toolbox={toolbox} /></div>
                </div>
            </div>
        );
    }
}



VirtualMachineMainLayout.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    data: PropTypes.array
};
