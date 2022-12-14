import appPackage from '../../package.json';

const convertVersionStringToNumber = (versionString: string) => Number(versionString.replace(/[^\d]/g, ''));

export default {
    APP_VERSION: convertVersionStringToNumber(appPackage.version),

    CONTEXT_PATH: '/console',

    USER_DATA_PATH: '/userData',
    APP_DATA_PATH: '/appData',

    TOKEN_COOKIE_NAME: 'XSRF-TOKEN',

    EDITION: {
        PREMIUM: 'premium',
        COMMUNITY: 'community'
    },

    LICENSE: {
        EMPTY: 'no_license',
        EXPIRED: 'expired_license',
        ACTIVE: 'active_license'
    } as const,
    NO_LICENSE_ERROR_CODE: 'missing_cloudify_license',
    EXPIRED_LICENSE_ERROR_CODE: 'expired_cloudify_license',

    ROLE: {
        DEFAULT: 'default',
        SYS_ADMIN: 'sys_admin'
    },

    DEFAULT_ADMIN_USERNAME: 'admin',
    DEFAULT_TENANT: 'default_tenant',

    MODE_MAIN: 'main',
    MODE_CUSTOMER: 'customer',
    permissions: {
        STAGE_SERVICES_STATUS: 'stage_services_status',
        STAGE_EDIT_MODE: 'stage_edit_mode',
        STAGE_INSTALL_WIDGETS: 'stage_install_widgets',
        STAGE_MAINTENANCE_MODE: 'stage_maintenance_mode',
        STAGE_CONFIGURE: 'stage_configure',
        STAGE_TEMPLATE_MANAGEMENT: 'stage_template_management',
        CREATE_GLOBAL_RESOURCE: 'create_global_resource',
        LICENSE_LIST: 'license_list',
        LICENSE_UPLOAD: 'license_upload'
    },

    GLOBAL_VISIBILITY: 'global',

    MANAGER_STATUS_OK: 'OK',
    MANAGER_STATUS_FAIL: 'FAIL',
    MAINTENANCE_ACTIVATING: 'activating',
    MAINTENANCE_ACTIVATED: 'activated',
    MAINTENANCE_DEACTIVATED: 'deactivated',

    DEFAULT_ALL: '*',
    PAGE_MANAGEMENT_VIEW: 'view',
    PAGE_MANAGEMENT_EDIT: 'edit',
    PRIVATE_RESOURCE: 'private',
    WIDGET_ID_HEADER: 'widget-id',

    LAYOUT_TYPE: {
        WIDGETS: 'widgets',
        TABS: 'tabs'
    },

    PAGE_PATH: {
        DASHBOARD: '/page/dashboard',
        BLUEPRINTS: '/page/blueprints',
        ERROR_404: '/404',
        ERROR_NO_TENANTS: '/noTenants',
        ERROR: '/error',
        HOME: '/',
        LOGIN: '/login',
        SAML_LOGIN: '/saml-login',
        LOGOUT: '/logout',
        MAINTENANCE: '/maintenance',
        LICENSE: '/license'
    }
} as const;
