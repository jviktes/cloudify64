import { DEFAULT_TEXTAREA_ROWS } from '../../common/src/inputs/consts';
import BlueprintIdInputField from '../../common/src/inputs/fields/BlueprintIdInputField' ;// ./fields/BlueprintIdInputField'; '../../common/src/Consts';
import BooleanInputField from '../../common/src/inputs/fields/BooleanInputField';
import CapabilityValueInputField from '../../common/src/inputs/fields/CapabilityValueInputField';
import DeploymentIdInputField from '../../common/src/inputs/fields/DeploymentIdInputField';
import GenericInputField from '../../common/src/inputs/fields/GenericInputField';
import NodeInstanceInputField from '../../common/src/inputs/fields/NodeInstanceInputField';
import NodeTypeInputField from '../../common/src/inputs/fields/NodeTypeInputField';
import NumberInputField from '../../common/src/inputs/fields/NumberInputField';
import ScalingGroupInputField from '../../common/src/inputs/fields/ScalingGroupInputField';
import SecretKeyInputField from '../../common/src/inputs/fields/SecretKeyInputField';
import StringInputField from '../../common/src/inputs/fields/StringInputField';
import TextareaInputField from '../../common/src/inputs/fields/TextareaInputField';
import ValueListInputField from '../../common/src/inputs/fields/ValueListInputField';
import NodeIdInputField from '../../common/src/inputs/fields/NodeIdInputField';
import getConstraintValueFunction from  '../../common/src/inputs/utils/getConstraintValueFunction'; //'./utils/getConstraintValueFunction';

import type { Input, OnChange } from '../../common/src/inputs/types';

function isListComponentInputType(input: Input): boolean {
    return !!(input.item_type && input.type === 'list');
}

function InputField({
    input,
    value,
    onChange,
    error,
    toolbox
}: {
    input: Input;
    value: any;
    onChange: OnChange;
    error: boolean;
    toolbox: Stage.Types.WidgetlessToolbox;
}) {
    const { name, default: defaultValue, type, constraints = [] } = input;

    const getConstraintValue = getConstraintValueFunction(constraints);
    const validValues = getConstraintValue('valid_values');
    const componentType = isListComponentInputType(input) ? input.item_type : type;
    const multiple = isListComponentInputType(input);

    const commonProps = {
        name,
        value: isListComponentInputType(input) && typeof value === 'string' ? JSON.parse(value) : value,
        onChange,
        error,
        defaultValue
    };

    const commonDynamicDropdownFieldProps = {
        ...commonProps,
        toolbox,
        constraints,
        multiple
    };

    // Show only valid values in dropdown if 'valid_values' constraint is set
    if (!_.isNil(validValues)) {
        return <ValueListInputField {...commonProps} multiple={multiple} validValues={validValues} />;
    }

    switch (componentType) {
        case 'boolean':
            return <BooleanInputField {...commonProps} />;
        case 'integer':
        case 'float': {
            const inRange = getConstraintValue('in_range');
            const greaterThan = getConstraintValue('greater_than');
            const greaterOrEqual = getConstraintValue('greater_or_equal');
            const lessThan = getConstraintValue('less_than');
            const lessOrEqual = getConstraintValue('less_or_equal');

            return (
                <NumberInputField
                    {...commonProps}
                    constraints={{ inRange, greaterThan, greaterOrEqual, lessThan, lessOrEqual }}
                    type={componentType}
                />
            );
        }
        case 'textarea': {
            const rows = input?.display?.rows ?? DEFAULT_TEXTAREA_ROWS;
            return <TextareaInputField rows={rows} {...commonProps} />;
        }
        case 'deployment_id':
            return <DeploymentIdInputField {...commonDynamicDropdownFieldProps} />;
        case 'blueprint_id':
            return <BlueprintIdInputField {...commonDynamicDropdownFieldProps} />;
        case 'node_id':
            return <NodeIdInputField {...commonDynamicDropdownFieldProps} />;
        case 'node_instance':
            return <NodeInstanceInputField {...commonDynamicDropdownFieldProps} />;
        case 'scaling_group':
            return <ScalingGroupInputField {...commonDynamicDropdownFieldProps} />;
        case 'node_type':
            return <NodeTypeInputField {...commonDynamicDropdownFieldProps} />;
        case 'capability_value':
            return <CapabilityValueInputField {...commonDynamicDropdownFieldProps} />;
        case 'secret_key':
            return <SecretKeyInputField {...commonDynamicDropdownFieldProps} />;
        case 'string':
        case 'regex':
            return <StringInputField {...commonProps} />;
        case 'list':
        default:
            return <GenericInputField {...commonProps} />;
    }
}

export default React.memo(InputField);
