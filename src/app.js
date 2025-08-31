const React = require('react');
const ReactDOM = require('react-dom');
const { Sidebar } = require('./components/sidebar.js');
const { MaterialIcon } = require('./components/button.js');
const { DialogProvider } = require('./components/dialog.js');
const { useUploadManager, ProcessingMessage, DragDropZone, UploadProgress } = require('./components/upload.js');





// Main App Component
const App = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const uploadManager = useUploadManager(); // this is the initialization of the component?

  return React.createElement('div', {
    className: 'relative w-screen h-screen overflow-hidden',
    style: { background: '#f5f6f7' }
  }, [
    // Mac Traffic Lights
    //React.createElement(MacTrafficLights, { key: 'traffic-lights' }),

    // Main Container
    React.createElement('div', {
      key: 'main-container',
      className: 'relative h-screen rounded-lg overflow-hidden bg-[#f5f6f7]'
    }, [
      // Header
      React.createElement('div', {
        key: 'header',
        className: 'absolute top-0 left-0 w-full h-14 bg-[#f1f0fb] border-b border-[#e5e3f7] rounded-t-lg flex items-center gap-4 px-4 drag-region'
      }, [
        //this element pushes to the right the app name in header
        React.createElement('div', {
          key: 'mac-icons-placeholder',
          className: 'w-[46px] h-[10px]'
        }),
        React.createElement('div', {
          key: 'app-title-section', 
          className: 'flex items-center gap-1.5'
        }, [
          React.createElement(MaterialIcon, {
            key: 'foundation-icon',
            name: 'foundation',
            className: 'text-[#6a5acd]'
          }),
          React.createElement('div', {
            key: 'app-name',
            className: 'text-[#2d2a45] text-[14px] font-semibold',
            style: { fontFamily: 'Noto Sans', lineHeight: '21px' }
          }, 'StatBridge App')
        ])
      ]),

      // Sidebar
      React.createElement(Sidebar, {
        key: 'sidebar',
        isOpen: sidebarOpen,
        onToggle: () => setSidebarOpen(!sidebarOpen)
      }),

      // Main Content Area
      React.createElement('div', {
        key: 'main-content',
        className: 'absolute flex flex-col items-center justify-start gap-4 w-[414px]',
        style: { 
          top: '190px', 
          left: 'calc(33.333% + 75.667px)'
        }
      },
        React.createElement('div', {
            className: 'text-[#2d2a45] text-[13px] text-center leading-5 h-[71px] w-full',
            style: { fontFamily: 'Noto Sans' }
        }, [
            React.createElement('p', {
            key: 'welcome-text',
            className: 'mb-1'
            }, 'Welcome to the wonderfull statistic app that help you to be a master of statistics.'),
            React.createElement('p', {
            key: 'instruction-text'
            }, 'Please add a new project')
        ]),
            // DRAG and DROP AREA
            React.createElement(DragDropZone, {
                key: 'drag-drop',
                /*pre progress bar: onFileSelect: (file) => { console.log('File selected:', file.name);}*/
                // for progress bar
                uploadManager: uploadManager, // this is how drag and drop gets access to the uploadManager object
                onFileSelect: uploadManager.startUpload  // Connect to upload manager
            }),

            ...(uploadManager.uploadState !== uploadManager.UPLOAD_STATES.IDLE ? [
                React.createElement(UploadProgress, {
                  key: 'upload-progress',
                  fileName: uploadManager.currentFile?.name,
                  fileSize: uploadManager.currentFile?.size,
                  uploadState: uploadManager.uploadState,
                  progress: uploadManager.progress,
                  onCancel: uploadManager.cancelUpload,
                  processingTimeEstimate: uploadManager.processingTimeEstimate
                })
              ] : []),
              // Add the processing message as separate component:
            ...(uploadManager.uploadState === uploadManager.UPLOAD_STATES.PROCESSING ? [
                React.createElement(ProcessingMessage, {
                key: 'processing-message'
                })
            ] : [])
      ),

      // Footer
      React.createElement('div', {
        key: 'footer',
        className: 'absolute bottom-0 left-0 w-full h-14 bg-[#f1f0fb] border-t border-[#e5e3f7] flex items-center px-4'
      },
        React.createElement('div', {
          className: 'flex items-center gap-2 w-[200px] rounded-lg'
        }, [
          React.createElement(MaterialIcon, {
            key: 'info-icon',
            name: 'info',
            className: 'text-[#6a5acd]'
          }),
          React.createElement('div', {
            key: 'footer-text',
            className: 'text-[#2d2a45] text-[13px] flex-1',
            style: { fontFamily: 'Noto Sans', lineHeight: '20px' }
          }, 'About statistic app')
        ])
      )
    ])
  ]);
};

// Render the app
ReactDOM.render(
  React.createElement(DialogProvider, null,
    React.createElement(App)
  ), 
  document.getElementById('root')
);
