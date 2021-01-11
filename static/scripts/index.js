import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Main from './pages/Main'
import Service from "./pages/Service";
import ModelPage from "./pages/ModelPage";
import ModelDetail from "./pages/ModelDetail";
import About from "./pages/About";
import Intro from "./pages/Intro";
import '../style.css'

ReactDOM.render((
        <Router>
            <Main/>
            <Route exact path='/'><Intro/></Route>
            <Route exact path='/service'><Service /></Route>
            <Route exact path='/service/model'><ModelPage /></Route>
            <Route exact path='/service/model/:modelId'><ModelDetail /></Route>
            <Route exact path='/about'><About/></Route>
        </Router>
    ), document.getElementById('content')
);