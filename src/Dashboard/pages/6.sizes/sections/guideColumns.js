/** Column definitions for GuideRowsEditor, one per table a size guide holds. */

export const GARMENT_COLUMNS = [
  { key: "size", label: "Size", type: "text" },
  { key: "bust", label: "Bust (cm)", type: "range" },
  { key: "waist", label: "Waist (cm)", type: "range" },
  { key: "hip", label: "Hip (cm)", type: "range" },
];

export const INTERNATIONAL_COLUMNS = [
  { key: "size", label: "Size", type: "text" },
  { key: "us", label: "US", type: "text" },
  { key: "uk", label: "UK", type: "text" },
  { key: "eu", label: "EU", type: "text" },
  { key: "aus", label: "AUS", type: "text" },
  { key: "tr", label: "Türkiye", type: "text" },
];

export const FOOTWEAR_COLUMNS = [
  { key: "eu", label: "EU", type: "number" },
  { key: "uk", label: "UK", type: "number" },
  { key: "us", label: "US", type: "number" },
  { key: "cm", label: "Foot length (cm)", type: "number" },
];

export const HAIR_LENGTH_COLUMNS = [
  { key: "in", label: "Length (in)", type: "number" },
  { key: "falls", label: "Falls at", type: "text" },
  { key: "note", label: "Note", type: "text" },
];

export const HAIR_TEXTURE_COLUMNS = [
  { key: "name", label: "Texture", type: "text" },
  { key: "note", label: "How it wears", type: "text" },
];

export const HOW_TO_COLUMNS = [
  { key: "term", label: "Term", type: "text" },
  { key: "text", label: "Instruction", type: "textarea" },
];
