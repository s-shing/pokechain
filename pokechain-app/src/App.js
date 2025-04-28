import './App.css';
import { Routes, Route, Link } from 'react-router-dom';
import Profile from "./Profile.js"
import Home from "./Home.js"
import Trade from "./Trade.js"


function App() {
  return (
    <div className="App">
      <title>PokeChain</title>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/trade" element={<Trade />} />
    </Routes>
    </div>

  );
}

export default App;
