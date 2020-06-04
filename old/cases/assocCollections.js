const axios = require('axios');
const _ = require('lodash');

async function fetchAssocCollections (sheetMeta, sheet, ws, backendURL) {
    const {langs, combs} = sheetMeta;

    const paramsByLang = combs.reduce((c, n) => {
        const rows = sheet.filter(r => r.combination === n)
        const paramByLang = langs.reduce((c1, n1) => {
            const combLangObj = rows.find(r => r.language === n1);
            if (!combLangObj) return c1;
            const metaParams = combLangObj.phrase.match(/<(\w+)>/g);
            if (!metaParams) return c1;
            const cleanMetaParams = metaParams.map(str => str.replace(/<|>/g, ''));
            if (!c1[n1]) return c1[n1] = cleanMetaParams, c1;
            const uniq = cleanMetaParams.concat(c1[n1]).filter((v, i, s) => s.indexOf(v) === 1);
            return c1[n1].params.concat(uniq), c1;
        }, {});
        return c.push(paramByLang), c;
    }, []);

    const paramsByLangPairs = _.toPairs(paramsByLang.reduce((c, n) => {
        const clC = Object.assign(c);
        for (let [key, values] of Object.entries(n)) {
            if (!clC[key]) clC[key] = values;
            if (clC[key]) clC[key] = _.uniq(clC[key].concat(values))
        }
        return clC;
    }, {}));

    const res = await Promise.all(paramsByLangPairs.map(async ([lang, data]) => {
        const fetchedData = await Promise.all(data.map(async param => {
            ws.emit('info', `[INFO]: fetching collection <${param}> for language <${lang}> from the backend`);
            return await axios
                .get(`${backendURL}/collections/${param}/${lang}`)
                .then(({data}) => ({[param]: data}))
                .catch(e => console.log(e));
        }))
        return {lang, data: fetchedData};
    }))

    return res;
};

module.exports = fetchAssocCollections;



// R.map(group => {
    const head = R.head(group)
    const entities = head
      .match(/<(\w+)>/gi)
      .map(entity => entity.replace(/<|>/gi, ''))
    return entities
//   })


const data = {
    entities: {
      person: {
        en: ['friend', 'man', 'mate'],
        ru: ['чувак', 'друг', 'товарищ']
      },
      crop: {
        en: ['apple', 'tomato']
      }
    },
    sheet: [
      {
        combination: '1',
        phrase: 'can you help me with <fruit> <person>',
        language: 'en',
        intent: 'getWeather'
      },
      {
        combination: '1',
        phrase: 'что за сегодня погода <fruitdddddd>',
        language: 'ru',
        intent: 'getWeather'
      },
      {
        combination: '2',
        phrase: 'hello <person>',
        language: 'ru',
        intent: 'getPerson1'
      },
      {
        combination: '1',
        phrase: undefined,
        language: undefined,
        intent: undefined
      },
      {
        combination: '1',
        phrase: undefined,
        language: undefined,
        intent: undefined
      }
    ],
    samples: [
      {
        id: '57195833081540029',
        text: 'can you help me with apple mate',
        entities: [
          { entity: 'crop', value: 'apple', start: 6, end: 12 },
          { entity: 'person', value: 'mate', start: 6, end: 12 },
          { entity: 'intent', value: 'getPerson' },
          { entity: 'language', value: 'en' }
        ]
      },
      {
        id: '57195833081540029',
        text: 'hello friend',
        entities: [
          { entity: 'person', value: 'friend', start: 6, end: 12 },
          { entity: 'intent', value: 'getPerson' }
        ]
      },
      {
        id: '57195833081680029',
        text: 'hello buddy',
        entities: [
          { entity: 'person', value: 'buddy', start: 6, end: 11 },
          { entity: 'intent', value: 'getPerson' }
        ]
      },
      {
        id: '57195833081750029',
        text: 'hello man',
        entities: [
          { entity: 'intent', value: 'getPerson' },
          { entity: 'person', value: 'man', start: 6, end: 9 }
        ]
      },
      {
        id: '57195833082660029',
        text: 'hello Mary',
        entities: [
          { entity: 'intent', value: 'getPerson' },
          { entity: 'person', value: 'Mary', start: 6, end: 10 }
        ]
      },
      {
        id: '57195833082730029',
        text: 'hello Eugene',
        entities: [
          { entity: 'intent', value: 'getPerson' },
          { entity: 'person', value: 'Eugene', start: 6, end: 12 }
        ]
      },
      {
        id: '57195833092250029',
        text: 'hello dude',
        entities: [
          { entity: 'intent', value: 'getPerson' },
          { entity: 'person', value: 'dude', start: 6, end: 10 },
          { entity: 'language', value: 'en' }
        ]
      },
      {
        id: '57195833188640029',
        text: 'hello bud',
        entities: [
          { entity: 'intent', value: 'getPerson' },
          { entity: 'person', value: 'bud', start: 6, end: 9 },
          { entity: 'language', value: 'en' }
        ]
      },
      {
        id: '57195833188710029',
        text: 'whats up mate',
        entities: [
          { entity: 'intent', value: 'getPerson' },
          { entity: 'person', value: 'mate', start: 9, end: 13 },
          { entity: 'language', value: 'en' }
        ]
      },
      {
        id: '57195833188780029',
        text: 'привет товарищ',
        entities: [
          { entity: 'intent', value: 'getPerson' },
          { entity: 'person', value: 'товарищ', start: 7, end: 14 },
          { entity: 'language', value: 'ru' }
        ]
      },
      {
        id: '57195833188850029',
        text: 'привет друг',
        entities: [
          { entity: 'intent', value: 'getPerson' },
          { entity: 'person', value: 'друг', start: 7, end: 11 },
          { entity: 'language', value: 'ru' }
        ]
      },
      {
        id: '57195833188920029',
        text: 'как дела чувак',
        entities: [
          { entity: 'intent', value: 'getPerson' },
          { entity: 'person', value: 'чувак', start: 9, end: 14 },
          { entity: 'language', value: 'ru' }
        ]
      },
      {
        id: '57195833188990029',
        text: 'hey man',
        entities: [
          { entity: 'intent', value: 'getPerson' },
          { entity: 'person', value: 'man', start: 4, end: 7 },
          { entity: 'language', value: 'en' }
        ]
      },
      {
        id: '57195833189060029',
        text: 'hey buddy',
        entities: [
          { entity: 'intent', value: 'getPerson' },
          { entity: 'person', value: 'buddy', start: 4, end: 9 },
          { entity: 'language', value: 'en' }
        ]
      }
    ]
  }
  
  
  const shape = {
    id: '57195833189060029',
    metaText: 'hello <person>',
    intent: 'getPerson',
    language: 'en',
    trainedValues: ['man', 'buddy'],
    unknownValues: ['mate']
  }
  
  const samplesWithMetaText = R.map(sample => {
      const metaText = R.reduce((c, n) => {
          if (n.entity === 'intent') return c
          return c.replace(new RegExp(n.value), `<${n.entity}>`)
      }, sample.text)(sample.entities)
      return {...sample, metaText}
  })
  
  const samplesWithLang = R.filter(R.pipe(
    R.prop('entities'),
    R.find(R.whereEq({entity: 'language'}))
  ))(samplesWithMetaText(data.samples))
  
  const samplesDoNotMatchPhrases = R.curry((samples, entities, sheet) => R.pipe(
    R.groupBy(R.prop('metaText')),
    R.toPairs,
    R.map(v => {
  
      const trainedValues = R.pipe(
        R.last,
        R.map(R.prop('entities')),
        R.flatten,
        R.reject(R.propEq('entity', 'intent')),
        R.reject(R.propEq('entity', 'language')),
        R.groupBy(R.prop('entity')),
        R.toPairs,
        R.map(([prop, data]) => [prop, R.map(R.prop('value'))(data)]),
        R.fromPairs
      )(v)
  
      const language = R.pipe(
        R.last,
        R.head,
        R.prop('entities'),
        R.find(R.whereEq({entity: 'language'})),
        R.prop('value')
      )(v)
  
      const id = R.pipe(
        R.last,
        R.head,
        R.prop('id')
      )(v)
  
      const expectedEntities = R.head(v)
        .match(/<(\w+)>/gi)
        .map(entity => entity.replace(/<|>/gi, ''))
      
      const unknownValues = R.pipe(
        R.filter(v => R.path([v, language])(entities)),
        R.reduce((c, n) => {
          const uniqLanguageEntities = R.without(trainedValues[n], entities[n][language])
          return R.merge(c, {[n]: uniqLanguageEntities})
        }, {})
      )(expectedEntities)
      
      return {metaPhrase: R.head(v), trainedValues, language, id, expectedEntities, unknownValues}
    })
  )(samples))
  
  samplesDoNotMatchPhrases(samplesWithLang, data.entities, data.sheet)