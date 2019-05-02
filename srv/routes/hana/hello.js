module.exports = (req, res) => {
	return res.type("application/json").status(200).send("In hello Route...");
};