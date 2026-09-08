import { useCurrency } from "../../context/CurrencyContext";
import { useLanguage } from "../../context/LanguageContext";
import { CURRENCY_SYMBOLS } from "../../utils/formatCurrency";
import DropdownPill from "./DropdownPill";

/**
 * Header currency switcher, paired with LanguageSelector.
 *
 * Shows the ISO 4217 code rather than the symbol. A bare "$" is ambiguous
 * across USD, CAD and AUD, and "€" told the shopper nothing they could not
 * already read off the prices.
 */
export default function CurrencySelector({ iconOnly = false, align = "right" }) {
  const { currency, setCurrency, currencies, symbol } = useCurrency();
  const { t } = useLanguage();

  return (
    <DropdownPill
      ariaLabel={t("common.currency", "Currency")}
      icon={
        <span className="text-base font-medium tabular-nums" aria-hidden="true">
          {symbol}
        </span>
      }
      label={currency}
      variant={iconOnly ? undefined : "code"}
      iconOnly={iconOnly}
      align={align}
      activeCode={currency}
      onSelect={setCurrency}
      options={currencies.map((code) => ({
        code,
        display: code,
        meta: CURRENCY_SYMBOLS[code],
      }))}
    />
  );
}
