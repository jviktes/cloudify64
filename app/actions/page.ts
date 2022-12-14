import { compact, each, find, map } from 'lodash';
import type { AnyAction } from 'redux';
import type { ThunkAction } from 'redux-thunk';
import type { SemanticICONS } from 'semantic-ui-react';
import type {
    PageFileDefinition,
    TabContent as BackendTabContent,
    TabsSection as BackendTabsSection,
    WidgetsSection as BackendWidgetsSection
} from '../../backend/routes/Templates.types';
import type { ReduxState } from '../reducers';
import type { Widget, WidgetDefinition } from '../utils/StageAPI';
import WidgetDefinitionsLoader from '../utils/widgetDefinitionsLoader';

import * as types from './types';
import { addWidget } from './widgets';

// TODO(RD-1645): rename type to Widget
// TODO(RD-1649): rename the added field to `definitionId`
export type SimpleWidgetObj = Omit<Widget, 'definition'> & { definition: string };

export interface WidgetsSection extends Omit<BackendWidgetsSection, 'content'> {
    content: SimpleWidgetObj[];
}

export interface TabContent extends Omit<BackendTabContent, 'widgets'> {
    widgets: SimpleWidgetObj[];
}

export interface TabsSection extends Omit<BackendTabsSection, 'content'> {
    content: TabContent[];
}

export type LayoutSection = WidgetsSection | TabsSection;

export function isWidgetsSection(layoutSection: LayoutSection): layoutSection is WidgetsSection {
    return layoutSection.type === 'widgets';
}
export function isTabsSection(layoutSection: LayoutSection): layoutSection is TabsSection {
    return layoutSection.type === 'tabs';
}

export interface PageDefinition extends Omit<PageFileDefinition, 'icon' | 'layout'> {
    icon?: SemanticICONS;
    isDrillDown: boolean;
    parent?: string;
    children?: string[];
    layout: LayoutSection[];
}

export function addTab(pageId: string, layoutSection: number) {
    return {
        type: types.ADD_TAB,
        pageId,
        layoutSection
    } as const;
}

export function removeTab(pageId: string, layoutSection: number, tabIndex: number) {
    return {
        type: types.REMOVE_TAB,
        pageId,
        layoutSection,
        tabIndex
    } as const;
}

export function updateTab(pageId: string, layoutSection: number, tabIndex: number, name: string, isDefault: boolean) {
    return {
        type: types.UPDATE_TAB,
        pageId,
        layoutSection,
        tabIndex,
        name,
        isDefault
    } as const;
}

export function moveTab(pageId: string, layoutSection: number, oldTabIndex: number, newTabIndex: number) {
    return { type: types.MOVE_TAB, pageId, layoutSection, oldTabIndex, newTabIndex } as const;
}

export function forAllWidgets(
    page: Pick<PageDefinition, 'layout'>,
    widgetListModifier: (
        widget: SimpleWidgetObj[],
        layoutSectionIndex: number,
        tabIndex: number | null
    ) => (SimpleWidgetObj | null | undefined)[]
) {
    each(page.layout, (layoutSection, layoutSectionIdx) => {
        if (isWidgetsSection(layoutSection))
            layoutSection.content = compact(widgetListModifier(layoutSection.content, layoutSectionIdx, null));
        else
            each(layoutSection.content, (tab, tabIdx) => {
                tab.widgets = compact(widgetListModifier(tab.widgets, layoutSectionIdx, tabIdx));
            });
    });
}

export function forEachWidget(
    page: Pick<PageDefinition, 'layout'>,
    widgetModifier: (
        widget: SimpleWidgetObj,
        layoutSectionIndex: number,
        tabIndex: number | null
    ) => SimpleWidgetObj | null | undefined
) {
    forAllWidgets(page, (widgets, layoutSectionIdx, tabIdx) =>
        map(widgets, widget => widgetModifier(widget, layoutSectionIdx, tabIdx))
    );
}

export function getWidgetDefinitionById(
    definitionId: string,
    definitions: ReduxState['widgetDefinitions']
): WidgetDefinition | undefined {
    return find(definitions, { id: definitionId });
}

export function changePageDescription(pageId: string, newDescription: string) {
    return {
        type: types.CHANGE_PAGE_DESCRIPTION,
        pageId,
        description: newDescription
    };
}

export function addLayoutToPage(
    page: Pick<PageDefinition, 'layout'>,
    pageId: string
): ThunkAction<void, ReduxState, never, AnyAction> {
    return (dispatch, getState) => {
        const { widgetDefinitions } = getState();
        const widgetsToLoad: Record<string, WidgetDefinition<any, any, Record<string, unknown>>> = {};
        forEachWidget(page, widget => {
            const widgetDefinition = find(widgetDefinitions, { id: widget.definition });
            if (widgetDefinition && !widgetDefinition.loaded) {
                widgetsToLoad[widgetDefinition.id] = widgetDefinition;
            }
            return widget;
        });
        return Promise.all(map(widgetsToLoad, WidgetDefinitionsLoader.loadWidget)).then(loadedWidgetDefinitions => {
            forEachWidget(page, (widget, layoutSectionIdx, tabIdx) => {
                const widgetDefinition =
                    find(loadedWidgetDefinitions, { id: widget.definition }) ??
                    find(getState().widgetDefinitions, { id: widget.definition });
                dispatch(addWidget(pageId, layoutSectionIdx, tabIdx, widget, widgetDefinition));
                return widget;
            });
        });
    };
}

export function addLayoutSectionToPage(pageId: string, layoutSection: LayoutSection, position: number) {
    return { type: types.ADD_LAYOUT_SECTION, pageId, layoutSection, position };
}

export function removeLayoutSectionFromPage(pageId: string, layoutSection: number) {
    return { type: types.REMOVE_LAYOUT_SECTION, pageId, layoutSection };
}
