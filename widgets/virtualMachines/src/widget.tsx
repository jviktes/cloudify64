// @ts-nocheck File not migrated fully to TS
//  fetchUrl: '[manager]/eventsVik[params]',
/* eslint-disable no-console, no-process-exit */
import { result } from 'lodash';
import VirtualMachineMainLayout from './VirtualMachineMainLayout';

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

    //inicializace widgetu - nacteni VM:
    fetchData(widget, toolbox,params) {
        console.log("fetchData");

        const manager = toolbox.getManager();
        const tenantName=manager.getSelectedTenant();
        
        params.tenant = tenantName;
        console.log("params:");
        console.log(params);
        let _results = toolbox.getWidgetBackend().doGet('get_vm_deployments', { params });
        return _results;
    },

    fetchParams: function(widget, toolbox) {
        //console.log("widget fetchParams...");
        let _filteredDeploymentParentId= toolbox.getContext().getValue('filteredDeploymentParentId');
        return {filteredDeploymentParentId:_filteredDeploymentParentId};
    },

    render(widget, data, error, toolbox) {
        const formattedData = {
            items: data
        };
        //console.log(formattedData);
        return <VirtualMachineMainLayout widget={widget} data={formattedData} toolbox={toolbox} />;
    }
});

