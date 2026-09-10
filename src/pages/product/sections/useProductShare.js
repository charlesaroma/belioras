/* Share Handler */
import { useLanguage } from "../../../context/LanguageContext";
import { useToast } from "../../../context/ToastContext";

// The Web Share sheet where the browser offers one, the clipboard otherwise.
export function useProductShare(product) {
  const { toast } = useToast();
  const { t } = useLanguage();

  return async () => {
    const url = window.location.href;
    const payload = { title: product.name, text: product.description, url };

    if (navigator.share && navigator.canShare?.(payload) !== false) {
      try {
        await navigator.share(payload);
      } catch {
        // Dismissing the sheet rejects; that is not an error worth surfacing.
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      toast(t("pdp.linkCopied", "Link copied to clipboard."), "success");
    } catch {
      toast(t("pdp.linkCopyFailed", "Could not copy the link."), "error");
    }
  };
}
