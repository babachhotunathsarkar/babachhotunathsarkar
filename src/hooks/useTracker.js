// D:\Temple_New\Frontend\src\hooks\useTracker.js
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAnalytics } from './useAnalytics';

const useTracker = () => {
    const location = useLocation();
    const { trackCustomEvent } = useAnalytics();

    useEffect(() => {
        // Track page view on route change
        trackCustomEvent('PAGE_VIEW', {
            page: location.pathname,
            title: document.title
        });
    }, [location, trackCustomEvent]);
};

export default useTracker;