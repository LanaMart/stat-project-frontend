const React = require('react');
const { MaterialIcon } = require("../button.js");

// Header Component
const Header = () => {
  return React.createElement('div', {
    className: 'absolute top-0 left-0 w-full h-14 bg-[#f1f0fb] border-b border-[#e5e3f7] rounded-t-lg flex items-center gap-4 px-4 drag-region',
    style: { zIndex: 20 }
  }, [
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
  ]);
};

module.exports = { Header };