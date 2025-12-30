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

// Helper to enrich meeting with Region ID
function enrichMeeting(meeting: Meeting, bodyMap: Map<string, BMLTServiceBody>) {
    const area = bodyMap.get(meeting.serviceBodyId);
    if (area) {
        // meeting.areaId is already meeting.serviceBodyId
        // Find Region (Parent)
        const region = bodyMap.get(area.parent_id);
        if (region) {
            meeting.regionId = region.id;
        }
    }
    return meeting;
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
  // 1. Fetch Bodies for enrichment
  const bodiesUrl = `${BMLT_ROOT_URL}?switcher=GetServiceBodies`;
  const bodiesData = await fetchJsonCached<BMLTServiceBody[]>(bodiesUrl, 3600);
  const bodyMap = new Map(bodiesData.map(b => [b.id, b]));

  // 2. Fetch Meetings
  const url = `${BMLT_ROOT_URL}?switcher=GetSearchResults`;
  const data = await fetchJsonCached<BMLTMeeting[]>(url, 600);
  
  return data.map(m => enrichMeeting(normalizeMeeting(m), bodyMap));
}, "getMeetings");

export const getServiceBodies = query(async () => {
    "use server";
    const url = `${BMLT_ROOT_URL}?switcher=GetServiceBodies`;
    // Cache Service Bodies for 1 hour
    const data = await fetchJsonCached<BMLTServiceBody[]>(url, 3600);
    return data;
}, "getServiceBodies");

export const getHomeGroups = query(async (areaId?: string) => {
    "use server";
    
    // 1. Fetch Bodies for enrichment
    const bodiesUrl = `${BMLT_ROOT_URL}?switcher=GetServiceBodies`;
    const bodiesData = await fetchJsonCached<BMLTServiceBody[]>(bodiesUrl, 3600);
    const bodyMap = new Map(bodiesData.map(b => [b.id, b]));

    // 2. Fetch Meetings
    const url = `${BMLT_ROOT_URL}?switcher=GetSearchResults`;
    const data = await fetchJsonCached<BMLTMeeting[]>(url, 600);
    const meetings = data.map(m => enrichMeeting(normalizeMeeting(m), bodyMap));

    // 3. Group by Name to form "Homegroups"
    const groups: Record<string, HomeGroup> = {};

    meetings.forEach((meeting) => {
        const name = meeting.name;
        if (!groups[name]) {
            groups[name] = {
                name: name,
                slug: toSlug(name),
                areaId: meeting.serviceBodyId, // Capture Area from first meeting
                regionId: meeting.regionId,   // Capture Region from first meeting
                meetings: []
            };
        }
        groups[name].meetings.push(meeting);
    });

    return Object.values(groups).sort((a, b) => a.name.localeCompare(b.name));
}, "getHomeGroups");
