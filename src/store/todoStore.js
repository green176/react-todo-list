import {extendObservable, toJS} from 'mobx'
import localForage from 'localforage'

class ToDoStore {
    constructor() {
        extendObservable(this, {
            items: [],
            isLoading: false,
            filterState: '',

            get list() {
                switch (this.filterState) {
                    case '0':
                        return this.items.filter(item => item.importance === '0');
                    case '1':
                        return this.items.filter(item => item.importance === '1');
                    case '2':
                        return this.items.filter(item => item.importance === '2');
                    default:
                        return this.items;
                }
            },

            async loadItems() {
                try {
                    this.isLoading = true;
                    const items = await localForage.getItem('todo');

                    if (items) {
                        this.items = items;
                    }

                } catch (error) {
                    throw error;
                } finally {
                    this.isLoading = false
                }
            },

            async updateItem(id, data) {
                if (!id) {
                    this.items.push(data);
                } else {
                    Object.assign(this.items.get(id), data);
                }

                await this.saveToLocalStorage()
            },

            async toggleItem(id, checked) {
                let item = this.items.get(id);
                item.isComplete = checked;

                if (checked) {
                    item.completionDate = new Date().getTime();
                } else {
                    item.completionDate = '';
                }

                await this.saveToLocalStorage()
            },

            async deleteItem(id) {
                this.items.remove(this.items.get(id));

                await this.saveToLocalStorage()
            },

            async saveToLocalStorage() {
                try {
                    this.isLoading = true;

                    await localForage.setItem('todo', toJS(this.items));
                } catch (error) {
                    throw error;
                } finally {
                    this.isLoading = false;
                }
            }
        })
    }

}

const store = new ToDoStore();

export default store;
