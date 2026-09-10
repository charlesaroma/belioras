/** The editorial images that sit beside the link columns on desktop. */
export default function MenuTiles({ tiles, editor }) {
  if (!tiles?.length) return null;

  return (
    <section className="border border-umber-50 p-4">
      <p className="input-label">Feature tiles</p>
      <ul className="grid gap-3 sm:grid-cols-2">
        {tiles.map((tile) => (
          <li key={tile.id} className="flex gap-3">
            <img
              src={tile.image}
              alt=""
              className="size-16 shrink-0 border border-umber-50 object-cover"
            />
            <div className="min-w-0 flex-1 space-y-1.5">
              <input
                value={tile.title}
                onChange={(e) => editor.patchTile(tile.id, { title: e.target.value })}
                aria-label="Tile title"
                className="input w-full py-1.5 text-[13px]"
              />
              <input
                value={tile.url}
                onChange={(e) => editor.patchTile(tile.id, { url: e.target.value })}
                aria-label="Tile path"
                className="input w-full py-1.5 font-mono text-[12px]"
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
