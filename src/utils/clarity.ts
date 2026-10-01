import Clarity from '@microsoft/clarity';

export const CLARITY_PROJECT_ID =
  (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.VITE_CLARITY_PROJECT_ID) ||
  'ypwmkzk0th';

let isInitialized = false;

/**
 * Initialize Microsoft Clarity Behavioral Analytics
 */
export function initClarity(projectId: string = CLARITY_PROJECT_ID): void {
  if (typeof window === 'undefined' || isInitialized) {
    return;
  }

  try {
    Clarity.init(projectId);
    isInitialized = true;
  } catch (error) {
    console.warn('[Clarity] Initialization failed or blocked:', error);
  }
}

/**
 * Set custom tag for Clarity session filtering
 */
export function setClarityTag(key: string, value: string | string[]): void {
  try {
    if (typeof window !== 'undefined') {
      Clarity.setTag(key, value);
    }
  } catch {}
}

/**
 * Send custom event to Microsoft Clarity
 */
export function trackClarityEvent(eventName: string): void {
  try {
    if (typeof window !== 'undefined') {
      Clarity.event(eventName);
    }
  } catch {}
}

/**
 * Identify a user in Clarity
 */
export function identifyClarityUser(
  customId: string,
  customSessionId?: string,
  customPageId?: string,
  friendlyName?: string
): void {
  try {
    if (typeof window !== 'undefined') {
      Clarity.identify(customId, customSessionId, customPageId, friendlyName);
    }
  } catch {}
}

export { Clarity };
export default Clarity;
