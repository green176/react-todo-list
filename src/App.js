import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import ListPage from './components/ListPage';
import EditPage from './components/EditPage';
import logo from './reminders_icon.png';
import './App.css';

class App extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                        <img src={logo} className="App-logo" alt="logo"/>
                    <h1 className="App-title">Список задач</h1>
                </header>
                <div className="container">
                    <BrowserRouter>
                        <Switch>
                            <Route path="/" exact component={ListPage}/>
                            <Route path="/edit/:id" component={EditPage}/>
                            <Route path="/create" component={EditPage}/>
                        </Switch>
                    </BrowserRouter>
                </div>
            </div>
        );
    }
}

export default observer(App);
