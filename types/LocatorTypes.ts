export interface LocatorFile {
    [key: string]: string;
}

export type LocatorKey<T extends LocatorFile> = keyof T;
