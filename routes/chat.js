var express = require('express');
var router = express.Router();

const { getFriendResponse } = require('../controllers/friendChat');

router.post('/', async function (req, res, next) {
	// front-end only send the latest text from user, without 'You: '
	try {
		if (!req.body || !req.body.prompt) {
			return res.status(405);
		}
		const prompt = req.body.prompt.trim();
		const response = await getFriendResponse(prompt);
		// gpt model's response
		const output = response.data.choices[0].text;
		return res.status(200).json({
			output,
		});
	} catch (err) {
		// reach the token length limit
		// inform the front-end, make it refresh
		// or seal the dialog box(or input)
		if (err && err.reachLimit === true) {
			return res.status(200).json({
				message: err.message,
			});
		} else {
			// some errors happend
			console.log(err);
			return res.status(500).json({
				message: '服务器异常，请稍后',
			});
		}
	}
});

module.exports = router;
