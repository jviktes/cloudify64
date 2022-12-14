// @ts-nocheck File not migrated fully to TS
import TenantPropType from './props/TenantPropType';

export default class MenuAction extends React.Component {
    static EDIT_USERS_ACTION = 'users';

    static EDIT_USER_GROUPS_ACTION = 'user-groups';

    static DELETE_TENANT_ACTION = 'delete';

    onDropdownChange = (event, { name }) => {
        const { onSelectAction, tenant } = this.props;
        onSelectAction(name, tenant);
    };

    render() {
        const { PopupMenu, Menu } = Stage.Basic;

        return (
            <PopupMenu>
                <Menu pointing vertical>
                    <Menu.Item
                        icon="user"
                        content="Edit users"
                        name={MenuAction.EDIT_USERS_ACTION}
                        onClick={this.onDropdownChange}
                    />
                    <Menu.Item
                        icon="users"
                        content="Edit user groups"
                        name={MenuAction.EDIT_USER_GROUPS_ACTION}
                        onClick={this.onDropdownChange}
                    />
                    <Menu.Item
                        icon="trash"
                        content="Delete"
                        name={MenuAction.DELETE_TENANT_ACTION}
                        onClick={this.onDropdownChange}
                    />
                </Menu>
            </PopupMenu>
        );
    }
}

MenuAction.propTypes = {
    tenant: TenantPropType.isRequired,
    onSelectAction: PropTypes.func.isRequired
};
