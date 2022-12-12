//import BlueprintState from './BlueprintState';
import React from 'react';
import { Button } from 'semantic-ui-react';
import type { BlueprintsViewProps } from './types';

export default function BlueprintsTable({
    data,
    fetchData,
    noDataMessage,
    //onCreateDeployment,
    onCreateDeploymentWizard,
    //onDeleteBlueprint,
    onSelectBlueprint,
    //onSetVisibility,
    toolbox,
    widget
}: BlueprintsViewProps) {
    const { DataTable } = Stage.Basic;
    const { Blueprints } = Stage.Common;
    //const { allowedVisibilitySettings } = Stage.Common.Consts;
    const manager = toolbox.getManager();
    const tableName = 'blueprintsTable';
    //const { fieldsToShow } = widget.configuration;

    return (
        <DataTable
            fetchData={fetchData}
            totalSize={data.total}
            pageSize={widget.configuration.pageSize}
            sortColumn={widget.configuration.sortColumn}
            sortAscending={widget.configuration.sortAscending}
            selectable
            searchable
            className={tableName}
            noDataMessage={noDataMessage}
        >
            <DataTable.Column label="Name" name="id" width="80%" />
            <DataTable.Column width="20%" />

            {data.items.map(item => (
                <DataTable.Row
                    id={`${tableName}_${item.id}`}
                    key={item.id}
                    selected={item.isSelected}
                    onClick={Blueprints.Actions.isUploaded(item) ? () => onSelectBlueprint(item) : null}
                >
                    <DataTable.Data>
                        {Blueprints.Actions.isUploaded(item) && (
                            <Blueprints.UploadedImage
                                blueprintId={item.id}
                                tenantName={manager.getSelectedTenant()}
                                width={30}
                            />
                        )}{' '}
                        <a className="blueprintName" href="#!">
                            {item.id}
                        </a>
                    </DataTable.Data>

                    <DataTable.Data className="center aligned rowActions">
                        {Blueprints.Actions.isCompleted(item) && (
                            <>
                                {Blueprints.Actions.isUploaded(item) && (
                                    <>
                                        <Button
                                        icon="wizard"
                                        content="Create"
                                        basic
                                        labelPosition="left"
                                        title="Run deployment wizard"
                                        onClick={event => {
                                            event.stopPropagation();
                                            onCreateDeploymentWizard(item);
                                        }}
                                        />
                                    </>
                                )}
                            </>
                        )}
                    </DataTable.Data>
                </DataTable.Row>
            ))}
        </DataTable>
    );
}
