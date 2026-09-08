/**
 * MEDDET Public Medical REST API Router (v1)
 * Developer API Engine for External App & Web Integration with Rate Limiting Protection
 */

import {
  searchMedicines,
  getMedicineById,
  getGenericById,
  getAlternativeBrands,
  getAllBrandsForGeneric,
  getDatabaseStats
} from '../data/dbEngine';

export interface ApiResponse<T = any> {
  success: boolean;
  status: number;
  timestamp: string;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

// In-Memory Rate Limiter (60 requests per minute per IP/Client)
const requestTracker = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(clientId: string = 'global_client'): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  const maxRequests = 60; // Max 60 requests per minute

  // Periodically clean up expired entries to prevent memory leak
  if (requestTracker.size > 100) {
    for (const [key, data] of requestTracker) {
      if (now > data.resetTime) {
        requestTracker.delete(key);
      }
    }
  }

  const clientData = requestTracker.get(clientId) || { count: 0, resetTime: now + windowMs };

  if (now > clientData.resetTime) {
    clientData.count = 1;
    clientData.resetTime = now + windowMs;
  } else {
    clientData.count += 1;
  }

  requestTracker.set(clientId, clientData);

  if (clientData.count > maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  return { allowed: true, remaining: maxRequests - clientData.count };
}

export function handlePublicApiRequest(path: string, searchParams: URLSearchParams, clientId?: string): ApiResponse {
  const timestamp = new Date().toISOString();

  // 1. Rate Limit Enforcement
  const rateCheck = checkRateLimit(clientId || 'client_ip');
  if (!rateCheck.allowed) {
    return {
      success: false,
      status: 429,
      timestamp,
      error: 'Rate limit exceeded: 429 Too Many Requests. Maximum 60 requests per minute allowed to protect server resources.'
    };
  }

  // Normalize endpoint path (e.g., /api/v1/search)
  const cleanPath = path.replace(/^\/api\/v1\/?/, '').toLowerCase();

  try {
    // 2. GET /api/v1/search?q=Napa&form=Tablet&page=1&limit=20
    if (cleanPath.startsWith('search')) {
      const q = searchParams.get('q') || '';
      const category = searchParams.get('category') || 'All';
      const dosageForm = searchParams.get('form') || searchParams.get('dosageForm') || 'All';
      const manufacturer = searchParams.get('company') || searchParams.get('manufacturer') || 'All';
      const page = parseInt(searchParams.get('page') || '1', 10);
      const limit = parseInt(searchParams.get('limit') || '20', 10);
      const sortBy = (searchParams.get('sortBy') as any) || 'relevance';

      const res = searchMedicines(
        q,
        'All',
        { category, dosageForm, manufacturer, maxPrice: 0, sortBy },
        page,
        limit
      );

      return {
        success: true,
        status: 200,
        timestamp,
        data: res.items,
        pagination: {
          page: res.page,
          pageSize: limit,
          totalItems: res.total,
          totalPages: res.totalPages
        }
      };
    }

    // 3. GET /api/v1/medicines/:id
    if (cleanPath.startsWith('medicines/')) {
      const idStr = cleanPath.replace('medicines/', '');
      const id = parseInt(idStr, 10);

      if (isNaN(id)) {
        return { success: false, status: 400, timestamp, error: 'Invalid medicine ID' };
      }

      const med = getMedicineById(id);
      if (!med) {
        return { success: false, status: 404, timestamp, error: 'Medicine not found' };
      }

      return {
        success: true,
        status: 200,
        timestamp,
        data: med
      };
    }

    // 4. GET /api/v1/alternatives?genericId=123&form=Tablet
    if (cleanPath.startsWith('alternatives')) {
      const genericIdStr = searchParams.get('genericId') || searchParams.get('generic_id');
      const dosageForm = searchParams.get('form') || searchParams.get('dosageForm') || undefined;

      if (!genericIdStr || isNaN(parseInt(genericIdStr, 10))) {
        return { success: false, status: 400, timestamp, error: 'Missing or invalid genericId query parameter' };
      }

      const genericId = parseInt(genericIdStr, 10);
      const alternatives = getAlternativeBrands(genericId, undefined, dosageForm);

      return {
        success: true,
        status: 200,
        timestamp,
        data: alternatives,
        pagination: {
          page: 1,
          pageSize: alternatives.length,
          totalItems: alternatives.length,
          totalPages: 1
        }
      };
    }

    // 5. GET /api/v1/generics/:id
    if (cleanPath.startsWith('generics/')) {
      const genericIdStr = cleanPath.replace('generics/', '');
      const genericId = parseInt(genericIdStr, 10);

      if (isNaN(genericId)) {
        return { success: false, status: 400, timestamp, error: 'Invalid generic ID' };
      }

      const generic = getGenericById(genericId);
      const brands = getAllBrandsForGeneric(genericId);

      if (!generic && brands.length === 0) {
        return { success: false, status: 404, timestamp, error: 'Generic not found' };
      }

      return {
        success: true,
        status: 200,
        timestamp,
        data: {
          generic,
          brandCount: brands.length,
          brands
        }
      };
    }

    // 6. GET /api/v1/stats
    if (cleanPath.startsWith('stats')) {
      const stats = getDatabaseStats();
      return {
        success: true,
        status: 200,
        timestamp,
        data: stats
      };
    }

    // Unknown endpoint
    return {
      success: false,
      status: 404,
      timestamp,
      error: `Unknown API endpoint: ${path}. Available endpoints: /api/v1/search, /api/v1/medicines/:id, /api/v1/alternatives, /api/v1/generics/:id, /api/v1/stats`
    };

  } catch (err: any) {
    return {
      success: false,
      status: 500,
      timestamp,
      error: err?.message || 'Internal Server Error'
    };
  }
}
