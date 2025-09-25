import {useEffect} from 'react'


const proxy = import.meta.env.BACKEND_PROXY_URL || 'http://localhost:3001/api';

export const useAlertOnLeaving = () => {

const sessionId = localStorage.getItem('sessionIdOmlt');

//Prevent user from leaving the page without warning
useEffect(() => {
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = '';
    navigator.sendBeacon(`${proxy}/cleanup?sessionId=${sessionId}`);
  };
  window.addEventListener('beforeunload', handleBeforeUnload);
  return () => window.removeEventListener('beforeunload', handleBeforeUnload);
}, [sessionId]);

    return null;
};

