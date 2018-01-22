import React, {Component} from 'react';
import {extendObservable, toJS} from 'mobx';
import {observer} from 'mobx-react';
import {Link} from 'react-router-dom';
import todoStore from '../store/todoStore';
import appState from '../store/appStateStore';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';

class EditPage extends Component {
    constructor(props) {
        super(props);

        extendObservable(this, {
            data: {
                title: '',
                description: '',
                importance: '0',
                expirationNeeded: false,
                expirationDate: '',
                completionDate: '',
                isComplete: false
            },
            error: ''
        })
    }

    componentWillMount() {
        const {id} = this.props.match.params;

        if (id) {
            if (todoStore.items.length === 0) {
                todoStore.loadItems().then(() => {
                        const todo = todoStore.items.get(id);
                        Object.assign(this.data, todo);
                    }
                )
            } else {
                const todo = todoStore.items.get(id);
                Object.assign(this.data, todo);
            }
        }
    }

    onChange = e => {
        this.data[e.target.name] = e.target.value;

        if (e.target.name === 'title') {
            this.error = '';
        }
    };

    onCheckBoxChange = e => {
        this.data[e.target.name] = e.target.checked;

        if (e.target.checked) {
            this.data.expirationDate = moment().unix();
        } else {
            this.data.expirationDate = "";
        }
    };

    onDatePickerChange = date => {
        this.data.expirationDate = moment(date).unix();
    };

    onSubmit = () => {
        const {id} = this.props.match.params;
        const {history} = this.props;

        if (this.data.title.length === 0) {
            this.error = 'Введите название задачи!';
            return
        }

        todoStore.updateItem(id, toJS(this.data)).then(() => {
            history.push('/');
        });
    };

    render() {
        return (
            <div className="new-todo-container">
                <div className="actions">
                    <Link to="/" className="button">На главную</Link>
                </div>
                {!todoStore.isLoading ?
                    <div>
                        <div className="form-group">
                            <label htmlFor="title">Заголовок:</label>
                            <input type="text"
                                   name="title"
                                   id="title"
                                   placeholder="Заголовок"
                                   value={this.data.title}
                                   onChange={this.onChange}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Описание:</label>
                            <textarea name="description"
                                      id="description"
                                      placeholder="Описание"
                                      value={this.data.description}
                                      onChange={this.onChange}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="importance">Важность:</label>
                            <select name="importance"
                                    id="importance"
                                    value={this.data.importance}
                                    onChange={this.onChange}>
                                <option value="0">Обычная</option>
                                <option value="1">Важная</option>
                                <option value="2">Очень важная</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="expirationNeeded">Установть срок:</label>
                            <input type="checkbox"
                                   id="expirationNeeded"
                                   name="expirationNeeded"
                                   checked={this.data.expirationNeeded}
                                   onChange={this.onCheckBoxChange}/>

                        </div>
                        {this.data.expirationNeeded &&
                            <div className="form-group">
                                <label htmlFor="expirationDate">Выполнить до:</label>
                                <DatePicker
                                    id="expirationDate"
                                    showTimeSelect
                                    selected={
                                        this.data.expirationDate.length === 0 ?
                                            moment() :
                                            moment.unix(this.data.expirationDate)
                                    }
                                    onChange={this.onDatePickerChange}
                                    dateFormat="DD.MM.YY HH:mm"
                                    timeFormat="HH:mm"
                                />
                            </div>
                        }
                        <div className="form-group">
                            <label htmlFor="completionDate">Выполнена:</label>
                            <input type="text"
                                   id="completionDate"
                                   disabled
                                   value={this.data.completionDate.length === 0 ?
                                       'Не выполнена' :
                                       moment(this.data.completionDate).format("DD.MM.YY HH:mm")}/>
                        </div>
                        {appState.now > parseInt(this.data.expirationDate, 10) * 1000 &&
                        <div className="error">Задача не выполнена к сроку!</div>
                        }
                        {this.error.length > 0 && <div className="error">{this.error}</div>}
                        <button
                            onClick={this.onSubmit}
                            disabled={this.error.length > 0}>
                            Сохранить
                        </button>
                    </div>
                    : <div>Загрузка...</div>}
            </div>
        );
    }
}

export default observer(EditPage);
