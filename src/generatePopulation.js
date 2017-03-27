function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var population = {}, color1 = "", color2 = "", redIntensity1, blueIntensity1,
    greenIntensity1, redIntensity2, blueIntensity2, greenIntensity2;

for( var i = 0 ; i < 1000 ; i++) {
    while (color1.length < 6) {
        redIntensity1 = getRandomInt(0, 255).toString(16);
        blueIntensity1 = getRandomInt(0, 255).toString(16);
        greenIntensity1 = getRandomInt(0, 255).toString(16);
        color1 = redIntensity1 + greenIntensity1 + blueIntensity1;
    }

    while (color2.length < 6) {
        redIntensity2 = getRandomInt(0, 255).toString(16);
        blueIntensity2 = getRandomInt(0, 255).toString(16);
        greenIntensity2 = getRandomInt(0, 255).toString(16);
        color2 = redIntensity2 + greenIntensity2 + blueIntensity2;
    }

    var crossRedIntensity = (parseInt(redIntensity1,16) + parseInt(
        redIntensity2,16)).toString(16),
        crossBlueIntensity = (parseInt(blueIntensity1,16) + parseInt(
            blueIntensity2,16)).toString(16),
        crossGreenIntensity = (parseInt(greenIntensity1,16) + parseInt(
            greenIntensity2,16)).toString(16);

    crossColor = crossRedIntensity + crossGreenIntensity + crossBlueIntensity;

    if(crossColor.length == 6 && Object.keys(population).length < 40) {
        population[Object.keys(population).length] = {
            myColor: '#'+ crossColor,
            dadColor: '#' + color1,
            momColor: '#' + color2,
            redGene: crossRedIntensity,
            greenGene: crossGreenIntensity,
            blueGene: crossBlueIntensity
        };
    }
    color1 = "";
    color2 = "";
}

var fs = require("fs");
    fs.writeFile( "knowledgebase.json", JSON.stringify( population ), "utf8");
