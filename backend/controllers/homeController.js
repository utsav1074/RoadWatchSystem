const { getUserHomeData } = require("../services/homeService");

const getHome = (req, res) => {
  const userId = req.user.userId;

  getUserHomeData(userId, (err, data) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to load home data",
      });
    }

    return res.status(200).json(data);
  });
};

module.exports = {
  getHome,
};
