import React, { useEffect, useState, useRef } from 'react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FastForwardIcon from '@mui/icons-material/FastForward';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

const SpotifySong = ({ song, currentSongIndex, setCurrentSongIndex, playlistLength }) => {
  const [isPlaying, setIsPlaying] = useState(false); 
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(new Audio());
  const intervalRef = useRef(null);

  useEffect(() => {
    if (song && song.url) {
      audioRef.current.pause();
      audioRef.current = new Audio(song.url);
      audioRef.current.addEventListener('timeupdate', updateTime);
      audioRef.current.addEventListener('loadedmetadata', onLoadedMetadata);
      audioRef.current.addEventListener('ended', handleNext);

      if (currentSongIndex !== null && isPlaying) {
        audioRef.current.play().catch(error => console.error('Error playing audio:', error));
      }
    }
  }, [song, currentSongIndex]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play().catch(error => console.error('Error playing audio:', error));
      intervalRef.current = setInterval(() => {
        setCurrentTime(audioRef.current.currentTime);
      }, 1000);
    } else {
      audioRef.current.pause();
      clearInterval(intervalRef.current);
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [isPlaying]);

  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);

    if (currentSongIndex !== null) {
      setIsPlaying(true);
    }
  }, [currentSongIndex]);

  const updateTime = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setCurrentTime(0);
    }
  };

  const handlePlayPause = () => {
    if (!isPlaying) {
      audioRef.current.play().catch(error => console.error('Error playing audio:', error));
    } else {
      audioRef.current.pause();
    }
    setIsPlaying(!isPlaying);
  };

  const handlePrevious = () => {
    if (currentSongIndex > 0) {
      setCurrentSongIndex(currentSongIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentSongIndex < playlistLength - 1) {
      setCurrentSongIndex(currentSongIndex + 1);
    }
  };

  const handleSeek = (e) => {
    const newTime = (e.target.value / 100) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  if (!song) return null;

  return (
    <div className='song-container'>
      <div className='album-title'>
        <p className='card-title'>{song.name}</p>
        <p className='card-subtitle'>{song.artist}</p>
      </div>
      <div className='card'>
        <img
          src={`https://cms.samespace.com/assets/${song.cover}`}
          className='cover-image'
          alt={`${song.name} cover`}
        />
      </div>

      <div className='playing-line'>
        <input
          type='range'
          value={(currentTime / duration) * 100 || 0}
          onChange={handleSeek}
          style={{ width: '100%' }}
        />
      </div>

      <div className='play'>
        <div className='more'>
          <div className='dots'>
            <MoreHorizIcon />
          </div>
        </div>
        <div className='play-btn'>
          <div className='previous' onClick={handlePrevious}>
            <FastRewindIcon />
          </div>
          <div className='start' onClick={handlePlayPause}>
            {isPlaying ? <PauseCircleOutlineIcon /> : <PlayCircleOutlineIcon />}
          </div>
          <div className='next' onClick={handleNext}>
            <FastForwardIcon />
          </div>
        </div>
        <div className='sound'>
          <VolumeUpIcon />
        </div>
      </div>
    </div>
  );
};

export default SpotifySong;
