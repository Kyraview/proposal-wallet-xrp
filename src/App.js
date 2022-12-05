import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from "react-router-dom";
import {ChainFuncs} from './ChainFuncs.js';
import {UiFuncs} from './UiFuncs.js';
import BaseScreen from './screens/BaseScreen';

function App() {
  return (
    <BrowserRouter>
    <UiFuncs>
    <ChainFuncs>
    <div className="App">
      <BaseScreen />
    </div>
    </ChainFuncs>
    </UiFuncs>
    </BrowserRouter>
  );
}

export default App;
