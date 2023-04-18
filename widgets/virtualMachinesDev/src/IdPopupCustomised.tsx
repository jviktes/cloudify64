import type { FunctionComponent } from 'react';
import React from 'react';
import _ from 'lodash';
import i18n from 'i18next';
import { CopyToClipboardButton, Label, Popup } from '../../../app/components/basic';

interface IdPopupCustomisedProps {
    buttonPosition?: 'left' | 'right';
    id: string;
    selected?: boolean;
    data:string;
}

const IdPopupCustomised: FunctionComponent<IdPopupCustomisedProps> = ({ buttonPosition = 'left', id = '',data='', selected = true }) => {
    //const button = <CopyToClipboardButton content={i18n.t('shared.idPopup.copyButton')} text={id} />;

    return (
        <Popup
            wide
            hoverable
            position="right center"
            onClick={(e: React.MouseEvent<HTMLElement>) => e.stopPropagation()}
        >
            <Popup.Trigger>
                <Label style={{ opacity: selected ? '1' : '0.2' }}>{i18n.t('shared.idPopup.label')}</Label>
            </Popup.Trigger>
            <Popup.Content>
                <div className="noWrap" style={{ display: 'flex', alignItems: 'center' }}>
                    {buttonPosition === 'left' ? (
                        <>
                            <CopyToClipboardButton content={i18n.t('shared.idPopup.copyButton')} text={id} />
                            <strong style={{ marginLeft: 5 }}>{id}</strong>

                            <CopyToClipboardButton content={i18n.t('shared.idPopup.copyButton')} text={data} />
                            <strong style={{ marginLeft: 5 }}>{data}</strong>

                        </>
                    ) : (
                        <>
                            <strong style={{ marginRight: 5 }}>{data}</strong>
                            <CopyToClipboardButton content={i18n.t('shared.idPopup.copyButton')} text={data} />
                        </>
                    )}
                </div>
            </Popup.Content>
        </Popup>
    );
};

export default IdPopupCustomised;
