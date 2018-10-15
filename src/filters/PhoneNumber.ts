/*
    value: string       -> string value to be formatted
    focused: boolean    -> flag to determine if input is focused/blurred
*/

// tslint:disable:one-line curly
const FPhoneNumber: any = ((value: any, focused: any) => {
    if (value !== undefined) {
        // replace alpha & non-numeric characters
        value = value.replace(/[A-z]|\W/g, "");

        // restrict to max of 10 digits
        const length: number = value.length;
        if (length > 10) value = value.substr(0, 10);

        // format/remove format of phone number on blur/format
        if (!focused) {
            if (length === 3) value = value.replace(/(\d{3})/, "$1-");
            else if ((length > 3) && (length <= 7)) value = value.replace(/(\d{3})(\d{1,4})/, "$1-$2");
            else { value = value.replace(/^(\d{3})(\d{3})(\d{2,4})/, "($1) $2-$3"); }
        }
        else value = value.replace(/\(|\)|\s|\-|/g, "");
    }
    return value;
});

export default FPhoneNumber;
