import React, {useContext,useState,useEffect} from 'react';

const UiCxt = React.createContext();

export function useUiCxt() {
  return useContext(UiCxt);
}

export function UiFuncs({children}) {
    const [loading, setLoading] = useState(true);

  function setBubbleHeight(height){
    window.parent.postMessage(
        {height:height},"*"
    );
  }

  function setBubbleWidth(width){
    window.parent.postMessage(
        {width:width},"*"
    );
  }

  const value = {
    setBubbleHeight,
    setBubbleWidth
  }

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <UiCxt.Provider value={value}>
      {!loading && children}
    </UiCxt.Provider>
  );
}