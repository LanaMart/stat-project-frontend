const React = require("react");
const { QPushButton, MaterialIcon } = require("./button.js");
const { useProject } = require("../context/projectContext.js");
const Alert = require("./alert.js"); // Import Alert.js

const UPLOAD_STATES = {
  IDLE: "idle",
  UPLOADING: "uploading",
  SUCCESS: "success",
  PROCESSING: "processing",
  REPORT_READY: "report_ready",
};

const UploadProgress = ({
  fileName,
  fileSize,
  uploadState,
  progress,
  onCancel,
  processingTimeEstimate,
}) => {
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}KB`;
    return `${Math.round(bytes / (1024 * 1024))}MB`;
  };

  if (uploadState === UPLOAD_STATES.IDLE) return null;

  const isSuccess = uploadState === UPLOAD_STATES.SUCCESS;
  const progressWidth = isSuccess ? "100%" : `${Math.min(progress, 100)}%`;

  return React.createElement(
    "div",
    {
      className:
        "upload-card bg-stat-white border border-stat-primary-50 rounded-md p-3lg w-[600px]",
    },
    [
      React.createElement(
        "div",
        {
          key: "top",
          className:
            "flex items-center justify-between gap-[68px] mb-2.5 w-full",
        },
        [
          React.createElement(
            "div",
            {
              key: "label",
              className: "flex items-end gap-1sm flex-1",
            },
            [
              React.createElement(MaterialIcon, {
                key: "file-icon",
                name: "upload_file",
                className: "material-icons-outlined text-stat-primary",
              }),
              React.createElement(
                "div",
                {
                  key: "filename",
                  className: "text-stat-font text-sm text-center font-noto",
                },
                fileName || "Unknown file"
              ),
              React.createElement(
                "div",
                {
                  key: "filesize",
                  className:
                    "text-stat-font-secondary text-xs text-center font-noto",
                },
                formatFileSize(fileSize || 0)
              ),
            ]
          ),
          React.createElement(MaterialIcon, {
            key: "right-icon",
            name: isSuccess ? "check_circle" : "cancel",
            className: isSuccess
              ? "material-icons-outlined text-stat-success"
              : "material-icons-outlined text-stat-font-secondary hover:text-stat-warning cursor-pointer",
            onClick: isSuccess ? undefined : onCancel,
          }),
        ]
      ),
      React.createElement(
        "div",
        {
          key: "progress-bar",
          className: "h-0.5 relative mb-2.5 w-full",
        },
        [
          React.createElement("div", {
            key: "bg",
            className: "absolute bg-stat-primary-200 inset-0 rounded-[40px]",
          }),
          React.createElement("div", {
            key: "fill",
            className:
              "absolute top-0 left-0 bottom-0 rounded-[40px] transition-all duration-500 ease-in-out",
            style: {
              backgroundColor:
                isSuccess || progress >= 100
                  ? "var(--stat-success, #11b37d)"
                  : "var(--stat-primary, #6a5acd)",
              width: progressWidth,
            },
          }),
        ]
      ),
      React.createElement(
        "div",
        {
          key: "bottom",
          className: "flex items-center justify-end gap-2.5 w-full",
        },
        React.createElement(
          "div",
          {
            className: "text-xs text-center font-noto text-stat-font",
          },
          isSuccess ? "100%" : `${Math.min(Math.round(progress), 100)}%`
        )
      ),
    ]
  );
};

const DragDropZone = ({ disabled }) => {
  const { startUpload } = useProject();
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [isFileDropping, setIsFileDropping] = React.useState(false);
  const [droppedFileInfo, setDroppedFileInfo] = React.useState(null);
  const [validationErrors, setValidationErrors] = React.useState([]); // State for validation errors (array of strings)
  const fileInputRef = React.useRef(null);

  // Function to simulate file validation
  const simulateFileValidation = (file) => {
    const errors = [];

    // Check file type
    const allowedTypes = [
      "text/csv",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    if (!allowedTypes.includes(file.type)) {
      errors.push("Invalid file type. Only CSV, PDF, or XLSX allowed.");
    }

    // Check size (example: max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      errors.push("File too large. Maximum size is 10MB.");
    }

    // Random error to simulate backend errors (10% chance)
    if (Math.random() < 0.1) {
      errors.push("Simulated server error. Please try again.");
    }

    return errors;
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      console.log("Drag enter");
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !e.currentTarget.contains(e.relatedTarget)) {
      console.log("Drag leave");
      setIsDragOver(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Drop event fired, disabled:", disabled);
    if (disabled) {
      console.log("Drop ignored: disabled");
      return;
    }
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    console.log("Dropped files:", files.length, files[0]?.name, files[0]?.type);

    if (files.length > 0) {
      const file = files[0];

      // TODO: Replace this simulated validation with backend API call
      // Example: POST /api/validate-file with FormData including file
      // If API returns errors, setValidationErrors(response.errors)
      // Else, proceed with startUpload
      const errors = simulateFileValidation(file);

      if (errors.length > 0) {
        setValidationErrors(errors);
        return; // Do not proceed with upload if errors
      }

      console.log("Starting upload for valid file:", file.name);
      setDroppedFileInfo({ name: file.name, size: file.size });
      setIsFileDropping(true);

      setTimeout(() => {
        setIsFileDropping(false);
        setDroppedFileInfo(null);
        console.log("Calling startUpload from drop");
        startUpload(file);
      }, 800);
    } else {
      console.warn("No files dropped");
    }
  };

  const handleBrowseClick = () => {
    console.log("Browse clicked, disabled:", disabled);
    if (!disabled) fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log(
      "File change event:",
      file?.name,
      file?.type,
      "disabled:",
      disabled
    );
    if (file && !disabled) {
      // TODO: Replace this simulated validation with backend API call
      // Example: POST /api/validate-file with FormData including file
      // If API returns errors, setValidationErrors(response.errors)
      // Else, proceed with startUpload
      const errors = simulateFileValidation(file);

      if (errors.length > 0) {
        setValidationErrors(errors);
        return; // Do not proceed with upload if errors
      }

      console.log("Starting upload from browse");
      startUpload(file);
    } else {
      console.log("File change ignored");
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0B";
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}KB`;
    return `${Math.round(bytes / (1024 * 1024))}MB`;
  };

  return React.createElement(
    "div",
    {
      className:
        "bg-white p-3md rounded-md w-[600px] border border-stat-primary-50 relative", // Added relative for alert positioning
    },
    [
      React.createElement(
        "div",
        {
          key: "drop-zone",
          className: `bg-stat-primary-50 border-[3px] ${
            isDragOver ? "border-solid" : "border-dashed"
          } border-stat-primary rounded-md p-3lg flex flex-col items-center justify-start gap-3lg w-full relative transition-all duration-200 ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`,
          style: {
            backgroundColor: isDragOver ? "#e5e3f7" : "#f1f0fb",
          },
          onDragEnter: handleDragEnter,
          onDragLeave: handleDragLeave,
          onDragOver: handleDragOver,
          onDrop: handleDrop,
        },
        [
          React.createElement(
            "div",
            {
              key: "content",
              className: "flex flex-col items-center gap-3md w-[600px]",
            },
            [
              React.createElement(MaterialIcon, {
                key: "upload-icon",
                name: "upload",
                className: "material-icons-outlined text-stat-primary",
              }),
              React.createElement(
                "div",
                {
                  key: "title",
                  className:
                    "text-stat-font text-base font-bold text-center font-noto",
                },
                "Please add your data"
              ),
            ]
          ),
          React.createElement(
            "div",
            {
              key: "description",
              className: "text-stat-font text-sm text-center w-full font-noto",
            },
            "Drag and Drop your csv, pdf or xlsx file here"
          ),
          React.createElement(
            "div",
            {
              key: "browse-section",
              className: "flex flex-col items-center gap-1sm w-full",
            },
            [
              React.createElement(
                "div",
                {
                  key: "or-text",
                  className: "text-stat-font text-sm text-center font-noto",
                },
                "or"
              ),
              React.createElement(
                QPushButton,
                {
                  key: "browse-button",
                  onClick: handleBrowseClick,
                  className: "h-10",
                  disabled: disabled,
                },
                "Browse File"
              ),
            ]
          ),
          React.createElement("input", {
            key: "file-input",
            ref: fileInputRef,
            type: "file",
            accept: ".csv,.pdf,.xlsx",
            style: { display: "none" },
            onChange: handleFileChange,
          }),
          ...(isFileDropping && droppedFileInfo
            ? [
                React.createElement(AnimatedFileDropping, {
                  key: "animated-drop",
                  fileName: droppedFileInfo.name,
                  fileSize: formatFileSize(droppedFileInfo.size),
                }),
              ]
            : []),
        ]
      ),
      // Alert is displayed if there are errors
      validationErrors.length > 0 &&
        React.createElement(Alert, {
          key: "validation-alert",
          title: "Oops. Something went wrong!",
          errors: validationErrors,
          onClose: () => setValidationErrors([]),
        }),
    ]
  );
};

const AnimatedFileDropping = ({
  fileName = "Unknown file",
  fileSize = "0B",
}) => {
  return React.createElement(
    "div",
    {
      className:
        "absolute inset-0 flex items-center justify-center pointer-events-none",
      style: {
        animation: "fadeIn 0.3s ease-in-out",
      },
    },
    React.createElement(
      "div",
      {
        className:
          "bg-stat-white rounded-[40px] p-2sm flex items-center justify-between gap-[68px] shadow-lg",
        style: {
          width: "273px",
          transform: "rotate(-5.914deg)",
          animation: "dropAnimation 0.8s ease-out",
          boxShadow: "0px 3px 10.4px 0px rgba(0,0,0,0.22)",
        },
      },
      [
        React.createElement(
          "div",
          {
            key: "file-info",
            className: "flex items-end gap-1sm flex-1 overflow-hidden",
          },
          [
            React.createElement(MaterialIcon, {
              key: "file-icon",
              name: "upload_file",
              className: "material-icons-outlined text-stat-font flex-shrink-0",
            }),
            React.createElement(
              "div",
              {
                key: "filename",
                className:
                  "text-stat-font text-base text-center whitespace-nowrap overflow-hidden text-ellipsis font-noto",
              },
              fileName
            ),
            React.createElement(
              "div",
              {
                key: "filesize",
                className:
                  "text-stat-font-secondary text-sm text-center whitespace-nowrap flex-shrink-0 font-noto",
              },
              fileSize
            ),
          ]
        ),
        React.createElement(MaterialIcon, {
          key: "cancel-icon",
          name: "cancel",
          className:
            "material-icons-outlined text-stat-font-secondary cursor-pointer hover:text-stat-warning flex-shrink-0",
        }),
      ]
    )
  );
};

module.exports = {
  DragDropZone,
  UploadProgress,
  UPLOAD_STATES,
  AnimatedFileDropping,
};
