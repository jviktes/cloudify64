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
    dataTypes
}: {
    inputs: Record<string, any>;
    onChange: OnChange;
    inputsState: Record<string, any>;
    errorsState: Record<string, any>;
    toolbox: Stage.Types.WidgetlessToolbox;
    dataTypes?: Record<string, any>;
}) {
    const inputFields = _(inputs)
        .map((input, name) => ({ name, ...input }))
        .reject('hidden')
        .sortBy([input => !_.isUndefined(input.default), 'name'])
        .map(input => {
            const dataType = !_.isEmpty(dataTypes) && !!input.type ? dataTypes![input.type] : undefined;
            const value = normalizeValue(input, inputsState, dataType);

            if (input.name=="account_role"){
               
                //tady musi byt nejaky for-each pro vsecny constrinst:


                let _roles=[];

                for (const key in input.constraints[0].valid_values) {
                    if (Object.prototype.hasOwnProperty.call(input.constraints[0].valid_values, key)) {
                        const _role = input.constraints[0].valid_values[key];
                        _roles.push(_role); 
                    }
                }


                return <div className="field"><label style={{ display: "inline-block" }}>{input.display_label}</label>

                     {_.map(_roles, _item => (
    

                        <Form.Input
                            name={input.name}
                            value={_item}
                            // key={_item.key}
                            // id={_item.key}
                            label={_item}
                            //checked={parsingValueBoolean(_item)}
                            onChange={onChange}
                            type="Checkbox"
                            //disabled={_item.read_only}
                        />

                    ))}

                </div>

            }
            else if (input.name=="user_id"){
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
