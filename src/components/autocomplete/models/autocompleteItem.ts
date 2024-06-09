import { ModelWithUuid } from "../../../models/modelWithUuid";

export interface AutocompleteItem extends ModelWithUuid {
    readonly name: string;
    readonly fullName: string;
    readonly imgUrlFlag: string;
}