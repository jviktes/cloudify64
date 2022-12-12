// @ts-nocheck File not migrated fully to TS
//  fetchUrl: '[manager]/eventsVik[params]',
/* eslint-disable no-console, no-process-exit */
import { result } from 'lodash';
import TestsTable from './TestsTable';

Stage.defineWidget({
    id: 'act-log-reader',
    name: 'Automated Configuration Tests (ACT)',
    description: 'Automated Configuration Tests (ACT)',
    initialWidth: 12,
    initialHeight: 32,
    color: 'orange',
    isReact: true,
    hasReadme: true,
    hasStyle:true,
    categories: [Stage.GenericConfig.CATEGORY.OTHERS],
    permission: Stage.GenericConfig.CUSTOM_WIDGET_PERMISSIONS.CUSTOM_ALL,
    initialConfiguration: [
        Stage.GenericConfig.SORT_COLUMN_CONFIG('testDatum'),
        Stage.GenericConfig.SORT_ASCENDING_CONFIG(false),
    ],
    fetchData(widget, toolbox,params) {
        const manager = toolbox.getManager();
        const tenantName=manager.getSelectedTenant();
        params.tenant = tenantName;
        return toolbox.getWidgetBackend().doGet('filesAPI', { params });
    },

    render(widget, data, error, toolbox) {
        const formattedData = {
            items: data
        };
        return <TestsTable widget={widget} data={formattedData} toolbox={toolbox} />;
    }
});
