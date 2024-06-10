import { StoreCmpntAutocomplete } from "./components/autocomplete";
import { StoreCmpntTextWithButtons } from "./components/textWithButtons";

export default class StoreMain {
    readonly storeCmpntTextWithButtons1: StoreCmpntTextWithButtons;
    readonly storeCmpntTextWithButtons2: StoreCmpntTextWithButtons;
    readonly storeCmpntAutocomplete1: StoreCmpntAutocomplete;
    readonly storeCmpntAutocomplete2: StoreCmpntAutocomplete;
    
    constructor() {
        this.storeCmpntTextWithButtons1 = new StoreCmpntTextWithButtons({
            rightButtons: [
                {
                    text: 'Очистить',
                    width: 130,
                    onClick: () => {
                        this.storeCmpntTextWithButtons1.setValue('');
                    }
                },
                {
                    text: 'Hello',
                    type: 'secondary',
                    width: 130,
                    onClick: () => {
                        this.storeCmpntTextWithButtons1.setValue('Hello world!');
                    }
                }
            ],
        });

        this.storeCmpntTextWithButtons2 = new StoreCmpntTextWithButtons({
            rightButtons: [
                {
                    text: 'Текст',
                    type: 'secondary',
                    width: 110,
                    onClick: () => {
                        //Показываем текущее значение
                        alert(this.storeCmpntTextWithButtons2.value)
                    }
                }
            ],
            leftButtons: [
                {
                    text: 'Число',
                    width: 110,
                    onClick: () => {
                        // Получаем текущее значение
                        const value: string = this.storeCmpntTextWithButtons2.value;

                        if (!value) {
                            return;
                        }

                        // Приводим строку к числу
                        const valueNumber: number = Number(this.storeCmpntTextWithButtons2.value);

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