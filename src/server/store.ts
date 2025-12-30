import { BMLT_ROOT_URL, normalizeMeeting, normalizeServerInfo } from "../services/bmlt";
import type { Meeting, BMLTMeeting, BMLTServerInfo, BMLTServiceBody, HomeGroup } from "../types/bmlt";
import { toSlug } from "../utils/slug";

// Singleton store for BMLT data
class BMLTStoreClass {
    private meetings: Meeting[] = [];
    private serviceBodies: BMLTServiceBody[] = [];
    private homeGroups: HomeGroup[] = [];
    private bodyMap: Map<string, BMLTServiceBody> = new Map();
    
    private lastSync: Date | null = null;
    private syncInterval: ReturnType<typeof setInterval> | null = null;
    private isInitialized = false;
    private initPromise: Promise<void> | null = null;

    // Helper to enrich meeting with Region ID
    private enrichMeeting(meeting: Meeting): Meeting {
        const area = this.bodyMap.get(meeting.serviceBodyId);
        if (area) {
            const region = this.bodyMap.get(area.parent_id);
            if (region) {
                meeting.regionId = region.id;
            }
        }
        return meeting;
    }

    // Fetch data from BMLT
    private async fetchData(): Promise<void> {
        console.log('[BMLTStore] Fetching fresh data from BMLT...');
        
        try {
            // Fetch Service Bodies
            const bodiesUrl = `${BMLT_ROOT_URL}?switcher=GetServiceBodies`;
            const bodiesResponse = await fetch(bodiesUrl);
            if (!bodiesResponse.ok) throw new Error('Failed to fetch service bodies');
            this.serviceBodies = await bodiesResponse.json();
            this.bodyMap = new Map(this.serviceBodies.map(b => [b.id, b]));

            // Fetch Meetings
            const meetingsUrl = `${BMLT_ROOT_URL}?switcher=GetSearchResults`;
            const meetingsResponse = await fetch(meetingsUrl);
            if (!meetingsResponse.ok) throw new Error('Failed to fetch meetings');
            const rawMeetings: BMLTMeeting[] = await meetingsResponse.json();
            
            // Normalize and enrich
            this.meetings = rawMeetings.map(m => this.enrichMeeting(normalizeMeeting(m)));

            // Generate homegroups
            const groups: Record<string, HomeGroup> = {};
            this.meetings.forEach(meeting => {
                const name = meeting.name;
                if (!groups[name]) {
                    groups[name] = {
                        name,
                        slug: toSlug(name),
                        areaId: meeting.serviceBodyId,
                        regionId: meeting.regionId,
                        meetings: []
                    };
                }
                groups[name].meetings.push(meeting);
            });
            this.homeGroups = Object.values(groups).sort((a, b) => a.name.localeCompare(b.name));

            this.lastSync = new Date();
            console.log(`[BMLTStore] Sync complete. ${this.meetings.length} meetings, ${this.serviceBodies.length} service bodies, ${this.homeGroups.length} homegroups`);
        } catch (error) {
            console.error('[BMLTStore] Sync failed:', error);
            throw error;
        }
    }

    // Check for changes using GetChanges endpoint
    private async checkForChanges(): Promise<boolean> {
        if (!this.lastSync) return true; // First sync

        try {
            const startDate = this.lastSync.toISOString().split('T')[0]; // YYYY-MM-DD format
            const changesUrl = `${BMLT_ROOT_URL}?switcher=GetChanges&start_date=${startDate}`;
            const response = await fetch(changesUrl);
            
            if (!response.ok) {
                console.error('[BMLTStore] Failed to check changes, will sync anyway');
                return true;
            }

            const changes = await response.json();
            const hasChanges = Array.isArray(changes) && changes.length > 0;
            
            console.log(`[BMLTStore] Changes check: ${hasChanges ? 'Changes detected' : 'No changes'}`);
            return hasChanges;
        } catch (error) {
            console.error('[BMLTStore] Error checking changes:', error);
            return true; // On error, sync to be safe
        }
    }

    // Polling function
    private async poll(): Promise<void> {
        console.log('[BMLTStore] Polling for changes...');
        const hasChanges = await this.checkForChanges();
        
        if (hasChanges) {
            await this.fetchData();
        }
    }

    // Initialize the store
    async initialize(): Promise<void> {
        if (this.isInitialized) return;
        if (this.initPromise) return this.initPromise;

        this.initPromise = (async () => {
            console.log('[BMLTStore] Initializing...');
            
            // Initial sync
            await this.fetchData();

            // Start polling every 15 minutes (900000ms)
            this.syncInterval = setInterval(() => {
                this.poll().catch(err => console.error('[BMLTStore] Poll error:', err));
            }, 15 * 60 * 1000);

            this.isInitialized = true;
            console.log('[BMLTStore] Initialization complete. Polling every 15 minutes.');
        })();

        return this.initPromise;
    }

    // Ensure initialized (lazy init)
    async ensureInitialized(): Promise<void> {
        if (!this.isInitialized) {
            await this.initialize();
        }
    }

    // Public getters
    async getMeetings(): Promise<Meeting[]> {
        await this.ensureInitialized();
        return this.meetings;
    }

    async getServiceBodies(): Promise<BMLTServiceBody[]> {
        await this.ensureInitialized();
        return this.serviceBodies;
    }

    async getHomeGroups(): Promise<HomeGroup[]> {
        await this.ensureInitialized();
        return this.homeGroups;
    }

    async getServerInfo(): Promise<BMLTServerInfo> {
        // ServerInfo doesn't change often, just fetch directly
        const url = `${BMLT_ROOT_URL}?switcher=GetServerInfo`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch server info');
        const data = await response.json();
        return normalizeServerInfo(data[0]);
    }
}

// Export singleton instance
export const BMLTStore = new BMLTStoreClass();
