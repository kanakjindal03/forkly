import {
  useEffect,
  useState,
} from "react";
import CustomerApp from "./apps/CustomerApp.jsx";
import OwnerApp from "./apps/OwnerApp.jsx";
import DeliveryApp from "./apps/DeliveryApp.jsx";
import AdminApp from "./apps/AdminApp.jsx";

const PORTALS = [
  {
    id: "customer",
    label: "Customer site",
    desc: "Browse restaurants, order food, track delivery",
    Component: CustomerApp,
    color: "#FF6B35",
  },
  {
    id: "owner",
    label: "Restaurant Owner dashboard",
    desc: "Menu, orders, analytics, coupons",
    Component: OwnerApp,
    color: "#22C55E",
  },
  {
    id: "delivery",
    label: "Delivery Partner dashboard",
    desc: "Accept deliveries, earnings, history",
    Component: DeliveryApp,
    color: "#FFC857",
  },
];

const ADMIN_PORTAL = {
  id: "admin",
  label: "Admin dashboard",
  Component: AdminApp,
};

const ALL_PORTALS = [
  ...PORTALS,
  ADMIN_PORTAL,
];

function SplashScreen() {
  return (
    <div className="forkly-splash">
      <style>{`
        .forkly-splash,
        .forkly-splash * {
          box-sizing: border-box;
        }

        .forkly-splash {
          position: fixed;
          inset: 0;
          z-index: 99999;
          min-height: 100vh;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          color: #ffffff;
          font-family:
            "Inter",
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
          background:
            radial-gradient(
              circle at 50% 42%,
              rgba(255, 139, 82, 0.34),
              transparent 28%
            ),
            linear-gradient(
              160deg,
              #321006 0%,
              #7f240d 42%,
              #e44717 75%,
              #ff6b35 100%
            );
          animation:
            forkly-splash-exit
            2s ease forwards;
        }

        .forkly-splash::before {
          content: "";
          position: absolute;
          width: 480px;
          height: 480px;
          border-radius: 50%;
          top: -280px;
          right: -160px;
          background:
            rgba(255, 200, 87, 0.18);
          filter: blur(8px);
        }

        .forkly-splash::after {
          content: "";
          position: absolute;
          width: 420px;
          height: 420px;
          border-radius: 50%;
          bottom: -250px;
          left: -140px;
          background:
            rgba(255, 107, 53, 0.28);
          filter: blur(10px);
        }

        .forkly-splash-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          animation:
            forkly-splash-content
            0.8s cubic-bezier(
              0.22,
              1,
              0.36,
              1
            ) both;
        }

        .forkly-splash-brand {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 18px;
        }

        .forkly-splash-icon {
          width: 92px;
          height: 92px;
          border-radius: 27px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          background:
            rgba(255, 255, 255, 0.14);
          border:
            1px solid
            rgba(255, 255, 255, 0.3);
          box-shadow:
            0 24px 55px
            rgba(50, 10, 0, 0.34);
          backdrop-filter: blur(12px);
          transform: rotate(-5deg);
          animation:
            forkly-splash-icon
            1.4s ease-in-out infinite
            alternate;
        }

        .forkly-splash-name {
          margin: 0;
          font-size: clamp(
            52px,
            8vw,
            88px
          );
          line-height: 1;
          letter-spacing: -4px;
          font-weight: 900;
          text-shadow:
            0 14px 35px
            rgba(48, 10, 0, 0.28);
        }

        .forkly-splash-tagline {
          margin-top: 22px;
          color:
            rgba(255, 255, 255, 0.78);
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.6px;
        }

        .forkly-splash-loader {
          display: flex;
          gap: 7px;
          margin-top: 26px;
        }

        .forkly-splash-loader span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #ffffff;
          animation:
            forkly-splash-dot
            0.8s ease-in-out infinite
            alternate;
        }

        .forkly-splash-loader
          span:nth-child(2) {
          animation-delay: 0.16s;
        }

        .forkly-splash-loader
          span:nth-child(3) {
          animation-delay: 0.32s;
        }

        @keyframes forkly-splash-content {
          from {
            opacity: 0;
            transform:
              translateY(20px)
              scale(0.94);
          }

          to {
            opacity: 1;
            transform:
              translateY(0)
              scale(1);
          }
        }

        @keyframes forkly-splash-icon {
          from {
            transform:
              rotate(-5deg)
              translateY(0);
          }

          to {
            transform:
              rotate(2deg)
              translateY(-7px);
          }
        }

        @keyframes forkly-splash-dot {
          from {
            opacity: 0.35;
            transform: translateY(0);
          }

          to {
            opacity: 1;
            transform: translateY(-5px);
          }
        }

        @keyframes forkly-splash-exit {
          0%,
          82% {
            opacity: 1;
          }

          100% {
            opacity: 0;
          }
        }

        @media (max-width: 520px) {
          .forkly-splash-brand {
            gap: 13px;
          }

          .forkly-splash-icon {
            width: 67px;
            height: 67px;
            border-radius: 20px;
          }

          .forkly-splash-icon svg {
            width: 38px;
            height: 38px;
          }

          .forkly-splash-name {
            font-size: 54px;
            letter-spacing: -3px;
          }
        }

        @media (
          prefers-reduced-motion:
          reduce
        ) {
          .forkly-splash,
          .forkly-splash-content,
          .forkly-splash-icon,
          .forkly-splash-loader span {
            animation: none !important;
          }
        }
      `}</style>

      <div
        className="forkly-splash-content"
      >
        <div
          className="forkly-splash-brand"
        >
          <div
            className="forkly-splash-icon"
            aria-hidden="true"
          >
            <svg
              width="52"
              height="52"
              viewBox="0 0 64 64"
              fill="none"
            >
              <path
                d="M17 8V27M11 8V18C11 24 23 24 23 18V8M17 27V55"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <path
                d="M43 8C35 17 35 27 43 33V55M43 8V33H51V8"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h1
            className="forkly-splash-name"
          >
            Forkly
          </h1>
        </div>

        <div
          className="forkly-splash-tagline"
        >
          Delicious moments are loading
        </div>

        <div
          className="forkly-splash-loader"
          aria-label="Loading Forkly"
        >
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}
function LandingPicker({ onPick }) {
  const portalDetails = {
    customer: {
      eyebrow:
        "I want to order food",
      icon: "🍜",
      action: "Start ordering",
    },
    owner: {
      eyebrow:
        "I manage a restaurant",
      icon: "🏪",
      action: "Open dashboard",
    },
    delivery: {
      eyebrow:
        "I deliver with Forkly",
      icon: "🛵",
      action: "Start delivering",
    },
  };

  return (
    <div className="forkly-entry">
      <style>{`
        .forkly-entry,
        .forkly-entry * {
          box-sizing: border-box;
        }

        .forkly-entry {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          padding: 34px;
          color: #18120f;
          font-family:
            "Inter",
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
          background:
            radial-gradient(
              circle at 5% 8%,
              rgba(255, 200, 87, 0.22),
              transparent 25%
            ),
            radial-gradient(
              circle at 94% 92%,
              rgba(255, 107, 53, 0.18),
              transparent 28%
            ),
            #fffaf6;
        }

        .forkly-entry-blob {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(2px);
        }

        .forkly-entry-blob-one {
          width: 240px;
          height: 240px;
          top: -130px;
          right: 18%;
          background:
            rgba(255, 107, 53, 0.1);
        }

        .forkly-entry-blob-two {
          width: 180px;
          height: 180px;
          bottom: -100px;
          left: 7%;
          background:
            rgba(255, 200, 87, 0.16);
        }

        .forkly-entry-shell {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 1180px;
          min-height:
            calc(100vh - 68px);
          margin: 0 auto;
          display: grid;
          grid-template-columns:
            minmax(0, 1.08fr)
            minmax(390px, 0.92fr);
          gap: 48px;
          align-items: center;
        }

        .forkly-entry-intro {
          min-width: 0;
        }

        .forkly-entry-brand {
          display: inline-flex;
          align-items: center;
          gap: 11px;
          margin-bottom: 32px;
        }

        .forkly-entry-brand-mark {
          width: 45px;
          height: 45px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          background:
            linear-gradient(
              135deg,
              #ff6b35,
              #ff914d
            );
          box-shadow:
            0 12px 26px
            rgba(255, 107, 53, 0.25);
        }

        .forkly-entry-brand-name {
          font-size: 22px;
          font-weight: 900;
          letter-spacing: -0.7px;
        }

        .forkly-entry-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 14px;
          padding: 7px 11px;
          border-radius: 999px;
          color: #e95420;
          background: #fff0e9;
          font-size: 11.5px;
          font-weight: 800;
          letter-spacing: 0.3px;
          text-transform: uppercase;
        }

        .forkly-entry-title {
          max-width: 620px;
          margin: 0;
          color: #17110e;
          font-size: clamp(
            44px,
            5vw,
            68px
          );
          line-height: 1.01;
          letter-spacing: -3.4px;
          font-weight: 900;
        }

        .forkly-entry-title span {
          color: #ff6330;
        }

        .forkly-entry-description {
          max-width: 550px;
          margin: 20px 0 0;
          color: #766861;
          font-size: 15px;
          line-height: 1.7;
        }

        .forkly-entry-photo {
          position: relative;
          height: 270px;
          margin-top: 30px;
          overflow: hidden;
          border-radius: 27px;
          background: #f0e7df;
          box-shadow:
            0 25px 60px
            rgba(78, 40, 20, 0.16);
        }

        .forkly-entry-photo img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }

        .forkly-entry-photo::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              90deg,
              rgba(29, 13, 5, 0.2),
              transparent 45%
            );
          pointer-events: none;
        }

        .forkly-entry-rating,
        .forkly-entry-delivery {
          position: absolute;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 8px;
          border:
            1px solid
            rgba(255, 255, 255, 0.8);
          background:
            rgba(255, 255, 255, 0.92);
          box-shadow:
            0 12px 28px
            rgba(34, 18, 10, 0.18);
          backdrop-filter: blur(10px);
        }

        .forkly-entry-rating {
          top: 17px;
          left: 17px;
          padding: 9px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 800;
        }

        .forkly-entry-rating span {
          color: #ff9f1c;
          font-size: 15px;
        }

        .forkly-entry-delivery {
          right: 17px;
          bottom: 17px;
          padding: 10px 13px;
          border-radius: 14px;
        }

        .forkly-entry-delivery-icon {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff0e9;
          font-size: 17px;
        }

        .forkly-entry-delivery-copy {
          display: flex;
          flex-direction: column;
          gap: 2px;
          color: #766861;
          font-size: 10.5px;
        }

        .forkly-entry-delivery-copy strong {
          color: #211814;
          font-size: 12px;
        }

        .forkly-picker-panel {
          width: 100%;
          padding: 34px;
          border:
            1px solid
            rgba(74, 47, 34, 0.09);
          border-radius: 30px;
          background:
            rgba(255, 255, 255, 0.94);
          box-shadow:
            0 30px 80px
            rgba(91, 50, 26, 0.13);
          backdrop-filter: blur(18px);
          animation:
            forkly-picker-enter
            0.65s cubic-bezier(
              0.22,
              1,
              0.36,
              1
            ) both;
        }

        .forkly-picker-kicker {
          color: #ff6330;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 1.1px;
          text-transform: uppercase;
        }

        .forkly-picker-title {
          margin: 10px 0 0;
          color: #1a130f;
          font-size: 30px;
          line-height: 1.15;
          letter-spacing: -1.2px;
          font-weight: 900;
        }

        .forkly-picker-description {
          margin: 10px 0 0;
          color: #83746d;
          font-size: 13.5px;
          line-height: 1.55;
        }

        .forkly-portal-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 25px;
        }

        .forkly-portal-option {
          width: 100%;
          min-width: 0;
          display: grid;
          grid-template-columns:
            50px minmax(0, 1fr) 34px;
          gap: 14px;
          align-items: center;
          padding: 15px;
          border:
            1px solid
            #eee4dd;
          border-radius: 18px;
          color: #201713;
          background: #ffffff;
          text-align: left;
          cursor: pointer;
          font-family: inherit;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            border-color 0.2s ease;
        }

        .forkly-portal-option:hover {
          transform:
            translateY(-3px);
          border-color:
            var(--portal-accent);
          box-shadow:
            0 14px 30px
            rgba(72, 39, 22, 0.1);
        }

        .forkly-portal-option-primary {
          color: #ffffff;
          border-color: transparent;
          background:
            linear-gradient(
              135deg,
              #ff6431,
              #ff8654
            );
          box-shadow:
            0 18px 38px
            rgba(255, 100, 49, 0.25);
        }

        .forkly-portal-option-primary:hover {
          border-color: transparent;
          box-shadow:
            0 22px 44px
            rgba(255, 100, 49, 0.32);
        }

        .forkly-portal-icon {
          width: 50px;
          height: 50px;
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          background:
            color-mix(
              in srgb,
              var(--portal-accent) 13%,
              white
            );
          font-size: 22px;
        }

        .forkly-portal-option-primary
          .forkly-portal-icon {
          background:
            rgba(255, 255, 255, 0.18);
        }

        .forkly-portal-copy {
          min-width: 0;
          display: flex;
          flex-direction: column;
        }

        .forkly-portal-eyebrow {
          margin-bottom: 3px;
          color: #9a8c85;
          font-size: 10.5px;
          font-weight: 700;
        }

        .forkly-portal-option-primary
          .forkly-portal-eyebrow {
          color:
            rgba(255, 255, 255, 0.75);
        }

        .forkly-portal-label {
          font-size: 14.5px;
          font-weight: 850;
        }

        .forkly-portal-description {
          margin-top: 4px;
          overflow: hidden;
          color: #8a7c75;
          font-size: 11.5px;
          line-height: 1.4;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .forkly-portal-option-primary
          .forkly-portal-description {
          color:
            rgba(255, 255, 255, 0.78);
        }

        .forkly-portal-arrow {
          width: 34px;
          height: 34px;
          border-radius: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          color:
            var(--portal-accent);
          background:
            color-mix(
              in srgb,
              var(--portal-accent) 11%,
              white
            );
          font-size: 17px;
          font-weight: 800;
          transition:
            transform 0.2s ease;
        }

        .forkly-portal-option:hover
          .forkly-portal-arrow {
          transform:
            translateX(3px);
        }

        .forkly-portal-option-primary
          .forkly-portal-arrow {
          color: #ff6330;
          background: #ffffff;
        }

        .forkly-picker-security {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          margin-top: 19px;
          color: #9a8d86;
          font-size: 10.5px;
        }

        .forkly-picker-security-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow:
            0 0 0 4px
            rgba(34, 197, 94, 0.11);
        }

        @keyframes forkly-picker-enter {
          from {
            opacity: 0;
            transform:
              translateY(22px)
              scale(0.97);
          }

          to {
            opacity: 1;
            transform:
              translateY(0)
              scale(1);
          }
        }

        @media (max-width: 940px) {
          .forkly-entry {
            padding: 24px;
            overflow: auto;
          }

          .forkly-entry-shell {
            min-height: auto;
            grid-template-columns: 1fr;
            gap: 30px;
            padding: 10px 0 30px;
          }

          .forkly-entry-intro {
            text-align: center;
          }

          .forkly-entry-brand {
            margin-bottom: 24px;
          }

          .forkly-entry-eyebrow {
            margin-left: auto;
            margin-right: auto;
          }

          .forkly-entry-title,
          .forkly-entry-description {
            margin-left: auto;
            margin-right: auto;
          }

          .forkly-entry-title {
            max-width: 700px;
          }

          .forkly-entry-photo {
            max-width: 700px;
            margin-left: auto;
            margin-right: auto;
          }

          .forkly-picker-panel {
            max-width: 700px;
            margin: 0 auto;
            text-align: left;
          }
        }

        @media (max-width: 560px) {
          .forkly-entry {
            padding: 16px 14px 28px;
          }

          .forkly-entry-shell {
            gap: 22px;
            padding-top: 4px;
          }

          .forkly-entry-brand {
            margin-bottom: 20px;
          }

          .forkly-entry-brand-mark {
            width: 40px;
            height: 40px;
            border-radius: 12px;
          }

          .forkly-entry-title {
            font-size: 41px;
            letter-spacing: -2.2px;
          }

          .forkly-entry-description {
            margin-top: 15px;
            font-size: 14px;
          }

          .forkly-entry-photo {
            height: 220px;
            margin-top: 22px;
            border-radius: 21px;
          }

          .forkly-entry-rating {
            top: 12px;
            left: 12px;
          }

          .forkly-entry-delivery {
            right: 12px;
            bottom: 12px;
          }

          .forkly-picker-panel {
            padding: 23px 17px;
            border-radius: 23px;
          }

          .forkly-picker-title {
            font-size: 25px;
          }

          .forkly-portal-list {
            margin-top: 20px;
          }

          .forkly-portal-option {
            grid-template-columns:
              45px minmax(0, 1fr)
              30px;
            gap: 11px;
            padding: 13px;
            border-radius: 16px;
          }

          .forkly-portal-icon {
            width: 45px;
            height: 45px;
            border-radius: 13px;
            font-size: 20px;
          }

          .forkly-portal-description {
            white-space: normal;
          }

          .forkly-portal-arrow {
            width: 30px;
            height: 30px;
          }
        }

        @media (
          prefers-reduced-motion:
          reduce
        ) {
          .forkly-picker-panel,
          .forkly-portal-option {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <div
        className="
          forkly-entry-blob
          forkly-entry-blob-one
        "
      />

      <div
        className="
          forkly-entry-blob
          forkly-entry-blob-two
        "
      />

      <main
        className="forkly-entry-shell"
      >
        <section
          className="forkly-entry-intro"
        >
          <div
            className="forkly-entry-brand"
          >
            <div
              className="forkly-entry-brand-mark"
            >
              <svg
                width="27"
                height="27"
                viewBox="0 0 64 64"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M17 8V27M11 8V18C11 24 23 24 23 18V8M17 27V55"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <path
                  d="M43 8C35 17 35 27 43 33V55M43 8V33H51V8"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <span
              className="forkly-entry-brand-name"
            >
              Forkly
            </span>
          </div>

          <div>
            <div
              className="forkly-entry-eyebrow"
            >
              ✦ Food for every moment
            </div>

            <h1
              className="forkly-entry-title"
            >
              Great food.
              <br />
              Delivered{" "}
              <span>your way.</span>
            </h1>

            <p
              className="forkly-entry-description"
            >
              Discover local restaurants,
              order your favourites and
              follow every step from kitchen
              to doorstep.
            </p>
          </div>

          <div
            className="forkly-entry-photo"
          >
            <img
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1400&q=88&auto=format&fit=crop"
              alt="A table filled with colourful freshly prepared food"
            />

            <div
              className="forkly-entry-rating"
            >
              <span>★</span>
              4.8 average rating
            </div>

            <div
              className="forkly-entry-delivery"
            >
              <div
                className="forkly-entry-delivery-icon"
              >
                🛵
              </div>

              <div
                className="forkly-entry-delivery-copy"
              >
                Fast delivery
                <strong>
                  25–30 minutes
                </strong>
              </div>
            </div>
          </div>
        </section>

        <section
          className="forkly-picker-panel"
        >
          <div
            className="forkly-picker-kicker"
          >
            Welcome to Forkly
          </div>

          <h2
            className="forkly-picker-title"
          >
            How would you like to
            continue?
          </h2>

          <p
            className="forkly-picker-description"
          >
            Choose your experience. You
            can switch portals whenever
            you need.
          </p>

          <div
            className="forkly-portal-list"
          >
            {PORTALS.map(
              (portal) => {
                const details =
                  portalDetails[
                    portal.id
                  ];

                const isCustomer =
                  portal.id ===
                  "customer";

                return (
                  <button
                    key={portal.id}
                    type="button"
                    onClick={() =>
                      onPick(
                        portal.id
                      )
                    }
                    className={`forkly-portal-option ${
                      isCustomer
                        ? "forkly-portal-option-primary"
                        : ""
                    }`}
                    style={{
                      "--portal-accent":
                        portal.color,
                    }}
                  >
                    <span
                      className="forkly-portal-icon"
                    >
                      {details.icon}
                    </span>

                    <span
                      className="forkly-portal-copy"
                    >
                      <span
                        className="forkly-portal-eyebrow"
                      >
                        {
                          details.eyebrow
                        }
                      </span>

                      <span
                        className="forkly-portal-label"
                      >
                        {portal.label}
                      </span>

                      <span
                        className="forkly-portal-description"
                      >
                        {portal.desc}
                      </span>
                    </span>

                    <span
                      className="forkly-portal-arrow"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </button>
                );
              }
            )}
          </div>

          <div
            className="forkly-picker-security"
          >
            <span
              className="forkly-picker-security-dot"
            />
            Secure, role-based portal
            access
          </div>
        </section>
      </main>
    </div>
  );
}

function BackButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: "fixed",
        bottom: 18,
        left: 18,
        zIndex: 9999,
        background: "#14171F",
        color: "#fff",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: 999,
        padding: "10px 16px",
        fontSize: 12.5,
        fontWeight: 700,
        cursor: "pointer",
        boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      ← Switch portal
    </button>
  );
}

export default function RootSwitcher() {
  const [
    portalId,
    setPortalId,
  ] = useState(() => {
    const isAdminRoute =
      window.location.hash
        .toLowerCase() ===
      "#/admin";

    if (isAdminRoute) {
      return "admin";
    }

    const savedPortal =
      sessionStorage.getItem(
        "forkly:portal"
      );

    const isValidPortal =
      PORTALS.some(
        (portal) =>
          portal.id === savedPortal
      );

    return isValidPortal
      ? savedPortal
      : null;
  });

 const [
  showSplash,
  setShowSplash,
] = useState(() => {
  const isAdminRoute =
    window.location.hash
      .toLowerCase() ===
    "#/admin";

  const savedPortal =
    sessionStorage.getItem(
      "forkly:portal"
    );

  const hasSavedPortal =
    PORTALS.some(
      (portal) =>
        portal.id === savedPortal
    );

  return (
    !isAdminRoute &&
    !hasSavedPortal
  );
});

  useEffect(() => {
    if (!showSplash) {
      return;
    }

    const timer =
  window.setTimeout(() => {
    setShowSplash(false);
  }, 2000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [showSplash]);

  const handlePickPortal = (
    nextPortalId
  ) => {
    sessionStorage.setItem(
      "forkly:portal",
      nextPortalId
    );

    setPortalId(nextPortalId);
  };

  const handleLeavePortal = () => {
    sessionStorage.removeItem(
      "forkly:portal"
    );

    if (
      window.location.hash
        .toLowerCase() ===
      "#/admin"
    ) {
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}`
      );
    }

    setPortalId(null);
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  if (!portalId) {
    return (
      <LandingPicker
        onPick={handlePickPortal}
      />
    );
  }

  const portal =
    ALL_PORTALS.find(
      (item) =>
        item.id === portalId
    );

  if (!portal) {
    return (
      <LandingPicker
        onPick={handlePickPortal}
      />
    );
  }

  const ActiveApp =
    portal.Component;

  return (
    <div>
      <ActiveApp />

      <BackButton
        onClick={
          handleLeavePortal
        }
      />
    </div>
  );
}
