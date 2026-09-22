import { createContext } from "react";

/**
 * The place in the page header where a page may put its main action
 * ("Add product"). DashboardLayout provides the element; DashHeaderActions
 * renders into it.
 */
export const HeaderSlotContext = createContext(null);
