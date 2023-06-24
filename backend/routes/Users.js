const router = require("express").Router();
const User = require("../Entity/User");
const bcrypt = require("bcrypt");

router.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    res.status(200).json(newUser.id);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ where: { username: req.body.username } });
    if (!user) {
      return res.status(400).json("Wrong username or password");
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(400).json("Wrong username or password");
    }

    res.status(200).json({ id: user.id, username: user.username });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
