/**
 * Created by kinneretzin on 07/09/2016.
 */


addPlugin({
    id: "cpuUtilizationUser",
    name: "CPU Utilization - User",
    description: 'blah blah blah',
    initialWidth: 8,
    initialHeight: 4,
    color : "purple",
    render: function(widget,data,error,context,pluginUtils) {

        if (!widget.plugin.template) {
            return 'graph: missing template';
        }

        return pluginUtils.buildFromTemplate(widget.plugin.template);
    }
});