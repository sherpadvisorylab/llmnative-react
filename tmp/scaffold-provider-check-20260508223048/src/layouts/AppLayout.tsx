import React from 'react';

export default function AppLayout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-card">
        <div className="mx-auto flex h-14 max-w-5xl items-center px-6">
          <span className="font-semibold">scaffold-provider-check</span>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
    