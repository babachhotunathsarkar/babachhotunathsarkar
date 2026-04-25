// D:\Temple_New\Frontend\src\utils\analytics.js
import { store } from '../redux/store'; // Import your store directly
import { trackClickEvent } from '../redux/analytics/analyticsSlice';

const getSessionId = () => {
    let sessionId = localStorage.getItem('analytics_session_id');
    if (!sessionId) {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
};

export const trackClick = async (elementId, metadata = {}) => {
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
    await store.dispatch(trackClickEvent(clickData));
};

export const trackCustomEvent = async (eventName, metadata = {}) => {
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
    await store.dispatch(trackClickEvent(eventData));
};

export const analytics = {
    trackClick,
    trackCustomEvent,
    getSessionId
};

export default analytics;