import { useState } from "react";
import {
  Bike,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  LogIn,
  Mail,
  ShieldCheck,
  Store,
  UtensilsCrossed,
} from "lucide-react";

export default function PortalLogin({
  portalName,
  description,
  onRegister,
  registerLabel =
    "Create account",
  onLogin,
}) {
  const [email, setEmail] =
  useState("");

const [password, setPassword] =
  useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const portalKey =
    portalName.toLowerCase();

  const isDelivery =
    portalKey.includes("delivery");

  const isAdmin =
    portalKey.includes("admin");

  const accent = isAdmin
    ? "#6366F1"
    : isDelivery
      ? "#F59E0B"
      : "#22C55E";

  const accentSoft = isAdmin
    ? "#EEF2FF"
    : isDelivery
      ? "#FFF8E7"
      : "#ECFDF3";

  const visualImage = isAdmin
    ? "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=86&auto=format&fit=crop"
    : isDelivery
      ? "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=86&auto=format&fit=crop"
      : "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=86&auto=format&fit=crop";

  const visualTitle = isAdmin
    ? "Manage the Forkly platform with confidence."
    : isDelivery
      ? "Deliver great meals and earn on your schedule."
      : "Grow your restaurant with every order.";

  const visualDescription = isAdmin
    ? "Review platform activity, approvals and performance from one secure workspace."
    : isDelivery
      ? "Accept nearby deliveries, track earnings and help customers enjoy every order."
      : "Manage menus, orders, offers and performance from one simple dashboard.";

  const PortalIcon = isAdmin
    ? ShieldCheck
    : isDelivery
      ? Bike
      : Store;

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (
      !email.trim() ||
      !password
    ) {
      setError(
        "Email and password are required."
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      await onLogin(
        email.trim(),
        password
      );
    } catch (loginError) {
      setError(
        loginError.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="forkly-portal-login"
      style={{
        "--portal-accent":
          accent,
        "--portal-soft":
          accentSoft,
      }}
    >
      <style>{`
        .forkly-portal-login,
        .forkly-portal-login * {
          box-sizing: border-box;
        }

        .forkly-portal-login {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px;
          color: #201713;
          font-family:
            "Inter",
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
          background:
            radial-gradient(
              circle at 8% 10%,
              rgba(255, 107, 53, 0.14),
              transparent 24%
            ),
            radial-gradient(
              circle at 92% 90%,
              var(--portal-soft),
              transparent 31%
            ),
            #fffaf6;
        }

        .forkly-portal-login::before {
          content: "";
          position: absolute;
          width: 280px;
          height: 280px;
          top: -160px;
          right: 13%;
          border-radius: 50%;
          background:
            rgba(255, 200, 87, 0.16);
        }

        .forkly-portal-login-shell {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 1060px;
          min-height: 650px;
          display: grid;
          grid-template-columns:
            minmax(0, 1.02fr)
            minmax(400px, 0.98fr);
          overflow: hidden;
          border:
            1px solid
            rgba(83, 51, 34, 0.1);
          border-radius: 31px;
          background: #ffffff;
          box-shadow:
            0 35px 90px
            rgba(74, 40, 21, 0.16);
          animation:
            forkly-portal-login-enter
            0.55s cubic-bezier(
              0.22,
              1,
              0.36,
              1
            ) both;
        }

        .forkly-portal-login-visual {
          position: relative;
          min-height: 650px;
          overflow: hidden;
          color: #ffffff;
        }

        .forkly-portal-login-visual
          > img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .forkly-portal-login-visual::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              180deg,
              rgba(24, 10, 4, 0.13),
              rgba(28, 13, 6, 0.82)
            );
        }

        .forkly-portal-visual-content {
          position: relative;
          z-index: 2;
          min-height: 650px;
          display: flex;
          flex-direction: column;
          justify-content:
            space-between;
          padding: 37px;
        }

        .forkly-portal-brand {
          display: inline-flex;
          align-items: center;
          gap: 11px;
          font-size: 21px;
          font-weight: 900;
          letter-spacing: -0.7px;
        }

        .forkly-portal-brand-mark {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          background:
            linear-gradient(
              135deg,
              #ff6030,
              #ff9560
            );
          box-shadow:
            0 12px 28px
            rgba(34, 12, 3, 0.25);
        }

        .forkly-portal-visual-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          width: fit-content;
          margin-bottom: 14px;
          padding: 8px 11px;
          border:
            1px solid
            rgba(255, 255, 255, 0.25);
          border-radius: 999px;
          background:
            rgba(255, 255, 255, 0.14);
          backdrop-filter: blur(12px);
          font-size: 10.5px;
          font-weight: 850;
          text-transform: uppercase;
          letter-spacing: 0.7px;
        }

        .forkly-portal-login-visual
          h2 {
          max-width: 430px;
          margin: 0;
          font-size: 39px;
          line-height: 1.07;
          letter-spacing: -2px;
          font-weight: 900;
        }

        .forkly-portal-login-visual
          p {
          max-width: 410px;
          margin: 15px 0 0;
          color:
            rgba(255, 255, 255, 0.8);
          font-size: 13.5px;
          line-height: 1.65;
        }

        .forkly-portal-visual-points {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 21px;
        }

        .forkly-portal-visual-points
          span {
          padding: 7px 10px;
          border:
            1px solid
            rgba(255, 255, 255, 0.18);
          border-radius: 999px;
          background:
            rgba(255, 255, 255, 0.13);
          backdrop-filter: blur(10px);
          font-size: 10.5px;
          font-weight: 700;
        }

        .forkly-portal-form-side {
          display: flex;
          align-items: center;
          min-width: 0;
          overflow-y: auto;
          padding: 44px;
          background:
            linear-gradient(
              180deg,
              #ffffff,
              #fffbf8
            );
        }

        .forkly-portal-form {
          width: 100%;
          max-width: 380px;
          margin: 0 auto;
        }

        .forkly-portal-form-icon {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          border-radius: 16px;
          color:
            var(--portal-accent);
          background:
            var(--portal-soft);
        }

        .forkly-portal-form-label {
          color:
            var(--portal-accent);
          font-size: 10.5px;
          font-weight: 900;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .forkly-portal-form h1 {
          margin: 8px 0 0;
          color: #1d1511;
          font-size: 31px;
          line-height: 1.13;
          letter-spacing: -1.3px;
          font-weight: 900;
        }

        .forkly-portal-form-description {
          margin: 10px 0 25px;
          color: #897b74;
          font-size: 13px;
          line-height: 1.55;
        }

        .forkly-portal-field-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 14px;
        }

        .forkly-portal-field-label {
          color: #51433d;
          font-size: 11.5px;
          font-weight: 800;
        }

        .forkly-portal-field {
          min-height: 49px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 13px;
          border: 1px solid #e9ddd6;
          border-radius: 13px;
          color: #9b8d86;
          background: #ffffff;
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .forkly-portal-field:focus-within {
          border-color:
            var(--portal-accent);
          box-shadow:
            0 0 0 4px
            color-mix(
              in srgb,
              var(--portal-accent) 12%,
              transparent
            );
        }

        .forkly-portal-field input {
          width: 100%;
          min-width: 0;
          border: none;
          outline: none;
          color: #211713;
          background: transparent;
          font-family: inherit;
          font-size: 13.5px;
        }

        .forkly-portal-field
          input::placeholder {
          color: #b4a69f;
        }

        .forkly-portal-password-toggle {
          flex-shrink: 0;
          display: flex;
          padding: 5px;
          border: none;
          color: #8f817a;
          background: transparent;
          cursor: pointer;
        }

        .forkly-portal-error {
          margin-top: 3px;
          padding: 10px 12px;
          border:
            1px solid
            rgba(220, 38, 38, 0.15);
          border-radius: 11px;
          color: #c62828;
          background: #fff1f1;
          font-size: 11.5px;
          line-height: 1.4;
        }

        .forkly-portal-submit {
          width: 100%;
          min-height: 49px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 18px;
          border: none;
          border-radius: 13px;
          color: #ffffff;
          background:
            var(--portal-accent);
          box-shadow:
            0 14px 28px
            color-mix(
              in srgb,
              var(--portal-accent) 25%,
              transparent
            );
          cursor: pointer;
          font-family: inherit;
          font-size: 13.5px;
          font-weight: 850;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            opacity 0.2s ease;
        }

        .forkly-portal-submit:hover:not(:disabled) {
          transform:
            translateY(-2px);
        }

        .forkly-portal-submit:disabled {
          opacity: 0.62;
          cursor: wait;
        }

        .forkly-portal-demo {
          margin-top: 15px;
          padding: 11px 12px;
          border:
            1px solid
            color-mix(
              in srgb,
              var(--portal-accent) 18%,
              white
            );
          border-radius: 12px;
          color: #72645d;
          background:
            var(--portal-soft);
          font-size: 10.8px;
          line-height: 1.55;
        }

        .forkly-portal-demo strong {
          color: #40332d;
        }

        .forkly-portal-register {
          margin-top: 18px;
          padding-top: 17px;
          border-top:
            1px solid #eee4dd;
          text-align: center;
        }

        .forkly-portal-register p {
          margin: 0 0 10px;
          color: #968880;
          font-size: 11.5px;
        }

        .forkly-portal-register
          button {
          width: 100%;
          min-height: 45px;
          border:
            1px solid
            var(--portal-accent);
          border-radius: 12px;
          color:
            var(--portal-accent);
          background: transparent;
          cursor: pointer;
          font-family: inherit;
          font-size: 12.5px;
          font-weight: 850;
          transition:
            background 0.2s ease,
            color 0.2s ease;
        }

        .forkly-portal-register
          button:hover {
          color: #ffffff;
          background:
            var(--portal-accent);
        }

        @keyframes forkly-portal-login-enter {
          from {
            opacity: 0;
            transform:
              translateY(20px)
              scale(0.97);
          }

          to {
            opacity: 1;
            transform:
              translateY(0)
              scale(1);
          }
        }

        @keyframes forkly-portal-spin {
          to {
            transform: rotate(360deg);
          }
        }

        .forkly-portal-spin {
          animation:
            forkly-portal-spin
            0.8s linear infinite;
        }

        @media (max-width: 820px) {
          .forkly-portal-login {
            padding: 18px;
          }

          .forkly-portal-login-shell {
            max-width: 510px;
            min-height: auto;
            grid-template-columns: 1fr;
            border-radius: 25px;
          }

          .forkly-portal-login-visual {
            display: none;
          }

          .forkly-portal-form-side {
            min-height:
              calc(100vh - 36px);
            padding: 38px 30px;
          }
        }

        @media (max-width: 440px) {
          .forkly-portal-login {
            padding: 9px;
          }

          .forkly-portal-login-shell {
            border-radius: 20px;
          }

          .forkly-portal-form-side {
            min-height:
              calc(100vh - 18px);
            padding: 30px 20px;
          }

          .forkly-portal-form h1 {
            font-size: 27px;
          }

          .forkly-portal-form-icon {
            width: 46px;
            height: 46px;
            margin-bottom: 17px;
          }
        }

        @media (
          prefers-reduced-motion:
          reduce
        ) {
          .forkly-portal-login-shell,
          .forkly-portal-submit {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <main
        className="forkly-portal-login-shell"
      >
        <section
          className="forkly-portal-login-visual"
        >
          <img
            src={visualImage}
            alt=""
          />

          <div
            className="forkly-portal-visual-content"
          >
            <div
              className="forkly-portal-brand"
            >
              <span
                className="forkly-portal-brand-mark"
              >
                <UtensilsCrossed
                  size={23}
                />
              </span>
              Forkly
            </div>

            <div>
              <div
                className="forkly-portal-visual-badge"
              >
                <PortalIcon
                  size={14}
                />
                {isAdmin
                  ? "Secure administration"
                  : isDelivery
                    ? "Deliver with Forkly"
                    : "Partner with Forkly"}
              </div>

              <h2>
                {visualTitle}
              </h2>

              <p>
                {visualDescription}
              </p>

              <div
                className="forkly-portal-visual-points"
              >
                {isAdmin ? (
                  <>
                    <span>
                      ✓ Platform oversight
                    </span>
                    <span>
                      ✓ Secure access
                    </span>
                  </>
                ) : isDelivery ? (
                  <>
                    <span>
                      ✓ Flexible work
                    </span>
                    <span>
                      ✓ Track earnings
                    </span>
                    <span>
                      ✓ Nearby orders
                    </span>
                  </>
                ) : (
                  <>
                    <span>
                      ✓ Live orders
                    </span>
                    <span>
                      ✓ Menu controls
                    </span>
                    <span>
                      ✓ Sales insights
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        <section
          className="forkly-portal-form-side"
        >
          <form
            className="forkly-portal-form"
            onSubmit={handleSubmit}
          >
            <div
              className="forkly-portal-form-icon"
            >
              <PortalIcon size={24} />
            </div>

            <div
              className="forkly-portal-form-label"
            >
              Secure portal access
            </div>

            <h1>{portalName}</h1>

            <p
              className="forkly-portal-form-description"
            >
              {description}
            </p>

            <div
              className="forkly-portal-field-group"
            >
              <label
                className="forkly-portal-field-label"
                htmlFor="portal-email"
              >
                Email address
              </label>

              <div
                className="forkly-portal-field"
              >
                <Mail size={16} />

                <input
                  id="portal-email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <div
              className="forkly-portal-field-group"
            >
              <label
                className="forkly-portal-field-label"
                htmlFor="portal-password"
              >
                Password
              </label>

              <div
                className="forkly-portal-field"
              >
                <Lock size={16} />

                <input
                  id="portal-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="forkly-portal-password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (current) =>
                        !current
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div
                className="forkly-portal-error"
                role="alert"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              className="forkly-portal-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2
                    size={16}
                    className="forkly-portal-spin"
                  />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn size={16} />
                  Sign in securely
                </>
              )}
            </button>

            

            {onRegister && (
              <div
                className="forkly-portal-register"
              >
                <p>
                  {isDelivery
                    ? "Want to deliver with Forkly?"
                    : "Want to grow with Forkly?"}
                </p>

                <button
                  type="button"
                  onClick={onRegister}
                >
                  {registerLabel}
                </button>
              </div>
            )}
          </form>
        </section>
      </main>
    </div>
  );
}