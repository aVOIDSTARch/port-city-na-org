import type { BMLTMeeting, Meeting, BMLTServerInfo } from "../types/bmlt";

export const BMLT_ROOT_URL = "https://bmlt.sezf.org/main_server/client_interface/json/";

export const normalizeMeeting = (bmltMeeting: BMLTMeeting): Meeting => {
  return {
    id: bmltMeeting.id_bigint,
    name: bmltMeeting.meeting_name,
    serviceBodyId: bmltMeeting.service_body_bigint,
    regionId: "0", // Will be populated by server enrichment
    day: parseInt(bmltMeeting.weekday_tinyint, 10),
    time: bmltMeeting.start_time,
    latitude: parseFloat(bmltMeeting.latitude),
    longitude: parseFloat(bmltMeeting.longitude),
    street: bmltMeeting.location_street,
    city: bmltMeeting.location_municipality,
    province: bmltMeeting.location_province,
    postalCode: bmltMeeting.location_postal_code_1,
    formats: bmltMeeting.formats.split(",").map((f) => f.trim()),
    comments: bmltMeeting.comments,
  };
};

export const normalizeServerInfo = (info: any): BMLTServerInfo => {
    // Basic validation or casting
    return info as BMLTServerInfo;
}
