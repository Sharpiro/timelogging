import { DateEntity } from "./models/dateEntity";
import { tableKey } from "./models/model-helpers";

export class Category extends DateEntity {
    @tableKey("partition") readonly name: string
    @tableKey("row") readonly inverseMilliseconds: string;

    constructor();
    constructor(name: string, createdDate?: Date);
    constructor(name?: string, createdDate = new Date()) {
        super()
        this.name = name
        this.inverseMilliseconds = this.toInverseMilliseconds(createdDate)
    }
}