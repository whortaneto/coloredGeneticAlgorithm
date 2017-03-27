var GA = require('./genetic.js');

exports.defineColor = function (color) {
    var fs = require("fs");
    var knowledge = JSON.parse(fs.readFileSync("./knowledgebase.json",
        "utf8"));
    var resultado;

    if(haveIndividual(knowledge, {myColor: color})) {
        resultado = knowledge[getIndexOfSolution(knowledge, {myColor: color})];
    } else {
        knowledge[Object.keys(knowledge).length] = GA.evolvePopulation({
                myColor: color,
                redGene: color.substring(1,3),
                greenGene: color.substring(3,5),
                blueGene: color.substring(5,7)});

        fs.writeFile( "knowledgebase.json", JSON.stringify( knowledge ), "utf8");
        resultado = knowledge[getIndexOfSolution(knowledge, {myColor: color})];
        resultado.geracoes = GA.getGenerations();
    }
    return resultado;
};

var haveIndividual = function (data, solution){
    for(var i = 0 ; i < Object.keys(data).length; i++) {
        if(data[i].myColor === solution.myColor) {
            return true;
        }
    }
    return false;
};

var getIndexOfSolution = function (actualGen, solution) {
    for(var i = 0 ; i < Object.keys(actualGen).length; i++) {
        if(actualGen[i].myColor === solution.myColor) {
            return i;
        }
    }
    return -1;
};