import Three from "./Three";
import Landing from "./Landing";
// import React from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    if (!location.state?.showCircle) return;

    const frame = requestAnimationFrame(() => {
      window.scrollTo({
        top: window.innerHeight * 1.1,
        behavior: "smooth",
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [location.state]);

  return (
    <div className="home-page">
      <Three />
      <Landing />
    </div>
  );
};

export default Home;
