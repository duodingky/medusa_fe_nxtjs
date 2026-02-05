import { getPercentageDiff } from "@lib/util/get-percentage-diff"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"

type LineItemPriceProps = {
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

const LineItemPrice = ({
  item,
  style = "default",
  currencyCode,
}: LineItemPriceProps) => {
  const quantity = item.quantity || 1
  const variantCalculatedPrice = (item.variant as any)?.calculated_price
  const variantFinalAmount = toAmount(variantCalculatedPrice?.final_price)
  const variantOriginalAmount = toAmount(variantCalculatedPrice?.original_amount)

  const fallbackTotal = item.total ?? 0
  const currentPrice =
    (item as any).final_total ??
    (variantFinalAmount != null ? variantFinalAmount * quantity : null) ??
    fallbackTotal
  const originalPrice =
    (item as any).final_original_total ??
    (variantOriginalAmount != null ? variantOriginalAmount * quantity : null) ??
    item.original_total ??
    currentPrice
  const hasReducedPrice = currentPrice < originalPrice

  return (
    <div className="flex flex-col gap-x-2 text-ui-fg-subtle items-end">
      <div className="text-left">
        {hasReducedPrice && (
          <>
            <p>
              {style === "default" && (
                <span className="text-ui-fg-subtle">Original: </span>
              )}
              <span
                className="line-through text-ui-fg-muted"
                data-testid="product-original-price"
              >
                {convertToLocale({
                  amount: originalPrice,
                  currency_code: currencyCode,
                })}
              </span>
            </p>
            {style === "default" && (
              <span className="text-ui-fg-interactive">
                -{getPercentageDiff(originalPrice, currentPrice || 0)}%
              </span>
            )}
          </>
        )}
        <span
          className={clx("text-base-regular", {
            "text-ui-fg-interactive": hasReducedPrice,
          })}
          data-testid="product-price"
        >
          {convertToLocale({
            amount: currentPrice,
            currency_code: currencyCode,
          })}
        </span>
      </div>
    </div>
  )
}

export default LineItemPrice
