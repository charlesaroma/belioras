/* Admin Dashboard: DashHeaderActions */
import { useContext } from "react";
import { createPortal } from "react-dom";

import { HeaderSlotContext } from "../lib/headerSlot";

/** Puts a page's main action in the page header, beside "View store". */
export default function DashHeaderActions({ children }) {
  const slot = useContext(HeaderSlotContext);
  return slot ? createPortal(children, slot) : null;
}
