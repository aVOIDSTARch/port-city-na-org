import { BMLT_ROOT_URL, normalizeMeeting, normalizeServerInfo } from "../services/bmlt";
import type { Meeting, BMLTMeeting, BMLTServerInfo, BMLTServiceBody, HomeGroup } from "../types/bmlt";
import { query } from "@solidjs/router";
import { toSlug } from "../utils/slug";

// Simple in-memory cache
const cache = new Map<string, { data: any; expiry: number }>();

// Helper to fetch JSON with caching
async function fetchJsonCached<T>(url: string, ttlSeconds: number = 600): Promise<T> {
  const now = Date.now();
  const cached = cache.get(url);

  if (cached && cached.expiry > now) {
    return cached.data as T;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }
  const data = await response.json();
  
  cache.set(url, { data, expiry: now + ttlSeconds * 1000 });
  return data as T;
}

// Helper for uncached if needed (or just use cached with 0 ttl? let's keep simple)
async function fetchJson<T>(url: string): Promise<T> {
    return fetchJsonCached(url, 0); 
}

export const getServerInfo = query(async () => {
  "use server";
  const url = `${BMLT_ROOT_URL}?switcher=GetServerInfo`;
  // Cache Server Info for 1 hour (3600s)
  const data = await fetchJsonCached<BMLTServerInfo[]>(url, 3600);
  return normalizeServerInfo(data[0]);
}, "getServerInfo");

export const getMeetings = query(async () => {
  "use server";
  const url = `${BMLT_ROOT_URL}?switcher=GetSearchResults`;
  // Cache Meetings for 10 minutes (600s)
  const data = await fetchJsonCached<BMLTMeeting[]>(url, 600);
  return data.map(normalizeMeeting);
}, "getMeetings");

export const getServiceBodies = query(async () => {
    "use server";
    const url = `${BMLT_ROOT_URL}?switcher=GetServiceBodies`;
    // Cache Service Bodies for 1 hour
    const data = await fetchJsonCached<BMLTServiceBody[]>(url, 3600);
    // BMLT returns all, we might want to filter or organize them later. 
    // For now, return the raw list.
    return data;
}, "getServiceBodies");

export const getHomeGroups = query(async (areaId?: string) => {
    "use server";
    // Reuse cached meetings if possible, or just hit the cache url
    const url = `${BMLT_ROOT_URL}?switcher=GetSearchResults`;
    const data = await fetchJsonCached<BMLTMeeting[]>(url, 600);
    const meetings = data.map(normalizeMeeting);

    // 2. Group by Name to form "Homegroups"
    const groups: Record<string, HomeGroup> = {};

    meetings.forEach((meeting, index) => {
        // Warning: BMLT meetings are singular events. We group by exact meeting name.
        // This might need Fuzzy matching in the future, but exact name is standard convention.
        const name = meeting.name;
        if (!groups[name]) {
            // Find the original BMLT object to get service_body_bigint if possible.
            // But we already normalized it. We might need to add service_body_id to Meeting interface if we really need it.
            // For now, let's assume we can pass area filtering later.
            
            groups[name] = {
                name: name,
                slug: toSlug(name),
                areaId: "0", // Accessing this from normalized data would require updating Meeting interface. Skip for MVP Preview.
                meetings: []
            };
        }
        groups[name].meetings.push(meeting);
    });

    return Object.values(groups).sort((a, b) => a.name.localeCompare(b.name));
}, "getHomeGroups");
