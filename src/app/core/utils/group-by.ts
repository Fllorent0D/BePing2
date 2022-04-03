export const groupBy = <T, K extends keyof T>(arr: T[], prop: K): T[][] => {
    const mapObj: Map<T[K], T[]> = new Map(Array.from(arr, obj => [obj[prop], []]));
    arr.forEach(obj => mapObj.get(obj[prop]).push(obj));
    return Array.from(mapObj.values());
};
