// Variable and function declarations
var stateData;
var x = 'income';
var y = 'smokes';

// Read in CSV file data
d3.csv("assets/data/data.csv").then(data => {
    stateData = data;
    parseData();
    graphD3();
});

// Function to parse data
function parseData() {
    stateData.forEach(function(data) {
        data.income = parseFloat(data.income);
        data.smokes = parseFloat(data.smokes);
        data.healthcare = parseFloat(data.healthcare);
        data.poverty = parseFloat(data.poverty);
        data.obesity = parseFloat(data.obesity);
        data.age = parseFloat(data.age);
    });
}

// Responsive window
function graphD3() {

    // if the SVG area isn't empty when the browser loads, clear it
    var svgArea = d3.select("#scatter").select("svg");
  
    // clear svg is not empty
    if (!svgArea.empty()) {
      svgArea.remove();
    };
  
    // SVG wrapper dimensions
    var svgWidth = window.innerWidth * 0.8;
    var svgHeight = window.innerHeight * 0.8;
  
    // Set margins
    var margin = {
      top: 50,
      bottom: 100,
      right: 50,
      left: 100
    };
  
    // Height and width determined with margins
    var height = svgHeight - margin.top - margin.bottom;
    var width = svgWidth - margin.left - margin.right;
  
    // Append SVG element
    var svg = d3.select("#scatter")
      .append("svg")
      .attr("height", svgHeight)
      .attr("width", svgWidth);
  
    // Append group element
    var chartGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    // Find min and max values to scale
    function xMinMax() {
        xMin = d3.min(stateData, d => d[x] * 0.9),
        xMax = d3.max(stateData, d => d[x] * 1.1)
      };
  
    function yMinMax() {
        yMin = d3.min(stateData, d => d[y] * 0.9),
        yMax = d3.max(stateData, d => d[y] * 1.1)
      };

    xMinMax();
    yMinMax();
    
    // Create scales
    var xScale = d3.scaleLinear()
        .domain(d3.extent(stateData, d => d[x]))
        .range([0, width]);
    var yScale = d3.scaleLinear()
        .domain(d3.extent(stateData, d => d[y]))
        .range([height, 0]);

    // Create axes
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    // Append axes
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .attr("class", "xAxis")
        .call(xAxis);

    chartGroup.append("g")
        .attr("class", "yAxis")
        .call(yAxis);

    // Initialize Tooltip
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([50, -50])
        .html(function(d) {
            return d.abbr});
        console.log(toolTip);

    // Create the tooltip in chartGroup
    chartGroup.call(toolTip);

    // Create "mouseover" and "mouseout" event listener
    chartGroup.on("mouseover", d => toolTip.show(d, this))
              .on("mouseout", d => toolTip.hide(d));

    // Append circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(stateData)
        .enter();

    circlesGroup   
        .append("circle")
        .attr("cx", d => xScale(d[x]))
        .attr("cy", d => yScale(d[y]))
        .attr("r", "15")
        .classed("stateCircle", true);

    // Text for the circles
    circlesGroup
        .append("text")
        .text(d => d.abbr)
        .attr("text-anchor", "middle")
        .attr("x", d => xScale(d[x]))
        .attr("y", d => yScale(d[y]))
        .attr("font-size", "8px")
        .classed("stateText", true);

    // X-axis label for Income
    var incomeLabel = chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top - 10})`)
        .attr("class", "clickableText active")
        .attr("name", "income")
        .attr("axis", "x")
        .text('Income ($)');

    // X-axis label for Poverty
    var povertyLabel = chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 10})`)
        .attr("class", "clickableText inactive")
        .attr("name", "poverty")
        .attr("axis", "x")
        .text('Poverty (%)');

    // X-axis label for Age
    var ageLabel = chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "clickableText inactive")
        .attr("name", "age")
        .attr("axis", "x")
        .text('Age (Years)');

    // Y-axis label for Smokes
    var smokesLabel = chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top})`)
        .attr("class", "clickableText active")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 60)
        .attr("x", 0 - (height / 2))
        .attr("name", "smokes")
        .attr("axis", "y")
        .text("Smokes (%)");

    // Y-axis label for Obesity
    var obesityLabel = chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top})`)
        .attr("class", "clickableText inactive")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("name", "obesity")
        .attr("axis", "y")
        .text('Obesity (%)');

    // Y-axis label for Healthcare
    var healthcareLabel = chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top})`)
        .attr("class", "clickableText inactive")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 20)
        .attr("x", 0 - (height / 2))
        .attr("name", "healthcare")
        .attr("axis", "y")
        .text('Healthcare (%)');
    
    function clickOption(axis, clickEvent) {
    // Switch active to inactive
        d3.selectAll(".clickableText")
            .filter(".active")
            .classed("active", false)
            .classed("inactive", true);

        clickEvent.classed("inactive", false).classed("active", true);
    }

    // Dynamic graph
    d3.selectAll(".clickableText").on("click", function() {
        // Select items
        let self = d3.select(this)

        // Select inactive
        if (self.classed("inactive")) {
            // Obtain name and axis to save
            var axis = self.attr("axis")
            var name = self.attr("name")

            if (axis === "x") {
                x = name;

                // Find new min and max
                xMinMax();
                xScale.domain([xMin, xMax]);

                svg.select(".xAxis")
                    .transition().duration(750)
                    .call(xAxis);
                
                // Update circles
                d3.selectAll("circle").each(function() {
                    d3.select(this)
                        .transition().duration(750)
                        .attr("cx", d => xScale(d[x]));
                });   

                // Text update
                d3.selectAll(".stateText").each(function() {
                    d3.select(this)
                        .transition().duration(750)
                        .attr("x", d => xScale(d[x]));
                });          
                // Update clicked option
                clickOption(axis, self);
                }

            // Update for Y axis selection 
            else {
                y = name;

                // Update min and max of range y
                yMinMax();
                yScale.domain([yMin, yMax]);

                svg.select(".yAxis")
                        .transition().duration(750)
                        .call(yAxis);

                // Update location of the circles
                d3.selectAll("circle").each(function() {
                    d3.select(this)
                        .transition().duration(750)
                        .attr("cy", d => yScale(d[y]));                    
                });   
                
                // Text update
                d3.selectAll(".stateText").each(function() {
                    d3.select(this)
                        .transition().duration(750)
                        .attr("y", d => yScale(d[y]));                          
                    });

                // change the classes to active and the clicked label
                clickOption(axis, self);
            }
        }
    });
};   
  
// When the browser window is resized, graphD3() is called.
d3.select(window).on("resize", graphD3);