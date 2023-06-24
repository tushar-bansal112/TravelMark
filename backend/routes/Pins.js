const router = require("express").Router();
const Pin = require("../Entity/Pin");

router.post("/", async (req, res) => {
  try {
    const { username, title, desc, rating, long, lat } = req.body;
    const newPin = await Pin.create({
      username,
      title,
      desc,
      rating,
      long,
      lat,
    });
    res.status(200).json(newPin);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const pins = await Pin.findAll();
    res.status(200).json(pins);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
