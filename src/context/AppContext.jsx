import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRealtimeSimulator } from '../services/realtimeSimulator';
import { translations } from '../translations';
import { fetchRealtimeWeather } from '../services/weatherService';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const realtimeData = useRealtimeSimulator();
  
  const [user, setUser] = useState({
    isLoggedIn: false,
    isGuest: false,
    name: 'User',
    phone: '',
    trustScore: 87,
    reports: 14,
    avatar: 'US'
  });

  const [offlineMode, setOfflineMode] = useState(localStorage.getItem('offlineMode') === 'true');
  const [textSize, setTextSize] = useState(localStorage.getItem('textSize') || 'Normal');
  
  useEffect(() => {
    localStorage.setItem('offlineMode', offlineMode.toString());
  }, [offlineMode]);

  useEffect(() => {
    localStorage.setItem('textSize', textSize);
    if(textSize === 'Large') {
       document.documentElement.style.fontSize = '120%';
    } else {
       document.documentElement.style.fontSize = '100%';
    }
  }, [textSize]);

  const [language, setLanguageState] = useState(
    localStorage.getItem('userLanguage') || 'English'
  );
  
  const setLanguage = (lang) => {
    localStorage.setItem('userLanguage', lang);
    setLanguageState(lang);
  };
  
  const t = (key) => {
    return translations[language]?.[key] || translations['English']?.[key] || key;
  };

  const [toasts, setToasts] = useState([]);
  const showToast = (msg='This feature will be available in the live version.') => {
    const id = Date.now();
    setToasts(p => [...p, {id, msg}]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
  };

  const [theme, setTheme] = useState('dark');
  const [tourCompleted, setTourCompleted] = useState(
    localStorage.getItem('tourCompleted') === 'true'
  );

  const [emergencyMode, setEmergencyMode] = useState(false);

  // Geo Location & Live Weather State
  const [gps, setGps] = useState({ lat: 17.385, lng: 78.4867, valid: false, denied: false });
  const [liveWeather, setLiveWeather] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => setGps({ lat: pos.coords.latitude, lng: pos.coords.longitude, valid: true, denied: false }),
        (err) => setGps(prev => ({ ...prev, denied: true })),
        { enableHighAccuracy: true, maximumAge: 10000 }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  useEffect(() => {
    let interval;
    const updateWeather = async () => {
      const res = await fetchRealtimeWeather(gps.lat, gps.lng);
      if(res.success) {
        setLiveWeather(res.data);
      }
    };
    // Initial fetch
    updateWeather();
    // 30 minute interval (1800000 ms)
    interval = setInterval(updateWeather, 1800000);
    return () => clearInterval(interval);
  }, [gps.lat, gps.lng]);

  const completeTour = () => {
    setTourCompleted(true);
    localStorage.setItem('tourCompleted', 'true');
  };

  const login = (userData) => {
    const name = userData.name || 'User';
    const words = name.split(' ').filter(w => w.length > 0);
    let avatar = 'US';
    if (words.length >= 2) {
      avatar = (words[0][0] + words[1][0]).toUpperCase();
    } else if (name.length >= 2) {
      avatar = name.substring(0, 2).toUpperCase();
    } else if (name.length === 1) {
      avatar = name[0].toUpperCase();
    }
    setUser({ ...user, ...userData, name, avatar, isLoggedIn: true });
  };

  const loginGuest = () => {
    setUser({ ...user, isLoggedIn: true, isGuest: true, name: 'Guest User', avatar: 'G' });
  };

  const logout = () => {
    setUser({ isLoggedIn: false, isGuest: false, name: 'User', phone: '', trustScore: 0, reports: 0, avatar: 'US' });
  };

  const addTrustPoints = (points) => {
    setUser(prev => ({ ...prev, trustScore: prev.trustScore + points }));
  };

  return (
    <AppContext.Provider value={{
      user, login, loginGuest, logout, addTrustPoints,
      language, setLanguage, t,
      theme, setTheme,
      tourCompleted, completeTour,
      emergencyMode, setEmergencyMode,
      offlineMode, setOfflineMode,
      textSize, setTextSize,
      realtimeData: liveWeather ? { ...realtimeData, rainfall: liveWeather.rain, temperature: liveWeather.temperature_2m, isLive: true } : realtimeData, 
      liveWeather, gps,
      showToast
    }}>
      {children}
      {/* Global Toasts */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className="bg-[#00D4FF] text-[#040812] px-4 py-2 rounded shadow-[0_0_15px_rgba(0,212,255,0.4)] text-sm font-bold animate-[slideUp_0.3s_ease]">
            {t.msg}
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
