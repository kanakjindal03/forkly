import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Eye,
  EyeOff,
  Loader2,
  MapPin,
  ShieldCheck,
  Store,
  UserRound,
  UtensilsCrossed,
} from "lucide-react";
import { registerRestaurantOwner } from "../api/owner";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  restaurantName: "",
  cuisine: "",
  description: "",
  addressLine: "",
  city: "",
  restaurantPhone: "",
  restaurantEmail: "",
};

export default function RestaurantOwnerSignup({
  onBack,
}) {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] =
    useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] =
    useState(false);
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
      await registerRestaurantOwner({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        restaurantName:
          form.restaurantName.trim(),
        cuisine: form.cuisine.trim(),
        description:
          form.description.trim() ||
          undefined,
        addressLine:
          form.addressLine.trim(),
        city: form.city.trim(),
        restaurantPhone:
          form.restaurantPhone.trim() ||
          undefined,
        restaurantEmail:
          form.restaurantEmail.trim() ||
          undefined,
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
      <div className="forkly-owner-success-page">
        <OwnerSignupStyles />

        <div className="forkly-owner-success-card">
          <div className="forkly-owner-success-icon">
            <CheckCircle2 size={38} />
          </div>

          <div className="forkly-owner-success-brand">
            <UtensilsCrossed size={17} />
            Forkly Partner
          </div>

          <h1>Application submitted!</h1>

          <p>
            Thank you for choosing Forkly. Your
            restaurant application has been sent
            for verification.
          </p>

          <div className="forkly-owner-pending-box">
            <Clock3 size={21} />

            <div>
              <strong>
                Verification in progress
              </strong>

              <span>
                You can sign in after your
                restaurant is approved by the
                Forkly team.
              </span>
            </div>
          </div>

          <button
            type="button"
            className="forkly-owner-primary-button"
            onClick={onBack}
          >
            Return to sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="forkly-owner-signup-page">
      <OwnerSignupStyles />

      <div className="forkly-owner-signup-shell">
        <aside className="forkly-owner-visual">
          <div className="forkly-owner-visual-overlay" />

          <div className="forkly-owner-visual-content">
            <div className="forkly-owner-brand">
              <span>
                <UtensilsCrossed size={20} />
              </span>
              Forkly
            </div>

            <div className="forkly-owner-visual-copy">
              <div className="forkly-owner-pill">
                Restaurant partners
              </div>

              <h2>
                Grow your restaurant with Forkly.
              </h2>

              <p>
                Reach more customers, manage
                orders and build a stronger food
                business from one simple
                dashboard.
              </p>

              <div className="forkly-owner-benefits">
                <div>
                  <CheckCircle2 size={18} />
                  Reach new local customers
                </div>

                <div>
                  <CheckCircle2 size={18} />
                  Manage menu and orders easily
                </div>

                <div>
                  <CheckCircle2 size={18} />
                  Track growth and performance
                </div>
              </div>
            </div>

            <div className="forkly-owner-trust">
              <ShieldCheck size={19} />

              <div>
                <strong>
                  Secure partner onboarding
                </strong>
                <span>
                  Every restaurant is verified
                  before going live.
                </span>
              </div>
            </div>
          </div>
        </aside>

        <main className="forkly-owner-form-side">
          <button
            type="button"
            onClick={onBack}
            className="forkly-owner-back-button"
          >
            <ArrowLeft size={17} />
            Back to sign in
          </button>

          <div className="forkly-owner-mobile-brand">
            <span>
              <UtensilsCrossed size={18} />
            </span>
            Forkly
          </div>

          <div className="forkly-owner-form-heading">
            <div className="forkly-owner-heading-icon">
              <Store size={24} />
            </div>

            <div>
              <h1>
                Register your restaurant
              </h1>

              <p>
                Create your owner account and
                tell us about your restaurant.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <FormSection
              icon={<UserRound size={18} />}
              title="Owner information"
              description="Your personal contact and login details"
            />

            <div className="forkly-owner-grid">
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
                placeholder="owner@example.com"
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
                    className="forkly-owner-password-button"
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
              icon={<Store size={18} />}
              title="Restaurant information"
              description="Information customers will see on Forkly"
            />

            <div className="forkly-owner-grid">
              <Field
                label="Restaurant name"
                name="restaurantName"
                value={form.restaurantName}
                onChange={updateField}
                placeholder="Your restaurant name"
                required
              />

              <Field
                label="Cuisine"
                name="cuisine"
                value={form.cuisine}
                onChange={updateField}
                placeholder="Indian, Italian, Chinese..."
                required
              />

              <Field
                label="Restaurant phone"
                name="restaurantPhone"
                type="tel"
                value={form.restaurantPhone}
                onChange={updateField}
                placeholder="Business phone number"
              />

              <Field
                label="Restaurant email"
                name="restaurantEmail"
                type="email"
                value={form.restaurantEmail}
                onChange={updateField}
                placeholder="restaurant@example.com"
              />
            </div>

            <FormSection
              icon={<MapPin size={18} />}
              title="Restaurant location"
              description="Help customers find your restaurant"
            />

            <div className="forkly-owner-grid">
              <Field
                label="City"
                name="city"
                value={form.city}
                onChange={updateField}
                placeholder="Enter your city"
                required
              />

              <Field
                className="forkly-owner-full-width"
                label="Complete address"
                name="addressLine"
                value={form.addressLine}
                onChange={updateField}
                placeholder="Building, street and area"
                required
              />

              <div className="forkly-owner-full-width">
                <label className="forkly-owner-label">
                  Restaurant description
                  <span>Optional</span>
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={updateField}
                  rows={4}
                  maxLength={500}
                  placeholder="Describe your restaurant, food and dining experience..."
                  className="forkly-owner-textarea"
                />

                <div className="forkly-owner-character-count">
                  {form.description.length}/500
                </div>
              </div>
            </div>

            {error && (
              <div className="forkly-owner-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="forkly-owner-primary-button"
            >
              {submitting ? (
                <>
                  <Loader2
                    size={18}
                    className="forkly-owner-spinner"
                  />
                  Submitting application...
                </>
              ) : (
                <>
                  Submit restaurant application
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

            <p className="forkly-owner-form-note">
              By submitting, you agree that
              Forkly may verify your restaurant
              information before activation.
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
    <div className="forkly-owner-section-heading">
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
      <label className="forkly-owner-label">
        {label}
      </label>

      <div className="forkly-owner-input-wrap">
        <input
          className="forkly-owner-input"
          {...inputProps}
        />

        {action}
      </div>
    </div>
  );
}

function OwnerSignupStyles() {
  return (
    <style>{`
      * {
        box-sizing: border-box;
      }

      .forkly-owner-signup-page {
        min-height: 100vh;
        padding: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        background:
          radial-gradient(
            circle at 5% 5%,
            rgba(34, 197, 94, 0.13),
            transparent 30%
          ),
          radial-gradient(
            circle at 95% 90%,
            rgba(255, 107, 53, 0.12),
            transparent 30%
          ),
          #fffaf5;
        color: #17211a;
        font-family:
          "Inter",
          -apple-system,
          BlinkMacSystemFont,
          "Segoe UI",
          sans-serif;
      }

      .forkly-owner-signup-shell {
        width: 100%;
        max-width: 1180px;
        display: grid;
        grid-template-columns: 0.82fr 1.18fr;
        overflow: hidden;
        background: #ffffff;
        border: 1px solid #f0e8df;
        border-radius: 30px;
        box-shadow:
          0 30px 80px rgba(73, 48, 28, 0.14);
      }

      .forkly-owner-visual {
        min-height: 860px;
        position: relative;
        overflow: hidden;
        background-image:
          linear-gradient(
            180deg,
            rgba(8, 48, 28, 0.12),
            rgba(8, 48, 28, 0.9)
          ),
          url("https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&q=85");
        background-size: cover;
        background-position: center;
      }

      .forkly-owner-visual-overlay {
        position: absolute;
        inset: 0;
        background:
          linear-gradient(
            145deg,
            rgba(24, 125, 73, 0.55),
            transparent 55%
          );
      }

      .forkly-owner-visual-content {
        position: relative;
        z-index: 1;
        height: 100%;
        min-height: 860px;
        padding: 38px;
        display: flex;
        flex-direction: column;
        color: #ffffff;
      }

      .forkly-owner-brand,
      .forkly-owner-mobile-brand {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        font-size: 21px;
        font-weight: 850;
      }

      .forkly-owner-brand span,
      .forkly-owner-mobile-brand span {
        width: 40px;
        height: 40px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 12px;
        color: #ffffff;
        background:
          linear-gradient(
            135deg,
            #ff6b35,
            #ffad3d
          );
        box-shadow:
          0 10px 25px
          rgba(255, 107, 53, 0.3);
      }

      .forkly-owner-visual-copy {
        margin: auto 0;
      }

      .forkly-owner-pill {
        width: fit-content;
        margin-bottom: 18px;
        padding: 8px 13px;
        border: 1px solid
          rgba(255, 255, 255, 0.25);
        border-radius: 999px;
        background:
          rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(10px);
        font-size: 12px;
        font-weight: 750;
      }

      .forkly-owner-visual-copy h2 {
        max-width: 380px;
        margin: 0;
        font-size: clamp(34px, 4vw, 49px);
        line-height: 1.05;
        letter-spacing: -1.8px;
      }

      .forkly-owner-visual-copy p {
        max-width: 390px;
        margin: 18px 0 25px;
        color: rgba(255, 255, 255, 0.82);
        font-size: 14px;
        line-height: 1.7;
      }

      .forkly-owner-benefits {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .forkly-owner-benefits div {
        display: flex;
        align-items: center;
        gap: 9px;
        font-size: 13px;
        font-weight: 650;
      }

      .forkly-owner-benefits svg {
        color: #a7f3d0;
      }

      .forkly-owner-trust {
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

      .forkly-owner-trust strong,
      .forkly-owner-trust span {
        display: block;
      }

      .forkly-owner-trust strong {
        margin-bottom: 4px;
        font-size: 12.5px;
      }

      .forkly-owner-trust span {
        color: rgba(255, 255, 255, 0.72);
        font-size: 11.5px;
        line-height: 1.5;
      }

      .forkly-owner-form-side {
        padding: 38px 46px 44px;
      }

      .forkly-owner-back-button {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        padding: 0;
        color: #68746c;
        background: transparent;
        border: none;
        font: inherit;
        font-size: 12.5px;
        font-weight: 650;
        cursor: pointer;
      }

      .forkly-owner-back-button:hover {
        color: #16834f;
      }

      .forkly-owner-mobile-brand {
        display: none;
        color: #17211a;
      }

      .forkly-owner-form-heading {
        display: flex;
        align-items: center;
        gap: 14px;
        margin: 29px 0 32px;
      }

      .forkly-owner-heading-icon {
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
            #22c55e,
            #16834f
          );
        border-radius: 15px;
        box-shadow:
          0 10px 24px
          rgba(34, 197, 94, 0.22);
      }

      .forkly-owner-form-heading h1 {
        margin: 0 0 5px;
        color: #17211a;
        font-size: 27px;
        letter-spacing: -0.7px;
      }

      .forkly-owner-form-heading p {
        margin: 0;
        color: #758078;
        font-size: 13px;
        line-height: 1.5;
      }

      .forkly-owner-section-heading {
        display: flex;
        align-items: center;
        gap: 11px;
        margin: 26px 0 15px;
        padding-bottom: 11px;
        border-bottom: 1px solid #edf0ed;
      }

      .forkly-owner-section-heading > div {
        width: 34px;
        height: 34px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #16834f;
        background: #eaf9f0;
        border-radius: 10px;
      }

      .forkly-owner-section-heading strong,
      .forkly-owner-section-heading small {
        display: block;
      }

      .forkly-owner-section-heading strong {
        color: #26362b;
        font-size: 14px;
      }

      .forkly-owner-section-heading small {
        margin-top: 2px;
        color: #8a938d;
        font-size: 11.5px;
      }

      .forkly-owner-grid {
        display: grid;
        grid-template-columns:
          repeat(2, minmax(0, 1fr));
        gap: 16px;
      }

      .forkly-owner-full-width {
        grid-column: 1 / -1;
      }

      .forkly-owner-label {
        display: flex;
        justify-content: space-between;
        margin-bottom: 7px;
        color: #49564e;
        font-size: 12px;
        font-weight: 700;
      }

      .forkly-owner-label span {
        color: #9aa29d;
        font-weight: 500;
      }

      .forkly-owner-input-wrap {
        display: flex;
        align-items: center;
        overflow: hidden;
        background: #fffdfb;
        border: 1px solid #dddeda;
        border-radius: 12px;
        transition:
          border-color 0.2s ease,
          box-shadow 0.2s ease,
          background 0.2s ease;
      }

      .forkly-owner-input-wrap:focus-within {
        background: #ffffff;
        border-color: #22a861;
        box-shadow:
          0 0 0 4px
          rgba(34, 197, 94, 0.1);
      }

      .forkly-owner-input {
        width: 100%;
        min-width: 0;
        padding: 12px 13px;
        color: #17211a;
        background: transparent;
        border: none;
        outline: none;
        font: inherit;
        font-size: 13.5px;
      }

      .forkly-owner-input::placeholder,
      .forkly-owner-textarea::placeholder {
        color: #adb3af;
      }

      .forkly-owner-password-button {
        display: flex;
        margin-right: 11px;
        padding: 3px;
        color: #7c8780;
        background: transparent;
        border: none;
        cursor: pointer;
      }

      .forkly-owner-textarea {
        width: 100%;
        min-height: 105px;
        padding: 12px 13px;
        resize: vertical;
        color: #17211a;
        background: #fffdfb;
        border: 1px solid #dddeda;
        border-radius: 12px;
        outline: none;
        font: inherit;
        font-size: 13.5px;
        line-height: 1.55;
        transition:
          border-color 0.2s ease,
          box-shadow 0.2s ease;
      }

      .forkly-owner-textarea:focus {
        background: #ffffff;
        border-color: #22a861;
        box-shadow:
          0 0 0 4px
          rgba(34, 197, 94, 0.1);
      }

      .forkly-owner-character-count {
        margin-top: 5px;
        color: #a0a7a2;
        text-align: right;
        font-size: 10.5px;
      }

      .forkly-owner-error {
        margin-top: 18px;
        padding: 12px 14px;
        color: #b42318;
        background: #fff0ee;
        border: 1px solid #ffd1cc;
        border-radius: 11px;
        font-size: 12.5px;
      }

      .forkly-owner-primary-button {
        width: 100%;
        min-height: 47px;
        margin-top: 23px;
        padding: 12px 17px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 9px;
        color: #ffffff;
        background:
          linear-gradient(
            135deg,
            #22b863,
            #118149
          );
        border: none;
        border-radius: 12px;
        box-shadow:
          0 12px 25px
          rgba(34, 184, 99, 0.2);
        font: inherit;
        font-size: 13.5px;
        font-weight: 750;
        cursor: pointer;
        transition:
          transform 0.2s ease,
          box-shadow 0.2s ease;
      }

      .forkly-owner-primary-button:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow:
          0 15px 30px
          rgba(34, 184, 99, 0.27);
      }

      .forkly-owner-primary-button:disabled {
        opacity: 0.65;
        cursor: not-allowed;
      }

      .forkly-owner-spinner {
        animation:
          forkly-owner-spin 0.8s linear infinite;
      }

      .forkly-owner-form-note {
        margin: 12px auto 0;
        max-width: 470px;
        color: #939b95;
        text-align: center;
        font-size: 10.5px;
        line-height: 1.5;
      }

      .forkly-owner-success-page {
        min-height: 100vh;
        padding: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        background:
          radial-gradient(
            circle at top left,
            rgba(34, 197, 94, 0.18),
            transparent 37%
          ),
          radial-gradient(
            circle at bottom right,
            rgba(255, 107, 53, 0.14),
            transparent 34%
          ),
          #fffaf5;
        color: #17211a;
        font-family:
          "Inter",
          -apple-system,
          BlinkMacSystemFont,
          "Segoe UI",
          sans-serif;
      }

      .forkly-owner-success-card {
        width: 100%;
        max-width: 520px;
        padding: 42px;
        text-align: center;
        background: #ffffff;
        border: 1px solid #eee5dc;
        border-radius: 26px;
        box-shadow:
          0 28px 70px
          rgba(79, 55, 35, 0.13);
      }

      .forkly-owner-success-icon {
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

      .forkly-owner-success-brand {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        margin-bottom: 15px;
        color: #e85c28;
        font-size: 12px;
        font-weight: 750;
      }

      .forkly-owner-success-card h1 {
        margin: 0 0 10px;
        font-size: 29px;
        letter-spacing: -0.8px;
      }

      .forkly-owner-success-card > p {
        margin: 0 auto;
        max-width: 420px;
        color: #778078;
        font-size: 13.5px;
        line-height: 1.65;
      }

      .forkly-owner-pending-box {
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

      .forkly-owner-pending-box svg {
        flex-shrink: 0;
        margin-top: 1px;
      }

      .forkly-owner-pending-box strong,
      .forkly-owner-pending-box span {
        display: block;
      }

      .forkly-owner-pending-box strong {
        margin-bottom: 4px;
        font-size: 12.5px;
      }

      .forkly-owner-pending-box span {
        color: #9b772f;
        font-size: 11.5px;
        line-height: 1.5;
      }

      @keyframes forkly-owner-spin {
        to {
          transform: rotate(360deg);
        }
      }

      @media (max-width: 900px) {
        .forkly-owner-signup-page {
          padding: 18px;
          align-items: flex-start;
        }

        .forkly-owner-signup-shell {
          max-width: 720px;
          grid-template-columns: 1fr;
        }

        .forkly-owner-visual {
          min-height: 270px;
          background-position: center 55%;
        }

        .forkly-owner-visual-content {
          min-height: 270px;
          padding: 27px;
        }

        .forkly-owner-visual-copy {
          margin: auto 0 0;
        }

        .forkly-owner-visual-copy h2 {
          max-width: 520px;
          font-size: 32px;
        }

        .forkly-owner-visual-copy p,
        .forkly-owner-benefits,
        .forkly-owner-trust {
          display: none;
        }

        .forkly-owner-form-side {
          padding: 32px;
        }
      }

      @media (max-width: 560px) {
        .forkly-owner-signup-page {
          padding: 0;
          background: #ffffff;
        }

        .forkly-owner-signup-shell {
          border: none;
          border-radius: 0;
          box-shadow: none;
        }

        .forkly-owner-visual {
          display: none;
        }

        .forkly-owner-form-side {
          padding: 20px 16px 32px;
        }

        .forkly-owner-mobile-brand {
          display: inline-flex;
          margin-top: 22px;
        }

        .forkly-owner-form-heading {
          align-items: flex-start;
          margin: 25px 0 27px;
        }

        .forkly-owner-form-heading h1 {
          font-size: 24px;
        }

        .forkly-owner-grid {
          grid-template-columns: 1fr;
          gap: 14px;
        }

        .forkly-owner-full-width {
          grid-column: auto;
        }

        .forkly-owner-section-heading {
          margin-top: 25px;
        }

        .forkly-owner-primary-button {
          min-height: 49px;
        }

        .forkly-owner-success-page {
          padding: 15px;
        }

        .forkly-owner-success-card {
          padding: 31px 20px;
          border-radius: 21px;
        }
      }
    `}</style>
  );
}