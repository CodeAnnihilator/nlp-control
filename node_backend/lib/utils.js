const _ = require('lodash');

const getSheetData = async (instance, columns) => {
    const sheet = instance.sheetsByIndex[0];
    const rows = await sheet.getRows();
    return rows.map(row => _.pick(row, columns));
};

module.exports = {
    getSheetData
};