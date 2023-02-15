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
    //tisk pdf dokumentu:
    const exporttoPdf = () => {

        var divContents = "";

        divContents=divContents+"<table width='100%'>"
        divContents=divContents+"<tr>";
        divContents=divContents+"<td width='50%'><img src='data:image/png;base64,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' /></td>";
        divContents=divContents+"<td  width='50%' style={{ color: 'green' }}>"+data.testResultSummary+"</td>";
        divContents=divContents+"</tr>";
        divContents=divContents+"</table>";

        divContents=divContents+"<hr>";

        divContents=divContents+"<h1>OAT Report</h1>";

        divContents=divContents+"<table width='100%'>";
        divContents=divContents+"<tr><td>Virtual machine</td></tr><tr><td>"+data.virtualMachine+"</td></tr>";
        divContents=divContents+"<tr><td>Test date</td></tr><tr><td>"+data.testDatum+"</td></tr>";
        divContents=divContents+"</table>";


        divContents=divContents+"<h3>Test details:</h3>";
        divContents=divContents+"<hr>";

        

        data.testResultArray.forEach((_test: { class: any; name:any, description:any, code:any, result:any, actual_value:any, expected_value:any}) => {
            divContents=divContents+"<table width='100%' style='margin-bottom: 20px;'>";
            divContents=divContents+"<tr><td width='20%' style='vertical-align: top;'>Code:</td><td style='vertical-align: top;'>"+_test.code+"</td></tr>";
            divContents=divContents+"<tr><td width='20%' style='vertical-align: top;'>Name:</td><td style='vertical-align: top;'>"+_test.name+"</td></tr>";
            divContents=divContents+"<tr><td width='20%' style='vertical-align: top;'>Class:</td><td style='vertical-align: top;'>"+_test.class+"</td></tr>";
            divContents=divContents+"<tr><td width='20%' style='vertical-align: top;'>Result:</td><td style='vertical-align: top;'>"+_test.result+"</td></tr>";
            divContents=divContents+"<tr><td width='20%' style='vertical-align: top;'>Description:</td><td style='vertical-align: top;'>"+_test.description+"</td></tr>";
            divContents=divContents+"<tr><td width='20%' style='vertical-align: top;'>Actual value:</td><td style='vertical-align: top;'>"+_test.actual_value+"</td></tr>";
            divContents=divContents+"<tr><td width='20%' style='vertical-align: top;'>Expected value:</td><td style='vertical-align: top;'>"+_test.expected_value+"</td></tr>";
            divContents=divContents+"</table>";

        });

        
        var printWindow = window.open('', '', 'height=600,width=1000');
        printWindow?.document.write('<html><head><title>Page title: DIV Contents</title>');
        printWindow?.document.write('</head><body >');
        printWindow?.document.write("<div>"+divContents+"</div>");
        //printWindow?.document.write("<div>"+JSON.stringify(data, null, 2)+"</div>");

        printWindow?.document.write('</body></html>');
        printWindow?.document.close();
        //console.log(printWindow); 
        printWindow?.print();
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
            <Dropdown button text={'Export'} direction={direction} upward={upward}>
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
