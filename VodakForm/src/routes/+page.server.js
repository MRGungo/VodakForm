import {getSession, validateSession} from '$lib/sessionStore.js';

export async function load({request}) {
    const cookies = request.headers.get('cookie') || '';
    const sessionId = parseCookie(cookies, 'session_id');
    const session = await getSession(sessionId);

    if (!session || !validateSession(session)) {
        return {props: {userId: null}}
    }
    return {
        props: {
            userId:session.userId
        }
    };
}
function parseCookie(cookieHeader, name) {
    const value = `; ${cookieHeader}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}