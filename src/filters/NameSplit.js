/*
    value: string       -> string value to be formatted
*/

const FNameSplit = (value => {
    if (value !== undefined) {
        const names = value.split(',');
        return `${ names[1].trim() } ${ names[0].trim() }`;
    }
    return value;
});

export default FNameSplit;