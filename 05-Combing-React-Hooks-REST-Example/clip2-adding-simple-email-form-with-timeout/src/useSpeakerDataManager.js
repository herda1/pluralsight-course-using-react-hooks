import speakersReducer from './speakersReducer';
import SpeakerData from './SpeakerData';
import { useEffect, useReducer } from 'react';
import axios from 'axios';

function useSpeakerDataManager() {
  const [
    { isLoading, speakerList, favoriteClickCount, hasErrored, error },
    dispatch,
  ] = useReducer(speakersReducer, {
    isLoading: true,
    speakerList: [],
    favoriteClickCount: 0,
    hasErrored: false,
    error: null,
  });
  function incrementFavoriteClickCount() {
    dispatch({ type: 'incrementFavoriteClickCount' });
  }

  function toggleSpeakerFavourite(speakerRec) {
    const updataData = async function () {
      axios.put(`http://localhost:4000/speakers/${speakerRec.id}`, speakerRec);
      speakerRec.favorite === true
        ? dispatch({ type: 'unfavorite', id: speakerRec.id })
        : dispatch({ type: 'favorite', id: speakerRec.id });
    };
    updataData();
  }
  useEffect(() => {
    const fetchData = async function () {
      try {
        let result = await axios.get('http://localhost:4000/speakers');
        dispatch({ type: 'setSpeakerList', data: result.data });
      } catch (e) {
        dispatch({ type: 'errored', error: e });
      }
    };
    fetchData();

    return () => {
      console.log('cleanup');
    };
  }, []); // [speakingSunday, speakingSaturday]);
  return {
    isLoading,
    speakerList,
    favoriteClickCount,
    incrementFavoriteClickCount,
    toggleSpeakerFavourite,
    hasErrored,
    error,
  };
}
export default useSpeakerDataManager;
