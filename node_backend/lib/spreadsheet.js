const {GoogleSpreadsheet} = require('google-spreadsheet');
const _ = require('lodash');

module.exports = class SpreadSheet {
    constructor({client_email, private_key, spreadsheet_id}) {
        this.client_email = client_email;
        this.private_key = private_key;
        this.doc = new GoogleSpreadsheet(spreadsheet_id);
    }

    connect = async () => {
        const {client_email, private_key} = this;
        await this.doc.useServiceAccountAuth({client_email, private_key});
        await this.doc.loadInfo();
        return this;
    }

    fetch = async (page, columns) => {
        const sheet = this.doc.sheetsByIndex[page];
        const rows = await sheet.getRows();
        return rows.map(row => _.pick(row, columns));
    }

}
