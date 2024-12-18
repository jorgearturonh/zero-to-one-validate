# Zero to One Validator - Idea Benchmark API

Zero to One Validator is an application that helps evaluate startup ideas through the lens of Peter Thiel's book Zero to One. Instead of focusing on traditional idea of competition, this project encourages users to think about innovation through the lens of building something truly unique—moving from "zero" (creating something new) to "one" (establishing a groundbreaking solution).

## Features

- **Idea Submission**: Users can submit their startup ideas through the API
- **Automated Analysis**: The system performs a comprehensive analysis of the submitted idea using AI and web scraping techniques.
- **Real-time Progress** Tracking: Users can view the progress of their idea analysis in real-time.
- **Detailed Results**: The platform provides a detailed breakdown of search results, competitor analysis, and market insights.
- **Final Analysis**: A summary of the idea's uniqueness, potential, and recommendations is generated.

![Analysis Process](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-LRdvqNo5ww1Gc08UFz03mJxNbdVUfE.png)

## Tech Stack

**Server:** Node, Express, Langchain, Mongoose

## Project setup:

In order to run the project you will need:

- [OpenAI API Key](https://platform.openai.com/api-keys)
- [Serper API Key](https://serper.dev/)
- [MongoDB enviroment](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-community-with-docker/)
- [Node v20](https://nodejs.org/en/download/package-manager)

### Environment Variables

To run this project, you will need to create a .env file with the following basic configuration:

```
MONGO_URI=
CLIENT_ORIGIN=
SERPER_API_KEY=
MAX_AMOUNT_OF_SEARCH_QUERIES=
OPENAI_API_KEY=
```

If you want to use Azure OpenAI environment use these extra variables:

```
AZURE_OPENAI_API_ENDPOINT=
AZURE_OPENAI_API_KEY=
AZURE_OPENAI_API_DEPLOYMENT_NAME=
AZURE_OPENAI_API_INSTANCE_NAME=
AZURE_OPENAI_API_INSTANCE_REGION=
AZURE_OPENAI_API_VERSION=
AZURE_MODE_ENABLED=true
```

If you want to receive an stream with the live updates use this variable, note this will disable normal HTTP responses

`STREAM_MODE_ENABLED=true`

If you want to disable verbose mode add

`DISABLE_VERBOSE=true`

You can modify the max amount of queries to be generated by AI with (this will spend more Serper API tokens)

`MAX_AMOUNT_OF_SEARCH_QUERIES=10`

### Running the Project

Make sure to use Node v20 you can install directly from [Node website](https://nodejs.org/en/download/package-manager), or use [Node Version Manager](https://github.com/nvm-sh/nvm)

```bash
nvm use 20
```

Clone the project

```bash
  git clone https://github.com/jorgearturonh/zero-to-one-validate
```

Go to the project directory

```bash
  cd zero-to-one-validate
```

Install dependencies

```bash
npm i
```

Start the server

```bash
npm run start
```

## Test the API

Once your environment is set you can test the API with this CURL call:

```
curl -X POST http://localhost:3001 \
     -H "Content-Type: application/json" \
     -d '{"input": "I want to create an app that searches for possible competitors on a specific idea, following the Zero to One principles from the Peter Thiel book. This app uses generative AI models and search automation. This app has a open-source backend that allows founders to safely share their ideas. "}'
```

You should start to see the results on your console.

## Usage recommendations

When describing your project idea, it's recommended to input:

- Key differentiating features that make your solution unique
- Technical aspects (e.g. if you use AI, blockchain, or other advanced technologies)
- How users will interact with your solution (web app, mobile, API, etc.)
- Your target market and specific user pain points you're addressing
- Any competitive advantages or barriers to entry
- Revenue model or monetization strategy

## Acknowledgements

- [Get the book on Amazon](https://amzn.to/4if0BtR)

## Feedback

If you have any feedback, please reach out to me me@jorgearturo.dev

## License

[The Unlicense](https://unlicense.org)
