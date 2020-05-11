const validateWIT = async Instance => {
    const samples = [];
    let offset = 0;
    while (true) {
        const sample = await Instance
            .get(`samples?&offset=${offset}&limit=1`)
            .then(({data}) => data[0])
            .catch(console.error);
        if (!sample) break;
        samples.push(sample);
        offset++;
    }
    return samples;
}

module.exports = validateWIT;

// request samples by 200 till same sample met