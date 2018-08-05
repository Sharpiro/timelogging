import "reflect-metadata";

export interface TableEntity {
    PartitionKey: string
    RowKey: string
}

export class Log {
    constructor(
        public task: string,
        public duration: number) { }
}

export type TableLog = Readonly<TableEntity> & Readonly<Log>

// const partitionKey = (target: Object, key: string | symbol) => {
//     let decoratorName = "partitionKey"
//     Reflect.defineMetadata(decoratorName, key, target)
// }

// const rowKey = (target: Object, key: string | symbol) => {
//     const decoratorName = "rowKey"
//     Reflect.defineMetadata(decoratorName, key, target)
// }

const tableKey = (decoratorName: "partition" | "row") => {
    return (target: Object, key: string | symbol) => {
        Reflect.defineMetadata(decoratorName, key, target)
    }
}

function init(target, x?: any) {
    return class extends target {
        firstName = "Amitai";
        lastName = "Barnea";
        name = ""
        sayMyName() {
            return `${this.firstName} ${this.lastName}`
        }
    }
}

function PluginDecorator(name: any) {
    return (ctor: Function) => {
        // console.log("Plugin found:");
        // console.log(name)
    }
}


export class P {
    name = "default";
    constructor() {
    }
}

// @PluginDecorator({
//     partitionKey: "task",
//     rowKey: "createdDateISO"
// })
// export class Log2 {
//     task: string
//     createdDateISO: string;
//     duration: number;

//     constructor(task: string, duration: number, createdDateISO = new Date().toISOString()) {
//         this.task = task
//         this.duration = duration
//         this.createdDateISO = createdDateISO
//     }
// }

export class Log3 {
    @tableKey("partition") task: string
    @tableKey("row") createdDateISO: string;
    duration: number;

    constructor();
    constructor(task: string, duration: number, createdDateISO?: string);
    constructor(task?: string, duration?: number, createdDateISO = new Date().toISOString()) {
        this.task = task
        this.duration = duration
        this.createdDateISO = createdDateISO
    }
}
