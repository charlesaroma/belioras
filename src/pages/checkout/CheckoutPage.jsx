/* Page: Checkout - CheckoutPage */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Lock, ShoppingBag } from "lucide-react";

import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import PageShell from "../../components/layout/PageShell";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useContentVersion } from "../../context/ContentContext";
import { useToast } from "../../context/ToastContext";
import { useAsyncData } from "../../hooks/useAsyncData";
import { useScopedStorage } from "../../hooks/useScopedStorage";
import { createOrder } from "../../services/ordersApi";
import { getProducts } from "../../services/productsApi";
import { getSettings } from "../../services/settingsApi";
import { computeTotals, nonReturnableItems } from "../../utils/checkout";
import DeliveryForm from "./sections/DeliveryForm";
import OrderSummary from "./sections/OrderSummary";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { items, clear } = useCart();
  const version = useContentVersion();

  const { data: settings } = useAsyncData(getSettings, [version]);
  const { data: catalog } = useAsyncData(getProducts, []);
  const [savedAddresses] = useScopedStorage("belioras:addresses", [], user?.id);

  const [coupon, setCoupon] = useState(null);
  const [placing, setPlacing] = useState(false);

  const defaultAddress = savedAddresses.find((a) => a.isDefault) ?? savedAddresses[0] ?? null;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name ?? defaultAddress?.recipient ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      line1: defaultAddress?.line1 ?? "",
      city: defaultAddress?.city ?? "",
      postcode: defaultAddress?.postcode ?? "",
      country: defaultAddress?.country ?? "Portugal",
    },
  });

  const country = watch("country");
  const totals = computeTotals({ items, country, coupon, settings });
  const nonReturnable = nonReturnableItems(items, catalog ?? []);

  const useSaved = (address) => {
    setValue("name", address.recipient ?? "", { shouldValidate: true });
    setValue("line1", address.line1 ?? "", { shouldValidate: true });
    setValue("city", address.city ?? "", { shouldValidate: true });
    setValue("postcode", address.postcode ?? "", { shouldValidate: true });
    setValue("country", address.country ?? "", { shouldValidate: true });
  };

  const placeOrder = async (values) => {
    setPlacing(true);
    try {
      const order = await createOrder({
        userId: user?.id ?? null,
        email: values.email.trim().toLowerCase(),
        name: values.name.trim(),
        phone: values.phone?.trim() || null,
        items: items.map((i) => ({
          productId: i.id,
          slug: i.slug,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          size: i.size ?? null,
          color: i.color ?? null,
        })),
        subtotal: totals.subtotal,
        discount: totals.discount,
        shipping: totals.shipping,
        tax: totals.tax,
        total: totals.total,
        couponCode: coupon?.code ?? null,
        shippingAddress: [values.line1, values.city, values.postcode, values.country]
          .filter(Boolean)
          .join(", "),
      });

      clear();
      toast(`Order ${order.id} placed.`, "success");

      // Signed in, they can follow it in their account; a guest gets the
      // reference on a confirmation page, since it is the only way they will
      // find this order again.
      navigate(user ? `/account/orders/${order.id}` : `/checkout/confirmed/${order.id}`, {
        replace: true,
        state: { email: order.email },
      });
    } catch (err) {
      toast(err.message ?? "Could not place that order.", "error");
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <PageShell eyebrow="Checkout" title="Your bag is empty" width="wide">
        <EmptyState
          icon={ShoppingBag}
          title="Nothing to check out"
          description="Add a piece to your bag and it will appear here."
          action={{ label: "Browse the collection", to: "/shop" }}
        />
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow="Checkout"
      title="Complete your order"
      intro="Delivery details, then confirmation. Nothing is charged on this page."
      width="wide"
    >
      <form
        onSubmit={handleSubmit(placeOrder)}
        className="grid gap-8 lg:grid-cols-[1fr_380px] lg:gap-12"
      >
        <div className="space-y-6">
          <DeliveryForm
            register={register}
            errors={errors}
            savedAddresses={savedAddresses}
            onUseSaved={useSaved}
            signedIn={Boolean(user)}
          />

          {/*
            Payment is not connected. Saying so here, above the button, is the
            difference between a customer who knows what happens next and one
            who thinks they have paid.
          */}
          <section className="border-l-2 border-gold-500 py-4 pl-5">
            <p className="flex items-center gap-2 text-[13px] font-medium text-espresso">
              <Lock className="size-4 text-gold-700" aria-hidden="true" />
              Card payment is not live yet
            </p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-espresso-soft">
              Your order is recorded as awaiting payment and we will email you to arrange it.
              Nothing is charged now, and no card details are collected on this page.
            </p>
          </section>

          {/* EU withdrawal rights allow 14 days to change your mind, with a
              lawful exception for hygiene-sealed goods. The exception only
              holds if the customer was told before buying. */}
          {nonReturnable.length > 0 && (
            <section className="border border-umber-50 px-5 py-4">
              <p className="text-[13px] font-medium text-espresso">
                {nonReturnable.length === 1 ? "One piece is" : `${nonReturnable.length} pieces are`}{" "}
                non-returnable
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-espresso-soft">
                {nonReturnable.map((i) => i.name).join(", ")} — hair is sealed for hygiene and
                cannot be returned once opened. Your 14-day right to withdraw applies to
                everything else in this order.
              </p>
            </section>
          )}

          <div className="flex flex-wrap items-center gap-4">
            <Button type="submit" size="lg" loading={placing}>
              Place order
            </Button>
            <p className="text-[12px] text-espresso-soft">
              By ordering you accept our{" "}
              <a href="/terms-of-service" className="text-gold-700 underline underline-offset-4">
                terms
              </a>{" "}
              and{" "}
              <a href="/return-and-refund-policy" className="text-gold-700 underline underline-offset-4">
                returns policy
              </a>
              .
            </p>
          </div>
        </div>

        <OrderSummary
          items={items}
          totals={totals}
          coupon={coupon}
          onCoupon={setCoupon}
          disabled={placing}
        />
      </form>
    </PageShell>
  );
}
