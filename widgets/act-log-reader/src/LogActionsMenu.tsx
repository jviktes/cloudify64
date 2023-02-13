import { useMemo } from 'react';
import type { FunctionComponent } from 'react';
import { map } from 'lodash';

const { Dropdown } = Stage.Basic;
const { Menu, Item } = Dropdown;

interface LogActionsMenuProps {
    direction?: 'left' | 'right';
    upward?: boolean;
    toolbox: Stage.Types.Toolbox;
    showGenerateInComposerButton?: boolean;
    data:any;
}


const LogActionsMenu: FunctionComponent<LogActionsMenuProps> = ({
    direction,
    upward,
    toolbox,
    showGenerateInComposerButton = false,
    data,
}) => {

    const getTranslation = (key:string) => {

        let arr = [
            { key:"copyToClipboard", value:"Copy to clipboard"},
            { key:"downloadJSON", value:"Download as JSON"},
            { key:"exporttoPdf", value:"Export to PDF"}
        ];
        
        let obj = arr.find(o => o.key === key);
        return obj?.value;
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    }
    const downloadJSON = () => {
        const widget = toolbox.getWidget();
        console.log(widget.id);
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href",     dataStr);
        downloadAnchorNode.setAttribute("download", data.fileName + ".json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }
    const exporttoPdf = () => {
        alert("not yet imlemented");
    }
    
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
            <Dropdown button text={''} direction={direction} upward={upward}>
                <Menu>
                    {map(menuItems, (clickHandler, key) => (
                        <Item text={getTranslation(key)} key={key} onClick={clickHandler} />
                    ))}
                </Menu>
            </Dropdown>
        </>
    );
};

export default React.memo(LogActionsMenu, _.isEqual);
