import Help from  '../../common/src/inputs/InputHelp'; //'./InputHelp';
import InputField from './InputFieldWizard';
//import getInputFieldInitialValue from '../../common/src/inputs/utils/getInputFieldInitialValue'; //'./utils/getInputFieldInitialValue';
import type { DataType, Input, OnChange } from '../../common/src/inputs/types'; //'./types';
import { DataTable, Form } from 'cloudify-ui-components';
import { Icon } from 'semantic-ui-react';
import { getInputsOrderByCategories } from './wizardUtils';
import { DataDiskTable } from './DataDiskTable';
import { CountrySelectField } from './CountrySelectField';
import { RegionSelectField } from './RegionSelectField';
import { SoftwareConfigurationTable } from './SoftwareConfigurationTable';
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
    const getErrorClassImpcatState=(_input:any)=> {

        if (_input== null  || _input== "" || _input.length==0 ) {
            return "ui fluid icon input ErrorCustomStyle";
        }
        else {
            return "ui fluid icon input";
        }
    }

    const htmlRenderErrorState = (_input:any) => {
        let _htmlResult = null;

        if (_input== null  || _input== "" || _input.length==0 ) {
            _htmlResult = <p style={{ color: 'red'}}>{"Required value"}</p>;
        }
        else {
           
        }
        return _htmlResult;
    };

    return (

            <><div className="field">
            <label style={{ display: "inline-block" }}>{input.display_label}</label>
            <div className="field">
                <div className={getErrorClassImpcatState(value)}>
                    <input
                     style={{backgroundColor:"rgba(0,0,0,.05)"}} value={value} readOnly />
                </div>
                {htmlRenderErrorState(value)}
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
    nextButtonState,
    backButtonState,
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
    nextButtonState:boolean
    backButtonState:boolean
}) {

    inputs = getInputsOrderByCategories(inputs);
    JSON.stringify(backButtonState);
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
 
    const enableDisableNextButton=(inputsState: any)=>{
        let isError = false;
        console.log("impacted_region - enableDisableNextButton");
        //enable NextButon - pokud jsou vsechny OK, toto by nejak melo fungovat:
        //pouze pro vybrane inputs budu validovat:

        let _nextButtonState = nextButtonState; //this.state.disableNextButton, pokud je true, pak je tlacitko disablovane
        
        //pokud trigeruju: disableNextButton -->     DisableNextButtonFunc() {this.setState({ disableNextButton: true });
        //pokud trigeruju enableNextButton -->  EnableNextButtonFunc() this.setState({ disableNextButton: false });
        //nextButtonState = {this.state.disableNextButton}

        //console.log(inputsState);
        if (inputsState!= null) {
            try {
                if (inputsState["impact"]!= null && inputsState["impact"].length==0) {
                    isError = true;
                }

                if (inputsState["impacted_region"]!= null && inputsState["impacted_country"]!= null && inputsState["impacted_region"].length<=2 && inputsState["impacted_country"].length<=2) {
                    isError = true;
                }
            
                if (inputsState["business_service"]!= null && inputsState["business_service"].length==0) {
                    isError = true;
                }
                if (inputsState["business_unit"]!= null && inputsState["business_unit"].length==0) {
                    isError = true;
                }

                if (inputsState["os_disk_type"]!= null) {
                    isError = true;
                }

            } catch (error) {
                console.log(error);
            }
        }

        if (isError) {
            //pokud je chyba a tlacitko je enabled, pak volam disablovani:
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

    const htmlRenderErrorState = (_input:any) => {
        let _htmlResult = null;

        if (_input== null  || _input== "" || _input.length==0 ) {
            _htmlResult = <p style={{ color: 'red'}}>{"Required value"}</p>;
        }
        else {
           
        }
        return _htmlResult;
    };

//inputsState["impacted_region"],inputsState["impacted_country"]
    const htmlRenderErrorStateArrays = (_inputRegion:any,_inputCountry:any) => {
        let _htmlResult = null;
        //TODO: udelat nove pravidlo alespon jedno vybrane
        if (_inputRegion.length<=2 && _inputCountry.length<=2) {
            _htmlResult = <p style={{ color: 'red'}}>{"Required value"}</p>;
        }

        // if (_inputRegion== null  || _inputRegion== "" || _inputRegion.length==0 || _inputRegion=="[]") {
        //     _htmlResult = <p style={{ color: 'red'}}>{"Required value"}</p>;
        // }
        return _htmlResult;
    };

    const getErrorImpcatState=(_input:any)=> {

        if (_input== null  || _input== "" || _input.length==0 || _input=="[]") {
            return true;;//{"chyba":"problem"};
        }
        else {
            return false;
        }
    }

    const getErrorClassImpcatState=(_inputRegion:any,_inputCountry:any) => {

        // if (_input== null  || _input== "" || _input.length==0 || _input=="[]") {
        //     // "agentsBlueprintsGsn table-scroll-gsn"
        //     return "agentsBlueprintsGsn table-scroll-gsn ErrorCustomStyle";
        // }
        // else {
        //     return "agentsBlueprintsGsn table-scroll-gsn ";
        // }
        if (_inputRegion.length<=2 && _inputCountry.length<=2) {
            return "agentsBlueprintsGsn table-scroll-gsn ErrorCustomStyle";
        }
        else {
            return "agentsBlueprintsGsn table-scroll-gsn ";
        }
    }

    const inputFields = _(inputs)
        .map((input, name) => ({ name, ...input }))
        .reject('hidden')
        //.sortBy([input => !_.isUndefined(input.default), 'name'])
        .map(input => {

            const dataType = !_.isEmpty(dataTypes) && !!input.type ? dataTypes![input.type] : undefined;
            const value = normalizeValue(input, inputsState, dataType);

            //pokud pole inputState neobsahuje input, pak se preskakuje, tim se vylouci pole podle wizard kroku:
            if (_.isUndefined(inputsState[input.name])) {
                return ;
            }
            //product_name_
            if (input.name=="product_name") {
               
                //console.log("product_name:"+JSON.stringify(input));
                return <div className="field">
                        <label style={{display:"inline-block"}}>{input.display_label}</label>
                        <div className="field"><div className="ui fluid icon input"><input value={value} readOnly/></div></div>
                    </div>
            }

            //ha_concept:
            if (input.name=="availability_zone") {
                if (inputsState["ha_concept"]=="None") {
                    let _savedValueAvailabilitZoneValue  = allDeploymentInputs["availability_zone"];
                    //musim vratit 'Equal split' do avail zones:
                    if (_savedValueAvailabilitZoneValue!='Equal split') {
                        toolbox.getEventBus().trigger('blueprint:setDeploymentIputs', 'availability_zone','Equal split');
                    }
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

                    let _quantity= getQuantity();

                    if (_quantity==1) {
                        //if default value pro availability zone:
                        let _valueAZone = value; //avail_zone...
                        if (value=='Equal split') {
                            _valueAZone='1 ';
                            let _ha_conceptValue  = allDeploymentInputs["ha_concept"];
                            if (_ha_conceptValue=='Availability zone') {
                                let _savedValueAvailabilitZoneValue  = allDeploymentInputs["availability_zone"];
                                if (_savedValueAvailabilitZoneValue!='1 ') {
                                    toolbox.getEventBus().trigger('blueprint:setDeploymentIputs', 'availability_zone',_valueAZone);
                                }
                            }
                        }
                        return <div className="field"><label style={{ display: "inline-block" }}>{input.display_label}</label>
                                    <Form.Dropdown
                                        name="availability_zone"
                                        selection
                                        options={availabilityOptionsForOne}
                                        value={_valueAZone}
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
                
                enableDisableNextButton(inputsState);

                return <div className="field" style={{marginTop:"80px"}}>
                            <div style={{float:'left'}}>
                                <label className='fieldCustomLabel' style={{ display: "inline-block" }}>{input.display_label}</label>
                                
                                <div className="field" style={{ maxHeight: "150px", width: "20%"}}>
                                        <DataTable className= {getErrorClassImpcatState(inputsState["impacted_region"],inputsState["impacted_country"])} >
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
                                    <DataTable className= {getErrorClassImpcatState(inputsState["impacted_region"],inputsState["impacted_country"])} >
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

                                {htmlRenderErrorStateArrays(inputsState["impacted_region"],inputsState["impacted_country"])}
                            </div>
                            {/* {htmlRenderErrorStateArrays(inputsState["impacted_region"],inputsState["impacted_country"])} */}
                       </div>
            }

            //impacted_country
            if (input.name=="impacted_country") {
                return; //renderd in region
            }

            if (input.name=="data_disks") {
                
                return <div className="field">
                            <label style={{ display: "inline-block" }}>{input.display_label}</label>
                            <DataDiskTable diskData={input} vmInfo={inputsState["vm_size"]} osInfo={inputs["os_type"]} osDiskInfo={allDeploymentInputs["os_disk_type"]} toolbox={toolbox} inputStates={JSON.parse(inputsState[input.name])} swInfo={allDeploymentInputs["service_names"]} nextButtonState={nextButtonState}></DataDiskTable>
                        </div>
            }
            
            if (input.name=="os_disk_type") {

                const DataDiskOptions = [
                    { text: 'Standard HDD', name: 'Standard HDD', value: 'Standard HDD' },
                    { text: 'Standard SSD', name: 'Standard SSD', value: 'Standard SSD' },
                    { text: 'Premium SSD', name: 'Premium SSD', value: 'Premium SSD' },
                ];

                let vm_size = inputsState["vm_size"];
                vm_size = vm_size.substring(0,vm_size.indexOf("(")-1);
    
                const vm_sizes_no_premium_SSD = ["Standard_B2ms","Standard_B2s", "Standard_B4ms", "Standard_B8ms"];

                const htmlRenderErrorState = (_value: any) => {

                    let _htmlResult = null;

                    if (_value=='Premium SSD' && vm_sizes_no_premium_SSD.includes(vm_size)) {
                        _htmlResult = <p style={{ color: 'red'}}>{"VM size not allowed premium SSD"}</p>;
                    }
                    return _htmlResult;

                };

                const onItemChange = (e: any, _value: any) => {
                    console.log("os_disk_type e.target:" + e);
                    toolbox.getEventBus().trigger('blueprint:setDeploymentIputs', 'os_disk_type', _value);                   
                };
                
                return <div className="field"><label style={{ display: "inline-block" }}>{input.display_label}</label>
                    <Form.Dropdown
                        name="os_disk_type"
                        selection
                        options={DataDiskOptions}
                        value={value}
                        onChange={(e, { value }) => onItemChange(e.target,value)}
                    />
                    {htmlRenderErrorState(value)}
                    </div>
            }

            //business_service: 
            if (input.name=="business_service") {

                let _valueCalculated = value;
                if (value.length>0) {
                    gsnData.result.forEach((element: {name: string; u_number: string; }) => {
                        if (element.u_number.toLowerCase().includes(value.toLowerCase())) {
                            _valueCalculated = value+" ("+element.name+")";
                        }
                    });
                }

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
                    error={getErrorImpcatState(value)}
                    toolbox={toolbox}
                    dataType={dataType}
                    />
                    {htmlRenderErrorState(value)}
                </div>

                )
            }

            if (input.name=="location") {

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
                        error={getErrorImpcatState(value)}
                        toolbox={toolbox}
                        dataType={dataType}
                    />
                    {htmlRenderErrorState(value)}
                </div>

                )
            }

            if (input.name=="service_names") {
                
                return (<div>
                            <div className="field"><label style={{ display: "inline-block" }}>{input.display_label}</label></div>
                            <SoftwareConfigurationTable diskData={input} vmInfo={inputsState["vm_size"]} osInfo={inputs["os_type"]} toolbox={toolbox} inputStates={JSON.parse(inputsState[input.name])} swInfo={allDeploymentInputs["service_names"]} nextButtonState={nextButtonState}></SoftwareConfigurationTable>
                        </div>
                        )
            }

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
