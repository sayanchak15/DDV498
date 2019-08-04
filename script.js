async function init() {

const yearAndPrice = await d3.csv("year-price-all.csv");
//const yearmonthvolume = await d3.csv("year-month-volume.csv");
//const monthyearregionconv = await d3.csv("month-year-region-conv.csv");

                                
update('conventional');
 }



 async function byMonth(data){
     console.log(data);

    const yearmonthvolume = await d3.csv("year-month-volume.csv");
    var margin = {top: 30, right: 30, bottom: 70, left: 60},
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

var monthVolume = yearmonthvolume.filter(function(d){
           return (d.Year === data.Year && d.Type ===data.Type);
        });
console.log(monthVolume);

var svgMonth = d3.select("#bymonth")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform","translate(60, 60)");
    
     // X axis
var x = d3.scaleBand()
        .range([ 0, width ])
        .domain(yearmonthvolume.map(function(d) { return d.Month; }))
        .padding(0.2);
svgMonth.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))

// Add Y axis
var y = d3.scaleLinear()
        .domain([8.2, d3.max(monthVolume, function(d){return d.logVolume})])
        .range([ height, 0]);
svgMonth.append("g")
        .call(d3.axisLeft(y));

console.log(monthVolume);        

var tooltip = d3.select("#tooltip");

svgMonth.selectAll("rect")
        .data(monthVolume)
        .enter()
        .append("rect") // Add a new rect for each new elements
        .attr("x", function(d) { return x(d.Month); })
         .attr("y", function(d) { return y(d.logVolume); })
         .attr("width", x.bandwidth())
         .attr("height", function(d) { return height - y(d.logVolume); })
         .attr("fill", "#69b3a2")
         .on('mouseover', function(d,i) {
            console.log("mouse");
            tooltip.style("opacity", 1)
                    .style("left",(d3.event.pageX)+"px")
                    .style("top",(d3.event.pageY)+"px")
                    .html("Volume "+d.Volume+" Units in Month "+d.Month);})
        .on("mouseout", function() { tooltip.style("opacity", 0) })
         .on("click", function(d,i){
            console.log("click");
            document.getElementById("byregion").innerHTML = "";
            byRegion(d); 
            });
 }



 async function byRegion(data){
     
    const monthyearregion = await d3.csv("month-year-region.csv");
     var regionVolume = monthyearregion.filter(function(d){
        return (d.Month === data.Month && d.Year == data.Year && d.Type === data.Type);
     });
     console.log(regionVolume);
     var margin = {top: 30, right: 30, bottom: 70, left: 60},
     width = 800 - margin.left - margin.right,
     height = 800 - margin.top - margin.bottom;

     var svgRegion = d3.select("#byregion")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform","translate(100, 0)");

// Add Y axis            
var y = d3.scaleBand()
            .range([ 0, width ])
            .domain(regionVolume.map(function(d) { return d.Region; }))
            .padding(0.2);
        svgRegion.append("g")
        .call(d3.axisLeft(y))
    
    // Add X axis
var x = d3.scaleLinear()
            .domain([3, 9])
            .range([ 0, height]);
        svgRegion.append("g")
            .attr("transform", "translate(0," + (height +10)+ ")")
            .call(d3.axisBottom(x));

svgRegion.selectAll("rect")
        .data(regionVolume)
            .enter()
            .append("rect") // Add a new rect for each new elements
            .attr("x", 0)
            .attr("y", function(d) { return y(d.Region); })
            .attr("height", y.bandwidth())
            .attr("width", function(d) { return x(d.LogVolume); })
            .attr("fill", "#69b3a2");
 
}




function truncateDecimals (num, digits) {
    var numS = num.toString(),
        decPos = numS.indexOf('.'),
        substrLength = decPos == -1 ? numS.length : 1 + decPos + digits,
        trimmedResult = numS.substr(0, substrLength),
        finalResult = isNaN(trimmedResult) ? 0 : trimmedResult;

    return parseFloat(finalResult);
}

async function update(Type){
    document.getElementById("my_dataviz").innerHTML = "";
    document.getElementById("bymonth").innerHTML = "";
    const yearAndPrice1 = await d3.csv("year-price-all.csv");
    console.log(Type);
    var yearAndPrice = yearAndPrice1.filter(function(d){
        return (d.Type ===Type)
    }) 

     
    var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    var svg = d3.select("#my_dataviz")
                    .append("svg")
                     .attr("width", width + margin.left + margin.right)
                     .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                         .attr("transform","translate(" + margin.left + "," + margin.top + ")");


 // X axis
var x = d3.scaleBand()
            .range([ 0, width ])
            .domain(yearAndPrice.map(function(d) { return d.Year; }))
            .padding(0.2);
svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))

// Add Y axis
var y = d3.scaleLinear()
            .domain([1, 2])
            .range([ height, 0]);
svg.append("g")
        .attr("class", "myYaxis")
        .call(d3.axisLeft(y));

var tooltip = d3.select("#tooltip");

svg.selectAll("rect")
    .data(yearAndPrice)
    .enter()
    .append("rect") // Add a new rect for each new elements
    .attr("x", function(d) { return x(d.Year); })
    .attr("y", function(d) { return y(d.AvgPrice); })
    .attr("width", x.bandwidth())
    .attr("height", function(d) { return height - y(d.AvgPrice); })
    .attr("fill", "#69b3a2")
    .on('mouseover', function(d,i) {
        tooltip.style("opacity", 1)
                .style("left",(d3.event.pageX)+"px")
                .style("top",(d3.event.pageY)+"px")
                .html("Price $"+truncateDecimals(d.AvgPrice,2)+" in Year "+d.Year);})
    .on("mouseout", function() { tooltip.style("opacity", 0) })
    .on("click", function(d,i){
        console.log("click");
        document.getElementById("bymonth").innerHTML = "";
        byMonth(d); 
        document.getElementById("byregion").innerHTML = "";
        });
}