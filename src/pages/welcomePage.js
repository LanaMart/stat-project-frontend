const React = require("react");
const { useState, useEffect } = React;

// WelcomePage Component
const WelcomePage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [chartData, setChartData] = useState([40, 60, 45, 80, 55, 70]);
  const [particlePositions, setParticlePositions] = useState([]);
  const [hoverIndex, setHoverIndex] = useState(null);

  useEffect(() => {
    setIsVisible(true);

    // Generate random particles
    const particles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 2,
    }));
    setParticlePositions(particles);

    // Animate chart data
    const interval = setInterval(() => {
      setChartData((prev) => prev.map(() => 20 + Math.random() * 60));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return React.createElement(
    "div",
    {
      className:
        "relative flex flex-col items-center justify-start gap-3lg w-full max-w-[414px] mx-auto px-2xs overflow-hidden pt-4xl",
    },
    [
      // Animated background particles
      React.createElement(
        "div",
        {
          key: "particles",
          className: "absolute inset-0 overflow-hidden pointer-events-none",
        },
        particlePositions.map((particle) =>
          React.createElement("div", {
            key: particle.id,
            className:
              "absolute w-2 h-2 bg-gradient-to-br from-stat-primary to-stat-primary-800 rounded-full opacity-20",
            style: {
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animation: `float ${particle.duration}s ease-in-out infinite`,
              animationDelay: `${particle.delay}s`,
            },
          })
        )
      ),

      // Animated Logo/Icon with interaction
      React.createElement(
        "div",
        {
          key: "logo",
          className: `relative transition-all duration-1000 ease-out ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-10"
          }`,
        },
        React.createElement("div", { className: "relative" }, [
          // Rotating gradient ring
          React.createElement("div", {
            key: "ring",
            className: "absolute inset-0 flex items-center justify-center",
            children: React.createElement("div", {
              className: "w-36 h-36 rounded-full opacity-30",
              style: {
                background:
                  "conic-gradient(from 0deg, stat-primary, stat-primary-400, stat-primary-800)",
                animation: "spin 4s linear infinite",
              },
            }),
          }),

          // Main icon container
          React.createElement(
            "div",
            {
              key: "icon-container",
              className: "relative w-32 h-32 flex items-center justify-center",
            },
            [
              React.createElement("div", {
                key: "bg1",
                className:
                  "absolute inset-0 bg-gradient-to-br from-stat-primary to-stat-primary-800 rounded-2xl shadow-2xl transform rotate-6 transition-transform duration-300",
              }),
              React.createElement(
                "div",
                {
                  key: "bg2",
                  className:
                    "absolute inset-0 bg-gradient-to-br from-stat-primary to-stat-primary-800 rounded-2xl shadow-xl flex items-center justify-center",
                },
                React.createElement(
                  "i",
                  {
                    className:
                      "material-icons-outlined w-16 h-16 text-white animate-bounce",
                    style: { animationDuration: "2s", fontSize: "64px" },
                  },
                  "bar_chart"
                )
              ),
            ]
          ),
        ])
      ),

      //Interactive mini chart bars
      React.createElement(
        "div",
        {
          key: "chart",
          className: `flex items-end transition-all duration-1000 delay-200 ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`,
        },
        chartData.map((height, index) =>
          React.createElement(
            "div",
            {
              key: index,
              className:
                "relative flex-1 bg-gradient-to-t from-stat-primary to-stat-primary-800 rounded-t-lg cursor-pointer transition-all duration-500",
              style: {
                height: `${height}%`,
                opacity: hoverIndex === index ? 1 : 0.8,
              },
              onMouseEnter: () => setHoverIndex(index),
              onMouseLeave: () => setHoverIndex(null),
            },
            hoverIndex === index &&
              React.createElement(
                "div",
                {
                  className:
                    "absolute -top-8 left-1/2 transform -translate-x-1/2 bg-stat-font-tertiary text-white text-xs px-2xs py-2xs rounded whitespace-nowrap",
                },
                `${Math.round(height)}%`
              )
          )
        )
      ),

      // Floating icons animation with interaction
      React.createElement(
        "div",
        {
          key: "floating-icons",
          className: "absolute inset-0 overflow-hidden pointer-events-none",
        },
        [
          React.createElement(
            "div",
            {
              key: "icon1",
              className: "pointer-events-auto",
            },
            React.createElement(
              "i",
              {
                className: `material-icons-outlined text-stat-primary-400 w-8 h-8 transition-all duration-1000 cursor-pointer ${
                  isVisible
                    ? "opacity-30 top-32 left-8"
                    : "opacity-0 top-0 left-0"
                }`,
                style: {
                  animation: "float 3s ease-in-out infinite",
                  animationDelay: "0s",
                  fontSize: "32px",
                },
              },
              "trending_up"
            )
          ),
          React.createElement(
            "div",
            {
              key: "icon2",
              className: "pointer-events-auto",
            },
            React.createElement(
              "i",
              {
                className: `material-icons-outlined text-stat-primary-400 w-8 h-8 transition-all duration-1000 ${
                  isVisible
                    ? "opacity-30 top-40 right-12"
                    : "opacity-0 top-0 right-0"
                }`,
                style: {
                  animation: "float 3s ease-in-out infinite",
                  animationDelay: "1s",
                  fontSize: "32px",
                },
              },
              "pie_chart"
            )
          ),
          React.createElement(
            "div",
            {
              key: "icon3",
              className: "pointer-events-auto",
            },
            React.createElement(
              "i",
              {
                className: `material-icons-outlined text-stat-primary-400 w-8 h-8 transition-all duration-1000 cursor-pointer ${
                  isVisible
                    ? "opacity-30 top-56 left-16"
                    : "opacity-0 top-0 left-0"
                }`,
                style: {
                  animation: "float 3s ease-in-out infinite",
                  animationDelay: "1.5s",
                  fontSize: "32px",
                },
              },
              "timeline"
            )
          ),
          React.createElement(
            "div",
            {
              key: "icon4",
              className: "pointer-events-auto",
            },
            React.createElement(
              "i",
              {
                className: `material-icons-outlined text-stat-primary-400 w-8 h-8 transition-all duration-1000 ${
                  isVisible
                    ? "opacity-30 bottom-32 right-8"
                    : "opacity-0 bottom-0 right-0"
                }`,
                style: {
                  animation: "float 3s ease-in-out infinite",
                  animationDelay: "2s",
                  fontSize: "32px",
                },
              },
              "show_chart"
            )
          ),
        ]
      ),

      // Interactive circular progress
      React.createElement(
        "div",
        {
          key: "circular-progrress",
          className: `relative transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
          }`,
        },
        [
          React.createElement(
            "svg",
            {
              key: "svg",
              className: "w-24 h-24 transform -rotate-90",
            },
            [
              React.createElement("circle", {
                key: "bg-circle",
                cx: "48",
                cy: "48",
                r: "40",
                stroke: "#e5e7eb",
                strokeWidth: "8",
                fill: "none",
              }),
              React.createElement("circle", {
                key: "progress-circle",
                cx: "48",
                cy: "48",
                r: "40",
                stroke: "url(#gradient)",
                strokeWidth: "8",
                fill: "none",
                strokeDasharray: "251.2",
                strokeDashoffset: "62.8",
                className: "transition-all duration-1000",
                style: { animation: "progress 3s ease-in-out infinite" },
              }),
              React.createElement(
                "defs",
                { key: "defs" },
                React.createElement(
                  "linearGradient",
                  {
                    id: "gradient",
                    x1: "0%",
                    y1: "0%",
                    x2: "100%",
                    y2: "100%",
                  },
                  [
                    React.createElement("stop", {
                      key: "stop1",
                      offset: "0%",
                      stopColor: "#00c9a7",
                    }),
                    React.createElement("stop", {
                      key: "stop2",
                      offset: "100%",
                      stopColor: "#0a6b4b",
                    }),
                  ]
                )
              ),
            ]
          ),
          React.createElement(
            "div",
            {
              key: "center-icon",
              className: "absolute inset-0 flex items-center justify-center",
            },
            React.createElement(
              "i",
              {
                className:
                  "material-icons-outlined w-8 h-8 text-stat-accent-green animate-pulse",
                style: { fontSize: "32px" },
              },
              "storage"
            )
          ),
        ]
      ),

      // Welcome text with staggered animation
      React.createElement(
        "div",
        {
          key: "welcome-text",
          className: `text-stat-font text-center w-full space-y-4 transition-all duration-1000 ease-out delay-400 font-noto ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`,
        },
        [
          React.createElement(
            "p",
            {
              key: "description",
              className: "text-base font-noto leading-6 px-xs",
            },
            [
              "Welcome to the ",
              React.createElement(
                "span",
                {
                  key: "wonderful",
                  className: "font-semibold text-stat-primary",
                },
                "wonderful"
              ),
              " statistic app that helps you to be a master of statistics.",
            ]
          ),
        ]
      ),

      // Interactive stats cards
      React.createElement(
        "div",
        {
          key: "stats-cards",
          className: `grid grid-cols-3 gap-3xl w-full transition-all duration-1000 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`,
        },
        [
          { icon: "bar_chart", value: "95%", label: "Accuracy" },
          { icon: "trending_up", value: "2.5x", label: "Faster" },
          { icon: "timeline", value: "∞", label: "Projects" },
        ].map((stat, index) =>
          React.createElement(
            "div",
            {
              key: index,
              className:
                "bg-stat-primary-50 p-3 rounded-xl border-2 border-bg-stat-primary-100",
            },
            [
              React.createElement(
                "i",
                {
                  key: "icon",
                  className:
                    "material-icons-outlined w-6 h-6 text-stat-primary mx-auto mb-2xs",
                  style: { fontSize: "24px" },
                },
                stat.icon
              ),
              React.createElement(
                "div",
                {
                  key: "value",
                  className: "text-xl font-bold text-stat-primary",
                },
                stat.value
              ),
              React.createElement(
                "div",
                {
                  key: "label",
                  className: "text-sm text-stat-font",
                },
                stat.label
              ),
            ]
          )
        )
      ),

      // Call to action with pulse animation
      React.createElement(
        "div",
        {
          key: "cta",
          className: `text-center w-full transition-all duration-1000 ease-out delay-600 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`,
        },
        React.createElement(
          "div",
          {
            className: "relative inline-block group",
          },
          [
            React.createElement("div", {
              key: "glow",
              className: "absolute inset-0",
            }),
            React.createElement(
              "p",
              {
                key: "text",
                className: "relative text-base text-stat-font px-6 py-3",
              },
              "Please start a new project in the sidebar"
            ),
          ]
        )
      ),

      // Animated arrow pointing left (unchanged)
      React.createElement(
        "div",
        {
          key: "arrow",
          className: `mt-1sm transition-all duration-1000 ease-out delay-700 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`,
          style: { animation: "bounce 2s ease-in-out infinite" },
        },
        React.createElement(
          "svg",
          {
            className: "w-8 h-8 text-stat-primary",
            fill: "none",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: "2",
            viewBox: "0 0 24 24",
            stroke: "currentColor",
          },
          React.createElement("path", {
            d: "M10 19l-7-7m0 0l7-7m-7 7H21",
          })
        )
      ),

      // Styles
      React.createElement("style", {
        key: "styles",
        dangerouslySetInnerHTML: {
          __html: `
            @keyframes float {
              0%, 100% {
                transform: translateY(0px) rotate(0deg);
              }
              50% {
                transform: translateY(-20px) rotate(5deg);
              }
            }
            
            @keyframes bounce {
              0%, 100% {
                transform: translateY(0);
              }
              50% {
                transform: translateY(-10px);
              }
            }

            @keyframes spin {
              from {
                transform: rotate(0deg);
              }
              to {
                transform: rotate(360deg);
              }
            }

            @keyframes progress {
              0%, 100% {
                stroke-dashoffset: 62.8;
              }
              50% {
                stroke-dashoffset: 188.4;
              }
            }
          `,
        },
      }),
    ]
  );
};

module.exports = { WelcomePage };
