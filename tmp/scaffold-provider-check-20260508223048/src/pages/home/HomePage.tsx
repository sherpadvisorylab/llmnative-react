import React from 'react';
import PageHeader from '../../components/PageHeader';
import TasksSection from '../../sections/home/TasksSection';

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-6 py-10">
      <PageHeader
        title="Welcome to scaffold-provider-check"
        description="This Vite app was scaffolded with LLM Native using App-managed theme, icon and provider configuration."
      />
      <TasksSection />
    </div>
  );
}
    
