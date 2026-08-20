import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { useAsyncData } from "../../../hooks/useAsyncData";
import { getTopBanner } from "../../../services/promotionsApi";

const ROTATE_MS = 4000;

export default function AnnouncementBar() {
  const { data: banner } = useAsyncData(getTopBanner, []);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!banner || banner.announcements.length < 2) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % banner.announcements.length),
      ROTATE_MS
    );
    return () => clearInterval(id);
  }, [banner]);

  if (!banner || banner.announcements.length === 0) return null;

  const message = banner.announcements[index % banner.announcements.length];

  return (
    <div className="bg-espresso text-ivory-50">
      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={index}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.25 }}
          className="px-4 py-2 text-center text-xs font-medium uppercase tracking-[0.18em]"
        >
          {message}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}