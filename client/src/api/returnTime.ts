export const returnCurrentTime = () => {
    const h = new Date().getHours() > 9 ?  new Date().getHours() : `0${new Date().getHours()}`;
    const m = new Date().getMinutes() > 9 ? new Date().getMinutes() : `0${new Date().getMinutes()}`;

    return `${h}:${m}`;
}