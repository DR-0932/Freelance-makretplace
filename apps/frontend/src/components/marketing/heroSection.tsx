import React from "react";

export default function HeroSection() {
  const styles = {
    section: "w-full bg-orange-100 px-6 py-16 md:px-16 lg:py-24",
    grid: "mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2",
    leftColumn: "flex flex-col space-y-8",
    headline: "text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-6xl lg:text-7xl",
    underlineAccent: "relative inline-block underline decoration-emerald-400 decoration-wavy decoration-2 underline-offset-8",
    subheading: "max-w-xl text-lg text-neutral-600 sm:text-xl",
    ctaForm: "flex max-w-md items-center rounded-2xl border border-neutral-200 bg-neutral-50/50 p-1.5 shadow-sm focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500",
    input: "w-full bg-transparent px-4 py-2 text-neutral-800 outline-none placeholder:text-neutral-400",
    button: "shrink-0 rounded-xl bg-emerald-400 px-6 py-3 font-semibold text-neutral-950 transition-all hover:bg-emerald-500",
    metricsGrid: "grid grid-cols-2 gap-8 border-t border-neutral-100 pt-6 max-w-md",
    metricValue: "text-3xl font-extrabold text-neutral-900",
    metricLabel: "text-sm font-medium text-neutral-500",
    ratingContainer: "flex items-center gap-3 pt-2",
    starsWrapper: "flex text-amber-400",
    starIcon: "h-5 w-5 fill-current",
    ratingText: "text-sm font-semibold text-neutral-700",
    ratingSubtext: "font-normal text-neutral-500",
    rightColumn: "relative flex items-center justify-center rounded-3xl border border-neutral-100 bg-neutral-50 p-8 min-h-[420px]",
    mockupWrapper: "flex flex-col items-center justify-center text-center text-neutral-400 space-y-3",
    iconBox: "h-16 w-16 rounded-2xl bg-neutral-200/60 flex items-center justify-center",
    mockupText: "text-sm font-medium",
  };

  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        <div className={styles.leftColumn}>
          <h1 className={styles.headline}>
            Hire top talent{" "}
            <span className={styles.underlineAccent}>
              on demand
            </span>
          </h1>

          <p className={styles.subheading}>
            Fast, verified, and reliable — connect with world-class freelancers
            and streamline your team's project workflow in one workspace.
          </p>

          <div className={styles.ctaForm}>
            <input
              type="email"
              placeholder="Enter your work email"
              className={styles.input}
            />
            <button type="submit" className={styles.button}>
              Get started
            </button>
          </div>

          <div className={styles.metricsGrid}>
            <div>
              <p className={styles.metricValue}>98.4%</p>
              <p className={styles.metricLabel}>Project success rate</p>
            </div>
            <div>
              <p className={styles.metricValue}>~50k</p>
              <p className={styles.metricLabel}>Active freelancers</p>
            </div>
          </div>

          <div className={styles.ratingContainer}>
            <div className={styles.starsWrapper}>
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={styles.starIcon}
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className={styles.ratingText}>
              4.9 <span className={styles.ratingSubtext}>Average client rating</span>
            </span>
          </div>
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.mockupWrapper}>
            <div className={styles.iconBox}>💼</div>
            <p className={styles.mockupText}>Illustration / App Mockup Slot</p>
          </div>
        </div>
      </div>
    </section>
  );
}