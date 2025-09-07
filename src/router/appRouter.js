const React = require('react');
const { useRouter } = require('./router.js');
const { WelcomePage } = require('../pages/welcomePage.js');
const { ProjectViewPage } = require('../pages/projectViewPage.js');

// Router Component
const AppRouter = () => {
  const { currentRoute, routeParams } = useRouter();
  
  const renderPage = () => {
    console.log('Rendering page for route:', currentRoute, 'with params:', routeParams);
    switch (currentRoute) {
      case 'welcome':
        return React.createElement(WelcomePage);
     /*  case 'projects':
        return React.createElement(ProjectsPage);
      case 'analytics':
        return React.createElement(AnalyticsPage);
      case 'settings':
        return React.createElement(SettingsPage); */
      case 'project-view':
        return React.createElement(ProjectViewPage, { 
          project: routeParams?.project 
        });
      default:
        return React.createElement(WelcomePage);
    }
  };
  
  return React.createElement('div', {
    className: 'relative top-14 bottom-14 left-0 right-0 overflow-auto',
    style: { padding: '24px' }
  }, renderPage());
};

module.exports = { AppRouter };