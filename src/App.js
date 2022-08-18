import './App.css';
import Login from './Login';
import LoggedIn from './LoggedIn';
import { getTokenFromUrl } from './Spotify';
import { useEffect, useState } from 'react';

const App = () => {

  const [token, setToken] = useState(null);

  useEffect(() => {

    const hash = getTokenFromUrl();
    console.log(hash);
    window.location.hash = "";
    const token = hash.access_token;

    if(token) {
      setToken(token);
    }

  }, [])

  return (
    <div className="App">
      { token ? <LoggedIn accessToken={token} /> : <Login/> }
    </div>
  );

}

export default App;
