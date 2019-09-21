import React from 'react';
import {Route, BrowserRouter as Router, Switch} from "react-router-dom";

import CategoriesView from './Components/CategoriesView';
import ImageCanvas from './Components/ImageCanvas';
import Main from './Components/MainPage';
import PageNotFound from './Components/PageNotFound';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={Main} />
          <Route path="/images/:id" component={ImageCanvas} />
          <Route path='/categories' component={CategoriesView} />
          <Route component={PageNotFound} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
