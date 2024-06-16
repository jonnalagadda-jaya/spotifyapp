import React, { useState, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import SpotifySong from './SpotifySong';

const SpotifyPlayList = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSongIndex, setCurrentSongIndex] = useState(null);
  const [selectedTab, setSelectedTab] = useState('ForYou');
  const [backgroundGradient, setBackgroundGradient] = useState('');

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const res = await fetch("https://cms.samespace.com/items/songs");
      var apiData = await res.json();
      if (apiData && Array.isArray(apiData.data)) {
        const songsWithDuration = await Promise.all(apiData.data.map(async (song) => {
          const duration = await getAudioDuration(song.url);
          return { ...song, duration };
        }));
        setData(songsWithDuration);
        setFilteredData(songsWithDuration);
      } else {
        console.log("Unexpected API Response Structure:", apiData);
      }
    } catch (error) {
      console.log("Getting Error", error);
    }
  };

  const getAudioDuration = (url) => {
    return new Promise((resolve) => {
      const audio = new Audio(url);
      audio.addEventListener('loadedmetadata', () => {
        resolve(audio.duration);
      });
    });
  };

  useEffect(() => {
    const results = data.filter(song =>
      song.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(results);
  }, [searchTerm, data]);

  const playSong = (index) => {
    setCurrentSongIndex(index);
  };

  const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) {
      return "0:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className='app-container' style={{ background: backgroundGradient }}>
      <div className='playlist-container'>
        <div className='side-bar'>
          <p 
            className={`tab for-you ${selectedTab === 'ForYou' ? 'active' : ''}`}
            onClick={() => setSelectedTab('ForYou')}
          >
            For You
          </p>
          <p 
            className={`tab top-tracks ${selectedTab === 'TopTracks' ? 'active' : ''}`}
            onClick={() => setSelectedTab('TopTracks')}
          >
            Top Tracks
          </p>
        </div>
        <div className='search-box'>
          <SearchIcon className='search-icon' />
          <input
            type="text"
            className='search-text'
            placeholder='Search Song, Artist'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className='songs-playlist'>
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <div
                className='album'
                key={item.id}
                onClick={() => playSong(index)}
                style={{
                  backgroundColor: currentSongIndex === index ? '#151515' : 'transparent'
                }}
              >
                <div className='image-text'>
                  <div className='circle'>
                    <img
                      src={`https://cms.samespace.com/assets/${item.cover}`}
                      className='cover-image'
                      alt={item.name}
                    />
                  </div>
                  <div className='song-name'>
                    <p className='title'>{item.name}</p>
                    <p className='name'>{item.artist}</p>
                  </div>
                </div>
                <div className='duration'>
                  <p>{formatDuration(item.duration)}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No Songs Available</p>
          )}
        </div>
      </div>
      {filteredData.length > 0 && (
        <SpotifySong
          song={filteredData[currentSongIndex ?? 0]} 
          currentSongIndex={currentSongIndex}
          setCurrentSongIndex={setCurrentSongIndex}
          playlistLength={filteredData.length}
        />
      )}
    </div>
  );
};

export default SpotifyPlayList;
