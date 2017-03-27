var solution, geracoes = "";
exports.evolvePopulation = function (objective) {
    var fs = require("fs");
    var population = JSON.parse(fs.readFileSync("./knowledgebase.json",
        "utf8"));
    var actualGen = population;
    solution = objective;
    var k = 0;
    while (!haveIndividual(actualGen)) {
        console.log('Generation',k);k++;
        geracoes += 'Generation'+ k + '<p></p>';
        actualGen = evaluateActualGen(actualGen);
        actualGen = crossOver(actualGen);
    }

    return actualGen[getIndexOfSolution(actualGen)];
};

exports.getGenerations = function () {
    return geracoes;
}
var haveIndividual = function (actualGen){
    for(var i = 0 ; i < Object.keys(actualGen).length; i++) {
        if(actualGen[i].myColor === solution.myColor) {
            return true;   
        }
    }
    return false;
};

var getIndexOfSolution = function (actualGen) {
    for(var i = 0 ; i < Object.keys(actualGen).length; i++) {
        if(actualGen[i].myColor === solution.myColor) {
            return i;   
        }
    }
    return -1;
};

var isValid = function (actualGen) {
    return((parseInt(actualGen[getIndexOfSolution(actualGen)].redGene,16) === 
        (parseInt(actualGen[getIndexOfSolution(actualGen)].dadColor.substring(1,3),16) + 
            parseInt(actualGen[getIndexOfSolution(actualGen)].momColor.substring(1,3),16))) && (parseInt(actualGen[getIndexOfSolution(actualGen)].greenGene,16) === 
        (parseInt(actualGen[getIndexOfSolution(actualGen)].dadColor.substring(3,5),16) + 
            parseInt(actualGen[getIndexOfSolution(actualGen)].momColor.substring(3,5),16))) && (parseInt(actualGen[getIndexOfSolution(actualGen)].blueGene,16) === 
        (parseInt(actualGen[getIndexOfSolution(actualGen)].dadColor.substring(5,7),16) + 
            parseInt(actualGen[getIndexOfSolution(actualGen)].momColor.substring(5,7),16))) );

 };

var evaluateActualGen = function (actualGen) {
    var bestFit = {};

    if (Object.keys(actualGen).length > 10) {
        bestFit = getBestFit(actualGen);
    } else {
        var newPopulation = generatePopulation(getBestFit(actualGen));
        bestFit = getBestFit(newPopulation);
    }

    return bestFit;
};

var getBestFit = function (actualGen) {
        var dominants = dominantGenes(actualGen, solution), bestFit = {};

    for (i = 0; i < Object.keys(actualGen).length; i++) {
        if (verifyFitness(actualGen[i], dominants)) {
            bestFit[Object.keys(bestFit).length] = actualGen[i];
        }
    }
    return bestFit;
};
var dominantGenes = function (actualGen) {
    var listOfDominantRedGenes = "", listOfDominantGreenGenes = "",
    listOfDominantBlueGenes = "";

    var redObjective =  parseInt(solution.redGene,16),
        greenObjetive =  parseInt(solution.greenGene,16),
        blueObjective =  parseInt(solution.blueGene,16);

    for (var i = 0; i < Object.keys(actualGen).length; i++) {
        if (Math.abs((parseInt(actualGen[i].redGene,16) - redObjective)) <= 50) {
            listOfDominantRedGenes += actualGen[i].redGene;
        }
        if (Math.abs(parseInt(actualGen[i].greenGene,16) - greenObjetive) <= 50) {
            listOfDominantGreenGenes += actualGen[i].greenGene;
        }
        if (Math.abs(parseInt(actualGen[i].blueGene,16) - blueObjective) <= 50) {
            listOfDominantBlueGenes += actualGen[i].blueGene;
        }
    }

    return {dominantRedGenes: listOfDominantRedGenes, 
            dominantGreenGenes: listOfDominantGreenGenes,
            dominantBlueGenes: listOfDominantBlueGenes};
};

var verifyFitness = function (being, dominants) {
    var redIntensity, blueIntensity, greenIntensity;

    redIntensity = being.redGene;
    greenIntensity = being.greenGene;
    blueIntensity = being.blueGene;

    if(dominants.dominantRedGenes.indexOf(redIntensity) != -1 || 
        dominants.dominantGreenGenes.indexOf(greenIntensity) != -1|| 
        dominants.dominantBlueGenes.indexOf(blueIntensity) != -1) {
        return true;
    }

    return false;
};

var crossOver = function (actualGen) {
    var nextGen = {}, dadRedGene, dadGreenGene, dadBlueGene, momRedGene, momGreenGene, momBlueGene, childRedGene = "", childGreenGene = "", childBlueGene = "", child = {}, dadColor = "#", momColor = "#", aux;

    for (var i = 0,j = 1; i < Object.keys(actualGen).length; i+=2, j+=2) {
        if(j === Object.keys(actualGen).length) {
            j--;
        }

        dadRedGene = actualGen[i].redGene;
        momRedGene = actualGen[j].redGene;

        if ( dadRedGene === solution.redGene ) {
            childRedGene = dadRedGene;
            dadColor += actualGen[i].dadColor.substring(1,3);
            momColor += actualGen[i].momColor.substring(1,3);
        } else if ( momRedGene === solution.redGene ) {
            childRedGene = momRedGene;
            dadColor += actualGen[j].dadColor.substring(1,3);
            momColor += actualGen[j].momColor.substring(1,3);
        } else /*if ((parseInt(dadRedGene, 16) + 1) < 255 || (parseInt(momRedGene, 16) + 1) < 255)*/{
            if(parseInt(dadRedGene, 16) < parseInt(momRedGene, 16)) {
                aux = parseInt(dadRedGene, 16);
                aux++;
                childRedGene = aux.toString(16);
                aux = parseInt(actualGen[i].dadColor.substring(1,3),16) + 1;
                dadColor += aux.toString(16);
                aux = parseInt(actualGen[i].momColor.substring(1,3),16);
                momColor += aux.toString(16);
            } else {
                aux = parseInt(momRedGene, 16);
                aux++;
                childRedGene = aux.toString(16);
                aux = parseInt(actualGen[j].dadColor.substring(1,3),16) + 1;
                dadColor += aux.toString(16);
                aux = parseInt(actualGen[j].momColor.substring(1,3),16);
                momColor += aux.toString(16);
            }
        }

        dadGreenGene = actualGen[i].greenGene;
        momGreenGene = actualGen[j].greenGene;

        if ( dadGreenGene === solution.greenGene ) {
            childGreenGene = dadGreenGene;
            dadColor += actualGen[i].dadColor.substring(3,5);
            momColor += actualGen[i].momColor.substring(3,5);
        } else if ( momGreenGene === solution.greenGene ) {
            childGreenGene = momGreenGene;
            dadColor += actualGen[j].dadColor.substring(3,5);
            momColor += actualGen[j].momColor.substring(3,5);
        } else /*if ((parseInt(dadGreenGene, 16) + 1) < 255 || (parseInt(momRedGene, 16) + 1) < 255)*/{
            if(parseInt(dadGreenGene, 16) < parseInt(momGreenGene, 16)) {
                aux = parseInt(dadGreenGene, 16);
                aux++;
                childGreenGene = aux.toString(16);
                aux = parseInt(actualGen[i].dadColor.substring(3,5),16) + 1;
                dadColor += aux.toString(16);
                aux = parseInt(actualGen[i].momColor.substring(3,5),16);
                momColor += aux.toString(16);
            } else {
                aux = parseInt(momGreenGene, 16);
                aux++;
                childGreenGene = aux.toString(16);
                aux = parseInt(actualGen[j].dadColor.substring(3,5),16) + 1;
                dadColor += aux.toString(16);
                aux = parseInt(actualGen[j].momColor.substring(3,5),16);
                momColor += aux.toString(16);
            }
        }

        dadBlueGene = actualGen[i].blueGene;
        momBlueGene = actualGen[j].blueGene;

        if ( dadBlueGene === solution.blueGene ) {
            childBlueGene = dadBlueGene;
            dadColor += actualGen[i].dadColor.substring(5,7);
            momColor += actualGen[i].momColor.substring(5,7);
        } else if ( momBlueGene === solution.blueGene ) {
            childBlueGene = momBlueGene;
            dadColor += actualGen[j].dadColor.substring(5,7);
            momColor += actualGen[j].momColor.substring(5,7);
        } else /*if ((parseInt(dadBlueGene, 16) + 1) < 255 || (parseInt(momRedGene, 16) + 1) < 255)*/{
            if(parseInt(dadBlueGene, 16) < parseInt(momBlueGene, 16)) {
                aux = parseInt(dadBlueGene, 16);
                aux++;
                childBlueGene = aux.toString(16);
                aux = parseInt(actualGen[i].dadColor.substring(5,7),16) + 1;
                dadColor += aux.toString(16);
                aux = parseInt(actualGen[i].momColor.substring(5,7),16);
                momColor += aux.toString(16);
            } else {
                aux = parseInt(momBlueGene, 16);
                aux++;
                childBlueGene = aux.toString(16);
                aux = parseInt(actualGen[j].dadColor.substring(5,7),16) + 1;
                dadColor += aux.toString(16);
                aux = parseInt(actualGen[j].momColor.substring(5,7),16);
                momColor += aux.toString(16);
            }
        }

        child = {
            myColor: '#'+ childRedGene + childGreenGene + childBlueGene,
            dadColor: dadColor,
            momColor: momColor,
            redGene: childRedGene,
            greenGene: childGreenGene,
            blueGene: childBlueGene
        };
        console.log(child.myColor, child.dadColor, child.momColor);
        geracoes += "child: " + child.myColor + " dad: " + child.dadColor + " mom: " + child.momColor
        geracoes += '<p></p>'
        dadColor = "#";
        momColor = "#";
       nextGen[Object.keys(nextGen).length] = child;
    }
    console.log('');
    return nextGen;
};

var generatePopulation = function (actualGen) {
    var population = actualGen, color1 = "", color2 = "", redIntensity1, blueIntensity1,
        greenIntensity1, redIntensity2, blueIntensity2, greenIntensity2;

    for( var i = 0 ; i < 50 ; i++) {
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

        if(crossColor.length == 6 && Object.keys(population).length < 10) {
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
    return population;
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}