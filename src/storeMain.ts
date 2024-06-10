import { StoreCmpntAutocomplete } from "./components/autocomplete";
import { StoreTextWithButtons } from "./components/textWithButtons";

export default class StoreMain {
    readonly storeTextWithButtons1: StoreTextWithButtons;
    readonly storeTextWithButtons2: StoreTextWithButtons;
    readonly storeCmpntAutocomplete1: StoreCmpntAutocomplete;
    readonly storeCmpntAutocomplete2: StoreCmpntAutocomplete;
    
    constructor() {
        this.storeTextWithButtons1 = new StoreTextWithButtons({
            rightButtons: [
                {
                    text: 'Очистить',
                    width: 130,
                    onClick: () => {
                        this.storeTextWithButtons1.setValue('');
                    }
                },
                {
                    text: 'Hello',
                    type: 'secondary',
                    width: 130,
                    onClick: () => {
                        this.storeTextWithButtons1.setValue('Hello world!');
                    }
                }
            ],
        });

        this.storeTextWithButtons2 = new StoreTextWithButtons({
            rightButtons: [
                {
                    text: 'Текст',
                    type: 'secondary',
                    width: 110,
                    onClick: () => {
                        //Показываем текущее значение
                        alert(this.storeTextWithButtons2.value)
                    }
                }
            ],
            leftButtons: [
                {
                    text: 'Число',
                    width: 110,
                    onClick: () => {
                        // Получаем текущее значение
                        const value: string = this.storeTextWithButtons2.value;

                        if (!value) {
                            return;
                        }

                        // Приводим строку к числу
                        const valueNumber: number = Number(this.storeTextWithButtons2.value);

                        if (isNaN(valueNumber)) {
                            return;
                        }

                        // Показываем число
                        alert(valueNumber);
                    }
                }
            ],
        });

        this.storeCmpntAutocomplete1 = new StoreCmpntAutocomplete({
            maxItemsCount: 3
        });

        this.storeCmpntAutocomplete2 = new StoreCmpntAutocomplete({
            maxItemsCount: 10
        });
    }
}