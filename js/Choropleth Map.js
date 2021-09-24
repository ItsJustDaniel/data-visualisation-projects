const w = 1000;
const h = 600;
const padding = 60;

console.log(topojson);

const ChoroplethMap = d3
  .select(".visData")
  .append("svg")
  .attr("width", w + 100)
  .attr("height", h + 100)
  .attr("class", "ChoroplethMap");

const files = [
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json",
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json",
];

Promise.all(files.map((url) => d3.json(url))).then(function (values) {
  const countyData = topojson.feature(
    values[1],
    values[1].objects.counties
  ).features;
  const educationData = values[0];
  console.log(countyData);
  console.log(educationData);
  //colour scale
  const colourScale = d3
    .scaleQuantize()
    .domain([
      d3.min(educationData, (d) => d.bachelorsOrHigher),
      d3.max(educationData, (d) => d.bachelorsOrHigher),
    ])
    .range([
      "#f7fbff",
      "#deebf7",
      "#c6dbef",
      "#9ecae1",
      "#6baed6",
      "#4292c6",
      "#2171b5",
      "#08519c",
      "#08306b",
    ]);

  //find county
  const findCounty = (d) => {
    let id = d["id"];

    let county = educationData.find((item) => {
      return item["fips"] === id;
    });

    return county;
  };

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
    const county = findCounty(d);

    tooltip
      .html(
        `${county.area_name}, ${county.state}: ${county.bachelorsOrHigher}%`
      )
      .style("left", `${i.layerX + 55}px`)
      .style("top", `${i.clientY + 100}px`)
      .attr("data-education", county.bachelorsOrHigher);
  };
  var mouseleave = function (d) {
    tooltip.style("display", "none");

    d3.select(this).style("stroke", "none").style("opacity", 1);
  };

  //draw map
  ChoroplethMap.append("g")
    .selectAll("path")
    .data(countyData)
    .enter()
    .append("path")
    .attr("d", d3.geoPath())
    .attr("class", "county")
    .attr("fill", (d) => {
      let county = findCounty(d);
      let percentage = county["bachelorsOrHigher"];
      return colourScale(percentage);
    })
    .attr("data-fips", (d) => findCounty(d).fips)
    .attr("data-education", (d) => findCounty(d).bachelorsOrHigher)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);

  //create legend
  const legendX = d3
    .scaleLinear()
    .domain([
      d3.min(educationData, (d) => d.bachelorsOrHigher),
      d3.max(educationData, (d) => d.bachelorsOrHigher),
    ])
    .range([0, 300]);

  const legendAxis = d3.axisBottom(legendX).tickFormat((d) => `${d}%`);

  const legend = ChoroplethMap.append("g")
    .attr("id", "legend")
    .attr("transform", `translate(${padding},650)`)
    .call(legendAxis)
    .selectAll("rect")
    .data([10, 20, 30, 40, 50, 60, 70])
    .enter()
    .append("rect")
    .attr("x", (d) => legendX(d) - 15)
    .attr("y", -36)
    .attr("width", (d) => 30)
    .attr("height", (d = 30))
    .style("fill", (d) => colourScale(d))
    .attr("stroke", "black");
});
