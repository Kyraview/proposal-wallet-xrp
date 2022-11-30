import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {ChainFuncs} from './ChainFuncs.js';
import BaseScreen from './screens/BaseScreen';
import AssetScreen from './screens/AssetScreen';
import SendScreen from './screens/SendScreen';
import ReceiveScreen from './screens/ReceiveScreen';
import SwapScreen from './screens/swap/SwapScreen';
import LedgerScreen from './screens/LedgerScreen';
import AccountScreen from './screens/AccountScreen';

function App() {
  return (
    <BrowserRouter>
    <ChainFuncs>
    <div className="App">
      <BaseScreen />
      <Routes>
        <Route  path='assets' element={<AssetScreen />} />
        <Route  path='send' element={<SendScreen />} />
        <Route  path='receive' element={<ReceiveScreen />} />
        <Route  path='swap' element={<SwapScreen />} />
        <Route  path='ledger' element={<LedgerScreen />} />
        <Route  path='account' element={<AccountScreen />} />
      </Routes>
    </div>
    </ChainFuncs>
    </BrowserRouter>
  );
}

export default App;
