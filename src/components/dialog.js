const React = require("react");
const { QPushButton, MaterialIcon } = require("./button.js");

// Hook to use dialogs
const useDialog = () => {
  const context = React.useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within DialogProvider");
  }
  return context;
};

const DeleteProjectDialog = ({ projectName, onConfirm, onClose }) => {
  return React.createElement(
    "div",
    {
      className:
        "fixed inset-0 bg-stat-font bg-opacity-50 flex justify-center items-start z-[2000]",
      onClick: onClose,
    },
    React.createElement(
      "div",
      {
        className:
          "bg-white rounded-lg w-[500px] flex flex-col mt-1sm border border-stat-primary-100",
        onClick: (e) => e.stopPropagation(),
      },
      [
        // Header
        React.createElement(
          "div",
          {
            key: "header",
            className:
              "flex items-center justify-between p-3lg border-b border-stat-primary-50",
          },
          [
            React.createElement(
              "div",
              {
                key: "header-content",
                className: "flex items-center gap-2",
              },
              [
                React.createElement(MaterialIcon, {
                  key: "info",
                  name: "info",
                  className: "material-icons-outlined text-stat-font-secondary",
                }),
                React.createElement(
                  "div",
                  {
                    key: "title",
                    className: "text-stat-font text-lg font-bold font-noto",
                  },
                  "Project delete"
                ),
              ]
            ),
            React.createElement(MaterialIcon, {
              key: "close",
              name: "close",
              className:
                "material-icons-outlined text-stat-font-secondary cursor-pointer hover:text-stat-font-tertiary",
              onClick: onClose,
            }),
          ]
        ),

        // Content
        React.createElement(
          "div",
          {
            key: "content",
            className: "bg-stat-bg p-3xl",
          },
          React.createElement(
            "div",
            {
              className: "text-stat-font text-base break-words font-noto",
            },
            [
              'Are you sure you want to delete "',
              React.createElement(
                "span",
                {
                  className: "text-stat-primary font-semibold",
                  key: "project",
                },
                projectName
              ),
              '" project?',
            ]
          )
        ),

        // Buttons
        React.createElement(
          "div",
          {
            key: "buttons",
            className: "flex justify-end gap-2.5 p-3lg",
          },
          [
            // Cancel-Button
            React.createElement(
              QPushButton,
              {
                key: "cancel",
                variant: "tertiary",
                onClick: onClose,
              },
              "Cancel"
            ),
            // Delete-Button
            React.createElement(
              QPushButton,
              {
                key: "delete",
                variant: "primary",
                onClick: () => {
                  onConfirm();
                  onClose();
                },
              },
              [
                React.createElement(MaterialIcon, {
                  key: "check",
                  name: "check",
                  size: 20,
                }),
                "Delete",
              ]
            ),
          ]
        ),
      ]
    )
  );
};

// Dialog Context - manages all dialogs globally
const DialogContext = React.createContext();

const DialogProvider = ({ children }) => {
  const [dialogs, setDialogs] = React.useState([]);

  const showDialog = (dialogConfig) => {
    const id = Date.now();
    setDialogs((prev) => [...prev, { ...dialogConfig, id }]);
    return id;
  };

  const hideDialog = (id) => {
    setDialogs((prev) => prev.filter((dialog) => dialog.id !== id));
  };

  return React.createElement(
    DialogContext.Provider,
    {
      value: { showDialog, hideDialog },
    },
    [
      children,
      // Render all active dialogs
      ...dialogs.map((dialog) =>
        React.createElement(DeleteProjectDialog, {
          key: dialog.id,
          ...dialog,
          onClose: () => hideDialog(dialog.id),
        })
      ),
    ]
  );
};

module.exports = {
  DeleteProjectDialog,
  useDialog,
  DialogProvider,
};
