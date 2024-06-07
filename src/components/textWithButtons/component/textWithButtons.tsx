import { observer } from "mobx-react";
import { SmartComponentProps } from "../../../models/smartComponentProps";
import StoreTextWithButtons, { InternalButtonProps } from "../store/storeTextWithButtons";
import { Button } from "../../button";
import './styles.css';

const InputText = observer((props: SmartComponentProps<StoreTextWithButtons>) => {
    return (
        <textarea
            className={'textWithButtons_inputTextarea'}
            value={props.store.value}
            onChange={props.store.eventChangeValue}
        />
    );
});

interface ButtonsListProps {
    readonly buttonsList: InternalButtonProps[];
}

function ButtonsList(props: ButtonsListProps) {
    const buttonsList = props.buttonsList;

    if (!Array.isArray(buttonsList)) {
        return null;
    }

    if (!buttonsList.length) {
        return null;
    }

    return (
        <div className={'textWithButtons_buttonsContainer'}>
            {buttonsList.map((props) => <Button key={props.uuid} {...props} />)}
        </div>
    );
}

const LeftButtons = observer((props: SmartComponentProps<StoreTextWithButtons>) => {
    const leftButtons = props.store.leftButtons;

    if (!leftButtons.length) {
        return null;
    }

    return (
        <div className={'textWithButtons_leftButtonsContainer'}>
            <ButtonsList buttonsList={leftButtons} />
        </div>
    );
});

const RightButtons = observer((props: SmartComponentProps<StoreTextWithButtons>) => {
    const rightButtons = props.store.rightButtons;

    if(!rightButtons.length) {
        return null;
    }

    return (
        <div className={'textWithButtons_rightButtonsContainer'}>
            <ButtonsList buttonsList={props.store.rightButtons} />
        </div>
    );
});

export default function TextWithButtons(props: SmartComponentProps<StoreTextWithButtons>) {
    return (
        <div className={'textWithButtons_columns'}>
            <LeftButtons store={props.store} />

            <div className={'textWithButtons_inputContainer'}>
                <InputText store={props.store} />
            </div>
            
            <RightButtons store={props.store} />
        </div>
    );
}