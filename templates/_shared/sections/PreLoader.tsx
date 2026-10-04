import React, { useEffect, useState } from 'react';
import { Loader } from '@llmnative/react';

export default function PreLoader() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 400);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Loader
            show={loading}
            minHeight="100vh"
            wrapperClassName="fixed inset-0 z-[9999]"
            className="bg-background"
        >
            <div />
        </Loader>
    );
}
