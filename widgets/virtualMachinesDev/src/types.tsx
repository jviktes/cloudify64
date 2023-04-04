export type Tests = {
    requestor: string;
    id:string;
    fileName: string;
    virtualMachine:string;
    class: string;
    code:  string; 
    testDatum:string;
    passedTestsCount:string;
    failedTestsCount:string;
    testResultSummary:string;
    deployment_id: string;
    deployment_name: string;
    testResultArray: TestResult;
};

export type TestResult = {
    actual_value: string;
    class: string;
    code:  string; 
    description:  string;
    expected_value:  string;
    name:  string;
    result:  string;
};

