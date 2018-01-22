import { extendObservable } from 'mobx'

class AppStateStore {
    constructor() {
        extendObservable(this, {
            now: new Date().getTime(),

            updateTime() {
                this.now = new Date().getTime()
            },
        });
    }
}

const store = new AppStateStore();

setInterval(() => store.updateTime(), 1000);

export default store
