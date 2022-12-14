import Actions from './actions';
import Blueprints from './blueprints';
import Components from './components';
import Consts from './Consts';
import Deployments from './deployments';
import DeploymentsView from './deploymentsView';
import DeployBlueprintModal from './deployModal/DeployBlueprintModal';
import Workflows from './executeWorkflow';
import Executions from './executions';
import Filters from './filters';
import StageHooks from './hooks';
import Inputs from './inputs';
import Labels from './labels';
import Map from './map';
import NodeInstancesConsts from './nodes/NodeInstancesConsts';
import Plugins from './plugins';
import StagePropTypes from './props';
import Roles from './roles';
import TerraformModal from './terraformModal';
import Secrets from './secrets';
import Tenants from './tenants';
import EventUtils from './utils/EventUtils';

const StageCommon = {
    Actions,
    Blueprints,
    Components,
    Deployments,
    DeploymentsView,
    DeployBlueprintModal,
    Workflows,
    Executions,
    Filters,
    Inputs,
    Labels,
    Map,
    NodeInstancesConsts,
    Plugins,
    Roles,
    Secrets,
    TerraformModal,
    Tenants,
    EventUtils,
    Consts
};

type StagePropTypes = typeof StagePropTypes;
type StageHooks = typeof StageHooks;
type StageCommon = typeof StageCommon;

declare global {
    namespace Stage {
        /* eslint-disable @typescript-eslint/no-empty-interface */
        interface Common extends StageCommon {}
        interface PropTypes extends StagePropTypes {}
        interface Hooks extends StageHooks {}
        /* eslint-enable @typescript-eslint/no-empty-interface */
    }
}

Stage.defineCommon(StageCommon);
Stage.definePropTypes(StagePropTypes);
Stage.defineHooks(StageHooks);
