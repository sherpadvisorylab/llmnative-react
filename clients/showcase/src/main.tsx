import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from 'react-firestrap';
import 'react-firestrap/dist/index.css';
import './globals.css';

import { ShowcaseThemeProvider } from './context/ThemeContext';
import ShowcaseLayout from './layout/ShowcaseLayout';
import menuConfig from './menu';

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { error: Error | null }> {
    constructor(props: any) {
        super(props);
        this.state = { error: null };
    }
    static getDerivedStateFromError(error: Error) { return { error }; }
    render() {
        if (this.state.error) {
            return (
                <div style={{ padding: 32, fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                    <h2>Runtime Error</h2>
                    <p><strong>{this.state.error.message}</strong></p>
                    <pre style={{ fontSize: 12 }}>{this.state.error.stack}</pre>
                </div>
            );
        }
        return this.props.children;
    }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <ErrorBoundary>
        <ShowcaseThemeProvider>
            <App
                menuConfig={menuConfig}
                importPage={() => Promise.resolve({ default: () => null })}
                LayoutDefault={ShowcaseLayout}
            />
        </ShowcaseThemeProvider>
    </ErrorBoundary>
);
