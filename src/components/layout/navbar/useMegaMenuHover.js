/* Mega Menu Hover Intent */
import { useCallback, useEffect, useRef, useState } from "react";

// A grace period on leave, so crossing the gap between a trigger and its panel
// does not close the menu underneath the pointer.
const CLOSE_DELAY_MS = 160;

export function useMegaMenuHover() {
  const [menuId, setMenuId] = useState(null);
  const closeTimer = useRef(null);

  const openMenu = useCallback((id, toggle = true) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMenuId((prev) => (toggle && prev === id ? null : id));
  }, []);

  const scheduleClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMenuId(null), CLOSE_DELAY_MS);
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  return { menuId, setMenuId, openMenu, scheduleClose, cancelClose };
}
