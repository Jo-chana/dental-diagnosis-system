import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route} from "react-router-dom";
import Main from './components/main'
import Service from "./components/service";
import ModelPage from "./components/modelPage";
import Model from "./components/modelDetail";
import About from "./components/about";
import Intro from "./components/intro";
import '../style.css'

ReactDOM.render((
        <Router>
            <Main/>
            <Route exact path='/'><Intro/></Route>
            <Route exact path='/service'><Service /></Route>
            <Route exact path='/service/model'><ModelPage /></Route>
            <Route exact path='/service/model/:modelId'><Model /></Route>
            <Route exact path='/about'><About/></Route>
        </Router>
    ), document.getElementById('content')
);