import { NetworkedStore, UserFetchFunc, StoreNetworkStatus, NetworkedStoreData } from "../src/NetworkedStore";

import { expect } from "chai";

describe("NetworkedStore Tests", () => {

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
        let store = new NetworkedStore<number>(fetch);

        // update our test data
        store.subscribe(value => {
            data = value;
        });

        // test our data
        expect(data.data).to.be.empty;
        expect(data.status).to.equal(StoreNetworkStatus.NotFetched);
    });

    it("should be possible to access the set method", () => {
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
        let store = new NetworkedStore<number>(fetch);

        store.set(data);

        // update our test data
        store.subscribe(value => {
            data = value;
        });

        // test our data
        expect(data.data).to.have.same.members([-1]);
        expect(data.status).to.equal(StoreNetworkStatus.Fetched);
    });

    it("should be possible to access the update method", () => {
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
        let store = new NetworkedStore<number>(fetch);

        store.update(n => {
            n.data = [10],
                n.status = StoreNetworkStatus.Loading

            return n;
        });

        // update our test data
        store.subscribe(value => {
            data = value;
        });

        // test our data
        expect(data.data).to.have.same.members([10]);
        expect(data.status).to.equal(StoreNetworkStatus.Loading);
    });
});