import Help from  '../../common/src/inputs/InputHelp'; //'./InputHelp';
import InputField from './InputFieldWizard';
//import getInputFieldInitialValue from '../../common/src/inputs/utils/getInputFieldInitialValue'; //'./utils/getInputFieldInitialValue';
import type { DataType, Input, OnChange } from '../../common/src/inputs/types'; //'./types';
import { DataTable, Form } from 'cloudify-ui-components';
import { Icon } from 'semantic-ui-react';
import { getInputsOrderByCategories } from './wizardUtils';
//TODO - tranlations: import LocationLabels from './LocationLabels';

function normalizeValue(input: Input, inputsState: Record<string, any>, dataType: DataType) {
    if ((input.type === 'integer' || input.type === 'float') && Number.isNaN(inputsState[input.name])) {
        return '';
    }
    if (_.isUndefined(inputsState[input.name])) {
        dataType;
        return '';//getInputFieldInitialValue(input.default, input.type, dataType);
    }
    return inputsState[input.name];
}

function FormField({
    input,
    value,
    onChange,
    error,
    toolbox,
    dataType
}: {
    input: Input;
    value: any;
    onChange: OnChange;
    error: boolean;
    toolbox: Stage.Types.WidgetlessToolbox;
    dataType: DataType;
}) {
    const { name, display_label: displayLabel, default: defaultValue, description, type, constraints } = input;
    const { Form } = Stage.Basic;
    const help = (
        <Help
            description={description}
            type={type}
            constraints={constraints}
            defaultValue={defaultValue}
            dataType={dataType}
        />
    );
    const required = _.isUndefined(defaultValue);
    const booleanType = type === 'boolean';

    return (
        <Form.Field
            key={name}
            error={booleanType ? null : error}
            help={help}
            required={required}
            label={booleanType ? null : displayLabel ?? name}
        >
            <InputField input={input} value={value} onChange={onChange} error={error} toolbox={toolbox} />
        </Form.Field>
    );
}

function FormSearchField({
    input,
    value,
    //onChange,
    //error,
    toolbox,
    //dataType,
    gsnData
}: {
    input: Input;
    value: any;
    onChange: OnChange;
    error: boolean;
    toolbox: Stage.Types.Toolbox;
    dataType: DataType;
    gsnData:any;
}) {
    const { Form } = Stage.Basic;
    const [data, setData] = React.useState(JSON.parse(JSON.stringify(gsnData)));
   
    const [searchText, setsearchText] = React.useState('');

    // funkce vyplni vybranou business services do pole Input:
    const ConfirmSelectedBusinessService = (_item: any)=> {
        console.log("ConfirmSelectedBusinessService:" + _item.u_number);
        toolbox.getEventBus().trigger('blueprint:setDeploymentIputs','business_service',_item.u_number);
    }

    const onSearch = (_filterText: string) => {
        //console.log("searching..."+_filterText);
        setsearchText(_filterText);
        data.result = [];

        gsnData.result.forEach((element: {name: string; u_number: string; }) => {
            //console.log(element);
            if (element.u_number.toLowerCase().includes(_filterText.toLowerCase())||element.name.toLowerCase().includes(_filterText.toLowerCase())) {
                data.result.push(element);
            }
        });     
        setData(data);
    }

    return (

            <><div className="field">
            <label style={{ display: "inline-block" }}>{input.display_label}</label>
            <div className="field">
                <div className="ui fluid icon input">
                    <input style={{backgroundColor:"rgba(0,0,0,.05)"}} value={value} readOnly />
                </div>
            </div>
            </div><div id="id_search_results">

                <Form.Field>
                    <Form.Input
                        icon="search"
                        placeholder="Search Business service ... "
                        value={searchText}
                        onChange={e => onSearch(e.target.value)}
                        loading={false} />
                </Form.Field>
                <div style={{ maxHeight: "150px", overflowY:"scroll"}}>
                    <DataTable
                        className="agentsBlueprintsGsn table-scroll-gsn"
                        sortColumn={"Key"}
                        sortAscending={true}
                    >
                        {/* <DataTable.Column label="Key" name="Key" width="20%" />
                        <DataTable.Column label="Description" name="Description" width="70%" />
                        <DataTable.Column width="10%" name="Action" /> */}

                        {_.map(data.result, item => (
                            <DataTable.Row
                                key={item.u_number}
                                onClick={() => ConfirmSelectedBusinessService(item)}
                            >
                                <DataTable.Data style={{ width: '20%' }}>
                                    {item.u_number}
                                </DataTable.Data>

                                <DataTable.Data style={{ width: '70%' }}>
                                    {item.name}
                                </DataTable.Data>

                                <DataTable.Data className="center aligned rowActions" style={{ width: '10%' }}>
                                    <Icon
                                        name="add"
                                        link
                                        bordered
                                        title="Select business service"
                                        onClick={(event: Event) => {
                                            event.stopPropagation();
                                            ConfirmSelectedBusinessService(item);
                                        } } />
                                </DataTable.Data>

                            </DataTable.Row>
                        ))}
                    </DataTable>
                </div>
            </div></>

       
    );
}

function CountrySelectField({
    //input,
    gsnItemData,
    //onChange,
    //error,
    toolbox,
    //dataType,
    //gsnData
    inputStates,
}: {
    //input: Input;
    gsnItemData: any;
    //onChange: OnChange;
    //error: boolean;
    toolbox: Stage.Types.Toolbox;
    //dataType: DataType;
    inputStates:any;
}) {

    const { Form } = Stage.Basic;

    const onRegionChange = (e: any, _item:any)=> {
        //console.log("CountrySelectField:" + _item.countryName);
        //console.log("CountrySelectField e.target:" + e);
        //get selected countries:
        //zde do pole impacted_region musi vyplnit vsechny zakrnute regiony
        //zde musim nejak ziskat vsechny vybrane regiony:
        
        let selectedCountries = JSON.parse(inputStates);
        
        //pokud je e.checked = checked: false
        if (e.checked==true) {
            //pridat do pole:
            if (inputStates.includes(_item.countryName)==false) {
                selectedCountries.push(_item.countryName);
            }
        }
        else {
            if (inputStates.includes(_item.countryName)==true) {
                selectedCountries.pop(_item.countryName);
            }
        }

        console.log(e);
        toolbox.getEventBus().trigger('blueprint:setDeploymentIputs','impacted_country',JSON.stringify(selectedCountries));
    }
    //pokud je v seznamu inputStates dany region, pak se zaskrtne:
    const isSelected = (_gsnItemData: any)=> {
        const _isSelected = inputStates.includes(_gsnItemData);
        return _isSelected;
    };
    return (
        
        <Form.Field>
        {/* {gsnItemData.countryData.region_code} */}
        <Form.Input
            onChange={e => onRegionChange(e.target, gsnItemData)}
            loading={false} 
            type="Checkbox"
            //label={gsnItemData.countryName}
            checked={isSelected(gsnItemData.countryName)}
            />
        </Form.Field> 
    );
}

function RegionSelectField({
    //input,
    gsnItemData,
    //onChange,
    //error,
    toolbox,
    //dataType,
    //gsnData
    inputStates,
}: {
    //input: Input;
    gsnItemData: any;
    //onChange: OnChange;
    //error: boolean;
    toolbox: Stage.Types.Toolbox;
    inputStates:any;
    //dataType: DataType;
    //gsnData:any;
}) {

    //console.log("GSN data:");
    //console.log(gsnData);
    const { Form } = Stage.Basic;
    //console.log("RegionSelectField inputStates:");
    //console.log(inputStates);

    // funkce vyplni vybranou business services do pole Input:

    const onRegionChange = (e: any, _item:any)=> {
        console.log("ConfirmSelectedBusinessService:" + _item);
        console.log("ConfirmSelectedBusinessService e.target:" + e);
        //get selected countries:
        //zde do pole impacted_region musi vyplnit vsechny zakrnute regiony
        //zde musim nejak ziskat vsechny vybrane regiony:
        
        let selectedRegions = JSON.parse(inputStates);;//["OCEANIA", "AMERICAS"];//JSON.parse(JSON.stringify(inputStates));

        //pokud je e.checked = checked: false
        if (e.checked==true) {
            //pridat do pole:
            if (inputStates.includes(_item)==false) {
                selectedRegions.push(_item);
            }
        }
        else {
            if (inputStates.includes(_item)==true) {
                selectedRegions.pop(_item);
            }
        }

        console.log(e);
        toolbox.getEventBus().trigger('blueprint:setDeploymentIputs','impacted_region',JSON.stringify(selectedRegions)); //["OCEANIA", "AMERICAS"]
    }
    //pokud je v seznamu inputStates dany region, pak se zaskrtne:
    const isSelected = (_gsnItemData: any)=> {
        const _isSelected = inputStates.includes(_gsnItemData);
        return _isSelected;
    };

    return (
        
        <Form.Field>
        
        <Form.Input
            onChange={e => onRegionChange(e.target, gsnItemData)}
            loading={false} 
            type="Checkbox"
            //label={gsnItemData}
            checked={isSelected(gsnItemData)}
            title={"Select all countries from region"}
            />
         {/* {gsnItemData} */}
        </Form.Field> 
    );
}

function DataDiskTable({
    //diskData,
    vmInfo,
    osInfo,
    swInfo,
    toolbox,
    inputStates,
}: {
    diskData: any;
    vmInfo:any;
    osInfo:any;
    swInfo:any;
    toolbox: Stage.Types.Toolbox;
    inputStates:any;
}) {

    const { Form } = Stage.Basic;
    const onItemChange = (e: any, _item:any, _typeProperty:any, _value:any)=> {
        console.log("onItemChange DataDisk:" + _item);
        console.log("DataDisk e.target:" + e);

        let dataDisks = inputStates;
        if (_item!=null) {
                if (_typeProperty=="disk_type" || _typeProperty=="disk_size" || _typeProperty=="host_caching" 
                || _typeProperty=="mountpoint" || _typeProperty=="label") {
                    var changedDataDisk = dataDisks.filter((obj: { key: any; }) => {
                        return obj.key === _item.key
                    })
                    if (changedDataDisk[0]!=null) {
                        changedDataDisk[0][_typeProperty] = _value;
                        ValidateDataDisk(changedDataDisk);
                        toolbox.getEventBus().trigger('blueprint:setDeploymentIputs','data_disks',JSON.stringify(dataDisks));
                    }
                }
        }
        let isErrorInDisk = false;
        //enable NextButon - pokud jsou vsechny OK, toto by nejak melo fungovat:
        dataDisks.forEach((obj: { error: any; key:any }) => {
            if (obj.error!="") {
                console.log("label is empty for key"+obj.key);
                toolbox.getEventBus().trigger('blueprint:dataDiskValidateError');
                isErrorInDisk = true;
            }
        });
        if (!isErrorInDisk) {
            toolbox.getEventBus().trigger('blueprint:dataDiskValidateOK');
        }
    }

    const ValidateDataDisk = (_changedDataDisk:any)=> {
        if (_changedDataDisk[0].label==null || _changedDataDisk[0].label=="" || _changedDataDisk[0].mountpoint==null  || getDiskMountingPointValue(_changedDataDisk[0].mountpoint)=="") {
            _changedDataDisk[0].error = "Label and Mount point may not be blank.";
        }
        else {
            _changedDataDisk[0].error = "";
        }
    }

    const RemoveDisk=(_item: any)=> {
        console.log("RemoveDisk:" + _item.key);
        let dataDisks = inputStates;

        const indexOfObject = dataDisks.findIndex((object: { key: any; }) => {
        return object.key === _item.key;
        });
        dataDisks.splice(indexOfObject, 1);
        toolbox.getEventBus().trigger('blueprint:setDeploymentIputs','data_disks',JSON.stringify(dataDisks));
        onItemChange("removeDiskEvent",null,"label","");
    }
    var uniqueID = function () {
        return '_' + Math.random().toString(36).slice(2, 11);
    };
    const AddDisk= ()=> {
        console.log("AddDisk");
        let dataDisks = inputStates;

        if (dataDisks.length<GetDiskCountLimit()) {
            let newDisk = {"key":uniqueID(),"disk_type":"Standard HDD","disk_size":16,"host_caching":"None", "mountpoint":[{"path":""}],"label":[],"error":""};
            dataDisks.push(newDisk);
            toolbox.getEventBus().trigger('blueprint:setDeploymentIputs','data_disks',JSON.stringify(dataDisks));
            onItemChange("addDiskEvent",newDisk,"label","");
        }
        else {
            alert("limit disk");
        }
    }

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
    }

    const DataDiskOptions = [
        { text: 'Standard HDD', name: 'Standard HDD', value: 'Standard HDD' },
        { text: 'Standard SSD', name: 'Standard SSD', value: 'Standard SSD' },
        { text: 'Premium SSD', name: 'Premium SSD', value: 'Premium SSD' },]
    const DiskSizeOptions = [
        { text: '4GB', name: '4GB', value: 4 },
        { text: '8GB', name: '8GB', value: 8 },
        { text: '16GB', name: '16GB', value: 16 },
        { text: '32GB', name: '32GB', value: 32 },
        { text: '64GB', name: '64GB', value: 64 },
        { text: '128GB', name: '128GB', value: 128 },
        { text: '256GB', name: '256GB', value: 256 },
        { text: '512GB', name: '512GB', value: 512 },]
    const DataDiskHostingCashOptions = [
        { text: 'None', name: 'None', value: 'None' },
        { text: 'ReadOnly', name: 'ReadOnly', value: 'ReadOnly' },
        { text: 'ReadWrite', name: 'ReadWrite', value: 'ReadWrite' },]

    const LetterDiskWindows =    
    [
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
    ]

    const getDiskLabelValue = (_valueLabel: any) => {

        //disk label muze byt zadavan podle nazvu sluzby:
        try {
            if (_valueLabel[0].hasOwnProperty("get_input")) {
                if (swInfo!=null) {
                    console.log(swInfo);
                    let _swInfoParsed = JSON.parse(swInfo);
                    return _swInfoParsed[0].service;
                }
            }
        } catch (error) {

            try {
                if (_valueLabel.hasOwnProperty("get_input")) {
                    if (swInfo!=null) {
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

    }

    const getDiskMountingPointValue = (_valueMountingPoint: any) => {
        try {
            return _valueMountingPoint[0].path;
        } catch (error) {
            return "";
        }
        
    }

    const getDiskLabelValueToBlueprintFormat = (_value: string) => {
        //"label": ["WEB"]
        var _obj = [];
        _obj.push(_value);
        return _obj;
    }

    const getDiskMountpointValueToBlueprintFormat = (_value: string) => {
        //"mountpoint": [{"path": "/web"}],
        var _obj = [];
        _obj.push({"path":_value});
        return _obj;
    }

    const getDiskMountpointValueToBlueprintFormatAny = (_value: any) => {
        //"mountpoint": [{"path": "/web"}],
        var _obj = [];
        _obj.push({"path":_value});
        return _obj;
    }

    const htmlRenderAddButton=(disks:any,diskLimit: number)=> {
        
        let htmlButtonAddPossible = <div style={{float:"right",margin:"3px"}}>
                            <Icon
                            name="add"
                            color='green'
                            link
                            bordered
                            title="Add data disk"
                            onClick={(event: Event) => {
                                event.stopPropagation();
                                AddDisk();
                            } } />
                        </div> 
        let txtTooltip = "Limits of "+diskLimit+" disks reached";
        let htmlButtonLimitReached = <div style={{float:"right",margin:"3px"}}>
                <Icon
                name="add"
                link
                bordered
                disabled
                title={txtTooltip}/>
            </div> 
            
            if (disks.length>=diskLimit) {
                return htmlButtonLimitReached;
            }  
            else {
                return htmlButtonAddPossible;
            }              
        
    }

    const htmlRenderErrorState=(_error:any)=>{
        if (_error=="" || _error==null) {
            return null;
        }
        else {
            return <p style={{ color: 'red' }}>{_error}</p>
        }
    }

    const htmlRenderEmptyErrorState=(_error:any, margin:string)=>{
        if (_error=="" || _error==null) {
            return null;
        }
        else {
            return <p style={{ color: 'red', height:margin}}></p>
        }
    }

    const getOperationtype = () => {
        //console.log(osInfo);

        if (osInfo==undefined ||  osInfo.default==undefined) {return null;}

        if (osInfo.default.toLowerCase()=="windows") {
            return "windows";
        }
        else {
            return "";
        }

    }
    const isRequiredDisk = (item:any) => {
        //console.log(item);
        if (item.required!=null) {
            return true;
        }
        else {
            return false;
        }
    }
    const prepareDiskLetterOptions = (item:any) => {

        let _letters=LetterDiskWindows;
        if (getOperationtype()=="windows") {
            let dataDisks = inputStates;
            dataDisks.forEach((_disk: {mountpoint:any}) => {
                let _usedLetter = getDiskMountingPointValue(_disk.mountpoint);
                _letters = _letters.filter(e => e.value !== _usedLetter);
            });
        }
        let _currentLetter = getDiskMountingPointValue(item.mountpoint);
        _letters.push({ text: _currentLetter, name: _currentLetter, value: _currentLetter});

        return _letters;

    }

    const htmlRenderMountPoint=(item:any)=> {
        if (getOperationtype()=="windows") {
            return (<Form.Dropdown
                name="mount_point"
                selection
                options={prepareDiskLetterOptions(item)}
                value={getDiskMountingPointValue(item.mountpoint)}
                disabled={isRequiredDisk(item)}
                onChange={(e, { value}) => onItemChange(e.target,item,"mountpoint",getDiskMountpointValueToBlueprintFormatAny(value?.toString()))}
            />)
        }
        else {
            return (<Form.Input
                name="mount_point"
                placeholder={'Mount point'}
                value={getDiskMountingPointValue(item.mountpoint)}
                disabled={isRequiredDisk(item)}
                onChange={(e, { value }) => onItemChange(e.target,item,"mountpoint",getDiskMountpointValueToBlueprintFormat(value))}
            />)
        }
    }

    const getTableLabelForMountPoint = () => {
        if (getOperationtype()=="windows"){
            return ("Disk letter");    
        }
        else {
            return ("Mount point");    
        }

    }



    return (
            <div>
                <DataTable className="agentsGsnCountries table-scroll-gsn">
                            <DataTable.Column label="Disk type" name="disk_type" width='10%'  />
                            <DataTable.Column label="Disk size" name="disk_size" width='10%' />
                            <DataTable.Column label="Host caching" name="host_caching" width='10%' />
                            <DataTable.Column label={getTableLabelForMountPoint()} name="mount_point" width='30%'/>
                            <DataTable.Column label="Disk label" name="disk_label"  width='35%'/>
                            <DataTable.Column label="" name=""  width='5%'/>
                    {_.map(inputStates, item => (
                        <DataTable.Row key={JSON.stringify(item.key)} >
                            <DataTable.Data style={{ width: '10%' }}>
                                <Form.Dropdown
                                        name="disk_type"
                                        selection
                                        options={DataDiskOptions}
                                        value={item.disk_type}
                                        onChange={(e, { value }) => onItemChange(e.target,item,"disk_type",value)}
                                />
                                {htmlRenderEmptyErrorState(item.error,'51px')}
                            </DataTable.Data>
                            <DataTable.Data style={{ width: '10%' }}>
                                <Form.Dropdown
                                        name="disk_size"
                                        selection
                                        options={DiskSizeOptions}
                                        value={item.disk_size}
                                        onChange={(e, { value }) => onItemChange(e.target,item,"disk_size",value)}
                                />
                                {htmlRenderEmptyErrorState(item.error,'51px')}
                            </DataTable.Data>
                            <DataTable.Data style={{ width: '10%' }}>
                                <Form.Dropdown
                                        name="host_caching"
                                        selection
                                        options={DataDiskHostingCashOptions}
                                        value={item.host_caching}
                                        onChange={(e, { value }) => onItemChange(e.target,item,"host_caching",value)}
                                />
                                {htmlRenderEmptyErrorState(item.error,'51px')}
                             </DataTable.Data>
                             <DataTable.Data style={{ width: '30%' }}>
                                {htmlRenderMountPoint(item)}
                                {htmlRenderEmptyErrorState(item.error,'40px')}
                             </DataTable.Data>
                             <DataTable.Data style={{ width: '30%' }}>
                                <Form.Input
                                        name="label"
                                        placeholder={'Disk label'}
                                        disabled={isRequiredDisk(item)}
                                        value={getDiskLabelValue(item.label)}
                                        onChange={(e, { value }) => onItemChange(e.target,item,"label",getDiskLabelValueToBlueprintFormat(value))}
                                />
                                {htmlRenderErrorState(item.error)}
                             </DataTable.Data>

                             <DataTable.Data style={{ width: '5%' }}>
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
                         {htmlRenderAddButton(inputStates,GetDiskCountLimit())}
                         <div>Max data disks: {GetDiskCountLimit()}</div>
            </div>
        );
}

export default function InputFields({
    inputs,

    onChange,
    inputsState,
    allDeploymentInputs,
    errorsState,
    toolbox,
    dataTypes,
    gsnData,
    gsnCountries,
    gsnRegions,
    
}: {
    inputs: Record<string, any>;
    onChange: OnChange;
    inputsState: Record<string, any>;
    allDeploymentInputs:Record<string, any>;
    errorsState: Record<string, any>;
    toolbox: Stage.Types.Toolbox;
    dataTypes?: Record<string, any>;
    gsnData:any;
    gsnCountries:any;
    gsnRegions:any;
}) {
    //inputs je nutne srovnat podle poradi, nyni je poradi podle nacteni z blueprint souboru:

    // const cssValidateDisks=()=>{
    //     console.log("cssValidateDisks");
    //     toolbox.refresh();
        
    // };

    //toolbox.getEventBus().on('blueprint:dataDiskValidateError',cssValidateDisks());

    inputs = getInputsOrderByCategories(inputs);
    const getQuantity = ()=> {
        let _quantity  = allDeploymentInputs["quantity"];
        //console.log(_quantity);
        return _quantity;
    };

    const locationTranslationOptions = [
        { text: 'West Europe', name: 'westeurope', value: 'westeurope' },
        { text: 'Southeast Asia', name: 'southeastasia', value: 'southeastasia' },
        { text: 'East US', name: 'eastus', value: 'eastus' },
    ]

    const getTranslatedLocation=(_item:string) => {
        let indexOfObject = locationTranslationOptions.findIndex((object: { value: any; }) => {
            return object.value === _item;
            });
        if (indexOfObject!=-1) {
            return locationTranslationOptions.splice(indexOfObject, 1);
        }
        else {
            return null;
        }
    }
    // const getParameterName = (_item:any) => {
    //     //tady vybrat to co je navic mimo pole required, input_type: text_box, service_name: wlsvc, defaultX: wlsvc, read_only: true},
    //     //for cyclus pro cely radek:
    //     var _parameterName = "";
    //     for (const key in _item) {
    //         if (Object.prototype.hasOwnProperty.call(_item, key)) {
    //             var _key = key.toString();
    //             //TODO: tady mi to hazi divnou chybu pro !==
    //             if (_key=='required' || _key=='default' || _key=='input_type' || _key=='default'  || _key=='read_only')
    //             { 
    //                 //const element = _item[key];
    //                 //console.log(element);
    //             }
    //             else {
    //                 console.log(_item[key]);
    //                 _parameterName = key;
    //                  break;
    //             }
    //         }
    //     }
    //     return _parameterName;
    // }

    
    // const returnHtmlInput = (_item: any, inputStates:any) => {

    //         if (_item.input_type == "text_box") {
    //             return (<Form.Input
    //                 type="text"
    //                 //name={formField.name}
    //                 //label={formField.label}
    //                 value={_item.default}
    //                 onChange={(e, { value }) => onItemChangeSW(e.target,_item,"sw_drop_down",value,inputStates)}
    //                 required={_item.required}
    //             />)
    //         }    
    //         if (_item.input_type == "drop_down_list") {
    //             const dropDownValues = [];
    //             var _paramName = getParameterName(_item);
    //             //priprava options:
    //             let valls = _item[_paramName];
    //             for (const key in valls[0]) {
    //                 dropDownValues.push({text:key,name:key,value:key});
    //             }

    //             return (<Form.Dropdown
    //                 name="parameter_value"
    //                 selection
    //                 options={dropDownValues}
    //                 value={_item.default}
    //                 onChange={(e, { value }) => onItemChangeSW(e.target,_item,"sw_drop_down",value,inputStates)}
    //             />
    //             )
    //         }  
    //         return (<Form.Input
    //             type="text"
    //             //name={formField.name}
    //             //label={formField.label}
    //             value={_item.default}
    //             onChange={onChange}
    //             required={_item.required}
    //         />)
    // }

    // const onItemChangeSW = (e: any, _item:any, _typeProperty:any, _value:any, inputStates:any)=> {
    //     console.log("onItemChangeSW:" + _item);
    //     console.log("onItemChangeSW e.target:" + e);
    //     console.log("onItemChangeSW value:" + _value);

    //     var  _par= getParameterName(_item);

    //     console.log("onItemChangeSW value:" + _par);

    //     for (let index = 0; index < inputStates.length; index++) {
    //         const element = inputStates[index];

    //         if (element.hasOwnProperty(_par)) {
    //             element.default = _value;
    //             break;
    //         }

    //     }

    //     toolbox.getEventBus().trigger('blueprint:setDeploymentIputs','service_names',JSON.stringify(inputStates));
        

    // }

    const inputFields = _(inputs)
        .map((input, name) => ({ name, ...input }))
        .reject('hidden')
        //.sortBy([input => !_.isUndefined(input.default), 'name'])
        .map(input => {
            //console.log(input.name);   
            //console.log(inputsState); 
            const dataType = !_.isEmpty(dataTypes) && !!input.type ? dataTypes![input.type] : undefined;
            const value = normalizeValue(input, inputsState, dataType);

            //pokud pole inputState neobsahuje input, pak se preskakuje, tim se vylouci pole podle wizard kroku:
            if (_.isUndefined(inputsState[input.name])) {
                return ;
            }
            //product_name_
            if (input.name=="product_name") {
                //console.log("form type product_name");
                //console.log("product_name:"+JSON.stringify(input));
                return <div className="field">
                        <label style={{display:"inline-block"}}>{input.display_label}</label>
                        <div className="field"><div className="ui fluid icon input"><input value={value} readOnly/></div></div>
                    </div>
            }

            //ha_concept:
            if (input.name=="availability_zone") {
                //console.log("availability_zone:"+JSON.stringify(input));
                //console.log("inputsState_ha_concept");
                //console.log(inputsState["ha_concept"]);

                if (inputsState["ha_concept"]=="None") {
                    //nebude se renderovat za danych podminek:
                    return;
                }
                else {

                    const availabilityOptionsFull =  [
                        { text: '1', name: '1', value: '1 ' },
                        { text: '2', name: '2', value: '2 ' },
                        { text: '3', name: '2', value: '3 ' },
                        { text: 'Equal split', name: 'Equal split', value: 'Equal split' },
                    ];
                    const availabilityOptionsForOne =  [
                        { text: '1', name: '1', value: '1 ' },
                        { text: '2', name: '2', value: '2 ' },
                        { text: '3', name: '2', value: '3 ' },
                    ]
                    //console.log("quantity");
                    let _quantity= getQuantity();

                    if (_quantity==1) {
                        //if default value:
                        let _value = value;
                        if (value=='Equal split') {
                            _value='1 ';
                        }
                        return <div className="field"><label style={{ display: "inline-block" }}>{input.display_label}</label>
                                    <Form.Dropdown
                                        name="availability_zone"
                                        selection
                                        options={availabilityOptionsForOne}
                                        value={_value}
                                        onChange={onChange}
                                    />
                            </div>
                    }
                    else {
                        return <div className="field"><label style={{ display: "inline-block" }}>{input.display_label}</label>
                                    <Form.Dropdown
                                        name="availability_zone"
                                        selection
                                        options={availabilityOptionsFull}
                                        value={value}
                                        onChange={onChange}
                                    />
                                </div>
                    }

                }
            }

            //impacted_region
            if (input.name=="impacted_region") {
                
                return <div className="field" style={{marginTop:"80px"}}>
                            <div style={{float:'left'}}>
                                <label className='fieldCustomLabel' style={{ display: "inline-block" }}>{input.display_label}</label>
                                <div className="field" style={{ maxHeight: "150px", width: "20%"}}>
                                        <DataTable className="agentsBlueprintsGsn table-scroll-gsn">
                                            <DataTable.Column label="check" name="" style={{display:"none"}}/>
                                            <DataTable.Column label="region" name="" style={{display:"none"}}/>
                                            {_.map(gsnRegions, item => (
                                                <DataTable.Row key={JSON.stringify(item)} >
                                                    <DataTable.Data style={{ width: '20%' }}>
                                                        <RegionSelectField gsnItemData={item} toolbox={toolbox} inputStates={inputsState[input.name]}></RegionSelectField>
                                                    </DataTable.Data>
                                                    <DataTable.Data style={{ width: '20%' }}>
                                                        {item}
                                                    </DataTable.Data>
                                                </DataTable.Row>
                                            ))}
                                        </DataTable>
                                </div>
                            </div>
                            <div style={{float:'left', marginLeft:"20px"}}>
                                <label className='fieldCustomLabel'>Impacted countries</label>
                                <div className="field" style={{ maxHeight: "195px", overflowY:"scroll"}}>
                                    <DataTable className="agentsGsnCountries table-scroll-gsn">
                                        <DataTable.Column label="check" name="" style={{display:"none"}}/>
                                        <DataTable.Column label="country" name="" style={{display:"none"}}/>
                                        {_.map(gsnCountries, item => (
                                            <DataTable.Row key={JSON.stringify(item)} >
                                                <DataTable.Data style={{ width: '20%' }}>
                                                    <CountrySelectField gsnItemData={item} toolbox={toolbox} inputStates={inputsState["impacted_country"]}></CountrySelectField>
                                                </DataTable.Data>
                                                <DataTable.Data style={{ width: '20%' }}>
                                                    {item.countryName}
                                                </DataTable.Data>
                                            </DataTable.Row>
                                        ))}
                                    </DataTable>
                                </div>
                            </div>
                       </div>
            }

            //impacted_country
            if (input.name=="impacted_country") {
                return; //renderd in region
            }

            if (input.name=="data_disks") {
                //console.log("data_disks");
                return <div className="field">
                    <label style={{ display: "inline-block" }}>{input.display_label}</label>
                        <DataDiskTable diskData={input} vmInfo={inputsState["vm_size"]} osInfo={inputs["os_type"]} toolbox={toolbox} inputStates={JSON.parse(inputsState[input.name])} swInfo={allDeploymentInputs["service_names"]}></DataDiskTable>
                </div>
            }
            
            //business_service: 
            if (input.name=="business_service") {
                //console.log("form type business_service");
                //console.log("business_service:"+JSON.stringify(input));

                let _valueCalculated = value;
                gsnData.result.forEach((element: {name: string; u_number: string; }) => {
                    if (element.u_number.toLowerCase().includes(value.toLowerCase())) {
                        _valueCalculated = value+" ("+element.name+")";
                    }
                });

                
                            return ( 
                                <div style={{marginTop: "310px"}}>
                                    <FormSearchField
                                        input={input}
                                        value={_valueCalculated}
                                        onChange={onChange}
                                        error={errorsState[input.name]}
                                        toolbox={toolbox}
                                        dataType={dataType}
                                        gsnData={gsnData}
                                    />
                                </div>
                            )
            }
            //impact: 
            if (input.name=="impact") {
                return (<div style={{width: "20%", marginTop:"5px", marginLeft:"10px", float:"left"}}>
                    <FormField
                    input={input}
                    value={value}
                    onChange={onChange}
                    error={errorsState[input.name]}
                    toolbox={toolbox}
                    dataType={dataType}
                    />
                </div>

                )
            }

            if (input.name=="location") {
                //console.log("location");
                //console.log(input);

                let _locationOptions = [];

                for (const key in input.constraints[0].valid_values) {
                    if (Object.prototype.hasOwnProperty.call(input.constraints[0].valid_values, key)) {
                        const _itemLocation = input.constraints[0].valid_values[key];
                        let translatedItemLocation = getTranslatedLocation(_itemLocation);
                        if (translatedItemLocation!=null && translatedItemLocation.length>0) {
                            _locationOptions.push(translatedItemLocation[0]);
                        }
                        else {
                            _locationOptions.push({ text: _itemLocation, name: _itemLocation, value:_itemLocation});
                        }

                    }
                }

                return <div className="field"><label style={{ display: "inline-block" }}>{input.display_label}</label>
                    <Form.Dropdown
                        name="location"
                        selection
                        options={_locationOptions}
                        value={value}
                        onChange={onChange}
                    />
                </div>
            }
            //business_unit: 
            if (input.name=="business_unit") {
                return (<div style={{width: "20%", marginTop:"5px", float:"left"}}>
                    <FormField
                    input={input}
                    value={value}
                    onChange={onChange}
                    error={errorsState[input.name]}
                    toolbox={toolbox}
                    dataType={dataType}
                    />
                </div>

                )
            }

            if (input.name=="service_names") {
                
                return (<div>
                    <DataTable className="agentsGsnCountries table-scroll-gsn" noDataMessage={"This product has no additional software configurations"}>
                    <DataTable.Column label="Service name" name="service_name" width='10%'  />
                    <DataTable.Column label="Service" name="service" width='10%' />
                    <DataTable.Column label="Installed" name="installed" width='10%' />

                    {_.map(JSON.parse(inputsState[input.name]), item => (
                            <DataTable.Row key={JSON.stringify(item.key)} >
                                <DataTable.Data style={{ width: '10%' }}>{item.service_name}
                                </DataTable.Data>
                                <DataTable.Data style={{ width: '10%' }}>{item.service}
                                </DataTable.Data>
                                <DataTable.Data style={{ width: '10%' }}>
                                    
                                    <Form.Field> 
                                    <Form.Input
                                        type="Checkbox"
                                        checked
                                        />
                                    </Form.Field> 

                                </DataTable.Data>
                            </DataTable.Row>
                    ))}
                    </DataTable>
                </div>)
            }

            // if (input.name=="service_names") {
            //     return (<div>
            //         <DataTable className="agentsGsnCountries table-scroll-gsn" noDataMessage={"This product has no additional software configurations"}>
            //         <DataTable.Column label="Parameter" name="parameter_name" width='10%' />
            //         {/* <DataTable.Column label="required" name="required" width='10%'  /> */}
            //         <DataTable.Column label="Value" name="input_value" width='10%' />
            //         {/* <DataTable.Column label="default" name="default" width='10%' /> */}
            //         {/* <DataTable.Column label="read_only" name="read_only" width='10%' /> */}
                    

            //         //inputStates={}

            //         {_.map(JSON.parse(inputsState[input.name]), item => (
            //                 <DataTable.Row key={JSON.stringify(item.default)} >

            //                     {/* <DataTable.Data style={{ width: '10%' }}>{JSON.stringify(item.required)}
            //                     </DataTable.Data> */}

            //                     <DataTable.Data style={{ width: '10%' }}>{getParameterName(item)}
            //                     </DataTable.Data>

            //                     <DataTable.Data style={{ width: '10%' }}>{returnHtmlInput(item,JSON.parse(inputsState[input.name]))}
            //                     </DataTable.Data>

            //                     {/* <DataTable.Data style={{ width: '10%' }}>{item.default}
            //                     </DataTable.Data> */}

            //                     {/* <DataTable.Data style={{ width: '10%' }}>{JSON.stringify(item.read_only)}
            //                     </DataTable.Data> */}



            //                 </DataTable.Row>
            //         ))}
            //         </DataTable>
            //     </div>)
            // }

            //all normal input fieds:
            return (
                <FormField
                    input={input}
                    value={value}
                    onChange={onChange}
                    error={errorsState[input.name]}
                    toolbox={toolbox}
                    dataType={dataType}
                />
            );

        })
        .value();

    return <>{inputFields}</>;
}
