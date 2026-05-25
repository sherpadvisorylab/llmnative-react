import type { MenuConfig } from '@llmnative/react';
import Default from '../layouts/Default';
import HomePage from '../pages/home/HomePage';
import ProjectsPage from '../pages/projects/ProjectsPage';
import TasksPage from '../pages/tasks/TasksPage';
import TeamPage from '../pages/team/TeamPage';

export const menu: MenuConfig = {
    main: [
        { path: '/',         title: 'Overview',  icon: 'layout-dashboard', page: HomePage,    layout: Default, end: true },
        { path: '/projects', title: 'Projects',  icon: 'folder-open',      page: ProjectsPage,layout: Default, group: 'Work' },
        { path: '/tasks',    title: 'Tasks',     icon: 'check-square',     page: TasksPage,   layout: Default, group: 'Work' },
        { path: '/team',     title: 'Team',      icon: 'users',            page: TeamPage,    layout: Default, group: 'Work' },
    ],
};
