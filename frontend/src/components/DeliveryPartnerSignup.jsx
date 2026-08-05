import { useState } from "react";
import {
  ArrowLeft,
  Bike,
  CheckCircle2,
  Clock3,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  TrendingUp,
  UserRound,
  UtensilsCrossed,
} from "lucide-react";
import { registerDeliveryPartner } from "../api/delivery";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  vehicleType: "",
  vehicleNumber: "",
  licenseNumber: "",
};

export default function DeliveryPartnerSignup({
  onBack,
}) {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] =
    useState(false);
  const [submitted, setSubmitted] =
    useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] =
    useState(false);

  const updateField = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (
      form.password !==
      form.confirmPassword
    ) {
      setError("Passwords do not match");
      return;
    }

    setSubmitting(true);

    try {
      await registerDeliveryPartner({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        vehicleType: form.vehicleType,
        vehicleNumber:
          form.vehicleNumber.trim(),
        licenseNumber:
          form.licenseNumber.trim(),
      });

      setSubmitted(true);
    } catch (requestError) {
      setError(
        requestError.message ||
          "Unable to submit application"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="forkly-delivery-success-page">
        <DeliverySignupStyles />

        <div className="forkly-delivery-success-card">
          <div className="forkly-delivery-success-icon">
            <CheckCircle2 size={38} />
          </div>

          <div className="forkly-delivery-success-brand">
            <Bike size={18} />
            Forkly Delivery
          </div>

          <h1>Application submitted!</h1>

          <p>
            Your delivery partner application has
            been received and will now be verified
            by the Forkly team.
          </p>

          <div className="forkly-delivery-pending-box">
            <Clock3 size={21} />

            <div>
              <strong>
                Verification in progress
              </strong>

              <span>
                You can sign in and start accepting
                deliveries after your application
                is approved.
              </span>
            </div>
          </div>

          <button
            type="button"
            className="forkly-delivery-primary-button"
            onClick={onBack}
          >
            Return to sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="forkly-delivery-signup-page">
      <DeliverySignupStyles />

      <div className="forkly-delivery-signup-shell">
        <aside className="forkly-delivery-visual">
          <div className="forkly-delivery-overlay" />

          <div className="forkly-delivery-visual-content">
            <div className="forkly-delivery-brand">
              <span>
                <UtensilsCrossed size={20} />
              </span>
              Forkly
            </div>

            <div className="forkly-delivery-copy">
              <div className="forkly-delivery-pill">
                Delivery partners
              </div>

              <h2>
                Deliver food. Earn on your schedule.
              </h2>

              <p>
                Join the Forkly delivery network,
                accept nearby orders and manage
                your earnings from one simple
                dashboard.
              </p>

              <div className="forkly-delivery-benefits">
                <div>
                  <Clock3 size={18} />
                  Choose when you want to work
                </div>

                <div>
                  <TrendingUp size={18} />
                  Track deliveries and earnings
                </div>

                <div>
                  <ShieldCheck size={18} />
                  Safe and verified deliveries
                </div>
              </div>
            </div>

            <div className="forkly-delivery-trust">
              <Bike size={21} />

              <div>
                <strong>
                  Become a delivery partner
                </strong>

                <span>
                  Complete your details and start
                  delivering after verification.
                </span>
              </div>
            </div>
          </div>
        </aside>

        <main className="forkly-delivery-form-side">
          <button
            type="button"
            onClick={onBack}
            className="forkly-delivery-back-button"
          >
            <ArrowLeft size={17} />
            Back to sign in
          </button>

          <div className="forkly-delivery-mobile-brand">
            <span>
              <UtensilsCrossed size={18} />
            </span>
            Forkly
          </div>

          <div className="forkly-delivery-heading">
            <div className="forkly-delivery-heading-icon">
              <Bike size={25} />
            </div>

            <div>
              <h1>
                Become a delivery partner
              </h1>

              <p>
                Create your account and submit
                your vehicle information.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <FormSection
              icon={<UserRound size={18} />}
              title="Personal information"
              description="Your contact and account details"
            />

            <div className="forkly-delivery-grid">
              <Field
                label="Full name"
                name="name"
                value={form.name}
                onChange={updateField}
                placeholder="Your full name"
                autoComplete="name"
                required
              />

              <Field
                label="Phone number"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={updateField}
                placeholder="+91 98765 43210"
                autoComplete="tel"
                required
              />

              <Field
                label="Email address"
                name="email"
                type="email"
                value={form.email}
                onChange={updateField}
                placeholder="partner@example.com"
                autoComplete="email"
                required
              />

              <Field
                label="Password"
                name="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={form.password}
                onChange={updateField}
                placeholder="Minimum 8 characters"
                autoComplete="new-password"
                minLength={8}
                required
                action={
                  <button
                    type="button"
                    className="forkly-delivery-password-button"
                    onClick={() =>
                      setShowPassword(
                        (current) => !current
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                }
              />

              <Field
                label="Confirm password"
                name="confirmPassword"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={form.confirmPassword}
                onChange={updateField}
                placeholder="Enter password again"
                autoComplete="new-password"
                minLength={8}
                required
              />
            </div>

            <FormSection
              icon={<Bike size={19} />}
              title="Vehicle and licence"
              description="Information required for verification"
            />

            <div className="forkly-delivery-grid">
              <div>
                <label className="forkly-delivery-label">
                  Vehicle type
                </label>

                <div className="forkly-delivery-input-wrap">
                  <select
                    name="vehicleType"
                    value={form.vehicleType}
                    onChange={updateField}
                    required
                    className="forkly-delivery-input forkly-delivery-select"
                  >
                    <option value="">
                      Select your vehicle
                    </option>

                    <option value="Bicycle">
                      Bicycle
                    </option>

                    <option value="Scooter">
                      Scooter
                    </option>

                    <option value="Motorcycle">
                      Motorcycle
                    </option>

                    <option value="Car">
                      Car
                    </option>
                  </select>
                </div>
              </div>

              <Field
                label="Vehicle registration number"
                name="vehicleNumber"
                value={form.vehicleNumber}
                onChange={updateField}
                placeholder="PB 01 AB 1234"
                required
              />

              <Field
                className="forkly-delivery-full-width"
                label="Driving licence number"
                name="licenseNumber"
                value={form.licenseNumber}
                onChange={updateField}
                placeholder="DL-XXXXXXXXXXXX"
                required
              />
            </div>

            {error && (
              <div className="forkly-delivery-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="forkly-delivery-primary-button"
            >
              {submitting ? (
                <>
                  <Loader2
                    size={18}
                    className="forkly-delivery-spinner"
                  />
                  Submitting application...
                </>
              ) : (
                <>
                  Submit delivery application
                  <ArrowLeft
                    size={17}
                    style={{
                      transform:
                        "rotate(180deg)",
                    }}
                  />
                </>
              )}
            </button>

            <p className="forkly-delivery-form-note">
              Forkly will verify your personal,
              vehicle and licence information
              before activating your account.
            </p>
          </form>
        </main>
      </div>
    </div>
  );
}

function FormSection({
  icon,
  title,
  description,
}) {
  return (
    <div className="forkly-delivery-section-heading">
      <div>{icon}</div>

      <span>
        <strong>{title}</strong>
        <small>{description}</small>
      </span>
    </div>
  );
}

function Field({
  label,
  action,
  className = "",
  ...inputProps
}) {
  return (
    <div className={className}>
      <label className="forkly-delivery-label">
        {label}
      </label>

      <div className="forkly-delivery-input-wrap">
        <input
          className="forkly-delivery-input"
          {...inputProps}
        />

        {action}
      </div>
    </div>
  );
}

function DeliverySignupStyles() {
  return (
    <style>{`
      * {
        box-sizing: border-box;
      }

      .forkly-delivery-signup-page {
        min-height: 100vh;
        padding: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        background:
          radial-gradient(
            circle at 5% 5%,
            rgba(255, 184, 0, 0.18),
            transparent 30%
          ),
          radial-gradient(
            circle at 95% 90%,
            rgba(255, 107, 53, 0.12),
            transparent 30%
          ),
          #fffaf1;
        color: #251e13;
        font-family:
          "Inter",
          -apple-system,
          BlinkMacSystemFont,
          "Segoe UI",
          sans-serif;
      }

      .forkly-delivery-signup-shell {
        width: 100%;
        max-width: 1120px;
        display: grid;
        grid-template-columns: 0.88fr 1.12fr;
        overflow: hidden;
        background: #ffffff;
        border: 1px solid #f1e6d3;
        border-radius: 30px;
        box-shadow:
          0 30px 80px
          rgba(93, 65, 26, 0.14);
      }

      .forkly-delivery-visual {
        min-height: 750px;
        position: relative;
        overflow: hidden;
        background-image:
          linear-gradient(
            180deg,
            rgba(65, 38, 4, 0.08),
            rgba(55, 30, 3, 0.9)
          ),
          url("https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200&q=85");
        background-size: cover;
        background-position: center;
      }

      .forkly-delivery-overlay {
        position: absolute;
        inset: 0;
        background:
          linear-gradient(
            145deg,
            rgba(255, 165, 0, 0.35),
            transparent 55%
          );
      }

      .forkly-delivery-visual-content {
        position: relative;
        z-index: 1;
        height: 100%;
        min-height: 750px;
        padding: 38px;
        display: flex;
        flex-direction: column;
        color: #ffffff;
      }

      .forkly-delivery-brand,
      .forkly-delivery-mobile-brand {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        font-size: 21px;
        font-weight: 850;
      }

      .forkly-delivery-brand span,
      .forkly-delivery-mobile-brand span {
        width: 40px;
        height: 40px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        background:
          linear-gradient(
            135deg,
            #ff6b35,
            #ffb21c
          );
        border-radius: 12px;
        box-shadow:
          0 10px 25px
          rgba(255, 107, 53, 0.3);
      }

      .forkly-delivery-copy {
        margin: auto 0;
      }

      .forkly-delivery-pill {
        width: fit-content;
        margin-bottom: 18px;
        padding: 8px 13px;
        border: 1px solid
          rgba(255, 255, 255, 0.27);
        border-radius: 999px;
        background:
          rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(10px);
        font-size: 12px;
        font-weight: 750;
      }

      .forkly-delivery-copy h2 {
        max-width: 400px;
        margin: 0;
        font-size: clamp(35px, 4vw, 50px);
        line-height: 1.04;
        letter-spacing: -1.8px;
      }

      .forkly-delivery-copy p {
        max-width: 390px;
        margin: 18px 0 25px;
        color: rgba(255, 255, 255, 0.82);
        font-size: 14px;
        line-height: 1.7;
      }

      .forkly-delivery-benefits {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .forkly-delivery-benefits div {
        display: flex;
        align-items: center;
        gap: 9px;
        font-size: 13px;
        font-weight: 650;
      }

      .forkly-delivery-benefits svg {
        color: #ffd86b;
      }

      .forkly-delivery-trust {
        display: flex;
        align-items: flex-start;
        gap: 11px;
        padding: 15px;
        border: 1px solid
          rgba(255, 255, 255, 0.18);
        border-radius: 15px;
        background:
          rgba(255, 255, 255, 0.12);
        backdrop-filter: blur(12px);
      }

      .forkly-delivery-trust strong,
      .forkly-delivery-trust span {
        display: block;
      }

      .forkly-delivery-trust strong {
        margin-bottom: 4px;
        font-size: 12.5px;
      }

      .forkly-delivery-trust span {
        color: rgba(255, 255, 255, 0.72);
        font-size: 11.5px;
        line-height: 1.5;
      }

      .forkly-delivery-form-side {
        padding: 38px 46px 44px;
      }

      .forkly-delivery-back-button {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        padding: 0;
        color: #786f61;
        background: transparent;
        border: none;
        font: inherit;
        font-size: 12.5px;
        font-weight: 650;
        cursor: pointer;
      }

      .forkly-delivery-back-button:hover {
        color: #e46b12;
      }

      .forkly-delivery-mobile-brand {
        display: none;
        color: #251e13;
      }

      .forkly-delivery-heading {
        display: flex;
        align-items: center;
        gap: 14px;
        margin: 29px 0 32px;
      }

      .forkly-delivery-heading-icon {
        width: 50px;
        height: 50px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        background:
          linear-gradient(
            135deg,
            #ffb000,
            #ef6c14
          );
        border-radius: 15px;
        box-shadow:
          0 10px 24px
          rgba(245, 146, 20, 0.25);
      }

      .forkly-delivery-heading h1 {
        margin: 0 0 5px;
        color: #251e13;
        font-size: 27px;
        letter-spacing: -0.7px;
      }

      .forkly-delivery-heading p {
        margin: 0;
        color: #7f776b;
        font-size: 13px;
        line-height: 1.5;
      }

      .forkly-delivery-section-heading {
        display: flex;
        align-items: center;
        gap: 11px;
        margin: 27px 0 15px;
        padding-bottom: 11px;
        border-bottom: 1px solid #f0ece5;
      }

      .forkly-delivery-section-heading > div {
        width: 34px;
        height: 34px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #d9680d;
        background: #fff4dc;
        border-radius: 10px;
      }

      .forkly-delivery-section-heading strong,
      .forkly-delivery-section-heading small {
        display: block;
      }

      .forkly-delivery-section-heading strong {
        color: #352c20;
        font-size: 14px;
      }

      .forkly-delivery-section-heading small {
        margin-top: 2px;
        color: #968d80;
        font-size: 11.5px;
      }

      .forkly-delivery-grid {
        display: grid;
        grid-template-columns:
          repeat(2, minmax(0, 1fr));
        gap: 16px;
      }

      .forkly-delivery-full-width {
        grid-column: 1 / -1;
      }

      .forkly-delivery-label {
        display: block;
        margin-bottom: 7px;
        color: #554d42;
        font-size: 12px;
        font-weight: 700;
      }

      .forkly-delivery-input-wrap {
        display: flex;
        align-items: center;
        overflow: hidden;
        background: #fffdf9;
        border: 1px solid #dfd9ce;
        border-radius: 12px;
        transition:
          border-color 0.2s ease,
          box-shadow 0.2s ease;
      }

      .forkly-delivery-input-wrap:focus-within {
        background: #ffffff;
        border-color: #f59e0b;
        box-shadow:
          0 0 0 4px
          rgba(245, 158, 11, 0.12);
      }

      .forkly-delivery-input {
        width: 100%;
        min-width: 0;
        padding: 12px 13px;
        color: #251e13;
        background: transparent;
        border: none;
        outline: none;
        font: inherit;
        font-size: 13.5px;
      }

      .forkly-delivery-input::placeholder {
        color: #b0aaa1;
      }

      .forkly-delivery-select {
        cursor: pointer;
      }

      .forkly-delivery-password-button {
        display: flex;
        margin-right: 11px;
        padding: 3px;
        color: #80776b;
        background: transparent;
        border: none;
        cursor: pointer;
      }

      .forkly-delivery-error {
        margin-top: 18px;
        padding: 12px 14px;
        color: #b42318;
        background: #fff0ee;
        border: 1px solid #ffd1cc;
        border-radius: 11px;
        font-size: 12.5px;
      }

      .forkly-delivery-primary-button {
        width: 100%;
        min-height: 47px;
        margin-top: 24px;
        padding: 12px 17px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 9px;
        color: #ffffff;
        background:
          linear-gradient(
            135deg,
            #ffad0d,
            #ed6815
          );
        border: none;
        border-radius: 12px;
        box-shadow:
          0 12px 25px
          rgba(239, 108, 20, 0.22);
        font: inherit;
        font-size: 13.5px;
        font-weight: 750;
        cursor: pointer;
        transition:
          transform 0.2s ease,
          box-shadow 0.2s ease;
      }

      .forkly-delivery-primary-button:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow:
          0 15px 30px
          rgba(239, 108, 20, 0.3);
      }

      .forkly-delivery-primary-button:disabled {
        opacity: 0.65;
        cursor: not-allowed;
      }

      .forkly-delivery-spinner {
        animation:
          forkly-delivery-spin
          0.8s linear infinite;
      }

      .forkly-delivery-form-note {
        max-width: 480px;
        margin: 12px auto 0;
        color: #9c958b;
        text-align: center;
        font-size: 10.5px;
        line-height: 1.5;
      }

      .forkly-delivery-success-page {
        min-height: 100vh;
        padding: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        background:
          radial-gradient(
            circle at top left,
            rgba(255, 184, 0, 0.2),
            transparent 37%
          ),
          radial-gradient(
            circle at bottom right,
            rgba(255, 107, 53, 0.15),
            transparent 34%
          ),
          #fffaf1;
        color: #251e13;
        font-family:
          "Inter",
          -apple-system,
          BlinkMacSystemFont,
          "Segoe UI",
          sans-serif;
      }

      .forkly-delivery-success-card {
        width: 100%;
        max-width: 520px;
        padding: 42px;
        text-align: center;
        background: #ffffff;
        border: 1px solid #f1e5d2;
        border-radius: 26px;
        box-shadow:
          0 28px 70px
          rgba(93, 65, 26, 0.13);
      }

      .forkly-delivery-success-icon {
        width: 72px;
        height: 72px;
        margin: 0 auto 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #16834f;
        background: #e9f9ef;
        border-radius: 50%;
      }

      .forkly-delivery-success-brand {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        margin-bottom: 15px;
        color: #e86d15;
        font-size: 12px;
        font-weight: 750;
      }

      .forkly-delivery-success-card h1 {
        margin: 0 0 10px;
        font-size: 29px;
        letter-spacing: -0.8px;
      }

      .forkly-delivery-success-card > p {
        max-width: 420px;
        margin: 0 auto;
        color: #7f776b;
        font-size: 13.5px;
        line-height: 1.65;
      }

      .forkly-delivery-pending-box {
        margin: 24px 0 4px;
        padding: 16px;
        display: flex;
        align-items: flex-start;
        gap: 12px;
        color: #875600;
        text-align: left;
        background: #fff8e7;
        border: 1px solid #f5dda8;
        border-radius: 14px;
      }

      .forkly-delivery-pending-box svg {
        flex-shrink: 0;
        margin-top: 1px;
      }

      .forkly-delivery-pending-box strong,
      .forkly-delivery-pending-box span {
        display: block;
      }

      .forkly-delivery-pending-box strong {
        margin-bottom: 4px;
        font-size: 12.5px;
      }

      .forkly-delivery-pending-box span {
        color: #9b772f;
        font-size: 11.5px;
        line-height: 1.5;
      }

      @keyframes forkly-delivery-spin {
        to {
          transform: rotate(360deg);
        }
      }

      @media (max-width: 900px) {
        .forkly-delivery-signup-page {
          padding: 18px;
          align-items: flex-start;
        }

        .forkly-delivery-signup-shell {
          max-width: 720px;
          grid-template-columns: 1fr;
        }

        .forkly-delivery-visual {
          min-height: 270px;
          background-position: center 55%;
        }

        .forkly-delivery-visual-content {
          min-height: 270px;
          padding: 27px;
        }

        .forkly-delivery-copy {
          margin: auto 0 0;
        }

        .forkly-delivery-copy h2 {
          max-width: 540px;
          font-size: 32px;
        }

        .forkly-delivery-copy p,
        .forkly-delivery-benefits,
        .forkly-delivery-trust {
          display: none;
        }

        .forkly-delivery-form-side {
          padding: 32px;
        }
      }

      @media (max-width: 560px) {
        .forkly-delivery-signup-page {
          padding: 0;
          background: #ffffff;
        }

        .forkly-delivery-signup-shell {
          border: none;
          border-radius: 0;
          box-shadow: none;
        }

        .forkly-delivery-visual {
          display: none;
        }

        .forkly-delivery-form-side {
          padding: 20px 16px 32px;
        }

        .forkly-delivery-mobile-brand {
          display: inline-flex;
          margin-top: 22px;
        }

        .forkly-delivery-heading {
          align-items: flex-start;
          margin: 25px 0 27px;
        }

        .forkly-delivery-heading h1 {
          font-size: 24px;
        }

        .forkly-delivery-grid {
          grid-template-columns: 1fr;
          gap: 14px;
        }

        .forkly-delivery-full-width {
          grid-column: auto;
        }

        .forkly-delivery-section-heading {
          margin-top: 25px;
        }

        .forkly-delivery-primary-button {
          min-height: 49px;
        }

        .forkly-delivery-success-page {
          padding: 15px;
        }

        .forkly-delivery-success-card {
          padding: 31px 20px;
          border-radius: 21px;
        }
      }
    `}</style>
  );
}