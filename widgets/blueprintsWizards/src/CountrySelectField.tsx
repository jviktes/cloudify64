export function CountrySelectField({
    //input,
    gsnItemData,
    //onChange,
    //error,
    toolbox,
    //dataType,
    //gsnData
    inputStates,
}: {
    //input: Input;
    gsnItemData: any;
    //onChange: OnChange;
    //error: boolean;
    toolbox: Stage.Types.Toolbox;
    //dataType: DataType;
    inputStates: any;
}) {

    const { Form } = Stage.Basic;

    const onRegionChange = (e: any, _item: any) => {
        //console.log("CountrySelectField:" + _item.countryName);
        //console.log("CountrySelectField e.target:" + e);
        //get selected countries:
        //zde do pole impacted_region musi vyplnit vsechny zakrnute regiony
        //zde musim nejak ziskat vsechny vybrane regiony:
        let selectedCountries: any[] = [];  //JSON.parse(inputStates);

        try {
            selectedCountries=JSON.parse(inputStates);
        } catch (error) {
            
        }

        //pokud je e.checked = checked: false
        if (e.checked == true) {
            //pridat do pole:
            if (inputStates.includes(_item.countryName) == false) {
                selectedCountries.push(_item.countryName);
            }
        }
        else {
            if (inputStates.includes(_item.countryName) == true) {
                //selectedCountries.pop(_item.countryName);
                const index = selectedCountries.indexOf(_item.countryName);
                selectedCountries.splice(index, 1);
            }
        }

        console.log(e);
        toolbox.getEventBus().trigger('blueprint:setDeploymentIputs', 'impacted_country', JSON.stringify(selectedCountries));
    };
    //pokud je v seznamu inputStates dany region, pak se zaskrtne:
    const isSelected = (_gsnItemData: any) => {
        const _isSelected = inputStates.includes(_gsnItemData);
        return _isSelected;
    };
    return (

        <Form.Field>
            {/* {gsnItemData.countryData.region_code} */}
            <Form.Input
                onChange={e => onRegionChange(e.target, gsnItemData)}
                loading={false}
                type="Checkbox"
                //label={gsnItemData.countryName}
                checked={isSelected(gsnItemData.countryName)} />
        </Form.Field>
    );
}
