import { useRef, useState } from "react";

/**
 * Drag-to-reorder for a list, by a handle. The handle is the only thing that
 * drags, so text in the row's inputs can still be selected; the whole row is
 * where it drops. `onMove(from, to)` receives indexes. Arrows stay beside it
 * for keyboards and phones.
 */
export function useDragReorder(onMove) {
  const from = useRef(null);
  const [over, setOver] = useState(null);

  const end = () => {
    from.current = null;
    setOver(null);
  };

  return {
    over,
    handleProps: (index) => ({
      draggable: true,
      onDragStart: (e) => {
        from.current = index;
        e.dataTransfer.effectAllowed = "move";
        const row = e.currentTarget.closest("[data-drag-row]");
        if (row) e.dataTransfer.setDragImage(row, 16, 16);
      },
      onDragEnd: end,
    }),
    rowProps: (index) => ({
      "data-drag-row": "",
      onDragOver: (e) => {
        if (from.current === null) return;
        e.preventDefault();
        setOver(index);
      },
      onDrop: (e) => {
        e.preventDefault();
        if (from.current !== null && from.current !== index) onMove(from.current, index);
        end();
      },
    }),
  };
}
