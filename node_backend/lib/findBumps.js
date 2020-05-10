const _ = require('lodash');

const findBumps = (sheet, samples, assocValues) => {

    // add meta phrase like text with <...> to each row
    const modSamples = samples.map(row => {
        const {text, entities} = row;
        const metaPhrase = entities.reduce((c, n) => {
            if (n.entity === 'intent') return c;
            return c.replace(new RegExp(n.value), `<${n.entity}>`);
        }, text)
        return {...row, metaPhrase};
    });

    // unique sample phrases
    const modSamplesUniqPhrases = _
        .chain(modSamples)
        .map(s => s.metaPhrase)
        .uniq()
        .value();

    // sheet (has | does not have) this meta phrase
    const uniqPhrasesMatchSheet = modSamplesUniqPhrases.reduce((c, n) => {
        const isMatch = sheet.some(({phrase}) => phrase === n);
        if (!isMatch) return c.push({match: false, phrase: n}), c;
        return c.push({match: true, phrase: n}), c;
    }, []);

    const matchedPhrases = uniqPhrasesMatchSheet.filter(({match}) => match);

    // samples found in sheet by meta phrase
    const matchedModSamples = modSamples.filter(({metaPhrase}) => (
        matchedPhrases.some(({phrase}) => phrase === metaPhrase)
    ));

    // phrase found in sheet, but does not match any intent
    matchedModSamples.forEach(({entities, metaPhrase, text}) => {
        const {value} = entities.find(({entity}) => entity === 'intent');
        const isIntentMatch = sheet.some(({intent}) => intent === value)
        if (!isIntentMatch) {
            console.log(
                `sample intent <${value}> does not match any sheet intent for phrase: ${text} (${metaPhrase})`
            );
        };
    });

    const groupedMatchedModSamples = _
        .chain(matchedModSamples)
        .groupBy('metaPhrase')
        .values()
        .value()

    // find data intersections and prepare set for training
    groupedMatchedModSamples.forEach(group => {

        // group is same phrase said with difefrent parameters
        const groupValues = group.map(el => {
            return el.entities.reduce((c, n) => {
                if (n.entity === 'intent') return c;
                if (!c[n.entity]) return c[n.entity] = n.value, c;
                return c[n.entity].push(n.value), c;
            }, {});
        });

        // group represented as {key: [...values]}
        const mergedUniqGroupValues = _.uniq(groupValues).reduce((c, n) => {
            for (let [key, value] of Object.entries(n)) {
                !c[key] ? c[key] = [value] : c[key].push(value)
            }
            return c;
        }, {});

        // cases to skip training
        for (let [key, values] of Object.entries(mergedUniqGroupValues)) {
            values.forEach(value => {
                const isValueTrained = assocValues[key].some(assocValue => assocValue === value);
                !isValueTrained
                    ? console.log(`SKIP TRAINING: loaded backend data has missing training parameter <${value}> for <${key}> association`)
                    : console.log(`SKIP TRAINING: already trained for <${value}>, associated with <${key}>`);
            });
        };

        // phrase should be trained with parameters below
        for (let [key, values] of Object.entries(assocValues)) {
            const trainedSet = mergedUniqGroupValues[key];
            if (trainedSet) {
                const trainingSet = values.filter(value => !trainedSet.some(trainedValue => trainedValue == value));
                trainingSet.forEach(value => {
                    console.log(`TRAINING: training with <${value}> for phrase: ${group[0].metaPhrase}`);
                })
            }
        }

    })

    return null;
};

module.exports = findBumps;

// const entities = phrase.match(/<(\w+)>/g);

// {
//     id: '57195833081540029',
//     text: 'hello friend',
//     entities: [
//       { entity: 'person', value: 'friend', start: 6, end: 12 },
//       { entity: 'intent', value: 'getPerson' }
//     ]
// }
