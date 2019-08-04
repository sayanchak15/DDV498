async function init() {



const yearAndPrice = await d3.csv("year-price-all.csv");
const yearmonthvolume = await d3.csv("year-month-volume.csv");
const monthyearregionconv = await d3.csv("month-year-region-conv.csv");

 
var margin = {top: 30, right: 30, bottom: 70, left: 60},
width = 460 - margin.left - margin.right,
height = 400 - margin.top - margin.bottom;
    
   var conventional = yearAndPrice.filter(function(d){
                                            return (d.Type ==='conventional')
                                        }) 
                                


//console.log(conventional);

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
    .data(conventional)
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
        byMonth(d, yearmonthvolume, monthyearregionconv); 
        document.getElementById("byregion").innerHTML = "";
        });
 }





 function byMonth(data, yearmonthvolume, monthyearregionconv){
     console.log(data);

  //  const avocado_full = await d3.csv("avocado.csv");
    var margin = {top: 30, right: 30, bottom: 70, left: 60},
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

var monthVolume = yearmonthvolume.filter(function(d){
           return (d.Year === data.Year && d.Type ==='conventional');
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
            byRegion(d, monthyearregionconv); 
            });
 }



 function byRegion(data, monthyearregionconv){
     
     var regionVolume = monthyearregionconv.filter(function(d){
        return (d.Month === data.Month && d.Year == data.Year);
     });
     console.log(regionVolume);
     var margin = {top: 30, right: 30, bottom: 70, left: 60},
     width = 800 - margin.left - margin.right,
     height = 800 - margin.top - margin.bottom;

     var regionVolume = monthyearregionconv.filter(function(d){
        return (d.Month === data.Month && d.Year === data.Year);
     });

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
            .domain([0, 2000])
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
            .attr("width", function(d) { return x(d.Volume); })
            .attr("fill", "#69b3a2");
 
}

function updateC(){
    console.log("Now OK?");

}

async function updateO(){

    document.getElementById("bymonth").innerHTML = "";
    document.getElementById("byregion").innerHTML = "";
    document.getElementById("my_dataviz").innerHTML = "";
    const yearAndPrice = await d3.csv("year-price-all.csv");

    var margin = {top: 30, right: 30, bottom: 70, left: 60},
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;
    
    var organic = yearAndPrice.filter(function(d){
                        return (d.Type = 'organic');
        })
    console.log(organic);

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
    .data(organic)
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
        byMonth(d, yearmonthvolume, monthyearregionconv); 
        document.getElementById("byregion").innerHTML = "";
        });
}


function truncateDecimals (num, digits) {
    var numS = num.toString(),
        decPos = numS.indexOf('.'),
        substrLength = decPos == -1 ? numS.length : 1 + decPos + digits,
        trimmedResult = numS.substr(0, substrLength),
        finalResult = isNaN(trimmedResult) ? 0 : trimmedResult;

    return parseFloat(finalResult);
}