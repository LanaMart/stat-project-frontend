const React = require('react');
const ReactDOM = require('react-dom');
const { Sidebar } = require('./components/sidebar.js');
const { DialogProvider } = require('./components/dialog.js');


// Material Icons Component
const MaterialIcon = ({ name, className = "", size = 24, onClick }) => {
  return React.createElement('span', {
    className: `material-icons ${className}`,
    style: { fontSize: size, cursor: onClick ? 'pointer' : 'default' },
    onClick: onClick
  }, name);
};


const QPushButton = ({ onClick, children, className = '' }) => {
    return React.createElement(
        'button',
        {
            onClick,
            className: `bg-[#6a5acd] text-white h-9 px-3 py-2.5 rounded flex items-center justify-center gap-2 hover-effect cursor-pointer ${className}`,
            style: { fontFamily: 'Noto Sans', lineHeight: '20px' }
        },
        children
    );
};
  
  
// TODO :: entirely replace this with the other logic to call QPUSHbutton and get this one!
const QPushButtonWithPlus = ({ onClick }) => {
return React.createElement('button', {
    className: 'bg-[#6a5acd] h-9 px-3 py-2.5 rounded flex items-center justify-center gap-2 hover-effect cursor-pointer',
    onClick: onClick
}, [
    React.createElement(MaterialIcon, {
    key: 'plus-icon',
    name: 'add',
    size: 24,
    className: 'text-[#ebfaff]'
    })
]);
};





const ReportCard = ({ projectName, reportTitle, description, onReportClick, onDownload, onDelete }) => {
    return React.createElement('div', {
      className: 'bg-white border border-[#f1f0fb] rounded-lg p-4 w-full max-w-[552px] flex flex-col gap-3'
    }, [
      // Project tag
      React.createElement('div', {
        key: 'project-tag',
        className: 'bg-[#f1f0fb] px-2.5 py-1 rounded text-[#5e5c7f] text-[11px] self-start',
        style: { fontFamily: 'Noto Sans', lineHeight: '19.5px' }
      }, projectName),
  
      // Main content line
      React.createElement('div', {
        key: 'main-line',
        className: 'flex items-center justify-between w-full'
      }, [
        // Left side - chart icon and report title (clickable)
        React.createElement('div', {
          key: 'report-info',
          className: 'flex items-center gap-2 cursor-pointer',
          onClick: onReportClick
        }, [
          React.createElement(MaterialIcon, {
            key: 'chart-icon',
            name: 'insert_chart_outlined',
            size: 24,
            className: 'text-[#6a5acd]'
          }),
          React.createElement('div', {
            key: 'report-title',
            className: 'text-[#6a5acd] text-[13px] font-bold',
            style: { fontFamily: 'Noto Sans', lineHeight: '20px' }
          }, reportTitle)
        ]),
  
        // Right side - action buttons
        React.createElement('div', {
          key: 'actions',
          className: 'flex items-center gap-2'
        }, [
          React.createElement(MaterialIcon, {
            key: 'download',
            name: 'download',
            size: 24,
            className: 'text-[#5e5c7f] cursor-pointer hover:text-[#2d2a45]',
            onClick: onDownload
          }),
          React.createElement(MaterialIcon, {
            key: 'delete',
            name: 'delete',
            size: 24,
            className: 'text-[#5e5c7f] cursor-pointer hover:text-red-500',
            onClick: onDelete
          })
        ])
      ]),
  
      // Description
      React.createElement('div', {
        key: 'description',
        className: 'text-[#2d2a45] text-[13px]',
        style: { fontFamily: 'Noto Sans', lineHeight: '20px' }
      }, description)
    ]);
};



// File Upload State Constants
const UPLOAD_STATES = {
    IDLE: 'idle',
    UPLOADING: 'uploading', 
    SUCCESS: 'success',
    PROCESSING: 'processing',
    REPORT_READY: 'report_ready' //I added this as a signal when a file was uploaded
};


const UploadProgress = ({ 
        fileName, 
        fileSize, 
        uploadState, 
        progress, 
        onCancel,
        processingTimeEstimate 
    }) => {

    // Helper to format file size  
    const formatFileSize = (bytes) => {
        if (bytes < 1024) return `${bytes}B`;
        if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}KB`;
        return `${Math.round(bytes / (1024 * 1024))}MB`;
    };

    // Don't render if no file
    if (uploadState === UPLOAD_STATES.IDLE) return null;

    // Determine state
    const isSuccess = uploadState === UPLOAD_STATES.SUCCESS;
    const isProcessing = uploadState === UPLOAD_STATES.PROCESSING;

    // Colors based on state (matching Figma frames)
    const progressBgColor = isSuccess ? '#11b37d' : '#6a5acd';
    const textColor = isSuccess ? '#11b37d' : '#5e5c7f';
    const progressWidth = isSuccess ? '100%' : `${Math.min(progress, 100)}%`;

    return React.createElement('div', {
        className: 'bg-white border border-[#e5e3f7] rounded-[8px] p-4 w-full max-w-[552px]',
        style: { border: '1px solid #e5e3f7' }
    }, [
        // Top section - File info and icon
        React.createElement('div', {
        key: 'top',
        className: 'flex items-center justify-between gap-[68px] mb-2.5 w-full'
        }, [
        React.createElement('div', {
            key: 'label',
            className: 'flex items-end gap-[7px] flex-1'
        }, [
            React.createElement(MaterialIcon, {
                key: 'file-icon',
                name: 'insert_drive_file',
                size: 24,
                className: 'text-[#2d2a45]'
            }),
            React.createElement('div', {
                key: 'filename',
                className: 'text-[#2d2a45] text-[13px] text-center',
                style: { fontFamily: 'Noto Sans', lineHeight: '20px' }
            }, fileName || 'Unknown file'),
            React.createElement('div', {
            key: 'filesize', 
            className: 'text-[#5e5c7f] text-[12px] text-center',
            style: { fontFamily: 'Noto Sans', lineHeight: '19.5px' }
            }, formatFileSize(fileSize || 0))
        ]),
        
        // Right icon - cancel or checkmark
        React.createElement(MaterialIcon, {
            key: 'right-icon',
            name: isSuccess ? 'check_circle' : 'cancel',
            size: 24,
            className: isSuccess ? 'text-[#11b37d]' : 'text-[#5e5c7f] hover:text-red-500 cursor-pointer',
            onClick: isSuccess ? undefined : onCancel
        })
        ]),

        // Progress bar
        React.createElement('div', {
        key: 'progress-bar',
        className: 'h-0.5 relative mb-2.5 w-full'
        }, [
        // Background
        React.createElement('div', {
            key: 'bg',
            className: 'absolute bg-[#f1f0fb] inset-0 rounded-[40px]'
        }),
        // Progress fill
        React.createElement('div', {
            key: 'fill',
            className: 'absolute top-0 left-0 bottom-0 rounded-[40px] transition-all duration-300',
            style: {
            backgroundColor: progressBgColor,
            width: progressWidth
            }
        })
        ]),

        // Bottom section - Progress percentage or processing message
        // Bottom section - only show progress percentage
        React.createElement('div', {
            key: 'bottom',
            className: 'flex items-center justify-end gap-2.5 w-full'
        },
            React.createElement('div', {
            className: 'text-[12px] text-center',
            style: { 
                fontFamily: 'Noto Sans', 
                lineHeight: '19.5px',
                color: textColor 
            }
            }, isSuccess ? '100%' : `${Math.min(Math.round(progress), 100)}%`)
        )
    ]);
};


// ==================== UPLOAD MANAGER HOOK ====================
// Business logic for upload states
const useUploadManager = () => {
    const [uploadState, setUploadState] = React.useState(UPLOAD_STATES.IDLE);
    const [currentFile, setCurrentFile] = React.useState(null);
    const [progress, setProgress] = React.useState(0);
    const [processingTimeEstimate, setProcessingTimeEstimate] = React.useState(null);
    
    const uploadIntervalRef = React.useRef(null);
    const processingTimeoutRef = React.useRef(null);
  
    const startUpload = React.useCallback((file) => {
      setCurrentFile(file);
      setUploadState(UPLOAD_STATES.UPLOADING);
      setProgress(0);
      setProcessingTimeEstimate(null);
  
      // Simulate upload progress
      uploadIntervalRef.current = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 15 + 5; // Random increment 5-20%
          
          if (newProgress >= 100) {
            clearInterval(uploadIntervalRef.current);
            setUploadState(UPLOAD_STATES.SUCCESS);
            
            // Check if it's a "large file" that needs processing time
            const isLargeFile = file.size > 50 * 1024 * 1024; // 50MB threshold
            console.log("file size" + file.size)
            
            if (isLargeFile) {
              processingTimeoutRef.current = setTimeout(() => {
                setUploadState(UPLOAD_STATES.PROCESSING); // Change from PROCESSING to REPORT_READY
                setProcessingTimeEstimate("2-3 minutes");
              }, 150);
            }

            // Set a timeout to show the report card after upload success
            setTimeout(() => {
                setUploadState(UPLOAD_STATES.REPORT_READY); // Add this new state
            }, 200);
            
            return 100;
          }
          return newProgress;
        });
      }, 200);
    }, []);
  
    const cancelUpload = React.useCallback(() => {
      if (uploadIntervalRef.current) {
        clearInterval(uploadIntervalRef.current);
      }
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }
      
      setUploadState(UPLOAD_STATES.IDLE);
      setCurrentFile(null);
      setProgress(0);
      setProcessingTimeEstimate(null);
    }, []);
  
    // Cleanup on unmount
    React.useEffect(() => {
      return () => {
        if (uploadIntervalRef.current) clearInterval(uploadIntervalRef.current);
        if (processingTimeoutRef.current) clearTimeout(processingTimeoutRef.current);
      };
    }, []);
  
    return {
      uploadState,
      currentFile,
      progress,
      processingTimeEstimate,
      startUpload,
      cancelUpload,
      // Export the states for easy usage
      UPLOAD_STATES
    };
  };
  
  // Export the components and hook
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { UploadProgress, useUploadManager, UPLOAD_STATES };
}


// New separate component for the "Please wait" message
const ProcessingMessage = () => {
    return React.createElement('div', {
      className: 'bg-white border border-[#e5e3f7] rounded-[8px] p-4 w-full max-w-[552px]'
    }, [
      // Spinner section
      React.createElement('div', {
        key: 'spinner-section',
        className: 'flex items-center justify-center gap-2.5 mb-2.5 w-full'
      },
        React.createElement('div', {
          className: 'relative w-6 h-6'
        }, [
          // You can use a simple CSS spinner or Material Icon
          React.createElement(MaterialIcon, {
            key: 'spinner',
            name: 'refresh',
            size: 24,
            className: 'text-[#6a5acd] animate-spin'
          })
        ])
      ),
  
      // Main message
      React.createElement('div', {
        key: 'main-message',
        className: 'text-[#2d2a45] text-[14px] font-semibold text-center w-full mb-2.5',
        style: { fontFamily: 'Noto Sans', lineHeight: '21px' }
      }, 'Please wait we read your data!'),
  
      // Sub message
      React.createElement('div', {
        key: 'sub-message',
        className: 'text-[#5e5c7f] text-[13px] text-center w-full',
        style: { fontFamily: 'Noto Sans', lineHeight: '20px' }
      }, 'It could take a couple of seconds')
    ]);
};



// Drag and Drop Zone Component
// added uploadManager as function argument
const DragDropZone = ({ onFileSelect, uploadManager }) => {
    const [isDragOver, setIsDragOver] = React.useState(false);
    const [isFileDropping, setIsFileDropping] = React.useState(false);
    const fileInputRef = React.useRef(null);
  
    const handleDragEnter = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(true);
    };
  
    const handleDragLeave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!e.currentTarget.contains(e.relatedTarget)) {
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
      setIsDragOver(false);
      setIsFileDropping(true);
      
      const files = Array.from(e.dataTransfer.files);
      const validFiles = files.filter(file => 
        file.type === 'text/csv' || 
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      
      // Simulate drop animation delay
      setTimeout(() => {
        setIsFileDropping(false);
        if (validFiles.length > 0 && uploadManager) { //used to be onFileSelect here, now uploadManager
          // previously: onFileSelect(validFiles[0]);
          uploadManager.startUpload(validFiles[0]); // Now this will work
        }
      }, 800);
      //new stuff added for the progress bar
      if (validFiles.length > 0) {
        uploadManager.startUpload(validFiles[0]); // Start upload
      }
    };
  
    const handleBrowseClick = () => {
      fileInputRef.current?.click();
    };
  
    /*handleFileChange before progress bar
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file && onFileSelect) {
        onFileSelect(file);
      }
    };*/

    // Modify your existing handleFileChange in DragDropZone:
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && uploadManager) { //added && uploadManager
        uploadManager.startUpload(file); // Start the upload process
        }
    };
  
    return React.createElement('div', {
      className: 'bg-white p-3 rounded-[10px] w-[395px]',
      style: { border: '1px solid #f1f0fb' }
    }, [
      React.createElement('div', {
        key: 'drop-zone',
        className: `bg-[#f1f0fb] rounded-lg p-5 flex flex-col items-center justify-start gap-4 w-full relative ${
          isDragOver ? 'bg-[#e5e3f7]' : ''
        }`,
        style: { 
          border: isDragOver ? '3px dashed #6a5acd' : '3px dashed #ada2f0',
          transition: 'all 0.2s ease'
        },
        onDragEnter: handleDragEnter,
        onDragLeave: handleDragLeave,
        onDragOver: handleDragOver,
        onDrop: handleDrop
      }, [
        // Upload icon and text
        React.createElement('div', {
          key: 'content',
          className: 'flex flex-col items-center gap-3 w-full'
        }, [
          React.createElement(MaterialIcon, {
            key: 'upload-icon',
            name: 'file_upload',
            size: 32,
            className: 'text-[#6a5acd]'
          }),
          React.createElement('div', {
            key: 'title',
            className: 'text-[#2d2a45] text-[16px] font-bold text-center',
            style: { fontFamily: 'Noto Sans', lineHeight: '24px' }
          }, 'Please add your data')
        ]),
        
        React.createElement('div', {
          key: 'description',
          className: 'text-[#2d2a45] text-[13px] text-center w-full',
          style: { fontFamily: 'Noto Sans', lineHeight: '20px' }
        }, 'Drag and Drop your csv, pdf, xlsx file here'),
        
        // Browse button section
        React.createElement('div', {
          key: 'browse-section',
          className: 'flex flex-col items-center gap-2 w-full'
        }, [
          React.createElement('div', {
            key: 'or-text',
            className: 'text-[#2d2a45] text-[13px] text-center',
            style: { fontFamily: 'Noto Sans', lineHeight: '20px' }
          }, 'or'),
          React.createElement(QPushButton, {
            key: 'browse-button',
            onClick: handleBrowseClick,
            className: 'h-10'
          }, 'Browse File')
        ]),
        
        // Hidden file input
        React.createElement('input', {
          key: 'file-input',
          ref: fileInputRef,
          type: 'file',
          accept: '.csv,.pdf,.xlsx',
          style: { display: 'none' },
          onChange: handleFileChange
        }),
        
        // Animated file drop overlay
        ...(isFileDropping ? [
          React.createElement(AnimatedFileDropping, {
            key: 'animated-drop'
          })
        ] : [])
      ])
    ]);
  };
  
  // Animated File Dropping Component
  const AnimatedFileDropping = () => {
    return React.createElement('div', {
      className: 'absolute inset-0 flex items-center justify-center pointer-events-none',
      style: {
        animation: 'fadeIn 0.3s ease-in-out'
      }
    },
      React.createElement('div', {
        className: 'bg-white rounded-[40px] p-[10px] flex items-center justify-between gap-[68px] shadow-lg',
        style: {
          width: '273px',
          transform: 'rotate(-5.914deg)',
          animation: 'dropAnimation 0.8s ease-out',
          boxShadow: '0px 3px 10.4px 0px rgba(0,0,0,0.22)'
        }
      }, [
        React.createElement('div', {
          key: 'file-info',
          className: 'flex items-end gap-[7px] flex-1'
        }, [
          React.createElement(MaterialIcon, {
            key: 'file-icon',
            name: 'insert_drive_file',
            size: 24,
            className: 'text-[#2d2a45]'
          }),
          React.createElement('div', {
            key: 'filename',
            className: 'text-[#2d2a45] text-[11px] text-center whitespace-nowrap',
            style: { fontFamily: 'Noto Sans', lineHeight: '19.5px' }
          }, 'Coffee_profit.csv'),
          React.createElement('div', {
            key: 'filesize',
            className: 'text-[#5e5c7f] text-[12px] text-center whitespace-nowrap',
            style: { fontFamily: 'Noto Sans', lineHeight: '19.5px' }
          }, '100Kb')
        ]),
        React.createElement(MaterialIcon, {
          key: 'cancel-icon',
          name: 'cancel',
          size: 24,
          className: 'text-[#5e5c7f] cursor-pointer hover:text-red-500'
        })
      ])
    );
  };


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
