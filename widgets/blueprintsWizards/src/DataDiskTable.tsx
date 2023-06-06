import { DataTable } from 'cloudify-ui-components';
import { Icon } from 'semantic-ui-react';
import { DataDiskHostingCashOptions, DataDiskOptions, DiskSizeOptions, LetterDiskWindows, VM_Sizes_No_PremiumSSD } from './DataDiskOptions';

export function DataDiskTable({
    //diskData,
    vmInfo, osInfo, swInfo, toolbox, inputStates,nextButtonState,osDiskInfo
}: {
    diskData: any;
    vmInfo: any;
    osDiskInfo:any;
    osInfo: any;
    swInfo: any;
    toolbox: Stage.Types.Toolbox;
    inputStates: any;
    nextButtonState:any;
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
                    toolbox.getEventBus().trigger('blueprint:setDeploymentIputs', 'data_disks', JSON.stringify(dataDisks));
                }
            }
        }
        
        ValidateDataAllDisks(dataDisks);
        enableDisableNextButton(dataDisks);
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

        if (selectOnlyServiceConfirmedDisks(dataDisks).length < GetDiskCountLimit()) {
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


    //filtrace disku - disky s vazbou na intalaci se zde nezobrazuji:
    const selectOnlyServiceConfirmedDisks = (_dataDisks:any) => {

        // if (_dataDisk.disk_based_on_service!=null) {
        //     //najit hodnotu pro _dataDisk.disk_based_on_service v swconfigu
        //     let _swInfoParsed = JSON.parse(swInfo);
        //     let _parNameValue=getParameterName(_swInfoParsed,_dataDisk.disk_based_on_service);
        //     console.log(_parNameValue);
        // }
        let _filteredDisks: any[] = [];
        _dataDisks.forEach((obj: any) => {
            if (obj.disk_based_on_service!=null) {
                //najit hodnotu pro _dataDisk.disk_based_on_service v swconfigu
                let _swInfoParsed = JSON.parse(swInfo);
                let _parNameValue=getParameterName(_swInfoParsed,obj.disk_based_on_service);
                if (_parNameValue=="true") {
                    _filteredDisks.push(obj);
                }
            }
            else {
                _filteredDisks.push(obj);
            }
        });
        return _filteredDisks;
    }

    //return value of service_name from service_names
    const getParameterName = (_items:any, parameterName: any) => {
        var _parameterValue = "";
        for (const key in _items) {

            var _row = _items[key];

                if (_row[parameterName]!=null) {
                    _parameterValue = _row[parameterName];
                    break;
                }
        }
        return String(_parameterValue);
    }

    const getDiskLabelValue = (_valueLabel: any) => {

        //disk label muze byt zadavan podle nazvu sluzby:
        try {
            if (_valueLabel[0].hasOwnProperty("get_input")) {
                if (swInfo != null) {
                    //console.log(swInfo);
                    let _swInfoParsed = JSON.parse(swInfo);
                    
                    let _parNameValue=getParameterName(_swInfoParsed,_valueLabel[0].get_input[2]);
                    return _parNameValue;
                }
            }
        } catch (error) {

            try {
                if (_valueLabel.hasOwnProperty("get_input")) {
                    if (swInfo != null) {
                        //console.log(swInfo);
                        let _swInfoParsed = JSON.parse(swInfo);
                        let _parNameValue=getParameterName(_swInfoParsed,_valueLabel.get_input[2]);
                        return _parNameValue;
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

            //[{"path":{"concat":["/appl/",{"get_input":["service_names",0,"service_name"]}]}}]
            if (_valueMountingPoint[0].path.hasOwnProperty("concat")) {
                let _fullPath = "";

                for (let index = 0; index < _valueMountingPoint[0].path.concat.length; index++) {
                    const elementValue = _valueMountingPoint[0].path.concat[index];
                    if (elementValue.get_input!=null) {
                        _fullPath=_fullPath+getDiskLabelValue(elementValue);
                    }
                    else {
                        _fullPath=_fullPath+elementValue;
                    }
                    
                }

                return _fullPath;
            } 
            else {
                return _valueMountingPoint[0].path;
            }

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

        if (selectOnlyServiceConfirmedDisks(disks).length >= diskLimit) {
            return htmlButtonLimitReached;
        }
        else {
            return htmlButtonAddPossible;
        }

    };

    const renderErrorMessageDiskOverLimit = (dataDisks: any, diskLimit: number) => {
        if (selectOnlyServiceConfirmedDisks(dataDisks).length > diskLimit) { 
            let txtTooltip = "Limits of " + diskLimit + " disks reached";
            return <span style={{color:"red", float:"right", margin:"5px"}}>{txtTooltip}</span>
        }
    }

    //TODO: return windows
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
                onChange={(e, { value }) => onItemChange(e.target, item, "mountpoint", getDiskMountpointValueToBlueprintFormatAny(value?.toString()))} 
                className="DropDownVerticalAlign"
                />);
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
        //console.log(nextButtonState);
        
        //hledani stejnych mountpoint:
        _dataDisks.forEach((_disk: {
            disk_type: string; mountpoint: any; label:any, error:any, key:any
            }) => {
            _disk.error={};
            let errors = [];
            if (_disk.mountpoint == null || getDiskMountingPointValue(_disk.mountpoint) == "") {
                if (getOperationtype() == "windows"){
                    errors.push({text:"Disk letter may not be blank.", element:"mountpoint"});
                }
                else {
                    errors.push({text:"Mounting point may not be blank.", element:"mountpoint"});
                }
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

            //validace disku podle SSD a vm_size:

            let vm_size = vmInfo;
            vm_size = vm_size.substring(0,vm_size.indexOf("(")-1);


            if (_disk.disk_type=='Premium SSD' && VM_Sizes_No_PremiumSSD.includes(vm_size)) {
                errors.push({text:"VM size does not allow Premium SSD", element:"disk_type"});
            }
            
            _disk.error=  errors;
        });
        
    };

    //funkce enable/disabluje Next button, ale jsou problemy:
    //pri nactani blueprintu nelze nastavit disabled rovnou, protoze to neni 1. krok
    //pri volani az pri renderovani to taky nejde, protoze se triggeruje state cele komponenty a to vede k nekonecnemu nacitani
    // (pri setState se prerenderuje cela komponenta)
    //volat pouze když je změna?
    const enableDisableNextButton=(dataDisks: any)=>{
        console.log("Datadisk - enableDisableNextButton");
        let isErrorInDisk = false;
        let _nextButtonState = nextButtonState; //this.state.disableNextButton, pokud je true, pak je tlacitko disablovane
        
        //pokud trigeruju: disableNextButton -->     DisableNextButtonFunc() {this.setState({ disableNextButton: true });
        //pokud trigeruju enableNextButton -->  EnableNextButtonFunc() this.setState({ disableNextButton: false });
        //nextButtonState = {this.state.disableNextButton}

        //je v datadisku nekde chyba?
        dataDisks.forEach((obj: { error: any; key: any; }) => {
            if (obj.error != null && obj.error.length>0) {               
                //toolbox.getEventBus().trigger('blueprint:disableNextButton');
                isErrorInDisk = true;
            }
        });

        //kontrola i OS disku:
        let isErrorInOSDisk = false;
        let vm_size = vmInfo;
        vm_size = vm_size.substring(0,vm_size.indexOf("(")-1);

        
        if (osDiskInfo=='Premium SSD' && VM_Sizes_No_PremiumSSD.includes(vm_size)) {
            isErrorInOSDisk = true;
        }

        let isErrorInDiskCount = false;
        if (selectOnlyServiceConfirmedDisks(dataDisks).length > GetDiskCountLimit()) { 
            isErrorInDiskCount = true;
        }

        if (isErrorInDisk || isErrorInOSDisk || isErrorInDiskCount) {
            //poku je chyba v discich a tlacitko je enabled, pak volam disablovani:
            if (_nextButtonState==false) {
                toolbox.getEventBus().trigger('blueprint:disableNextButton');
            }
        }
        else {
            //pokud neni chyba, ale tlacitko je disablovane, pak volam enablovani:
            if (_nextButtonState==true) {
                toolbox.getEventBus().trigger('blueprint:enableNextButton');
            }
        }
    }

    ValidateDataAllDisks(inputStates);
    enableDisableNextButton(inputStates);

    return (
        <div>
            <DataTable className="agentsGsnCountries table-scroll-gsn">
                <DataTable.Column label="Disk type" name="disk_type" width='10%' />
                <DataTable.Column label="Disk size" name="disk_size" width='10%' />
                <DataTable.Column label="Host caching" name="host_caching" width='10%' />
                <DataTable.Column label={getTableLabelForMountPoint()} name="mount_point" width='30%' />
                <DataTable.Column label="Disk label" name="disk_label" width='35%' />
                <DataTable.Column label="" name="" width='5%' />
                
                {_.map(selectOnlyServiceConfirmedDisks(inputStates), item => (

                    <DataTable.Row key={JSON.stringify(item.key)}>
                        
                        <DataTable.Data style={{ width: '10%', verticalAlign: 'baseline'}}>
                            <Form.Dropdown
                                name="disk_type"
                                selection
                                options={DataDiskOptions}
                                value={item.disk_type}
                                onChange={(e, { value }) => onItemChange(e.target, item, "disk_type", value)} />
                            {htmlRenderErrorState(item.error,"disk_type")}
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
            {renderErrorMessageDiskOverLimit(inputStates, GetDiskCountLimit())}
            <div>Max data disks: {GetDiskCountLimit()}</div>
        </div>
    );

}
