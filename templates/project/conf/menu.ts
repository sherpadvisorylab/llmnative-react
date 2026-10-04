import type { MenuConfig } from '@llmnative/react';
import HomePage from '../pages/home/HomePage';
import ProjectsPage from '../pages/projects/ProjectsPage';
import TasksPage from '../pages/tasks/TasksPage';
import TeamPage from '../pages/team/TeamPage';

export const menu: MenuConfig = {
    main: [
        { path: '/',         title: 'Overview',  icon: 'layout-dashboard', page: HomePage, end: true },
        { path: '/projects', title: 'Projects',  icon: 'folder-open',      page: ProjectsPage, group: 'Work' },
        { path: '/tasks',    title: 'Tasks',     icon: 'check-square',     page: TasksPage, group: 'Work' },
        { path: '/team',     title: 'Team',      icon: 'users',            page: TeamPage, group: 'Work' },
    ],
};
