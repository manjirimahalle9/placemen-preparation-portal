import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

const HLS_VIDEO =
  "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";

export default function App() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    let hls;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = HLS_VIDEO;

      video.play().catch(() => {
        console.log("Autoplay blocked until user interaction.");
      });
    } else if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });

      hls.loadSource(HLS_VIDEO);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {
          console.log("Autoplay blocked until user interaction.");
        });
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.log("HLS Error:", data);

        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;

            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;

            default:
              hls.destroy();
              break;
          }
        }
      });
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <>
      <style>{`
        @import url(
          'https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&display=swap'
        );

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: #050706;
          color: white;
          font-family: "Figtree", sans-serif;
        }

        button,
        input,
        textarea {
          font-family: inherit;
        }

        button {
          -webkit-tap-highlight-color: transparent;
        }

        .placement-page {
          position: relative;
          min-height: 100vh;
          overflow-x: hidden;
          background: #050706;
        }

        /* VIDEO */

        .video-background {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100vh;
          z-index: 0;
          overflow: hidden;
          background: #050706;
        }

        .background-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }

        .video-dark-overlay {
          position: absolute;
          inset: 0;
          z-index: 1;
          background:
            linear-gradient(
              90deg,
              rgba(0, 0, 0, 0.82) 0%,
              rgba(0, 0, 0, 0.46) 48%,
              rgba(0, 0, 0, 0.65) 100%
            );
        }

        .video-gradient {
          position: absolute;
          inset: 0;
          z-index: 2;
          background:
            linear-gradient(
              to bottom,
              rgba(0, 0, 0, 0.75) 0%,
              rgba(0, 0, 0, 0.10) 35%,
              rgba(5, 7, 6, 0.90) 100%
            );
        }

        /* NAVBAR */

        .glass-navbar {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          width: calc(100% - 50px);
          max-width: 1400px;
          min-height: 74px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 12px 18px;

          z-index: 100;

          border: 1px solid rgba(255, 255, 255, 0.14);

          background: rgba(15, 18, 17, 0.48);

          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);

          border-radius: 18px;

          box-shadow:
            0 20px 70px rgba(0, 0, 0, 0.35);
        }

        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 11px;
          min-width: max-content;
        }

        .logo-box {
          width: 42px;
          height: 42px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 12px;

          background: #008c70;

          font-size: 21px;
          font-weight: 800;

          box-shadow:
            0 0 25px rgba(0, 140, 112, 0.35);
        }

        .navbar-logo h2 {
          margin: 0;
          font-size: 17px;
          line-height: 18px;
          font-weight: 700;
        }

        .navbar-logo span {
          display: block;
          margin-top: 3px;

          color: rgba(255, 255, 255, 0.48);

          font-size: 9px;
          letter-spacing: 0.7px;
          text-transform: uppercase;
        }

        /* NAVIGATION */

        .desktop-navigation {
          display: flex;
          align-items: center;
          gap: 27px;
        }

        .desktop-navigation a {
          position: relative;

          color: rgba(255, 255, 255, 0.68);

          text-decoration: none;

          font-size: 13px;
          font-weight: 500;

          transition: color 0.3s ease;
        }

        .desktop-navigation a::after {
          content: "";

          position: absolute;

          left: 0;
          bottom: -7px;

          width: 100%;
          height: 1px;

          background: #008c70;

          transform: scaleX(0);
          transform-origin: right;

          transition: transform 0.35s ease;
        }

        .desktop-navigation a:hover {
          color: white;
        }

        .desktop-navigation a:hover::after {
          transform: scaleX(1);
          transform-origin: left;
        }

        /* RIGHT NAV */

        .navbar-right {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .availability {
          display: flex;
          align-items: center;
          gap: 7px;

          color: rgba(255, 255, 255, 0.65);

          font-size: 11px;
        }

        .availability-dot {
          width: 7px;
          height: 7px;

          border-radius: 50%;

          background: #44e3ad;

          box-shadow: 0 0 12px #44e3ad;

          animation: pulse 1.7s infinite;
        }

        .profile-button {
          width: 40px;
          height: 40px;

          border: 1px solid rgba(255, 255, 255, 0.15);

          border-radius: 50%;

          background: rgba(255, 255, 255, 0.08);

          color: white;

          font-weight: 700;

          cursor: pointer;

          transition: all 0.3s ease;
        }

        .profile-button:hover {
          background: #008c70;
          border-color: #008c70;
        }

        /* HERO */

        .hero-section {
          position: relative;

          z-index: 2;

          min-height: 100vh;

          display: flex;
          align-items: flex-end;

          padding: 150px 7vw 95px;
        }

        .hero-content {
          max-width: 760px;
        }

        .hero-small-title {
          display: flex;
          align-items: center;

          gap: 10px;

          margin-bottom: 21px;

          color: rgba(255, 255, 255, 0.62);

          font-size: 11px;
          font-weight: 600;

          letter-spacing: 2px;
        }

        .hero-line {
          width: 35px;
          height: 1px;

          background: #008c70;
        }

        .hero-content h1 {
          margin: 0 0 30px;

          font-size: clamp(65px, 8vw, 125px);

          line-height: 0.84;

          letter-spacing: -6px;

          font-weight: 600;
        }

        .hero-green {
          color: #008c70;

          text-shadow:
            0 0 40px rgba(0, 140, 112, 0.2);
        }

        .hero-description {
          max-width: 550px;

          margin-bottom: 28px;

          color: rgba(255, 255, 255, 0.65);

          font-size: 17px;

          line-height: 1.55;
        }

        /* BUTTONS */

        .hero-buttons {
          display: flex;
          gap: 12px;
        }

        .primary-button,
        .secondary-button {
          padding: 14px 21px;

          border-radius: 8px;

          font-size: 12px;
          font-weight: 600;

          cursor: pointer;

          transition: all 0.3s ease;
        }

        .primary-button {
          border: 1px solid #008c70;

          background: #008c70;

          color: white;

          box-shadow:
            0 8px 30px rgba(0, 140, 112, 0.18);
        }

        .primary-button span {
          margin-left: 18px;
          font-size: 17px;
        }

        .primary-button:hover {
          background: #00a985;

          transform: translateY(-3px);

          box-shadow:
            0 12px 35px rgba(0, 140, 112, 0.3);
        }

        .secondary-button {
          border: 1px solid rgba(255, 255, 255, 0.20);

          background: rgba(255, 255, 255, 0.07);

          color: white;

          backdrop-filter: blur(10px);
        }

        .secondary-button:hover {
          background: rgba(255, 255, 255, 0.14);

          transform: translateY(-3px);
        }

        /* STATS */

        .hero-stats {
          display: flex;

          gap: 38px;

          margin-top: 42px;
        }

        .hero-stat {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .hero-stat strong {
          font-size: 20px;
        }

        .hero-stat span {
          color: rgba(255, 255, 255, 0.43);

          font-size: 10px;

          text-transform: uppercase;

          letter-spacing: 1px;
        }

        /* DASHBOARD */

        .dashboard-content {
          position: relative;

          z-index: 5;

          padding: 100px 7vw 110px;

          background:
            linear-gradient(
              to bottom,
              rgba(5, 7, 6, 0.72),
              #050706 13%
            );
        }

        .dashboard-heading {
          max-width: 1400px;

          margin: 0 auto 35px;

          display: flex;

          align-items: flex-end;

          justify-content: space-between;
        }

        .section-label {
          color: #008c70;

          font-size: 10px;

          letter-spacing: 2px;

          font-weight: 700;
        }

        .dashboard-heading h2 {
          margin-top: 7px;

          font-size: clamp(30px, 4vw, 54px);

          letter-spacing: -2px;
        }

        .dashboard-heading p {
          margin-top: 8px;

          color: rgba(255, 255, 255, 0.48);

          font-size: 13px;
        }

        /* STREAK */

        .streak-card {
          display: flex;

          align-items: center;

          gap: 12px;

          padding: 15px 20px;

          border: 1px solid rgba(255, 255, 255, 0.1);

          background: rgba(255, 255, 255, 0.05);

          backdrop-filter: blur(18px);

          border-radius: 12px;
        }

        .fire {
          font-size: 28px;

          filter:
            drop-shadow(
              0 0 10px rgba(255, 100, 20, 0.35)
            );
        }

        .streak-card strong,
        .streak-card small {
          display: block;
        }

        .streak-card strong {
          font-size: 16px;
        }

        .streak-card small {
          margin-top: 3px;

          color: rgba(255, 255, 255, 0.43);

          font-size: 10px;
        }

        /* GRID */

        .dashboard-grid {
          max-width: 1400px;

          margin: auto;

          display: grid;

          grid-template-columns: repeat(4, 1fr);

          gap: 15px;
        }

        .dashboard-card {
          position: relative;

          min-height: 340px;

          padding: 23px;

          overflow: hidden;

          border: 1px solid rgba(255, 255, 255, 0.11);

          background:
            linear-gradient(
              145deg,
              rgba(255, 255, 255, 0.09),
              rgba(255, 255, 255, 0.025)
            );

          backdrop-filter: blur(22px);

          border-radius: 18px;

          transition:
            transform 0.4s ease,
            border 0.4s ease,
            background 0.4s ease;
        }

        .dashboard-card::before {
          content: "";

          position: absolute;

          top: -80px;
          right: -80px;

          width: 180px;
          height: 180px;

          border-radius: 50%;

          background: rgba(0, 140, 112, 0.12);

          filter: blur(30px);

          opacity: 0;

          transition: opacity 0.4s ease;
        }

        .dashboard-card:hover {
          transform: translateY(-8px);

          border-color: rgba(0, 140, 112, 0.55);

          background:
            linear-gradient(
              145deg,
              rgba(255, 255, 255, 0.12),
              rgba(255, 255, 255, 0.035)
            );
        }

        .dashboard-card:hover::before {
          opacity: 1;
        }

        .card-icon {
          width: 52px;
          height: 52px;

          display: flex;

          align-items: center;
          justify-content: center;

          margin-bottom: 35px;

          border-radius: 14px;

          background: rgba(0, 140, 112, 0.15);

          font-size: 23px;
        }

        .card-number {
          color: rgba(255, 255, 255, 0.32);

          font-size: 10px;
        }

        .card-content h3 {
          margin: 5px 0 10px;

          font-size: 25px;
        }

        .card-content p {
          min-height: 65px;

          color: rgba(255, 255, 255, 0.47);

          font-size: 12px;

          line-height: 1.55;
        }

        /* PROGRESS */

        .progress-container {
          display: flex;

          align-items: center;

          gap: 10px;

          margin-top: 20px;
        }

        .progress-bar {
          flex: 1;

          height: 4px;

          overflow: hidden;

          border-radius: 20px;

          background: rgba(255, 255, 255, 0.1);
        }

        .progress-fill {
          height: 100%;

          border-radius: 20px;

          background:
            linear-gradient(
              90deg,
              #008c70,
              #00c49c
            );
        }

        .progress-percent {
          color: #008c70;

          font-size: 10px;
        }

        .card-button {
          margin-top: 20px;

          padding: 0;

          border: none;

          background: none;

          color: white;

          font-size: 11px;

          font-weight: 600;

          cursor: pointer;

          transition: 0.3s;
        }

        .card-button:hover {
          color: #00c49c;

          transform: translateX(4px);
        }

        /* COMPANY TAGS */

        .company-tags {
          display: flex;

          flex-wrap: wrap;

          gap: 5px;

          margin-top: 16px;
        }

        .company-tags span {
          padding: 5px 8px;

          border-radius: 5px;

          background: rgba(255, 255, 255, 0.07);

          color: rgba(255, 255, 255, 0.55);

          font-size: 9px;
        }

        /* BOTTOM */

        .bottom-dashboard {
          max-width: 1400px;

          margin: 15px auto 0;

          display: grid;

          grid-template-columns: 1.5fr 1fr;

          gap: 15px;
        }

        .glass-box {
          border: 1px solid rgba(255, 255, 255, 0.10);

          background: rgba(255, 255, 255, 0.05);

          backdrop-filter: blur(22px);

          border-radius: 18px;

          padding: 25px;
        }

        /* LEADERBOARD */

        .bottom-title {
          display: flex;

          align-items: center;

          justify-content: space-between;

          margin-bottom: 15px;
        }

        .bottom-label {
          color: #008c70;

          font-size: 9px;

          letter-spacing: 1.5px;

          font-weight: 700;
        }

        .bottom-title h3 {
          margin-top: 5px;

          font-size: 24px;
        }

        .rank {
          color: rgba(255, 255, 255, 0.45);

          font-size: 11px;
        }

        .leader-row {
          display: flex;

          align-items: center;

          gap: 15px;

          padding: 13px 0;

          border-top:
            1px solid rgba(255, 255, 255, 0.07);
        }

        .leader-position {
          width: 25px;

          color: rgba(255, 255, 255, 0.3);

          font-size: 11px;
        }

        .leader-user {
          flex: 1;

          display: flex;

          align-items: center;

          gap: 10px;
        }

        .avatar {
          width: 34px;
          height: 34px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background: #008c70;

          font-size: 11px;

          font-weight: 700;
        }

        .leader-user strong,
        .leader-user small {
          display: block;
        }

        .leader-user strong {
          font-size: 12px;
        }

        .leader-user small {
          margin-top: 2px;

          color: rgba(255, 255, 255, 0.4);

          font-size: 9px;
        }

        /* DAILY GOAL */

        .daily-goal h3 {
          margin-top: 9px;

          font-size: 26px;
        }

        .daily-goal-description {
          max-width: 420px;

          margin-top: 7px;

          color: rgba(255, 255, 255, 0.48);

          font-size: 12px;

          line-height: 1.5;
        }

        .goal-progress {
          display: flex;

          align-items: center;

          gap: 15px;

          margin-top: 25px;
        }

        .goal-circle {
          width: 65px;
          height: 65px;

          display: flex;

          align-items: center;
          justify-content: center;

          border: 5px solid #008c70;

          border-radius: 50%;

          font-size: 13px;

          box-shadow:
            0 0 25px rgba(0, 140, 112, 0.13);
        }

        .goal-info strong,
        .goal-info small {
          display: block;
        }

        .goal-info strong {
          font-size: 12px;
        }

        .goal-info small {
          margin-top: 4px;

          color: rgba(255, 255, 255, 0.4);

          font-size: 9px;
        }

        .goal-button {
          margin-top: 20px;

          padding: 0;

          border: none;

          background: none;

          color: white;

          font-size: 11px;

          font-weight: 600;

          cursor: pointer;
        }

        .goal-button:hover {
          color: #008c70;
        }

        /* FOOTER */

        .footer {
          position: relative;

          z-index: 5;

          padding: 35px 7vw;

          border-top:
            1px solid rgba(255, 255, 255, 0.08);

          background: #050706;

          color: rgba(255, 255, 255, 0.4);

          font-size: 11px;
        }

        .footer-inner {
          max-width: 1400px;

          margin: auto;

          display: flex;

          align-items: center;

          justify-content: space-between;
        }

        .footer-brand {
          color: white;

          font-weight: 700;
        }

        /* ANIMATION */

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }

          50% {
            transform: scale(1.5);
            opacity: 0.45;
          }
        }

        /* TABLET */

        @media (max-width: 1100px) {
          .desktop-navigation {
            display: none;
          }

          .dashboard-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .bottom-dashboard {
            grid-template-columns: 1fr;
          }
        }

        /* MOBILE */

        @media (max-width: 700px) {
          .glass-navbar {
            top: 12px;

            width: calc(100% - 24px);

            border-radius: 14px;
          }

          .navbar-logo span {
            display: none;
          }

          .availability {
            display: none;
          }

          .hero-section {
            min-height: 100svh;

            padding: 130px 22px 60px;

            align-items: flex-end;
          }

          .hero-content h1 {
            font-size: clamp(58px, 17vw, 85px);

            letter-spacing: -4px;
          }

          .hero-description {
            font-size: 14px;
          }

          .hero-buttons {
            flex-direction: column;

            width: 100%;
          }

          .primary-button,
          .secondary-button {
            width: 100%;
          }

          .hero-stats {
            gap: 20px;

            margin-top: 28px;
          }

          .hero-stat strong {
            font-size: 16px;
          }

          .hero-stat span {
            font-size: 8px;
          }

          .dashboard-content {
            padding: 70px 18px;
          }

          .dashboard-heading {
            align-items: flex-start;

            flex-direction: column;

            gap: 20px;
          }

          .dashboard-grid {
            grid-template-columns: 1fr;
          }

          .dashboard-card {
            min-height: auto;
          }

          .bottom-title {
            align-items: flex-start;

            flex-direction: column;

            gap: 8px;
          }

          .footer-inner {
            flex-direction: column;

            gap: 10px;

            align-items: flex-start;
          }
        }

        /* REDUCED MOTION */

        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }

          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <div className="placement-page">

        {/* VIDEO BACKGROUND */}

        <div className="video-background">

          <video
            ref={videoRef}
            className="background-video"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          />

          <div className="video-dark-overlay"></div>

          <div className="video-gradient"></div>

        </div>

        {/* NAVBAR */}

        <header className="glass-navbar">

          <div className="navbar-logo">

            <div className="logo-box">
              P
            </div>

            <div>
              <h2>PlacementX</h2>

              <span>
                Career Preparation Portal
              </span>
            </div>

          </div>

          <nav
            className="desktop-navigation"
            aria-label="Main navigation"
          >

            <a href="#dashboard">
              Dashboard
            </a>

            <a href="#aptitude">
              Aptitude
            </a>

            <a href="#coding">
              Coding
            </a>

            <a href="#companies">
              Companies
            </a>

            <a href="#interview">
              Interview
            </a>

          </nav>

          <div className="navbar-right">

            <div className="availability">

              <span className="availability-dot"></span>

              Available for placement

            </div>

            <button
              className="profile-button"
              type="button"
              aria-label="Open profile"
            >
              M
            </button>

          </div>

        </header>

        {/* HERO */}

        <section
          className="hero-section"
          aria-label="Placement preparation introduction"
        >

          <div className="hero-content">

            <div className="hero-small-title">

              <span className="hero-line"></span>

              YOUR CAREER STARTS HERE

            </div>

            <h1>

              Prepare.

              <br />

              <span className="hero-green">
                Practice.
              </span>

              <br />

              Get Hired.

            </h1>

            <p className="hero-description">

              One powerful platform to prepare for
              aptitude, coding, technical interviews
              and your dream company.

            </p>

            <div className="hero-buttons">

              <button
                className="primary-button"
                type="button"
                onClick={() =>
                  scrollToSection("dashboard")
                }
              >

                Start Preparation

                <span>
                  →
                </span>

              </button>

              <button
                className="secondary-button"
                type="button"
                onClick={() =>
                  scrollToSection("companies")
                }
              >

                Explore Companies

              </button>

            </div>

            <div className="hero-stats">

              <div className="hero-stat">

                <strong>
                  500+
                </strong>

                <span>
                  Questions
                </span>

              </div>

              <div className="hero-stat">

                <strong>
                  50+
                </strong>

                <span>
                  Companies
                </span>

              </div>

              <div className="hero-stat">

                <strong>
                  100+
                </strong>

                <span>
                  Interview Topics
                </span>

              </div>

            </div>

          </div>

        </section>

        {/* DASHBOARD */}

        <section
          id="dashboard"
          className="dashboard-content"
        >

          <div className="dashboard-heading">

            <div>

              <span className="section-label">
                YOUR DASHBOARD
              </span>

              <h2>
                Continue your preparation
              </h2>

              <p>
                Track your progress and improve
                your placement readiness every day.
              </p>

            </div>

            <div className="streak-card">

              <span className="fire">
                🔥
              </span>

              <div>

                <strong>
                  7 Days
                </strong>

                <small>
                  Current Streak
                </small>

              </div>

            </div>

          </div>

          {/* DASHBOARD CARDS */}

          <div className="dashboard-grid">

            {/* APTITUDE */}

            <div
              id="aptitude"
              className="dashboard-card"
            >

              <div className="card-icon">
                🧠
              </div>

              <div className="card-content">

                <span className="card-number">
                  01
                </span>

                <h3>
                  Aptitude
                </h3>

                <p>
                  Quantitative aptitude,
                  logical reasoning and
                  verbal ability.
                </p>

                <div className="progress-container">

                  <div className="progress-bar">

                    <div
                      className="progress-fill"
                      style={{ width: "72%" }}
                    />

                  </div>

                  <span className="progress-percent">
                    72%
                  </span>

                </div>

                <button
                  className="card-button"
                  type="button"
                >
                  Continue →
                </button>

              </div>

            </div>

            {/* CODING */}

            <div
              id="coding"
              className="dashboard-card"
            >

              <div className="card-icon">
                💻
              </div>

              <div className="card-content">

                <span className="card-number">
                  02
                </span>

                <h3>
                  Coding
                </h3>

                <p>
                  Practice programming
                  problems and improve
                  your problem-solving skills.
                </p>

                <div className="progress-container">

                  <div className="progress-bar">

                    <div
                      className="progress-fill"
                      style={{ width: "58%" }}
                    />

                  </div>

                  <span className="progress-percent">
                    58%
                  </span>

                </div>

                <button
                  className="card-button"
                  type="button"
                >
                  Start Coding →
                </button>

              </div>

            </div>

            {/* INTERVIEW */}

            <div
              id="interview"
              className="dashboard-card"
            >

              <div className="card-icon">
                🎤
              </div>

              <div className="card-content">

                <span className="card-number">
                  03
                </span>

                <h3>
                  Interview
                </h3>

                <p>
                  Technical, HR and behavioral
                  interview preparation.
                </p>

                <div className="progress-container">

                  <div className="progress-bar">

                    <div
                      className="progress-fill"
                      style={{ width: "43%" }}
                    />

                  </div>

                  <span className="progress-percent">
                    43%
                  </span>

                </div>

                <button
                  className="card-button"
                  type="button"
                >
                  Practice Interview →
                </button>

              </div>

            </div>

            {/* COMPANIES */}

            <div
              id="companies"
              className="dashboard-card"
            >

              <div className="card-icon">
                🏢
              </div>

              <div className="card-content">

                <span className="card-number">
                  04
                </span>

                <h3>
                  Companies
                </h3>

                <p>
                  Explore company-specific
                  preparation, skills and
                  interview rounds.
                </p>

                <div className="company-tags">

                  <span>
                    BMW
                  </span>

                  <span>
                    Mercedes
                  </span>

                  <span>
                    Rolls-Royce
                  </span>

                </div>

                <button
                  className="card-button"
                  type="button"
                >
                  Explore Companies →
                </button>

              </div>

            </div>

          </div>

          {/* BOTTOM DASHBOARD */}

          <div className="bottom-dashboard">

            {/* LEADERBOARD */}

            <div className="glass-box">

              <div className="bottom-title">

                <div>

                  <span className="bottom-label">
                    PLACEMENT COMMUNITY
                  </span>

                  <h3>
                    Leaderboard
                  </h3>

                </div>

                <span className="rank">
                  Your Rank #12
                </span>

              </div>

              <div className="leader-row">

                <span className="leader-position">
                  01
                </span>

                <div className="leader-user">

                  <div className="avatar">
                    A
                  </div>

                  <div>

                    <strong>
                      Aditya
                    </strong>

                    <small>
                      2,850 XP
                    </small>

                  </div>

                </div>

                <strong>
                  🏆
                </strong>

              </div>

              <div className="leader-row">

                <span className="leader-position">
                  02
                </span>

                <div className="leader-user">

                  <div className="avatar">
                    R
                  </div>

                  <div>

                    <strong>
                      Rahul
                    </strong>

                    <small>
                      2,640 XP
                    </small>

                  </div>

                </div>

                <strong>
                  🥈
                </strong>

              </div>

              <div className="leader-row">

                <span className="leader-position">
                  03
                </span>

                <div className="leader-user">

                  <div className="avatar">
                    S
                  </div>

                  <div>

                    <strong>
                      Shreya
                    </strong>

                    <small>
                      2,430 XP
                    </small>

                  </div>

                </div>

                <strong>
                  🥉
                </strong>

              </div>

            </div>

            {/* DAILY GOAL */}

            <div className="glass-box daily-goal">

              <span className="bottom-label">
                DAILY GOAL
              </span>

              <h3>
                Keep your streak alive 🔥
              </h3>

              <p className="daily-goal-description">
                Complete today's preparation
                tasks to maintain your progress.
              </p>

              <div className="goal-progress">

                <div className="goal-circle">

                  <strong>
                    75%
                  </strong>

                </div>

                <div className="goal-info">

                  <strong>
                    3 of 4 tasks completed
                  </strong>

                  <small>
                    1 task remaining today
                  </small>

                </div>

              </div>

              <button
                className="goal-button"
                type="button"
              >
                Continue Learning →
              </button>

            </div>

          </div>

        </section>

        {/* FOOTER */}

        <footer className="footer">

          <div className="footer-inner">

            <span className="footer-brand">
              PlacementX
            </span>

            <span>
              Build skills. Practice daily. Get hired.
            </span>

            <span>
              © 2026 Placement Preparation Portal
            </span>

          </div>

        </footer>

      </div>
    </>
  );
}