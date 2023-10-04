import { AuthQuery } from "./interface";

export const API = {
    AuthQuery: Symbol.for('AuthQuery')
};

export type APIInstance = AuthQuery

export interface Driver {
    init(): Promise<void>;
    destroy(): Promise<void>;
    get(api: Symbol): APIInstance;
}