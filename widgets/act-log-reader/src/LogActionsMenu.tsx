import { useMemo } from 'react';
import type { FunctionComponent } from 'react';
import { map } from 'lodash';

const { Dropdown } = Stage.Basic;
const { Menu, Item } = Dropdown;

//TODO preklady:
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
    data:any;
}

// upward={false}
// direction="left"
// toolbox={toolbox}
// data = {item}

const LogActionsMenu: FunctionComponent<LogActionsMenuProps> = ({
    direction,
    upward,
    toolbox,
    showGenerateInComposerButton = false,
    data,
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
        navigator.clipboard.writeText(JSON.stringify(data));
    }
    const downloadJSON = () => {
        const widget = toolbox.getWidget();
        console.log(widget.id);
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href",     dataStr);
        downloadAnchorNode.setAttribute("download", data.fileName + ".json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
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
