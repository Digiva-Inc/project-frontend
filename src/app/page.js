"use client";

import { useEffect, useState } from "react";
import SplashScreen from "./components/SplashScreen";
import Login from "./components/Login";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [fadeSplash, setFadeSplash] = useState(false);
  

  useEffect(() => {
    // Start fade-out after 2s
    const fadeTimer = setTimeout(() => {
      setFadeSplash(true);
    }, 2000);

    // Remove splash after fade
    const endTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(endTimer);
    };
  }, []);

  return showSplash ? (
    <SplashScreen fadeOut={fadeSplash} />
  ) : (
    <Login />
  );
}