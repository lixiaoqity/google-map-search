import './App.css';
import { Routes, Route, Switch, Redirect } from "react-router-dom";
import MapContainer from './components/GoogleMap';
import LocationHistory from './components/LocationHistory';
import NoPage from './components/NoPage';
import { Provider } from "react-redux";
import store from "./store"

function App() {
  return (
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<MapContainer />}/>
        <Route path="history" element={<LocationHistory />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </Provider>
  );
}

export default App;
