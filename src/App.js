import './App.css';
import SpotifyPlayList from './Components/SpotifyPlayList';
import SpotifyLogo from './Components/SpotifyLogo';
import SpotifySong from './Components/SpotifySong';

function App() {
  return (
    <div className='container'>
      <SpotifyLogo />
      <SpotifyPlayList />
      <SpotifySong />
    </div>
  );
}

export default App;
