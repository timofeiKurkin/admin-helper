const green_dark: string = "#5BA809";
const blue_dark: string = "#00608C";
const blue_light: string = "#0088C7";
const red_dark: string = "#BF2121";

const black: string = "#151515";
const white: string = "#FFFFFF";
const white_1: string = "#F2F6FA";
const cold_white: string = "#D0D8E4";

const background: string = `var(--background, radial-gradient(188.48% 111.8% at 100% 100%, ${cold_white} 0%, ${white} 80.36%), ${white})`
const backgroundSuccess: string = `var(--background_success, radial-gradient(198.52% 111.8% at 100% 100%, #E8FFCF 0%, ${white_1} 80.25%), ${white})`
const backgroundError: string = `var(--background_error, radial-gradient(197.36% 111.8% at 100% 100%, #FFD0D0 0%, ${white_1} 80%), ${white})`


export {
    green_dark,
    blue_dark,
    blue_light,
    red_dark,
    black,
    white,
    white_1,
    cold_white,

    background,
    backgroundSuccess,
    backgroundError
}