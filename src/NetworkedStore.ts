import type { Writable } from "svelte/store";
import { writable } from "svelte/store";

/**
 * This are the possible states a NetworkedStore can have.
 */
export enum StoreNetworkStatus {
    NotFetched,
    Loading,
    Fetched,
    NetworkError
}

/**
 * Type definition for the user provided fetch function, which will get
 * called on the .fetch() call by the NetworkedStore.
 */
export type UserFetchFunc<T> = (set: Writable<NetworkedStoreData<T>>["set"],
    update: Writable<NetworkedStoreData<T>>["update"]) => boolean;

/**
 * The signature of the whole data the NetworkedStore manages.
 */
export type NetworkedStoreData<T> = { data: T[], status: StoreNetworkStatus };

/**
 * The NetworkedStoreStrict allows you to have a writable svelte store,
 * that manages a NetworkStatus.
 * To create a NetworkedStoreStrict you need to specify the data type and
 * provide a fetch function of type UserFetchFunc<T>.
 * 
 * Optionally you can specify initial data and if the store should 
 * fetch data on initialization.
 */
export class NetworkedStoreStrict<T> {
    public subscribe: Writable<NetworkedStoreData<T>>["subscribe"];
    protected set: Writable<NetworkedStoreData<T>>["set"];
    protected update: Writable<NetworkedStoreData<T>>["update"];

    private _fetch: UserFetchFunc<T>;

    /**
     * The constructor of the NetworkedStoreStrict.
     * @param _fetch The user provided implementation for the fetch function. It has the signature of UserFetchFunc<T>.
     * @param data [] on default. Can be overriden.
     * @param fetch_on_construct If set to true the fetch function will be called in the initialization. Normally set to false (optional parameter).
     */
    constructor(_fetch: UserFetchFunc<T>, data: T[] = [], fetch_on_construct: boolean = false) {
        // Set the user provided internal fetch implementation.
        this._fetch = _fetch;

        // Set initial values
        let initStoreValues: NetworkedStoreData<T> = {
            data: data,
            status: StoreNetworkStatus.NotFetched
        };

        // Svelte Store setup
        const { subscribe, set, update } = writable(initStoreValues);
        this.subscribe = subscribe;
        this.set = set;
        this.update = update;

        // Check if fetch should be called in the constructor
        if (fetch_on_construct)
            this.fetch();

        return;
    }

    fetch() {
        // Set status to loading to indicate upcoming fetch call
        this.update(n => {
            n.status = StoreNetworkStatus.Loading;
            return n;
        });

        // Set status to fetched if user provided fetch function was successful
        if (this._fetch(this.set, this.update)) {
            this.update(n => {
                n.status = StoreNetworkStatus.Fetched;
                return n;
            });
        }
        else {  // Fetch unsuccessful -> Set status to NetworkError.
            this.update(n => {
                n.status = StoreNetworkStatus.NetworkError;
                return n;
            });
        }
    }
}

/**
 * Has the same functionality as the NetworkedStoreStrict store,
 * but allows public access to the stores set and update function.
 */
export class NetworkedStore<T> extends NetworkedStoreStrict<T> {
    declare public set: Writable<NetworkedStoreData<T>>["set"];
    declare public update: Writable<NetworkedStoreData<T>>["update"];
}
