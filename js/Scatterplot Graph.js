const w = 1000;
const h = 500;
const padding = 60;
const barWidth = w / 275;

const scatterplotChart = d3
  .select(".visData")
  .append("svg")
  .attr("width", w + 100)
  .attr("height", h + 100)
  .attr("class", "scatterplotChart");

const dataset = d3
  .json(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
  )
  .then((data, i) => {
    console.log(data);

    //get data
    let time = data.map((item) => item.Time);
    let years = data.map((item) => item.Year);

    const specifier = "%M:%S";
    const parsedData = time.map(function (d) {
      return d3.timeParse(specifier)(d);
    });

    console.log(years);

    //set up scales
    const xScale = d3
      .scaleLinear()
      .domain([d3.min(years) - 1, d3.max(years) + 1])
      .range([padding, w]);

    const yScale = d3.scaleTime().domain(d3.extent(parsedData)).range([0, h]);

    //tooltip
    const tooltip = d3
      .select(".visData")
      .append("div")
      .attr("id", "tooltip")
      .style("display", "none")
      .style("background-color", "white")
      .style("color", "black")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px")
      .style("position", "absolute");

    const mouseover = function (d) {
      tooltip.style("display", "block");
      d3.select(this).style("fill", "red").style("opacity", 1);
    };

    const mousemove = (i, d) => {
      console.log(d);
      tooltip
        .html(`Time: ${d.Time} <br> Years: ${d.Year}`)
        .style("left", `${i.clientX + 30}px`)
        .style("top", `${i.clientY - 20}px`)
        .attr("data-year", d.Year);
    };
    var mouseleave = function (d) {
      tooltip.style("display", "none");

      d3.select(this).style("fill", "black").style("opacity", 1);
    };

    //create legend
    scatterplotChart.append("g").attr("id", "legend");

    //create plots
    scatterplotChart
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d, i) => xScale(years[i]))
      .attr("cy", (d, i) => yScale(parsedData[i]))
      .attr("r", (d) => 5)
      .attr("class", "dot")
      .attr("data-xvalue", (d, i) => years[i])
      .attr("data-yvalue", (d, i) => parsedData[i])
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);

    //axis
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat(specifier));

    scatterplotChart
      .append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${h})`)
      .call(xAxis);

    scatterplotChart
      .append("g")
      .attr("id", "y-axis")
      .attr("transform", `translate(${padding},0)`)
      .call(yAxis);
  });
