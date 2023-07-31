//// @ts-nocheck File not migrated fully to TS
import PropTypes from 'prop-types';
import TestsTable from '../../act-log-reader/src/TestsTable';

interface OATTestTableVMProps {
    data: {
        items: PropTypes.array;
        total: number;
        nodeId: string;
        nodeInstanceId: string;
    };
    parrentBlueprint:any
    vmData:any
    widget: Stage.Types.Widget;
    toolbox: Stage.Types.Toolbox;
    menuData:any;
}

// eslint-disable-next-line react/prefer-stateless-function
export default class OATTestTableVM extends React.Component<OATTestTableVMProps> {


    constructor(props: OATTestTableVMProps) {
        super(props);
        this.state = {formattedData: null};
       
    }

    componentDidMount() {
        console.log("OATTestTableVM componentDidMount..."); 
        const { data, toolbox } = this.props;

        {_.map(data.items, item => (   
            this.loadDetailedData(item)
        ))}

        this.loadOATData();

   }

    loadOATData= async () => {
        const { toolbox } = this.props;
        let params = {};
        // const _sortParam = lodash.castArray(params._sort)[0];
        // const _searchParam = lodash.castArray(params._search)[0];
        // const _tenantName =  lodash.castArray(params.tenant)[0];   
        // const _sizeParam = parseInt(lodash.castArray(params._size)[0]);
        // const _offsetparam = parseInt(lodash.castArray(params._offset)[0]);

        const manager = toolbox.getManager();
        const tenantName=manager.getSelectedTenant();

        params.tenant = tenantName;
        params._size = 20;
        params._offset = 0;
        params._search = this.props.vmData.id;
        params._sort = "testDatum";

        const _dataFromExternalSource = await toolbox.getWidgetBackend().doGet('filesVMAPI', { params });

        const formattedData = {
            items: _dataFromExternalSource.itemsData,
            total: _dataFromExternalSource.total,
        };
        this.setState({formattedData});

        //return formattedData;

        // let rootBlueprintsData=this.state.rootBlueprintsData;
        // rootBlueprintsData = _dataFromExternalSource;
        // this.setState({rootBlueprintsData});

    }

    render() {
        /* eslint-disable no-console, no-process-exit */
        const { toolbox, widget,data,menuData } = this.props;
        const { DataTable } = Stage.Basic;
        const { formattedData } = this.state;

        return (
            <div>
                <div><span style={{fontWeight:"bold"}}>OAT tests</span></div>
                {formattedData ? (
                <TestsTable widget={widget} data={formattedData} toolbox={toolbox} />
                ) : (
                <div>Loading data...</div> // You can show a loading message while data is being fetched
                )}
            </div>
        );
    }
}



OATTestTableVM.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    data: PropTypes.array
};
