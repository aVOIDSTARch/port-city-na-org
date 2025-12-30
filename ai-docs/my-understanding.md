# My Understanding of Port City NA

## Table of Contents

- [My Understanding of Port City NA](#my-understanding-of-port-city-na)
  - [Table of Contents](#table-of-contents)
  - [Project Overview](#project-overview)
  - [Key Requirements](#key-requirements)
    - [Functional](#functional)
    - [User Experience & Design](#user-experience--design)
    - [Technical Constraints](#technical-constraints)
  - [Desirable Upgrades](#desirable-upgrades)
  - [Appendix: Clarifying Questions](#appendix-clarifying-questions)

## Project Overview

The goal of this project is to build a high-quality, accessible, and
aesthetically pleasing website for Port City NA (and potentially other NA
regions). It aims to interface with BMLT (Basic Meeting List Toolbox) servers to
display meeting information, provide robust search capabilities, and offer
advanced scheduling/calendar features. The design philosophy centers on reducing
cognitive load and prioritizing accessibility.

## Key Requirements

### Functional

- **Universal BMLT Compatibility:** Must work with any BMLT server by
  configuring server info.
- **Homegroup Pages:** Dedicated pages for each homegroup with meeting cards and
  a mini-map.
- **Search:** A robust and efficient search page for meetings/groups.
- **Localization:** Store user preference for home location/area via cookies to
  auto-load relevant schedules.
- **Calendar Integration:**
  - Generate downloadable calendar event objects (Google, Outlook, Apple).
  - Subscription-based events/celebration calendars (filterable by structure
    level like Area/Region).
- **Mapping:** Use open usage map solutions (avoiding paid Google Maps if
  possible).

### User Experience & Design

- **Top-line Aesthetics:** High-quality visual design.
- **Accessibility First:** Compliance with a11y standards is a priority.
- **Cognitive Load Driven:**
  - Color-coded days of the week.
  - Strong visual hierarchy to emphasize important data.
  - Full ARIA support for screen readers.

### Technical Constraints

- **Data Source:** Must utilize `api-mapper` for backend data fetching.
- **Testing:** Vitest is the preferred testing framework.
- **Documentation:** Typedoc for TypeScript; Docs folder for HTML/CSS.

## Desirable Upgrades

- **Email Services:**
  - Daily calendar digests based on area.
  - Passwordless user creation/login via email codes.
- **Mobile Integration:** "Send to map app" feature for meeting locations.

## Decisions Made

### Data Fetching Strategy

- **Selected:** Option B (Server-Side / SolidStart Server Functions).
- **Reasoning:** Superior SEO, performance, and cache control aligned with
  "Top-line aesthetics" and robust search requirements.

## Decisions Pending

## Appendix: Clarifying Questions & Answers

1. **Tech Stack:** `project-ideas.ai` mentions `api-mapper` and "Universal
   BMLT".
   - _Answer:_ We will utilize the online documentation for the BMLT API.
     `api-mapper` likely refers to building a custom adapter to normalize this
     data.
2. **`api-mapper`:** Is `api-mapper` an existing internal library/service?
   - _Answer:_ No, likely a custom module we need to build based on BMLT docs.
3. **Current Codebase State:** Verified as a fresh SolidStart template.
4. **BMLT Details:** Do we have a specific BMLT server endpoint to test with
   initially?
   - _Answer:_ Yes,
     `https://bmlt.sezf.org/main_server/client_interface/json/?switcher=GetServerInfo`.
5. **Deployment:** Where will this be hosted?
   - _Answer:_ Not sure yet.
6. **Data Source:** Client vs Server?
   - _Answer:_ User requested Pros/Cons. (See Decisions Pending).
