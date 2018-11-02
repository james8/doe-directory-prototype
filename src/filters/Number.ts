/*
    value: string	    -> string value to be formatted
    limit?: number      -> number of characters to limit string (optional)
*/

// tslint:disable:one-line curly
const FNumber: any = ((value: any, limit?: any) => {
    if (value !== undefined) {
        // replace alpha & non-numeric characters
        value = value.replace(/[A-z]|\W/g, "");

        // restrict to limit (if capplicable)
        if (value.length > limit) value = value.substr(0, limit);
    }
    return value;
});

export default FNumber;