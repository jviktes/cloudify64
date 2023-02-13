import { useMemo } from 'react';
import type { FunctionComponent } from 'react';
import { map } from 'lodash';

const { Dropdown } = Stage.Basic;
const { Menu, Item } = Dropdown;

//TODO:
// const translateData = {
//     "uploadButton": "Upload",
//     "uploadFromMarketplace": "Upload from Marketplace",
//     "uploadFromPackage": "Upload a blueprint package",
//     "uploadFromTerraformTemplate": "Upload from Terraform module",
//     "generateInComposer": "Generate in the Composer"
// }

//const t = Stage.Utils.getT('widgets.common.blueprintUpload.actionsMenu');


interface LogActionsMenuProps {
    direction?: 'left' | 'right';
    upward?: boolean;
    toolbox: Stage.Types.Toolbox;
    showGenerateInComposerButton?: boolean;
}

const LogActionsMenu: FunctionComponent<LogActionsMenuProps> = ({
    direction,
    upward,
    toolbox,
    showGenerateInComposerButton = false
}) => {
    //const [uploadModalVisible, showUploadModal, hideUploadModal] = useBoolean();
    //const [terraformModalVisible, showTerraformModal, hideTerraformModal] = useBoolean();

    // const redirectToMarketplacePage = () => {
    //     const widget = toolbox.getWidget();
    //     toolbox.drillDown(widget, drilldownPage.blueprintMarketplace, {
    //         defaultTab: defaultMarketplaceTab
    //     });
    // };

    const copyToClipboard = () => {

        const widget = toolbox.getWidget();
        console.log(widget.id);
        alert("ola");
    }
    const downloadJSON = () => {

        alert("ola");
    }
    const exporttoPdf = () => {

        alert("ola");
    }
    
    // const locationTranslationOptions = [
    //     { text: 'Copy to clip' , name: 'Copy to clip', value: 'Copy to clip' },
    //     { text: 'Download JSON', name: 'Download JSON', value: 'Download JSON' },
    //     { text: 'Export pdf', name: 'Export pdf', value: 'Export pdf' },
    // ]

    const menuItems = useMemo(() => {
        const baseMenuItems = {
            copyToClipboard: copyToClipboard,
            downloadJSON: downloadJSON,
            exporttoPdf: exporttoPdf
        };

        if (showGenerateInComposerButton) {
            return { ...baseMenuItems, generateInComposer: Stage.Utils.openComposer };
        }

        return baseMenuItems;
    }, [showGenerateInComposerButton]);

    return (
        <>
            <Dropdown button text={'export'} direction={direction} upward={upward}>
                <Menu>
                    {map(menuItems, (clickHandler, key) => (
                        <Item text={key} key={key} onClick={clickHandler} />
                    ))}
                </Menu>
            </Dropdown>
        </>
    );
};

export default React.memo(LogActionsMenu, _.isEqual);
