// CSV filenames for artist and song data
// let filenames = ["netflix_titles.csv"];

let indicesDict = {};
let actors = [];
let connections = [];

let NUM_ACTORS = 2;
let currIdx = 0;

let g3Width = 900;
let g3Height = 750;

let comparators = {0 : alphabeticalComp, 1:numActorsComp, 2:newYrsComparator, 3:oldYrsComparator};
let currComp = 2;

let svg3 = d3.select('#graph3')
.append("svg")
.attr("width", g3Width)     
.attr("height", g3Height)
.append("g");

function run(){

    svg3.selectAll("*").remove();
    

    svg3.append("svg")
    .attr("width", g3Width)     
    .attr("height", g3Height)
    .append("g");

let y_axis_label3 = svg3.append("g");
let labelsRef = svg3.append("g");

svg3.append("text")
    .attr("class","label") 
    .style("text-anchor", "middle")
    .text("hello?");

let y_axis_text3 = svg3.append("text")
    .attr("transform", 'translate(-105,135)')     
    .style("text-anchor", "middle");

let title3 = svg3.append("text")
.attr("transform", 'translate(150,-10)')     
    .style("text-anchor", "middle")
    .style("font-size", 12);

setData3();
}

// let svg3 = d3.select('#graph3')
//     .append("svg")
//     .attr("width", g3Width)     
//     .attr("height", g3Height)
//     .append("g");

// let y_axis_label3 = svg3.append("g");
// let labelsRef = svg3.append("g");

// svg3.append("text")
//     .attr("class","label") 
//     .style("text-anchor", "middle")
//     .text("hello?");

// let y_axis_text3 = svg3.append("text")
//     .attr("transform", 'translate(-105,135)')     
//     .style("text-anchor", "middle");

// let title3 = svg3.append("text")
// .attr("transform", 'translate(150,-10)')     
//     .style("text-anchor", "middle")
//     .style("font-size", 12);

function setData3() {
    
    currIdx = 0;
    indicesDict = {};
    actors = [];
    connections = [];
    connectionDict = [];

    currComp = document.getElementById("comparatorSelector").value;
    console.log(comparators[currComp]);
    d3.csv("netflix_titles.csv").then(function(data) {
        data = cleanDataDirectorActor(data, comparators[currComp], NUM_ACTORS);

    var link = svg3
        .selectAll("line")
        .data(connections)
        .enter()
        .append("line")
        .style("stroke", "#aaa");


    var node = svg3
        .selectAll("circle")
        .data(actors)
        .enter()
        .append("circle")
        .attr("r", 5)
        .style("fill", "rgb(0,191,191)")
        .on("mouseover", function(d) {	
            console.log(document.getElementById("cursorX"));
            document.getElementById("actorLabel").style.left = d3.mouse(this)[0]+200 + "px";
            document.getElementById("actorLabel").style.top = d3.mouse(this)[1]+125 + "px"; 
            document.getElementById("actorLabel").innerHTML = "   " + d['name'] + " ";
            document.getElementById("actorLabel").style.background = "darkgrey"; 
            document.getElementById("actorLabel").style.color = "white"; 
        })
        .on("mouseout", function(d){
            document.getElementById("actorLabel").innerHTML = "";
        });

    // Let's list the force we wanna apply on the network
    var simulation = d3.forceSimulation(actors)                
        .force("link", d3.forceLink()                             
                .id(d => d.id)                    
                .links(connections)                                  
        )
        .force("x", d3.forceX())
        .force("y", d3.forceY())
        .force("charge", d3.forceManyBody().strength(-50))        
        .force("center", d3.forceCenter(g3Width/2, g3Height/2))   
        .on("tick", updatePositions);

    function updatePositions() {
        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);
    }
        // Remove elements not in use if fewer groups in new dataset
        node.exit().remove();
        link.exit().remove();
    });
}


function cleanDataDirectorActor(data, comparator, num_ex){
    let iterations = num_ex; // data.length;
    data = data.sort(comparator);
    for(i = 0; i < iterations; i++){  
        if(data[i].type == "TV Show"){
            // console.log("continued");
            iterations += 1;
            continue;
        } 
        let currActors = data[i].cast.split(",");
        // console.log(currActors);
        for(j=0; j<currActors.length; j++){
            if(! (currActors[j] in indicesDict)){
                // console.log("adding");
                indicesDict[currActors[j]] = currIdx;
                actors.push({'id' : currIdx, 'name' : currActors[j]});
                currIdx += 1;
            }
        }
        for(h=0; h<currActors.length; h++){
            for(k=0; k<currActors.length; k++){
                if(currActors[h] == currActors[k]){
                    continue;
                } else {
                    connections.push({'source' : indicesDict[currActors[h]], 'target' : indicesDict[currActors[k]]});
                }
            }
        }
    }

    // console.log(actors);
    // console.log(connections);
    return [actors, connections];
}

function alphabeticalComp(a,b){
    return(b['title']-a['title']);
}

function numActorsComp(a,b){
    numA = a['cast'].split(",").length;
    numB = b['cast'].split(",").length;
    return(numB-numA);
}


function newYrsComparator(a,b){
    return(parseInt(a['release_year'])-parseInt(b['release_year']));
}

function oldYrsComparator(a,b){
    return(parseInt(b['release_year'])-parseInt(a['release_year']));
}

/**
 * Cleans the provided data using the given comparator then strips to first numExamples
 * instances
 */
function cleanData(data, comparator, numExamples) {
    // TODO: sort and return the given data with the comparator (extracting the desired number of examples)
    data = data.sort(comparator);
    data = data.slice(0, numExamples);
    return data;
}

function moreActors(){
    if(NUM_ACTORS < 40){
        NUM_ACTORS += 1;
    }
    document.getElementById("numActorsTitle").innerHTML = NUM_ACTORS + " titles   "
    // setData3();
    // console.log(NUM_ACTORS);
    run();
}

function lessActors(){
    if(NUM_ACTORS > 2){
        NUM_ACTORS -= 1;
    }
    document.getElementById("numActorsTitle").innerHTML = NUM_ACTORS + " titles "

    // setData3();
    // console.log(NUM_ACTORS);
    run();
}

function compareNumActors(){
    currComp = 1;
}

function compareYearsNew(){
    currComp = 2;
}

function compareYearsOld(){
    currComp = 3;
}


run();