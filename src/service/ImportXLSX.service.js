
'use strict'
var XLSX = require("xlsx");
const excelToJson = require('convert-excel-to-json');

class ImportXLSXService {
    static async importXLSX(file) {
        const result = await excelToJson({
            sourceFile: "/home/vuvandinh203/workspace/nodejs/web_api_v3/test.xlsx",
        });

        return result
    }
}
module.exports = ImportXLSXService