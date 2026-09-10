/** Placeholder while an existing product loads for editing. */
export default function FormSkeleton() {
  return (
    <div className="space-y-4" aria-hidden="true">
      <div className="skeleton h-4 w-32" />
      <div className="skeleton h-64 w-full" />
    </div>
  );
}
