import { DateEntity } from "./dateEntity";
import { tableKey } from "./model-helpers";

export class Category extends DateEntity {
    @tableKey("partition") readonly name: string
    @tableKey("row") readonly inverseMilliseconds: string;

    constructor(name?: string, createdDate = new Date()) {
        super()
        this.name = name
        this.inverseMilliseconds = this.toInverseMilliseconds(createdDate)
    }
}
