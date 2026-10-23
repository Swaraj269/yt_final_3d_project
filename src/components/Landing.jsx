// import React from "react";

const Landing = () => {
  const showCircle = () => {
    window.scrollTo({
      top: window.innerHeight * 1.1,
      behavior: "smooth",
    });
  };

  return (
    <main className="landing">
      <section
        className="landing-intro"
        aria-label="Creative developer and designer"
      >
        <div className="landing-title">
          <h1>CREATIVE</h1>
          <h1>DEVELOPER</h1>
          <h1>DESIGNER</h1>
        </div>
        <button
          className="landing-scroll-cue"
          onClick={showCircle}
          type="button"
        >
          <span>SCROLL TO EXPLORE</span>
          <span className="landing-scroll-arrow" aria-hidden="true">
            &darr;
          </span>
        </button>
      </section>
      <div className="landing-scroll-track" aria-hidden="true" />
    </main>
  );
};

export default Landing;
