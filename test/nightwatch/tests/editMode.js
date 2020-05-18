/**
 * Created by kinneretzin on 02/04/2017.
 */

module.exports = {
    'Move to edit mode': client => {
        const page = client.page.page();

        client.login().moveToEditMode();

        page.section.editModeSidebar.waitForElementVisible('@addPageButton').waitForElementVisible('@addWidgetButton');

        page.section.page
            .waitForElementVisible('@firstWidget')
            .moveToElement('@firstWidget', 30, 30)
            .waitForElementVisible('@firstWidgetRemoveIcon')
            .waitForElementVisible('@firstWidgetConfigureIcon')
            .waitForElementVisible('@firstWidgetResizeHandle');

        client.end();
    },

    'Add page': client => {
        const page = client.page.page();

        client
            .login()
            .moveToEditMode()
            .addPage()
            .ensureSidebarMenuIsOpen()
            .page.page()
            .section.sidebar.waitForElementVisible('@lastPage')
            .assert.containsText('@lastPage', 'Page_0')
            .removeLastPage();

        client.end();
    },

    'Add Widget': client => {
        client
            .login()
            .moveToEditMode()
            .addPage()
            .addWidget('blueprints')
            .page.page()
            .section.page.waitForElementVisible('@firstWidget')
            .assert.containsText('@firstWidgetName', 'Blueprints')
            .removeLastPage();

        client.end();
    }
};
