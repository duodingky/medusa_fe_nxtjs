import { HttpTypes } from "@medusajs/types"
import { getPercentageDiff } from "./get-percentage-diff"
import { convertToLocale } from "./money"

const normalizeAmount = (amount: unknown) => {
  if (typeof amount === "number") {
    return amount
  }
  if (typeof amount === "string" && amount.trim() !== "") {
    const parsed = Number(amount)
    return Number.isNaN(parsed) ? null : parsed
  }
  return null
}

export const getFinalPriceAmount = (variant: any) => {
  if (!variant?.calculated_price) {
    return null
  }

  const rawFinalPrice =
    variant.calculated_price.final_price ?? variant.final_price
  const normalizedFinal = normalizeAmount(rawFinalPrice)

  return (
    normalizedFinal ?? normalizeAmount(variant.calculated_price.calculated_amount)
  )
}

const getOriginalPriceAmount = (variant: any, fallback: number) => {
  return normalizeAmount(variant?.calculated_price?.original_amount) ?? fallback
}

export const getPricesForVariant = (variant: any) => {
  if (!variant?.calculated_price) {
    return null
  }

  const finalAmount = getFinalPriceAmount(variant)
  if (finalAmount === null) {
    return null
  }

  const calculatedAmount =
    normalizeAmount(variant.calculated_price.calculated_amount) ?? finalAmount
  const originalAmount = getOriginalPriceAmount(variant, finalAmount)

  return {
    calculated_price_number: calculatedAmount,
    calculated_price: convertToLocale({
      amount: calculatedAmount,
      currency_code: variant.calculated_price.currency_code,
    }),
    final_price_number: finalAmount,
    final_price: convertToLocale({
      amount: finalAmount,
      currency_code: variant.calculated_price.currency_code,
    }),
    original_price_number: originalAmount,
    original_price: convertToLocale({
      amount: originalAmount,
      currency_code: variant.calculated_price.currency_code,
    }),
    currency_code: variant.calculated_price.currency_code,
    price_type:
      variant.calculated_price.calculated_price?.price_list_type ?? "default",
    percentage_diff: getPercentageDiff(originalAmount, finalAmount),
  }
}

export function getProductPrice({
  product,
  variantId,
}: {
  product: HttpTypes.StoreProduct
  variantId?: string
}) {
  if (!product || !product.id) {
    throw new Error("No product provided")
  }

  const cheapestPrice = () => {
    if (!product || !product.variants?.length) {
      return null
    }

    const cheapestVariant: any = product.variants
      .map((variant: any) => ({
        variant,
        finalAmount: getFinalPriceAmount(variant),
      }))
      .filter((entry: any) => entry.finalAmount !== null)
      .sort((a: any, b: any) => {
        return a.finalAmount - b.finalAmount
      })[0]?.variant

    return getPricesForVariant(cheapestVariant)
  }

  const variantPrice = () => {
    if (!product || !variantId) {
      return null
    }

    const variant: any = product.variants?.find(
      (v) => v.id === variantId || v.sku === variantId
    )

    if (!variant) {
      return null
    }

    return getPricesForVariant(variant)
  }

  return {
    product,
    cheapestPrice: cheapestPrice(),
    variantPrice: variantPrice(),
  }
}
