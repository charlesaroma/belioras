import Button from "../../../../components/ui/Button";

/** Appears only once rows are ticked; publishing or drafting many at once. */
export default function BulkActionsBar({ count, onSetStatus, onClear }) {
  if (count === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-3 border border-gold-500/40 bg-gold-500/5 px-4 py-3">
      <p className="text-[12px] text-espresso">{count} selected</p>
      <div className="ml-auto flex gap-2">
        <Button size="sm" variant="secondary" onClick={() => onSetStatus("active")}>
          Publish
        </Button>
        <Button size="sm" variant="secondary" onClick={() => onSetStatus("draft")}>
          Move to draft
        </Button>
        <Button size="sm" variant="ghost" onClick={onClear}>
          Clear
        </Button>
      </div>
    </div>
  );
}
