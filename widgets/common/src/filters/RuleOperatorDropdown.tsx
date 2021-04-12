import { camelCase } from 'lodash';
import { FunctionComponent, useMemo } from 'react';
import type { DropdownItemProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown/DropdownItem';

import { i18nPrefix } from './consts';
import { FilterRuleRowType, LabelsFilterRuleOperators, AttributesFilterRuleOperators } from './types';
import type { FilterRuleOperator } from './types';

interface RuleOperatorDropdownProps {
    ruleType: FilterRuleRowType;
    onChange: (value: FilterRuleOperator) => void;
    value: FilterRuleOperator;
}

function getDropdownOptions(operators: string[]) {
    const { i18n } = Stage;
    return operators.map(
        (operator): DropdownItemProps => ({
            text: i18n.t(`${i18nPrefix}.operatorsLabels.${camelCase(operator)}`),
            value: operator
        })
    );
}

const RuleOperatorDropdown: FunctionComponent<RuleOperatorDropdownProps> = ({ ruleType, onChange, value }) => {
    const { Dropdown } = Stage.Basic;

    const options = useMemo(() => {
        const operators = Object.values(
            ruleType === FilterRuleRowType.Label ? LabelsFilterRuleOperators : AttributesFilterRuleOperators
        );
        return getDropdownOptions(operators);
    }, [ruleType]);

    return (
        <Dropdown
            clearable={false}
            search
            selection
            selectOnNavigation
            name="ruleOperator"
            options={options}
            onChange={(_event, data) => onChange(data.value as FilterRuleOperator)}
            value={value}
        />
    );
};
export default RuleOperatorDropdown;