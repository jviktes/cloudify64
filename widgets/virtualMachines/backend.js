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
            //       