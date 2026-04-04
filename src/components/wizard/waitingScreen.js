const React = require("react");
const { MaterialIcon } = require("../button");

const STEPS = [
  { id: "cleaning",    label: "Data cleaning",       icon: "auto_awesome" },
  { id: "features",   label: "Features selection",   icon: "tune" },
  { id: "reports",    label: "Reports preparation",  icon: "pie_chart_outline" },
];

const STEP_DURATION_MS = 3000;
const TICK_MS = 30;
const INCREMENT = 100 / (STEP_DURATION_MS / TICK_MS); // ~1% per tick

/**
 * WaitingScreen - animated progress screen while backend prepares the report.
 *
 * @param {Object} props
 * @param {Function} props.onComplete - Called after all steps reach 100%
 * @param {Function} props.onBack    - "Back to dashboard" button
 */
const WaitingScreen = ({ onComplete, onBack }) => {
  const [progresses, setProgresses] = React.useState([0, 0, 0]);
  const [currentStep, setCurrentStep] = React.useState(0);
  const [done, setDone] = React.useState(false);
  const timerRef = React.useRef(null);

  React.useEffect(() => {
    if (done) return;

    timerRef.current = setInterval(() => {
      setProgresses((prev) => {
        const next = [...prev];
        const step = currentStep;

        if (next[step] >= 100) return prev; // already full, skip

        next[step] = Math.min(100, next[step] + INCREMENT);
        return next;
      });
    }, TICK_MS);

    return () => clearInterval(timerRef.current);
  }, [currentStep, done]);

  // Watch progress of current step – advance when it hits 100
  React.useEffect(() => {
    if (progresses[currentStep] < 100) return;

    clearInterval(timerRef.current);

    if (currentStep < STEPS.length - 1) {
      const t = setTimeout(() => setCurrentStep((s) => s + 1), 300);
      return () => clearTimeout(t);
    } else {
      // All steps done
      setDone(true);
      const t = setTimeout(() => onComplete && onComplete(), 600);
      return () => clearTimeout(t);
    }
  }, [progresses, currentStep]);

  const isStepDone   = (i) => progresses[i] >= 100;
  const isStepActive = (i) => i === currentStep && !isStepDone(i);

  const barColor = (i) =>
    isStepDone(i) ? "bg-stat-success" : "bg-stat-primary";

  const pctColor = (i) =>
    isStepDone(i)
      ? "text-stat-success"
      : i === currentStep
      ? "text-stat-font-secondary"
      : "text-stat-font-secondary";

  return React.createElement(
    "div",
    { className: "flex flex-col gap-4xl w-full h-full px-4xl min-h-0 overflow-y-auto" },

    // Header
    React.createElement(
      "p",
      { className: "font-noto font-semibold text-lg leading-7 text-stat-primary shrink-0" },
      "We are starting to prepare your report, please wait!"
    ),

    // Steps
    React.createElement(
      "div",
      { className: "flex flex-col gap-2sm w-full shrink-0" },
      ...STEPS.map((step, i) =>
        React.createElement(
          "div",
          {
            key: step.id,
            className: "bg-stat-white border border-stat-primary-50 rounded-2sm flex gap-3md items-start pl-2sm pr-3lg py-3md w-full",
          },

          // Icon
          React.createElement(MaterialIcon, {
            name: step.icon,
            className: `material-icons text-2xl shrink-0 mt-px ${
              isStepDone(i) ? "text-stat-success" : "text-stat-primary"
            }`,
          }),

          // Label + progress
          React.createElement(
            "div",
            { className: "flex flex-col gap-3md flex-1 min-w-0" },

            React.createElement(
              "span",
              { className: "font-noto font-normal text-base text-stat-font" },
              step.label
            ),

            React.createElement(
              "div",
              { className: "flex flex-col gap-[5px] items-end w-full" },

              // Track + fill
              React.createElement(
                "div",
                { className: "relative h-[2px] w-full rounded-full bg-[#e9e9e9]" },
                React.createElement("div", {
                  className: `absolute inset-y-0 left-0 rounded-full transition-all duration-75 ${barColor(i)}`,
                  style: { width: `${progresses[i]}%` },
                })
              ),

              // Percentage label
              React.createElement(
                "span",
                { className: `font-noto text-sm ${pctColor(i)}` },
                `${Math.round(progresses[i])}%`
              )
            )
          )
        )
      )
    ),

    // Footer
    React.createElement(
      "div",
      { className: "flex items-center w-full shrink-0 pb-4xl" },
      React.createElement(
        "button",
        {
          type: "button",
          className:
            "flex gap-1sm items-center px-3md py-2sm rounded-sm h-9 hover:bg-stat-font-tertiary transition-colors",
          onClick: onBack,
        },
        React.createElement(MaterialIcon, {
          name: "arrow_back",
          className: "material-icons text-stat-font text-2xl",
        }),
        React.createElement(
          "span",
          { className: "font-noto font-normal text-base text-stat-font whitespace-nowrap" },
          "Back to dashboard"
        )
      )
    )
  );
};

module.exports = { WaitingScreen };
