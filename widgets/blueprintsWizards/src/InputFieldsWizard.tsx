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
