import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from "react-router-dom";
import {ChainFuncs} from './ChainFuncs.js';
import BaseScreen from './screens/BaseScreen';

function App() {
  return (
    <BrowserRouter>
    <ChainFuncs>
    <div className="App">
      <BaseScreen />
    </div>
    </ChainFuncs>
    </BrowserRouter>
  );
}

export default App;
