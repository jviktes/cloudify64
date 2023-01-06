import { DataTable } from 'cloudify-ui-components';
import { Icon } from 'semantic-ui-react';

export function DataDiskTable({
    //diskData,
    vmInfo, osInfo, swInfo, toolbox, inputStates,
}: {
    diskData: any;
    vmInfo: any;
    osInfo: any;
    swInfo: any;
    toolbox: Stage.Types.Toolbox;
    inputStates: any;
}) {

    const { Form } = Stage.Basic;
    const onItemChange = (e: any, _item: any, _typeProperty: any, _value: any) => {
        console.log("onItemChange DataDisk:" + _item);
        console.log("DataDisk e.target:" + e);

        let dataDisks = inputStates;
        if (_item != null) {
            if (_typeProperty == "disk_type" || _typeProperty == "disk_size" || _typeProperty == "host_caching"
                || _typeProperty == "mountpoint" || _typeProperty == "label") {
                var changedDataDisk = dataDisks.filter((obj: { key: any; }) => {
                    return obj.key === _item.key;
                });
                if (changedDataDisk[0] != null) {
                    changedDataDisk[0][_typeProperty] = _value;
                    //ValidateDataDisk(changedDataDisk,inputStates);
                    toolbox.getEventBus().trigger('blueprint:setDeploymentIputs', 'data_disks', JSON.stringify(dataDisks));
                }
            }
        }
        
        ValidateDataAllDisks(dataDisks);
        //enableDisableNextButton(dataDisks);
    };



    const RemoveDisk = (_item: any) => {
        console.log("RemoveDisk:" + _item.key);
        let dataDisks = inputStates;

        const indexOfObject = dataDisks.findIndex((object: { key: any; }) => {
            return object.key === _item.key;
        });
        dataDisks.splice(indexOfObject, 1);
        toolbox.getEventBus().trigger('blueprint:setDeploymentIputs', 'data_disks', JSON.stringify(dataDisks));
        onItemChange("removeDiskEvent", null, "label", "");
    };
    var uniqueID = function () {
        return '_' + Math.random().toString(36).slice(2, 11);
    };
    const AddDisk = () => {
        console.log("AddDisk");
        let dataDisks = inputStates;

        if (dataDisks.length < GetDiskCountLimit()) {
            let newDisk = { "key": uniqueID(), "disk_type": "Standard HDD", "disk_size": 16, "host_caching": "None", "mountpoint": [{ "path": "" }], "label": [], "error": "" };
            dataDisks.push(newDisk);
            toolbox.getEventBus().trigger('blueprint:setDeploymentIputs', 'data_disks', JSON.stringify(dataDisks));
            onItemChange("addDiskEvent", newDisk, "label", "");
        }
        else {
            alert("limit disk");
        }
    };

    const GetDiskCountLimit = () => {
        let vm_size = vmInfo;

        //console.log(vm_size); //(2 CPU, 8GB RAM, max 4 data disks)
        let maxDiskCount = 0;

        //console.log("pokus o nalezni poctu disku:");
        try {
            maxDiskCount = vm_size.substring(
                vm_size.indexOf("max ") + 4,
                vm_size.lastIndexOf(" data disk")
            );
        } catch (error) {
        }

        return maxDiskCount;
    };

    const DataDiskOptions = [
        { text: 'Standard HDD', name: 'Standard HDD', value: 'Standard HDD' },
        { text: 'Standard SSD', name: 'Standard SSD', value: 'Standard SSD' },
        { text: 'Premium SSD', name: 'Premium SSD', value: 'Premium SSD' },
    ];
    const DiskSizeOptions = [
        { text: '4GB', name: '4GB', value: 4 },
        { text: '8GB', name: '8GB', value: 8 },
        { text: '16GB', name: '16GB', value: 16 },
        { text: '32GB', name: '32GB', value: 32 },
        { text: '64GB', name: '64GB', value: 64 },
        { text: '128GB', name: '128GB', value: 128 },
        { text: '256GB', name: '256GB', value: 256 },
        { text: '512GB', name: '512GB', value: 512 },
    ];
    const DataDiskHostingCashOptions = [
        { text: 'None', name: 'None', value: 'None' },
        { text: 'ReadOnly', name: 'ReadOnly', value: 'ReadOnly' },
        { text: 'ReadWrite', name: 'ReadWrite', value: 'ReadWrite' },
    ];

    const LetterDiskWindows = [
        { text: 'G', name: 'G', value: 'G' },
        { text: 'H', name: 'H', value: 'H' },
        { text: 'I', name: 'I', value: 'I' },
        { text: 'J', name: 'J', value: 'J' },
        { text: 'K', name: 'K', value: 'K' },
        { text: 'L', name: 'L', value: 'L' },
        { text: 'M', name: 'M', value: 'M' },
        { text: 'N', name: 'N', value: 'N' },
        { text: 'O', name: 'O', value: 'O' },
        { text: 'P', name: 'P', value: 'P' },
        { text: 'Q', name: 'Q', value: 'Q' },
        { text: 'R', name: 'R', value: 'R' },
        { text: 'S', name: 'S', value: 'S' },
        { text: 'T', name: 'T', value: 'T' },
        { text: 'U', name: 'U', value: 'U' },
        { text: 'V', name: 'V', value: 'V' },
        { text: 'W', name: 'W', value: 'W' },
        { text: 'X', name: 'X', value: 'X' },
        { text: 'Y', name: 'Y', value: 'Y' },
        { text: 'Z', name: 'Z', value: 'Z' },
    ];

    const getDiskLabelValue = (_valueLabel: any) => {

        //disk label muze byt zadavan podle nazvu sluzby:
        try {
            if (_valueLabel[0].hasOwnProperty("get_input")) {
                if (swInfo != null) {
                    console.log(swInfo);
                    let _swInfoParsed = JSON.parse(swInfo);
                    return _swInfoParsed[0].service;
                }
            }
        } catch (error) {

            try {
                if (_valueLabel.hasOwnProperty("get_input")) {
                    if (swInfo != null) {
                        console.log(swInfo);
                        let _swInfoParsed = JSON.parse(swInfo);
                        return _swInfoParsed[0].service;
                    }
                }
            } catch (error) {
                return "";
            }
            return "";
        }

        try {
            return _valueLabel[0];
        } catch (error) {
            return "";
        }

    };

    const getDiskMountingPointValue = (_valueMountingPoint: any) => {
        try {
            return _valueMountingPoint[0].path;
        } catch (error) {
            return "";
        }

    };

    const getDiskLabelValueToBlueprintFormat = (_value: string) => {
        //"label": ["WEB"]
        var _obj = [];
        _obj.push(_value);
        return _obj;
    };

    const getDiskMountpointValueToBlueprintFormat = (_value: string) => {
        //"mountpoint": [{"path": "/web"}],
        var _obj = [];
        _obj.push({ "path": _value });
        return _obj;
    };

    const getDiskMountpointValueToBlueprintFormatAny = (_value: any) => {
        //"mountpoint": [{"path": "/web"}],
        var _obj = [];
        _obj.push({ "path": _value });
        return _obj;
    };

    const htmlRenderAddButton = (disks: any, diskLimit: number) => {

        let htmlButtonAddPossible = <div style={{ float: "right", margin: "3px" }}>
            <Icon
                name="add"
                color='green'
                link
                bordered
                title="Add data disk"
                onClick={(event: Event) => {
                    event.stopPropagation();
                    AddDisk();
                }} />
        </div>;
        let txtTooltip = "Limits of " + diskLimit + " disks reached";
        let htmlButtonLimitReached = <div style={{ float: "right", margin: "3px" }}>
            <Icon
                name="add"
                link
                bordered
                disabled
                title={txtTooltip} />
        </div>;

        if (disks.length >= diskLimit) {
            return htmlButtonLimitReached;
        }
        else {
            return htmlButtonAddPossible;
        }

    };



    const getOperationtype = () => {
        //console.log(osInfo);
        if (osInfo == undefined || osInfo.default == undefined) { return null; }

        if (osInfo.default.toLowerCase() == "windows") {
            return "windows";
        }
        else {
            return "";
        }

    };
    const isRequiredDisk = (item: any) => {
        //console.log(item);
        if (item.required != null) {
            return true;
        }
        else {
            return false;
        }
    };
    const prepareDiskLetterOptions = (item: any) => {

        let _letters = LetterDiskWindows;
        if (getOperationtype() == "windows") {
            let dataDisks = inputStates;
            dataDisks.forEach((_disk: { mountpoint: any; }) => {
                let _usedLetter = getDiskMountingPointValue(_disk.mountpoint);
                _letters = _letters.filter(e => e.value !== _usedLetter);
            });
        }
        let _currentLetter = getDiskMountingPointValue(item.mountpoint);
        _letters.push({ text: _currentLetter, name: _currentLetter, value: _currentLetter });

        return _letters;

    };

    const htmlRenderMountPoint = (item: any) => {
        if (getOperationtype() == "windows") {
            return (<Form.Dropdown
                name="mount_point"
                selection
                options={prepareDiskLetterOptions(item)}
                value={getDiskMountingPointValue(item.mountpoint)}
                disabled={isRequiredDisk(item)}
                onChange={(e, { value }) => onItemChange(e.target, item, "mountpoint", getDiskMountpointValueToBlueprintFormatAny(value?.toString()))} />);
        }
        else {
            return (<Form.Input
                name="mount_point"
                placeholder={'Mount point'}
                value={getDiskMountingPointValue(item.mountpoint)}
                disabled={isRequiredDisk(item)}
                onChange={(e, { value }) => onItemChange(e.target, item, "mountpoint", getDiskMountpointValueToBlueprintFormat(value))} />);
        }
    };

    const getTableLabelForMountPoint = () => {
        if (getOperationtype() == "windows") {
            return ("Disk letter");
        }
        else {
            return ("Mount point");
        }

    };

    const htmlRenderErrorState = (_errors: any, _element:any) => {
        let _htmlResult = null;

        if (_errors == "" || _errors == null) {
            _htmlResult = null;
        }
        else {

            var newArray = _errors.filter(function (el: { element: any; text: any; })
            {
              return el.element==_element && (el.text!=null || el.text!=undefined);
            }
            );

            newArray.forEach((_err: { element: any; text:any}) => {
                    _htmlResult = <p style={{ color: 'red'}}>{_err.text}</p>;
            });
        }
        return _htmlResult ;
    };

    const ValidateDataAllDisks = (_dataDisks:any) => {


        console.log("ValidateDataAllDisks...");

        //hledani stejnych mountpoint:
        _dataDisks.forEach((_disk: { mountpoint: any; label:any, error:any, key:any}) => {
            _disk.error={};
            let errors = [];
            if (_disk.mountpoint == null || getDiskMountingPointValue(_disk.mountpoint) == "") {
                errors.push({text:"Mounting point may not be blank.", element:"mountpoint"});
            }
            if (_disk.label == null || _disk.label == ""){
                errors.push({text:"Label may not be blank.", element:"label"});
            }

            //hledani stejnych mountpoint:
            _dataDisks.forEach((_diskA: { mountpoint: any; key:any}) => {
                if (getDiskMountingPointValue(_disk.mountpoint)==getDiskMountingPointValue(_diskA.mountpoint) && _diskA.key!=_disk.key) {
                    errors.push({text:"Mount point must be unique across all disks.", element:"mountpoint"});
                }
            });

            const toFindDuplicates = (_dataDisks: any[]) => _dataDisks.filter((item: any, index: any) => _dataDisks.indexOf(item) !== index)
            const duplicateElements = toFindDuplicates(_dataDisks);
            console.log(duplicateElements);
            _disk.error=  errors;
        });
        
    };

    //funkce enable/disabluje Next button, ale jsou problemy:
    //pri nactani blueprintu nelze nastavit disabled rovnou, protoze to neni 1. krok
    //pri volani az pri renderovani to taky nejde, protoze se triggeruje state cele komponenty a to vede k nekonecnemu nacitani
    // (pri setState se prerenderuje cela komponenta)
    
    // const enableDisableNextButton=(dataDisks: any)=>{
    //     let isErrorInDisk = false;
    //     //enable NextButon - pokud jsou vsechny OK, toto by nejak melo fungovat:
    //     dataDisks.forEach((obj: { error: any; key: any; }) => {
    //         if (obj.error != null && obj.error.text != undefined) {
    //             //console.log("label is empty for key" + obj.key);
    //             toolbox.getEventBus().trigger('blueprint:dataDiskValidateError');
    //             isErrorInDisk = true;
    //         }
    //     });
    //     if (!isErrorInDisk) {
    //         toolbox.getEventBus().trigger('blueprint:dataDiskValidateOK');
    //     }
    // }

    ValidateDataAllDisks(inputStates);
    //enableDisableNextButton(inputStates);
    return (
        <div>
            <DataTable className="agentsGsnCountries table-scroll-gsn">
                <DataTable.Column label="Disk type" name="disk_type" width='10%' />
                <DataTable.Column label="Disk size" name="disk_size" width='10%' />
                <DataTable.Column label="Host caching" name="host_caching" width='10%' />
                <DataTable.Column label={getTableLabelForMountPoint()} name="mount_point" width='30%' />
                <DataTable.Column label="Disk label" name="disk_label" width='35%' />
                <DataTable.Column label="" name="" width='5%' />
                
                {_.map(inputStates, item => (
                    
                    <DataTable.Row key={JSON.stringify(item.key)}>
                        <DataTable.Data style={{ width: '10%', verticalAlign: 'baseline'}}>
                            <Form.Dropdown
                                name="disk_type"
                                selection
                                options={DataDiskOptions}
                                value={item.disk_type}
                                onChange={(e, { value }) => onItemChange(e.target, item, "disk_type", value)} />
                            
                        </DataTable.Data>
                        <DataTable.Data style={{ width: '10%', verticalAlign: 'baseline' }}>
                            <Form.Dropdown
                                name="disk_size"
                                selection
                                options={DiskSizeOptions}
                                value={item.disk_size}
                                onChange={(e, { value }) => onItemChange(e.target, item, "disk_size", value)} />
                          
                        </DataTable.Data>
                        <DataTable.Data style={{ width: '10%', verticalAlign: 'baseline' }}>
                            <Form.Dropdown
                                name="host_caching"
                                selection
                                options={DataDiskHostingCashOptions}
                                value={item.host_caching}
                                onChange={(e, { value }) => onItemChange(e.target, item, "host_caching", value)} />

                        </DataTable.Data>
                        <DataTable.Data style={{ width: '30%', verticalAlign: 'baseline' }}>
                            {htmlRenderMountPoint(item)}
                            {htmlRenderErrorState(item.error,"mountpoint")}
                        </DataTable.Data>
                        <DataTable.Data style={{ width: '30%', verticalAlign: 'baseline' }}>
                            <Form.Input
                                name="label"
                                placeholder={'Disk label'}
                                disabled={isRequiredDisk(item)}
                                value={getDiskLabelValue(item.label)}
                                onChange={(e, { value }) => onItemChange(e.target, item, "label", getDiskLabelValueToBlueprintFormat(value))} />
                            {htmlRenderErrorState(item.error,"label")}
                        </DataTable.Data>

                        <DataTable.Data style={{ width: '5%', verticalAlign: 'baseline' }}>
                            <Icon
                                name="remove"
                                link
                                color='red'
                                bordered
                                disabled={isRequiredDisk(item)}
                                title="Delete data disk"
                                onClick={(event: Event) => {
                                    event.stopPropagation();
                                    RemoveDisk(item);
                                }} />
                        </DataTable.Data>
                    </DataTable.Row>

                ))}
            </DataTable>
            {htmlRenderAddButton(inputStates, GetDiskCountLimit())}
            <div>Max data disks: {GetDiskCountLimit()}</div>
        </div>
    );

}
