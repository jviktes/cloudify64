import type { PollingTimeConfiguration, DataTableConfiguration } from '../../../app/utils/GenericConfig';

export declare namespace TokensWidget {
    export interface DataItem {
        id: string;
        description: string | null;
        // eslint-disable-next-line camelcase
        expiration_date: Date | null;
        // eslint-disable-next-line camelcase
        last_used: Date | null;
        username: string;
        value: string;
        role: string;
    }

    export type DataSortingKeys = 'created_at' | 'id' | 'secret_hash' | 'description' | 'last_used' | 'expiration_date';

    export interface Configuration extends PollingTimeConfiguration, DataTableConfiguration {
        showExpiredTokens: boolean;
    }

    export type Data = Stage.Types.WidgetData<Stage.Types.PaginatedResponse<DataItem>>;
}
