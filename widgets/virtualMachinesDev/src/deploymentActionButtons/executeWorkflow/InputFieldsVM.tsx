import Help from '../../../../common/src/inputs/InputHelp';
import InputField from '../../../../common/src/inputs/InputField';
import getInputFieldInitialValue from '../../../../common/src/inputs/utils/getInputFieldInitialValue';
import type { DataType, Input, OnChange } from '../../../../common/src/inputs/types';
import { Checkbox, Form } from 'semantic-ui-react';

function normalizeValue(input: Input, inputsState: Record<string, any>, dataType: DataType) {
    if ((input.type === 'integer' || input.type === 'float') && Number.isNaN(inputsState[input.name])) {
        return '';
    }
    if (_.isUndefined(inputsState[input.name])) {
        return getInputFieldInitialValue(input.default, input.type, dataType);
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

export default function InputFieldsVM({
    inputs,
    onChange,
    inputsState,
    errorsState,
    toolbox,
    dataTypes,
    workflowName,
}: {
    inputs: Record<string, any>;
    onChange: OnChange;
    inputsState: Record<string, any>;
    errorsState: Record<string, any>;
    toolbox: Stage.Types.WidgetlessToolbox;
    dataTypes?: Record<string, any>;
    workflowName:String;
}) {

    const isItem= () => {
        return typeof inputsState !== 'undefined' && inputsState.hasOwnProperty("account_role");
      }

    //Validace dat?
    const onItemChangeSW = (_e: any, _item:any, _value:any)=> {

         //console.log("onItemChangeSW:" + _item);
        //console.log("onItemChangeSW e.target:" + e);
        //console.log("onItemChangeSW value:" + _value);

            if (workflowName==="request_user_account") {
            //USER ACCOUNT: bud Administrator nebo RemoteDesktopUser:

            // Check if the selected value is "admin"
            if (_value === "Administrator") {
                // Iterate over the checkboxes to find the one with value "user"
                const checkboxes = document.querySelectorAll(`input[name="${_e.name}"]`);
                checkboxes.forEach((checkbox) => {
                  if (checkbox.value === "RemoteDesktopUser" && _e.checked==true) {
                    // Set the checked property to false and make it read-only
                    checkbox.checked = false;
                    checkbox.disabled = true;
                  }
                  if (checkbox.value === "RemoteDesktopUser" && _e.checked==false) {
                      // Set the checked property to false and make it read-only
                      checkbox.checked = true;
                      checkbox.disabled = false;
                    }
                });
              }
          
              if (_value === "RemoteDesktopUser") {
                  // Iterate over the checkboxes to find the one with value "user"
                  const checkboxes = document.querySelectorAll(`input[name="${_e.name}"]`);
                  checkboxes.forEach((checkbox) => {
  
                    if (checkbox.value === "Administrator" && _e.checked==true) {
                      // Set the checked property to false and make it read-only
                      checkbox.checked = false;
                      checkbox.disabled = true;
                    }
                    if (checkbox.value === "Administrator" && _e.checked==false) {
                        // Set the checked property to false and make it read-only
                        checkbox.checked = true;
                        checkbox.disabled = false;
                      }
                  });
              }
            }

            
            //seervisni ucet: request_service_account
            //# Validate roles: Services OR ScheduledJobs OR (Administrator AND (ScheduledJobs OR Services))

            let selectedCheckBoxes: any[] = []; 

            const checkboxes = document.querySelectorAll(`input[name="${_e.name}"]`);
            checkboxes.forEach((checkbox) => {

                if (checkbox.checked==true) {
                    selectedCheckBoxes.push(checkbox.value);
                }
            });

            toolbox.getEventBus().trigger('workflow:setIputs', 'account_role', JSON.stringify(selectedCheckBoxes));

        return;
    }


    const ValidateValue = () =>{

    }
    // const isItemChecked = (_itemToCheck: string) => {
    //     let _savedStates = inputsState["account_role"];

    //     //pokud polozku najdu v sznamu, pak dam checked=true
    //     _savedStates.forEach((item: string) => {

    //         if (item===_itemToCheck) {
    //             return true;
    //         }

    //     });  
    //     return false;
    // }

    ValidateValue();

    const inputFields = _(inputs)
        .map((input, name) => ({ name, ...input }))
        .reject('hidden')
        .sortBy([input => !_.isUndefined(input.default), 'name'])
        .map(input => {
            const dataType = !_.isEmpty(dataTypes) && !!input.type ? dataTypes![input.type] : undefined;
            const value = normalizeValue(input, inputsState, dataType);

            if (input.name=="account_role"){
               
                let _roles=[];

                for (const key in input.constraints[0].valid_values) {
                    if (Object.prototype.hasOwnProperty.call(input.constraints[0].valid_values, key)) {
                        const _role = input.constraints[0].valid_values[key];
                        _roles.push(_role); 
                    }
                }

                return <div className="field"><label style={{ display: "inline-block" }}>{input.display_label}</label>

                    <div>{errorsState[input.name]}</div>

                     {_.map(_roles, _item => (
    
                        <Form.Input
                            name={input.name}
                            value={_item}
                            key={String(input.name)}
                            id={String(input.name)}
                            label={_item}
                            //checked={isItemChecked(_item)}
                            //onChange={(e, { value }) => onItemChangeSW(e.target,_item,value)}
                            onChange = {onChange}
                            type="Checkbox"
                            
                            //disabled={_item.read_only}
                        />

                    ))}

                </div>

            }
            // //TODO: zbytecne:
            // else if (input.name=="user_id"){
            //     return (
            //         <FormField
            //             input={input}
            //             value={value}
            //             onChange={onChange}
            //             error={errorsState[input.name]}
            //             toolbox={toolbox}
            //             dataType={dataType}
                        
            //         />
            //     );
            // }
            else {
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
            }


        })
        .value();

    return <>{inputFields}</>;
}
