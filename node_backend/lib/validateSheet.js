const _ = require('lodash');


// strategy to find empty cells
const emptyCells = (data, column) => {
    const emptyCells = data
        .map((row, index) => ({...row, position: index}))
        .filter(row => _.isEmpty(row[column]))
        .map(row => row.position);
    return {[column]: emptyCells};
};

// find and return all sheet issues and meta data
const validateSheet = (sheet, columns, ws) => {

    const warnings = [];

    // unique combinations
    const combs = _
        .chain(sheet)
        .map('combination')
        .uniq()
        .filter(v => !_.isEmpty(v))
        .value();
    
    // unique languages
    const langs = _
        .chain(sheet)
        .groupBy('language')
        .toPairs()
        .map(_.first)
        .filter(v => v !== 'undefined')
        .filter(v => v)
        .value();

    // language duplications per combination
    const langCombDups = _
        .chain(sheet)
        .groupBy('combination')
        .map((c, i) => ({[i]: _.map(c, 'language')}))
        .omitBy('')
        .toArray()
        .map(c => _
            .chain(c)
            .values()
            .flattenDeep()
            .filter((val, i, iteratee) => _.includes(iteratee, val, i + 1))
            .map((l) => ({[_.keys(c)[0]]: [l]}))
            .value()
        )
        .map(v => {
            if (!v.length) return v;
            return _.reduce(v, (c, n) => {
                const key = _.keys(n)[0];
                if (!c.hasOwnProperty(key)) return c[key] = n[key], c;
                return c[key] = c[key].concat(n[key]), c;
            }, Object.assign({}));
        })
        .filter(_.size)
        .value();

    // skipped range of combination ids
    const skippedCombsIds = _
        .flattenDeep(
            combs
                .sort((a, b) => a - b)
                .filter(arr => arr)
                .reduce((c, n, i, arr) => {
                    if (!arr[i + 1]) return c;
                    const gap = Math.abs(n - arr[i + 1]) - 1;
                    const missingIds = Array(gap).fill().map((_, i) => i + parseInt(n, 10) + 1);
                    if (gap > 0) return c.push(missingIds), c;
                    return c;
                },[])
        );

    // combination not in siblings position range
    const combBrokeOrder = combs.map(comb => {

        const positions = sheet.map((row, i) => {
            if (row.combination === comb) return parseInt(i, 10);
            return null;
        }).filter(el => el !== null);

        let tempPos = null;

        const issues = positions
            .sort((a, b) => a - b)
            .map((position, index) => {
                if (index === 0) tempPos = position;
                if (index > 0) {
                    const posGap = Math.abs(tempPos - positions[index]);
                    if (posGap === 1) tempPos = position;
                    if (posGap > 1) return {...sheet[position], position};
                }
                return null;
            }
        ).filter(Boolean);

        if (!issues.length) return null;
        return {[comb]: issues};

    }).filter(Boolean);

    langCombDups.forEach(group => {
        for (comb in group) {
            group[comb].forEach(lang => {
                ws.emit('warning', `[WARNING]: combination ${comb} has duplication of language: ${lang}`);
                // warnings.push(`combination ${comb} has duplication of language: ${lang}`);
            });
        };
    });

    langCombDups.forEach(group => {
        for (comb in group) {
            const missLangs = langs.filter(v => !group[comb].includes(v));
            missLangs.forEach(lang => {
                ws.emit('warning', `[WARNING]: detected missing language for combination ${comb}: ${lang}`);
                // warnings.push(`detected missing language for combination ${comb}: ${lang}`);
            });
        };
    });

    columns.forEach(column => {
        const fields = emptyCells(sheet, column);
        for (group in fields) {
            for (let i = 0; i < fields[group].length; i++) {
                ws.emit('warning', `[WARNING]: empty ${group} cell detected at row: ${fields[group][i] + 2}`);
                // warnings.push(`empty ${group} cell detected at row: ${fields[group][i] + 2}`);
            };
        };
    });

    skippedCombsIds.length > 1
        ? ws.emit('warning', `[WARNING]: skipped combination range: from ${skippedCombsIds[0]} to ${skippedCombsIds.slice(-1)[0]}`)
        : ws.emit('warning', `[WARNING]: skipped combination id: ${skippedCombsIds[0]}`);

    // skippedCombsIds.length > 1
    //     ? warnings.push(`skipped combination range: from ${skippedCombsIds[0]} to ${skippedCombsIds.slice(-1)[0]}`)
    //     : skippedCombsIds.length && warnings.push(`skipped combination id: ${skippedCombsIds[0]}`);

    combBrokeOrder.forEach(obj => {
        for (const group in obj) {
            obj[group].forEach(issue => {
                ws.emit('warning', `[WARNING]: element of group ${group} not in proper position at row: ${issue.position + 2}`);
                // warnings.push(`element of group ${group} not in proper position at row: ${issue.position + 2}`)
            });
        };
    });

    return {langs, combs};
}

module.exports = validateSheet;