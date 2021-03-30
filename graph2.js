
let yearsDictM = {};
let yearsDictT = {};
let yearsCountM = {};
let yearsCountT = {};

let movieData = [];
let tvData = [];

let durationStart = 0;
let durationEnd = 10;
let maxDurationStart = 0;
let tv = 0;
// TODO: Set up SVG object with width, height and margin
let svg2 = d3.select('#graph2')
    .append("svg")
    .attr("width", width)     // HINT: width
    .attr("height", height)     // HINT: height
    .append("g")
    .attr("transform", "translate(150, 30)");

// TODO: Create a linear scale for the x axis (number of occurrences)
let x2 = d3.scaleLinear()
    .range([0, width-margin.left-margin.right]);

// TODO: Create a scale band for the y axis (artist)
let y2 = d3.scaleBand()
    .range([0, height-margin.bottom-margin.top])
    .padding(0.1);  // Improves readability
/*
    Here we will create global references to the x and y axis with a fixed range.
    We will update the domain of the axis in the setData function based on which data source
    is requested.
 */

// Set up reference to count SVG group
let countRef2 = svg2.append("g");
// Set up reference to y axis label to update text in setData
let y_axis_label2 = svg2.append("g");

// TODO: Add x-axis label
svg2.append("text")
    .attr("transform", 'translate(300,290)')       // HINT: Place this at the bottom middle edge of the graph
    .style("text-anchor", "middle")
    .text("Count");
// Since this text will not update, we can declare it outside of the setData function


// TODO: Add y-axis label
let y_axis_text2 = svg2.append("text")
    .attr("transform", 'translate(-105,135)')       // HINT: Place this at the center left edge of the graph
    .style("text-anchor", "middle");

// TODO: Add chart title
let title2 = svg2.append("text")
.attr("transform", 'translate(150,-10)')     // HINT: Place this at the top middle edge of the graph
    .style("text-anchor", "middle")
    .style("font-size", 15);

    svg2.append("text")
    .attr("transform", 'translate(-80,150) rotate(270)')     
    .style("text-anchor", "middle")
    .text("Year");



/**
 * Sets the data on the barplot using the provided index of valid data sources and an attribute
 * to use for comparison
 */
function setData2(isFirst, start, end) {
    d3.csv("netflix_titles.csv").then(function(data) {
    // genreKeys = cleanDataGenres(data, compGenres, isFirst);
    // console.log(extremes);
    if (isFirst == 1){
        keys = cleanDataDuration(data, compYears, isFirst);
        movieKeys = keys[0];
        tvKeys = keys[1];
        movieData = movieData.reverse();
        tvData = tvData.reverse();
    }

    if (tv == 0){
    maxDurationStart = movieKeys.length;
    let currMovieData = movieData.slice(start,end);
    currMovieData.sort(compYears);
    x2.domain([0, maxMovie(currMovieData)]);
    y2.domain(currMovieData.map(function(d){return d['year']}));
    y_axis_label2.call(d3.axisLeft(y2).tickSize(0).tickPadding(10));
    let bars = svg2.selectAll("rect").data(currMovieData);
    bars.enter()
        .append("rect")
        .merge(bars)
        .transition()
        .duration(1000)
        .attr("x", x2(0))
        .attr("fill",d=>colorFillB(d))
        .attr("y", function(d){return y2(d['year']);})               // HINT: Use function(d) { return ...; } to apply styles based on the data point
        .attr("width", function(d){return x2(d['count']);})
        .attr("height",  y2.bandwidth());        // HINT: y.bandwidth() makes a reasonable display height
        let counts = countRef2.selectAll("text").data(currMovieData);
        counts.enter()
            .append("text")
            .merge(counts)
            .transition()
            .duration(1000)
            .attr("x", function(d){return x2(d['count'])+5;})       // HINT: Add a small offset to the right edge of the bar, found by x(d.count)
            .attr("y", function(d){return y2(d['year'])+12;})       // HINT: Add a small offset to the top edge of the bar, found by y(d.artist)
            .style("text-anchor", "start")
            .text(function(d){return d['count']});           // HINT: Get the count of the artist
        movie_tv = "Movies"
    } else if (tv == 1){
        maxDurationStart = tvKeys.length;
        console.log(tvData);
        let currTvData = tvData.slice(start,end);
        x2.domain([0, maxMovie(currTvData)]);
        y2.domain(currTvData.map(function(d){return d['year']}));
        y_axis_label2.call(d3.axisLeft(y2).tickSize(0).tickPadding(10));
        let bars = svg2.selectAll("rect").data(currTvData);
        bars.enter()
            .append("rect")
            .merge(bars)
            .transition()
            .duration(1000)
            .attr("x", x2(0))
            .attr("fill",d=>colorFillC(d))
            .attr("y", function(d){return y2(d['year']);})               // HINT: Use function(d) { return ...; } to apply styles based on the data point
            .attr("width", function(d){return x2(d['count']);})
            .attr("height",  y2.bandwidth());        // HINT: y.bandwidth() makes a reasonable display height
            let counts = countRef2.selectAll("text").data(currTvData);
            counts.enter()
                .append("text")
                .merge(counts)
                .transition()
                .duration(1000)
                .attr("x", function(d){return x2(d['count'])+5;})       // HINT: Add a small offset to the right edge of the bar, found by x(d.count)
                .attr("y", function(d){return y2(d['year'])+12;})       // HINT: Add a small offset to the top edge of the bar, found by y(d.artist)
                .style("text-anchor", "start")
                .text(function(d){return d['count']});           // HINT: Get the count of the artist
            movie_tv = "TV Shows"
    }


        title2.text("Average Runtime of "+ movie_tv + " by Release Year");
        // bars.exit().remove();
        // counts.exit().remove();
    });
}

function colorFillB(d){
    color1 = 0;
    color2 = x2(d['count'])/3.2;
    color3 = 119;
    return("rgb("+color1+","+color2+","+color3+")");
}

function colorFillC(d){
    color1 = 0;
    color2 = x2(d['count'])/3.2;
    color3 = 119;
    return("rgb("+color1+","+color2+","+color3+")");
}

function compYears(a, b){
    return(parseInt(b.release_year) - parseInt(a.release_year));
};

function cleanDataDuration(data, comparator, isFirst) {
    // TODO: sort and return the given data with the comparator (extracting the desired number of examples)
    
    // data = data.slice(0, numExamples);
    if(isFirst == 0){
        return [Object.keys(yearsDictM), Object.keys(yearsDictT)];
    }
    for(i = 0; i < data.length; i++){
        let type = data[i].type
        if(type == "TV Show"){
            let seasons = data[i].duration.split(" Season");
            if(data[i].release_year in yearsDictT){
                yearsDictT[data[i].release_year] += parseInt(seasons[0]);
                yearsCountT[data[i].release_year] += 1
            } else {
                yearsDictT[data[i].release_year] = parseInt(seasons[0]); 
                yearsCountT[data[i].release_year] = 1
            }
        } else if(type == "Movie"){
            let dur = data[i].duration.split(" min");
            if(data[i].release_year in yearsDictM){
                yearsDictM[data[i].release_year] += parseInt(dur);
                yearsCountM[data[i].release_year] += 1
            } else {
                yearsDictM[data[i].release_year] = parseInt(dur); 
                yearsCountM[data[i].release_year] = 1
            }
        }
    }
    
    let movieKeys = Object.keys(yearsDictM);
    let tvKeys = Object.keys(yearsDictT);
    
    for(m=0; m<movieKeys.length; m++){
        yearsDictM[movieKeys[m]] = parseInt(yearsDictM[movieKeys[m]] / yearsCountM[movieKeys[m]])
    }
    
    for(t=0; t<tvKeys.length; t++){
        yearsDictT[tvKeys[t]] = parseInt(yearsDictT[tvKeys[t]] / yearsCountT[tvKeys[t]])
    }
    
    for (j = 0; j < movieKeys.length; j++){
        movieData.push({'year' : movieKeys[j], 'count' : yearsDictM[movieKeys[j]]});
    }
    for (k = 0; k < tvKeys.length; k++){
        tvData.push({'year' : tvKeys[k], 'count' : yearsDictT[tvKeys[k]]});
    }
    return [movieKeys, tvKeys];
}

function cleanDataYearsRuntime(data, comparator, numExamples){
    data = data.sort(comparator);
    data = data.slice(0, numExamples);
    return data;
}

function maxMovie(data){
    let max=-1;
    for (i=0; i<data.length; i++){
        if (data[i].count > max){
            max = data[i].count;
        }
    }
    return max;
}
function yearsUp(){
    if(durationStart > 0){
        durationStart--;
        durationEnd--;
    }
    setData2(0, durationStart, durationEnd);

}

function yearsDown(){
    if(durationEnd < maxDurationStart){
        durationStart++;
        durationEnd++;
    }
    setData2(0, durationStart, durationEnd);
}

function switchTv(){
    if(tv == 0){
        tv = 1;
        setData2(0, durationStart, durationEnd)
    } else {
        tv = 0;
        setData2(0, durationStart, durationEnd)
    }
}

// On page load, render the barplot with the artist data
setData2(1, durationStart, durationEnd);

