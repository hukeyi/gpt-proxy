var express = require('express');
var router = express.Router();

const { getFriendResponse } = require('../controllers/friendChat');

router.post('/', function (req, res, next) {
	return res.status(404).json({
		message: 'Wrong api url. ',
	});
});
router.post('/friend', async function (req, res, next) {
	// Client needs to send the whole dialogue text to server
	// "You: Hi!\nFriend:" <-- send like this
	// "Hi!" <-x- not like this
	try {
		if (!req.body || !req.body.prompt) {
			return res.status(400).json({
				message: 'Missing parameters in req. ',
			});
		}
		const prompt = req.body.prompt.trim();
		const response = await getFriendResponse(prompt);
		const output = response.data.choices[0].text.trim();
		return res.status(200).json({
			output,
		});
	} catch (err) {
		// // reach the token length limit
		// // inform the front-end, make it refresh
		// // or seal the dialog box(or input)
		// if (err && err.reachLimit === true) {
		// 	return res.status(200).json({
		// 		message: err.message,
		// 	});
		// } else {
		console.log(err);
		return res.status(500).json({
			message: '服务器异常，请稍后',
		});
	}
});

module.exports = router;
