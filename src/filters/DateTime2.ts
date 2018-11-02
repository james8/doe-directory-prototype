/*
    value: string       -> string value to be formatted
*/

// tslint:disable:one-line curly
const FDateTime2: any = ((value: string) => {
    let formattedDate: string = "";

    if (value !== undefined) {
        const d: Date = new Date(value);
        // date: ShortMonth Day, Year Time
        // const month: string = d.toLocaleString("en-us", { month: "short" });
        // const day: string = d.getDate().toString();
        // const year: string = d.getFullYear().toString();
        // const time: string = d.toLocaleTimeString();
        // formattedDate = `${ month } ${ day }, ${ year } ${ time }`;

        const date: string = d.toLocaleDateString();
        const time: string = d.toLocaleTimeString();
        formattedDate = `${ date } ${ time }`;
    }

    return formattedDate;
});

export default FDateTime2;