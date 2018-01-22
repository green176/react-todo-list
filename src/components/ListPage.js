import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {extendObservable} from 'mobx';
import todoStore from '../store/todoStore';
import ToDoItem from './ToDoItem';
import {Link} from 'react-router-dom';

class ListPage extends Component {
    constructor(props) {
        super(props);

        extendObservable(this, {})
    }

    componentWillMount() {
        todoStore.loadItems();
    }

    setFilter = e => {
        todoStore.filterState = e.target.value
    };

    render() {
        return (
            <div className="list-page">
                <div className="actions">
                    <Link to="/create" className="button">Создать задачу</Link>
                    <div className="filter-container">
                        <span>Фильтр:</span>
                        <select name="importance" id="importance" value={todoStore.filterState}
                                onChange={this.setFilter}>
                            <option value="">Все</option>
                            <option value="0">Обычная</option>
                            <option value="1">Важная</option>
                            <option value="2">Очень важная</option>
                        </select>
                    </div>
                </div>
                {!todoStore.isLoading ?
                    todoStore.list && todoStore.list.length > 0 ?
                        todoStore.list.map((item, index) => (
                            <ToDoItem key={index} {...item} id={index}/>
                        )) : <div>Задач нет</div>
                    : <div>Загрузка...</div>}
            </div>
        );
    }
}

export default observer(ListPage);
