import { DataTable } from 'cloudify-ui-components';
//import { Icon } from 'semantic-ui-react';

export function SoftwareConfigurationTable({
    toolbox, inputStates,
}: {
    diskData: any;
    vmInfo: any;
    osInfo: any;
    swInfo: any;
    toolbox: Stage.Types.Toolbox;
    inputStates: any;
}) {

    const { Form } = Stage.Basic;


       const getParameterName = (_item:any) => {
        //tady vybrat to co je navic mimo pole required, input_type: text_box, service_name: wlsvc, defaultX: wlsvc, read_only: true},
        //for cyclus pro cely radek:
        var _parameterName = "";
        for (const key in _item) {
            if (Object.prototype.hasOwnProperty.call(_item, key)) {
                var _key = key.toString();
                //TODO: tady mi to hazi divnou chybu pro !==
                if (_key=='required' || _key=='default' || _key=='input_type' || _key=='default'  || _key=='read_only')
                { 
                    //const element = _item[key];
                    //console.log(element);
                }
                else {
                    console.log(_item[key]);
                    _parameterName = key;
                     break;
                }
            }
        }
        return _parameterName;
    }

    const returnHtmlInput = (_item: any, inputStates:any) => {

            if (_item.input_type == "text_box") {
                return (<Form.Input
                    //type="text"
                    name={_item.default}
                    //name={formField.name}
                    //label={formField.label}
                    value={_item.default}
                    onChange={(e, { value }) => onItemChangeSW(e.target,_item,"sw_drop_down",value,inputStates)}
                    //required={_item.required}
                    disabled={_item.read_only}
                />)
            }    
            if (_item.input_type == "drop_down_list") {
                const dropDownValues = [];
                var _paramName = getParameterName(_item);
                //priprava options:
                let valls = _item[_paramName];
                for (const key in valls[0]) {
                    dropDownValues.push({text:key,name:key,value:key});
                }

                return (<Form.Dropdown
                    name="parameter_value"
                    selection
                    options={dropDownValues}
                    value={_item.default}
                    onChange={(e, { value }) => onItemChangeSW(e.target,_item,"sw_drop_down",value,inputStates)}
                    disabled={_item.read_only}
                />
                )
            }  
            return (<Form.Input
                type="text"
                //name={formField.name}
                //label={formField.label}
                value={_item.default}
                //onChange={onChange}
                onChange={(e, { value }) => onItemChangeSW(e.target,_item,"sw_drop_down",value,inputStates)}
                disabled={_item.read_only}
            />)
    }

    const onItemChangeSW = (e: any, _item:any, _typeProperty:any, _value:any, inputStates:any)=> {
        console.log("onItemChangeSW:" + _item);
        console.log("onItemChangeSW e.target:" + e);
        console.log("onItemChangeSW value:" + _value);

        var  _par= getParameterName(_item);

        console.log("onItemChangeSW value:" + _par);

        for (let index = 0; index < inputStates.length; index++) {
            const element = inputStates[index];

            if (element.hasOwnProperty(_par)) {
                element.default = _value;
                break;
            }

        }
        
        toolbox.getEventBus().trigger('blueprint:setDeploymentIputs','service_names',JSON.stringify(inputStates));
        
    }

    if (inputStates==null) {
         return (<div style={{overflow: "visible",padding:"10px"}}>This product has no additional software configurations</div>)  
    }
    else {
        return (

            <div>
    
                        <DataTable className="agentsGsnCountries table-scroll-gsn" noDataMessage={"This product has no additional software configurations"}>
                        <DataTable.Column label="Parameter" name="parameter_name" width='10%' />
                        {/* <DataTable.Column label="required" name="required" width='10%'  /> */}
                        <DataTable.Column label="Value" name="input_value" width='10%' />
                        {/* <DataTable.Column label="default" name="default" width='10%' /> */}
                        {/* <DataTable.Column label="read_only" name="read_only" width='10%' /> */}
                        
    
                        {_.map(inputStates, item => (
                                <DataTable.Row key={JSON.stringify(item.default)} >
    
                                    {/* <DataTable.Data style={{ width: '10%' }}>{JSON.stringify(item.required)}
                                    </DataTable.Data> */}
    
                                    <DataTable.Data style={{ width: '10%' }}>{getParameterName(item)}
                                    </DataTable.Data>
    
                                    <DataTable.Data style={{ width: '10%' }}>{returnHtmlInput(item,inputStates)}
                                    </DataTable.Data>
    
                                    {/* <DataTable.Data style={{ width: '10%' }}>{item.default}
                                    </DataTable.Data> */}
    
                                    {/* <DataTable.Data style={{ width: '10%' }}>{JSON.stringify(item.read_only)}
                                    </DataTable.Data> */}
    
                                </DataTable.Row>
                        ))}
                        </DataTable>
            </div>
        );
    }

}

// original table for IIS blueprint:
{/* <div>
<DataTable className="agentsGsnCountries table-scroll-gsn" noDataMessage={"This product has no additional software configurations"}>
        <DataTable.Column label="Service name" name="service_name" width='10%'  />
        <DataTable.Column label="Service" name="service" width='10%' />
        <DataTable.Column label="Installed" name="installed" width='10%' />

        {_.map(JSON.parse(inputStates), item => (
                //console.log(returnHtmlInput(item,inputStates))
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
</DataTable> */}