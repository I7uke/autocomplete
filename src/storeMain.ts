import { StoreTextWithButtons } from "./components/textWithButtons";

export default class StoreMain {
    readonly storeTextWithButtons1: StoreTextWithButtons;
    readonly storeTextWithButtons2: StoreTextWithButtons;

    constructor() {
        this.storeTextWithButtons1 = new StoreTextWithButtons({
            rightButtons: [
                {
                    text: 'Очистить',
                    onClick: () => {
                        this.storeTextWithButtons1.setValue('');
                    }
                },
                {
                    text: 'Hello',
                    type: 'secondary',
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
                    onClick: () => {
                        alert(this.storeTextWithButtons2.value)
                    }
                }
            ],
            leftButtons: [
                {
                    text: 'Число',
                    onClick: () => {
                        const value: string = this.storeTextWithButtons2.value;

                        if (!value) {
                            return;
                        }

                        const valueNumber: number = Number(this.storeTextWithButtons2.value);

                        if (isNaN(valueNumber)) {
                            return;
                        }

                        alert(valueNumber);
                    }
                }
            ],
        });
    }

}