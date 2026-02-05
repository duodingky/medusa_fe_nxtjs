"use client"

import { convertToLocale } from "@lib/util/money"
import React from "react"

type CartTotalsProps = {
  totals: {
    total?: number | null
    final_total?: number | null
    subtotal?: number | null
    final_subtotal?: number | null
    tax_total?: number | null
    final_tax_total?: number | null
    currency_code: string
    item_subtotal?: number | null
    final_item_subtotal?: number | null
    shipping_subtotal?: number | null
    final_shipping_subtotal?: number | null
    discount_subtotal?: number | null
    final_discount_subtotal?: number | null
  }
}

const CartTotals: React.FC<CartTotalsProps> = ({ totals }) => {
  const {
    currency_code,
    total,
    final_total,
    tax_total,
    final_tax_total,
    item_subtotal,
    final_item_subtotal,
    shipping_subtotal,
    final_shipping_subtotal,
    discount_subtotal,
    final_discount_subtotal,
    final_subtotal,
  } = totals

  const displayItemSubtotal =
    final_item_subtotal ?? final_subtotal ?? item_subtotal ?? 0
  const displayShippingSubtotal =
    final_shipping_subtotal ?? shipping_subtotal ?? 0
  const displayDiscountSubtotal =
    final_discount_subtotal ?? discount_subtotal ?? 0
  const displayTaxTotal = final_tax_total ?? tax_total ?? 0
  const displayTotal = final_total ?? total ?? 0

  return (
    <div>
      <div className="flex flex-col gap-y-2 txt-medium text-ui-fg-subtle ">
        <div className="flex items-center justify-between">
          <span>Subtotal (excl. shipping and taxes)</span>
          <span data-testid="cart-subtotal" data-value={displayItemSubtotal}>
            {convertToLocale({
              amount: displayItemSubtotal,
              currency_code,
            })}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Shipping</span>
          <span
            data-testid="cart-shipping"
            data-value={displayShippingSubtotal}
          >
            {convertToLocale({
              amount: displayShippingSubtotal,
              currency_code,
            })}
          </span>
        </div>
        {!!displayDiscountSubtotal && (
          <div className="flex items-center justify-between">
            <span>Discount</span>
            <span
              className="text-ui-fg-interactive"
              data-testid="cart-discount"
              data-value={displayDiscountSubtotal}
            >
              -{" "}
              {convertToLocale({
                amount: displayDiscountSubtotal,
                currency_code,
              })}
            </span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="flex gap-x-1 items-center ">Taxes</span>
          <span data-testid="cart-taxes" data-value={displayTaxTotal}>
            {convertToLocale({
              amount: displayTaxTotal,
              currency_code,
            })}
          </span>
        </div>
      </div>
      <div className="h-px w-full border-b border-gray-200 my-4" />
      <div className="flex items-center justify-between text-ui-fg-base mb-2 txt-medium ">
        <span>Total</span>
        <span
          className="txt-xlarge-plus"
          data-testid="cart-total"
          data-value={displayTotal}
        >
          {convertToLocale({ amount: displayTotal, currency_code })}
        </span>
      </div>
      <div className="h-px w-full border-b border-gray-200 mt-4" />
    </div>
  )
}

export default CartTotals
