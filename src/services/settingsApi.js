import settingsSeed from "../data/settings.json";

import { mockApi } from "./apiClient";

export function getSettings() {
  return mockApi(() => JSON.parse(JSON.stringify(settingsSeed)));
}