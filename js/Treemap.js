const w = 1200;
const h = 1000;
const padding = 40;
const barWidth = w / 275;

const Treemap = d3
  .select(".visData")
  .append("svg")
  .attr("width", w + 100)
  .attr("height", h + 100)
  .attr("class", "TreeMap Diagram");

const dataset = d3
  .json(
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json"
  )
  .then((data) => {
    console.log(data);

    //create cluster
    const root = d3
      .hierarchy(data)
      .sum((d) => {
        return d.value;
      })
      .sort(function (a, b) {
        return b.height - a.height || b.value - a.value;
      });
    //comput position
    d3
      .treemap()
      .size([w - 200, h - 100])
      .paddingInner(3)(root);
    console.log(root);

    const categories = root.data.children.map((d) => d.name);
    console.log(categories);
    const color = d3
      .scaleOrdinal()
      .domain(data.children.map((d) => d.name))
      .range([
        "#e6194B",
        "#3cb44b",
        "#ffe119",
        "#4363d8",
        "#f58231",
        "#911eb4",
        "#42d4f4",
        "#f032e6",
        "#bfef45",
        "#fabed4",
        "#469990",
        "#dcbeff",
        "#9A6324",
        "#fffac8",
        "#800000",
        "#aaffc3",
        "#808000",
        "#ffd8b1",
        "#000075",
        "#a9a9a9",
        "#ffffff",
        "#000000",
      ]);

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
      d3.select(this).style("opacity", 1);
    };

    const mousemove = (i, d) => {
      console.log(d);
      tooltip
        .html(
          `Name: ${d.data.name} <br>,Category: ${d.data.category}<br> Value ${d.data.value}`
        )
        .style("left", `${i.layerX + 55}px`)
        .style("top", `${i.layerY + 100}px`)
        .attr("data-value", d.data.value);
    };
    const mouseleave = function (d) {
      tooltip.style("display", "none");

      d3.select(this).style("stroke", "none").style("opacity", 1);
    };
    //create treemap

    Treemap.selectAll("rect")
      .data(root.leaves())
      .enter()
      .append("rect")
      .attr("class", "tile")
      .attr("x", (d) => d.x0 + padding)
      .attr("y", (d) => d.y0)
      .attr("width", (d) => d.x1 - d.x0)
      .attr("height", (d) => d.y1 - d.y0)
      .attr("fill", (d) => {
        return color(d.data.category);
      })
      .attr("stroke", "black")
      .attr("data-name", (d) => d.data.name)
      .attr("data-category", (d) => d.data.category)
      .attr("data-value", (d) => d.data.value)
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);

    const text = Treemap.selectAll("text")
      .data(root.leaves())
      .enter()
      .append("text")
      .attr("transform", function (d) {
        return `translate(${d.x0 + padding},${d.y0})`;
      })
      .attr("font-size", "5px")
      .style("font-size", "1rem")
      .style("margin", "0.5rem")
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);

    const tspan = text
      .selectAll("tspan")
      .data(function (d) {
        return d.data.name.split(/(?=[A-Z][^A-Z])/g);
      })
      .enter()
      .append("tspan")
      .attr("x", 4)
      .attr("y", function (d, i) {
        return 13 + i * 18;
      })
      .text(function (d) {
        return d;
      });

    //create legend

    const legend = Treemap.append("g").attr("id", "legend");

    legend
      .selectAll("dots")
      .data(categories)
      .enter()
      .append("rect")
      .attr("x", 1080)
      .attr("y", (d, i) => {
        return 10 + i * 25;
      })
      .attr("class", "legend-item")
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", (d) => {
        console.log(d);
        return color(d);
      });
    legend
      .selectAll("labels")
      .data(categories)
      .enter()
      .append("text")
      .attr("x", "1100")
      .attr("y", (d, i) => 20 + i * 25)
      .style("fill", (d) => color(d))
      .text((d) => d);
  });
