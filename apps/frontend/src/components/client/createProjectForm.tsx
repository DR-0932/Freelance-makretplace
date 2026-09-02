import { useState, useRef } from "react";
import { CheckCircle2, AlertCircle, Loader2, PenLine } from "lucide-react";

const MIN_LETTER_LENGTH = 100;
const DURATION_UNITS = ["days", "weeks", "months"];

export default function SubmitProposalForm() {
  const [coverLetter, setCoverLetter] = useState("");
  const [price, setPrice] = useState("");
  const [durationValue, setDurationValue] = useState("");
  const [durationUnit, setDurationUnit] = useState("weeks");

  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [serverError, setServerError] = useState("");
  const formTopRef = useRef(null);

  const errors = {
    coverLetter:
      coverLetter.trim().length === 0
        ? "Write a cover letter before sending your proposal."
        : coverLetter.trim().length < MIN_LETTER_LENGTH
        ? `Add a bit more detail — ${MIN_LETTER_LENGTH - coverLetter.trim().length} more characters needed.`
        : "",
    price:
      price === ""
        ? "Enter what you'd charge for this work."
        : Number(price) <= 0
        ? "Price must be more than $0."
        : "",
    duration:
      durationValue === ""
        ? "Enter how long this will take."
        : Number(durationValue) <= 0
        ? "Duration must be more than 0."
        : "",
  };

  const hasErrors = Object.values(errors).some(Boolean);

  function markAllTouched() {
    setTouched({ coverLetter: true, price: true, duration: true });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    markAllTouched();
    if (hasErrors) {
      formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    setStatus("submitting");
    setServerError("");

    try {
      await new Promise((resolve, reject) =>
        setTimeout(() => {
          // Simulated network call — occasionally fails to demonstrate the error state.
          if (Math.random() < 0.2) {
            reject(new Error("The connection dropped before the proposal could be sent."));
          } else {
            resolve();
          }
        }, 1100)
      );
      setStatus("success");
    } catch (err) {
      setServerError(err.message);
      setStatus("error");
    }
  }

  function handleReset() {
    setCoverLetter("");
    setPrice("");
    setDurationValue("");
    setDurationUnit("weeks");
    setTouched({});
    setStatus("idle");
    setServerError("");
  }

  if (status === "success") {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.successWrap}>
            <CheckCircle2 size={40} color={C.success} strokeWidth={1.75} />
            <h1 style={styles.successHeading}>Proposal sent</h1>
            <p style={styles.successBody}>
              Your cover letter, ${Number(price).toLocaleString()} rate, and {durationValue}{" "}
              {durationUnit} timeline are on their way to the client. You'll hear back once they've
              reviewed it.
            </p>
            <button type="button" style={styles.secondaryButton} onClick={handleReset}>
              Submit another proposal
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card} ref={formTopRef}>
        <header style={styles.header}>
          <PenLine size={20} color={C.accent} strokeWidth={1.75} />
          <h1 style={styles.heading}>Submit a proposal</h1>
          <p style={styles.subheading}>
            Introduce yourself, name your price, and say how long the work will take.
          </p>
        </header>

        <div style={styles.rule} />

        {status === "error" && (
          <div style={styles.errorBanner} role="alert">
            <AlertCircle size={18} color={C.error} strokeWidth={1.75} style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <div style={styles.errorBannerTitle}>Your proposal wasn't sent</div>
              <div style={styles.errorBannerBody}>{serverError} Check your details and try again.</div>
            </div>
          </div>
        )}

        {hasErrors && Object.values(touched).some(Boolean) && status !== "submitting" && (
          <div style={styles.errorBanner} role="alert">
            <AlertCircle size={18} color={C.error} strokeWidth={1.75} style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <div style={styles.errorBannerTitle}>Fix the fields below to continue</div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <Field
            label="Cover letter"
            hint={`${coverLetter.trim().length} / ${MIN_LETTER_LENGTH}+ characters`}
            error={touched.coverLetter ? errors.coverLetter : ""}
          >
            <textarea
              style={{
                ...styles.textarea,
                ...(touched.coverLetter && errors.coverLetter ? styles.inputError : {}),
              }}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, coverLetter: true }))}
              placeholder="Explain why you're a fit for this work — relevant experience, how you'd approach it, and what makes your proposal worth reading."
              rows={7}
            />
          </Field>

          <div style={styles.row}>
            <Field
              label="Proposed price"
              error={touched.price ? errors.price : ""}
            >
              <div
                style={{
                  ...styles.priceWrap,
                  ...(touched.price && errors.price ? styles.inputError : {}),
                }}
              >
                <span style={styles.priceSymbol}>$</span>
                <input
                  style={styles.priceInput}
                  type="number"
                  min="0"
                  step="1"
                  inputMode="decimal"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, price: true }))}
                  placeholder="750"
                />
              </div>
            </Field>

            <Field
              label="Estimated duration"
              error={touched.duration ? errors.duration : ""}
            >
              <div
                style={{
                  ...styles.durationWrap,
                  ...(touched.duration && errors.duration ? styles.inputError : {}),
                }}
              >
                <input
                  style={styles.durationInput}
                  type="number"
                  min="0"
                  step="1"
                  inputMode="numeric"
                  value={durationValue}
                  onChange={(e) => setDurationValue(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, duration: true }))}
                  placeholder="2"
                />
                <select
                  style={styles.durationSelect}
                  value={durationUnit}
                  onChange={(e) => setDurationUnit(e.target.value)}
                >
                  {DURATION_UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
            </Field>
          </div>

          <button type="submit" style={styles.submitButton} disabled={status === "submitting"}>
            {status === "submitting" ? (
              <>
                <Loader2 size={16} style={{ animation: "spin 0.9s linear infinite" }} />
                Sending proposal…
              </>
            ) : (
              "Send proposal"
            )}
          </button>
        </form>
      </div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder, textarea::placeholder { color: ${C.placeholder}; }
        input:focus, textarea:focus, select:focus { outline: 2px solid ${C.accent}; outline-offset: 1px; }
        button:focus-visible { outline: 2px solid ${C.accent}; outline-offset: 2px; }
      `}</style>
    </div>
  );
}

function Field({ label, hint, error, children }) {
  return (
    <div style={styles.field}>
      <div style={styles.labelRow}>
        <label style={styles.label}>{label}</label>
        {hint && <span style={styles.hint}>{hint}</span>}
      </div>
      {children}
      {error && <div style={styles.fieldError}>{error}</div>}
    </div>
  );
}

const C = {
  paper: "#FBF9F4",
  cardBorder: "#DEDACB",
  ink: "#1E2A38",
  muted: "#6B7280",
  placeholder: "#A3A79A",
  rule: "#DEDACB",
  accent: "#9C7A3C",
  accentText: "#FBF9F4",
  error: "#A6402A",
  errorBg: "#FBEEEA",
  success: "#3F6B4F",
  fieldBg: "#FFFFFE",
};

const serif = "'Iowan Old Style', 'Palatino Linotype', Palatino, Georgia, serif";
const sans = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

const styles = {
  page: {
    background: C.paper,
    minHeight: "100%",
    padding: "40px 20px",
    display: "flex",
    justifyContent: "center",
    fontFamily: sans,
  },
  card: {
    width: "100%",
    maxWidth: 560,
  },
  header: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  heading: {
    fontFamily: serif,
    fontSize: 28,
    fontWeight: 500,
    color: C.ink,
    margin: "6px 0 0 0",
    letterSpacing: "-0.01em",
  },
  subheading: {
    fontSize: 14.5,
    color: C.muted,
    margin: 0,
    lineHeight: 1.5,
    maxWidth: 440,
  },
  rule: {
    height: 1,
    background: C.rule,
    margin: "22px 0 26px 0",
  },
  field: {
    marginBottom: 22,
  },
  row: {
    display: "flex",
    gap: 16,
    flexWrap: "wrap",
  },
  labelRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 8,
  },
  label: {
    fontSize: 13.5,
    fontWeight: 600,
    color: C.ink,
  },
  hint: {
    fontSize: 12,
    color: C.muted,
  },
  textarea: {
    width: "100%",
    background: C.fieldBg,
    border: `1px solid ${C.cardBorder}`,
    borderRadius: 4,
    padding: "12px 14px",
    fontSize: 14.5,
    lineHeight: 1.55,
    color: C.ink,
    fontFamily: sans,
    resize: "vertical",
    boxSizing: "border-box",
  },
  priceWrap: {
    display: "flex",
    alignItems: "center",
    background: C.fieldBg,
    border: `1px solid ${C.cardBorder}`,
    borderRadius: 4,
    padding: "0 14px",
  },
  priceSymbol: {
    color: C.muted,
    fontSize: 14.5,
    marginRight: 4,
  },
  priceInput: {
    flex: 1,
    border: "none",
    outline: "none",
    background: "transparent",
    padding: "11px 0",
    fontSize: 14.5,
    color: C.ink,
    fontFamily: sans,
    minWidth: 0,
  },
  durationWrap: {
    display: "flex",
    background: C.fieldBg,
    border: `1px solid ${C.cardBorder}`,
    borderRadius: 4,
    overflow: "hidden",
  },
  durationInput: {
    flex: 1,
    border: "none",
    outline: "none",
    background: "transparent",
    padding: "11px 14px",
    fontSize: 14.5,
    color: C.ink,
    fontFamily: sans,
    minWidth: 0,
  },
  durationSelect: {
    border: "none",
    borderLeft: `1px solid ${C.cardBorder}`,
    background: "transparent",
    padding: "11px 10px",
    fontSize: 14.5,
    color: C.ink,
    fontFamily: sans,
  },
  inputError: {
    borderColor: C.error,
  },
  fieldError: {
    fontSize: 12.5,
    color: C.error,
    marginTop: 6,
  },
  errorBanner: {
    display: "flex",
    gap: 10,
    background: C.errorBg,
    border: `1px solid ${C.error}33`,
    borderRadius: 4,
    padding: "12px 14px",
    marginBottom: 20,
  },
  errorBannerTitle: {
    fontSize: 13.5,
    fontWeight: 600,
    color: C.error,
  },
  errorBannerBody: {
    fontSize: 13,
    color: C.error,
    marginTop: 2,
    lineHeight: 1.5,
  },
  submitButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    background: C.ink,
    color: C.accentText,
    border: "none",
    borderRadius: 4,
    padding: "12px 22px",
    fontSize: 14.5,
    fontWeight: 600,
    fontFamily: sans,
    cursor: "pointer",
  },
  secondaryButton: {
    background: "transparent",
    color: C.ink,
    border: `1px solid ${C.cardBorder}`,
    borderRadius: 4,
    padding: "10px 18px",
    fontSize: 14,
    fontWeight: 600,
    fontFamily: sans,
    cursor: "pointer",
    marginTop: 18,
  },
  successWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 8,
    paddingTop: 30,
  },
  successHeading: {
    fontFamily: serif,
    fontSize: 26,
    fontWeight: 500,
    color: C.ink,
    margin: "6px 0 0 0",
  },
  successBody: {
    fontSize: 14.5,
    color: C.muted,
    lineHeight: 1.6,
    margin: 0,
    maxWidth: 440,
  },
};