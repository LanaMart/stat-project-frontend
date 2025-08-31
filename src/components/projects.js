const React = require('react');
const { useDialog } = require('./dialog.js');



// list of projects in expanded state
const ProjectsList = ({ projects, selectedProject, onProjectSelect }) => {
    const { showDialog } = useDialog(); // Add this line

    return React.createElement('div', {
      className: 'flex flex-col gap-[3px] w-full overflow-y-auto max-h-[200px]'
    }, 
      projects.map((project, index) => 
        React.createElement('div', {
          key: index,
          className: `flex items-center justify-between p-2.5 rounded-lg cursor-pointer ${
            selectedProject === project ? 'bg-violet-50' : 'hover:bg-gray-50'
          }`
        }, [
          React.createElement('div', {
            key: 'content',
            className: 'flex items-center gap-2 flex-1',
            onClick: () => onProjectSelect(project)
          }, [
            React.createElement(MaterialIcon, {
              key: 'folder',
              name: 'folder_open',
              className: selectedProject === project ? 'text-[#2d2a45]' : 'text-[#5e5c7f]'
            }),
            React.createElement('span', {
              key: 'name',
              className: `text-[13px] ${selectedProject === project ? 'text-[#2d2a45]' : 'text-[#5e5c7f]'}`,
              style: { fontFamily: 'Noto Sans', lineHeight: '20px' }
            }, project)
          ]),
          React.createElement(MaterialIcon, {
            key: 'delete',
            name: 'delete',
            className: 'text-[#5e5c7f] hover:text-red-500 cursor-pointer',
            //onClick: () => onProjectDelete(project)
            onClick: (e) => {
                e.stopPropagation();
                showDialog({
                  projectName: project,
                  onConfirm: () => console.log('Delete:', project)
                });
              }
          })
        ])
      )
    );
  };


//toggle project list show/hide
const MyLastProjectsSection = () => {
    const [isExpanded, setIsExpanded] = React.useState(false);
    const [selectedProject, setSelectedProject] = React.useState(null);
    const [projects] = React.useState([
      'Old project',
      'Very old shit', 
      'Oldiiii pro',
      'Project number 4',
      'My data analysis',
      'Sales report 2024'
    ]);
  
    const handleProjectDelete = (projectToDelete) => {
      // Handle delete logic here
      console.log('Delete project:', projectToDelete);
    };
  
    return React.createElement('div', {
      className: 'flex flex-col gap-[3px] w-full'
    }, [
      // Header (always visible)
      React.createElement('div', {
        key: 'header',
        className: 'flex items-center justify-between px-2.5 py-2 cursor-pointer',
        onClick: () => setIsExpanded(!isExpanded)
      }, [
        React.createElement('div', {
          key: 'label',
          className: 'text-[#8a7bea] text-[11px] font-normal',
          style: { fontFamily: 'Noto Sans', lineHeight: '19.5px' }
        }, 'MY LAST PROJECTS'),
        React.createElement(MaterialIcon, {
          key: 'arrow',
          name: isExpanded ? 'keyboard_arrow_down' : 'keyboard_arrow_right',
          className: 'text-[#8a7bea]'
        })
      ]),
      
      // Expanded content
      ...(isExpanded ? [
        React.createElement(ProjectsList, {
          key: 'projects-list',
          projects: projects,
          selectedProject: selectedProject,
          onProjectSelect: setSelectedProject,
          onProjectDelete: handleProjectDelete
        })
      ] : [])
    ]);
  };



module.exports = {
    MyLastProjectsSection
};