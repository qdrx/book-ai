export interface IFetchedBookData<T> {
    title: string;
    authors: Object[];
    covers: number[];
    description: T;
    author: string;
}