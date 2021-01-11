import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Main from './pages/main'
import Service from "./pages/service";
import ModelPage from "./pages/modelPage";
import ModelDetail from "./pages/modelDetail";
import About from "./pages/about";
import Intro from "./pages/intro";
import Contact from "./pages/contact";
import '../style.css'

ReactDOM.render((
        <Router>
            <Main/>
            <Route exact path='/'><Intro/></Route>
            <Route exact path='/service'><Service /></Route>
            <Route exact path='/service/model'><ModelPage /></Route>
            <Route exact path='/service/model/:modelId'><ModelDetail /></Route>
            <Route exact path='/about'><About/></Route>
            <Route exact path='/contact'><Contact/></Route>
        </Router>
    ), document.getElementById('content')
);