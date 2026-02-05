import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type OrderSummaryProps = {
  order: HttpTypes.StoreOrder
}

const OrderSummary = ({ order }: OrderSummaryProps) => {
  const getAmount = (amount?: number | null) => {
    if (!amount) {
      return
    }

    return convertToLocale({
      amount,
      currency_code: order.currency_code,
    })
  }

  const finalSubtotal = (order as any).final_subtotal ?? order.subtotal
  const finalDiscountTotal =
    (order as any).final_discount_total ?? order.discount_total
  const finalGiftCardTotal =
    (order as any).final_gift_card_total ?? order.gift_card_total
  const finalShippingTotal =
    (order as any).final_shipping_total ?? order.shipping_total
  const finalTaxTotal = (order as any).final_tax_total ?? order.tax_total
  const finalTotal = (order as any).final_total ?? order.total

  return (
    <div>
      <h2 className="text-base-semi">Order Summary</h2>
      <div className="text-small-regular text-ui-fg-base my-2">
        <div className="flex items-center justify-between text-base-regular text-ui-fg-base mb-2">
          <span>Subtotal</span>
          <span>{getAmount(finalSubtotal)}</span>
        </div>
        <div className="flex flex-col gap-y-1">
          {finalDiscountTotal > 0 && (
            <div className="flex items-center justify-between">
              <span>Discount</span>
              <span>- {getAmount(finalDiscountTotal)}</span>
            </div>
          )}
          {finalGiftCardTotal > 0 && (
            <div className="flex items-center justify-between">
              <span>Discount</span>
              <span>- {getAmount(finalGiftCardTotal)}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span>Shipping</span>
            <span>{getAmount(finalShippingTotal)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Taxes</span>
            <span>{getAmount(finalTaxTotal)}</span>
          </div>
        </div>
        <div className="h-px w-full border-b border-gray-200 border-dashed my-4" />
        <div className="flex items-center justify-between text-base-regular text-ui-fg-base mb-2">
          <span>Total</span>
          <span>{getAmount(finalTotal)}</span>
        </div>
      </div>
    </div>
  )
}

export default OrderSummary
