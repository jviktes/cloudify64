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
    widget,
    dataTypes,
    workflowName,
}: {
    inputs: Record<string, any>;
    onChange: OnChange;
    inputsState: Record<string, any>;
    errorsState: Record<string, any>;
    toolbox: Stage.Types.WidgetlessToolbox;
    widget: Stage.Types.Widget;
    dataTypes?: Record<string, any>;
    workflowName:String;
}) {

    const isItem= () => {
        return typeof inputsState !== 'undefined' && inputsState.hasOwnProperty("account_role");
      }
      
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

                return <div className="field">

                    <label style={{ display: "inline-block" }}>{input.display_label}</label>
                    <div>{errorsState[input.name]}</div>
                    <table style={{ width: '60%' }}>
                        {_.map(_roles, _item => (
                            <tr style={{ height: '2em' }}>

                                <td style={{ width: '33%' }}><label style={{fontWeight:700}} label-for={input.name}>{_item}</label></td>
                                <td><Form.Input
                                    name={input.name}
                                    value={_item}
                                    key={String(input.name)}
                                    id={String(input.name)}
                                    
                                    //checked={isItemChecked(_item)}
                                    //onChange={(e, { value }) => onItemChangeSW(e.target,_item,value)}
                                    onChange = {onChange}
                                    type="Checkbox"
                                    
                                    //disabled={_item.read_only}
                                /></td>
                            </tr>
                            
                        ))}
                    </table>
                    </div>

            }
            else {

                //clean value:
                let _value = "";
                if (input.name!="approve") {

                    try {
                        if (typeof value !== 'undefined' && value !== null) {

                            if (typeof value === "number" && !isNaN(value)) 
                            {
                                //console.log("The value is a number.");
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
                            else //string:
                            {
                                //console.log("The value is not a number.");
                                _value = value.replace(/^"(.*)"$/, '$1');
                            }

                            //odstranen nadbytecnych uvozovek pro stringy:
                            if (input.name=="service_account_name" && value.trim().length === 0) {
                                let serviceAccountPrefix = widget.configuration.serviceAccountPrefix;
                                _value=String(serviceAccountPrefix);
                            }

                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
                else {
                    _value=value;
                }

                return (
                    <FormField
                        input={input}
                        value={_value}
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
