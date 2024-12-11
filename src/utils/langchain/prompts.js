export const isUserIdeaAmibguousPrompt = `Discard ambiguous ideas that are not projects or startups. Results like "Aaaa" "Hello world" "Lolcats" or anything random that is not a project or startup.`
export const searchQueryCreationPrompt = `Create queries that help to find startups similar to the user idea, try find solutions or apps that match user input. Your main goal is to help the user to find similar startups or projects that matches his idea.`
export const queryValidateProjectOrCompanyPrompt = `
Validate if the search result is an startup project, software application, SaaS that may already exist.
Discard results that are not related to startups or projects.
Discard everything that is not a project, company, or startup.
Discard stuff thats to ideas discussion, blog posts, or anything that is not a project or company.`
export const finalAnalysisPrompt =
  "Analyze the results and give a final analysis, based on the uniqueness of the user idea. User Peter Thiel concepts book From Zero To One, to give user ideas, and think how unique it's on the market, encourage user to create new markets or new ideas, for example: Is this idea addressing a significant problem or unmet need?  Does it create something entirely new or improve exponentially upon existing solutions? How defensible and scalable is the proposed solution?. Also use your common sense, if a user inputs a very common idea, give a low uniqueness score, for example, if the user wants to create a search engine, with a new algorithm, give a low score, because it's a very common idea."
