import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"

type LineItemUnitPriceProps = {
  item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem
  style?: "default" | "tight"
  currencyCode: string
}

const toAmount = (value: unknown) => {
  if (typeof value === "number") {
    return Number.isNaN(value) ? null : value
  }

  if (typeof value === "string" && value.trim() !== "") {
    let sanitized = value.trim()
    if (sanitized.includes(",") && sanitized.includes(".")) {
      sanitized = sanitized.replace(/,/g, "")
    } else if (sanitized.includes(",") && !sanitized.includes(".")) {
      sanitized = sanitized.replace(/,/g, ".")
    }

    sanitized = sanitized.replace(/[^0-9.-]/g, "")

    if (!sanitized || sanitized === "-" || sanitized === ".") {
      return null
    }

    const parsed = Number(sanitized)
    return Number.isNaN(parsed) ? null : parsed
  }

  return null
}

const LineItemUnitPrice = ({
  item,
  style = "default",
  currencyCode,
}: LineItemUnitPriceProps) => {
  const quantity = item.quantity || 1
  const variantCalculatedPrice = (item.variant as any)?.calculated_price
  const variantFinalAmount = toAmount(variantCalculatedPrice?.final_price)
  const variantOriginalAmount = toAmount(variantCalculatedPrice?.original_amount)

  const fallbackTotal = item.total ?? 0
  const totalPrice =
    (item as any).final_total ??
    (variantFinalAmount != null ? variantFinalAmount * quantity : null) ??
    fallbackTotal
  const originalTotalPrice =
    (item as any).final_original_total ??
    (variantOriginalAmount != null ? variantOriginalAmount * quantity : null) ??
    item.original_total ??
    totalPrice

  const unitPrice = totalPrice / quantity
  const originalUnitPrice = originalTotalPrice / quantity
  const hasReducedPrice = unitPrice < originalUnitPrice

  const percentage_diff =
    originalUnitPrice > 0
      ? Math.round(((originalUnitPrice - unitPrice) / originalUnitPrice) * 100)
      : 0

  return (
    <div className="flex flex-col text-ui-fg-muted justify-center h-full">
      {hasReducedPrice && (
        <>
          <p>
            {style === "default" && (
              <span className="text-ui-fg-muted">Original: </span>
            )}
            <span
              className="line-through"
              data-testid="product-unit-original-price"
            >
              {convertToLocale({
                amount: originalUnitPrice,
                currency_code: currencyCode,
              })}
            </span>
          </p>
          {style === "default" && (
            <span className="text-ui-fg-interactive">-{percentage_diff}%</span>
          )}
        </>
      )}
      <span
        className={clx("text-base-regular", {
          "text-ui-fg-interactive": hasReducedPrice,
        })}
        data-testid="product-unit-price"
      >
        {convertToLocale({
          amount: unitPrice,
          currency_code: currencyCode,
        })}
      </span>
    </div>
  )
}

export default LineItemUnitPrice
