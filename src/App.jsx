import Home from "./components/Home";
import { useEffect, useRef, useState } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import About from "./components/About";
import ProjectDetail from "./components/ProjectDetail";
// import React from "react";

const App = () => {
  const location = useLocation();
  const [navbarHidden, setNavbarHidden] = useState(false);
  const [navbarFocused, setNavbarFocused] = useState(false);
  const navbarIsHidden = navbarHidden && !navbarFocused;
  const [backToTopVisible, setBackToTopVisible] = useState(false);
  const [backToTopFocused, setBackToTopFocused] = useState(false);
  const backToTopIsVisible = backToTopVisible || backToTopFocused;
  const pageTopRef = useRef(null);

  const scrollToPageTop = (event) => {
    const reduceMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Release focus before scrolling so mobile Safari doesn't restore the button's position.
    event.currentTarget.blur();
    setBackToTopFocused(false);

    pageTopRef.current?.scrollIntoView({
      block: "start",
      behavior: reduceMotion ? "instant" : "smooth",
    });
  };

  useEffect(() => {
    if (location.state?.showCircle) return;

    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.key, location.state]);

  useEffect(() => {
    setNavbarHidden(false);
    const shouldAutoHide =
      location.pathname === "/about" ||
      location.pathname.startsWith("/project/");
    if (!shouldAutoHide) return;

    let previousScrollY = window.scrollY;

    const handleScroll = () => {
      const nextScrollY = window.scrollY;

      // Keep the mobile navbar visible and adapt immediately when the viewport changes.
      if (window.innerWidth <= 900) {
        setNavbarHidden(false);
        previousScrollY = nextScrollY;
        return;
      }

      if (nextScrollY > previousScrollY + 2 && nextScrollY > 64) {
        setNavbarHidden(true);
      } else if (nextScrollY <= 64) {
        setNavbarHidden(false);
      }

      previousScrollY = nextScrollY;
    };

    const handleResize = () => {
      previousScrollY = window.scrollY;
      setNavbarHidden(false);
    };

    const revealNavbarOnHover = (event) => {
      // Keep a generous reveal zone at the top while the navbar is hidden.
      if (event.clientY <= Math.max(88, window.innerHeight * 0.08)) {
        setNavbarHidden(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", revealNavbarOnHover);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", revealNavbarOnHover);
      window.removeEventListener("resize", handleResize);
    };
  }, [location.pathname]);

  useEffect(() => {
    let frameId;

    const updateBackToTopVisibility = () => {
      const documentHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
      );
      const maxScrollY = documentHeight - window.innerHeight;
      setBackToTopVisible(maxScrollY > 0 && window.scrollY >= maxScrollY - 48);
    };

    const scheduleUpdate = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(updateBackToTopVisibility);
    };

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [location.key]);

  return (
    <>
      <div ref={pageTopRef} aria-hidden="true" />
      <div
        className={`navbar${navbarIsHidden ? " navbar-hidden" : ""}`}
        inert={navbarIsHidden}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setNavbarFocused(false);
          }
        }}
        onFocus={(event) => {
          // Pointer clicks should not pin the navbar open; keyboard focus should.
          setNavbarFocused(event.target.matches(":focus-visible"));
        }}
      >
        <div className="name">
          <Link to="/">
            <h3 className="text-[2.1rem] font-medium uppercase">Swaraj Singh</h3>
          </Link>
        </div>
        <div className="aboutLink">
          <Link to="/about">
          {/*The class `font-[600]` can be written as `font-semibold` */}
            <h3 className="text-[2.1rem] cursor-pointer font-semibold uppercase">
              ABOUT
            </h3>
          </Link>
        </div>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
      </Routes>
      <div className="footer">
        <div className="copyright">
          <h3 className="text-[1.7rem] uppercase font-[480]">
            @2026 Swaraj Singh
          </h3>
        </div>
        <div className="contactInfo">
          <div className="socials">
            {/*The class `font-[500]` can be written as `font-medium` */}
            <h3 className="text-[1.5rem] leading-[1.3] font-medium">
              Instagram
            </h3>
            <h3 className="text-[1.5rem] leading-[1.3] font-medium">LinkedIn</h3>
            <h3 className="text-[1.5rem] leading-[1.3] font-medium">Github</h3>
            <h3 className="text-[1.5rem] leading-[1.3] font-medium">Awwwards</h3>
          </div>
          <div className="email">
            <h3 className="font-[450]">
              {/* Fixed a Misspelled word. */}
              Any Project ? or Collaboration ?
            </h3>
            <h4 className="font-semibold">swarajsingh@gmail.com</h4>
          </div>
        </div>
      </div>
      <button
        className={`back-to-top${backToTopIsVisible ? " is-visible" : ""}`}
        inert={!backToTopIsVisible}
        onClick={scrollToPageTop}
        onPointerDown={(event) => event.preventDefault()}
        onBlur={() => setBackToTopFocused(false)}
        onFocus={() => setBackToTopFocused(true)}
        tabIndex={backToTopIsVisible ? 0 : -1}
        type="button"
      >
        <span>Back to top</span>
        <span aria-hidden="true" className="back-to-top-arrow">↑</span>
      </button>
    </>
  );
};

export default App;
