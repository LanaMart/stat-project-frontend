const React = require('react');
const { MyLastProjectsSection } = require('./projects.js');


const StatBridgeLogo = () => {
    return React.createElement('img', {
      src: '/Users/eli/Repo/gui/electron/assets/images/logo.png',
      alt: 'StatBridge Logo',
      className: 'w-[55%] mx-auto object-contain rounded-lg'
    });
  };


const Sidebar = ({ isOpen, onToggle }) => {
    const [projectName, setProjectName] = React.useState('');
  
    return React.createElement('div', {
      className: `absolute top-14 h-screen bg-white p-[10px] flex flex-col gap-5 ${
        isOpen ? 'w-[220px]' : 'w-[65px] overflow-hidden'
      }`,
      style: { border: '1px solid #f1f0fb' }
    }, [
      // Toggle Button
      React.createElement('div', {
        key: 'toggle',
        className: 'bg-white h-[30px] flex items-center justify-end px-2.5 rounded cursor-pointer sidebar-toggle',
        onClick: onToggle
      }, 
        React.createElement(MaterialIcon, {
          name: isOpen ? 'menu_open' : 'menu',
          className: 'text-gray-700'
        })
      ),
  
      // Sidebar Content (only show when open)
      ...(isOpen ? [
        // Logo Section
        React.createElement('div', {
          key: 'header',
          className: 'flex flex-col gap-[5px] pb-[5px]'
        }, [
          React.createElement(StatBridgeLogo, { key: 'logo' }),
          React.createElement('div', {
            key: 'tagline',
            className: 'text-[#5e5c7f] text-[16px] font-semibold leading-6 text-center w-4/5 mx-auto',
            style: { fontFamily: 'Noto Sans' }
          }, 'Where Business meets Data')
        ]),
  
        // Project Section
        React.createElement('div', {
          key: 'projects',
          className: 'flex flex-col gap-4'
        }, [
          React.createElement('div', {
            key: 'content',
            className: 'flex flex-col gap-2.5'
          }, [
            // Project Input
            React.createElement('div', {
              key: 'input-wrapper',
              className: 'flex flex-col gap-[3px] w-full'
            },
              React.createElement('div', {
                className: 'project-input flex items-center justify-between px-2.5 py-4 rounded border border-[#e5e3f7] bg-white cursor-text'
              }, [
                React.createElement('input', {
                  key: 'input',
                  type: 'text',
                  placeholder: 'Create new project',
                  value: projectName,
                  onChange: (e) => setProjectName(e.target.value),
                  className: 'flex-1 bg-transparent outline-none text-[13px] text-[rgba(94,92,127,0.51)] placeholder-[rgba(94,92,127,0.51)]',
                  style: { fontFamily: 'Noto Sans', lineHeight: '20px' }
                }),
                React.createElement(MaterialIcon, {
                  key: 'edit-icon',
                  name: 'edit',
                  className: 'text-[#6a5acd]'
                })
              ])
            ),
  
            // Save Button
            React.createElement('div', {
              key: 'button-container',
              className: 'flex justify-center w-full'
            },
            React.createElement(QPushButton, { onClick: () => {
              if (projectName.trim()) {
              alert(`Project "${projectName}" saved!`);
              setProjectName('');
              }
              } }, [
              React.createElement(MaterialIcon, { key: 'check-icon', name: 'check', size: 20, className: 'text-[#ebfaff]' }),
              React.createElement('span', { key: 'text' }, 'Save')
          ])//end of save button
  
            )
          ])
        ]),
  
        // My Last Projects Section  
        /*
        React.createElement('div', {
          key: 'last-projects',
          className: 'flex items-center justify-between px-2.5'
        }, [
          React.createElement('div', {
            key: 'label',
            className: 'text-[#8a7bea] text-[11px] font-normal',
            style: { fontFamily: 'Noto Sans', lineHeight: '19.5px' }
          }, 'MY LAST PROJECTS'),
          React.createElement(MaterialIcon, {
            key: 'arrow',
            name: 'keyboard_arrow_right', 
            className: 'text-[#8a7bea]'
          })
        ])
        // end section */
        React.createElement(MyLastProjectsSection, { key: 'my-last-projects' })
      ] : [React.createElement(QPushButtonWithPlus)])
    ]);
};


module.exports = {
    Sidebar
};