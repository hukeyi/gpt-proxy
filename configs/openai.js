const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});

if (!configuration.apiKey) {
	throw new Error('OpenAI API key not configured.');
}

const openai = new OpenAIApi(configuration);

module.exports = {
	openai,
};
