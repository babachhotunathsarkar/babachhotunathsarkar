// D:\Temple_New\Frontend\src\hooks\useAnalytics.js
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { trackClickEvent } from '../redux/analytics/analyticsSlice';

const getSessionId = () => {
    let sessionId = localStorage.getItem('analytics_session_id');
    if (!sessionId) {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
};

export const useAnalytics = () => {
    const dispatch = useDispatch();

    const trackClick = useCallback(async (elementId, metadata = {}) => {
        const clickData = {
            sessionId: getSessionId(),
            event: 'CLICK',
            path: window.location.pathname,
            elementId: elementId,
            metadata: {
                ...metadata,
                timestamp: new Date().toISOString()
            }
        };
        await dispatch(trackClickEvent(clickData));
    }, [dispatch]);

    const trackCustomEvent = useCallback(async (eventName, metadata = {}) => {
        const eventData = {
            sessionId: getSessionId(),
            event: eventName,
            path: window.location.pathname,
            elementId: null,
            metadata: {
                ...metadata,
                timestamp: new Date().toISOString()
            }
        };
        await dispatch(trackClickEvent(eventData));
    }, [dispatch]);

    return { trackClick, trackCustomEvent, getSessionId };
};

export default useAnalytics;