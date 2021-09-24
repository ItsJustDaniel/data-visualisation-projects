const w = 1000;
const h = 500;
const padding = 60;
const barWidth = w / 275;

const barChart = d3
  .select(".visData")
  .append("svg")
  .attr("width", w + 100)
  .attr("height", h + 100)
  .attr("class", "BarChart");

const dataset = d3
  .json(
    "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json"
  )
  .then((data, i) => {
    console.log(data);
    // gets all the years also gets the max of the years
    let years = data.data.map((item) => new Date(item[0]));
    let xMax = d3.max(years);

    //gets all the values
    let values = data.data.map((item) => item[1]);

    //sets up the scale for the x axis and y axis
    const xScale = d3
      .scaleTime()
      .domain([d3.min(years), xMax])
      .range([60, w]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(values)])
      .range([0, h]);
    console.log(yScale(values[0]));
    //tooltip
    const tooltip = d3
      .select(".visData")
      .append("div")
      .attr("id", "tooltip")
      .style("opacity", 0)
      .style("background-color", "white")
      .style("color", "black")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px")
      .style("position", "absolute")
      .style("z-index", "1000");

    const mouseover = function (d) {
      tooltip.style("opacity", 1);
      d3.select(this).style("fill", "white").style("opacity", 1);
    };

    const mousemove = (i, d) => {
      console.log(i);
      tooltip
        .html(`${d[0]} <br> $${d[1]}`)
        .style("left", `${i.clientX + 30}px`)
        .style("top", `${h - 100}px`)
        .attr("data-date", d[0]);
    };
    var mouseleave = function (d) {
      tooltip.style("opacity", 0);
      d3.select(this).style("fill", "navy").style("opacity", 1);
    };

    //create bars
    barChart
      .selectAll("rect")
      .data(data.data)
      .enter()
      .append("rect")
      .attr("x", (d) => xScale(new Date(d[0])))
      .attr("y", (d) => h - yScale(d[1]))
      .attr("width", barWidth)
      .attr("height", (d) => yScale(d[1]))
      .attr("fill", "navy")
      .attr("class", "bar")
      .attr("data-gdp", (d) => d[1])
      .attr("data-date", (d) => d[0])
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);

    // create axis
    const yAxisScale = d3
      .scaleLinear()
      .domain([0, d3.max(values)])
      .range([h, 0]);

    const xAxis = d3.axisBottom().scale(xScale);
    const yAxis = d3.axisLeft(yAxisScale);

    barChart
      .append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${h})`)
      .call(xAxis);

    barChart
      .append("g")
      .attr("id", "y-axis")
      .attr("transform", `translate(${padding},0)`)
      .call(yAxis);
  });

// const xScale = d3.scaleLinear().domain(
//   0,
//   d3.max(dataset, (d) => console.log(parseInt(d[0].match(dataRegex)[0])))
// );

// const yScale = d3.scaleLinear();
