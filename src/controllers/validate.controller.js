const { OK } = require("../core/success.response");
const ValidateService = require("../service/validate.service");

class ValidateController {

    static async checkEmailExits(req, res) {
        const { email } = req.body;
        const data = await ValidateService.checkEmailExist(email);
        return new OK({
            message: "check email exits successfully",
            data
        }).send(res)
    }
}
module.exports = ValidateController