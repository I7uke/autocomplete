import { action, computed, makeObservable, observable } from "mobx";


export default class StoreCmpntAutocomplete {
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

    constructor() {
        this.eventInputFocus = this.eventInputFocus.bind(this);
        this._isOpen_observable = false;

        makeObservable<this,
            '_isOpen_observable'>(this, {
                _isOpen_observable: observable.ref,
                setStatusOpen: action,
                eventInputFocus: action,
                isOpen: computed
            });
    }
}