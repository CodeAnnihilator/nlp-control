const validateWIT = async Instance => {
    const samples = [];
    let offset = 0;
    while (offset < 2) {
        const sample = await Instance
            .get(`samples?&offset=${offset}&limit=1`)
            .then(({data}) => data[0])
            .catch(console.error);
        if (!sample) break;
        // console.log(sample);
        samples.push(sample);
        offset++;
    }
    return samples;
}

module.exports = validateWIT;

// request samples by 200 till same sample met