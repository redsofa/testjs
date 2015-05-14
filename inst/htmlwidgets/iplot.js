HTMLWidgets.widget({
  name: "iplot",
  type: "output",
  initialize: function(el, width, height) {
    return d3.select(el).append("svg").attr("width", width).attr("height", height).attr("class", "testjs");
  },
  renderValue: function(el, x) {
    var axispos, chartOpts, data, height, margin, mychart, nxticks, nyticks, pointcolor, pointsize, pointstroke, rectcolor, ref, ref1, ref10, ref11, ref12, ref13, ref14, ref15, ref16, ref17, ref18, ref19, ref2, ref20, ref21, ref22, ref23, ref3, ref4, ref5, ref6, ref7, ref8, ref9, rotate_ylab, svg, title, titlepos, width, xNA, xlab, xlim, xticks, yNA, ylab, ylim, yticks;
    data = x.data;
    chartOpts = x.chartOpts;
    svg = d3.select(el).select("svg");
    chartOpts = (ref = x.chartOpts) != null ? ref : [];
    chartOpts.width = (ref1 = chartOpts != null ? chartOpts.width : void 0) != null ? ref1 : svg.attr("width");
    chartOpts.height = (ref2 = chartOpts != null ? chartOpts.height : void 0) != null ? ref2 : svg.attr("height");
    svg.attr("width", chartOpts.width);
    svg.attr("height", chartOpts.height);
    height = (ref3 = chartOpts != null ? chartOpts.height : void 0) != null ? ref3 : 500;
    width = (ref4 = chartOpts != null ? chartOpts.width : void 0) != null ? ref4 : 800;
    title = (ref5 = chartOpts != null ? chartOpts.title : void 0) != null ? ref5 : "";
    margin = (ref6 = chartOpts != null ? chartOpts.margin : void 0) != null ? ref6 : {
      left: 60,
      top: 40,
      right: 40,
      bottom: 40,
      inner: 5
    };
    xlab = (ref7 = chartOpts != null ? chartOpts.xlab : void 0) != null ? ref7 : "X";
    ylab = (ref8 = chartOpts != null ? chartOpts.ylab : void 0) != null ? ref8 : "Y";
    axispos = (ref9 = chartOpts != null ? chartOpts.axispos : void 0) != null ? ref9 : {
      xtitle: 25,
      ytitle: 30,
      xlabel: 5,
      ylabel: 5
    };
    titlepos = (ref10 = chartOpts != null ? chartOpts.titlepos : void 0) != null ? ref10 : 20;
    xlim = (ref11 = chartOpts != null ? chartOpts.xlim : void 0) != null ? ref11 : null;
    xticks = (ref12 = chartOpts != null ? chartOpts.xticks : void 0) != null ? ref12 : null;
    nxticks = (ref13 = chartOpts != null ? chartOpts.nxticks : void 0) != null ? ref13 : 5;
    ylim = (ref14 = chartOpts != null ? chartOpts.ylim : void 0) != null ? ref14 : null;
    yticks = (ref15 = chartOpts != null ? chartOpts.yticks : void 0) != null ? ref15 : null;
    nyticks = (ref16 = chartOpts != null ? chartOpts.nyticks : void 0) != null ? ref16 : 5;
    rectcolor = (ref17 = chartOpts != null ? chartOpts.rectcolor : void 0) != null ? ref17 : "#E6E6E6";
    pointcolor = (ref18 = chartOpts != null ? chartOpts.pointcolor : void 0) != null ? ref18 : null;
    pointsize = (ref19 = chartOpts != null ? chartOpts.pointsize : void 0) != null ? ref19 : 3;
    pointstroke = (ref20 = chartOpts != null ? chartOpts.pointstroke : void 0) != null ? ref20 : "black";
    rotate_ylab = (ref21 = chartOpts != null ? chartOpts.rotate_ylab : void 0) != null ? ref21 : null;
    xNA = (ref22 = chartOpts != null ? chartOpts.xNA : void 0) != null ? ref22 : {
      handle: true,
      force: false,
      width: 15,
      gap: 10
    };
    yNA = (ref23 = chartOpts != null ? chartOpts.yNA : void 0) != null ? ref23 : {
      handle: true,
      force: false,
      width: 15,
      gap: 10
    };
    mychart = scatterplot().height(height - margin.top - margin.bottom).width(width - margin.left - margin.right).margin(margin).axispos(axispos).titlepos(titlepos).xlab(xlab).ylab(ylab).title(title).ylim(ylim).xlim(xlim).xticks(xticks).nxticks(nxticks).yticks(yticks).nyticks(nyticks).rectcolor(rectcolor).pointcolor(pointcolor).pointsize(pointsize).pointstroke(pointstroke).rotate_ylab(rotate_ylab).xNA(xNA).yNA(yNA).xvar('x').yvar('y').dataByInd(false);
    d3.select(el).select("svg").datum({
      data: {
        x: data.x,
        y: data.y
      },
      group: data.group,
      indID: data.indID
    }).call(mychart);
    mychart.pointsSelect().on("mouseover", function(d) {
      return d3.select(this).attr("r", pointsize * 2);
    }).on("mouseout", function(d) {
      return d3.select(this).attr("r", pointsize);
    });
    return svg.append("text").attr("x", margin.left).attr("y", margin.top / 2).text(width + " x " + height).style("text-anchor", "start").style("dominant-baseline", "middle");
  },
  resize: function(el, width, height) {
    return d3.select(el).select("svg").attr("width", width).attr("height", height);
  }
});
