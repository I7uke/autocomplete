import { action, computed, makeObservable, observable } from "mobx";
import { AutocompleteItem } from "../models/autocompleteItem";
import { getCountryByName } from "../../../api/apiService";
import { v4 as uuidv4 } from 'uuid';

interface BaseItemsStatus<TStatus extends string> {
    readonly status: TStatus;
}

interface ItemsStatusEmpty extends BaseItemsStatus<'empty'> {}
interface ItemsStatusLoading extends BaseItemsStatus<'loading'> {}
interface ItemsStatusSuccess extends BaseItemsStatus<'success'> {
    readonly itemsList: AutocompleteItem[];
}

type ItemsStatus = ItemsStatusEmpty | ItemsStatusLoading | ItemsStatusSuccess;


export default class StoreCmpntAutocomplete {
    private _timerId?: NodeJS.Timeout;

    //#region isOpen
    private _isOpen_observable: boolean;

    public setStatusOpen(status: boolean) {
        if (status === this._isOpen_observable) {
            return;
        }

        this._isOpen_observable = status;
    }

    get isOpen(): boolean {
        return this._isOpen_observable;
    }
    //#endregion

    public eventInputFocus() {
        if(this._isOpen_observable) {
            return;
        }

        this._isOpen_observable = true;
    }

    //#region value
    /**
     * Текущее значение input
     */
    private _value_observable: string;

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
        const value =  typeof selectedValue === 'string' ? selectedValue : '';
        this._value_observable = value;

        if(this._timerId) {
            clearTimeout(this._timerId);
            this._timerId = undefined;
        }

        this._timerId = setTimeout(()=>{
            if(!value) {
                this._setItemsStatus({
                    status: 'empty'
                });

                return;
            }

            this._serverRequestGetCountries(value);
            this._timerId = undefined;
        }, 400);
    }
    //#endregion

    //#region itemsStatus
    private _itemsStatus_observable: ItemsStatus;

    private _setItemsStatus(status: ItemsStatus) {
        this._itemsStatus_observable = status;
    }

    get itemsStatus() {
        return this._itemsStatus_observable;
    }
    //#endregion

    private _serverRequestGetCountries(countryName: string) {
        if(!countryName) {
            return;
        }

        this._setItemsStatus({
            status: 'loading'
        });

        getCountryByName(countryName)
        .then((itemsList)=>{
            const result: AutocompleteItem[] = [];

            for(const item of itemsList) {
                result.push({
                    uuid: uuidv4(),
                    fullName: item.fullName,
                    name: item.name,
                    imgUrlFlag: item.flag
                });
            }

            if(!result.length) {
                this._setItemsStatus({
                    status: 'empty'
                });

                return;
            }

            this._setItemsStatus({
                status: 'success',
                itemsList: result
            });
        })
        .catch(()=>{
            this._setItemsStatus({
                status: 'empty'
            });
        })



    }

    constructor() {
        this.eventInputFocus = this.eventInputFocus.bind(this);
        this.eventChangeValue = this.eventChangeValue.bind(this);
        this._isOpen_observable = false;
        this._value_observable = '';
        this._itemsStatus_observable = {
            status: 'empty'
        };
        this._timerId = undefined;

        makeObservable<this,
            '_isOpen_observable'
            | '_value_observable'
            | '_itemsStatus_observable'
            | '_setItemsStatus'>(this, {
                _isOpen_observable: observable.ref,
                _value_observable: observable.ref,
                _itemsStatus_observable: observable.ref,
                setStatusOpen: action,
                eventInputFocus: action,
                eventChangeValue: action,
                _setItemsStatus: action,
                isOpen: computed,
                value: computed,
                itemsStatus: computed
            });
    }
}