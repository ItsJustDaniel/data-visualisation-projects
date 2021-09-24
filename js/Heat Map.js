const screenHeight = 600;

const w = 1500;
const h = 500;
const padding = 60;
const barWidth = w / 275;

const legendWidth = 300;

const HeatMap = d3
  .select(".visData")
  .append("svg")
  .attr("width", w + 100)
  .attr("height", screenHeight + 100)
  .attr("class", "HeatMap");

const dataset = d3
  .json(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
  )
  .then((data, i) => {
    console.log(data);
    //temp

    //months
    let months = data.monthlyVariance.map((item) => item.month);

    //years
    let years = data.monthlyVariance.map((item) => item.year);

    //variance
    const variance = data.monthlyVariance.map((item) => item.variance);

    //create scales
    const xScale = d3
      .scaleBand()
      .domain(years.slice())
      .range([padding, w])
      .padding(0.01);

    const yScale = d3
      .scaleBand()
      .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
      .range([0, h])
      .padding(0.01);

    console.log(yScale(months[0]));
    const colour = d3
      .scaleLinear()
      .domain([d3.min(variance), d3.max(variance)])
      .range(["white", "red"]);

    //create Axis
    const xAxis = d3.axisBottom(xScale).tickValues(
      xScale.domain().filter((year) => {
        return year % 10 === 0;
      })
    );
    const yAxis = d3.axisLeft(yScale).tickFormat((month) => {
      const date = new Date(0);
      date.setMonth(month);
      return d3.timeFormat("%B")(date);
    });

    HeatMap.append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${h})`)
      .call(xAxis);

    HeatMap.append("g")
      .attr("id", "y-axis")
      .attr("transform", `translate(${padding},0)`)
      .call(yAxis);

    //create tooltip

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
      d3.select(this)
        .style("stroke", "black")
        .style("stroke-width", "1px")
        .style("opacity", 1);
    };

    const mousemove = (i, d) => {
      console.log(i);
      let time = d3.timeFormat("%B");
      const month = new Date(0);
      month.setMonth(d.month - 1);

      tooltip
        .html(
          `Year:${d.year} <br> Month: ${time(month)} <br> Temp: ${
            Math.round((data.baseTemperature + d.variance) * 1000) / 1000
          }`
        )
        .style("left", `${i.layerX + 30}px`)
        .style("top", `${i.clientY - 20}px`)
        .attr("data-year", d.year);
    };
    var mouseleave = function (d) {
      tooltip.style("display", "none");

      d3.select(this).style("stroke", "none").style("opacity", 1);
    };

    // create bars

    HeatMap.selectAll("rect")
      .data(data.monthlyVariance)
      .enter()
      .append("rect")
      .attr("x", (d, i) => xScale(years[i]))
      .attr("y", (d, i) => yScale(months[i] - 1))
      .attr("width", xScale.bandwidth())
      .attr("height", yScale.bandwidth())
      .style("fill", (d, i) => colour(variance[i]))
      .attr("class", "cell")
      .attr("data-month", (d, i) => months[i] - 1)
      .attr("data-year", (d, i) => years[i])
      .attr("data-temp", (d, i) => variance[i])
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);

    //create legend
    const baseTemp = data.baseTemperature;
    const minTemp = data.baseTemperature + d3.min(variance);
    const maxTemp = data.baseTemperature + d3.max(variance);

    console.log(minTemp);
    console.log(maxTemp);
    const legendX = d3
      .scaleLinear()
      .domain([minTemp, maxTemp])
      .range([0, legendWidth]);

    const legendColour = d3
      .scaleLinear()
      .domain([minTemp, maxTemp])
      .range(["white", "red"]);

    const legendAxis = d3.axisBottom(legendX);

    const legend = HeatMap.append("g")
      .attr("id", "legend")
      .attr("transform", `translate(${padding},600)`)
      .call(legendAxis);

    legend
      .selectAll("rect")
      .data([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13])
      .enter()
      .append("rect")
      .attr("x", (d, i) => legendX(d))
      .attr("y", -36)
      .attr("width", (d) => 20)
      .attr("height", (d) => 30)
      .style("fill", (d) => legendColour(d))
      .attr("stroke", "black");
  });
