import type { SemanticICONS } from 'semantic-ui-react';

export const i18nPrefix = 'widgets.deploymentsView';
export const i18nMessagesPrefix = `${i18nPrefix}.messages`;
export const i18nDrillDownPrefix = `${i18nPrefix}.drillDown`;

export const subenvironmentsIcon: SemanticICONS = 'object group';
export const subservicesIcon: SemanticICONS = 'cube';

export const filterRulesContextKey = 'filterRules';
export const mapOpenContextKey = 'mapOpen';

export const parentDeploymentLabelKey = 'csys-obj-parent';

/**
 * NOTE: drilldownContext contains contexts for each page, starting with
 * the top-level page, and ending with the current page's initial context.
 *
 * Thus, the current page's parent context will be the penultimate entry in the array.
 *
 * It may happen, that the array only contains a single item (if we are on the top-level page).
 */
export const isTopLevelPage = (drilldownContext: Stage.Types.ReduxState['drilldownContext']) =>
    drilldownContext.length < 2;
export const getParentPageContext = (drilldownContext: Stage.Types.ReduxState['drilldownContext']) =>
    drilldownContext[drilldownContext.length - 2].context;
    
//VIK - pri kliknuti na radek s deploymentem se nastavi hodnota takto a komponenta s detaily s tim pak pracuje ...
export const selectDeployment = (toolbox: Stage.Types.Toolbox, deploymentId: string) =>
    toolbox.getContext().setValue('deploymentId', deploymentId);
