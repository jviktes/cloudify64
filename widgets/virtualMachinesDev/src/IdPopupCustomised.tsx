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
                <Label style={{ opacity: selected ? '1' : '0.2' }}>ID</Label>
            </Popup.Trigger>
            <Popup.Content>
                <div className="noWrap" style={{ display: 'content', alignItems: 'center' }}>
                    {buttonPosition === 'left' ? (
                        <>
                            <div>
                                <CopyToClipboardButton content={i18n.t('shared.idPopup.copyButton')} text={id} />
                                <strong style={{ marginLeft: 5 }}>VM name: {id}</strong>
                                
                            </div>

                            <div>
                                <CopyToClipboardButton content={i18n.t('shared.idPopup.copyButton')} text={data} />
                                <strong style={{ marginLeft: 5 }}>Blueprint: {data}</strong>
                            </div>
                        </>
                    ) : (
                        <>
                            <div>
                                <CopyToClipboardButton content={i18n.t('shared.idPopup.copyButton')} text={id} />
                                <strong style={{ marginRight: 5 }}>VM name: {id}</strong>
                               
                            </div>
                            <div>
                                <CopyToClipboardButton content={i18n.t('shared.idPopup.copyButton')} text={data} />
                                <strong style={{ marginRight: 5 }}>Blueprint: {data}</strong>
                            </div>
                        </>
                    )}
                </div>
            </Popup.Content>
        </Popup>
    );
};

export default IdPopupCustomised;
