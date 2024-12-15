const pricePerToken = {
  // https://openai.com/api/pricing/
  "gpt-4o-mini": {
    promptToken: 0.15 / 1000000,
    completionToken: 0.6 / 1000000,
  },
}

export const calculatePrice = (model, tokenUsage) => {
  const modelPricing = pricePerToken[model]
  if (!modelPricing) return 0

  const promptCost = (tokenUsage.promptTokens || 0) * modelPricing.promptToken
  const completionCost =
    (tokenUsage.completionTokens || 0) * modelPricing.completionToken

  return promptCost + completionCost
}
