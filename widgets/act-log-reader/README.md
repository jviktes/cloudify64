# Automated Configuration Tests (ACT)

Displays the ACT logs and results of all the tests in the current tenant, according to the user’s permissions.

You can sort logs by Time date (default), Virtual machine, Test class, Resuts, number of Passed or Failed tests.
You can also see details of each ACT test.

## Settings

* Folder to logs:

opt/manager/resources/archive/<tentant-ID>  

* Log file structure (JSON string): 
{ 
    "requestor": "Email / UPN of requestor", 
    "deployment_id": "ID of deployment", 
    "deployment_name": "Name of deployment", 
    "results": [ 
        {         
            "actual_value": "Actual configuration value (if applicable)", 
            "class": "ACT class: [OAT|CIS]", 
            "code": "Unique code of the test within the class", 
            "description": "Brief description of the test.", 
            "expected_value": "Expected configuration value (if applicable)", 
            "name": "Name of the test", 
            "result": "Test result: [PASSED|FAILED]" 
        } 
    ] 
} 
