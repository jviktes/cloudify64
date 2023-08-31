//// @ts-nocheck File not migrated fully to TS
/* eslint-disable no-console, no-process-exit */
import VirtualMachinesTable from './VirtualMachinesTable';


Stage.defineWidget({
    // id: 'virtual-machines',
    // name: 'Virtual machines',
    id: 'virtual-machines-dev',
    name: 'Virtual machines development',
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
        Stage.GenericConfig.PAGE_SIZE_CONFIG(10),
        
        {
            id: 'supportEmail',
            name: 'Support email',
            default: "support@greycorbel.com",
            type: Stage.Basic.GenericField.STRING_TYPE
        },
        {
            id: 'unistallWorkflowIgnoreFailure',
            name: 'Uninstall workflow - ignore failure',
            default: true,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        },
        {
            id: 'serviceAccountPrefix',
            name: 'serviceAccountPrefix',
            default: "a1e_",
            type: Stage.Basic.GenericField.STRING_TYPE
        },
        //this version works only if current widget is remove and place again...:
        // {
        //     id: 'version',
        //     name: 'version',
        //     default: "1.43",
        //     type: Stage.Basic.GenericField.STRING_TYPE, 
        //     hidden:true
        // }
    ],
   
    //inicializace widgetu - nacteni VM:
    fetchData(_widget, toolbox,params) {
        //console.log("fetchData");
        const manager = toolbox.getManager();
        const tenantName=manager.getSelectedTenant();
        params.tenant = tenantName;
        let _results = toolbox.getWidgetBackend().doGet('get_vm_deployments', { params });
        return _results;
    },

    fetchParams: function(_widget, toolbox) {
        //console.log("widget fetchParams...");
        let _filteredDeploymentParentId= toolbox.getContext().getValue('filteredDeploymentParentId');
        //console.log(_filteredDeploymentParentId);
        return {filteredDeploymentParentId:_filteredDeploymentParentId};
    },
    
    render(widget, data, _error, toolbox) {
        const { Loading } = Stage.Basic;
        if (_.isEmpty(data)) {
            return <Loading />;
        }
        const formattedData = {
            items: data.items,
            total: _.get(data, 'metadata.pagination.total', 0),
        };
        //console.log(formattedData);
        return <div style={{outerWidth:"100%"}}><VirtualMachinesTable widget={widget} data={formattedData} toolbox={toolbox} /></div>;
    }
});

