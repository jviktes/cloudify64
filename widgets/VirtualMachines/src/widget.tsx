// @ts-nocheck File not migrated fully to TS
//  fetchUrl: '[manager]/eventsVik[params]',
/* eslint-disable no-console, no-process-exit */
import { result } from 'lodash';
import VirtualMachinesTable from './VirtualMachinesTable';

Stage.defineWidget({
    id: 'virtual-machines',
    name: 'Virtual machines',
    description: 'Virtual machines management',
    initialWidth: 32,
    initialHeight: 32,
    color: 'orange',
    isReact: true,
    hasReadme: true,
    hasStyle:true,
    categories: [Stage.GenericConfig.CATEGORY.OTHERS],
    permission: Stage.GenericConfig.CUSTOM_WIDGET_PERMISSIONS.CUSTOM_ALL,
    // initialConfiguration: [
    //     Stage.GenericConfig.SORT_COLUMN_CONFIG('testDatum'),
    //     Stage.GenericConfig.SORT_ASCENDING_CONFIG(false),
    // ],
    fetchData(widget, toolbox,params) {
        const manager = toolbox.getManager();
        const tenantName=manager.getSelectedTenant();
        params.tenant = tenantName;
        return toolbox.getWidgetBackend().doGet('get_vm_deployments', { params });
    },

    render(widget, data, error, toolbox) {
        const formattedData = {
            items: data
        };
        console.log(formattedData);
        return <VirtualMachinesTable widget={widget} data={formattedData} toolbox={toolbox} />;
    }
});
