import { query } from "@solidjs/router";
import { BMLTStore } from "./store";

export const getServerInfo = query(async () => {
  "use server";
  return await BMLTStore.getServerInfo();
}, "getServerInfo");

export const getMeetings = query(async () => {
  "use server";
  return await BMLTStore.getMeetings();
}, "getMeetings");

export const getServiceBodies = query(async () => {
    "use server";
    return await BMLTStore.getServiceBodies();
}, "getServiceBodies");

export const getHomeGroups = query(async (areaId?: string) => {
    "use server";
    return await BMLTStore.getHomeGroups();
}, "getHomeGroups");
