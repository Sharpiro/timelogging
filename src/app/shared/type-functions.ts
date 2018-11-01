export function createIntersection<T, U>(first: T, second: U): T & U {
    const result = <T & U>{};
    // tslint:disable-next-line:forin
    for (const id in first) {
        (<any>result)[id] = (<any>first)[id];
    }
    for (const id in second) {
        if (!result.hasOwnProperty(id)) {
            (<any>result)[id] = (<any>second)[id];
        }
    }
    return result;
}

export const nameof = <T>(name: keyof T) => name;
