const FPhoneNumber = ((value) => {
    if (value !== undefined) {
        // replace alpha & non-numeric characters
        value = value.replace(/[A-z]|\W/g, "");

        const length = value.length;
        // restrict to max of 10 digits
        if (length > 10) value = value.substr(0, 10);

        // format phone number
        if (length === 3) value = value.replace(/(\d{3})/, "$1-");
        else if ((length > 3) && (length <= 7)) value = value.replace(/(\d{3})(\d{1,4})/, "$1-$2");
        else value = value.replace(/^(\d{3})(\d{3})(\d{2,4})/, "($1) $2-$3");

        return value;
    }
});

export default FPhoneNumber;
