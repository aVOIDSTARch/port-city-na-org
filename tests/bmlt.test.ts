import { describe, it, expect } from "vitest";
import { normalizeMeeting } from "../src/services/bmlt";
import type { BMLTMeeting } from "../src/types/bmlt";

describe("BMLT Service", () => {
  it("normalizes a valid BMLT meeting", () => {
    const mockBMLTMeeting: BMLTMeeting = {
      id_bigint: "123",
      meeting_name: "Test Meeting",
      weekday_tinyint: "1", // Sunday?
      start_time: "19:00:00",
      latitude: "34.0",
      longitude: "-78.0",
      location_street: "123 Main St",
      location_municipality: "Port City",
      location_province: "NC",
      location_postal_code_1: "28401",
      formats: "O, D, WC",
      comments: "Open discussion",
      worldid_mixed: "test",
      service_body_bigint: "1",
      venue_type: "1",
      duration_time: "01:00",
      time_zone: "America/New_York",
      lang_enum: "en",
      location_city_subsection: "",
      location_nation: "USA",
      location_text: "Center",
      root_server_uri: "http://test.com",
      format_shared_id_list: "",
    };

    const meeting = normalizeMeeting(mockBMLTMeeting);

    expect(meeting.id).toBe("123");
    expect(meeting.name).toBe("Test Meeting");
    expect(meeting.day).toBe(1);
    expect(meeting.time).toBe("19:00:00");
    expect(meeting.latitude).toBe(34.0);
    expect(meeting.longitude).toBe(-78.0);
    expect(meeting.formats).toEqual(["O", "D", "WC"]);
  });
});
