import { useId, useState } from "react";

import { useAsyncData } from "../../../hooks/useAsyncData";
import { getSizeCharts } from "../../../services/sizeChartApi";
import { useMeasurementUnit } from "./useMeasurementUnit";
import { sizeChartTabsFor } from "./sizeChartKind";
import SizeChartTabs from "./SizeChartTabs";
import SizeChartBodyTable from "./SizeChartBodyTable";
import SizeChartInternational from "./SizeChartInternational";
import SizeChartShoeTable from "./SizeChartShoeTable";
import { SizeChartHairLengths, SizeChartHairTextures } from "./SizeChartHairTable";
import SizeChartHowTo from "./SizeChartHowTo";

/**
 * The size reference, in whichever form the product needs.
 *
 * One implementation renders in three places — the product page's modal and
 * both standalone guides — so a measurement cannot say one thing on a product
 * and another on /shoe-size-guide, which is exactly what it used to do.
 *
 * `kind` is "garment", "footwear" or "hair"; see sizeChartKind.js.
 */
export default function SizeChart({ kind = "garment" }) {
  const { data: charts, loading } = useAsyncData(getSizeCharts, []);
  const tabs = sizeChartTabsFor(kind);
  const [active, setActive] = useState(tabs[0].id);
  const { unit, setUnit } = useMeasurementUnit();
  const idBase = useId();

  if (loading || !charts) {
    return (
      <div className="space-y-3" aria-hidden="true">
        <div className="skeleton h-9 w-64" />
        <div className="skeleton h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SizeChartTabs tabs={tabs} active={active} onChange={setActive} idBase={idBase} />

      <div
        role="tabpanel"
        id={`${idBase}-panel-${active}`}
        aria-labelledby={`${idBase}-tab-${active}`}
        tabIndex={0}
      >
        {active === "body" && (
          <SizeChartBodyTable garment={charts.garment} unit={unit} onUnitChange={setUnit} />
        )}
        {active === "international" && (
          <SizeChartInternational international={charts.international} />
        )}
        {active === "foot" && (
          <SizeChartShoeTable footwear={charts.footwear} unit={unit} onUnitChange={setUnit} />
        )}
        {active === "length" && (
          <SizeChartHairLengths hair={charts.hair} unit={unit} onUnitChange={setUnit} />
        )}
        {active === "texture" && <SizeChartHairTextures hair={charts.hair} />}
        {active === "measure" && (
          <SizeChartHowTo
            steps={charts.howToMeasure[kind] ?? charts.howToMeasure.garment}
            // The body figure explains a garment measurement. It says nothing
            // useful about a foot or a weft, so those kinds get the steps alone.
            showFigure={kind === "garment"}
          />
        )}
      </div>
    </div>
  );
}
