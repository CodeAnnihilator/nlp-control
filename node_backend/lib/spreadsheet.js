const {GoogleSpreadsheet} = require('google-spreadsheet');

function SpreadSheet({client_email, private_key, spreadsheet_id}) {
    this.doc = new GoogleSpreadsheet(spreadsheet_id);
    this.connect = async function() {
        await this.doc.useServiceAccountAuth({client_email, private_key});
        await this.doc.loadInfo();
        return this.doc;
    }
    // return this.doc;
}

module.exports = SpreadSheet;