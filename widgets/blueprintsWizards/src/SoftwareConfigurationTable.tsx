import { DataTable } from 'cloudify-ui-components';

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

    const onItemChangeSW = (e: any, _item:any, _value:any)=> {
        console.log("onItemChangeSW:" + _item);
        console.log("onItemChangeSW e.target:" + e);
        console.log("onItemChangeSW value:" + _value);

        let swConfigs = inputStates;

        var  _par= getParameterName(_item);

        console.log("onItemChangeSW value:" + _par);

        for (let index = 0; index < swConfigs.length; index++) {
            const element = swConfigs[index];

            if (element.hasOwnProperty(_par)) {
                element.default = _value;
                break;
            }

        }
        
        toolbox.getEventBus().trigger('blueprint:setDeploymentIputs','service_names',JSON.stringify(swConfigs));

    }

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

    const returnHtmlInput = (_item: any) => {

            if (_item.input_type == "text_box") {
                return (<Form.Input
                    name={uniqueID()}
                    key={uniqueID()}
                    value={_item.default}
                    onChange={(e, { value }) => onItemChangeSW(e.target,_item,value)}
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
                    onChange={(e, { value }) => onItemChangeSW(e.target,_item,value)}
                    disabled={_item.read_only}
                />
                )
            }  
            return (<Form.Input
                type="text"
                value={_item.default}
                onChange={(e, { value }) => onItemChangeSW(e.target,_item,value)}
                disabled={_item.read_only}
            />)
    }

    const getItemLabel = (_item: any) => {
        if (_item.display_name != undefined) {
            return _item.display_name;
        }
        else {
            return getParameterName(_item)
        }
    } 

    var uniqueID = function () {
        return '_' + Math.random().toString(36).slice(2, 11);
    };


    if (inputStates==null || inputStates==undefined || inputStates.length==0) {
         return (<div style={{overflow: "visible",padding:"10px"}}>This product has no additional software configurations</div>)  
    }
    else {
        return (

            <div>
                        
                        <DataTable className="agentsGsnCountries table-scroll-gsn" noDataMessage={"This product has no additional software configurations"}>
                        <DataTable.Column label="Parameter" name="parameter_name" width='10%' />
                        <DataTable.Column label="Value" name="input_value" width='10%' />

                        {_.map(inputStates, item => (
                                <DataTable.Row key={uniqueID()} >
    
                                    <DataTable.Data style={{ width: '10%' }}> {getItemLabel(item)}
                                    </DataTable.Data>
    
                                    <DataTable.Data style={{ width: '10%' }}>
                                        {returnHtmlInput(item)}
                                    </DataTable.Data>
    
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