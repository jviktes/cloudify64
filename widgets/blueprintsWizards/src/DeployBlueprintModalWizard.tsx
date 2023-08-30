import type { ComponentProps, FunctionComponent } from 'react';
import type { BlueprintDeployParams } from '../../../widgets/common/src/blueprints/BlueprintActions';  //'../blueprints/BlueprintActions';
import type { WorkflowOptions } from '../../../widgets/common/src/deployments/DeploymentActions'; //widgets/deployments/DeploymentActions

import type { WorkflowParameters } from '../../../widgets/common/src/executeWorkflow'; //'../executeWorkflow';
import GenericDeployModal from './GenericDeployModalWizard';//'../../../widgets/common/src/deployModal/GenericDeployModal';//'./GenericDeployModalWizard'; //'./GenericDeployModal';
import BlueprintActions from '../../../widgets/common/src/blueprints/BlueprintActions';
import DeploymentActions from '../../../widgets/common/src/deployments/DeploymentActions';//'../deployments/DeploymentActions';
import { getErrorObject } from '../../../widgets/common/src/inputs/utils/errors'; //'../inputs/utils/errors';

const t = (key: string, options?: Record<string, any>) =>
    Stage.i18n.t(`widgets.common.deployments.deployModal.${key}`, options);

type DeployBlueprintModalProps = Pick<
    ComponentProps<typeof GenericDeployModal>,
    'open' | 'onHide' | 'blueprintId' | 'toolbox' | 'blueprintFilterRules' | 'gsnData' 
>;

const DeployBlueprintModalWizard: FunctionComponent<DeployBlueprintModalProps> = ({ toolbox, onHide, ...rest }) => {
    function deployBlueprint(_: undefined, params: BlueprintDeployParams) {
        const blueprintActions = new BlueprintActions(toolbox);
        return blueprintActions
            .doDeploy(params)
            .then(deployment => deployment.id)
            .catch((err: { message: string }) => Promise.reject(getErrorObject(err.message)));
    }

    function waitForDeploymentIsCreated(deploymentId: string, { deploymentName }: BlueprintDeployParams) {
        const deploymentActions = new DeploymentActions(toolbox);

        return deploymentActions
            .waitUntilCreated(deploymentId)
            .then(() => deploymentId)
            .catch(error => Promise.reject(t('errors.deploymentCreationFailed', { deploymentName, error })));
    }

    function installDeployment(
        deploymentId: string,
        { deploymentName }: BlueprintDeployParams,
        installWorkflowParameters?: WorkflowParameters,
        installWorkflowOptions?: WorkflowOptions
    ) {
        const deploymentActions = new DeploymentActions(toolbox);
        console.log("installWorkflowParameters:");
        console.log(installWorkflowParameters);
        return deploymentActions
            .doExecute(deploymentId, 'install', installWorkflowParameters, installWorkflowOptions)
            .then(() => deploymentId)
            .catch(error =>
                Promise.reject({
                    errors: t('errors.deploymentInstallationFailed', {
                        deploymentName,
                        error: error.message
                    })
                })
            );
    }

    // function openDeploymentPage(deploymentId: string, deploymentName: string) {
    //     toolbox.drillDown(toolbox.getWidget(), 'deployment', { deploymentId }, deploymentName);
    // }

    function finalizeDeployAndInstall(deploymentId: string, params: BlueprintDeployParams) {
        finalizeDeploy(deploymentId, params);
        toolbox.getEventBus().trigger('executions:refresh');
    }

    function finalizeDeploy(deploymentId: string, { deploymentName }: BlueprintDeployParams) {
        toolbox.getEventBus().trigger('deployments:refresh');
        console.log("finalizeDeploy:"+deploymentId + "/deploymentName:"+deploymentName);
        onHide();
        //openDeploymentPage(deploymentId, deploymentName);
    }

    return (
        <GenericDeployModal
            {...rest}
            toolbox={toolbox}
            onHide={onHide}
            i18nHeaderKey="widgets.common.deployments.deployModal.header"
            showDeploymentNameInput
            showDeploymentIdInput
            showDeployButton
            showInstallOptions
            showSitesInput
            deployValidationMessage={t('steps.deploy.validatingData')}
            deploySteps={[
                { message: t('steps.deploy.deployingBlueprint'), executeStep: deployBlueprint },
                { executeStep: finalizeDeploy }
            ]}
            deployAndInstallValidationMessage={t('steps.deployAndInstall.validatingData')}
            deployAndInstallSteps={[
                { message: t('steps.deployAndInstall.deployingBlueprint'), executeStep: deployBlueprint },
                { message: t('steps.deployAndInstall.waitingForDeployment'), executeStep: waitForDeploymentIsCreated },
                { message: t('steps.deployAndInstall.installingDeployment'), executeStep: installDeployment },
                { executeStep: finalizeDeployAndInstall }
            ]}
        />
    );
};

export default DeployBlueprintModalWizard;
