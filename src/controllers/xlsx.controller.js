const { OK } = require("../core/success.response");
const ImportXLSXService = require("../service/ImportXLSX.service");

class XLSXToJson {

    static async uploadXLSX(req, res) {
        const data = await ImportXLSXService.importXLSX(req.body);
        return new OK({
            message: "Create xlsx successfully",
            data
        }).send(res)
    }
}
module.exports = XLSXToJson