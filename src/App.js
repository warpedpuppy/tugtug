import React from 'react';
import {BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import Menu from './components/Menu.js';
import Home from './pages/Home.js';
import Experiments from './pages/Experiments.js';
import About from './pages/About.js';
import Spiral from './pages/Spiral.js';
import Contact from './pages/Contact.js';
import Footer from './components/Footer.js';
require('../node_modules/normalize.css/normalize.css');
export default function App () {
    return (
      <Router>
        <div className="App">
          <header>
            <Menu />
          </header>
          <main>
            <Route exact path="/" component={Home} />
            <Route exact path="/Experiments" component={Experiments} />
            <Route exact path="/About" component={About} />
            <Route exact path="/Contact" component={Contact} />
            <Route exact path="/Spiral" component={Spiral} />
          </main>
          <Footer />
        </div>
      </Router>
    );
}