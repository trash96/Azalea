export let aquaticTheme = {
    colorHeader1: "bright-blue",
    colorHeader2: "bright-aqua",
    key: "aqua",
    val: "white",
    error: "blue",
    success: "magenta",
};
// // print the date in the format "YYYY-MM-DD"
// export function printDate(date) {
//     return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
// }
// // pick a random value from object with a set rarity
// export function randomValue(obj) {
//     let total = 0;
//     for (let key in obj) {
//         total += obj[key];
//     }
//     let random = Math.random() * total;
//     for (let key in obj) {
//         random -= obj[key];
//         if (random <= 0) {
//             return key;
//         }
//     }
// }
// // pick a random boolean by rarity
// export function randomBool(trueRarity, falseRarity) {
//     let total = trueRarity + falseRarity;
//     let random = Math.random() * total;
//     if (random < trueRarity) {
//         return true;
//     }
//     else {
//         return false;
//     }
// }
// // make a random hexadecimal value of length n and also include the letter g
// export function randomHex(n) {
//     let hex = "";
//     for (let i = 0; i < n; i++) {
//         hex += Math.floor(Math.random() * 16).toString(16);
//     }
//     return hex;
// }
// // trim long text
// export function trimText(text, length) {
//     if (text.length > length) {
//         return text.substring(0, length) + "...";
//     }
//     else {
//         return text;
//     }
// }
// // format the date to mm/dd/yyyy
// export function formatDateAmerican(date) {
//     return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
// }
// // format the date to dd/mm/yyyy
// export function formatDateEuropean(date) {
//     return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
// }
// // format the date to yyyy-mm-dd
// export function formatDateISO(date) {
//     return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
// }
// // make a random binary value of length n
// export function randomBinary(n) {
//     let binary = "";
//     for (let i = 0; i < n; i++) {
//         binary += Math.floor(Math.random() * 2);
//     }
//     return binary;
// }
