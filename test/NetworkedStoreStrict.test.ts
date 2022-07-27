import { NetworkedStoreStrict, UserFetchFunc, StoreNetworkStatus, NetworkedStoreData } from "../src/NetworkedStore";

import { expect } from "chai";

describe("NetworkedStoreStrict Tests", () => {

    it("should get instantiated with default data", () => {
        // dummy user provided fetch function
        const fetch: UserFetchFunc<number> = function (_set, _update) {
            return true;
        }

        // Fill our data with nonsense
        let data: NetworkedStoreData<number> = {
            data: [-1],
            status: StoreNetworkStatus.Fetched
        };

        // create the store
        let store = new NetworkedStoreStrict<number>(fetch);

        // update our test data
        store.subscribe(value => {
            data = value;
        });

        // test our data
        expect(data.data).to.be.empty;
        expect(data.status).to.equal(StoreNetworkStatus.NotFetched);
    });

    it("should fetch the correct data and set a correct status", () => {
        const fetch: UserFetchFunc<number> = function (_set, update) {
            update(n => {
                n.data = [5];
                return n;
            });

            return true;
        }

        // Fill our data with nonsense
        let data: NetworkedStoreData<number> = {
            data: [-1],
            status: StoreNetworkStatus.NotFetched
        };

        // create the store
        let store = new NetworkedStoreStrict<number>(fetch);

        // Try to update our values
        store.fetch();

        // update our test data
        store.subscribe(value => {
            data = value;
        });

        // test our data
        expect(data.data).to.have.same.members([5]);
        expect(data.status).to.equal(StoreNetworkStatus.Fetched);
    });

    it("should set error when fetch returns false", () => {
        const fetch: UserFetchFunc<number> = function (_set, update) {
            update(n => {
                n.data = [10];
                return n;
            });

            return false;
        }

        // Fill our data with nonsense
        let data: NetworkedStoreData<number> = {
            data: [-1],
            status: StoreNetworkStatus.Fetched
        };

        // create the store
        let store = new NetworkedStoreStrict<number>(fetch);

        // Try to update our values
        store.fetch();

        // update our test data
        store.subscribe(value => {
            data = value;
        });

        // test our data
        expect(data.data).to.have.same.members([10]);
        expect(data.status).to.equal(StoreNetworkStatus.NetworkError);
    });

    it("should set provided data on construction", () => {
        const fetch: UserFetchFunc<number> = function (_set, _update) {
            return true;
        }

        // Fill our data with nonsense
        let data: NetworkedStoreData<number> = {
            data: [-1],
            status: StoreNetworkStatus.Fetched
        };

        // create the store
        let store = new NetworkedStoreStrict<number>(fetch, [10, 5]);

        // update our test data
        store.subscribe(value => {
            data = value;
        });

        // test our data
        expect(data.data).to.have.same.members([10, 5]);
        expect(data.status).to.equal(StoreNetworkStatus.NotFetched);
    });

    it("should fetch on construct when option set", () => {
        const fetch: UserFetchFunc<number> = function (_set, update) {
            update(n => {
                n.data = [5];
                return n;
            });

            return true;
        }

        // Fill our data with nonsense
        let data: NetworkedStoreData<number> = {
            data: [-1],
            status: StoreNetworkStatus.NotFetched
        };

        // create the store
        let store = new NetworkedStoreStrict<number>(fetch, [], true);

        // update our test data
        store.subscribe(value => {
            data = value;
        });

        // test our data
        expect(data.data).to.have.same.members([5]);
        expect(data.status).to.equal(StoreNetworkStatus.Fetched);
    });
});