
import Texteditor from "./components/texteditor";
import {v4 as uuidV4} from "uuid"
import{
  BrowserRouter as Router,
  Switch,
 Route,
Redirect,} from "react-router-dom"
function App() {
  return (
    <div className="App">
      <Router>

        <Switch>
          <Route path="/" exact>
            <Redirect to={`/documents/${uuidV4()}`}/>
          </Route>
          <Route path="/documents/:id" > <Texteditor/></Route>
        </Switch>
      </Router>
     
     
    </div>
  );
}

export default App;
