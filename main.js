
let width = 1000
let height = 400
let barWidth = width/275

var tooltip = d3.select("#barChartContainer").append("div")
                .attr("id", "tooltip")
                .style("opacity", 0)

let svgContainer = d3.select("#barChartContainer")
                        .append('svg')
                        .attr('width', width + 100)
                        .attr('height', height + 60)


 d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json').then( function(dataJson){
    console.log(dataJson)

    // -- Set up X axis
    let years = dataJson.data.map((element) => new Date(element[0]) )
    let yearMax = new Date(d3.max(years))
    let xScale = d3.scaleTime().domain([d3.min(years), yearMax]).range([0, width])
    let xAxis = d3.axisBottom() .scale(xScale)
        svgContainer.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', 'translate(60, 400)');

    // -- Set up Y axis
    let gdpData = dataJson.data.map((current) => current[1])
    let maxGdpData = d3.max(gdpData)
    let yAxisScale = d3.scaleLinear()
                        .domain([0, maxGdpData])
                        .range([height, 0]);
  
    let yAxis = d3.axisLeft(yAxisScale)
    
    svgContainer.append('g')
                .call(yAxis)
                .attr('id', 'y-axis')
                .attr('transform', 'translate(60, 0)')
                .call(g => g.selectAll(".tick:not(:first-of-type) line")
                .attr("stroke-opacity", 0.5)
                .attr("stroke-dasharray", "2,2"))


    // -- Set up bars
    let barLinearScale = d3.scaleLinear()
    .domain([0, maxGdpData])
    .range([0, height]);
    let linearFormattedGdpData = gdpData.map((current) => barLinearScale(current))

    d3.select('svg').selectAll('rect')
    .data(linearFormattedGdpData)
    .enter()
    .append('rect')
    .attr('data-date', function(d, i) {
      return dataJson.data[i][0]
    })
    .attr('data-gdp', function(d, i) {
      return dataJson.data[i][1]
    })
    .attr('class', 'bar')
    .attr('x', function(d, i) {
      return xScale(years[i]);
    })
    .attr('y', function(d, i) {
      return height - d;
    })
    .attr('width', barWidth)
    .attr('height', function(d) {
      return d;
    })
    .style('fill', '#3D3C3C')
    .attr('transform', 'translate(60, 0)')
    .on('mouseover', (d,i) => {
        tooltip.transition()
        .duration(200)
        .style('opacity', 1);
        tooltip.html(years[i] + '<br>' + '$' + gdpData[i].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + ' Billion')
            .attr('data-date', dataJson.data[i][0])
            .style('left', (i * barWidth) + 260 + 'px')
            .style('top', height - 100 + 'px')
            .style('transform', 'translateX(60px)');
    })
    .on('mouseout', () =>{
        tooltip.transition()
        .duration(200)
        .style('opacity', 0);
    })

})
