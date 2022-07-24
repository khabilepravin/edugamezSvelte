export const getUrlByRegion = (arrayOfElements, region) => {
    if (arrayOfElements && region) {
        const results = arrayOfElements.filter(obj => {
            return obj.Region === region;
        });

        if (results) {
            return results[0];
        }
    }
};