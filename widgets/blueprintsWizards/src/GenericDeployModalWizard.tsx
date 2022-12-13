import { AccordionTitleProps, CheckboxProps } from 'semantic-ui-react';
import React, { SyntheticEvent } from 'react';
import FileActions from '../../common/src/actions/FileActions';//'../actions/FileActions';
import BlueprintActions, { FullBlueprintData } from '../../common/src/blueprints/BlueprintActions';
//import DynamicDropdown from '../../common/src/components/DynamicDropdown';
import Consts from '../../common/src/Consts';
//import LabelsInput from '../../common/src/labels/LabelsInput';
import MissingSecretsError from '../../common/src/secrets/MissingSecretsError';
//import AccordionSectionWithDivider from '../../common/src/components/accordion/AccordionSectionWithDivider';
//import DeploymentInputs from './DeploymentInputsWizard';
import DeployModalActions, { Buttons as ApproveButtons } from '../../common/src/deployModal/DeployModalActions';
//import { ExecuteWorkflowInputs, executeWorkflow } from '../../common/src/executeWorkflow';
import { executeWorkflow } from '../../common/src/executeWorkflow';
import type {
    BaseWorkflowInputs,
    UserWorkflowInputsState,
    Workflow,
    WorkflowParameters,
    WorkflowOptions
} from '../../common/src/executeWorkflow';
import type { DropdownValue, Field } from '../../common/src/types';
import type { BlueprintDeployParams } from '../../common/src/blueprints/BlueprintActions';
import type { Label } from '.../../../widgets/common/src/labels/types';
import getInputFieldInitialValue from '../../common/src/inputs/utils/getInputFieldInitialValue';
import getUpdatedInputs from '../../common/src/inputs/utils/getUpdatedInputs';
import getInputsMap from '../../common/src/inputs/utils/getInputsMap';
import getInputsInitialValues from '../../common/src/inputs/utils/getInputsInitialValues';
import { addErrors } from '../../common/src/inputs/utils/errors';
import getInputsWithoutValues from '../../common/src/inputs/utils/getInputsWithoutValues';
import type { FilterRule } from '../../common/src/filters/types';

//import { capitalize, chain, filter, lowerCase, map, sortBy, size } from 'lodash';
import {sortBy} from 'lodash';

import GeneralStep from './wizardSteps/GeneralStep';
import ClusteringStep from './wizardSteps/ClusteringStep';
import GSNStep from './wizardSteps/GSNStep';
import SWConfigStep from './wizardSteps/SWConfigStep';
import VMConfigStep from './wizardSteps/VMConfigStep';
//import getDeploymentInputsByCategories from './wizardUtils';

import GSNBusinessServiceProps from './GSNBusinessService';

//import GSNCountries from './GSNCountries';

const { i18n } = Stage;
const t = Stage.Utils.getT('widgets.common.deployments.deployModal');

const GSN_BUSINESS_SERVICES_CASH = "GSN_BUSINESS_SERVICES_CASH";
const GSN_COUNTRIES_CASH = "countries";
const REFRESHING_CASH_PERIOD_MINUTES = 5;

type Blueprint = {
    description?: string;
    imports?: string[];
    inputs?: Record<string, any>;
    // eslint-disable-next-line camelcase
    node_templates?: Record<string, any>;
    // eslint-disable-next-line camelcase
    tosca_definitions_version?: string;
};

type Errors = Record<string, string>;

type ExecuteStep = (
    deploymentIdOrPreviousStepOutcome: string | any,
    deploymentParameters: BlueprintDeployParams,
    installWorkflowParameters?: WorkflowParameters,
    installWorkflowOptions?: WorkflowOptions
) => void;

type StepsProp = {
    message?: string;
    executeStep: ExecuteStep;
};

type GenericDeployModalProps = {
    /**
     * specifies whether the deploy modal is displayed
     */
    open: boolean;

    /**
     * Toolbox object
     */
    toolbox: Stage.Types.Toolbox;

    /**
     * blueprintId, if set then Blueprint selection dropdown is not displayed
     */
    blueprintId?: string;

    /**
     * function to be called when the modal is closed
     */
    onHide: () => void;

    i18nHeaderKey: string;

    /**
     * Whether to show deployment name input
     */
    showDeploymentNameInput?: boolean;

    /**
     * Whether to show deployment ID input
     */
    showDeploymentIdInput?: boolean;

    /**
     * Whether to show 'Deploy' button, if not set only 'Deploy & Install' button is shown
     */
    showDeployButton: boolean;

    /**
     * Whether to show install workflow options (force, dry run, queue, schedule)
     */
    showInstallOptions?: boolean;

    /**
     * Whether to show site selection input
     */
    showSitesInput?: boolean;

    /**
     * Steps to be executed on 'Deploy' button press, needs to be specified only when `showDeployButton` is enabled
     */
    deploySteps: StepsProp[];

    /**
     * Message to be displayed during inputs validation, before steps defined by `deploySteps` are executed, needs to be
     * specified only when `showDeployButton` is enabled
     */
    deployValidationMessage: string;

    /**
     * Steps to be executed on 'Deploy & Install' button press
     */
    deployAndInstallSteps: StepsProp[];

    /**
     * Message to be displayed during inputs validation, before steps defined by `deployAndInstallSteps` are executed
     */
    deployAndInstallValidationMessage: string;

    /**
     * Deployment Name input label
     */
    deploymentNameLabel?: string;

    /**
     * Deployment Name input help description
     */
    deploymentNameHelp?: string;

    /**
     * Filter rules for blueprints listing
     */
    blueprintFilterRules?: FilterRule[];
};

const defaultProps: Partial<GenericDeployModalProps> = {
    blueprintId: '',
    onHide: _.noop,
    showDeploymentNameInput: false,
    showDeploymentIdInput: false,
    showDeployButton: false,
    showInstallOptions: false,
    showSitesInput: false,
    deploySteps: [],
    deployValidationMessage: '',
    deployAndInstallValidationMessage: '',
    deploymentNameLabel: t('inputs.deploymentName.label'),
    deploymentNameHelp: t('inputs.deploymentName.help'),
    blueprintFilterRules: []
};

const EmptyComponent = () => {
    return <div></div>
  }

const stepsDefinition = [
    
    { key: 'GeneralStep', label: 'General', isDone: true, component: EmptyComponent },//1
    { key: 'ClusteringStep', label: 'Availability settings', isDone: false, component: EmptyComponent },//2
    { key: 'SWConfigStep', label: 'SW configuration', isDone: false, component: EmptyComponent },//3
    { key: 'VMConfigStep', label: 'VM configuration', isDone: false, component: EmptyComponent }, //4   
    { key: 'GSNStep', label: 'GSN', isDone: false, component: EmptyComponent },//5
    ]

type GenericDeployModalState = {
    activeSection: any;
    areSecretsMissing: boolean;
    blueprint: any;
    gsnData:any;
    gsnCountries:any;
    gsnRegions:any;
    deploymentId: string;
    deploymentInputs: Record<string, unknown>;
    deploymentName: string;
    errors: Errors;
    fileLoading: boolean;
    labels: Label[];
    loading: boolean;
    loadingMessage: string;
    runtimeOnlyEvaluation: boolean;
    siteName: string;
    skipPluginsValidation: boolean;
    visibility: any;
    installWorkflow: Workflow;
    baseInstallWorkflowParams: BaseWorkflowInputs;
    userInstallWorkflowParams: UserWorkflowInputsState;
    force: boolean;
    dryRun: boolean;
    queue: boolean;
    schedule: boolean;
    scheduledTime: string;
    selectedApproveButton: ApproveButtons;
    steps: WizardState[],
    activeStep: WizardState,
    showDeployModalActions: boolean,
    disableNextButton: boolean,
};

// type ContryData = {
//     countryName:string,
//     //countryData: string
// }

type WizardState = {
    key: string, 
    label: string, 
    isDone: boolean, 
    component: any,
}

class GenericDeployModal extends React.Component<GenericDeployModalProps, GenericDeployModalState> {
    // eslint-disable-next-line react/static-property-placement
    static defaultProps = defaultProps;

    static EMPTY_BLUEPRINT = { id: '', plan: { inputs: {}, workflows: { install: {} } } };

    static DEPLOYMENT_SECTIONS = {
        deploymentInputs: 0,
        deploymentMetadata: 1,
        executionParameters: 2,
        advanced: 3,
        install: 4
    };

    static initialInstallWorkflow: Workflow = {
        ...GenericDeployModal.EMPTY_BLUEPRINT.plan.workflows.install,
        name: 'install',
        parameters: {},
        plugin: '',
        is_available: true
    };

    static initialState = {
        blueprint: GenericDeployModal.EMPTY_BLUEPRINT,
        gsnData:{result: PropTypes.arrayOf(GSNBusinessServiceProps)},
        gsnCountries:{},
        gsnRegions:{},
        deploymentInputs: {},
        deploymentName: '',
        errors: {},
        areSecretsMissing: false,
        fileLoading: false,
        loading: false,
        loadingMessage: '',
        runtimeOnlyEvaluation: false,
        siteName: '',
        skipPluginsValidation: false,
        visibility: Consts.defaultVisibility,
        installWorkflow: GenericDeployModal.initialInstallWorkflow,
        activeSection: 0,
        deploymentId: '',
        labels: [],
        baseInstallWorkflowParams: {},
        userInstallWorkflowParams: {},
        force: false,
        dryRun: false,
        queue: false,
        schedule: false,
        scheduledTime: '',
        selectedApproveButton: ApproveButtons.install,
        steps:stepsDefinition,
        activeStep: { key: 'GeneralStep', label: 'General', isDone: true, component: EmptyComponent },
        //activeStep: { key: 'GSNStep', label: 'GSN', isDone: false, component: EmptyComponent },
        //activeStep: { key: 'VMConfigStep', label: 'VM configuration', isDone: false, component: EmptyComponent },
        showDeployModalActions: false,
        disableNextButton: false,
    };

    constructor(props: GenericDeployModalProps) {
        super(props);

        this.state = GenericDeployModal.initialState;

        this.selectBlueprint = this.selectBlueprint.bind(this);

        this.handleDeploymentInputChange = this.handleDeploymentInputChange.bind(this);
        this.handleYamlFileChange = this.handleYamlFileChange.bind(this);
        this.handleExecuteInputChange = this.handleExecuteInputChange.bind(this);

        this.onCancel = this.onCancel.bind(this);
        this.onDeploy = this.onDeploy.bind(this);
        this.onDeployAndInstall = this.onDeployAndInstall.bind(this);

        this.onAccordionClick = this.onAccordionClick.bind(this);
        this.onErrorsDismiss = this.onErrorsDismiss.bind(this);

        this.onForceChange = this.onForceChange.bind(this);
        this.onDryRunChange = this.onDryRunChange.bind(this);
        this.onQueueChange = this.onQueueChange.bind(this);
        this.onScheduleChange = this.onScheduleChange.bind(this);
        this.onScheduledTimeChange = this.onScheduledTimeChange.bind(this);
    }

    componentDidMount() {
        const { installWorkflow } = this.state;
        this.setState({
            baseInstallWorkflowParams: installWorkflow.parameters,
            userInstallWorkflowParams: _.mapValues(installWorkflow.parameters, parameterData =>
                getInputFieldInitialValue(parameterData.default, parameterData.type)
            )
        });
        const { toolbox } = this.props;
        toolbox.getEventBus().on('blueprint:setDeploymentIputs', this.setDeploymentIputs, this);
        toolbox.getEventBus().on('blueprint:dataDiskValidateError', this.DisableNextButtonFunc, this);
        toolbox.getEventBus().on('blueprint:dataDiskValidateOK', this.EnableNextButtonFunc,this);
        this.setState({disableNextButton:false});
    }

    DisableNextButtonFunc() {
        console.log("DisableNextButtonFunc...");
        this.setState({ disableNextButton: true });
        
    }

    EnableNextButtonFunc() {
        console.log("EnableNextButtonFunc...");
        this.setState({ disableNextButton: false });
    }

    setDeploymentIputs(fieldName: string,fieldNameValue: string) {
        console.log("setDeploymentIputs:"+fieldName + ";"+fieldNameValue);
        const { deploymentInputs } = this.state;
        deploymentInputs[fieldName] = fieldNameValue;

        //pokud je vybrana Afrika, vyberu vsechny africke staty
        if (fieldName=="impacted_region") {
            let _selectedCountries = deploymentInputs["impacted_country"];
            let _selectedRegions = JSON.parse(String(deploymentInputs["impacted_region"]));
            let _updatedCountries = [];
            const { gsnCountries } = this.state;
            //const { gsnRegions } = this.state;
            console.log(_selectedCountries);
            console.log(deploymentInputs["impacted_region"])

            for (const key in gsnCountries) {
                
                    const _country = gsnCountries[key];
                    if (_selectedRegions.includes(_country.countryData.region_code)==true) {
                        if (_country.countryName) {
                            _updatedCountries.push(_country.countryName);
                        }
                    }
            }

            deploymentInputs["impacted_country"] = JSON.stringify(_updatedCountries);

        }
        this.setState({deploymentInputs});

    }
    componentWillUnmount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().off('blueprint:setDeploymentIputs', this.setDeploymentIputs); 

    }
    componentDidUpdate(prevProps: GenericDeployModalProps) {
        const { blueprintId, open } = this.props;
        if (!prevProps.open && open && typeof blueprintId === 'string') {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({ ...GenericDeployModal.initialState, deploymentId: Stage.Utils.uuid() }, () =>
                this.selectBlueprint(blueprintId)
            );
        }
    }

    handleDeploymentInputChange(_: SyntheticEvent | null, field: Field) {
        let { deploymentInputs } = this.state;
        const fieldNameValue = Stage.Basic.Form.fieldNameValue(field);
        console.log("handleDeploymentInputChange:"+JSON.stringify(fieldNameValue));
        this.setState({ deploymentInputs: { ...deploymentInputs, ...fieldNameValue } });
    }

    handleYamlFileChange(file: File) {
        if (!file) {
            return;
        }

        const { blueprint, deploymentInputs: deploymentInputsState } = this.state;
        const { toolbox } = this.props;
        const actions = new FileActions(toolbox);

        this.setState({ fileLoading: true });

        actions
            .doGetYamlFileContent(file)
            .then((yamlInputs: Blueprint) => {
                const deploymentInputs = getUpdatedInputs(blueprint.plan.inputs, deploymentInputsState, yamlInputs);
                this.setState({ errors: {}, deploymentInputs, fileLoading: false });
            })
            .catch((err: string | { message: string }) => {
                const errorMessage = t('errors.loadingYamlFileFailed', {
                    reason: typeof err === 'string' ? err : err.message
                });
                this.setState({ errors: { yamlFile: errorMessage }, fileLoading: false });
            });
    }

    handleExecuteInputChange(_event: React.SyntheticEvent<HTMLElement> | null, field: any) {
        this.setState((prevState: any) => {
            return {
                userInstallWorkflowParams: {
                    ...prevState.userInstallWorkflowParams,
                    ...Stage.Basic.Form.fieldNameValue(field)
                }
            };
        });
    }

    onAccordionClick(_: React.MouseEvent<HTMLDivElement, MouseEvent>, { index }: AccordionTitleProps) {
        const { activeSection } = this.state;
        const newIndex = activeSection === index ? -1 : index;
        console.log("onAccordionClick");
        this.setState({ activeSection: newIndex });
    }

    onErrorsDismiss() {
        this.setState({
            areSecretsMissing: false,
            errors: {}
        });
    }

    onCancel() {
        const { onHide } = this.props;
        onHide();
        return true;
    }

    onSubmit(
        validationMessage: string,
        steps: StepsProp[],
        installWorkflowParameters?: WorkflowParameters,
        installWorkflowOptions?: WorkflowOptions
    ) {
        this.setState({ activeSection: -1, loading: true, errors: {} });
        this.setLoadingMessage(validationMessage);

        let stepPromise = this.validateInputs();

        const deploymentParameters = this.getDeploymentParams();

        steps.forEach(step => {
            stepPromise = stepPromise.then(previousStepOutcome => {
                this.setLoadingMessage(step.message || '');
                return step.executeStep(
                    previousStepOutcome as any,
                    deploymentParameters,
                    installWorkflowParameters,
                    installWorkflowOptions
                );
            });
        });

        const isMissingSecretsError = (errors: Errors) => {
            return errors.error?.includes('dsl_parser.exceptions.UnknownSecretError');
        };

        return stepPromise.catch(errors => {
            const { DEPLOYMENT_SECTIONS } = GenericDeployModal;
            const { activeSection, deploymentInputs } = this.state;
            const errorKeys = Object.keys(errors);
            const deploymentInputKeys = Object.keys(deploymentInputs);
            let errorActiveSection = activeSection;
            if (errorKeys.some(errorKey => deploymentInputKeys.includes(errorKey))) {
                errorActiveSection = DEPLOYMENT_SECTIONS.deploymentInputs;
            } else if (errorKeys.includes('siteName')) {
                errorActiveSection = DEPLOYMENT_SECTIONS.deploymentMetadata;
            } else if (errorKeys.includes('deploymentId')) {
                errorActiveSection = DEPLOYMENT_SECTIONS.advanced;
            }
            this.setState({
                loading: false,
                errors,
                areSecretsMissing: isMissingSecretsError(errors),
                activeSection: errorActiveSection
            });
        });
    }

    onDeploy() {
        const { deployValidationMessage, deploySteps } = this.props;
        return this.onSubmit(deployValidationMessage, deploySteps);
    }

    onDeployAndInstall() {
        const { toolbox, deployAndInstallValidationMessage, deployAndInstallSteps } = this.props;
        const {
            installWorkflow,
            baseInstallWorkflowParams,
            userInstallWorkflowParams,
            schedule,
            scheduledTime,
            force,
            dryRun,
            queue,
            deploymentId
        } = this.state;
        const deploymentsList: string[] = _.compact([deploymentId]);

        //console.log(deploymentsList);

        this.setState({ activeSection: -1, loading: true, errors: {} });
        return this.validateInputs()
            .then(() =>
                executeWorkflow({
                    deploymentsList,
                    setLoading: () => this.setState({ loading: true }),
                    unsetLoading: () => this.setState({ loading: false }),
                    toolbox,
                    workflow: installWorkflow,
                    baseWorkflowInputs: baseInstallWorkflowParams,
                    userWorkflowInputsState: userInstallWorkflowParams,
                    schedule,
                    scheduledTime,
                    force,
                    dryRun,
                    queue,
                    clearErrors: () => this.setState({ errors: {} }),
                    onExecute: (
                        installWorkflowParameters: WorkflowParameters,
                        installWorkflowOptions: WorkflowOptions
                    ) => {
                        return this.onSubmit(
                            deployAndInstallValidationMessage,
                            deployAndInstallSteps,
                            installWorkflowParameters,
                            installWorkflowOptions
                        );
                    },
                    onHide: () => {}
                })
            )
            .catch(err => {
                if (typeof err === 'string') {
                    this.setState({ errors: { message: err }, loading: false });
                } else {
                    this.setState({ errors: err, loading: false });
                }
            });
    }

    onForceChange(_event: React.FormEvent<HTMLInputElement>, { checked }: CheckboxProps) {
        this.setState({
            errors: {},
            queue: false,
            force: checked as boolean
        });
    }

    onDryRunChange(_event: React.FormEvent<HTMLInputElement>, { checked }: CheckboxProps) {
        this.setState({
            errors: {},
            queue: false,
            dryRun: checked as boolean
        });
    }

    onQueueChange(_event: React.FormEvent<HTMLInputElement>, { checked }: CheckboxProps) {
        this.setState({
            errors: {},
            force: false,
            dryRun: false,
            schedule: false,
            scheduledTime: '',
            queue: checked as boolean
        });
    }

    onScheduleChange(_event: React.FormEvent<HTMLInputElement>, { checked }: CheckboxProps) {
        this.setState({
            errors: {},
            queue: false,
            schedule: checked as boolean
        });
    }

    onScheduledTimeChange(_event: Event, { value }: { name?: string | undefined; value?: string | undefined }) {
        this.setState({ errors: {}, queue: false, scheduledTime: value as string });
    }

    getDeploymentParams() {
        const {
            blueprint,
            deploymentName,
            deploymentId,
            runtimeOnlyEvaluation,
            labels,
            siteName,
            skipPluginsValidation,
            visibility,
            deploymentInputs
        } = this.state;

        return {
            blueprintId: blueprint.id,
            deploymentId,
            deploymentName,
            inputs: getInputsMap(blueprint.plan.inputs, deploymentInputs),
            visibility,
            labels,
            skipPluginsValidation,
            siteName,
            runtimeOnlyEvaluation
        };
    }

    setLoadingMessage(message: string) {
        this.setState({ loadingMessage: message });
    }

    isBlueprintSelectable() {
        const { blueprintId } = this.props;
        return _.isEmpty(blueprintId);
    }

    fetchInternalData = async () => {
        const { toolbox } = this.props;
        const response = await toolbox.getWidgetBackend().doGet('GSNAPI');
        const data = await response;
        console.log("fetchInternalData:");
        //console.log(data.result);
        return data;
      };

    fetchDataFromAzure = async () => {
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        const data = await response.json();
        return data;
      };

    createSecret = async(key:string) => {
        const { toolbox } = this.props;
        const actions = new Stage.Common.Secrets.Actions(toolbox);
        actions
            .doCreate(key,'null', 'global', false)
            .then(async () => {
                toolbox.refresh();
            })
    }
    
    updateSecret = async(key:string, _data:any) => {
        const { toolbox } = this.props;
        const actions = new Stage.Common.Secrets.Actions(toolbox);
        actions
            .doUpdate(key, _data)
            .then(() => {
                toolbox.refresh();
            })
    }

    isRequiredUpdateGSNData(_secretDataFull:any) {
        if (_secretDataFull==null) {
            return true;
        }
        if (_secretDataFull.updated_at ==null) {
            return true;
        }
        if (_secretDataFull.created_at ==null) {
            return true;
        }

        var createdTime =  moment(_secretDataFull.created_at);
        console.log(createdTime);
        

        // comparing date values:
        console.log("_secretDataFull.updated_at:"+_secretDataFull.updated_at); //updated_at: "2022-09-12T11:12:52.050Z"
        var startTime = moment(Date.now());
        var endTime =  moment(_secretDataFull.updated_at);
        var duration = moment.duration(startTime.diff(endTime));
        var _difsMinutes = duration.asMinutes();
        console.log(_difsMinutes);
       
        if (_difsMinutes>REFRESHING_CASH_PERIOD_MINUTES) {
            return true;
        }
        else {
            return false;
        }
        
    }

    fetchGSNFromFile = async () =>{

        // GSNAPI


        //console.log("calling fetchGSNFromFile");
        
        //const { toolbox } = this.props;
        //let _secretDataFull = null;
        //let _refreshedSecretData = null;

        // kontrola, jestli jsou nějaká data:
        //if (_secretDataFull==null || _secretDataFull.value ==null || _secretDataFull.value =="null" || this.isRequiredUpdateGSNData(_secretDataFull) ) {
            
            //nutno se poprve zeptat azure nebo updatovat hodnoty
            const _dataFromExternalSource = await this.fetchInternalData(); //nactu data,

            console.log("GSN_Business_services_cash refreshing:");
            //console.log(_dataFromExternalSource);
        //}

        //toto je pro nacteni dat do widgetu:
        //console.log("GSN_Business_services_cash:");
        // if (_refreshedSecretData!=null) {
        //     _secretDataFull = _refreshedSecretData;
        // }
        //console.log(_dataFromExternalSource);
        const gsnData =  _dataFromExternalSource;//JSON.parse(_dataFromExternalSource); 
        this.setState({gsnData}); //tady je pole hodnot ve value
        return gsnData;

    }

    fetchGSN = async () => {
        console.log("calling fetchGSN");
        
        const { toolbox } = this.props;
        let _secretDataFull = null;
        let _refreshedSecretData = null;
        try {
            _secretDataFull = await toolbox.getManager().doGet(`/secrets/${GSN_BUSINESS_SERVICES_CASH}`);
        } catch (error:any) {
            console.log(error);
            // {
            //     "message": "Requested `Secret` with ID `GSN_BUSINESS_SERVICES_CASH` was not found",
            //     "status": 404,
            //     "code": "not_found_error"
            // }
            if (error.code == 'not_found_error') {
                console.log("createSecret:");
                await this.createSecret(GSN_BUSINESS_SERVICES_CASH);
            }
            else {
                throw error;
            }
        }

        //console.log("GSN_Business_services_cash:");
        //console.log(_secretDataFull);

        // kontrola, jestli jsou nějaká data:
        if (_secretDataFull==null || _secretDataFull.value ==null || _secretDataFull.value =="null" || this.isRequiredUpdateGSNData(_secretDataFull) ) {
            
            //nutno se poprve zeptat azure nebo updatovat hodnoty
            const _dataFromExternalSource = await this.fetchInternalData(); //nactu data,
            // console.log("_dataFromExternalSource fresh::"+JSON.stringify(_dataFromExternalSource));
            await this.updateSecret(GSN_BUSINESS_SERVICES_CASH,JSON.stringify(_dataFromExternalSource)).then(
                async promises => {
                    console.log(promises);
                    toolbox.refresh();
                    _refreshedSecretData = await toolbox.getManager().doGet(`/secrets/${GSN_BUSINESS_SERVICES_CASH}`); // nactu z cloudify db a ulozim
                    console.log("GSN_Business_services_cash refreshing:");
                    console.log(_refreshedSecretData);
                }
            ); 
        }

        //toto je pro nacteni dat do widgetu:
        console.log("GSN_Business_services_cash:");
        if (_refreshedSecretData!=null) {
            _secretDataFull = _refreshedSecretData;
        }
        console.log(_secretDataFull);
        const gsnData =  JSON.parse(_secretDataFull.value); 
        this.setState({gsnData}); //tady je pole hodnot ve value
        return gsnData;
    }

    fetchImpactedCountriesGSNData = async () => {
        console.log("calling fetchImpactedCountriesGSNData");
        
        const { toolbox } = this.props;
        //let _secretDataFull = null;
        try {
            const _secretDataFull = await toolbox.getManager().doGet(`/secrets/${GSN_COUNTRIES_CASH}`);
            //console.log(_secretDataFull);
            const _gsnCountries =  JSON.parse(_secretDataFull.value); 
            let _gsnRegions = [];
            let gsnCountries = [];

            for (let _countrName in _gsnCountries) {
                //console.log(_countrName + ": "+ _gsnCountries[_countrName]);
                gsnCountries.push({"countryName":_countrName, "countryData":_gsnCountries[_countrName]});
                _gsnRegions.push(_gsnCountries[_countrName].region_name);
            }
            let gsnRegions = [...new Set(_gsnRegions)];
            gsnRegions = sortBy(gsnRegions);

            //{"country_code":"AE","region_code":"ASIA","region_name":"ASIA"}
            gsnCountries=(JSON.parse(JSON.stringify(gsnCountries)));
            gsnCountries= sortBy(gsnCountries,"countryName");

            this.setState({gsnCountries}); //tady je pole hodnot ve value
            this.setState({gsnRegions});
            return _secretDataFull;
        } catch (error:any) {
            console.log(error);
                throw error;
        }
    }

    getDeploymentNameByTime  = (blueprint: FullBlueprintData) =>{
        const { Json } = Stage.Utils;
        const stringInputValue = Json.getStringValue(blueprint.plan.inputs["product_name"]).replace(/ /g,'');
        const _deploymentName = String(JSON.parse(stringInputValue).default);
            var dateTime = moment(new Date()).format('YYYY_MM_DD_HH_mm_ss');//year+'_'+month+'_'+day+' '+hour+'_'+minute+'_'+second;   
            console.log(_deploymentName+"_"+dateTime);
            return _deploymentName+"_"+dateTime;
        
    }
    async selectBlueprint(id: DropdownValue) {
        if (!_.isEmpty(id) && typeof id === 'string') {
            this.setState({ loading: true, loadingMessage: t('inputs.deploymentInputs.loading') });
            const { toolbox } = this.props;
            
            const actions = new BlueprintActions(toolbox);
            actions
                .doGetFullBlueprintData(id)
                .then(blueprint => {
                    //console.log(blueprint);
                    const deploymentInputs = getInputsInitialValues(blueprint.plan);
                    const installWorkflow = {
                        ...(blueprint.plan.workflows.install as Record<string, unknown>),
                        name: 'install'
                    } as Workflow;
                    
                    const _deploymentName = this.getDeploymentNameByTime(blueprint);
                    this.setState({deploymentName: _deploymentName});
                    
                    console.log("check keys in data_disks");

                    //check keys in data_disks:
                    if (deploymentInputs.data_disks) {
                        
                        var uniqueID = function () {
                            return '_' + Math.random().toString(36).slice(2, 11);
                        };
                        var isLabelValid = function(_item:any) {

                            if (_item.error!=undefined && _item.error!="" ) {
                                return _item.error;
                            }

                            if (_item.label=="" || _item.label==null) {
                                return "Label and Mount point may not be blank.";
                            } 
                            else {
                                return "";
                            }
                        }

                        var getDiskMountingPointValue = (_item: any) => {
                            try {
                                //_valueMountingPoint[0].path;
                                if (_item.error!=undefined && _item.error!="" ) {
                                    return _item.error;
                                }
                                if (_item.mountpoint==null || _item.mountpoint.length==0 || _item.mountpoint[0].path=="") {
                                    return "Label and Mount point may not be blank.";
                                }
                                else {
                                    return "";
                                }
                            } catch (error) {
                                return "";
                            }
                        }

                        let dataDiskData = JSON.parse(deploymentInputs.data_disks);
                        _.map(dataDiskData, item => (
                            item.key = uniqueID())
                        )
                        //validace na vstupu disku
                        _.map(dataDiskData, item => (
                            item.error = isLabelValid(item))
                        )
                        _.map(dataDiskData, item => (
                            item.error = getDiskMountingPointValue(item))
                        )       
                        deploymentInputs.data_disks = JSON.stringify(dataDiskData);
                    }    

                    this.setState({
                        deploymentInputs,
                        blueprint,
                        installWorkflow,
                        baseInstallWorkflowParams: installWorkflow.parameters,
                        userInstallWorkflowParams: _.mapValues(installWorkflow.parameters, parameterData =>
                            getInputFieldInitialValue(parameterData.default, parameterData.type)
                        ),
                        errors: {},
                        loading: false
                    });
                }).then (
                    await this.fetchGSNFromFile()
                )
                .then (
                    await this.fetchImpactedCountriesGSNData()
                )
                .catch(err => {
                    this.setState({
                        blueprint: GenericDeployModal.EMPTY_BLUEPRINT,
                        loading: false,
                        errors: { error: err.message }
                    });
                });
        } else {
            this.setState({ blueprint: GenericDeployModal.EMPTY_BLUEPRINT, errors: {} });
        }
        //fix reseting
        this.state.steps.forEach(x => {
                x.isDone = false;
        });
        
 
    }

    validateInputs() {
        return new Promise<void>((resolve, reject) => {
            const { blueprint, deploymentId, deploymentName, deploymentInputs: stateDeploymentInputs } = this.state;
            const { showDeploymentNameInput, showDeploymentIdInput } = this.props;
            const errors: Errors = {};

            if (showDeploymentNameInput && _.isEmpty(deploymentName)) {
                errors.deploymentName = t('errors.noDeploymentName');
            }
            if (showDeploymentIdInput && _.isEmpty(deploymentId)) {
                errors.deploymentId = t('errors.noDeploymentId');
            }

            if (_.isEmpty(blueprint.id)) {
                errors.blueprintName = t('errors.noBlueprintName');
            }
            console.log("validateInputs:");
            console.log(stateDeploymentInputs);
            const inputsWithoutValue = getInputsWithoutValues(blueprint.plan.inputs, stateDeploymentInputs);
            addErrors(inputsWithoutValue, errors);

            if (!_.isEmpty(errors)) {
                reject(errors);
            } else {
                resolve();
            }
        });
    }

    render() {
        const { Form, Icon, LoadingOverlay, Modal, VisibilityField } = Stage.Basic;

        const renderWizardStepContent= () =>{

            if (activeStep.key==="GeneralStep") {
                return GeneralStepComponent();
            }
            if (activeStep.key==="ClusteringStep") {
                return ClusteringStepComponent();
            }
            if (activeStep.key==="GSNStep") {
                return GSNStepComponent();
            }
            if (activeStep.key==="SWConfigStep") {
                return SWConfigStepComponent();
            }
            if (activeStep.key==="VMConfigStep") {
                return VMConfigStepComponent();
            }

            return "";
        }

        const GeneralStepComponent = () => {
            return <GeneralStep
            title='General'
            index={DEPLOYMENT_SECTIONS.deploymentInputs}
            activeSection={activeSection}
            toolbox={toolbox}
            blueprint={blueprint}
            onYamlFileChange={this.handleYamlFileChange}
            fileLoading={fileLoading}
            onDeploymentInputChange={this.handleDeploymentInputChange}
            deploymentInputs={deploymentInputs}
            errors={errors}
            ></GeneralStep>
        }

        const ClusteringStepComponent = () => {
            return <ClusteringStep
                title='Clustering'
                index={DEPLOYMENT_SECTIONS.deploymentInputs}
                activeSection={activeSection}
                toolbox={toolbox}
                blueprint={blueprint}
                onYamlFileChange={this.handleYamlFileChange}
                fileLoading={fileLoading}
                onDeploymentInputChange={this.handleDeploymentInputChange}
                deploymentInputs={deploymentInputs}
                errors={errors}
            ></ClusteringStep>
          }

        const GSNStepComponent = () => {
            return <GSNStep
                title='GSN'
                index={DEPLOYMENT_SECTIONS.deploymentInputs}
                activeSection={activeSection}
                toolbox={toolbox}
                blueprint={blueprint}
                onYamlFileChange={this.handleYamlFileChange}
                fileLoading={fileLoading}
                onDeploymentInputChange={this.handleDeploymentInputChange}
                deploymentInputs={deploymentInputs}
                gsnData = {this.state.gsnData}
                gsnCountries = {this.state.gsnCountries}
                gsnRegions={this.state.gsnRegions}
                errors={errors}
            ></GSNStep>
        }

        const SWConfigStepComponent = () => {
            return <SWConfigStep
                title='SW Config'
                index={DEPLOYMENT_SECTIONS.deploymentInputs}
                activeSection={activeSection}
                toolbox={toolbox}
                blueprint={blueprint}
                onYamlFileChange={this.handleYamlFileChange}
                fileLoading={fileLoading}
                onDeploymentInputChange={this.handleDeploymentInputChange}
                deploymentInputs={deploymentInputs}
                errors={errors}
            ></SWConfigStep>
        }

        const VMConfigStepComponent = () => {
            return <VMConfigStep
                title='VM Config'
                index={DEPLOYMENT_SECTIONS.deploymentInputs}
                activeSection={activeSection}
                toolbox={toolbox}
                blueprint={blueprint}
                onYamlFileChange={this.handleYamlFileChange}
                fileLoading={fileLoading}
                onDeploymentInputChange={this.handleDeploymentInputChange}
                deploymentInputs={deploymentInputs}
                errors={errors}
            ></VMConfigStep>
        }

        const {
            onHide,
            open,
            toolbox,
            i18nHeaderKey,
            //showInstallOptions,
            //showDeploymentIdInput,
            //showDeploymentNameInput,
            showDeployButton,
            //showSitesInput,
            //deploymentNameLabel,
            //deploymentNameHelp,
            //blueprintFilterRules
        } = this.props;
        const {
            activeSection,
            blueprint,
            deploymentInputs,
            //deploymentId,
            //deploymentName,
            errors,
            areSecretsMissing,
            fileLoading,
            loading,
            loadingMessage,
            //runtimeOnlyEvaluation,
            //skipPluginsValidation,
            //siteName,
            visibility,
            //baseInstallWorkflowParams,
            //userInstallWorkflowParams,
            //force,
            //dryRun,
            //queue,
            //schedule,
            //scheduledTime,
            selectedApproveButton,
            steps,
            activeStep,
            showDeployModalActions,
            disableNextButton
        } = this.state;
        
        const { DEPLOYMENT_SECTIONS } = GenericDeployModal;

        const handleNext = () => {
            console.log(activeStep.key);
            if (steps[steps.length - 1].key === activeStep.key) {
              console.log('You have completed all steps.');
              this.setState({showDeployModalActions:true});
              return;
            }

            const index = steps.findIndex(x => x.key === activeStep.key);
  
            steps.forEach(x => {
                if (x.key === activeStep.key) {
                    x.isDone = true;
                    this.setState({steps:steps});
                }
            });
            this.setState({showDeployModalActions:false});
            this.setState({ activeStep: steps[index + 1] });
          }
        const handleBack = () => {
            const index = steps.findIndex(x => x.key === activeStep.key);
            if (index === 0) return;
            steps.forEach(x => {
                if (x.key === activeStep.key) {
                    x.isDone = false;
                    this.setState({steps:steps});
                }
            });
            this.setState({showDeployModalActions:false});
            this.setState({ activeStep: steps[index - 1] });

        }

        const showCurrentSettings = () => {
            console.log(this.state.deploymentInputs);
            alert(JSON.stringify(this.state.deploymentInputs, null, "  "));
        }

        return (
            <Modal open={open} onClose={onHide} className="deployBlueprintModal">
                <Modal.Header>
                    <Icon name="wizard" /> {i18n.t(i18nHeaderKey, { blueprintId: blueprint.id })}
                    <VisibilityField
                        visibility={visibility}
                        className="rightFloated"
                        onVisibilityChange={v => this.setState({ visibility: v })}
                    />
                    <span style={{float:'right'}}><Icon name="settings" link onClick={showCurrentSettings} /></span>
                </Modal.Header>

                <Modal.Content>
                   
                    <Form
                        errors={
                            areSecretsMissing ? (
                                <MissingSecretsError
                                    error={errors?.error}
                                    toolbox={toolbox}
                                    onAdd={this.onErrorsDismiss}
                                />
                            ) : (
                                errors
                            )
                        }
                        errorMessageHeader={areSecretsMissing ? t('errors.missingSecretsHeading') : undefined}
                        scrollToError
                        onErrorsDismiss={this.onErrorsDismiss}
                    >
                        {loading && <LoadingOverlay message={loadingMessage} />}

                        {/* {showDeploymentNameInput && (
                            <Form.Field
                                error={errors.deploymentName}
                                label={deploymentNameLabel}
                                required
                                help={deploymentNameHelp}
                            >
                                <Form.Input
                                    name="deploymentName"
                                    value={deploymentName}
                                    onChange={(_: ChangeEvent<HTMLInputElement>, { value }: { value: string }) =>
                                        this.setState({ deploymentName: value })
                                    }
                                />
                            </Form.Field>
                        )} */}

                    <div className="box">
                        <div className="steps">
                            <ul className="nav">
                                {steps.map((step, i) => {
                                return <li key={i} className={`${activeStep.key === step.key ? 'active' : ''} ${step.isDone ? 'done' : ''}`}>
                                            <div><span>{step.label}</span></div>
                                        </li>
                                })}
                            </ul>
                        </div>
                        <div className="step-component">
                            {renderWizardStepContent()}
                        </div>
                        <div className="btn-component">
                            
                            <input type="button" key={"key_back"}  className='ui button basic cancel' value="Back" onClick={handleBack} disabled={steps[0].key === activeStep.key} />

                            {!showDeployModalActions && (
                                <div style={{float:"left"}}>
                                <button onClick={this.onCancel} className="ui button basic cancel"><i aria-hidden="true" className="remove icon"></i>Cancel</button>
                                {!disableNextButton && (
                                    <input type="button" key={"key_next"} className='ui positive button ok' value='Next' onClick={handleNext} />
                                )}
                                {disableNextButton && (
                                    <input type="button" key={"key_next_disabled"} disabled className='ui positive button' value='Next' />
                                )}
                                </div>
                             )
                            }
                            {showDeployModalActions &&
                            <DeployModalActions
                                loading={loading}
                                showDeployButton={showDeployButton}
                                onCancel={this.onCancel}
                                onInstall={this.onDeployAndInstall}
                                onDeploy={this.onDeploy}
                                
                                selectedApproveButton={selectedApproveButton}
                                onApproveButtonChange={(value, field) =>
                                    this.setState({ selectedApproveButton: field ? field.value ?? field.checked : value })
                                }
                            />}
                        </div>


                    </div>

                    </Form>
                </Modal.Content>

            </Modal>
        );
    }
}

export default GenericDeployModal;
