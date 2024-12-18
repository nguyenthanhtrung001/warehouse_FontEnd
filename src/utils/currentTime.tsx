// components/CurrentTime.tsx
"use client";
import React, { useEffect, useState } from 'react';

const CurrentTime: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>(new Date().toLocaleString());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000);

    // Dọn dẹp khi component bị unmount
    return () => clearInterval(intervalId);
  }, []);

  return <span>{currentTime}</span>;
};

export default CurrentTime;
