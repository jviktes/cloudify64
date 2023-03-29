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
    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(30),
    ],
    //inicializace widgetu - nacteni VM:
    fetchData(widget, toolbox,params) {
        //console.log("fetchData");

        const manager = toolbox.getManager();
        const tenantName=manager.getSelectedTenant();
        
        params.tenant = tenantName;
        //console.log("params:");
        //console.log(params);
        let _results = toolbox.getWidgetBackend().doGet('get_vm_deployments', { params });
        //toolbox.getEventBus().trigger('deployments:regularRefresh');
        return _results;
    },

    fetchParams: function(widget, toolbox) {
        //console.log("widget fetchParams...");
        let _filteredDeploymentParentId= toolbox.getContext().getValue('filteredDeploymentParentId');
        //console.log(_filteredDeploymentParentId);
        return {filteredDeploymentParentId:_filteredDeploymentParentId};
    },

    render(widget, data, error, toolbox) {
        const formattedData = {
            items: data
        };
        //console.log(formattedData);
        return <div style={{outerWidth:"100%"}}><VirtualMachinesTable widget={widget} data={formattedData} toolbox={toolbox} /></div>;
    }
});

