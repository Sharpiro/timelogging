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

const partitionKey = (target: Object, key: string) => {
    let value = target[key];

    const getter = () => {
        console.log(`Getting value '${key}': ${value}`);
        return value;
    };
    const setter = (val) => {
        console.log(`Setting value '${key}': ${val}`);
        value = val;
    }
    Reflect.deleteProperty(target, key)
    Reflect.deleteProperty[key];
    Reflect.defineProperty(target, key, {
        get: getter,
        set: setter
    });
}

const rowKey = (target: Object, key: string | symbol) => {

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
        console.log("Plugin found:");
        console.log(name)
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
    @partitionKey task: string
    @partitionKey createdDateISO: string;
    duration: number;

    constructor(task: string, duration: number, createdDateISO = new Date().toISOString()) {
        this.task = task
        this.duration = duration
        this.createdDateISO = createdDateISO
    }
}



export enum LogLevel {
    Debug = 1,
    Info = 2,
    Warn = 3,
    Error = 4,
    Fatal = 5
}