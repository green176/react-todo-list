import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {Link} from 'react-router-dom';
import todoStore from '../store/todoStore';
import appState from '../store/appStateStore';

class ToDoItem extends Component {
    markAsCompleted = async (e) => {
        await todoStore.toggleItem(this.props.id, e.target.checked)
    };

    removeItem = async () => {
        await todoStore.deleteItem(this.props.id)
    };

    toDoStatus = importance => {
        switch (importance) {
            case '0':
                return ' common';
            case '1':
                return ' important';
            case '2':
                return ' very-important';
            default:
                return ''
        }
    };

    render() {
        const {title, importance, isComplete, expirationDate, id} = this.props;

        return (
            <div
                className={`todo-item${this.toDoStatus(importance)}${isComplete ? " complete" : ""}${appState.now > parseInt(expirationDate, 10)*1000 ? " expired" : ""}`}>
                <input type="checkbox" checked={isComplete} onChange={this.markAsCompleted}/>
                <Link to={`/edit/${id}`}>
                    <div className="title">{title}</div>
                </Link>
                <div className="button-container">
                    <button onClick={this.removeItem}>&times;</button>
                </div>
            </div>
        );
    }
}

export default observer(ToDoItem);
