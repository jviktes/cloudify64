export function RegionSelectField({
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
    inputStates: any;
}) {


    const { Form } = Stage.Basic;
    // funkce vyplni vybranou business services do pole Input:
    const onRegionChange = (e: any, _item: any) => {
        //get selected countries:
        //zde do pole impacted_region musi vyplnit vsechny zakrnute regiony
        //zde musim nejak ziskat vsechny vybrane regiony:
        let selectedRegions: any[] = []; //["OCEANIA", "AMERICAS"];//JSON.parse(JSON.stringify(inputStates));

        try {
            selectedRegions=JSON.parse(inputStates);
        } catch (error) {
            
        }

        if (e.checked == true) {
            //pridat do pole:
            if (inputStates.includes(_item) == false) {
                selectedRegions.push(_item);
            }
        }
        else {
            if (inputStates.includes(_item) == true) {
                const index = selectedRegions.indexOf(_item);
                selectedRegions.splice(index, 1);
            }
        }
        toolbox.getEventBus().trigger('blueprint:setDeploymentIputs', 'impacted_region', JSON.stringify(selectedRegions)); //["OCEANIA", "AMERICAS"]
    };
    //pokud je v seznamu inputStates dany region, pak se zaskrtne:
    const isSelected = (_gsnItemData: any) => {
        const _isSelected = inputStates.includes(_gsnItemData);
        return _isSelected;
    };

    return (

        <Form.Field>

            <Form.Input
                onChange={e => onRegionChange(e.target, gsnItemData)}
                loading={false}
                type="Checkbox"
                //label={gsnItemData}
                checked={isSelected(gsnItemData)}
                title={"Select all countries from region"} />
            {/* {gsnItemData} */}
        </Form.Field>
    );
}
