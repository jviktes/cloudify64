/* eslint-disable no-console, no-process-exit */
// @ts-nocheck File not migrated fully to TS
module.exports = async function(r) {

r.register('get_vm_deployments', 'GET', (req, res, next, helper) => {
    const _ = require('lodash');
    console.log('get_vm_deployments...');
    const { headers } = req;
    const commonManagerRequestOptions = {
        headers: {
            tenant: headers.tenant,
            cookie: headers.cookie
        }
    };
    // parsing parametres:
    const params = { ...req.query };
    console.log(params);
    let _searchParam = params._search;
    let _filteredDeploymentParentId = params.filteredDeploymentParentId;

    let rawData = [];
    
    if (_filteredDeploymentParentId!=undefined  || _filteredDeploymentParentId!=null ) 
    {
        console.log("rawData search:");
        _searchParam = _filteredDeploymentParentId;
    }

    //https://cloudify-uat.dhl.com/console/sp/searches/deployments?_sort=-created_at&_size=50&
    //_include=id,display_name,site_name,blueprint_id,latest_execution_status,deployment_status,environment_type,latest_execution_total_operations,latest_execution_finished_operations,sub_services_count,sub_services_status,sub_environments_count,sub_environments_status

    //filter pro pouze VM:
    let filterRules = [{"key":"blueprint_id","values":["Single-VM"],"operator":"contains","type":"attribute"}];
    //filterRules = []; //zobrazi vsechny deploymenty...
    return helper.Manager.doPost('/searches/deployments', {
        params: {
            _include: 'id,display_name,workflows,labels,site_name,blueprint_id,latest_execution_status,deployment_status,environment_type,latest_execution_total_operations,latest_execution_finished_operations,sub_services_count,sub_services_status,sub_environments_count,sub_environments_status',
            _search:_searchParam
        },
        body: { filter_rules: filterRules },
        ...commonManagerRequestOptions
    })
        .then(data => {
            rawData = data.items;

            // rawData = [
            //     {
            //         "id": "xa124ls401047",
            //         "workflows": [
            //             {
            //                 "name": "install",
            //                 "plugin": "default_workflows",
            //                 "operation": "cloudify.plugins.workflows.install",
            //                 "parameters": {
            //                     "type_names": {
            //                         "default": [],
            //                         "type": "list",
            //                         "item_type": "node_type"
            //                     },
            //                     "node_ids": {
            //                         "default": [],
            //                         "type": "list",
            //                         "item_type": "node_id"
            //                     },
            //                     "node_instance_ids": {
            //                         "default": [],
            //                         "type": "list",
            //                         "item_type": "node_instance"
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": {
            //                     "node_instances_active": [
            //                         "none",
            //                         "partial"
            //                     ]
            //                 }
            //             },
            //             {
            //                 "name": "check_status",
            //                 "plugin": "default_workflows",
            //                 "operation": "cloudify.plugins.workflows.check_status",
            //                 "parameters": {
            //                     "run_by_dependency_order": {
            //                         "default": false
            //                     },
            //                     "type_names": {
            //                         "default": [],
            //                         "type": "list",
            //                         "item_type": "node_type"
            //                     },
            //                     "node_ids": {
            //                         "default": [],
            //                         "type": "list",
            //                         "item_type": "node_id"
            //                     },
            //                     "node_instance_ids": {
            //                         "default": [],
            //                         "type": "list",
            //                         "item_type": "node_instance"
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": {
            //                     "node_instances_active": [
            //                         "all",
            //                         "partial"
            //                     ]
            //                 }
            //             },
            //             {
            //                 "name": "check_drift",
            //                 "plugin": "default_workflows",
            //                 "operation": "cloudify.plugins.workflows.check_drift",
            //                 "parameters": {
            //                     "run_by_dependency_order": {
            //                         "default": false
            //                     },
            //                     "type_names": {
            //                         "default": [],
            //                         "type": "list",
            //                         "item_type": "node_type"
            //                     },
            //                     "node_ids": {
            //                         "default": [],
            //                         "type": "list",
            //                         "item_type": "node_id"
            //                     },
            //                     "node_instance_ids": {
            //                         "default": [],
            //                         "type": "list",
            //                         "item_type": "node_instance"
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": {
            //                     "node_instances_active": [
            //                         "all",
            //                         "partial"
            //                     ]
            //                 }
            //             },
            //             {
            //                 "name": "uninstall",
            //                 "plugin": "default_workflows",
            //                 "operation": "cloudify.plugins.workflows.uninstall",
            //                 "parameters": {
            //                     "ignore_failure": {
            //                         "default": false,
            //                         "type": "boolean"
            //                     },
            //                     "type_names": {
            //                         "default": [],
            //                         "type": "list",
            //                         "item_type": "node_type"
            //                     },
            //                     "node_ids": {
            //                         "default": [],
            //                         "type": "list",
            //                         "item_type": "node_id"
            //                     },
            //                     "node_instance_ids": {
            //                         "default": [],
            //                         "type": "list",
            //                         "item_type": "node_instance"
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": {
            //                     "node_instances_active": [
            //                         "all",
            //                         "partial"
            //                     ]
            //                 }
            //             },
            //             {
            //                 "name": "reinstall",
            //                 "plugin": "default_workflows",
            //                 "operation": "cloudify.plugins.workflows.reinstall",
            //                 "parameters": {
            //                     "ignore_failure": {
            //                         "default": false,
            //                         "type": "boolean"
            //                     },
            //                     "type_names": {
            //                         "default": [],
            //                         "type": "list",
            //                         "item_type": "node_type"
            //                     },
            //                     "node_ids": {
            //                         "default": [],
            //                         "type": "list",
            //                         "item_type": "node_id"
            //                     },
            //                     "node_instance_ids": {
            //                         "default": [],
            //                         "type": "list",
            //                         "item_type": "node_instance"
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": {
            //                     "node_instances_active": [
            //                         "all",
            //                         "partial"
            //                     ]
            //                 }
            //             },
            //             {
            //                 "name": "start",
            //                 "plugin": "default_workflows",
            //                 "operation": "cloudify.plugins.workflows.start",
            //                 "parameters": {
            //                     "operation_parms": {
            //                         "default": {}
            //                     },
            //                     "run_by_dependency_order": {
            //                         "default": true
            //                     },
            //                     "type_names": {
            //                         "default": [],
            //                         "type": "list",
            //                         "item_type": "node_type"
            //                     },
            //                     "node_ids": {
            //                         "default": [],
            //                         "type": "list",
            //                         "item_type": "node_id"
            //                     },
            //                     "node_instance_ids": {
            //                         "default": [],
            //                         "type": "list",
            //                         "item_type": "node_instance"
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": {
            //                     "node_instances_active": [
            //                         "none",
            //                         "partial"
            //                     ]
            //                 }
            //             },
            //             {
            //                 "name": "stop",
            //                 "plugin": "default_workflows",
            //                 "operation": "cloudify.plugins.workflows.stop",
            //                 "parameters": {
            //                     "operation_parms": {
            //                         "default": {}
            //                     },
            //                     "run_by_dependency_order": {
            //                         "default": true
            //                     },
            //                     "type_names": {
            //                         "default": [],
            //                         "type": "list",
            //                         "item_type": "node_type"
            //                     },
            //                     "node_ids": {
            //                         "default": [],
            //                         "type": "list",
            //                         "item_type": "node_id"
            //                     },
            //                     "node_instance_ids": {
            //                         "default": [],
            //                         "type": "list",
            //                         "item_type": "node_instance"
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": {
            //                     "node_instances_active": [
            //                         "all",
            //                         "partial"
            //                     ]
            //                 }
            //             },
            //             {
            //                 "name": "restart",
            //                 "plugin": "default_workflows",
            //                 "operation": "cloudify.plugins.workflows.restart",
            //                 "parameters": {
            //                     "stop_parms": {
            //                         "default": {}
            //                     },
            //                     "start_parms": {
            //                         "default": {}
            //                     },
            //                     "run_by_dependency_order": {
            //                         "default": true
            //                     },
            //                     "type_names": {
            //                         "default": [],
            //                         "type": "list",
            //                         "item_type": "node_type"
            //                     },
            //                     "node_ids": {
            //                         "default": [],
            //                         "type": "list",
            //                         "item_type": "node_id"
            //                     },
            //                     "node_instance_ids": {
            //                         "default": [],
            //                         "type": "list",
            //                         "item_type": "node_instance"
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": {
            //                     "node_instances_active": [
            //                         "all",
            //                         "partial"
            //                     ]
            //                 }
            //             },
            //             {
            //                 "name": "execute_operation",
            //                 "plugin": "default_workflows",
            //                 "operation": "cloudify.plugins.workflows.execute_operation",
            //                 "parameters": {
            //                     "operation": {},
            //                     "operation_kwargs": {
            //                         "default": {}
            //                     },
            //                     "allow_kwargs_override": {
            //                         "default": null
            //                     },
            //                     "run_by_dependency_order": {
            //                         "default": false
            //                     },
            //                     "type_names": {
            //                         "default": [],
            //                         "type": "list",
            //                         "item_type": "node_type"
            //                     },
            //                     "node_ids": {
            //                         "default": [],
            //                         "type": "list",
            //                         "item_type": "node_id"
            //                     },
            //                     "node_instance_ids": {
            //                         "default": [],
            //                         "type": "list",
            //                         "item_type": "node_instance"
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": null
            //             },
            //             {
            //                 "name": "heal",
            //                 "plugin": "default_workflows",
            //                 "operation": "cloudify.plugins.workflows.auto_heal_reinstall_node_subgraph",
            //                 "parameters": {
            //                     "node_instance_id": {
            //                         "required": false,
            //                         "description": "Which node instance has failed",
            //                         "type": "node_instance"
            //                     },
            //                     "diagnose_value": {
            //                         "default": "Not provided",
            //                         "description": "Diagnosed reason of failure"
            //                     },
            //                     "ignore_failure": {
            //                         "default": true,
            //                         "type": "boolean"
            //                     },
            //                     "check_status": {
            //                         "default": true,
            //                         "description": "Run check_status on the target node instances before attempting the heal. Only instances that fail the check (and the instances contained in them) will be healed, and instances that pass the check will be skipped.\n",
            //                         "type": "boolean"
            //                     },
            //                     "allow_reinstall": {
            //                         "default": true,
            //                         "description": "If any instances throw an error in the heal operation, or if they don't declare the heal operation at all, they will be reinstalled. If this is set to false, the reinstallation is disallowed, and an error will be thrown instead.\n",
            //                         "type": "boolean"
            //                     },
            //                     "force_reinstall": {
            //                         "default": false,
            //                         "description": "Do not attempt to run the heal operation even for nodes that do declare it. Instead, reinstall the target instances.\n",
            //                         "type": "boolean"
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": {
            //                     "node_instances_active": [
            //                         "all",
            //                         "partial"
            //                     ]
            //                 }
            //             },
            //             {
            //                 "name": "scale",
            //                 "plugin": "default_workflows",
            //                 "operation": "cloudify.plugins.workflows.scale_entity",
            //                 "parameters": {
            //                     "scalable_entity_name": {
            //                         "description": "Which node/group to scale. Note that the parameter specified should denote the node/group name and NOT the node/group instance id.\n"
            //                     },
            //                     "delta": {
            //                         "default": 1,
            //                         "description": "How many node/group instances should be added/removed. A positive number denotes increase of instances. A negative number denotes decrease of instances.\n",
            //                         "type": "integer"
            //                     },
            //                     "scale_compute": {
            //                         "default": false,
            //                         "description": "If a node name is passed as the `scalable_entity_name` parameter and that node is contained (transitively) within a compute node and this property is 'true', operate on the compute node instead of the specified node.\n"
            //                     },
            //                     "include_instances": {
            //                         "default": null,
            //                         "description": "A node instance ID or list of node instance IDs to prioritise for scaling down. If a larger amount of included instances are provided than the delta then one of the included instances will be scaled down while the others will be ignored. If a smaller amount of included instances are provided than the delta then the remaining instances will be selected arbitrarily. This is only valid for scaling down and cannot be used with scale_compute set to true.\n"
            //                     },
            //                     "exclude_instances": {
            //                         "default": null,
            //                         "description": "A node instance ID or list of node instance IDs which must not be removed when scaling down. If the amount of excluded instances plus the absolute delta is equal to or greater than the total amount of instances then the scaling operation will fail and no nodes will be scaled down. This is only valid for scaling down and cannot be used with scale_compute set to true.\n"
            //                     },
            //                     "ignore_failure": {
            //                         "default": false,
            //                         "type": "boolean"
            //                     },
            //                     "rollback_if_failed": {
            //                         "default": true,
            //                         "description": "If this is False then no rollback will be triggered when an error occurs during the workflow, otherwise the rollback will be triggered.\n"
            //                     },
            //                     "abort_started": {
            //                         "default": false,
            //                         "description": "Remove any started deployment modifications created prior to the scaling workflow.\n",
            //                         "type": "boolean"
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": {
            //                     "node_instances_active": [
            //                         "all",
            //                         "partial"
            //                     ]
            //                 }
            //             },
            //             {
            //                 "name": "install_new_agents",
            //                 "plugin": "default_workflows",
            //                 "operation": "cloudify.plugins.workflows.install_new_agents",
            //                 "parameters": {
            //                     "install_agent_timeout": {
            //                         "default": 300
            //                     },
            //                     "node_ids": {
            //                         "default": [],
            //                         "type": "list",
            //                         "item_type": "node_id"
            //                     },
            //                     "node_instance_ids": {
            //                         "default": [],
            //                         "type": "list",
            //                         "item_type": "node_instance"
            //                     },
            //                     "install_methods": {
            //                         "default": null
            //                     },
            //                     "validate": {
            //                         "default": true,
            //                         "type": "boolean"
            //                     },
            //                     "install": {
            //                         "default": true,
            //                         "type": "boolean"
            //                     },
            //                     "install_script": {
            //                         "default": ""
            //                     },
            //                     "manager_ip": {
            //                         "default": "",
            //                         "description": "The private ip of the new manager"
            //                     },
            //                     "manager_certificate": {
            //                         "default": "",
            //                         "description": "The cloudify_internal_ca_cert.pem of the new manager"
            //                     },
            //                     "stop_old_agent": {
            //                         "default": false,
            //                         "description": "Stop the old agent after the new agent is installed",
            //                         "type": "boolean"
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": {
            //                     "node_instances_active": [
            //                         "all",
            //                         "partial"
            //                     ],
            //                     "node_types_required": [
            //                         "cloudify.nodes.Compute"
            //                     ]
            //                 }
            //             },
            //             {
            //                 "name": "validate_agents",
            //                 "plugin": "default_workflows",
            //                 "operation": "cloudify.plugins.workflows.validate_agents",
            //                 "parameters": {
            //                     "node_ids": {
            //                         "default": [],
            //                         "type": "list",
            //                         "item_type": "node_id"
            //                     },
            //                     "node_instance_ids": {
            //                         "default": [],
            //                         "type": "list",
            //                         "item_type": "node_instance"
            //                     },
            //                     "install_methods": {
            //                         "default": null
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": {
            //                     "node_instances_active": [
            //                         "all",
            //                         "partial"
            //                     ],
            //                     "node_types_required": [
            //                         "cloudify.nodes.Compute"
            //                     ]
            //                 }
            //             },
            //             {
            //                 "name": "rollback",
            //                 "plugin": "default_workflows",
            //                 "operation": "cloudify.plugins.workflows.rollback",
            //                 "parameters": {
            //                     "type_names": {
            //                         "default": [],
            //                         "description": "A list of type names. The operation will be executed only on node instances which are of these types or of types which (recursively) derive from them. An empty list means no filtering will take place and all type names are valid.\n",
            //                         "type": "list",
            //                         "item_type": "node_type"
            //                     },
            //                     "node_ids": {
            //                         "default": [],
            //                         "description": "A list of node ids. The operation will be executed only on node instances which are instances of these nodes. An empty list means no filtering will take place and all nodes are valid.\n",
            //                         "type": "list",
            //                         "item_type": "node_id"
            //                     },
            //                     "node_instance_ids": {
            //                         "default": [],
            //                         "description": "A list of node instance ids. The operation will be executed only on the node instances specified. An empty list means no filtering will take place and all node instances are valid.\n",
            //                         "type": "list",
            //                         "item_type": "node_instance"
            //                     },
            //                     "full_rollback": {
            //                         "default": false,
            //                         "description": "Whether rollback to resolved state or full uninstall.\n",
            //                         "type": "boolean"
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": {
            //                     "node_instances_active": [
            //                         "all",
            //                         "partial"
            //                     ]
            //                 }
            //             },
            //             {
            //                 "name": "pull",
            //                 "plugin": "default_workflows",
            //                 "operation": "cloudify.plugins.workflows.pull",
            //                 "parameters": {
            //                     "operation_parms": {
            //                         "default": {}
            //                     },
            //                     "run_by_dependency_order": {
            //                         "default": true
            //                     },
            //                     "type_names": {
            //                         "default": [],
            //                         "type": "list",
            //                         "item_type": "node_type"
            //                     },
            //                     "node_ids": {
            //                         "default": [],
            //                         "type": "list",
            //                         "item_type": "node_id"
            //                     },
            //                     "node_instance_ids": {
            //                         "default": [],
            //                         "type": "list",
            //                         "item_type": "node_instance"
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": {
            //                     "node_instances_active": [
            //                         "all",
            //                         "partial"
            //                     ]
            //                 }
            //             },
            //             {
            //                 "name": "refresh_terraform_resources",
            //                 "plugin": "tf",
            //                 "operation": "cloudify_tf.workflows.refresh_resources",
            //                 "parameters": {
            //                     "node_instance_ids": {
            //                         "default": [],
            //                         "description": "List of node instance ID's to refresh for.\n",
            //                         "type": "list"
            //                     },
            //                     "node_ids": {
            //                         "default": [],
            //                         "description": "List of node templates to refresh for.\n",
            //                         "type": "list"
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": null
            //             },
            //             {
            //                 "name": "terraform_plan",
            //                 "plugin": "tf",
            //                 "operation": "cloudify_tf.workflows.terraform_plan",
            //                 "parameters": {
            //                     "node_instance_ids": {
            //                         "default": [],
            //                         "description": "List of node instance ID's to refresh for.\n",
            //                         "type": "list"
            //                     },
            //                     "node_ids": {
            //                         "default": [],
            //                         "description": "List of node templates to refresh for.\n",
            //                         "type": "list"
            //                     },
            //                     "source": {
            //                         "default": ""
            //                     },
            //                     "source_path": {
            //                         "default": "",
            //                         "type": "string"
            //                     },
            //                     "variables": {
            //                         "default": {},
            //                         "type": "dict"
            //                     },
            //                     "environment_variables": {
            //                         "default": {},
            //                         "type": "dict"
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": null
            //             },
            //             {
            //                 "name": "reload_terraform_template",
            //                 "plugin": "tf",
            //                 "operation": "cloudify_tf.workflows.reload_resources",
            //                 "parameters": {
            //                     "node_instance_ids": {
            //                         "default": [],
            //                         "description": "List of node instance ID's to refresh for.\n",
            //                         "type": "list"
            //                     },
            //                     "node_ids": {
            //                         "default": [],
            //                         "description": "List of node templates to refresh for.\n",
            //                         "type": "list"
            //                     },
            //                     "source": {
            //                         "default": ""
            //                     },
            //                     "source_path": {
            //                         "default": "",
            //                         "type": "string"
            //                     },
            //                     "variables": {
            //                         "default": {},
            //                         "type": "dict"
            //                     },
            //                     "environment_variables": {
            //                         "default": {},
            //                         "type": "dict"
            //                     },
            //                     "destroy_previous": {
            //                         "default": false,
            //                         "type": "boolean"
            //                     },
            //                     "force": {
            //                         "default": false,
            //                         "description": "Force apply without matching previous plan.",
            //                         "type": "boolean"
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": null
            //             },
            //             {
            //                 "name": "update_terraform_binary",
            //                 "plugin": "tf",
            //                 "operation": "cloudify_tf.workflows.update_terraform_binary",
            //                 "parameters": {
            //                     "node_instance_ids": {
            //                         "default": [],
            //                         "description": "List of node instance ID's to refresh for.\n",
            //                         "type": "list"
            //                     },
            //                     "node_ids": {
            //                         "default": [],
            //                         "description": "List of node templates to refresh for.\n",
            //                         "type": "list"
            //                     },
            //                     "installation_source": {
            //                         "description": "The URL to downlowd the new binary from.",
            //                         "type": "string"
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": null
            //             },
            //             {
            //                 "name": "import_terraform_resource",
            //                 "plugin": "tf",
            //                 "operation": "cloudify_tf.workflows.import_resource",
            //                 "parameters": {
            //                     "node_instance_ids": {
            //                         "default": [],
            //                         "description": "List of node instance ID's to refresh for.\n",
            //                         "type": "list"
            //                     },
            //                     "node_ids": {
            //                         "default": [],
            //                         "description": "List of node templates to refresh for.\n",
            //                         "type": "list"
            //                     },
            //                     "source": {
            //                         "default": ""
            //                     },
            //                     "source_path": {
            //                         "default": "",
            //                         "type": "string"
            //                     },
            //                     "variables": {
            //                         "default": {},
            //                         "type": "dict"
            //                     },
            //                     "environment_variables": {
            //                         "default": {},
            //                         "type": "dict"
            //                     },
            //                     "resource_address": {
            //                         "description": "the address to import the resource to inside terraform module.\n",
            //                         "type": "string"
            //                     },
            //                     "resource_id": {
            //                         "description": "resource-specific ID to identify that resource being imported.\n",
            //                         "type": "string"
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": null
            //             },
            //             {
            //                 "name": "run_infracost",
            //                 "plugin": "tf",
            //                 "operation": "cloudify_tf.workflows.run_infracost",
            //                 "parameters": {
            //                     "node_instance_ids": {
            //                         "default": [],
            //                         "description": "List of node instance ID's to refresh for.\n",
            //                         "type": "list"
            //                     },
            //                     "node_ids": {
            //                         "default": [],
            //                         "description": "List of node templates to refresh for.\n",
            //                         "type": "list"
            //                     },
            //                     "source": {
            //                         "default": ""
            //                     },
            //                     "source_path": {
            //                         "default": "",
            //                         "type": "string"
            //                     },
            //                     "variables": {
            //                         "default": {},
            //                         "type": "dict"
            //                     },
            //                     "environment_variables": {
            //                         "default": {},
            //                         "type": "dict"
            //                     },
            //                     "infracost_config": {
            //                         "default": {
            //                             "installation_source": "https://github.com/infracost/infracost/releases/download/v0.10.8/infracost-linux-amd64.tar.gz",
            //                             "api_key": "",
            //                             "enable": false
            //                         },
            //                         "description": "infracost specific config, the value here could be one of these choices:\n  - `{}`: it will take the values from runtime-properties/properties\n  - default_value: it will check the changes against the runtime-properties/properties\n    if it has override values it will take them\n  Note about enable property it is not considered here as it is enabled by default\n",
            //                         "type": "cloudify.types.terraform.infracost"
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": null
            //             },
            //             {
            //                 "name": "reload_ansible_playbook",
            //                 "plugin": "ansible",
            //                 "operation": "cloudify_ansible.workflows.reload_playbook",
            //                 "parameters": {
            //                     "ansible_external_venv": {
            //                         "default": "",
            //                         "description": "Ansible python venv with previously installed ansible and extra packages\n",
            //                         "type": "string"
            //                     },
            //                     "ansible_playbook_executable_path": {
            //                         "default": "",
            //                         "description": "A full path to your ansible_playbook executable if user don't want to use the included version of executable in the plugin\n",
            //                         "type": "string"
            //                     },
            //                     "extra_packages": {
            //                         "default": [],
            //                         "description": "List of python packages to install on controller virtual env before running the playbook. If the manager has no internet connection this feature cannot be used.\n",
            //                         "type": "list"
            //                     },
            //                     "galaxy_collections": {
            //                         "default": [],
            //                         "description": "List of Ansible galaxy collections to install on controller virtual env before running the playbook. If the manager has no internet connection this feature cannot be used.\n",
            //                         "type": "list"
            //                     },
            //                     "roles": {
            //                         "default": [],
            //                         "description": "List of roles to install on controller virtual env before running the playbook. If the manager has no internet connection this feature cannot be used.\n",
            //                         "type": "list"
            //                     },
            //                     "module_path": {
            //                         "default": "",
            //                         "description": "The location on the Cloudify Manager file system where Ansible modules are expected to be installed or will be installed. The default value is empty and if so, this will be created automatically during the environment setup. The cloudify-ansible-ctx module will be installed by default.\n",
            //                         "type": "string"
            //                     },
            //                     "playbook_source_path": {
            //                         "default": "",
            //                         "description": "A full path/URL that contain playbook specified in playbook_path or site_yaml_path.\n",
            //                         "type": "string"
            //                     },
            //                     "playbook_path": {
            //                         "default": "",
            //                         "description": "A path to your `site.yaml` or `main.yaml` in your Ansible Playbook relative to blueprint or playbook_source_path if playbook_source_path is URL to archive File relative inside the archive.\n",
            //                         "type": "string"
            //                     },
            //                     "site_yaml_path": {
            //                         "default": "",
            //                         "description": "DEPRECATED. A path to your `site.yaml` or `main.yaml` in your Ansible Playbook relative to blueprint or playbook_source_path if playbook_source_path is URL to archive File relative inside the archive.\n",
            //                         "type": "string"
            //                     },
            //                     "additional_playbook_files": {
            //                         "default": [],
            //                         "description": "A list of string paths blueprint resources that you would like to download to the playbook directory. If you use this variable, you must list all of the paths that you expect to download.\n",
            //                         "type": "list"
            //                     },
            //                     "sources": {
            //                         "default": "",
            //                         "description": "Your Inventory sources. Either YAML or a path to a file. If not provided the inventory will be take from the `sources` runtime property.\n",
            //                         "type": "string"
            //                     },
            //                     "run_data": {
            //                         "default": {},
            //                         "description": "Variable values.\n"
            //                     },
            //                     "sensitive_keys": {
            //                         "default": [
            //                             "ansible_password"
            //                         ],
            //                         "description": "keys that you want us to obscure",
            //                         "type": "list"
            //                     },
            //                     "options_config": {
            //                         "default": {},
            //                         "description": "Command-line options, such as `tags` or `skip_tags`.\n"
            //                     },
            //                     "ansible_env_vars": {
            //                         "default": {
            //                             "ANSIBLE_HOST_KEY_CHECKING": "False",
            //                             "ANSIBLE_INVALID_TASK_ATTRIBUTE_FAILED": "False",
            //                             "ANSIBLE_STDOUT_CALLBACK": "json"
            //                         },
            //                         "description": "A dictionary of environment variables to set.\n"
            //                     },
            //                     "debug_level": {
            //                         "default": 2,
            //                         "description": "Debug level\n",
            //                         "type": "integer"
            //                     },
            //                     "log_stdout": {
            //                         "default": true,
            //                         "description": "Whether to dump output to execution event log. Set to false to speed up long executions.",
            //                         "type": "boolean"
            //                     },
            //                     "additional_args": {
            //                         "default": "",
            //                         "description": "Additional args that you want to use, for example, '-c local'.\n",
            //                         "type": "string"
            //                     },
            //                     "start_at_task": {
            //                         "default": "",
            //                         "description": "Start the playbook at the task matching this name\n",
            //                         "type": "string"
            //                     },
            //                     "scp_extra_args": {
            //                         "default": "",
            //                         "description": "Specify extra arguments to pass to scp only (e.g. -l)\n",
            //                         "type": "string"
            //                     },
            //                     "sftp_extra_args": {
            //                         "default": "",
            //                         "description": "Specify extra arguments to pass to sftp only (e.g. -f, -l)\n",
            //                         "type": "string"
            //                     },
            //                     "ssh_common_args": {
            //                         "default": "",
            //                         "description": "Specify common arguments to pass to sftp/scp/ssh (e.g. ProxyCommand)\n",
            //                         "type": "string"
            //                     },
            //                     "ssh_extra_args": {
            //                         "default": "",
            //                         "description": "Specify extra arguments to pass to ssh only (e.g. -R)\n",
            //                         "type": "string"
            //                     },
            //                     "timeout": {
            //                         "default": "10",
            //                         "description": "Override the connection timeout in seconds (default=10)\n",
            //                         "type": "string"
            //                     },
            //                     "save_playbook": {
            //                         "default": false,
            //                         "description": "Save playbook after action\n",
            //                         "type": "boolean"
            //                     },
            //                     "remerge_sources": {
            //                         "default": false,
            //                         "description": "update sources on target node\n",
            //                         "type": "boolean"
            //                     },
            //                     "ansible_become": {
            //                         "default": false,
            //                         "description": "A boolean value, `true` or `false` whether to assume the user privileges.\n",
            //                         "type": "boolean"
            //                     },
            //                     "tags": {
            //                         "default": [],
            //                         "description": "A list of tags, in order of desired execution. If these tags are provided, they will be called, and auto_tags will be ignored.\n",
            //                         "type": "list"
            //                     },
            //                     "auto_tags": {
            //                         "default": false,
            //                         "description": "If set to \"true\", the plugin will read the playbook and generate a list of tags to execute. This requires that the playbook is written in such a way that the specified tags will produce the desired result. This value is ignored if tags are provided.\n",
            //                         "type": "boolean"
            //                     },
            //                     "number_of_attempts": {
            //                         "default": 3,
            //                         "description": "Total number of attempts to execute the playbook if exit code represents unreachable hosts\\failure.\n",
            //                         "type": "integer"
            //                     },
            //                     "store_facts": {
            //                         "default": true,
            //                         "description": "Store ansible facts under runtime properties.\n",
            //                         "type": "boolean"
            //                     },
            //                     "node_instance_ids": {
            //                         "default": [],
            //                         "description": "List of node instance ID's to reload for.\n",
            //                         "type": "list"
            //                     },
            //                     "node_ids": {
            //                         "default": [],
            //                         "description": "List of node templates to reload for.\n",
            //                         "type": "list"
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": null
            //             },
            //             {
            //                 "name": "update_playbook_venv",
            //                 "plugin": "ansible",
            //                 "operation": "cloudify_ansible.workflows.update_playbook_venv",
            //                 "parameters": {
            //                     "extra_packages": {
            //                         "default": [],
            //                         "description": "List of python packages to be installed in venv\n",
            //                         "type": "list"
            //                     },
            //                     "galaxy_collections": {
            //                         "default": [],
            //                         "description": "List of ansible galaxy collections to be installed\n",
            //                         "type": "list"
            //                     },
            //                     "roles": {
            //                         "default": [],
            //                         "description": "List of ansible roles to be installed\n",
            //                         "type": "list"
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": null
            //             },
            //             {
            //                 "name": "configuration_update",
            //                 "plugin": "configuration",
            //                 "operation": "cloudify_configuration.tasks.update",
            //                 "parameters": {
            //                     "params": {
            //                         "description": "json string"
            //                     },
            //                     "configuration_node_id": {
            //                         "default": "configuration_loader",
            //                         "type": "node_id"
            //                     },
            //                     "merge_dict": {
            //                         "default": false
            //                     },
            //                     "node_types_to_update": {
            //                         "default": [
            //                             "juniper_node_config",
            //                             "fortinet_vnf_type"
            //                         ]
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": false,
            //                 "availability_rules": {
            //                     "node_instances_active": [
            //                         "all"
            //                     ]
            //                 }
            //             },
            //             {
            //                 "name": "suspend",
            //                 "plugin": "suspend",
            //                 "operation": "cloudify_suspend.workflows.suspend",
            //                 "parameters": {},
            //                 "is_cascading": false,
            //                 "is_available": false,
            //                 "availability_rules": {
            //                     "node_instances_active": [
            //                         "all"
            //                     ]
            //                 }
            //             },
            //             {
            //                 "name": "resume",
            //                 "plugin": "suspend",
            //                 "operation": "cloudify_suspend.workflows.resume",
            //                 "parameters": {},
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": {
            //                     "node_instances_active": [
            //                         "all",
            //                         "partial"
            //                     ]
            //                 }
            //             },
            //             {
            //                 "name": "statistics",
            //                 "plugin": "suspend",
            //                 "operation": "cloudify_suspend.workflows.statistics",
            //                 "parameters": {},
            //                 "is_cascading": false,
            //                 "is_available": false,
            //                 "availability_rules": {
            //                     "node_instances_active": [
            //                         "all"
            //                     ]
            //                 }
            //             },
            //             {
            //                 "name": "backup",
            //                 "plugin": "suspend",
            //                 "operation": "cloudify_suspend.workflows.backup",
            //                 "parameters": {
            //                     "snapshot_name": {
            //                         "default": "",
            //                         "description": "Backup name/tag.\n"
            //                     },
            //                     "snapshot_incremental": {
            //                         "default": true,
            //                         "description": "Create incremental snapshots or full backup. By default created snapshots.\n"
            //                     },
            //                     "snapshot_type": {
            //                         "default": "irregular",
            //                         "description": "The backup type, like 'daily' or 'weekly'.\n"
            //                     },
            //                     "snapshot_rotation": {
            //                         "default": 1,
            //                         "description": "How many backups to keep around.\n"
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": {
            //                     "node_instances_active": [
            //                         "all",
            //                         "partial"
            //                     ]
            //                 }
            //             },
            //             {
            //                 "name": "restore",
            //                 "plugin": "suspend",
            //                 "operation": "cloudify_suspend.workflows.restore",
            //                 "parameters": {
            //                     "snapshot_name": {
            //                         "default": "",
            //                         "description": "Backup name/tag.\n"
            //                     },
            //                     "snapshot_incremental": {
            //                         "default": true,
            //                         "description": "Create incremental snapshots or full backup. By default created snapshots.\n"
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": {
            //                     "node_instances_active": [
            //                         "partial",
            //                         "none"
            //                     ]
            //                 }
            //             },
            //             {
            //                 "name": "remove_backup",
            //                 "plugin": "suspend",
            //                 "operation": "cloudify_suspend.workflows.remove_backup",
            //                 "parameters": {
            //                     "snapshot_name": {
            //                         "default": "",
            //                         "description": "Backup name/tag.\n"
            //                     },
            //                     "snapshot_incremental": {
            //                         "default": true,
            //                         "description": "Create incremental snapshots or full backup. By default created snapshots.\n"
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": null
            //             },
            //             {
            //                 "name": "scaleuplist",
            //                 "plugin": "scalelist",
            //                 "operation": "cloudify_scalelist.workflows.scaleuplist",
            //                 "parameters": {
            //                     "scalable_entity_properties": {
            //                         "default": {},
            //                         "description": "List properties for nodes\n"
            //                     },
            //                     "scale_compute": {
            //                         "default": false,
            //                         "description": "If a node name is passed as the `scalable_entity_properties` parameter and that node is contained (transitively) within a compute node and this property is 'true', operate on the compute node instead of the specified node.\n"
            //                     },
            //                     "ignore_failure": {
            //                         "default": false,
            //                         "type": "boolean"
            //                     },
            //                     "ignore_rollback_failure": {
            //                         "default": true,
            //                         "type": "boolean"
            //                     },
            //                     "scale_transaction_field": {
            //                         "default": "_transaction_id",
            //                         "description": "Place to save transaction id created in same transaction.\n",
            //                         "type": "string"
            //                     },
            //                     "scale_transaction_value": {
            //                         "default": "",
            //                         "description": "Optional, transaction value.\n",
            //                         "type": "string"
            //                     },
            //                     "node_sequence": {
            //                         "default": false,
            //                         "description": "Optional, sequence of nodes for run for override relationships.\n"
            //                     },
            //                     "rollback_on_failure": {
            //                         "default": true,
            //                         "description": "Optional, rollback the deployment modification on failure.\n",
            //                         "type": "boolean"
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": {
            //                     "node_instances_active": [
            //                         "all",
            //                         "partial"
            //                     ]
            //                 }
            //             },
            //             {
            //                 "name": "scaledownlist",
            //                 "plugin": "scalelist",
            //                 "operation": "cloudify_scalelist.workflows.scaledownlist",
            //                 "parameters": {
            //                     "scale_compute": {
            //                         "default": false,
            //                         "description": "If a node name is passed as the `scale_node_name` parameter and that node is contained (transitively) within a compute node and this property is 'true', operate on the compute node instead of the specified node.\n"
            //                     },
            //                     "ignore_failure": {
            //                         "default": false,
            //                         "type": "boolean"
            //                     },
            //                     "scale_transaction_field": {
            //                         "default": "_transaction_id",
            //                         "description": "Place to save transaction id created in same transaction. Optional, can be skiped if we need to remove instance without relation to initial transaction.\n",
            //                         "type": "string"
            //                     },
            //                     "scale_node_name": {
            //                         "default": "",
            //                         "description": "A list of node ids. The operation will be executed only on node instances which are instances of these nodes. An empty list means no filtering will take place and all nodes are valid (Default: \"\").\n",
            //                         "type": "string"
            //                     },
            //                     "scale_node_field": {
            //                         "default": "",
            //                         "description": "Node runtime properties field name for search value, supported search by ['a', 'b'] on {'a': {'b': 'c'}} return 'c'\n"
            //                     },
            //                     "scale_node_field_value": {
            //                         "default": "",
            //                         "description": "Node runtime properties field value for search. Can be provided as list of possible values.\n"
            //                     },
            //                     "force_db_cleanup": {
            //                         "default": false,
            //                         "description": "Run DB cleanup directly if instances can't be deleted in one transaction. **This flag will do nothing as of 1.11.0. Deprecated feature.**\n"
            //                     },
            //                     "all_results": {
            //                         "default": false,
            //                         "description": "Get all instances for filter. Required 4.3+ manager.\n"
            //                     },
            //                     "node_sequence": {
            //                         "default": false,
            //                         "description": "Optional, sequence of nodes for run for override relationships.\n"
            //                     },
            //                     "force_remove": {
            //                         "default": true,
            //                         "description": "Optional, force remove node instances set for scale down based on transaction field.\n",
            //                         "type": "boolean"
            //                     },
            //                     "rollback_on_failure": {
            //                         "default": true,
            //                         "description": "Optional, rollback the deployment modification on failure.\n",
            //                         "type": "boolean"
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": {
            //                     "node_instances_active": [
            //                         "all",
            //                         "partial"
            //                     ]
            //                 }
            //             },
            //             {
            //                 "name": "update_operation_filtered",
            //                 "plugin": "scalelist",
            //                 "operation": "cloudify_scalelist.workflows.execute_operation",
            //                 "parameters": {
            //                     "operation": {
            //                         "default": "cloudify.interfaces.lifecycle.update",
            //                         "description": "The name of the operation to execute (Default: cloudify.interfaces.lifecycle.update).\n",
            //                         "type": "string"
            //                     },
            //                     "operation_kwargs": {
            //                         "default": {},
            //                         "description": "A dictionary of keyword arguments that will be passed to the operation invocation (Default: {}).\n"
            //                     },
            //                     "allow_kwargs_override": {
            //                         "default": null,
            //                         "description": "A boolean describing whether overriding operations inputs defined in the blueprint by using inputs of the same name in the operation_kwargs parameter is allowed or not (Default: null [means that the default behavior, as defined by the workflows infrastructure, will be used]).\n"
            //                     },
            //                     "run_by_dependency_order": {
            //                         "default": false,
            //                         "description": "A boolean describing whether the operation should execute on the relevant nodes according to the order of their relationships dependencies or rather execute on all relevant nodes in parallel (Default: false).\n"
            //                     },
            //                     "type_names": {
            //                         "default": [],
            //                         "description": "A list of type names. The operation will be executed only on node instances which are of these types or of types which (recursively) derive from them. An empty list means no filtering will take place and all type names are valid (Default: []).\n"
            //                     },
            //                     "node_ids": {
            //                         "default": [],
            //                         "description": "A list of node ids. The operation will be executed only on node instances which are instances of these nodes. An empty list means no filtering will take place and all nodes are valid (Default: []).\n",
            //                         "type": "list",
            //                         "item_type": "node_id"
            //                     },
            //                     "node_instance_ids": {
            //                         "default": [],
            //                         "description": "A list of node instance ids. The operation will be executed only on the node instances specified. An empty list means no filtering will take place and all node instances are valid (Default: []).\n",
            //                         "type": "list",
            //                         "item_type": "node_instance"
            //                     },
            //                     "node_field": {
            //                         "default": "",
            //                         "description": "Node runtime properties field name for search value, supported search by ['a', 'b'] on {'a': {'b': 'c'}} return 'c'\n"
            //                     },
            //                     "node_field_value": {
            //                         "default": "",
            //                         "description": "Node runtime properties field value for search. Can be provided as list of possible values.\n"
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": {
            //                     "node_instances_active": [
            //                         "all",
            //                         "partial"
            //                     ]
            //                 }
            //             },
            //             {
            //                 "name": "hook_workflow_run_filtered",
            //                 "plugin": "cloudify_hooks_workflow",
            //                 "operation": "cloudify_hooks_workflow.tasks.run_workflow",
            //                 "parameters": {
            //                     "inputs": {
            //                         "default": {},
            //                         "description": "Inputs for hook, e.g: deployment_id, workflow_id. Automaticly passed from cloudify hooks: https://docs.cloudify.co/5.0.5/working_with/manager/actionable-events/\n"
            //                     },
            //                     "logger_file": {
            //                         "default": "",
            //                         "description": "duplicate logger output to separate file\n"
            //                     },
            //                     "client_config": {
            //                         "default": {},
            //                         "description": "custom credentials for manager, by default is not required for use\n"
            //                     },
            //                     "filter_by": {
            //                         "description": "key-value list, where:\n  path is path to field for validate,\n  values is list of possible values\nexample: - path: [\"workflow_id\"]\n  values: [\"install\"]\n- path: [\"deployment_capabilities\", \"autouninstall\", \"value\"]\n  values: [true, \"yes\"]\n"
            //                     },
            //                     "workflow_for_run": {
            //                         "default": "uninstall",
            //                         "description": "name workflow to run on deployment\n"
            //                     },
            //                     "workflow_params": {
            //                         "default": {},
            //                         "description": "additional workflow parameters\n"
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": null
            //             },
            //             {
            //                 "name": "hook_workflow_rest",
            //                 "plugin": "rest",
            //                 "operation": "cloudify_rest.tasks.execute_as_workflow",
            //                 "parameters": {
            //                     "inputs": {
            //                         "default": {},
            //                         "description": "Inputs for hook, e.g: deployment_id, workflow_id. Automaticly passed from cloudify hooks: https://docs.cloudify.co/5.0.5/working_with/manager/actionable-events/\n"
            //                     },
            //                     "logger_file": {
            //                         "default": "",
            //                         "description": "duplicate logger output to separate file\n"
            //                     },
            //                     "properties": {
            //                         "default": {},
            //                         "description": "connection properties(same as properties in `cloudify.rest.Requests`)\n"
            //                     },
            //                     "params": {
            //                         "default": {},
            //                         "description": "Template parameters. Default is empty dictionary. Merged with params from node properties and has 'ctx' key for current action context.\n"
            //                     },
            //                     "template_file": {
            //                         "default": "",
            //                         "description": "Absolute path to template file\n"
            //                     },
            //                     "save_path": {
            //                         "default": false,
            //                         "description": "Save result to runtime properties key. Default is directly save to runtime properties.\n"
            //                     },
            //                     "prerender": {
            //                         "default": false,
            //                         "description": "Prerender template before run calls jinja render=>yaml parse. Default is yaml parse=>jinja render.\n"
            //                     },
            //                     "remove_calls": {
            //                         "default": false,
            //                         "description": "Remove calls list from results. Default: save calls in runtime properties.\n"
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": null
            //             },
            //             {
            //                 "name": "hook_workflow_terminal",
            //                 "plugin": "terminal",
            //                 "operation": "cloudify_terminal.tasks.run_as_workflow",
            //                 "parameters": {
            //                     "inputs": {
            //                         "default": {},
            //                         "description": "Inputs for hook, e.g: deployment_id, workflow_id. Automaticly passed from cloudify hooks: https://docs.cloudify.co/5.0.5/working_with/manager/actionable-events/\n"
            //                     },
            //                     "logger_file": {
            //                         "default": "",
            //                         "description": "duplicate logger output to separate file\n"
            //                     },
            //                     "terminal_auth": {
            //                         "description": "terminal credentials, like example:\n  user: <user name>\n  password: <user password>\n  ip: <host name>\n",
            //                         "type": "cloudify.datatypes.terminal_auth"
            //                     },
            //                     "calls": {
            //                         "default": [],
            //                         "description": "List of calls to run\n"
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": null
            //             },
            //             {
            //                 "name": "alt_start",
            //                 "plugin": "lifecycle_operations",
            //                 "operation": "cloudify_rollback_workflow.workflows.start",
            //                 "parameters": {
            //                     "operation_parms": {
            //                         "default": {}
            //                     },
            //                     "run_by_dependency_order": {
            //                         "default": true
            //                     },
            //                     "type_names": {
            //                         "default": []
            //                     },
            //                     "node_ids": {
            //                         "default": [],
            //                         "type": "list",
            //                         "item_type": "node_id"
            //                     },
            //                     "node_instance_ids": {
            //                         "default": [],
            //                         "type": "list",
            //                         "item_type": "node_instance"
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": {
            //                     "node_instances_active": [
            //                         "all",
            //                         "partial"
            //                     ]
            //                 }
            //             },
            //             {
            //                 "name": "alt_stop",
            //                 "plugin": "lifecycle_operations",
            //                 "operation": "cloudify_rollback_workflow.workflows.stop",
            //                 "parameters": {
            //                     "operation_parms": {
            //                         "default": {}
            //                     },
            //                     "run_by_dependency_order": {
            //                         "default": true
            //                     },
            //                     "type_names": {
            //                         "default": []
            //                     },
            //                     "node_ids": {
            //                         "default": [],
            //                         "type": "list",
            //                         "item_type": "node_id"
            //                     },
            //                     "node_instance_ids": {
            //                         "default": [],
            //                         "type": "list",
            //                         "item_type": "node_instance"
            //                     },
            //                     "ignore_failure": {
            //                         "default": false
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": {
            //                     "node_instances_active": [
            //                         "all",
            //                         "partial"
            //                     ]
            //                 }
            //             },
            //             {
            //                 "name": "alt_precreate",
            //                 "plugin": "lifecycle_operations",
            //                 "operation": "cloudify_rollback_workflow.workflows.precreate",
            //                 "parameters": {
            //                     "operation_parms": {
            //                         "default": {}
            //                     },
            //                     "run_by_dependency_order": {
            //                         "default": true
            //                     },
            //                     "type_names": {
            //                         "default": []
            //                     },
            //                     "node_ids": {
            //                         "default": [],
            //                         "type": "list",
            //                         "item_type": "node_id"
            //                     },
            //                     "node_instance_ids": {
            //                         "default": [],
            //                         "type": "list",
            //                         "item_type": "node_instance"
            //                     },
            //                     "ignore_failure": {
            //                         "default": false
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": {
            //                     "node_instances_active": [
            //                         "partial",
            //                         "none"
            //                     ]
            //                 }
            //             },
            //             {
            //                 "name": "alt_create",
            //                 "plugin": "lifecycle_operations",
            //                 "operation": "cloudify_rollback_workflow.workflows.create",
            //                 "parameters": {
            //                     "operation_parms": {
            //                         "default": {}
            //                     },
            //                     "run_by_dependency_order": {
            //                         "default": true
            //                     },
            //                     "type_names": {
            //                         "default": []
            //                     },
            //                     "node_ids": {
            //                         "default": [],
            //                         "type": "list",
            //                         "item_type": "node_id"
            //                     },
            //                     "node_instance_ids": {
            //                         "default": [],
            //                         "type": "list",
            //                         "item_type": "node_instance"
            //                     },
            //                     "ignore_failure": {
            //                         "default": false
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": {
            //                     "node_instances_active": [
            //                         "partial",
            //                         "none"
            //                     ]
            //                 }
            //             },
            //             {
            //                 "name": "alt_configure",
            //                 "plugin": "lifecycle_operations",
            //                 "operation": "cloudify_rollback_workflow.workflows.configure",
            //                 "parameters": {
            //                     "operation_parms": {
            //                         "default": {}
            //                     },
            //                     "run_by_dependency_order": {
            //                         "default": true
            //                     },
            //                     "type_names": {
            //                         "default": []
            //                     },
            //                     "node_ids": {
            //                         "default": [],
            //                         "type": "list",
            //                         "item_type": "node_id"
            //                     },
            //                     "node_instance_ids": {
            //                         "default": [],
            //                         "type": "list",
            //                         "item_type": "node_instance"
            //                     },
            //                     "ignore_failure": {
            //                         "default": false
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": {
            //                     "node_instances_active": [
            //                         "partial",
            //                         "none"
            //                     ]
            //                 }
            //             },
            //             {
            //                 "name": "alt_poststart",
            //                 "plugin": "lifecycle_operations",
            //                 "operation": "cloudify_rollback_workflow.workflows.poststart",
            //                 "parameters": {
            //                     "operation_parms": {
            //                         "default": {}
            //                     },
            //                     "run_by_dependency_order": {
            //                         "default": true
            //                     },
            //                     "type_names": {
            //                         "default": []
            //                     },
            //                     "node_ids": {
            //                         "default": [],
            //                         "type": "list",
            //                         "item_type": "node_id"
            //                     },
            //                     "node_instance_ids": {
            //                         "default": [],
            //                         "type": "list",
            //                         "item_type": "node_instance"
            //                     },
            //                     "ignore_failure": {
            //                         "default": false
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": {
            //                     "node_instances_active": [
            //                         "all",
            //                         "partial"
            //                     ]
            //                 }
            //             },
            //             {
            //                 "name": "alt_prestop",
            //                 "plugin": "lifecycle_operations",
            //                 "operation": "cloudify_rollback_workflow.workflows.prestop",
            //                 "parameters": {
            //                     "operation_parms": {
            //                         "default": {}
            //                     },
            //                     "run_by_dependency_order": {
            //                         "default": true
            //                     },
            //                     "type_names": {
            //                         "default": []
            //                     },
            //                     "node_ids": {
            //                         "default": [],
            //                         "type": "list",
            //                         "item_type": "node_id"
            //                     },
            //                     "node_instance_ids": {
            //                         "default": [],
            //                         "type": "list",
            //                         "item_type": "node_instance"
            //                     },
            //                     "ignore_failure": {
            //                         "default": false
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": {
            //                     "node_instances_active": [
            //                         "all",
            //                         "partial"
            //                     ]
            //                 }
            //             },
            //             {
            //                 "name": "alt_delete",
            //                 "plugin": "lifecycle_operations",
            //                 "operation": "cloudify_rollback_workflow.workflows.delete",
            //                 "parameters": {
            //                     "operation_parms": {
            //                         "default": {}
            //                     },
            //                     "run_by_dependency_order": {
            //                         "default": true
            //                     },
            //                     "type_names": {
            //                         "default": []
            //                     },
            //                     "node_ids": {
            //                         "default": [],
            //                         "type": "list",
            //                         "item_type": "node_id"
            //                     },
            //                     "node_instance_ids": {
            //                         "default": [],
            //                         "type": "list",
            //                         "item_type": "node_instance"
            //                     },
            //                     "ignore_failure": {
            //                         "default": false
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": {
            //                     "node_instances_active": [
            //                         "all",
            //                         "partial"
            //                     ]
            //                 }
            //             },
            //             {
            //                 "name": "alt_postdelete",
            //                 "plugin": "lifecycle_operations",
            //                 "operation": "cloudify_rollback_workflow.workflows.postdelete",
            //                 "parameters": {
            //                     "operation_parms": {
            //                         "default": {}
            //                     },
            //                     "run_by_dependency_order": {
            //                         "default": true
            //                     },
            //                     "type_names": {
            //                         "default": []
            //                     },
            //                     "node_ids": {
            //                         "default": [],
            //                         "type": "list",
            //                         "item_type": "node_id"
            //                     },
            //                     "node_instance_ids": {
            //                         "default": [],
            //                         "type": "list",
            //                         "item_type": "node_instance"
            //                     },
            //                     "ignore_failure": {
            //                         "default": false
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": {
            //                     "node_instances_active": [
            //                         "all",
            //                         "partial"
            //                     ]
            //                 }
            //             },
            //             {
            //                 "name": "rollback_deprecated",
            //                 "plugin": "lifecycle_operations",
            //                 "operation": "cloudify_rollback_workflow.workflows.rollback",
            //                 "parameters": {
            //                     "type_names": {
            //                         "default": [],
            //                         "description": "A list of type names. The operation will be executed only on node instances which are of these types or of types which (recursively) derive from them. An empty list means no filtering will take place and all type names are valid.\n",
            //                         "type": "list",
            //                         "item_type": "node_type"
            //                     },
            //                     "node_ids": {
            //                         "default": [],
            //                         "description": "A list of node ids. The operation will be executed only on node instances which are instances of these nodes. An empty list means no filtering will take place and all nodes are valid.\n",
            //                         "type": "list",
            //                         "item_type": "node_id"
            //                     },
            //                     "node_instance_ids": {
            //                         "default": [],
            //                         "description": "A list of node instance ids. The operation will be executed only on the node instances specified. An empty list means no filtering will take place and all node instances are valid (Default: [ ]).\n",
            //                         "type": "list",
            //                         "item_type": "node_id"
            //                     },
            //                     "full_rollback": {
            //                         "default": false,
            //                         "description": "Whether rollback to resolved state or full uninstall.\n"
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": {
            //                     "node_instances_active": [
            //                         "all",
            //                         "partial"
            //                     ]
            //                 }
            //             },
            //             {
            //                 "name": "batch_deploy_and_install",
            //                 "plugin": "cloudify_custom_workflow",
            //                 "operation": "cloudify_custom_workflow.tasks.batch_deploy_and_install",
            //                 "parameters": {
            //                     "blueprint_id": {
            //                         "description": "The name of an already uploaded blueprint.",
            //                         "type": "blueprint_id"
            //                     },
            //                     "parent_deployments": {
            //                         "description": "A list of deployments, which will be parents to the new deployments. One new deployment will be create from blueprint_id per parent deployment that is provided.",
            //                         "type": "list",
            //                         "item_type": "deployment_id"
            //                     },
            //                     "group_id": {
            //                         "default": "",
            //                         "description": "The new group ID.",
            //                         "type": "string"
            //                     },
            //                     "new_deployment_ids": {
            //                         "default": [],
            //                         "description": "The new new_deployment_ids.",
            //                         "type": "list"
            //                     },
            //                     "inputs": {
            //                         "default": [],
            //                         "description": "An ordered list of inputs that will be provided per new deployment.",
            //                         "type": "list"
            //                     },
            //                     "add_parent_labels": {
            //                         "default": false,
            //                         "description": "Whether to automatically add parent csys-parent-id label.",
            //                         "type": "boolean"
            //                     },
            //                     "labels": {
            //                         "default": [],
            //                         "description": "An ordered list of labels that will be provided per new deployment.",
            //                         "type": "list"
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": false,
            //                 "availability_rules": {
            //                     "node_instances_active": [
            //                         "none"
            //                     ]
            //                 }
            //             },
            //             {
            //                 "name": "batch_deploy",
            //                 "plugin": "cloudify_custom_workflow",
            //                 "operation": "cloudify_custom_workflow.tasks.batch_deploy",
            //                 "parameters": {
            //                     "blueprint_id": {
            //                         "description": "The name of an already uploaded blueprint.",
            //                         "type": "blueprint_id"
            //                     },
            //                     "parent_deployments": {
            //                         "description": "A list of deployments, which will be parents to the new deployments. One new deployment will be create from blueprint_id per parent deployment that is provided.",
            //                         "type": "list",
            //                         "item_type": "deployment_id"
            //                     },
            //                     "group_id": {
            //                         "default": "",
            //                         "description": "The new group ID.",
            //                         "type": "string"
            //                     },
            //                     "new_deployment_ids": {
            //                         "default": [],
            //                         "description": "The new new_deployment_ids.",
            //                         "type": "list"
            //                     },
            //                     "inputs": {
            //                         "default": [],
            //                         "description": "An ordered list of inputs that will be provided per new deployment.",
            //                         "type": "list"
            //                     },
            //                     "labels": {
            //                         "default": [],
            //                         "description": "An ordered list of labels that will be provided per new deployment.",
            //                         "type": "list"
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": false,
            //                 "availability_rules": {
            //                     "node_instances_active": [
            //                         "none"
            //                     ]
            //                 }
            //             },
            //             {
            //                 "name": "batch_install",
            //                 "plugin": "cloudify_custom_workflow",
            //                 "operation": "cloudify_custom_workflow.tasks.batch_install",
            //                 "parameters": {
            //                     "group_id": {
            //                         "description": "The new group ID.",
            //                         "type": "string"
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": false,
            //                 "availability_rules": {
            //                     "node_instances_active": [
            //                         "none"
            //                     ]
            //                 }
            //             },
            //             {
            //                 "name": "discover_and_deploy",
            //                 "plugin": "azure",
            //                 "operation": "cloudify_azure.workflows.discover.discover_and_deploy",
            //                 "parameters": {
            //                     "node_id": {
            //                         "default": "",
            //                         "description": "The node_id. Not required.\n",
            //                         "type": "string"
            //                     },
            //                     "resource_types": {
            //                         "default": [
            //                             "Microsoft.ContainerService/ManagedClusters"
            //                         ],
            //                         "description": "The name of the resource to discover. Default is [Microsoft.ContainerService/ManagedClusters], as that is the only currently supported resource.\n",
            //                         "type": "list"
            //                     },
            //                     "blueprint_id": {
            //                         "default": "existing-aks-cluster",
            //                         "description": "The ID of the blueprint that should be used to deploy the new resources. Default is current blueprint.",
            //                         "type": "string"
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": null
            //             },
            //             {
            //                 "name": "restart_vm",
            //                 "plugin": "DHL_VM",
            //                 "operation": "miaas_plugin.workflows.azure.vm.restart",
            //                 "parameters": {},
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": null
            //             },
            //             {
            //                 "name": "add_disk",
            //                 "plugin": "DHL_VM",
            //                 "operation": "miaas_plugin.workflows.azure.vm.add_disk",
            //                 "parameters": {
            //                     "disk_size": {
            //                         "default": 32,
            //                         "description": "Standard disk size / SKU of selected Disk type.\n",
            //                         "type": "integer"
            //                     },
            //                     "disk_type": {
            //                         "default": "Standard SSD",
            //                         "description": "Type of the data disk\n",
            //                         "type": "string",
            //                         "constraints": [
            //                             {
            //                                 "valid_values": [
            //                                     "Standard HDD",
            //                                     "Standard SSD",
            //                                     "Premium SSD"
            //                                 ]
            //                             }
            //                         ]
            //                     },
            //                     "host_caching": {
            //                         "default": "None",
            //                         "description": "Host caching configuration for the data disk.\n",
            //                         "constraints": [
            //                             {
            //                                 "valid_values": [
            //                                     "None",
            //                                     "ReadOnly",
            //                                     "ReadWrite"
            //                                 ]
            //                             }
            //                         ]
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": null
            //             },
            //             {
            //                 "name": "add_ultra_disk",
            //                 "plugin": "DHL_VM",
            //                 "operation": "miaas_plugin.workflows.azure.vm.add_disk",
            //                 "parameters": {
            //                     "disk_size": {
            //                         "default": 32,
            //                         "description": "Standard disk size / SKU of selected Disk type.\n",
            //                         "type": "integer"
            //                     },
            //                     "disk_type": {
            //                         "default": "Ultra SSD",
            //                         "description": "Type of the data disk\n",
            //                         "type": "string",
            //                         "constraints": [
            //                             {
            //                                 "valid_values": [
            //                                     "Ultra SSD"
            //                                 ]
            //                             }
            //                         ]
            //                     },
            //                     "host_caching": {
            //                         "default": "None",
            //                         "description": "Host caching configuration for the data disk.\n",
            //                         "constraints": [
            //                             {
            //                                 "valid_values": [
            //                                     "None"
            //                                 ]
            //                             }
            //                         ]
            //                     },
            //                     "iops": {
            //                         "description": "Target IOPS for the data disk. Valid only for Ultra disks.\n",
            //                         "type": "integer",
            //                         "constraints": [
            //                             {
            //                                 "in_range": [
            //                                     100,
            //                                     160000
            //                                 ]
            //                             }
            //                         ]
            //                     },
            //                     "throughput": {
            //                         "description": "The throughput limit for the data disk. Valid only for Ultra disks.\n",
            //                         "type": "integer",
            //                         "constraints": [
            //                             {
            //                                 "in_range": [
            //                                     1,
            //                                     4000
            //                                 ]
            //                             }
            //                         ]
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": null
            //             },
            //             {
            //                 "name": "remove_disk",
            //                 "plugin": "DHL_VM",
            //                 "operation": "miaas_plugin.workflows.azure.vm.remove_disk",
            //                 "parameters": {
            //                     "lun": {
            //                         "description": "Logical Unit Number of the disk, which should be removed.",
            //                         "type": "integer"
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": null
            //             },
            //             {
            //                 "name": "resize_disk",
            //                 "plugin": "DHL_Data_Disk",
            //                 "operation": "miaas_plugin.workflows.azure.disk.resize",
            //                 "parameters": {
            //                     "size": {
            //                         "description": "New disk size in GiB",
            //                         "type": "integer",
            //                         "constraints": [
            //                             {
            //                                 "valid_values": [
            //                                     4,
            //                                     8,
            //                                     16,
            //                                     32,
            //                                     64,
            //                                     128,
            //                                     256,
            //                                     512,
            //                                     1024,
            //                                     2048,
            //                                     4096,
            //                                     8192,
            //                                     16384,
            //                                     32767
            //                                 ]
            //                             }
            //                         ]
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": null
            //             },
            //             {
            //                 "name": "request_sys_admin_account",
            //                 "plugin": "DHL_RHEL_VM",
            //                 "operation": "miaas_plugin.workflows.pam.request_access",
            //                 "parameters": {
            //                     "user_id": {
            //                         "description": "ID of the user for which access should be granted",
            //                         "type": "string"
            //                     },
            //                     "account_role": {
            //                         "default": "sadminbu",
            //                         "description": "Type of the account to which access should be granted (only for RHEL)",
            //                         "type": "string",
            //                         "constraints": [
            //                             {
            //                                 "valid_values": [
            //                                     "sadminbu"
            //                                 ]
            //                             }
            //                         ]
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": null
            //             },
            //             {
            //                 "name": "request_app_admin_account",
            //                 "plugin": "DHL_RHEL_VM",
            //                 "operation": "miaas_plugin.workflows.pam.request_access",
            //                 "parameters": {
            //                     "user_id": {
            //                         "description": "ID of the user for which access should be granted",
            //                         "type": "string"
            //                     },
            //                     "account_role": {
            //                         "default": "aadminbu",
            //                         "description": "Type of the account to which access should be granted (only for RHEL)",
            //                         "type": "string",
            //                         "constraints": [
            //                             {
            //                                 "valid_values": [
            //                                     "aadminbu"
            //                                 ]
            //                             }
            //                         ]
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": null
            //             },
            //             {
            //                 "name": "request_user_account",
            //                 "plugin": "DHL_Windows_VM",
            //                 "operation": "miaas_plugin.workflows.pam.request_access",
            //                 "parameters": {
            //                     "user_id": {
            //                         "description": "ID of the user for which access should be granted",
            //                         "type": "string"
            //                     },
            //                     "account_role": {
            //                         "description": "Role which user requests for (only for Windows)",
            //                         "type": "string",
            //                         "constraints": [
            //                             {
            //                                 "valid_values": [
            //                                     "Administrator",
            //                                     "RemoteDesktopUser"
            //                                 ]
            //                             }
            //                         ]
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": null
            //             },
            //             {
            //                 "name": "request_service_account",
            //                 "plugin": "DHL_Windows_VM",
            //                 "operation": "miaas_plugin.workflows.pam.request_access",
            //                 "parameters": {
            //                     "user_id": {
            //                         "description": "ID of the user for which access should be granted",
            //                         "type": "string"
            //                     },
            //                     "account_role": {
            //                         "default": [
            //                             "Services"
            //                         ],
            //                         "description": "Role of the service account being added to LDAP via JEA\nThe correct values:\n- Services\n- ScheduledJobs\n- Administrator\n- MSSQL-DBOwnerok,\n- MSSQL-SysAdmin\n- MSSQL-AgentReader\n- MSSQL-DBSSISAdmin\n",
            //                         "type": "list"
            //                     },
            //                     "service_account_name": {
            //                         "description": "Name of Service Account.\nFor UAT the name should be started from a1e_, for PROD a1d_\n",
            //                         "type": "string",
            //                         "constraints": [
            //                             {
            //                                 "pattern": "(^a1[ed]_.+)|(^$)"
            //                             }
            //                         ]
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": null
            //             },
            //             {
            //                 "name": "revoke_sys_admin_account",
            //                 "plugin": "DHL_RHEL_VM",
            //                 "operation": "miaas_plugin.workflows.pam.revoke_access",
            //                 "parameters": {
            //                     "user_id": {
            //                         "description": "ID of the user for which access should be rejected",
            //                         "type": "string"
            //                     },
            //                     "account_role": {
            //                         "default": "sadminbu",
            //                         "description": "Type of the account to which access should be granted (only for RHEL)",
            //                         "type": "string",
            //                         "constraints": [
            //                             {
            //                                 "valid_values": [
            //                                     "sadminbu"
            //                                 ]
            //                             }
            //                         ]
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": null
            //             },
            //             {
            //                 "name": "revoke_app_admin_account",
            //                 "plugin": "DHL_RHEL_VM",
            //                 "operation": "miaas_plugin.workflows.pam.revoke_access",
            //                 "parameters": {
            //                     "user_id": {
            //                         "description": "ID of the user for which access should be rejected",
            //                         "type": "string"
            //                     },
            //                     "account_role": {
            //                         "default": "aadminbu",
            //                         "description": "Type of the account to which access should be granted (only for RHEL)",
            //                         "type": "string",
            //                         "constraints": [
            //                             {
            //                                 "valid_values": [
            //                                     "aadminbu"
            //                                 ]
            //                             }
            //                         ]
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": null
            //             },
            //             {
            //                 "name": "revoke_user_account",
            //                 "plugin": "DHL_Windows_VM",
            //                 "operation": "miaas_plugin.workflows.pam.revoke_access",
            //                 "parameters": {
            //                     "user_id": {
            //                         "description": "ID of the user for which access should be rejected",
            //                         "type": "string"
            //                     },
            //                     "account_role": {
            //                         "description": "Role which user requests for (only for Windows)",
            //                         "type": "string",
            //                         "constraints": [
            //                             {
            //                                 "valid_values": [
            //                                     "Administrator",
            //                                     "RemoteDesktopUser"
            //                                 ]
            //                             }
            //                         ]
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": null
            //             },
            //             {
            //                 "name": "revoke_service_account",
            //                 "plugin": "DHL_Windows_VM",
            //                 "operation": "miaas_plugin.workflows.pam.revoke_access",
            //                 "parameters": {
            //                     "service_account_name": {
            //                         "description": "Name of Service Account.\nFor UAT the name should be started from a1e_, for PROD a1d_\n",
            //                         "type": "string",
            //                         "constraints": [
            //                             {
            //                                 "pattern": "(^a1[ed]_.+)|(^$)"
            //                             }
            //                         ]
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": null
            //             },
            //             {
            //                 "name": "approve_or_reject",
            //                 "plugin": "DHL_Approval",
            //                 "operation": "miaas_plugin.workflows.pam.approve_or_reject",
            //                 "parameters": {
            //                     "approve": {
            //                         "default": false,
            //                         "description": "If `true` approval will be granted and blocked workflow \nexecution will be resumed. Default: `false`\n",
            //                         "type": "boolean"
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": null
            //             },
            //             {
            //                 "name": "run_audit",
            //                 "plugin": "DHL_VM",
            //                 "operation": "miaas_plugin.workflows.oat.run",
            //                 "parameters": {
            //                     "oat_profile": {
            //                         "default": "OAT",
            //                         "description": "The type of OAT checks which user would like to run.\n",
            //                         "type": "string",
            //                         "constraints": [
            //                             {
            //                                 "valid_values": [
            //                                     "BUILD-OAT",
            //                                     "OAT",
            //                                     "PROD-OAT"
            //                                 ]
            //                             }
            //                         ]
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": null
            //             },
            //             {
            //                 "name": "resize_rhel_vm",
            //                 "plugin": "DHL_RHEL_VM",
            //                 "operation": "miaas_plugin.workflows.azure.vm.resize",
            //                 "parameters": {
            //                     "size": {
            //                         "description": "New VM size",
            //                         "constraints": [
            //                             {
            //                                 "valid_values": [
            //                                     "Standard_B2ms (2 CPU, 8GB RAM, max 4 data disks)",
            //                                     "Standard_B2s (2 CPU, 4GB RAM, max 4 data disks)",
            //                                     "Standard_B4ms (4 CPU, 16GB RAM, max 8 data disks)",
            //                                     "Standard_B8ms (8 CPU, 32GB RAM, max 16 data disks)",
            //                                     "Standard_B12ms (12 CPU, 48GB RAM, max 16 data disks)",
            //                                     "Standard_B16ms (16 CPU, 64GB RAM, max 32 data disks)",
            //                                     "Standard_B20ms (20 CPU, 80GB RAM, max 32 data disks)",
            //                                     "Standard_D1_v2 (1 CPU, 3GB RAM, max 4 data disks)",
            //                                     "Standard_D2_v2 (2 CPU, 7GB RAM, max 8 data disks)",
            //                                     "Standard_D3_v2 (4 CPU, 14GB RAM, max 16 data disks)",
            //                                     "Standard_D4_v2 (8 CPU, 28GB RAM, max 32 data disks)",
            //                                     "Standard_D5_v2 (16 CPU, 56GB RAM, max 64 data disks)",
            //                                     "Standard_D11_v2 (2 CPU, 14GB RAM, max 8 data disks)",
            //                                     "Standard_D12_v2 (4 CPU, 28GB RAM, max 16 data disks)",
            //                                     "Standard_D13_v2 (8 CPU, 56GB RAM, max 32 data disks)",
            //                                     "Standard_D14_v2 (16 CPU, 112GB RAM, max 64 data disks)",
            //                                     "Standard_D15_v2 (20 CPU, 140GB RAM, max 64 data disks)",
            //                                     "Standard_F1 (1 CPU, 2GB RAM, max 4 data disks)",
            //                                     "Standard_F2 (2 CPU, 4GB RAM, max 8 data disks)",
            //                                     "Standard_F4 (4 CPU, 8GB RAM, max 16 data disks)",
            //                                     "Standard_F8 (8 CPU, 16GB RAM, max 32 data disks)",
            //                                     "Standard_F16 (16 CPU, 32GB RAM, max 64 data disks)",
            //                                     "Standard_DS1_v2 (1 CPU, 3GB RAM, max 4 data disks)",
            //                                     "Standard_DS2_v2 (2 CPU, 7GB RAM, max 8 data disks)",
            //                                     "Standard_DS3_v2 (4 CPU, 14GB RAM, max 16 data disks)",
            //                                     "Standard_DS4_v2 (8 CPU, 28GB RAM, max 32 data disks)",
            //                                     "Standard_DS5_v2 (16 CPU, 56GB RAM, max 64 data disks)",
            //                                     "Standard_DS11-1_v2 (2 CPU, 14GB RAM, max 8 data disks)",
            //                                     "Standard_DS11_v2 (2 CPU, 14GB RAM, max 8 data disks)",
            //                                     "Standard_DS12-1_v2 (4 CPU, 28GB RAM, max 16 data disks)",
            //                                     "Standard_DS12-2_v2 (4 CPU, 28GB RAM, max 16 data disks)",
            //                                     "Standard_DS12_v2 (4 CPU, 28GB RAM, max 16 data disks)",
            //                                     "Standard_DS13-2_v2 (8 CPU, 56GB RAM, max 32 data disks)",
            //                                     "Standard_DS13-4_v2 (8 CPU, 56GB RAM, max 32 data disks)",
            //                                     "Standard_DS13_v2 (8 CPU, 56GB RAM, max 32 data disks)",
            //                                     "Standard_DS14-4_v2 (16 CPU, 112GB RAM, max 64 data disks)",
            //                                     "Standard_DS14-8_v2 (16 CPU, 112GB RAM, max 64 data disks)",
            //                                     "Standard_DS14_v2 (16 CPU, 112GB RAM, max 64 data disks)",
            //                                     "Standard_DS15_v2 (20 CPU, 140GB RAM, max 64 data disks)",
            //                                     "Standard_F1s (1 CPU, 2GB RAM, max 4 data disks)",
            //                                     "Standard_F2s (2 CPU, 4GB RAM, max 8 data disks)",
            //                                     "Standard_F4s (4 CPU, 8GB RAM, max 16 data disks)",
            //                                     "Standard_F8s (8 CPU, 16GB RAM, max 32 data disks)",
            //                                     "Standard_F16s (16 CPU, 32GB RAM, max 64 data disks)",
            //                                     "Standard_A2m_v2 (2 CPU, 16GB RAM, max 4 data disks)",
            //                                     "Standard_A2_v2 (2 CPU, 4GB RAM, max 4 data disks)",
            //                                     "Standard_A4m_v2 (4 CPU, 32GB RAM, max 8 data disks)",
            //                                     "Standard_A4_v2 (4 CPU, 8GB RAM, max 8 data disks)",
            //                                     "Standard_A8m_v2 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_A8_v2 (8 CPU, 16GB RAM, max 16 data disks)",
            //                                     "Standard_D2_v3 (2 CPU, 8GB RAM, max 4 data disks)",
            //                                     "Standard_D4_v3 (4 CPU, 16GB RAM, max 8 data disks)",
            //                                     "Standard_D8_v3 (8 CPU, 32GB RAM, max 16 data disks)",
            //                                     "Standard_D16_v3 (16 CPU, 64GB RAM, max 32 data disks)",
            //                                     "Standard_D32_v3 (32 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_D48_v3 (48 CPU, 192GB RAM, max 32 data disks)",
            //                                     "Standard_D64_v3 (64 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_D2s_v3 (2 CPU, 8GB RAM, max 4 data disks)",
            //                                     "Standard_D4s_v3 (4 CPU, 16GB RAM, max 8 data disks)",
            //                                     "Standard_D8s_v3 (8 CPU, 32GB RAM, max 16 data disks)",
            //                                     "Standard_D16s_v3 (16 CPU, 64GB RAM, max 32 data disks)",
            //                                     "Standard_D32s_v3 (32 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_D48s_v3 (48 CPU, 192GB RAM, max 32 data disks)",
            //                                     "Standard_D64s_v3 (64 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E2_v3 (2 CPU, 16GB RAM, max 4 data disks)",
            //                                     "Standard_E4_v3 (4 CPU, 32GB RAM, max 8 data disks)",
            //                                     "Standard_E8_v3 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_E16_v3 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E20_v3 (20 CPU, 160GB RAM, max 32 data disks)",
            //                                     "Standard_E32_v3 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E2s_v3 (2 CPU, 16GB RAM, max 4 data disks)",
            //                                     "Standard_E4-2s_v3 (4 CPU, 32GB RAM, max 8 data disks)",
            //                                     "Standard_E4s_v3 (4 CPU, 32GB RAM, max 8 data disks)",
            //                                     "Standard_E8-2s_v3 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_E8-4s_v3 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_E8s_v3 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_E16-4s_v3 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E16-8s_v3 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E16s_v3 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E20s_v3 (20 CPU, 160GB RAM, max 32 data disks)",
            //                                     "Standard_E32-8s_v3 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E32-16s_v3 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E32s_v3 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_M8-2ms (8 CPU, 218GB RAM, max 8 data disks)",
            //                                     "Standard_M8-4ms (8 CPU, 218GB RAM, max 8 data disks)",
            //                                     "Standard_M8ms (8 CPU, 218GB RAM, max 8 data disks)",
            //                                     "Standard_M16-4ms (16 CPU, 437GB RAM, max 16 data disks)",
            //                                     "Standard_M16-8ms (16 CPU, 437GB RAM, max 16 data disks)",
            //                                     "Standard_M16ms (16 CPU, 437GB RAM, max 16 data disks)",
            //                                     "Standard_M32-8ms (32 CPU, 875GB RAM, max 32 data disks)",
            //                                     "Standard_M32-16ms (32 CPU, 875GB RAM, max 32 data disks)",
            //                                     "Standard_M32ls (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_M32ms (32 CPU, 875GB RAM, max 32 data disks)",
            //                                     "Standard_M32ts (32 CPU, 192GB RAM, max 32 data disks)",
            //                                     "Standard_M64-16ms (64 CPU, 1750GB RAM, max 64 data disks)",
            //                                     "Standard_M64-32ms (64 CPU, 1750GB RAM, max 64 data disks)",
            //                                     "Standard_M64ls (64 CPU, 512GB RAM, max 64 data disks)",
            //                                     "Standard_M64ms (64 CPU, 1750GB RAM, max 64 data disks)",
            //                                     "Standard_M64s (64 CPU, 1024GB RAM, max 64 data disks)",
            //                                     "Standard_M128-32ms (128 CPU, 3800GB RAM, max 64 data disks)",
            //                                     "Standard_M128-64ms (128 CPU, 3800GB RAM, max 64 data disks)",
            //                                     "Standard_M128ms (128 CPU, 3800GB RAM, max 64 data disks)",
            //                                     "Standard_M128s (128 CPU, 2000GB RAM, max 64 data disks)",
            //                                     "Standard_M64 (64 CPU, 1000GB RAM, max 64 data disks)",
            //                                     "Standard_M64m (64 CPU, 1750GB RAM, max 64 data disks)",
            //                                     "Standard_M128 (128 CPU, 2000GB RAM, max 64 data disks)",
            //                                     "Standard_M128m (128 CPU, 3800GB RAM, max 64 data disks)",
            //                                     "Standard_D2ds_v4 (2 CPU, 8GB RAM, max 4 data disks)",
            //                                     "Standard_D4ds_v4 (4 CPU, 16GB RAM, max 8 data disks)",
            //                                     "Standard_D8ds_v4 (8 CPU, 32GB RAM, max 16 data disks)",
            //                                     "Standard_D16ds_v4 (16 CPU, 64GB RAM, max 32 data disks)",
            //                                     "Standard_D32ds_v4 (32 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_D48ds_v4 (48 CPU, 192GB RAM, max 32 data disks)",
            //                                     "Standard_D64ds_v4 (64 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_D2ds_v5 (2 CPU, 8GB RAM, max 4 data disks)",
            //                                     "Standard_D4ds_v5 (4 CPU, 16GB RAM, max 8 data disks)",
            //                                     "Standard_D8ds_v5 (8 CPU, 32GB RAM, max 16 data disks)",
            //                                     "Standard_D16ds_v5 (16 CPU, 64GB RAM, max 32 data disks)",
            //                                     "Standard_D32ds_v5 (32 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_D48ds_v5 (48 CPU, 192GB RAM, max 32 data disks)",
            //                                     "Standard_D64ds_v5 (64 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_D96ds_v5 (96 CPU, 384GB RAM, max 32 data disks)",
            //                                     "Standard_D2d_v4 (2 CPU, 8GB RAM, max 4 data disks)",
            //                                     "Standard_D4d_v4 (4 CPU, 16GB RAM, max 8 data disks)",
            //                                     "Standard_D8d_v4 (8 CPU, 32GB RAM, max 16 data disks)",
            //                                     "Standard_D16d_v4 (16 CPU, 64GB RAM, max 32 data disks)",
            //                                     "Standard_D32d_v4 (32 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_D48d_v4 (48 CPU, 192GB RAM, max 32 data disks)",
            //                                     "Standard_D64d_v4 (64 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_D2d_v5 (2 CPU, 8GB RAM, max 4 data disks)",
            //                                     "Standard_D4d_v5 (4 CPU, 16GB RAM, max 8 data disks)",
            //                                     "Standard_D8d_v5 (8 CPU, 32GB RAM, max 16 data disks)",
            //                                     "Standard_D16d_v5 (16 CPU, 64GB RAM, max 32 data disks)",
            //                                     "Standard_D32d_v5 (32 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_D48d_v5 (48 CPU, 192GB RAM, max 32 data disks)",
            //                                     "Standard_D64d_v5 (64 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_D96d_v5 (96 CPU, 384GB RAM, max 32 data disks)",
            //                                     "Standard_D2s_v4 (2 CPU, 8GB RAM, max 4 data disks)",
            //                                     "Standard_D4s_v4 (4 CPU, 16GB RAM, max 8 data disks)",
            //                                     "Standard_D8s_v4 (8 CPU, 32GB RAM, max 16 data disks)",
            //                                     "Standard_D16s_v4 (16 CPU, 64GB RAM, max 32 data disks)",
            //                                     "Standard_D32s_v4 (32 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_D48s_v4 (48 CPU, 192GB RAM, max 32 data disks)",
            //                                     "Standard_D64s_v4 (64 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_D2s_v5 (2 CPU, 8GB RAM, max 4 data disks)",
            //                                     "Standard_D4s_v5 (4 CPU, 16GB RAM, max 8 data disks)",
            //                                     "Standard_D8s_v5 (8 CPU, 32GB RAM, max 16 data disks)",
            //                                     "Standard_D16s_v5 (16 CPU, 64GB RAM, max 32 data disks)",
            //                                     "Standard_D32s_v5 (32 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_D48s_v5 (48 CPU, 192GB RAM, max 32 data disks)",
            //                                     "Standard_D64s_v5 (64 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_D96s_v5 (96 CPU, 384GB RAM, max 32 data disks)",
            //                                     "Standard_D2_v4 (2 CPU, 8GB RAM, max 4 data disks)",
            //                                     "Standard_D4_v4 (4 CPU, 16GB RAM, max 8 data disks)",
            //                                     "Standard_D8_v4 (8 CPU, 32GB RAM, max 16 data disks)",
            //                                     "Standard_D16_v4 (16 CPU, 64GB RAM, max 32 data disks)",
            //                                     "Standard_D32_v4 (32 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_D48_v4 (48 CPU, 192GB RAM, max 32 data disks)",
            //                                     "Standard_D64_v4 (64 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_D2_v5 (2 CPU, 8GB RAM, max 4 data disks)",
            //                                     "Standard_D4_v5 (4 CPU, 16GB RAM, max 8 data disks)",
            //                                     "Standard_D8_v5 (8 CPU, 32GB RAM, max 16 data disks)",
            //                                     "Standard_D16_v5 (16 CPU, 64GB RAM, max 32 data disks)",
            //                                     "Standard_D32_v5 (32 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_D48_v5 (48 CPU, 192GB RAM, max 32 data disks)",
            //                                     "Standard_D64_v5 (64 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_D96_v5 (96 CPU, 384GB RAM, max 32 data disks)",
            //                                     "Standard_E2ds_v4 (2 CPU, 16GB RAM, max 4 data disks)",
            //                                     "Standard_E4-2ds_v4 (4 CPU, 32GB RAM, max 8 data disks)",
            //                                     "Standard_E4ds_v4 (4 CPU, 32GB RAM, max 8 data disks)",
            //                                     "Standard_E8-2ds_v4 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_E8-4ds_v4 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_E8ds_v4 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_E16-4ds_v4 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E16-8ds_v4 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E16ds_v4 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E20ds_v4 (20 CPU, 160GB RAM, max 32 data disks)",
            //                                     "Standard_E32-8ds_v4 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E32-16ds_v4 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E32ds_v4 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E48ds_v4 (48 CPU, 384GB RAM, max 32 data disks)",
            //                                     "Standard_E64-16ds_v4 (64 CPU, 504GB RAM, max 32 data disks)",
            //                                     "Standard_E64-32ds_v4 (64 CPU, 504GB RAM, max 32 data disks)",
            //                                     "Standard_E64ds_v4 (64 CPU, 504GB RAM, max 32 data disks)",
            //                                     "Standard_E2ds_v5 (2 CPU, 16GB RAM, max 4 data disks)",
            //                                     "Standard_E4-2ds_v5 (4 CPU, 32GB RAM, max 8 data disks)",
            //                                     "Standard_E4ds_v5 (4 CPU, 32GB RAM, max 8 data disks)",
            //                                     "Standard_E8-2ds_v5 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_E8-4ds_v5 (8 CPU, 64GB RAM, max 32 data disks)",
            //                                     "Standard_E8ds_v5 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_E16-4ds_v5 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E16-8ds_v5 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E16ds_v5 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E20ds_v5 (20 CPU, 160GB RAM, max 32 data disks)",
            //                                     "Standard_E32-8ds_v5 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E32-16ds_v5 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E32ds_v5 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E48ds_v5 (48 CPU, 384GB RAM, max 32 data disks)",
            //                                     "Standard_E64-16ds_v5 (64 CPU, 512GB RAM, max 32 data disks)",
            //                                     "Standard_E64-32ds_v5 (64 CPU, 512GB RAM, max 32 data disks)",
            //                                     "Standard_E64ds_v5 (64 CPU, 512GB RAM, max 32 data disks)",
            //                                     "Standard_E96-24ds_v5 (96 CPU, 672GB RAM, max 32 data disks)",
            //                                     "Standard_E96-48ds_v5 (96 CPU, 672GB RAM, max 32 data disks)",
            //                                     "Standard_E96ds_v5 (96 CPU, 672GB RAM, max 32 data disks)",
            //                                     "Standard_E2d_v4 (2 CPU, 16GB RAM, max 4 data disks)",
            //                                     "Standard_E4d_v4 (4 CPU, 32GB RAM, max 8 data disks)",
            //                                     "Standard_E8d_v4 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_E16d_v4 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E20d_v4 (20 CPU, 160GB RAM, max 32 data disks)",
            //                                     "Standard_E32d_v4 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E48d_v4 (48 CPU, 384GB RAM, max 32 data disks)",
            //                                     "Standard_E64d_v4 (64 CPU, 504GB RAM, max 32 data disks)",
            //                                     "Standard_E2d_v5 (2 CPU, 16GB RAM, max 4 data disks)",
            //                                     "Standard_E4d_v5 (4 CPU, 32GB RAM, max 8 data disks)",
            //                                     "Standard_E8d_v5 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_E16d_v5 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E20d_v5 (20 CPU, 160GB RAM, max 32 data disks)",
            //                                     "Standard_E32d_v5 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E48d_v5 (48 CPU, 384GB RAM, max 32 data disks)",
            //                                     "Standard_E64d_v5 (64 CPU, 512GB RAM, max 32 data disks)",
            //                                     "Standard_E96d_v5 (96 CPU, 672GB RAM, max 32 data disks)",
            //                                     "Standard_E48s_v3 (48 CPU, 384GB RAM, max 32 data disks)",
            //                                     "Standard_E64-16s_v3 (64 CPU, 432GB RAM, max 32 data disks)",
            //                                     "Standard_E64-32s_v3 (64 CPU, 432GB RAM, max 32 data disks)",
            //                                     "Standard_E64s_v3 (64 CPU, 432GB RAM, max 32 data disks)",
            //                                     "Standard_E2s_v4 (2 CPU, 16GB RAM, max 4 data disks)",
            //                                     "Standard_E4-2s_v4 (4 CPU, 32GB RAM, max 8 data disks)",
            //                                     "Standard_E4s_v4 (4 CPU, 32GB RAM, max 8 data disks)",
            //                                     "Standard_E8-2s_v4 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_E8-4s_v4 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_E8s_v4 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_E16-4s_v4 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E16-8s_v4 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E16s_v4 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E20s_v4 (20 CPU, 160GB RAM, max 32 data disks)",
            //                                     "Standard_E32-8s_v4 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E32-16s_v4 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E32s_v4 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E48s_v4 (48 CPU, 384GB RAM, max 32 data disks)",
            //                                     "Standard_E64-16s_v4 (64 CPU, 504GB RAM, max 32 data disks)",
            //                                     "Standard_E64-32s_v4 (64 CPU, 504GB RAM, max 32 data disks)",
            //                                     "Standard_E64s_v4 (64 CPU, 504GB RAM, max 32 data disks)",
            //                                     "Standard_E2s_v5 (2 CPU, 16GB RAM, max 4 data disks)",
            //                                     "Standard_E4-2s_v5 (4 CPU, 32GB RAM, max 8 data disks)",
            //                                     "Standard_E4s_v5 (4 CPU, 32GB RAM, max 8 data disks)",
            //                                     "Standard_E8-2s_v5 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_E8-4s_v5 (8 CPU, 64GB RAM, max 32 data disks)",
            //                                     "Standard_E8s_v5 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_E16-4s_v5 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E16-8s_v5 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E16s_v5 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E20s_v5 (20 CPU, 160GB RAM, max 32 data disks)",
            //                                     "Standard_E32-8s_v5 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E32-16s_v5 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E32s_v5 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E48s_v5 (48 CPU, 384GB RAM, max 32 data disks)",
            //                                     "Standard_E64-16s_v5 (64 CPU, 512GB RAM, max 32 data disks)",
            //                                     "Standard_E64-32s_v5 (64 CPU, 512GB RAM, max 32 data disks)",
            //                                     "Standard_E64s_v5 (64 CPU, 512GB RAM, max 32 data disks)",
            //                                     "Standard_E96-24s_v5 (96 CPU, 672GB RAM, max 32 data disks)",
            //                                     "Standard_E96-48s_v5 (96 CPU, 672GB RAM, max 32 data disks)",
            //                                     "Standard_E96s_v5 (96 CPU, 672GB RAM, max 32 data disks)",
            //                                     "Standard_E48_v3 (48 CPU, 384GB RAM, max 32 data disks)",
            //                                     "Standard_E64_v3 (64 CPU, 432GB RAM, max 32 data disks)",
            //                                     "Standard_E2_v4 (2 CPU, 16GB RAM, max 4 data disks)",
            //                                     "Standard_E4_v4 (4 CPU, 32GB RAM, max 8 data disks)",
            //                                     "Standard_E8_v4 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_E16_v4 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E20_v4 (20 CPU, 160GB RAM, max 32 data disks)",
            //                                     "Standard_E32_v4 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E48_v4 (48 CPU, 384GB RAM, max 32 data disks)",
            //                                     "Standard_E64_v4 (64 CPU, 504GB RAM, max 32 data disks)",
            //                                     "Standard_E2_v5 (2 CPU, 16GB RAM, max 4 data disks)",
            //                                     "Standard_E4_v5 (4 CPU, 32GB RAM, max 8 data disks)",
            //                                     "Standard_E8_v5 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_E16_v5 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E20_v5 (20 CPU, 160GB RAM, max 32 data disks)",
            //                                     "Standard_E32_v5 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E48_v5 (48 CPU, 384GB RAM, max 32 data disks)",
            //                                     "Standard_E64_v5 (64 CPU, 512GB RAM, max 32 data disks)",
            //                                     "Standard_E96_v5 (96 CPU, 672GB RAM, max 32 data disks)",
            //                                     "Standard_F2s_v2 (2 CPU, 4GB RAM, max 4 data disks)",
            //                                     "Standard_F4s_v2 (4 CPU, 8GB RAM, max 8 data disks)",
            //                                     "Standard_F8s_v2 (8 CPU, 16GB RAM, max 16 data disks)",
            //                                     "Standard_F16s_v2 (16 CPU, 32GB RAM, max 32 data disks)",
            //                                     "Standard_F32s_v2 (32 CPU, 64GB RAM, max 32 data disks)",
            //                                     "Standard_F48s_v2 (48 CPU, 96GB RAM, max 32 data disks)",
            //                                     "Standard_F64s_v2 (64 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_F72s_v2 (72 CPU, 144GB RAM, max 32 data disks)",
            //                                     "Standard_E2bs_v5 (2 CPU, 16GB RAM, max 4 data disks)",
            //                                     "Standard_E4bs_v5 (4 CPU, 32GB RAM, max 8 data disks)",
            //                                     "Standard_E8bs_v5 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_E16bs_v5 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E32bs_v5 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E48bs_v5 (48 CPU, 384GB RAM, max 32 data disks)",
            //                                     "Standard_E64bs_v5 (64 CPU, 512GB RAM, max 32 data disks)",
            //                                     "Standard_E2bds_v5 (2 CPU, 16GB RAM, max 4 data disks)",
            //                                     "Standard_E4bds_v5 (4 CPU, 32GB RAM, max 8 data disks)",
            //                                     "Standard_E8bds_v5 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_E16bds_v5 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E32bds_v5 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E48bds_v5 (48 CPU, 384GB RAM, max 32 data disks)",
            //                                     "Standard_E64bds_v5 (64 CPU, 512GB RAM, max 32 data disks)",
            //                                     "Standard_A2 (2 CPU, 3GB RAM, max 4 data disks)",
            //                                     "Standard_A3 (4 CPU, 7GB RAM, max 8 data disks)",
            //                                     "Standard_A5 (2 CPU, 14GB RAM, max 4 data disks)",
            //                                     "Standard_A4 (8 CPU, 14GB RAM, max 16 data disks)",
            //                                     "Standard_A6 (4 CPU, 28GB RAM, max 8 data disks)",
            //                                     "Standard_A7 (8 CPU, 56GB RAM, max 16 data disks)",
            //                                     "Standard_D1 (1 CPU, 3GB RAM, max 4 data disks)",
            //                                     "Standard_D2 (2 CPU, 7GB RAM, max 8 data disks)",
            //                                     "Standard_D3 (4 CPU, 14GB RAM, max 16 data disks)",
            //                                     "Standard_D4 (8 CPU, 28GB RAM, max 32 data disks)",
            //                                     "Standard_D11 (2 CPU, 14GB RAM, max 8 data disks)",
            //                                     "Standard_D12 (4 CPU, 28GB RAM, max 16 data disks)",
            //                                     "Standard_D13 (8 CPU, 56GB RAM, max 32 data disks)",
            //                                     "Standard_D14 (16 CPU, 112GB RAM, max 64 data disks)",
            //                                     "Standard_DS1 (1 CPU, 3GB RAM, max 4 data disks)",
            //                                     "Standard_DS2 (2 CPU, 7GB RAM, max 8 data disks)",
            //                                     "Standard_DS3 (4 CPU, 14GB RAM, max 16 data disks)",
            //                                     "Standard_DS4 (8 CPU, 28GB RAM, max 32 data disks)",
            //                                     "Standard_DS11 (2 CPU, 14GB RAM, max 8 data disks)",
            //                                     "Standard_DS12 (4 CPU, 28GB RAM, max 16 data disks)",
            //                                     "Standard_DS13 (8 CPU, 56GB RAM, max 32 data disks)",
            //                                     "Standard_DS14 (16 CPU, 112GB RAM, max 64 data disks)",
            //                                     "Standard_HB120-16rs_v2 (120 CPU, 456GB RAM, max 32 data disks)",
            //                                     "Standard_HB120-32rs_v2 (120 CPU, 456GB RAM, max 32 data disks)",
            //                                     "Standard_HB120-64rs_v2 (120 CPU, 456GB RAM, max 32 data disks)",
            //                                     "Standard_HB120-96rs_v2 (120 CPU, 456GB RAM, max 32 data disks)",
            //                                     "Standard_HB120rs_v2 (120 CPU, 456GB RAM, max 32 data disks)",
            //                                     "Standard_PB6s (6 CPU, 112GB RAM, max 12 data disks)",
            //                                     "Standard_NC6s_v3 (6 CPU, 112GB RAM, max 12 data disks)",
            //                                     "Standard_NC12s_v3 (12 CPU, 224GB RAM, max 24 data disks)",
            //                                     "Standard_NC24rs_v3 (24 CPU, 448GB RAM, max 32 data disks)",
            //                                     "Standard_NC24s_v3 (24 CPU, 448GB RAM, max 32 data disks)",
            //                                     "Standard_L8as_v3 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_L16as_v3 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_L32as_v3 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_L48as_v3 (48 CPU, 384GB RAM, max 32 data disks)",
            //                                     "Standard_L64as_v3 (64 CPU, 512GB RAM, max 32 data disks)",
            //                                     "Standard_L80as_v3 (80 CPU, 640GB RAM, max 32 data disks)",
            //                                     "Standard_D2a_v4 (2 CPU, 8GB RAM, max 4 data disks)",
            //                                     "Standard_D4a_v4 (4 CPU, 16GB RAM, max 8 data disks)",
            //                                     "Standard_D8a_v4 (8 CPU, 32GB RAM, max 16 data disks)",
            //                                     "Standard_D16a_v4 (16 CPU, 64GB RAM, max 32 data disks)",
            //                                     "Standard_D32a_v4 (32 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_D48a_v4 (48 CPU, 192GB RAM, max 32 data disks)",
            //                                     "Standard_D64a_v4 (64 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_D96a_v4 (96 CPU, 384GB RAM, max 32 data disks)",
            //                                     "Standard_D2as_v4 (2 CPU, 8GB RAM, max 4 data disks)",
            //                                     "Standard_D4as_v4 (4 CPU, 16GB RAM, max 8 data disks)",
            //                                     "Standard_D8as_v4 (8 CPU, 32GB RAM, max 16 data disks)",
            //                                     "Standard_D16as_v4 (16 CPU, 64GB RAM, max 32 data disks)",
            //                                     "Standard_D32as_v4 (32 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_D48as_v4 (48 CPU, 192GB RAM, max 32 data disks)",
            //                                     "Standard_D64as_v4 (64 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_D96as_v4 (96 CPU, 384GB RAM, max 32 data disks)",
            //                                     "Standard_E2a_v4 (2 CPU, 16GB RAM, max 4 data disks)",
            //                                     "Standard_E4a_v4 (4 CPU, 32GB RAM, max 8 data disks)",
            //                                     "Standard_E8a_v4 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_E16a_v4 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E20a_v4 (20 CPU, 160GB RAM, max 32 data disks)",
            //                                     "Standard_E32a_v4 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E48a_v4 (48 CPU, 384GB RAM, max 32 data disks)",
            //                                     "Standard_E64a_v4 (64 CPU, 512GB RAM, max 32 data disks)",
            //                                     "Standard_E96a_v4 (96 CPU, 672GB RAM, max 32 data disks)",
            //                                     "Standard_E2as_v4 (2 CPU, 16GB RAM, max 4 data disks)",
            //                                     "Standard_E4-2as_v4 (4 CPU, 32GB RAM, max 8 data disks)",
            //                                     "Standard_E4as_v4 (4 CPU, 32GB RAM, max 8 data disks)",
            //                                     "Standard_E8-2as_v4 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_E8-4as_v4 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_E8as_v4 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_E16-4as_v4 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E16-8as_v4 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E16as_v4 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E20as_v4 (20 CPU, 160GB RAM, max 32 data disks)",
            //                                     "Standard_E32-8as_v4 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E32-16as_v4 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E32as_v4 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E48as_v4 (48 CPU, 384GB RAM, max 32 data disks)",
            //                                     "Standard_E64-16as_v4 (64 CPU, 512GB RAM, max 32 data disks)",
            //                                     "Standard_E64-32as_v4 (64 CPU, 512GB RAM, max 32 data disks)",
            //                                     "Standard_E64as_v4 (64 CPU, 512GB RAM, max 32 data disks)",
            //                                     "Standard_E96-24as_v4 (96 CPU, 672GB RAM, max 32 data disks)",
            //                                     "Standard_E96-48as_v4 (96 CPU, 672GB RAM, max 32 data disks)",
            //                                     "Standard_E96as_v4 (96 CPU, 672GB RAM, max 32 data disks)",
            //                                     "Standard_D2as_v5 (2 CPU, 8GB RAM, max 4 data disks)",
            //                                     "Standard_D4as_v5 (4 CPU, 16GB RAM, max 8 data disks)",
            //                                     "Standard_D8as_v5 (8 CPU, 32GB RAM, max 16 data disks)",
            //                                     "Standard_D16as_v5 (16 CPU, 64GB RAM, max 32 data disks)",
            //                                     "Standard_D32as_v5 (32 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_D48as_v5 (48 CPU, 192GB RAM, max 32 data disks)",
            //                                     "Standard_D64as_v5 (64 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_D96as_v5 (96 CPU, 384GB RAM, max 32 data disks)",
            //                                     "Standard_E2as_v5 (2 CPU, 16GB RAM, max 4 data disks)",
            //                                     "Standard_E4-2as_v5 (4 CPU, 32GB RAM, max 8 data disks)",
            //                                     "Standard_E4as_v5 (4 CPU, 32GB RAM, max 8 data disks)",
            //                                     "Standard_E8-2as_v5 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_E8-4as_v5 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_E8as_v5 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_E16-4as_v5 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E16-8as_v5 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E16as_v5 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E20as_v5 (20 CPU, 160GB RAM, max 32 data disks)",
            //                                     "Standard_E32-8as_v5 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E32-16as_v5 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E32as_v5 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E48as_v5 (48 CPU, 384GB RAM, max 32 data disks)",
            //                                     "Standard_E64-16as_v5 (64 CPU, 512GB RAM, max 32 data disks)",
            //                                     "Standard_E64-32as_v5 (64 CPU, 512GB RAM, max 32 data disks)",
            //                                     "Standard_E64as_v5 (64 CPU, 512GB RAM, max 32 data disks)",
            //                                     "Standard_E96-24as_v5 (96 CPU, 672GB RAM, max 32 data disks)",
            //                                     "Standard_E96-48as_v5 (96 CPU, 672GB RAM, max 32 data disks)",
            //                                     "Standard_E96as_v5 (96 CPU, 672GB RAM, max 32 data disks)",
            //                                     "Standard_D2ads_v5 (2 CPU, 8GB RAM, max 4 data disks)",
            //                                     "Standard_D4ads_v5 (4 CPU, 16GB RAM, max 8 data disks)",
            //                                     "Standard_D8ads_v5 (8 CPU, 32GB RAM, max 16 data disks)",
            //                                     "Standard_D16ads_v5 (16 CPU, 64GB RAM, max 32 data disks)",
            //                                     "Standard_D32ads_v5 (32 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_D48ads_v5 (48 CPU, 192GB RAM, max 32 data disks)",
            //                                     "Standard_D64ads_v5 (64 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_D96ads_v5 (96 CPU, 384GB RAM, max 32 data disks)",
            //                                     "Standard_E2ads_v5 (2 CPU, 16GB RAM, max 4 data disks)",
            //                                     "Standard_E4-2ads_v5 (4 CPU, 32GB RAM, max 8 data disks)",
            //                                     "Standard_E4ads_v5 (4 CPU, 32GB RAM, max 8 data disks)",
            //                                     "Standard_E8-2ads_v5 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_E8-4ads_v5 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_E8ads_v5 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_E16-4ads_v5 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E16-8ads_v5 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E16ads_v5 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E20ads_v5 (20 CPU, 160GB RAM, max 32 data disks)",
            //                                     "Standard_E32-8ads_v5 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E32-16ads_v5 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E32ads_v5 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E48ads_v5 (48 CPU, 384GB RAM, max 32 data disks)",
            //                                     "Standard_E64-16ads_v5 (64 CPU, 512GB RAM, max 32 data disks)",
            //                                     "Standard_E64-32ads_v5 (64 CPU, 512GB RAM, max 32 data disks)",
            //                                     "Standard_E64ads_v5 (64 CPU, 512GB RAM, max 32 data disks)",
            //                                     "Standard_E96-24ads_v5 (96 CPU, 672GB RAM, max 32 data disks)",
            //                                     "Standard_E96-48ads_v5 (96 CPU, 672GB RAM, max 32 data disks)",
            //                                     "Standard_E96ads_v5 (96 CPU, 672GB RAM, max 32 data disks)",
            //                                     "Standard_HB60-15rs (60 CPU, 228GB RAM, max 4 data disks)",
            //                                     "Standard_HB60-30rs (60 CPU, 228GB RAM, max 4 data disks)",
            //                                     "Standard_HB60-45rs (60 CPU, 228GB RAM, max 4 data disks)",
            //                                     "Standard_HB60rs (60 CPU, 228GB RAM, max 4 data disks)",
            //                                     "Standard_HB120-16rs_v3 (120 CPU, 448GB RAM, max 32 data disks)",
            //                                     "Standard_HB120-32rs_v3 (120 CPU, 448GB RAM, max 32 data disks)",
            //                                     "Standard_HB120-64rs_v3 (120 CPU, 448GB RAM, max 32 data disks)",
            //                                     "Standard_HB120-96rs_v3 (120 CPU, 448GB RAM, max 32 data disks)",
            //                                     "Standard_HB120rs_v3 (120 CPU, 448GB RAM, max 32 data disks)",
            //                                     "Standard_NV6 (6 CPU, 56GB RAM, max 24 data disks)",
            //                                     "Standard_NV12 (12 CPU, 112GB RAM, max 48 data disks)",
            //                                     "Standard_NV24 (24 CPU, 224GB RAM, max 64 data disks)",
            //                                     "Standard_NV6s_v2 (6 CPU, 112GB RAM, max 12 data disks)",
            //                                     "Standard_NV12s_v2 (12 CPU, 224GB RAM, max 24 data disks)",
            //                                     "Standard_NV24s_v2 (24 CPU, 448GB RAM, max 32 data disks)",
            //                                     "Standard_NV12s_v3 (12 CPU, 112GB RAM, max 12 data disks)",
            //                                     "Standard_NV24s_v3 (24 CPU, 224GB RAM, max 24 data disks)",
            //                                     "Standard_NV48s_v3 (48 CPU, 448GB RAM, max 32 data disks)",
            //                                     "Standard_NV4as_v4 (4 CPU, 14GB RAM, max 8 data disks)",
            //                                     "Standard_NV8as_v4 (8 CPU, 28GB RAM, max 16 data disks)",
            //                                     "Standard_NV16as_v4 (16 CPU, 56GB RAM, max 32 data disks)",
            //                                     "Standard_NV32as_v4 (32 CPU, 112GB RAM, max 32 data disks)",
            //                                     "Standard_NC6 (6 CPU, 56GB RAM, max 24 data disks)",
            //                                     "Standard_NC12 (12 CPU, 112GB RAM, max 48 data disks)",
            //                                     "Standard_NC24 (24 CPU, 224GB RAM, max 64 data disks)",
            //                                     "Standard_NC24r (24 CPU, 224GB RAM, max 64 data disks)",
            //                                     "Standard_G1 (2 CPU, 28GB RAM, max 8 data disks)",
            //                                     "Standard_G2 (4 CPU, 56GB RAM, max 16 data disks)",
            //                                     "Standard_G3 (8 CPU, 112GB RAM, max 32 data disks)",
            //                                     "Standard_G4 (16 CPU, 224GB RAM, max 64 data disks)",
            //                                     "Standard_G5 (32 CPU, 448GB RAM, max 64 data disks)",
            //                                     "Standard_NV6ads_A10_v5 (6 CPU, 55GB RAM, max 4 data disks)",
            //                                     "Standard_NV12ads_A10_v5 (12 CPU, 110GB RAM, max 8 data disks)",
            //                                     "Standard_NV18ads_A10_v5 (18 CPU, 220GB RAM, max 16 data disks)",
            //                                     "Standard_NV36adms_A10_v5 (36 CPU, 880GB RAM, max 32 data disks)",
            //                                     "Standard_NV36ads_A10_v5 (36 CPU, 440GB RAM, max 32 data disks)",
            //                                     "Standard_NV72ads_A10_v5 (72 CPU, 880GB RAM, max 32 data disks)",
            //                                     "Standard_NC4as_T4_v3 (4 CPU, 28GB RAM, max 8 data disks)",
            //                                     "Standard_NC8as_T4_v3 (8 CPU, 56GB RAM, max 16 data disks)",
            //                                     "Standard_NC16as_T4_v3 (16 CPU, 110GB RAM, max 32 data disks)",
            //                                     "Standard_NC64as_T4_v3 (64 CPU, 440GB RAM, max 32 data disks)",
            //                                     "Standard_ND6s (6 CPU, 112GB RAM, max 12 data disks)",
            //                                     "Standard_ND12s (12 CPU, 224GB RAM, max 24 data disks)",
            //                                     "Standard_ND24rs (24 CPU, 448GB RAM, max 32 data disks)",
            //                                     "Standard_ND24s (24 CPU, 448GB RAM, max 32 data disks)",
            //                                     "Standard_NC24ads_A100_v4 (24 CPU, 220GB RAM, max 8 data disks)",
            //                                     "Standard_NC48ads_A100_v4 (48 CPU, 440GB RAM, max 16 data disks)",
            //                                     "Standard_NC96ads_A100_v4 (96 CPU, 880GB RAM, max 32 data disks)",
            //                                     "Standard_HC44-16rs (44 CPU, 352GB RAM, max 4 data disks)",
            //                                     "Standard_HC44-32rs (44 CPU, 352GB RAM, max 4 data disks)",
            //                                     "Standard_HC44rs (44 CPU, 352GB RAM, max 4 data disks)",
            //                                     "Standard_DC2s (2 CPU, 8GB RAM, max 2 data disks)",
            //                                     "Standard_DC4s (4 CPU, 16GB RAM, max 4 data disks)",
            //                                     "Standard_NP10s (10 CPU, 168GB RAM, max 8 data disks)",
            //                                     "Standard_NP20s (20 CPU, 336GB RAM, max 16 data disks)",
            //                                     "Standard_NP40s (40 CPU, 672GB RAM, max 32 data disks)",
            //                                     "Standard_NC6s_v2 (6 CPU, 112GB RAM, max 12 data disks)",
            //                                     "Standard_NC12s_v2 (12 CPU, 224GB RAM, max 24 data disks)",
            //                                     "Standard_NC24rs_v2 (24 CPU, 448GB RAM, max 32 data disks)",
            //                                     "Standard_NC24s_v2 (24 CPU, 448GB RAM, max 32 data disks)"
            //                                 ]
            //                             }
            //                         ]
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": null
            //             },
            //             {
            //                 "name": "resize_windows_vm",
            //                 "plugin": "DHL_Windows_VM",
            //                 "operation": "miaas_plugin.workflows.azure.vm.resize",
            //                 "parameters": {
            //                     "size": {
            //                         "description": "New VM size",
            //                         "constraints": [
            //                             {
            //                                 "valid_values": [
            //                                     "Standard_B1ms (1 CPU, 2GB RAM, max 2 data disks)",
            //                                     "Standard_B2ms (2 CPU, 8GB RAM, max 4 data disks)",
            //                                     "Standard_B2s (2 CPU, 4GB RAM, max 4 data disks)",
            //                                     "Standard_B4ms (4 CPU, 16GB RAM, max 8 data disks)",
            //                                     "Standard_B8ms (8 CPU, 32GB RAM, max 16 data disks)",
            //                                     "Standard_B12ms (12 CPU, 48GB RAM, max 16 data disks)",
            //                                     "Standard_B16ms (16 CPU, 64GB RAM, max 32 data disks)",
            //                                     "Standard_B20ms (20 CPU, 80GB RAM, max 32 data disks)",
            //                                     "Standard_F1 (1 CPU, 2GB RAM, max 4 data disks)",
            //                                     "Standard_F2 (2 CPU, 4GB RAM, max 8 data disks)",
            //                                     "Standard_F4 (4 CPU, 8GB RAM, max 16 data disks)",
            //                                     "Standard_F8 (8 CPU, 16GB RAM, max 32 data disks)",
            //                                     "Standard_F16 (16 CPU, 32GB RAM, max 64 data disks)",
            //                                     "Standard_DS1_v2 (1 CPU, 3GB RAM, max 4 data disks)",
            //                                     "Standard_DS2_v2 (2 CPU, 7GB RAM, max 8 data disks)",
            //                                     "Standard_DS3_v2 (4 CPU, 14GB RAM, max 16 data disks)",
            //                                     "Standard_DS4_v2 (8 CPU, 28GB RAM, max 32 data disks)",
            //                                     "Standard_DS5_v2 (16 CPU, 56GB RAM, max 64 data disks)",
            //                                     "Standard_DS11-1_v2 (2 CPU, 14GB RAM, max 8 data disks)",
            //                                     "Standard_DS11_v2 (2 CPU, 14GB RAM, max 8 data disks)",
            //                                     "Standard_DS12-1_v2 (4 CPU, 28GB RAM, max 16 data disks)",
            //                                     "Standard_DS12-2_v2 (4 CPU, 28GB RAM, max 16 data disks)",
            //                                     "Standard_DS12_v2 (4 CPU, 28GB RAM, max 16 data disks)",
            //                                     "Standard_DS13-2_v2 (8 CPU, 56GB RAM, max 32 data disks)",
            //                                     "Standard_DS13-4_v2 (8 CPU, 56GB RAM, max 32 data disks)",
            //                                     "Standard_DS13_v2 (8 CPU, 56GB RAM, max 32 data disks)",
            //                                     "Standard_DS14-4_v2 (16 CPU, 112GB RAM, max 64 data disks)",
            //                                     "Standard_DS14-8_v2 (16 CPU, 112GB RAM, max 64 data disks)",
            //                                     "Standard_DS14_v2 (16 CPU, 112GB RAM, max 64 data disks)",
            //                                     "Standard_DS15_v2 (20 CPU, 140GB RAM, max 64 data disks)",
            //                                     "Standard_F1s (1 CPU, 2GB RAM, max 4 data disks)",
            //                                     "Standard_F2s (2 CPU, 4GB RAM, max 8 data disks)",
            //                                     "Standard_F4s (4 CPU, 8GB RAM, max 16 data disks)",
            //                                     "Standard_F8s (8 CPU, 16GB RAM, max 32 data disks)",
            //                                     "Standard_F16s (16 CPU, 32GB RAM, max 64 data disks)",
            //                                     "Standard_D2s_v3 (2 CPU, 8GB RAM, max 4 data disks)",
            //                                     "Standard_D4s_v3 (4 CPU, 16GB RAM, max 8 data disks)",
            //                                     "Standard_D8s_v3 (8 CPU, 32GB RAM, max 16 data disks)",
            //                                     "Standard_D16s_v3 (16 CPU, 64GB RAM, max 32 data disks)",
            //                                     "Standard_D32s_v3 (32 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_D48s_v3 (48 CPU, 192GB RAM, max 32 data disks)",
            //                                     "Standard_D64s_v3 (64 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E2s_v3 (2 CPU, 16GB RAM, max 4 data disks)",
            //                                     "Standard_E4-2s_v3 (4 CPU, 32GB RAM, max 8 data disks)",
            //                                     "Standard_E4s_v3 (4 CPU, 32GB RAM, max 8 data disks)",
            //                                     "Standard_E8-2s_v3 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_E8-4s_v3 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_E8s_v3 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_E16-4s_v3 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E16-8s_v3 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E16s_v3 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E20s_v3 (20 CPU, 160GB RAM, max 32 data disks)",
            //                                     "Standard_E32-8s_v3 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E32-16s_v3 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E32s_v3 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_M8-2ms (8 CPU, 218GB RAM, max 8 data disks)",
            //                                     "Standard_M8-4ms (8 CPU, 218GB RAM, max 8 data disks)",
            //                                     "Standard_M8ms (8 CPU, 218GB RAM, max 8 data disks)",
            //                                     "Standard_M16-4ms (16 CPU, 437GB RAM, max 16 data disks)",
            //                                     "Standard_M16-8ms (16 CPU, 437GB RAM, max 16 data disks)",
            //                                     "Standard_M16ms (16 CPU, 437GB RAM, max 16 data disks)",
            //                                     "Standard_M32-8ms (32 CPU, 875GB RAM, max 32 data disks)",
            //                                     "Standard_M32-16ms (32 CPU, 875GB RAM, max 32 data disks)",
            //                                     "Standard_M32ls (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_M32ms (32 CPU, 875GB RAM, max 32 data disks)",
            //                                     "Standard_M32ts (32 CPU, 192GB RAM, max 32 data disks)",
            //                                     "Standard_M64-16ms (64 CPU, 1750GB RAM, max 64 data disks)",
            //                                     "Standard_M64-32ms (64 CPU, 1750GB RAM, max 64 data disks)",
            //                                     "Standard_M64ls (64 CPU, 512GB RAM, max 64 data disks)",
            //                                     "Standard_M64ms (64 CPU, 1750GB RAM, max 64 data disks)",
            //                                     "Standard_M64s (64 CPU, 1024GB RAM, max 64 data disks)",
            //                                     "Standard_M128-32ms (128 CPU, 3800GB RAM, max 64 data disks)",
            //                                     "Standard_M128-64ms (128 CPU, 3800GB RAM, max 64 data disks)",
            //                                     "Standard_M128ms (128 CPU, 3800GB RAM, max 64 data disks)",
            //                                     "Standard_M128s (128 CPU, 2000GB RAM, max 64 data disks)",
            //                                     "Standard_M64 (64 CPU, 1000GB RAM, max 64 data disks)",
            //                                     "Standard_M64m (64 CPU, 1750GB RAM, max 64 data disks)",
            //                                     "Standard_M128 (128 CPU, 2000GB RAM, max 64 data disks)",
            //                                     "Standard_M128m (128 CPU, 3800GB RAM, max 64 data disks)",
            //                                     "Standard_D2ds_v4 (2 CPU, 8GB RAM, max 4 data disks)",
            //                                     "Standard_D4ds_v4 (4 CPU, 16GB RAM, max 8 data disks)",
            //                                     "Standard_D8ds_v4 (8 CPU, 32GB RAM, max 16 data disks)",
            //                                     "Standard_D16ds_v4 (16 CPU, 64GB RAM, max 32 data disks)",
            //                                     "Standard_D32ds_v4 (32 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_D48ds_v4 (48 CPU, 192GB RAM, max 32 data disks)",
            //                                     "Standard_D64ds_v4 (64 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_D2ds_v5 (2 CPU, 8GB RAM, max 4 data disks)",
            //                                     "Standard_D4ds_v5 (4 CPU, 16GB RAM, max 8 data disks)",
            //                                     "Standard_D8ds_v5 (8 CPU, 32GB RAM, max 16 data disks)",
            //                                     "Standard_D16ds_v5 (16 CPU, 64GB RAM, max 32 data disks)",
            //                                     "Standard_D32ds_v5 (32 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_D48ds_v5 (48 CPU, 192GB RAM, max 32 data disks)",
            //                                     "Standard_D64ds_v5 (64 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_D96ds_v5 (96 CPU, 384GB RAM, max 32 data disks)",
            //                                     "Standard_D2d_v4 (2 CPU, 8GB RAM, max 4 data disks)",
            //                                     "Standard_D4d_v4 (4 CPU, 16GB RAM, max 8 data disks)",
            //                                     "Standard_D8d_v4 (8 CPU, 32GB RAM, max 16 data disks)",
            //                                     "Standard_D16d_v4 (16 CPU, 64GB RAM, max 32 data disks)",
            //                                     "Standard_D32d_v4 (32 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_D48d_v4 (48 CPU, 192GB RAM, max 32 data disks)",
            //                                     "Standard_D64d_v4 (64 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_D2d_v5 (2 CPU, 8GB RAM, max 4 data disks)",
            //                                     "Standard_D4d_v5 (4 CPU, 16GB RAM, max 8 data disks)",
            //                                     "Standard_D8d_v5 (8 CPU, 32GB RAM, max 16 data disks)",
            //                                     "Standard_D16d_v5 (16 CPU, 64GB RAM, max 32 data disks)",
            //                                     "Standard_D32d_v5 (32 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_D48d_v5 (48 CPU, 192GB RAM, max 32 data disks)",
            //                                     "Standard_D64d_v5 (64 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_D96d_v5 (96 CPU, 384GB RAM, max 32 data disks)",
            //                                     "Standard_D2s_v4 (2 CPU, 8GB RAM, max 4 data disks)",
            //                                     "Standard_D4s_v4 (4 CPU, 16GB RAM, max 8 data disks)",
            //                                     "Standard_D8s_v4 (8 CPU, 32GB RAM, max 16 data disks)",
            //                                     "Standard_D16s_v4 (16 CPU, 64GB RAM, max 32 data disks)",
            //                                     "Standard_D32s_v4 (32 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_D48s_v4 (48 CPU, 192GB RAM, max 32 data disks)",
            //                                     "Standard_D64s_v4 (64 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_D2s_v5 (2 CPU, 8GB RAM, max 4 data disks)",
            //                                     "Standard_D4s_v5 (4 CPU, 16GB RAM, max 8 data disks)",
            //                                     "Standard_D8s_v5 (8 CPU, 32GB RAM, max 16 data disks)",
            //                                     "Standard_D16s_v5 (16 CPU, 64GB RAM, max 32 data disks)",
            //                                     "Standard_D32s_v5 (32 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_D48s_v5 (48 CPU, 192GB RAM, max 32 data disks)",
            //                                     "Standard_D64s_v5 (64 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_D96s_v5 (96 CPU, 384GB RAM, max 32 data disks)",
            //                                     "Standard_D2_v4 (2 CPU, 8GB RAM, max 4 data disks)",
            //                                     "Standard_D4_v4 (4 CPU, 16GB RAM, max 8 data disks)",
            //                                     "Standard_D8_v4 (8 CPU, 32GB RAM, max 16 data disks)",
            //                                     "Standard_D16_v4 (16 CPU, 64GB RAM, max 32 data disks)",
            //                                     "Standard_D32_v4 (32 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_D48_v4 (48 CPU, 192GB RAM, max 32 data disks)",
            //                                     "Standard_D64_v4 (64 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_D2_v5 (2 CPU, 8GB RAM, max 4 data disks)",
            //                                     "Standard_D4_v5 (4 CPU, 16GB RAM, max 8 data disks)",
            //                                     "Standard_D8_v5 (8 CPU, 32GB RAM, max 16 data disks)",
            //                                     "Standard_D16_v5 (16 CPU, 64GB RAM, max 32 data disks)",
            //                                     "Standard_D32_v5 (32 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_D48_v5 (48 CPU, 192GB RAM, max 32 data disks)",
            //                                     "Standard_D64_v5 (64 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_D96_v5 (96 CPU, 384GB RAM, max 32 data disks)",
            //                                     "Standard_E2ds_v4 (2 CPU, 16GB RAM, max 4 data disks)",
            //                                     "Standard_E4-2ds_v4 (4 CPU, 32GB RAM, max 8 data disks)",
            //                                     "Standard_E4ds_v4 (4 CPU, 32GB RAM, max 8 data disks)",
            //                                     "Standard_E8-2ds_v4 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_E8-4ds_v4 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_E8ds_v4 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_E16-4ds_v4 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E16-8ds_v4 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E16ds_v4 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E20ds_v4 (20 CPU, 160GB RAM, max 32 data disks)",
            //                                     "Standard_E32-8ds_v4 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E32-16ds_v4 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E32ds_v4 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E48ds_v4 (48 CPU, 384GB RAM, max 32 data disks)",
            //                                     "Standard_E64-16ds_v4 (64 CPU, 504GB RAM, max 32 data disks)",
            //                                     "Standard_E64-32ds_v4 (64 CPU, 504GB RAM, max 32 data disks)",
            //                                     "Standard_E64ds_v4 (64 CPU, 504GB RAM, max 32 data disks)",
            //                                     "Standard_E2ds_v5 (2 CPU, 16GB RAM, max 4 data disks)",
            //                                     "Standard_E4-2ds_v5 (4 CPU, 32GB RAM, max 8 data disks)",
            //                                     "Standard_E4ds_v5 (4 CPU, 32GB RAM, max 8 data disks)",
            //                                     "Standard_E8-2ds_v5 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_E8-4ds_v5 (8 CPU, 64GB RAM, max 32 data disks)",
            //                                     "Standard_E8ds_v5 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_E16-4ds_v5 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E16-8ds_v5 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E16ds_v5 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E20ds_v5 (20 CPU, 160GB RAM, max 32 data disks)",
            //                                     "Standard_E32-8ds_v5 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E32-16ds_v5 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E32ds_v5 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E48ds_v5 (48 CPU, 384GB RAM, max 32 data disks)",
            //                                     "Standard_E64-16ds_v5 (64 CPU, 512GB RAM, max 32 data disks)",
            //                                     "Standard_E64-32ds_v5 (64 CPU, 512GB RAM, max 32 data disks)",
            //                                     "Standard_E64ds_v5 (64 CPU, 512GB RAM, max 32 data disks)",
            //                                     "Standard_E96-24ds_v5 (96 CPU, 672GB RAM, max 32 data disks)",
            //                                     "Standard_E96-48ds_v5 (96 CPU, 672GB RAM, max 32 data disks)",
            //                                     "Standard_E96ds_v5 (96 CPU, 672GB RAM, max 32 data disks)",
            //                                     "Standard_E2d_v4 (2 CPU, 16GB RAM, max 4 data disks)",
            //                                     "Standard_E4d_v4 (4 CPU, 32GB RAM, max 8 data disks)",
            //                                     "Standard_E8d_v4 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_E16d_v4 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E20d_v4 (20 CPU, 160GB RAM, max 32 data disks)",
            //                                     "Standard_E32d_v4 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E48d_v4 (48 CPU, 384GB RAM, max 32 data disks)",
            //                                     "Standard_E64d_v4 (64 CPU, 504GB RAM, max 32 data disks)",
            //                                     "Standard_E2d_v5 (2 CPU, 16GB RAM, max 4 data disks)",
            //                                     "Standard_E4d_v5 (4 CPU, 32GB RAM, max 8 data disks)",
            //                                     "Standard_E8d_v5 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_E16d_v5 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E20d_v5 (20 CPU, 160GB RAM, max 32 data disks)",
            //                                     "Standard_E32d_v5 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E48d_v5 (48 CPU, 384GB RAM, max 32 data disks)",
            //                                     "Standard_E64d_v5 (64 CPU, 512GB RAM, max 32 data disks)",
            //                                     "Standard_E96d_v5 (96 CPU, 672GB RAM, max 32 data disks)",
            //                                     "Standard_E48s_v3 (48 CPU, 384GB RAM, max 32 data disks)",
            //                                     "Standard_E64-16s_v3 (64 CPU, 432GB RAM, max 32 data disks)",
            //                                     "Standard_E64-32s_v3 (64 CPU, 432GB RAM, max 32 data disks)",
            //                                     "Standard_E64s_v3 (64 CPU, 432GB RAM, max 32 data disks)",
            //                                     "Standard_E2s_v4 (2 CPU, 16GB RAM, max 4 data disks)",
            //                                     "Standard_E4-2s_v4 (4 CPU, 32GB RAM, max 8 data disks)",
            //                                     "Standard_E4s_v4 (4 CPU, 32GB RAM, max 8 data disks)",
            //                                     "Standard_E8-2s_v4 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_E8-4s_v4 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_E8s_v4 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_E16-4s_v4 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E16-8s_v4 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E16s_v4 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E20s_v4 (20 CPU, 160GB RAM, max 32 data disks)",
            //                                     "Standard_E32-8s_v4 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E32-16s_v4 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E32s_v4 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E48s_v4 (48 CPU, 384GB RAM, max 32 data disks)",
            //                                     "Standard_E64-16s_v4 (64 CPU, 504GB RAM, max 32 data disks)",
            //                                     "Standard_E64-32s_v4 (64 CPU, 504GB RAM, max 32 data disks)",
            //                                     "Standard_E64s_v4 (64 CPU, 504GB RAM, max 32 data disks)",
            //                                     "Standard_E2s_v5 (2 CPU, 16GB RAM, max 4 data disks)",
            //                                     "Standard_E4-2s_v5 (4 CPU, 32GB RAM, max 8 data disks)",
            //                                     "Standard_E4s_v5 (4 CPU, 32GB RAM, max 8 data disks)",
            //                                     "Standard_E8-2s_v5 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_E8-4s_v5 (8 CPU, 64GB RAM, max 32 data disks)",
            //                                     "Standard_E8s_v5 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_E16-4s_v5 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E16-8s_v5 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E16s_v5 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E20s_v5 (20 CPU, 160GB RAM, max 32 data disks)",
            //                                     "Standard_E32-8s_v5 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E32-16s_v5 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E32s_v5 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E48s_v5 (48 CPU, 384GB RAM, max 32 data disks)",
            //                                     "Standard_E64-16s_v5 (64 CPU, 512GB RAM, max 32 data disks)",
            //                                     "Standard_E64-32s_v5 (64 CPU, 512GB RAM, max 32 data disks)",
            //                                     "Standard_E64s_v5 (64 CPU, 512GB RAM, max 32 data disks)",
            //                                     "Standard_E96-24s_v5 (96 CPU, 672GB RAM, max 32 data disks)",
            //                                     "Standard_E96-48s_v5 (96 CPU, 672GB RAM, max 32 data disks)",
            //                                     "Standard_E96s_v5 (96 CPU, 672GB RAM, max 32 data disks)",
            //                                     "Standard_E2_v5 (2 CPU, 16GB RAM, max 4 data disks)",
            //                                     "Standard_E4_v5 (4 CPU, 32GB RAM, max 8 data disks)",
            //                                     "Standard_E8_v5 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_E16_v5 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E20_v5 (20 CPU, 160GB RAM, max 32 data disks)",
            //                                     "Standard_E32_v5 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E48_v5 (48 CPU, 384GB RAM, max 32 data disks)",
            //                                     "Standard_E64_v5 (64 CPU, 512GB RAM, max 32 data disks)",
            //                                     "Standard_E96_v5 (96 CPU, 672GB RAM, max 32 data disks)",
            //                                     "Standard_F2s_v2 (2 CPU, 4GB RAM, max 4 data disks)",
            //                                     "Standard_F4s_v2 (4 CPU, 8GB RAM, max 8 data disks)",
            //                                     "Standard_F8s_v2 (8 CPU, 16GB RAM, max 16 data disks)",
            //                                     "Standard_F16s_v2 (16 CPU, 32GB RAM, max 32 data disks)",
            //                                     "Standard_F32s_v2 (32 CPU, 64GB RAM, max 32 data disks)",
            //                                     "Standard_F48s_v2 (48 CPU, 96GB RAM, max 32 data disks)",
            //                                     "Standard_F64s_v2 (64 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_F72s_v2 (72 CPU, 144GB RAM, max 32 data disks)",
            //                                     "Standard_E2bs_v5 (2 CPU, 16GB RAM, max 4 data disks)",
            //                                     "Standard_E4bs_v5 (4 CPU, 32GB RAM, max 8 data disks)",
            //                                     "Standard_E8bs_v5 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_E16bs_v5 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E32bs_v5 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E48bs_v5 (48 CPU, 384GB RAM, max 32 data disks)",
            //                                     "Standard_E64bs_v5 (64 CPU, 512GB RAM, max 32 data disks)",
            //                                     "Standard_E2bds_v5 (2 CPU, 16GB RAM, max 4 data disks)",
            //                                     "Standard_E4bds_v5 (4 CPU, 32GB RAM, max 8 data disks)",
            //                                     "Standard_E8bds_v5 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_E16bds_v5 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E32bds_v5 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E48bds_v5 (48 CPU, 384GB RAM, max 32 data disks)",
            //                                     "Standard_E64bds_v5 (64 CPU, 512GB RAM, max 32 data disks)",
            //                                     "Standard_A2 (2 CPU, 3GB RAM, max 4 data disks)",
            //                                     "Standard_A3 (4 CPU, 7GB RAM, max 8 data disks)",
            //                                     "Standard_A5 (2 CPU, 14GB RAM, max 4 data disks)",
            //                                     "Standard_A4 (8 CPU, 14GB RAM, max 16 data disks)",
            //                                     "Standard_A6 (4 CPU, 28GB RAM, max 8 data disks)",
            //                                     "Standard_A7 (8 CPU, 56GB RAM, max 16 data disks)",
            //                                     "Basic_A0 (1 CPU, 0GB RAM, max 1 data disks)",
            //                                     "Basic_A1 (1 CPU, 1GB RAM, max 2 data disks)",
            //                                     "Basic_A2 (2 CPU, 3GB RAM, max 4 data disks)",
            //                                     "Basic_A3 (4 CPU, 7GB RAM, max 8 data disks)",
            //                                     "Basic_A4 (8 CPU, 14GB RAM, max 16 data disks)",
            //                                     "Standard_D1 (1 CPU, 3GB RAM, max 4 data disks)",
            //                                     "Standard_D2 (2 CPU, 7GB RAM, max 8 data disks)",
            //                                     "Standard_D3 (4 CPU, 14GB RAM, max 16 data disks)",
            //                                     "Standard_D4 (8 CPU, 28GB RAM, max 32 data disks)",
            //                                     "Standard_D11 (2 CPU, 14GB RAM, max 8 data disks)",
            //                                     "Standard_D12 (4 CPU, 28GB RAM, max 16 data disks)",
            //                                     "Standard_D13 (8 CPU, 56GB RAM, max 32 data disks)",
            //                                     "Standard_D14 (16 CPU, 112GB RAM, max 64 data disks)",
            //                                     "Standard_DS1 (1 CPU, 3GB RAM, max 4 data disks)",
            //                                     "Standard_DS2 (2 CPU, 7GB RAM, max 8 data disks)",
            //                                     "Standard_DS3 (4 CPU, 14GB RAM, max 16 data disks)",
            //                                     "Standard_DS4 (8 CPU, 28GB RAM, max 32 data disks)",
            //                                     "Standard_DS11 (2 CPU, 14GB RAM, max 8 data disks)",
            //                                     "Standard_DS12 (4 CPU, 28GB RAM, max 16 data disks)",
            //                                     "Standard_DS13 (8 CPU, 56GB RAM, max 32 data disks)",
            //                                     "Standard_DS14 (16 CPU, 112GB RAM, max 64 data disks)",
            //                                     "Standard_HB120-16rs_v2 (120 CPU, 456GB RAM, max 32 data disks)",
            //                                     "Standard_HB120-32rs_v2 (120 CPU, 456GB RAM, max 32 data disks)",
            //                                     "Standard_HB120-64rs_v2 (120 CPU, 456GB RAM, max 32 data disks)",
            //                                     "Standard_HB120-96rs_v2 (120 CPU, 456GB RAM, max 32 data disks)",
            //                                     "Standard_HB120rs_v2 (120 CPU, 456GB RAM, max 32 data disks)",
            //                                     "Standard_M32ms_v2 (32 CPU, 875GB RAM, max 32 data disks)",
            //                                     "Standard_M64ms_v2 (64 CPU, 1792GB RAM, max 64 data disks)",
            //                                     "Standard_M64s_v2 (64 CPU, 1024GB RAM, max 64 data disks)",
            //                                     "Standard_M128ms_v2 (128 CPU, 3892GB RAM, max 64 data disks)",
            //                                     "Standard_M128s_v2 (128 CPU, 2048GB RAM, max 64 data disks)",
            //                                     "Standard_M32dms_v2 (32 CPU, 875GB RAM, max 32 data disks)",
            //                                     "Standard_M64dms_v2 (64 CPU, 1792GB RAM, max 64 data disks)",
            //                                     "Standard_M64ds_v2 (64 CPU, 1024GB RAM, max 64 data disks)",
            //                                     "Standard_M128dms_v2 (128 CPU, 3892GB RAM, max 64 data disks)",
            //                                     "Standard_M128ds_v2 (128 CPU, 2048GB RAM, max 64 data disks)",
            //                                     "Standard_PB6s (6 CPU, 112GB RAM, max 12 data disks)",
            //                                     "Standard_M208ms_v2 (208 CPU, 5700GB RAM, max 64 data disks)",
            //                                     "Standard_M208s_v2 (208 CPU, 2850GB RAM, max 64 data disks)",
            //                                     "Standard_M416-208s_v2 (416 CPU, 5700GB RAM, max 64 data disks)",
            //                                     "Standard_M416s_v2 (416 CPU, 5700GB RAM, max 64 data disks)",
            //                                     "Standard_M416-208ms_v2 (416 CPU, 11400GB RAM, max 64 data disks)",
            //                                     "Standard_M416ms_v2 (416 CPU, 11400GB RAM, max 64 data disks)",
            //                                     "Standard_L8as_v3 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_L16as_v3 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_L32as_v3 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_L48as_v3 (48 CPU, 384GB RAM, max 32 data disks)",
            //                                     "Standard_L64as_v3 (64 CPU, 512GB RAM, max 32 data disks)",
            //                                     "Standard_L80as_v3 (80 CPU, 640GB RAM, max 32 data disks)",
            //                                     "Standard_D2a_v4 (2 CPU, 8GB RAM, max 4 data disks)",
            //                                     "Standard_D4a_v4 (4 CPU, 16GB RAM, max 8 data disks)",
            //                                     "Standard_D8a_v4 (8 CPU, 32GB RAM, max 16 data disks)",
            //                                     "Standard_D16a_v4 (16 CPU, 64GB RAM, max 32 data disks)",
            //                                     "Standard_D32a_v4 (32 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_D48a_v4 (48 CPU, 192GB RAM, max 32 data disks)",
            //                                     "Standard_D64a_v4 (64 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_D96a_v4 (96 CPU, 384GB RAM, max 32 data disks)",
            //                                     "Standard_D2as_v4 (2 CPU, 8GB RAM, max 4 data disks)",
            //                                     "Standard_D4as_v4 (4 CPU, 16GB RAM, max 8 data disks)",
            //                                     "Standard_D8as_v4 (8 CPU, 32GB RAM, max 16 data disks)",
            //                                     "Standard_D16as_v4 (16 CPU, 64GB RAM, max 32 data disks)",
            //                                     "Standard_D32as_v4 (32 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_D48as_v4 (48 CPU, 192GB RAM, max 32 data disks)",
            //                                     "Standard_D64as_v4 (64 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_D96as_v4 (96 CPU, 384GB RAM, max 32 data disks)",
            //                                     "Standard_E2a_v4 (2 CPU, 16GB RAM, max 4 data disks)",
            //                                     "Standard_E4a_v4 (4 CPU, 32GB RAM, max 8 data disks)",
            //                                     "Standard_E8a_v4 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_E16a_v4 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E20a_v4 (20 CPU, 160GB RAM, max 32 data disks)",
            //                                     "Standard_E32a_v4 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E48a_v4 (48 CPU, 384GB RAM, max 32 data disks)",
            //                                     "Standard_E64a_v4 (64 CPU, 512GB RAM, max 32 data disks)",
            //                                     "Standard_E96a_v4 (96 CPU, 672GB RAM, max 32 data disks)",
            //                                     "Standard_E2as_v4 (2 CPU, 16GB RAM, max 4 data disks)",
            //                                     "Standard_E4-2as_v4 (4 CPU, 32GB RAM, max 8 data disks)",
            //                                     "Standard_E4as_v4 (4 CPU, 32GB RAM, max 8 data disks)",
            //                                     "Standard_E8-2as_v4 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_E8-4as_v4 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_E8as_v4 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_E16-4as_v4 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E16-8as_v4 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E16as_v4 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E20as_v4 (20 CPU, 160GB RAM, max 32 data disks)",
            //                                     "Standard_E32-8as_v4 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E32-16as_v4 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E32as_v4 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E48as_v4 (48 CPU, 384GB RAM, max 32 data disks)",
            //                                     "Standard_E64-16as_v4 (64 CPU, 512GB RAM, max 32 data disks)",
            //                                     "Standard_E64-32as_v4 (64 CPU, 512GB RAM, max 32 data disks)",
            //                                     "Standard_E64as_v4 (64 CPU, 512GB RAM, max 32 data disks)",
            //                                     "Standard_E96-24as_v4 (96 CPU, 672GB RAM, max 32 data disks)",
            //                                     "Standard_E96-48as_v4 (96 CPU, 672GB RAM, max 32 data disks)",
            //                                     "Standard_E96as_v4 (96 CPU, 672GB RAM, max 32 data disks)",
            //                                     "Standard_D2as_v5 (2 CPU, 8GB RAM, max 4 data disks)",
            //                                     "Standard_D4as_v5 (4 CPU, 16GB RAM, max 8 data disks)",
            //                                     "Standard_D8as_v5 (8 CPU, 32GB RAM, max 16 data disks)",
            //                                     "Standard_D16as_v5 (16 CPU, 64GB RAM, max 32 data disks)",
            //                                     "Standard_D32as_v5 (32 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_D48as_v5 (48 CPU, 192GB RAM, max 32 data disks)",
            //                                     "Standard_D64as_v5 (64 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_D96as_v5 (96 CPU, 384GB RAM, max 32 data disks)",
            //                                     "Standard_E2as_v5 (2 CPU, 16GB RAM, max 4 data disks)",
            //                                     "Standard_E4-2as_v5 (4 CPU, 32GB RAM, max 8 data disks)",
            //                                     "Standard_E4as_v5 (4 CPU, 32GB RAM, max 8 data disks)",
            //                                     "Standard_E8-2as_v5 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_E8-4as_v5 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_E8as_v5 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_E16-4as_v5 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E16-8as_v5 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E16as_v5 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E20as_v5 (20 CPU, 160GB RAM, max 32 data disks)",
            //                                     "Standard_E32-8as_v5 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E32-16as_v5 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E32as_v5 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E48as_v5 (48 CPU, 384GB RAM, max 32 data disks)",
            //                                     "Standard_E64-16as_v5 (64 CPU, 512GB RAM, max 32 data disks)",
            //                                     "Standard_E64-32as_v5 (64 CPU, 512GB RAM, max 32 data disks)",
            //                                     "Standard_E64as_v5 (64 CPU, 512GB RAM, max 32 data disks)",
            //                                     "Standard_E96-24as_v5 (96 CPU, 672GB RAM, max 32 data disks)",
            //                                     "Standard_E96-48as_v5 (96 CPU, 672GB RAM, max 32 data disks)",
            //                                     "Standard_E96as_v5 (96 CPU, 672GB RAM, max 32 data disks)",
            //                                     "Standard_D2ads_v5 (2 CPU, 8GB RAM, max 4 data disks)",
            //                                     "Standard_D4ads_v5 (4 CPU, 16GB RAM, max 8 data disks)",
            //                                     "Standard_D8ads_v5 (8 CPU, 32GB RAM, max 16 data disks)",
            //                                     "Standard_D16ads_v5 (16 CPU, 64GB RAM, max 32 data disks)",
            //                                     "Standard_D32ads_v5 (32 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_D48ads_v5 (48 CPU, 192GB RAM, max 32 data disks)",
            //                                     "Standard_D64ads_v5 (64 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_D96ads_v5 (96 CPU, 384GB RAM, max 32 data disks)",
            //                                     "Standard_E2ads_v5 (2 CPU, 16GB RAM, max 4 data disks)",
            //                                     "Standard_E4-2ads_v5 (4 CPU, 32GB RAM, max 8 data disks)",
            //                                     "Standard_E4ads_v5 (4 CPU, 32GB RAM, max 8 data disks)",
            //                                     "Standard_E8-2ads_v5 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_E8-4ads_v5 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_E8ads_v5 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_E16-4ads_v5 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E16-8ads_v5 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E16ads_v5 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_E20ads_v5 (20 CPU, 160GB RAM, max 32 data disks)",
            //                                     "Standard_E32-8ads_v5 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E32-16ads_v5 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E32ads_v5 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_E48ads_v5 (48 CPU, 384GB RAM, max 32 data disks)",
            //                                     "Standard_E64-16ads_v5 (64 CPU, 512GB RAM, max 32 data disks)",
            //                                     "Standard_E64-32ads_v5 (64 CPU, 512GB RAM, max 32 data disks)",
            //                                     "Standard_E64ads_v5 (64 CPU, 512GB RAM, max 32 data disks)",
            //                                     "Standard_E96-24ads_v5 (96 CPU, 672GB RAM, max 32 data disks)",
            //                                     "Standard_E96-48ads_v5 (96 CPU, 672GB RAM, max 32 data disks)",
            //                                     "Standard_E96ads_v5 (96 CPU, 672GB RAM, max 32 data disks)",
            //                                     "Standard_HB60-15rs (60 CPU, 228GB RAM, max 4 data disks)",
            //                                     "Standard_HB60-30rs (60 CPU, 228GB RAM, max 4 data disks)",
            //                                     "Standard_HB60-45rs (60 CPU, 228GB RAM, max 4 data disks)",
            //                                     "Standard_HB60rs (60 CPU, 228GB RAM, max 4 data disks)",
            //                                     "Standard_HB120-16rs_v3 (120 CPU, 448GB RAM, max 32 data disks)",
            //                                     "Standard_HB120-32rs_v3 (120 CPU, 448GB RAM, max 32 data disks)",
            //                                     "Standard_HB120-64rs_v3 (120 CPU, 448GB RAM, max 32 data disks)",
            //                                     "Standard_HB120-96rs_v3 (120 CPU, 448GB RAM, max 32 data disks)",
            //                                     "Standard_HB120rs_v3 (120 CPU, 448GB RAM, max 32 data disks)",
            //                                     "Standard_L8s_v3 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_L16s_v3 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_L32s_v3 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_L48s_v3 (48 CPU, 384GB RAM, max 32 data disks)",
            //                                     "Standard_L64s_v3 (64 CPU, 512GB RAM, max 32 data disks)",
            //                                     "Standard_L80s_v3 (80 CPU, 640GB RAM, max 32 data disks)",
            //                                     "Standard_D2plds_v5 (2 CPU, 4GB RAM, max 4 data disks)",
            //                                     "Standard_D4plds_v5 (4 CPU, 8GB RAM, max 8 data disks)",
            //                                     "Standard_D8plds_v5 (8 CPU, 16GB RAM, max 16 data disks)",
            //                                     "Standard_D16plds_v5 (16 CPU, 32GB RAM, max 32 data disks)",
            //                                     "Standard_D32plds_v5 (32 CPU, 64GB RAM, max 32 data disks)",
            //                                     "Standard_D48plds_v5 (48 CPU, 96GB RAM, max 32 data disks)",
            //                                     "Standard_D64plds_v5 (64 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_D2pls_v5 (2 CPU, 4GB RAM, max 4 data disks)",
            //                                     "Standard_D4pls_v5 (4 CPU, 8GB RAM, max 8 data disks)",
            //                                     "Standard_D8pls_v5 (8 CPU, 16GB RAM, max 16 data disks)",
            //                                     "Standard_D16pls_v5 (16 CPU, 32GB RAM, max 32 data disks)",
            //                                     "Standard_D32pls_v5 (32 CPU, 64GB RAM, max 32 data disks)",
            //                                     "Standard_D48pls_v5 (48 CPU, 96GB RAM, max 32 data disks)",
            //                                     "Standard_D64pls_v5 (64 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_NV6s_v2 (6 CPU, 112GB RAM, max 12 data disks)",
            //                                     "Standard_NV12s_v2 (12 CPU, 224GB RAM, max 24 data disks)",
            //                                     "Standard_NV24s_v2 (24 CPU, 448GB RAM, max 32 data disks)",
            //                                     "Standard_NV12s_v3 (12 CPU, 112GB RAM, max 12 data disks)",
            //                                     "Standard_NV24s_v3 (24 CPU, 224GB RAM, max 24 data disks)",
            //                                     "Standard_NV48s_v3 (48 CPU, 448GB RAM, max 32 data disks)",
            //                                     "Standard_L8s_v2 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_L16s_v2 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_L32s_v2 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_L48s_v2 (48 CPU, 384GB RAM, max 32 data disks)",
            //                                     "Standard_L64s_v2 (64 CPU, 512GB RAM, max 32 data disks)",
            //                                     "Standard_L80s_v2 (80 CPU, 640GB RAM, max 32 data disks)",
            //                                     "Standard_NV4as_v4 (4 CPU, 14GB RAM, max 8 data disks)",
            //                                     "Standard_NV8as_v4 (8 CPU, 28GB RAM, max 16 data disks)",
            //                                     "Standard_NV16as_v4 (16 CPU, 56GB RAM, max 32 data disks)",
            //                                     "Standard_NV32as_v4 (32 CPU, 112GB RAM, max 32 data disks)",
            //                                     "Standard_G1 (2 CPU, 28GB RAM, max 8 data disks)",
            //                                     "Standard_G2 (4 CPU, 56GB RAM, max 16 data disks)",
            //                                     "Standard_G3 (8 CPU, 112GB RAM, max 32 data disks)",
            //                                     "Standard_G4 (16 CPU, 224GB RAM, max 64 data disks)",
            //                                     "Standard_G5 (32 CPU, 448GB RAM, max 64 data disks)",
            //                                     "Standard_GS1 (2 CPU, 28GB RAM, max 8 data disks)",
            //                                     "Standard_GS2 (4 CPU, 56GB RAM, max 16 data disks)",
            //                                     "Standard_GS3 (8 CPU, 112GB RAM, max 32 data disks)",
            //                                     "Standard_GS4 (16 CPU, 224GB RAM, max 64 data disks)",
            //                                     "Standard_GS4-4 (16 CPU, 224GB RAM, max 64 data disks)",
            //                                     "Standard_GS4-8 (16 CPU, 224GB RAM, max 64 data disks)",
            //                                     "Standard_GS5 (32 CPU, 448GB RAM, max 64 data disks)",
            //                                     "Standard_GS5-8 (32 CPU, 448GB RAM, max 64 data disks)",
            //                                     "Standard_GS5-16 (32 CPU, 448GB RAM, max 64 data disks)",
            //                                     "Standard_L4s (4 CPU, 32GB RAM, max 16 data disks)",
            //                                     "Standard_L8s (8 CPU, 64GB RAM, max 32 data disks)",
            //                                     "Standard_L16s (16 CPU, 128GB RAM, max 64 data disks)",
            //                                     "Standard_L32s (32 CPU, 256GB RAM, max 64 data disks)",
            //                                     "Standard_NV6ads_A10_v5 (6 CPU, 55GB RAM, max 4 data disks)",
            //                                     "Standard_NV12ads_A10_v5 (12 CPU, 110GB RAM, max 8 data disks)",
            //                                     "Standard_NV18ads_A10_v5 (18 CPU, 220GB RAM, max 16 data disks)",
            //                                     "Standard_NV36adms_A10_v5 (36 CPU, 880GB RAM, max 32 data disks)",
            //                                     "Standard_NV36ads_A10_v5 (36 CPU, 440GB RAM, max 32 data disks)",
            //                                     "Standard_NV72ads_A10_v5 (72 CPU, 880GB RAM, max 32 data disks)",
            //                                     "Standard_ND6s (6 CPU, 112GB RAM, max 12 data disks)",
            //                                     "Standard_ND12s (12 CPU, 224GB RAM, max 24 data disks)",
            //                                     "Standard_ND24rs (24 CPU, 448GB RAM, max 32 data disks)",
            //                                     "Standard_ND24s (24 CPU, 448GB RAM, max 32 data disks)",
            //                                     "Standard_DC8_v2 (8 CPU, 32GB RAM, max 8 data disks)",
            //                                     "Standard_DC1s_v2 (1 CPU, 4GB RAM, max 1 data disks)",
            //                                     "Standard_DC2s_v2 (2 CPU, 8GB RAM, max 2 data disks)",
            //                                     "Standard_DC4s_v2 (4 CPU, 16GB RAM, max 4 data disks)",
            //                                     "Standard_ND40rs_v2 (40 CPU, 672GB RAM, max 8 data disks)",
            //                                     "Standard_HC44-16rs (44 CPU, 352GB RAM, max 4 data disks)",
            //                                     "Standard_HC44-32rs (44 CPU, 352GB RAM, max 4 data disks)",
            //                                     "Standard_HC44rs (44 CPU, 352GB RAM, max 4 data disks)",
            //                                     "Standard_DC2s (2 CPU, 8GB RAM, max 2 data disks)",
            //                                     "Standard_DC4s (4 CPU, 16GB RAM, max 4 data disks)",
            //                                     "Standard_FX4mds (4 CPU, 84GB RAM, max 8 data disks)",
            //                                     "Standard_FX12mds (12 CPU, 252GB RAM, max 24 data disks)",
            //                                     "Standard_FX24mds (24 CPU, 504GB RAM, max 32 data disks)",
            //                                     "Standard_FX36mds (36 CPU, 756GB RAM, max 32 data disks)",
            //                                     "Standard_FX48mds (48 CPU, 1008GB RAM, max 32 data disks)",
            //                                     "Standard_DC1s_v3 (1 CPU, 8GB RAM, max 4 data disks)",
            //                                     "Standard_DC2s_v3 (2 CPU, 16GB RAM, max 8 data disks)",
            //                                     "Standard_DC4s_v3 (4 CPU, 32GB RAM, max 16 data disks)",
            //                                     "Standard_DC8s_v3 (8 CPU, 64GB RAM, max 32 data disks)",
            //                                     "Standard_DC16s_v3 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_DC24s_v3 (24 CPU, 192GB RAM, max 32 data disks)",
            //                                     "Standard_DC32s_v3 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_DC48s_v3 (48 CPU, 384GB RAM, max 32 data disks)",
            //                                     "Standard_DC1ds_v3 (1 CPU, 8GB RAM, max 4 data disks)",
            //                                     "Standard_DC2ds_v3 (2 CPU, 16GB RAM, max 8 data disks)",
            //                                     "Standard_DC4ds_v3 (4 CPU, 32GB RAM, max 16 data disks)",
            //                                     "Standard_DC8ds_v3 (8 CPU, 64GB RAM, max 32 data disks)",
            //                                     "Standard_DC16ds_v3 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_DC24ds_v3 (24 CPU, 192GB RAM, max 32 data disks)",
            //                                     "Standard_DC32ds_v3 (32 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_DC48ds_v3 (48 CPU, 384GB RAM, max 32 data disks)",
            //                                     "Standard_DC2as_v5 (2 CPU, 8GB RAM, max 4 data disks)",
            //                                     "Standard_DC4as_v5 (4 CPU, 16GB RAM, max 8 data disks)",
            //                                     "Standard_DC8as_v5 (8 CPU, 32GB RAM, max 16 data disks)",
            //                                     "Standard_DC16as_v5 (16 CPU, 64GB RAM, max 32 data disks)",
            //                                     "Standard_DC32as_v5 (32 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_DC48as_v5 (48 CPU, 192GB RAM, max 32 data disks)",
            //                                     "Standard_DC64as_v5 (64 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_DC96as_v5 (96 CPU, 384GB RAM, max 32 data disks)",
            //                                     "Standard_DC2ads_v5 (2 CPU, 8GB RAM, max 4 data disks)",
            //                                     "Standard_DC4ads_v5 (4 CPU, 16GB RAM, max 8 data disks)",
            //                                     "Standard_DC8ads_v5 (8 CPU, 32GB RAM, max 16 data disks)",
            //                                     "Standard_DC16ads_v5 (16 CPU, 64GB RAM, max 32 data disks)",
            //                                     "Standard_DC32ads_v5 (32 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_DC48ads_v5 (48 CPU, 192GB RAM, max 32 data disks)",
            //                                     "Standard_DC64ads_v5 (64 CPU, 256GB RAM, max 32 data disks)",
            //                                     "Standard_DC96ads_v5 (96 CPU, 384GB RAM, max 32 data disks)",
            //                                     "Standard_EC2as_v5 (2 CPU, 16GB RAM, max 4 data disks)",
            //                                     "Standard_EC4as_v5 (4 CPU, 32GB RAM, max 8 data disks)",
            //                                     "Standard_EC8as_v5 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_EC16as_v5 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_EC20as_v5 (20 CPU, 160GB RAM, max 32 data disks)",
            //                                     "Standard_EC32as_v5 (32 CPU, 192GB RAM, max 32 data disks)",
            //                                     "Standard_EC48as_v5 (48 CPU, 384GB RAM, max 32 data disks)",
            //                                     "Standard_EC64as_v5 (64 CPU, 512GB RAM, max 32 data disks)",
            //                                     "Standard_EC96as_v5 (96 CPU, 672GB RAM, max 32 data disks)",
            //                                     "Standard_EC96ias_v5 (96 CPU, 672GB RAM, max 32 data disks)",
            //                                     "Standard_EC2ads_v5 (2 CPU, 16GB RAM, max 4 data disks)",
            //                                     "Standard_EC4ads_v5 (4 CPU, 32GB RAM, max 8 data disks)",
            //                                     "Standard_EC8ads_v5 (8 CPU, 64GB RAM, max 16 data disks)",
            //                                     "Standard_EC16ads_v5 (16 CPU, 128GB RAM, max 32 data disks)",
            //                                     "Standard_EC20ads_v5 (20 CPU, 160GB RAM, max 32 data disks)",
            //                                     "Standard_EC32ads_v5 (32 CPU, 192GB RAM, max 32 data disks)",
            //                                     "Standard_EC48ads_v5 (48 CPU, 384GB RAM, max 32 data disks)",
            //                                     "Standard_EC64ads_v5 (64 CPU, 512GB RAM, max 32 data disks)",
            //                                     "Standard_EC96ads_v5 (96 CPU, 672GB RAM, max 32 data disks)",
            //                                     "Standard_EC96iads_v5 (96 CPU, 672GB RAM, max 32 data disks)"
            //                                 ]
            //                             }
            //                         ]
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": null
            //             },
            //             {
            //                 "name": "set_breakpoint_state",
            //                 "plugin": "breakpoint",
            //                 "operation": "breakpoint_plugin.workflows.state.set_breakpoint_state",
            //                 "parameters": {
            //                     "node_ids": {
            //                         "default": [],
            //                         "description": "The list of node IDs to open breakpoint for.",
            //                         "type": "list"
            //                     },
            //                     "node_instance_ids": {
            //                         "default": [],
            //                         "description": "The list of node instance IDs to open breakpoint for.",
            //                         "type": "list"
            //                     },
            //                     "break_on_install": {
            //                         "default": false,
            //                         "description": "Specifies if the breakpoint should stop on start lifecycle operation.",
            //                         "type": "boolean"
            //                     },
            //                     "break_on_uninstall": {
            //                         "default": false,
            //                         "description": "Specifies if the breakpoint should stop on delete lifecycle operation.",
            //                         "type": "boolean"
            //                     },
            //                     "permanent": {
            //                         "default": false,
            //                         "description": "Specifies that this setting of the breakpoints is permanent. If false if will apply only to the next execution.",
            //                         "type": "boolean"
            //                     }
            //                 },
            //                 "is_cascading": false,
            //                 "is_available": true,
            //                 "availability_rules": null
            //             }
            //         ],
            //         "deployment_status": "requires_attention",
            //         "sub_services_status": "requires_attention",
            //         "sub_environments_status": null,
            //         "sub_services_count": 2,
            //         "sub_environments_count": 0,
            //         "display_name": "xa124ls401047",
            //         "latest_execution_finished_operations": 108,
            //         "latest_execution_total_operations": 147,
            //         "blueprint_id": "AZURE-RHEL-Single-VM-v9.5",
            //         "site_name": null,
            //         "latest_execution_status": "failed",
            //         "environment_type": "",
            //         "labels": [
            //             {
            //                 "key": "csys-consumer-id",
            //                 "value": "xa124ls401047-disk-0",
            //                 "created_at": "2023-03-06T06:59:19.871Z",
            //                 "creator_id": 21
            //             },
            //             {
            //                 "key": "csys-obj-parent",
            //                 "value": "a3286a7b-4ec9-44a7-9323-29bd2c1d883a",
            //                 "created_at": "2023-03-06T06:51:01.343Z",
            //                 "creator_id": 21
            //             },
            //             {
            //                 "key": "csys-obj-type",
            //                 "value": "service",
            //                 "created_at": "2023-03-06T06:51:01.343Z",
            //                 "creator_id": 21
            //             },
            //             {
            //                 "key": "obj-type",
            //                 "value": "terraform",
            //                 "created_at": "2023-03-06T06:51:01.343Z",
            //                 "creator_id": 21
            //             }
            //         ]
            //     }
            // ];


            return Promise.all(rawData);
        })
        .then(data => res.send(data))
        .catch(error => next(error));
});

r.register('get_vm_detailsData', 'GET', (req, res, next, helper) => {
    const _ = require('lodash');
    console.log('get_vm_detailsData...');
    const { headers } = req;
    const commonManagerRequestOptions = {
        headers: {
            tenant: headers.tenant,
            cookie: headers.cookie
        }
    };
    // parsing parametres:
    const params = { ...req.query };
    console.log(params);
    let _id = params.id;

    //return this.toolbox.getManager().doGet(`/executions/${id}?_include=parameters`);
    //https://cloudify-uat.dhl.com/console/sp/executions?_size=2&_offset=0&deployment_id=xa124ls410033&workflow_id=create_deployment_environment&deployment_id=xa124ls201053
    
    // let filterRules = [{"type":"label","key":"csys-obj-type","operator":"is_not","values" : ["environment"]},{"type": "label", "key":"csys-obj-parent", "operator": "any_of", "values" : ["xa12415401047"]}];
    // filterRules = [];

    let _includesReqestString = `/executions?_size=1&deployment_id=${_id}`;

    return helper.Manager.doGet(_includesReqestString, {
        ...commonManagerRequestOptions
    })
        .then(data => {
            rawData = data.items;
            return Promise.all(rawData);
        })
        .then(data => res.send(data))
        .catch(error => next(error));
});

r.register('get_vm_dataDiskData', 'GET', (req, res, next, helper) => {
    const _ = require('lodash');
    console.log('get_vm_dataDiskData...');
    const { headers } = req;
    const commonManagerRequestOptions = {
        headers: {
            tenant: headers.tenant,
            cookie: headers.cookie
        }
    };
    // parsing parametres:
    const params = { ...req.query };
    let _id = params.id;
    console.log(params);

   //TODO nastavit "values" : ["xa12415401047"]:
    //let filterRules = [{"type":"label","key":"csys-obj-type","operator":"is_not","values":["environment"]},{"type":"label","key":"csys-obj-parent","operator":"any_of","values":['xa12415401047']}];

    //{"filter_rules":[{"type":"label","key":"csys-obj-type","operator":"is_not","values":["environment"]},{"type":"label","key":"csys-obj-parent","operator":"any_of","values":["xa124ls401047"]}]}

    //filterRules = [{"type":"label","key":"csys-obj-type","operator":"is_not","values":["environment"]}]; //vraci 2 hodnoty

    //filterRules = [{"type":"label","key":"csys-obj-parent","operator":"any_of","values":["xa124ls401047"]}]; //vraci 1 hodnotu pro bleuprint id = azure
    let filterRules = [];
    let obj_filter = {"type":"label","key":"csys-obj-parent","operator":"any_of",values:[]};
    obj_filter.values.push(_id);
    filterRules.push(obj_filter);

    let outputData = [];

    return helper.Manager.doPost('/searches/deployments', {
        // params: {
        //     //_include: 'id,display_name,workflows,labels,site_name,blueprint_id,latest_execution_status,deployment_status,environment_type,latest_execution_total_operations,latest_execution_finished_operations,sub_services_count,sub_services_status,sub_environments_count,sub_environments_status',
        //     //_search:_searchParam
        // },
        body: { filter_rules: filterRules },
        ...commonManagerRequestOptions
    })
        .then(data => {

            //filter data disk + bluprint_id STARTSWITH 'AZURE-Data-Disk'
            data.items.forEach(element => {
                //console.log(element);
                if(element["blueprint_id"].indexOf("AZURE-Data-Disk")!=-1) {
                    outputData.push(element);
                }
                
            });
            return Promise.all(outputData);
        })
        .then(data => res.send(data))
        .catch(error => next(error));
});

r.register('get_vm_requestsData', 'GET', (req, res, next, helper) => {
    const _ = require('lodash');
    console.log('get_vm_requestsData...');
    const { headers } = req;
    const commonManagerRequestOptions = {
        headers: {
            tenant: headers.tenant,
            cookie: headers.cookie
        }
    };
    // parsing parametres:
    const params = { ...req.query };
    let _id = params.id;
    console.log(params);

    //{"filter_rules":[{"type":"label","key":"csys-obj-type","operator":"is_not","values":["environment"]},
   // {"type":"label","key":"csys-obj-parent","operator":"any_of","values":["xa124ls401047"]}]}

    //filterRules = [{"type":"label","key":"csys-obj-type","operator":"is_not","values":["environment"]}]; //vraci 2 hodnoty

    //filterRules = [{"type":"label","key":"csys-obj-parent","operator":"any_of","values":["xa124ls401047"]}]; //vraci 1 hodnotu pro bleuprint id = azure

    let filterRules = [];
    let obj_filter = {"type":"label","key":"csys-obj-parent","operator":"any_of",values:[]};
    obj_filter.values.push(_id);

    filterRules.push(obj_filter);

    let outputData = [];

    return helper.Manager.doPost('/searches/deployments', {
        // params: {

        // },
        body: { filter_rules: filterRules },
        ...commonManagerRequestOptions
    })
    .then(data => {
            //rawData = data.items;
            //console.log('get_vm_requestsData results:');
            //console.log("data:");
            //console.log(data);

            //mock data:

            // let fake_data= {requestsData: []};

            // fake_data.requestsData.push({id:params.id, account_name:"vik1@dhl.com", role:"admin", status:"Grant waiting for approval",requestor:"vik1@dhl.com"});
            // fake_data.requestsData.push({id:params.id, account_name:"vik2@dhl.com", role:"user", status:"Grant implemented",requestor:"vik1@dhl.com"});
            // fake_data.requestsData.push({id:params.id, account_name:"vik3@dhl.com", role:"admin", status:"Grant waiting for approval",requestor:"vik1@dhl.com"});
            // fake_data.requestsData.push({id:params.id, account_name:"vik4@dhl.com", role:"admin", status:"Revocation approved",requestor:"vik1@dhl.com"});
            // fake_data.requestsData.push({id:params.id, account_name:"vik5@dhl.com", role:"admin", status:"Grant approved",requestor:"vik1@dhl.com"});
            // fake_data.requestsData.push({id:params.id, account_name:"vik6@dhl.com", role:"admin", status:"Grant waiting for approval",requestor:"vik1@dhl.com"});
            // fake_data.requestsData.push({id:params.id, account_name:"vik7@dhl.com", role:"user", status:"Grant approved",requestor:"vik1@dhl.com"});
            // fake_data.requestsData.push({id:params.id, account_name:"vik8@dhl.com", role:"admin", status:"GGrant implemented",requestor:"vik1@dhl.com"});

            //console.log(fake_data);
            //console.log(fake_data.requestsData);


            //console.log(spireDeployments);

            data.items.forEach(element => {
                //console.log(element);
                if(element["blueprint_id"].indexOf("CyberArk-Account")!=-1) {
                    element.filterRules = filterRules;
                    outputData.push(element);
                }
            });

            return Promise.all(outputData);

        })
        .then(data => res.send(data))
        .catch(error => next(error));

    //Executions:
    // let _includesReqestString = "/executions?_size=1&deployment_id="+_id;

    // return helper.Manager.doGet(_includesReqestString, {
    //     ...commonManagerRequestOptions
    // })
    //     .then(data => {
    //         rawData = data.items;
    //         return Promise.all(rawData);
    //     })
    //     .then(data => res.send(data))
    //     .catch(error => next(error));

});

r.register('get_vm_pam_request_executions', 'GET', (req, res, next, helper) => {
    const _ = require('lodash');
    console.log('get_vm_detailsData...');
    const { headers } = req;
    const commonManagerRequestOptions = {
        headers: {
            tenant: headers.tenant,
            cookie: headers.cookie
        }
    };
    // parsing parametres:
    const params = { ...req.query };
    console.log(params);
    let _id = params.id;

    let _includesReqestString = `/executions?deployment_id=${_id}`; //pokus
    //https://cloudify-uat.dhl.com/console/sp/executions?_sort=-created_at&_size=5&_offset=0&deployment_id=xa124ls201046-sadminbu-zdenek.suchel&_include_system_workflows=false
    return helper.Manager.doGet(_includesReqestString, {
        ...commonManagerRequestOptions
    })
        .then(data => {
            rawData = data.items;

            //TODO: najit nejmladsi zaznam pro typ zaznamu "create_...envirnoment???" a kdo je creator, ten je pak Requestor pro zobrazeni...


            return Promise.all(rawData);
        })
        .then(data => res.send(data))
        .catch(error => next(error));
});

}