const React = require('react');
const { MaterialIcon } = require('./button.js');


// Hook to use dialogs
const useDialog = () => {
    const context = React.useContext(DialogContext);
    if (!context) {
      throw new Error('useDialog must be used within DialogProvider');
    }
    return context;
};
  
  
const DeleteProjectDialog = ({ projectName, onConfirm, onClose }) => {
      return React.createElement('div', {
        className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50',
        onClick: onClose
      }, 
        React.createElement('div', {
          className: 'bg-white rounded-lg w-[400px] flex flex-col',
          style: { border: '1px solid #f1f0fb' },
          onClick: (e) => e.stopPropagation()
        }, [
          // Header
          React.createElement('div', {
            key: 'header',
            className: 'flex items-center justify-between px-5 py-3 border-b border-[#f1f0fb]'
          }, [
            React.createElement('div', {
              key: 'header-content', 
              className: 'flex items-center gap-2'
            }, [
              React.createElement(MaterialIcon, {
                key: 'info', name: 'info', size: 24, className: 'text-[#6a5acd]'
              }),
              React.createElement('div', {
                key: 'title',
                className: 'text-[#2d2a45] text-[16px] font-bold',
                style: { fontFamily: 'Noto Sans' }
              }, 'Project delete')
            ]),
            React.createElement(MaterialIcon, {
              key: 'close', name: 'close', size: 24,
              className: 'text-[#5e5c7f] cursor-pointer hover:text-[#2d2a45]',
              onClick: onClose
            })
          ]),
          
          // Content
          React.createElement('div', {
            key: 'content',
            className: 'bg-[#f5f6f7] px-6 py-4'
          },
            React.createElement('div', {
              className: 'text-[#2d2a45] text-[13px]',
              style: { fontFamily: 'Noto Sans' }
            }, `Are you sure you want to delete "${projectName}" project?`)
          ),
          
          // Buttons
          React.createElement('div', {
            key: 'buttons',
            className: 'flex justify-end gap-2.5 px-5 py-3'
          }, [
            React.createElement('button', {
              key: 'cancel',
              className: 'px-3 py-2.5 text-[#6a5acd] hover:bg-gray-50 rounded',
              onClick: onClose
            }, 'Cancel'),
            React.createElement('button', {
              key: 'delete',
              className: 'bg-[#6a5acd] text-white px-3 py-2.5 rounded flex items-center gap-2',
              onClick: () => { onConfirm(); onClose(); }
            }, [
              React.createElement(MaterialIcon, { key: 'check', name: 'check', size: 20 }),
              'Delete'
            ])
          ])
        ])
      );
};



// Dialog Context - manages all dialogs globally
const DialogContext = React.createContext();

const DialogProvider = ({ children }) => {
  const [dialogs, setDialogs] = React.useState([]);

  const showDialog = (dialogConfig) => {
    const id = Date.now();
    setDialogs(prev => [...prev, { ...dialogConfig, id }]);
    return id;
  };

  const hideDialog = (id) => {
    setDialogs(prev => prev.filter(dialog => dialog.id !== id));
  };

  return React.createElement(DialogContext.Provider, {
    value: { showDialog, hideDialog }
  }, [
    children,
    // Render all active dialogs
    ...dialogs.map(dialog => 
      React.createElement(DeleteProjectDialog, {
        key: dialog.id,
        ...dialog,
        onClose: () => hideDialog(dialog.id)
      })
    )
  ]);
};


module.exports = {
    DeleteProjectDialog, useDialog, DialogProvider
};