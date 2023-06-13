import { DataTable } from 'cloudify-ui-components';

export function SoftwareConfigurationTable({
    toolbox, inputStates,nextButtonState,display_label
}: {
    display_label:any;
    diskData: any;
    vmInfo: any;
    osInfo: any;
    swInfo: any;
    toolbox: Stage.Types.Toolbox;
    inputStates: any;
    nextButtonState:any;
}) {

    const { Form } = Stage.Basic;

    const onItemChangeSW = (_e: any, _item:any, _value:any)=> {
        //console.log("onItemChangeSW:" + _item);
        //console.log("onItemChangeSW e.target:" + e);
        //console.log("onItemChangeSW value:" + _value);

        let swConfigs = inputStates;

        var  _par= getParameterName(_item);

        //console.log("onItemChangeSW value:" + _par);

        for (let index = 0; index < swConfigs.length; index++) {
            const element = swConfigs[index];

            if (element.hasOwnProperty(_par)) {
                element[_par] = _value;
                break;
            }
        }
        
        //validation: if (_valueLabel.hasOwnProperty("get_input")) {
        if (_item.limitations!=undefined && _item.limitations[0]!=null) {
            if (_item.limitations[0].hasOwnProperty("regex")) {
                let _regex = _item.limitations[0].regex;
                //_regex="^[a-z]{1,8}$";
                _item.error = null;
                const myRe = new RegExp(_regex, 'g');
                const regResults = myRe.exec(_value);
                //console.log(regResults);
                if (regResults==null) {
                    if (_item.limitations[1]!=null && _item.limitations[1].hasOwnProperty("limitation_desciption")) {
                        _item.error= {text:_item.limitations[1].limitation_desciption};
                    }
                    else {
                        _item.error= {text:"Value have to be according regex: "+ _regex};
                    }
                }
            }
        }
        enableDisableNextButton(_item);
        toolbox.getEventBus().trigger('blueprint:setDeploymentIputs','service_names',JSON.stringify(swConfigs));

    }

    const ValidateAllSWConfigs=(_dataSWConfigs:any) => {

        //console.log("validateAllSWConfigs...");
        var _isErrorAnywhere = false;
        for (let index = 0; index < _dataSWConfigs.length; index++) {
            const _configItem = _dataSWConfigs[index];
            if (_configItem.limitations!=undefined && _configItem.limitations[0]!=null) {
                
                    if (_configItem.limitations[0].hasOwnProperty("regex")) {
                        let _regex = _configItem.limitations[0].regex;
                        //_regex="^[a-z]{1,8}$";
                        _configItem.error = null;
                        const myRe = new RegExp(_regex, 'g');
                        var _paramName = getParameterName(_configItem);
                        var _paramValue = _configItem[_paramName];
                        const regResults = myRe.exec(_paramValue);
                        //console.log(regResults);
                        if (regResults==null) {
                            if (_configItem.limitations[1]!=null && _configItem.limitations[1].hasOwnProperty("limitation_desciption")) {
                                _configItem.error= {text:_configItem.limitations[1].limitation_desciption};
                            }
                            else {
                                _configItem.error= {text:"Value have to be according regex: "+ _regex};
                            }
                            _isErrorAnywhere=true;
                        }
                    }
                
            }
        }

        if (_isErrorAnywhere) {
            //poku je chyba v configu a tlacitko je enabled, pak volam disablovani:
            if (nextButtonState==false) {
                toolbox.getEventBus().trigger('blueprint:disableNextButton');
            }
        }
        else {
            //pokud neni chyba, ale tlacitko je disablovane, pak volam enablovani:
            if (nextButtonState==true) {
                toolbox.getEventBus().trigger('blueprint:enableNextButton');
            }
        }
    }

    const enableDisableNextButton=(_item: any)=>{
        let isErrorInSWConfig = false;
        //enable NextButon - pokud jsou vsechny OK, toto by nejak melo fungovat:

        let _nextButtonState = nextButtonState; //this.state.disableNextButton, pokud je true, pak je tlacitko disablovane
        
        //pokud trigeruju: disableNextButton -->     DisableNextButtonFunc() {this.setState({ disableNextButton: true });
        //pokud trigeruju enableNextButton -->  EnableNextButtonFunc() this.setState({ disableNextButton: false });
        //nextButtonState = {this.state.disableNextButton}

        if (_item.error!=null) {
            isErrorInSWConfig = true;
        }

        if (isErrorInSWConfig) {
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
    const getParameterName = (_item:any) => {
    //tady vybrat to co je navic mimo pole required, type: text_box, service_name: wlsvc, default: wlsvc, read_only: true},
    //for cyclus pro cely radek:
    var _parameterName = "";
    for (const key in _item) {
        if (Object.prototype.hasOwnProperty.call(_item, key)) {
            var _key = key.toString();
            //TODO: tady mi to hazi divnou chybu pro !==
            if (_key=='required' || _key=='default' || _key=='type' || _key=='default'  || _key=='read_only' || _key=='key' || _key== 'limitations' || _key== 'group_name')
            { 
                //const element = _item[key];
                //console.log(element);
            }
            else {
                //console.log(_item[key]);
                _parameterName = key;
                    break;
            }
        }
    }
    return _parameterName;
    }

    const parsingValueBoolean = (_item:any)=> {
        var _paramName = getParameterName(_item);
        if (String(_item[_paramName]).toLowerCase()=="true") {
            return true;
        }
        if (String(_item[_paramName]).toLowerCase()=="false") {
            return false;
        }
        else return _item[_paramName];
    }

    ValidateAllSWConfigs(inputStates);

    const returnHtmlInput = (_item: any) => {

            if (_item.type == "text_box") {
                var _paramName = getParameterName(_item);
                return (<Form.Input
                    name={_item.key}
                    key={_item.key}
                    id={_item.key}
                    value={_item[_paramName]}
                    onChange={(e, { value }) => onItemChangeSW(e.target,_item,value)}
                    disabled={_item.read_only}
                />)
            }    
            if (_item.type == "drop_down_list") {
                const dropDownValues = [];
                var _paramName = getParameterName(_item);
                try {
                    
                    //priprava options:
                    let _limitation_valles = _item["limitations"];
    
                    if (_limitation_valles[0]!=null) {
                        for (const key in _limitation_valles[0].possible_values) {
                            dropDownValues.push({text:key,name:key,value:key});
                        }
                    }
                } catch (error) {
                    
                }

                return (<Form.Dropdown
                    name={_item.key}
                    key={_item.key}
                    id={_item.key}
                    selection
                    options={dropDownValues}
                    value={_item[_paramName]}
                    onChange={(e, { value }) => onItemChangeSW(e.target,_item,value)}
                    disabled={_item.read_only}
                />
                )
            }

            if (_item.type=="check_box") {
                var _paramName = getParameterName(_item);
                return (<div style={{width:"33%"}}><Form.Input
                    name={_item.key}
                    key={_item.key}
                    id={_item.key}
                    checked={parsingValueBoolean(_item)}
                    onChange={(e, { checked }) => onItemChangeSW(e.target,_item,!checked)}
                    type="Checkbox"
                    disabled={_item.read_only}
                /></div>)
            }

            return (<Form.Input
                type="text"
                name={_item.key}
                key={_item.key}
                id={_item.key}
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
    const areItemsGroupBy = (swItems:any) => {
        let res = false;
        swItems.forEach((obj: any) => {
            if (obj.group_name!=null) {
                
                res = true;
            }
        });
       
        return res;

    }

    const htmlRenderErrorState = (_error: any) => {
        let _htmlResult = null;
        if (_error == "" || _error == null) {
            _htmlResult = null;
        }
        else {

            _htmlResult = <p style={{ color: 'red'}}>{_error.text}</p>;
        }
        return _htmlResult ;
    };

    if (inputStates==null || inputStates==undefined || inputStates.length==0) {
         return (<div style={{overflow: "visible",padding:"10px"}}>This product has no additional software configurations</div>)  
    }
    else {
        let _areItemsGroupBy = areItemsGroupBy(inputStates);
        if (_areItemsGroupBy==false) {

            return (
            
                <div>
                                    <div className="field"><label style={{ display: "inline-block" }}>{display_label}</label></div>
                                    <DataTable className="agentsGsnCountries table-scroll-gsn" noDataMessage={"This product has no additional software configurations"}>
    
                                            {/* <DataTable.Column label="Parameter" name="parameter_name" width='10%' />
                                            <DataTable.Column label="Value" name="input_value" width='10%' /> */}
    
                                            {_.map(inputStates, item => (
    
                                                    <DataTable.Row key={item.key+item.key} >
                        
                                                        <DataTable.Data style={{ width: '10%' }}> {getItemLabel(item)}
                                                        </DataTable.Data>
                        
                                                        <DataTable.Data style={{ width: '10%'}}>
                                                            {returnHtmlInput(item)}
                                                            {htmlRenderErrorState(item.error)}
                                                        </DataTable.Data>
                        
                                                    </DataTable.Row>
                                            ))}
                                    </DataTable>
                </div>
            );

        }
        else {
            const grouped = _.groupBy(inputStates, item => item.group_name);
            //console.log(grouped);

            return <div>
                   
                        <DataTable className="agentsGsnCountries table-scroll-gsn" style={{border:'none'}} noDataMessage={"This product has no additional software configurations"}>
                            {_.map(grouped, (group, groupName)  => (
                                <DataTable.Row >
                                    
                                    <DataTable.Data style={{ width: '10%' }}>

                                                    <div className="field"><label style={{ display: "inline-block" }}>{groupName}</label></div>
                                                    <DataTable className="agentsGsnCountries table-scroll-gsn" noDataMessage={"This product has no additional software configurations"}>
                                                    
                                                    {/* <DataTable.Column label="Parameter" name="parameter_name" width='10%' />
                                                    <DataTable.Column label="Value" name="input_value" width='10%' /> */}

                                                    {_.map(group, item => (

                                                            <DataTable.Row key={item.key+item.key} >

                                                                <DataTable.Data style={{ width: '10%' }}> {getItemLabel(item)}
                                                                </DataTable.Data>

                                                                <DataTable.Data style={{ width: '10%'}}>
                                                                    {returnHtmlInput(item)}
                                                                    {htmlRenderErrorState(item.error)}
                                                                </DataTable.Data>

                                                            </DataTable.Row>
                                                    ))}
                                                </DataTable>
                                    </DataTable.Data>

                                </DataTable.Row>
                            ))}
                        </DataTable>
                    
                </div>
        }
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