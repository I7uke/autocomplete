import { action, computed, makeObservable, observable } from "mobx";
import { AutocompleteItem } from "../models/autocompleteItem";
import { getCountryByName } from "../../../api/apiService";
import { v4 as uuidv4 } from 'uuid';

interface BaseItemsStatus<TStatus extends string> {
    readonly status: TStatus;
}

interface ItemsStatusEmpty extends BaseItemsStatus<'empty'> { }
interface ItemsStatusLoading extends BaseItemsStatus<'loading'> { }
interface ItemsStatusSuccess extends BaseItemsStatus<'success'> {
    readonly itemsList: AutocompleteItem[];
}

type ItemsStatus = ItemsStatusEmpty | ItemsStatusLoading | ItemsStatusSuccess;

interface Init {
    /**
     * Максимальное количество подсказок
     */
    readonly maxItemsCount: number;
}

export default class StoreCmpntAutocomplete {
    /**
     * id таймера поиска
     */
    private _timerId?: NodeJS.Timeout;
    /**
     * Максимальное количество подсказок
     */
    private readonly _maxItemsCount: number;

    //#region isOpen
    private _isOpen_observable: boolean;

    /**
     * Установить статус меню открыто/закрыто
     * @param status 
     * @returns 
     */
    public setStatusOpen(status: boolean) {
        if (status === this._isOpen_observable) {
            return;
        }

        this._isOpen_observable = status;
    }

    /**
     * Статус меню открыто/закрыто
     */
    get isOpen(): boolean {
        return this._isOpen_observable;
    }
    //#endregion

    /**
     * Событие фокусировки на input, открывает меню
     * @returns 
     */
    public eventInputFocus() {
        if (this._isOpen_observable) {
            // Если меню уже открыто выходим
            return;
        }

        // Открываем меню
        this._isOpen_observable = true;
    }

    /**
     * Событие выбран элемент из списка меню
     * @param e 
     * @returns 
     */
    public eventSelectItem(e: React.MouseEvent<HTMLElement, MouseEvent>) {
        // Получаем uuid элемента
        const uuid = e.currentTarget.getAttribute('data-uuid');

        if(!uuid) {
            return;
        }

        if(this._itemsStatus_observable.status !=='success') {
            // Элементы еще не получены, выходим
            return;
        }

        if(!this._itemsStatus_observable.itemsList.length) {
            // Список элементов пуст, выходим
            return;
        }

        // Ищем элемент по его uuid
        for(const item of this._itemsStatus_observable.itemsList) {
            if(item.uuid === uuid) {
                // Меняем текст input
                this._value_observable = `${item.name}, ${item.fullName}`;

                // Забываем все элементы кроме выбранного
                this._itemsStatus_observable = {
                    status: 'success',
                    itemsList: [item]
                }

                // Закрываем меню
                this._isOpen_observable = false;
                return;
            }
        }
    }

    /**
     * Событие очистить текущее значение
     */
    public eventClear() {
        // Очищаем значение input
        this._value_observable = '';
        // Забываем все подсказки
        this._itemsStatus_observable = {
            status: 'empty'
        };
    }

    /**
     * Событие открыть/закрыть меню
     */
    public eventToggleOpenClose() {
        // Меняем статус на противоположный
        this._isOpen_observable = !this._isOpen_observable;
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
        this._value_observable = typeof selectedValue === 'string' ? selectedValue : '';

        if (this._timerId) {
            // Если уже есть созданный таймер удаляем его
            clearTimeout(this._timerId);
            // Забываем id таймера
            this._timerId = undefined;
        }

        // Делаем запрос не сразу чтобы не создавать лишнюю нагрузку на сервер, даем возможность закончить набирать текст
        this._timerId = setTimeout(() => {
            if (!this._value_observable) {
                this._setItemsStatus({
                    status: 'empty'
                });

                return;
            }

            this._serverRequestGetCountries(this._value_observable);
            this._timerId = undefined;
        }, 400);
    }
    //#endregion

    //#region itemsStatus
    private _itemsStatus_observable: ItemsStatus;

    /**
     * Установить статус элементов меню
     * @param status 
     */
    private _setItemsStatus(status: ItemsStatus) {
        this._itemsStatus_observable = status;
    }

    /**
     * Статус элементов меню
     */
    get itemsStatus() {
        return this._itemsStatus_observable;
    }
    //#endregion

    /**
     * Запрос на сервер получить страны
     * @param countryName 
     * @returns 
     */
    private _serverRequestGetCountries(countryName: string) {
        if (!countryName) {
            // Нечего искать, пустая строка
            return;
        }

        // Устанавливаем статус загрузки
        this._setItemsStatus({
            status: 'loading'
        });

        // Запрос на сервер
        getCountryByName(countryName)
            .then((itemsList) => {
                const result: AutocompleteItem[] = [];
                const uniqueNames: Set<string> = new Set();

                for (const item of itemsList) {
                    if (uniqueNames.has(item.name)) {
                        continue;
                    }

                    result.push({
                        uuid: uuidv4(),
                        fullName: item.fullName,
                        name: item.name,
                        imgUrlFlag: item.flag
                    });

                    uniqueNames.add(item.name);

                    if(result.length >= this._maxItemsCount) {
                        break;
                    }
                }

                if (!result.length) {
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
            .catch(() => {
                // Что то пошло не так, меняем статус на empty
                this._setItemsStatus({
                    status: 'empty'
                });
            })
    }

    constructor(init: Init) {
        this.eventInputFocus = this.eventInputFocus.bind(this);
        this.eventChangeValue = this.eventChangeValue.bind(this);
        this.eventSelectItem = this.eventSelectItem.bind(this);
        this.eventClear = this.eventClear.bind(this);
        this.eventToggleOpenClose=  this.eventToggleOpenClose.bind(this);
        this._isOpen_observable = false;
        this._value_observable = '';
        this._itemsStatus_observable = {
            status: 'empty'
        };
        this._timerId = undefined;
        this._maxItemsCount = init.maxItemsCount;

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
                eventSelectItem: action,
                eventClear: action,
                _setItemsStatus: action,
                isOpen: computed,
                value: computed,
                itemsStatus: computed
            });
    }
}