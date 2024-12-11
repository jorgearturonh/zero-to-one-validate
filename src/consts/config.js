import dotenv from "dotenv"

dotenv.config()
export const corsOptions = {
  origin: [process.env.CLIENT_ORIGIN],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Access-Control-Allow-Origin",
  ],
}

export const chatOpenAiConfig = {
  ...((process.env.AZURE_MODE_ENABLED && {
    azureOpenAIEndpoint: process.env.AZURE_OPENAI_API_ENDPOINT,
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
    azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME,
    azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME,
    region: process.env.AZURE_OPENAI_API_INSTANCE_REGION,
  }) || {
    apiKey: process.env.OPENAI_API_KEY,
    model: "gpt-4o-mini",
  }),
}

export const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}
