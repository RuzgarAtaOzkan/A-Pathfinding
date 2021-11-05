import React, { useEffect } from 'react';

function useInterval(callback, delay) {
  useEffect(() => {
    let id = setInterval(callback, delay);
    return () => {
      clearInterval(id);
      id = id + 1;
    };
  }, []);
}

export default useInterval;
