// CSV filenames for artist and song data
// let filenames = ["netflix_titles.csv"];

let NUM_EXAMPLES = 2000000;
let totals = [];
let genresDict = {};
let genreKeys; 
let width = 900,
    height = 350;

let globalStart = 0;
let globalEnd = 10;
let maxGlobalEnd = 0;

const margin = {top: 40, right: 100, bottom: 40, left: 200};

let svg1 = d3.select('#graph1')
    .append("svg")
    .attr("width", width)    
    .attr("height", height)    
    .append("g")
    .attr("transform", "translate(150, 30)");

let x1 = d3.scaleLinear()
    .range([0, width-margin.left-margin.right]);


let y1 = d3.scaleBand()
    .range([0, height-margin.bottom-margin.top])
    .padding(0.1);  
let countRef1 = svg1.append("g");
let y_axis_label1 = svg1.append("g");

svg1.append("text")
    .attr("transform", 'translate(300,290)')     
    .style("text-anchor", "middle")
    .text("Count");

svg1.append("text")
    .attr("transform", 'translate(-130,150) rotate(270)')     
    .style("text-anchor", "middle")
    .text("Category");

let title1 = svg1.append("text")
.attr("transform", 'translate(150,-10)')    
    .style("text-anchor", "middle")
    .style("font-size", 15);

function setData1(isFirst, start, end) {
    d3.csv("netflix_titles.csv").then(function(data) {
        genreKeys = cleanDataGenres(data, compGenres, isFirst);

    currData = totals.slice(start,end);
    x1.domain([0, currData[0]['count']]);
        y1.domain(currData.map(function(d){return d['genre']}));
    
        y_axis_label1.call(d3.axisLeft(y1).tickSize(0).tickPadding(10));
        let bars = svg1.selectAll("rect").data(currData);
        bars.enter()
            .append("rect")
            .merge(bars)
            .transition()
            .duration(1000)
            .attr("x", x1(0))
            .attr("fill",d=>colorFill(d))
            .attr("y", function(d){return y1(d['genre']);})        
            .attr("width", function(d){return x1(d['count']);})
            .attr("height",  y1.bandwidth());            
            
        let counts = countRef1.selectAll("text").data(currData);

        counts.enter()
            .append("text")
            .merge(counts)
            .transition()
            .duration(1000)
            .attr("x", function(d){return x1(d['count'])+5;})       
            .attr("y", function(d){return y1(d['genre'])+12;})      
            .style("text-anchor", "start")
            .text(function(d){return d['count']});           
    
        title1.text("Average runtime of movies by release year");

        bars.exit().remove();
        counts.exit().remove();
    });
}

function compGenres(a, b){
    return(parseInt(b.count) - parseInt(a.count));
};

function colorFill(d){
    color1 = 0;
    color2 = 237-y1(d['genre'])*(243/255)/1.2;
    color3 = 119;
    return("rgb("+color1+","+color2+","+color3+")");
}


function cleanDataGenres(data, comparator, isFirst) {
    if(isFirst == 0){
        return Object.keys(genresDict);
    }
    for(i = 0; i < data.length; i++){
        let curr = data[i].listed_in.split(", ");
        for(k = 0; k < curr.length; k++){
            if(curr[k] in genresDict){
                genresDict[curr[k]] += 1;
            } else {
                genresDict[curr[k]] = 1;
            }
        }
    }
    let ks = Object.keys(genresDict);
    for (j = 0; j < ks.length; j++){
        totals.push({'genre' : ks[j], 'count' : genresDict[ks[j]]});
    }
    totals.sort(comparator)
    maxGlobalEnd = ks.length;
    return ks;
}

function cleanDataYearsRuntime(data, comparator, numExamples){
    data = data.sort(comparator);
    data = data.slice(0, numExamples);
    return data;
}

function genresUp(){
    if(globalStart > 0){
        globalStart--;
        globalEnd--;
    }
    setData1(0, globalStart, globalEnd);

}

function genresDown(){
    if(globalEnd < maxGlobalEnd){
        globalStart++;
        globalEnd++;
    }
    setData1(0, globalStart, globalEnd);
}


// On page load, render the barplot with the artist data
setData1(1, globalStart, globalEnd);

