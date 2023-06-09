/**
 * Friend Chat
 * example from: https://platform.openai.com/examples/default-friend-chat
 */
const { openai } = require('../configs/openai');

// model options
const options = {
	model: 'text-davinci-003',
	prompt: '',
	temperature: 0.5,
	max_tokens: 60,
	top_p: 1.0,
	frequency_penalty: 0.5,
	presence_penalty: 0.0,
	stop: ['You:'],
};
let prePrompt = ''; // previous prompt in current dialog session
let max_length = 300; // max length for prePrompt

/**
 * See if `prompt` has exceeded the limit of 300
 * @param {*} prompt current prompt text
 * @param {*} limit limitation for prompt
 * @returns
 */
function checkTokenLength(prompt, limit) {
	return prompt.length <= limit;
}

function clearPrompt() {
	prePrompt = '';
	options.prompt = '';
}

/**
 * Set the complete prompt for a whole dialog session
 * @param {*} prompt user's latest text
 */
function setPrompt(prompt) {
	if (prePrompt.length > 0) prePrompt += '\n';

	options.prompt = prePrompt + 'You: ' + prompt.trim() + '\nFriend:';
	prePrompt = options.prompt;
}

/**
 * Try to get response from gpt model "Friend Chat"
 * @param {*} prompt user's latest text, e.g. "Hi!"
 * @returns response from "Friend Chat"
 */
async function getFriendResponseByLatestText(prompt) {
	setPrompt(prompt);

	if (!checkTokenLength(options.prompt, max_length)) {
		clearPrompt();
		return Promise.reject({
			message: '已达到 Tokens 长度限制，请开启新对话。',
			reachLimit: true,
		});
	}

	return await openai.createCompletion(options);
}

/**
 * Try to get response from gpt model "Friend Chat"
 * @param {*} prompt the whole dialogue text, e.g. "You: Hi!\nFriend:Hello!\nYou: Hi!\nFriend:"
 * @returns response from "Friend Chat"
 */
async function getFriendResponse(prompt) {
	prompt = prompt.trim();
	if (prompt.length < 7 || prompt.substring(prompt.length - 7) != 'Friend:') {
		console.log(prompt);
		console.log(prompt.substring(prompt.length - 7));
		return Promise.reject({
			message: 'Wrong format for prompt. ',
		});
	}

	options.prompt = prompt;
	return await openai.createCompletion(options);
}

module.exports = {
	getFriendResponse,
	getFriendResponseByLatestText,
};
