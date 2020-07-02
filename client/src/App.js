import React from 'react';
import FileUpload from './components/FileUpload';
import {Container} from "@material-ui/core"
import {BrowserRouter, Switch, Route} from "react-router-dom"

const App = () => (
  <Container style={{'padding': '10px'}}>
    <BrowserRouter>
      <Switch>
        <Route path="/" component={FileUpload}/>
      </Switch>
    </BrowserRouter>
  </Container>
);

export default App;
