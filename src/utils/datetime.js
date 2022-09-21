export class DateFormat {
    constructor(date) {
        this.date = date;
    }
    format1() {
        let month = this.date.getMonth();
        let months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];
        let year = this.date.getUTCFullYear();
        let day = this.date.getDate();
        let hours = this.date.getHours(),
            minutes = this.date.getMinutes(),
            seconds = this.date.getSeconds();
        return `${months[month]} ${day}, ${year} ${hours}:${minutes}:${seconds}`;
    }
}
