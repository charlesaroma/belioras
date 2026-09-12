/* Application Providers */
import { ContentProvider } from "@/context/ContentContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { ProductDraftProvider } from "@/context/ProductDraftContext";
import { ToastProvider } from "@/context/ToastContext";
import ToastViewport from "@/components/ui/ToastViewport";

// These sit above BrowserRouter on purpose, so navigating away cannot unmount
// an in-progress product draft.
export default function AppProviders({ children }) {
  return (
    <ContentProvider>
      <LanguageProvider>
        <CurrencyProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <ProductDraftProvider>
                  <ToastProvider>
                    {children}
                    {/* The render half of the toast system. Without it the
                        provider held state and ran timers while nothing was
                        drawn, so every toast() call was a silent no-op. Uses
                        no router hooks, so it is safe out here. */}
                    <ToastViewport />
                  </ToastProvider>
                </ProductDraftProvider>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </CurrencyProvider>
      </LanguageProvider>
    </ContentProvider>
  );
}
