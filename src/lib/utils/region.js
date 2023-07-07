export function getUrlByRegion(arrayOfElements, region) {
    if (arrayOfElements && region) {
        const results = arrayOfElements.filter(obj => {
            return obj.Region === region;
        });

        if (results) {
            return results[0].Url;
        }
    }
};

export function getCountryCodeByTimezone() {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    if (timeZone.toLowerCase().includes('america')) {
        return 'en-US';
    }
    else if (timeZone.toLocaleLowerCase().includes('euorope')) {
        return 'en-GB';
    }
    else if (timeZone.toLocaleLowerCase().includes('australia')) {
        return 'en-AU';
    }
    else {
        return 'en-GB';
    }

};