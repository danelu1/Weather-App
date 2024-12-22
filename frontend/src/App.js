import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StartPage from './startPage/StartPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import SearchCountries from './searchPage/components/SearchCountries';
import SearchCities from './searchPage/components/SearchCities';
import SearchTemperatures from './searchPage/components/SearchTemperatures';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<StartPage />}/>
          <Route path='/search-countries' element={<SearchCountries />}/>
          <Route path='/search-cities' element={<SearchCities />}/>
          <Route path='/search-temperatures' element={<SearchTemperatures />}/>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
