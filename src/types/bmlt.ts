export interface BMLTServerInfo {
  version: string;
  versionInt: string;
  langs: string;
  nativeLang: string;
  centerLongitude: string;
  centerLatitude: string;
  centerZoom: string;
  defaultDuration: string;
  regionBias: string;
  charSet: string;
  distanceUnits: string;
  semanticAdmin: string;
  emailEnabled: string;
  emailIncludesServiceBodies: string;
  changesPerMeeting: string;
  meeting_states_and_provinces: string;
  meeting_counties_and_sub_provinces: string;
  available_keys: string;
  google_api_key: string;
}

export interface BMLTMeeting {
  id_bigint: string;
  worldid_mixed: string;
  service_body_bigint: string;
  weekday_tinyint: string;
  venue_type: string;
  start_time: string;
  duration_time: string;
  time_zone: string;
  formats: string;
  lang_enum: string;
  longitude: string;
  latitude: string;
  comments: string;
  virtual_meeting_additional_info?: string;
  location_city_subsection: string;
  virtual_meeting_link?: string;
  phone_meeting_number?: string;
  location_nation: string;
  location_postal_code_1: string;
  location_province: string;
  location_sub_province?: string;
  location_municipality: string;
  location_neighborhood?: string;
  location_street: string;
  location_info?: string;
  location_text: string;
  meeting_name: string;
  bus_lines?: string;
  train_lines?: string;
  root_server_uri: string;
  format_shared_id_list: string;
}

export interface Meeting {
  id: string;
  name: string;
  serviceBodyId: string; // The immediate Service Body (Area)
  regionId: string;      // The parent Service Body (Region)
  day: number; // 0-6? BMLT says tinyint, usually 1=Sunday or similar. Need to verify.
  time: string;
  latitude: number;
  longitude: number;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  formats: string[];
  comments: string;
}

export interface BMLTServiceBody {
  id: string;
  parent_id: string;
  name: string;
  description: string;
  type: string;
  url: string;
}

export interface HomeGroup {
  name: string;
  slug: string;
  areaId: string; // The service body ID this group belongs to (inferred from first meeting)
  regionId: string; // The parent region ID
  meetings: Meeting[];
}
