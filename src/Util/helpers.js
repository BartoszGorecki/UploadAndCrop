export const createArray = length => Array(length).fill().map((_, index) => index + 1);

export const convertHexToRgba = (hex, opacity = 1) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
        const rValue = parseInt(result[1], 16);
        const gValue = parseInt(result[2], 16);
        const bValue = parseInt(result[3], 16);
        return 'rgba(' + rValue + ', ' + gValue + ', ' + bValue + ', ' + +opacity + ')'
    }
    return null 
}

export const generateColor = () => '#' + Math.random().toString(16).substr(-6);