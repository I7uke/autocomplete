import { action, computed, makeObservable, observable } from "mobx";
import { Button } from "../../button";
import { ModelWithUuid } from "../../../models/modelWithUuid";
import { v4 as uuidv4 } from 'uuid';

type ButtonProps = Parameters<typeof Button>[number];
export type InternalButtonProps = ButtonProps & ModelWithUuid;

interface Init {
    readonly leftButtons?: ButtonProps[];
    readonly rightButtons?: ButtonProps[];
    readonly value?: string;
}

export default class StoreCmpntTextWithButtons {
    //#region value
    /**
     * Текущее значение input
     */
    private _value_observable: string;

    /**
     * Установить значение input
     * @param text 
     */
    public setValue(text: string) {
        this._value_observable = text;
    }

    /**
     * Текущее значение input
     */
    get value() {
        return this._value_observable;
    }

    /**
     * Событие значение input изменено
     * @param e 
     */
    public eventChangeValue(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const selectedValue: string | undefined = e.currentTarget.value;
        this._value_observable = typeof selectedValue === 'string' ? selectedValue : '';
    }
    //#endregion

    /**
     * Добавить uuid к каждому элементу списка кнопок
     * @param buttonsList 
     * @returns 
     */
    private _addUuidToButtonsList(buttonsList: ButtonProps[]): InternalButtonProps[] {
        const result: InternalButtonProps[] = [];
        if (!Array.isArray(buttonsList)) {
            return result;
        }

        for (const item of buttonsList) {
            result.push({
                uuid: uuidv4(),
                ...item
            });
        }

        return result;
    }

    //#region leftButtons
    /**
     * Кнопки левой панели
     */
    private _leftButtons_observable: InternalButtonProps[];

    /**
     * Установить кнопки левой панели
     * @param buttons 
     */
    public setLeftButtons(buttons: ButtonProps[]) {
        this._leftButtons_observable = this._addUuidToButtonsList(buttons);
    }

    /**
     * Кнопки левой панели
     */
    get leftButtons() {
        return this._leftButtons_observable;
    }
    //#endregion

    //#region rightButtons
    /**
     * Кнопки правой панели
     */
    private _rightButtons_observable: InternalButtonProps[];

    /**
     * Установить кнопки правой панели
     * @param buttons 
     */
    public setRightButtons(buttons: ButtonProps[]) {
        this._rightButtons_observable = this._addUuidToButtonsList(buttons);
    }

    /**
     * Кнопки правой панели
     */
    get rightButtons() {
        return this._rightButtons_observable;
    }
    //#endregion

    constructor(init?: Init) {
        this.eventChangeValue = this.eventChangeValue.bind(this);

        let value: string = '';
        let leftButtons: InternalButtonProps[] = [];
        let rightButtons: InternalButtonProps[] = [];

        if (init) {
            if (typeof init.value === 'string') {
                value = init.value;
            }

            if (Array.isArray(init.leftButtons)) {
                leftButtons = this._addUuidToButtonsList(init.leftButtons);
            }

            if (Array.isArray(init.rightButtons)) {
                rightButtons = this._addUuidToButtonsList(init.rightButtons);
            }
        }

        this._value_observable = value;
        this._leftButtons_observable = leftButtons;
        this._rightButtons_observable = rightButtons;

        makeObservable<this,
            '_value_observable'
            | '_leftButtons_observable'
            | '_rightButtons_observable'>(this, {
                _value_observable: observable.ref,
                _leftButtons_observable: observable.ref,
                _rightButtons_observable: observable.ref,
                setValue: action,
                setLeftButtons: action,
                setRightButtons: action,
                eventChangeValue: action,
                value: computed,
                leftButtons: computed,
                rightButtons: computed
            });
    }
}