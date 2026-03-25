import { useState, useEffect } from 'react';

const mockReports = [
  { id: 1, name: 'Anitha T.', trust: 88, type: 'voice', text: 'మీ ఇళ్ళు ఖాళీ చేయండి', ai: 'Evacuation warning issued by community member', loc: 'Kukatpally', time: 'Just now' },
  { id: 2, name: 'Mohan R.', trust: 71, type: 'photo', ai: 'Road blocked, vehicle stranded visible', loc: 'Miyapur', time: '2 mins ago' },
  { id: 3, name: 'Anonymous', trust: 0, type: 'pin', ai: 'Awaiting confirmations', loc: 'Dilsukhnagar', time: '5 mins ago' }
];

export const useRealtimeSimulator = () => {
  const [data, setData] = useState({
    rainfall: 34,
    riverLevel: 6.8,
    activeAlerts: 7,
    communityReports: 142,
    blockedRoads: 3,
    feed: [...mockReports],
    sensorsOnline: 12
  });

  useEffect(() => {
    // Increment basic numbers
    const statsInterval = setInterval(() => {
      setData(prev => ({
        ...prev,
        communityReports: prev.communityReports + 1,
        rainfall: prev.rainfall < 50 ? prev.rainfall + 0.1 : prev.rainfall,
        riverLevel: prev.riverLevel < 7.5 ? prev.riverLevel + 0.05 : prev.riverLevel
      }));
    }, 15000);

    // Add new reports to feed
    const feedInterval = setInterval(() => {
      setData(prev => {
        const newReport = {
          id: Date.now(),
          name: 'SysBot User',
          trust: Math.floor(Math.random() * 100),
          type: Math.random() > 0.5 ? 'photo' : 'pin',
          ai: 'Automated monitoring check',
          loc: 'Hyderabad Zone',
          time: 'Just now'
        };
        return {
          ...prev,
          feed: [newReport, ...prev.feed].slice(0, 50)
        };
      });
    }, 28000);

    return () => {
      clearInterval(statsInterval);
      clearInterval(feedInterval);
    };
  }, []);

  return data;
};
