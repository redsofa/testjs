var abs, calc_crosstab, chrscales, ci_by_group, colSums, count_groups, displayError, expand2vector, forceAsArray, formatAxis, getLeftRight, log10, log2, matrixExtent, matrixMax, matrixMaxAbs, matrixMin, maxdiff, mean_by_group, median, missing2null, pullVarAsArray, reorgLodData, rowSums, sd_by_group, selectGroupColors, sumArray, transpose, unique;

formatAxis = function(d, extra_digits) {
  var ndig;
  if (extra_digits == null) {
    extra_digits = 0;
  }
  d = d[1] - d[0];
  ndig = Math.floor(log10(d));
  if (ndig > 0) {
    ndig = 0;
  }
  ndig = Math.abs(ndig) + extra_digits;
  return d3.format("." + ndig + "f");
};

unique = function(x) {
  var k, len, output, results, v;
  output = {};
  for (k = 0, len = x.length; k < len; k++) {
    v = x[k];
    if (v) {
      output[v] = v;
    }
  }
  results = [];
  for (v in output) {
    results.push(output[v]);
  }
  return results;
};

pullVarAsArray = function(data, variable) {
  var i, results;
  results = [];
  for (i in data) {
    results.push(data[i][variable]);
  }
  return results;
};

reorgLodData = function(data, lodvarname) {
  var chr, i, j, k, l, len, len1, len2, lodcolumn, lodval, marker, o, pos, ref, ref1, ref2;
  if (lodvarname == null) {
    lodvarname = null;
  }
  data.posByChr = {};
  data.lodByChr = {};
  ref = data.chrnames;
  for (i = k = 0, len = ref.length; k < len; i = ++k) {
    chr = ref[i];
    data.posByChr[chr] = [];
    data.lodByChr[chr] = [];
    ref1 = data.pos;
    for (j = l = 0, len1 = ref1.length; l < len1; j = ++l) {
      pos = ref1[j];
      if (data.chr[j] === chr) {
        data.posByChr[chr].push(pos);
        if (!Array.isArray(data.lodnames)) {
          data.lodnames = [data.lodnames];
        }
        lodval = (function() {
          var len2, o, ref2, results;
          ref2 = data.lodnames;
          results = [];
          for (o = 0, len2 = ref2.length; o < len2; o++) {
            lodcolumn = ref2[o];
            results.push(data[lodcolumn][j]);
          }
          return results;
        })();
        data.lodByChr[chr].push(lodval);
      }
    }
  }
  if (lodvarname != null) {
    data.markers = [];
    ref2 = data.markernames;
    for (i = o = 0, len2 = ref2.length; o < len2; i = ++o) {
      marker = ref2[i];
      if (marker !== "") {
        data.markers.push({
          name: marker,
          chr: data.chr[i],
          pos: data.pos[i],
          lod: data[lodvarname][i]
        });
      }
    }
  }
  return data;
};

chrscales = function(data, width, chrGap, leftMargin, pad4heatmap) {
  var L, chr, chrEnd, chrLength, chrStart, cur, d, i, k, l, len, len1, maxd, ref, ref1, rng, totalChrLength, w;
  chrStart = [];
  chrEnd = [];
  chrLength = [];
  totalChrLength = 0;
  maxd = 0;
  ref = data.chrnames;
  for (k = 0, len = ref.length; k < len; k++) {
    chr = ref[k];
    d = maxdiff(data.posByChr[chr]);
    if (d > maxd) {
      maxd = d;
    }
    rng = d3.extent(data.posByChr[chr]);
    chrStart.push(rng[0]);
    chrEnd.push(rng[1]);
    L = rng[1] - rng[0];
    chrLength.push(L);
    totalChrLength += L;
  }
  if (pad4heatmap) {
    data.recwidth = maxd;
    chrStart = chrStart.map(function(x) {
      return x - maxd / 2;
    });
    chrEnd = chrEnd.map(function(x) {
      return x + maxd / 2;
    });
    chrLength = chrLength.map(function(x) {
      return x + maxd;
    });
    totalChrLength += chrLength.length * maxd;
  }
  data.chrStart = [];
  data.chrEnd = [];
  cur = leftMargin;
  if (!pad4heatmap) {
    cur += chrGap / 2;
  }
  data.xscale = {};
  ref1 = data.chrnames;
  for (i = l = 0, len1 = ref1.length; l < len1; i = ++l) {
    chr = ref1[i];
    data.chrStart.push(cur);
    w = Math.round((width - chrGap * (data.chrnames.length - pad4heatmap)) / totalChrLength * chrLength[i]);
    data.chrEnd.push(cur + w);
    cur = data.chrEnd[i] + chrGap;
    data.xscale[chr] = d3.scale.linear().domain([chrStart[i], chrEnd[i]]).range([data.chrStart[i], data.chrEnd[i]]);
  }
  return data;
};

selectGroupColors = function(ngroup, palette) {
  if (ngroup === 0) {
    return [];
  }
  if (palette === "dark") {
    if (ngroup === 1) {
      return ["slateblue"];
    }
    if (ngroup === 2) {
      return ["MediumVioletRed", "slateblue"];
    }
    if (ngroup <= 9) {
      return colorbrewer.Set1[ngroup];
    }
    return d3.scale.category20().range().slice(0, ngroup);
  } else {
    if (ngroup === 1) {
      return ["#bebebe"];
    }
    if (ngroup === 2) {
      return ["lightpink", "lightblue"];
    }
    if (ngroup <= 9) {
      return colorbrewer.Pastel1[ngroup];
    }
    return ["#8fc7f4", "#fed7f8", "#ffbf8e", "#fffbb8", "#8ce08c", "#d8ffca", "#f68788", "#ffd8d6", "#d4a7fd", "#f5f0f5", "#cc968b", "#f4dcd4", "#f3b7f2", "#f7f6f2", "#bfbfbf", "#f7f7f7", "#fcfd82", "#fbfbcd", "#87feff", "#defaf5"].slice(0, ngroup);
  }
};

expand2vector = function(input, n) {
  var i;
  if (input == null) {
    return input;
  }
  if (Array.isArray(input) && input.length >= n) {
    return input;
  }
  if (!Array.isArray(input)) {
    input = [input];
  }
  if (input.length > 1 && n > 1) {
    input = (function() {
      var results;
      results = [];
      for (i in d3.range(n)) {
        results.push(input[i % input.length]);
      }
      return results;
    })();
  }
  if (input.length === 1 && n > 1) {
    input = (function() {
      var results;
      results = [];
      for (i in d3.range(n)) {
        results.push(input[0]);
      }
      return results;
    })();
  }
  return input;
};

median = function(x) {
  var n, xv;
  if (x == null) {
    return null;
  }
  x = (function() {
    var k, len, results;
    results = [];
    for (k = 0, len = x.length; k < len; k++) {
      xv = x[k];
      if (xv != null) {
        results.push(xv);
      }
    }
    return results;
  })();
  n = x.length;
  if (!(n > 0)) {
    return null;
  }
  x.sort(function(a, b) {
    return a - b;
  });
  if (n % 2 === 1) {
    return x[(n - 1) / 2];
  }
  return (x[n / 2] + x[(n / 2) - 1]) / 2;
};

getLeftRight = function(x) {
  var i, k, l, len, n, o, ref, ref1, result, v, xdif;
  n = x.length;
  x.sort(function(a, b) {
    return a - b;
  });
  xdif = [];
  result = {};
  for (k = 0, len = x.length; k < len; k++) {
    v = x[k];
    result[v] = {};
  }
  for (i = l = 1, ref = n; 1 <= ref ? l < ref : l > ref; i = 1 <= ref ? ++l : --l) {
    xdif.push(x[i] - x[i - 1]);
    result[x[i]].left = x[i - 1];
  }
  for (i = o = 0, ref1 = n - 1; 0 <= ref1 ? o < ref1 : o > ref1; i = 0 <= ref1 ? ++o : --o) {
    result[x[i]].right = x[i + 1];
  }
  xdif = median(xdif);
  result.mediandiff = xdif;
  result[x[0]].left = x[0] - xdif;
  result[x[n - 1]].right = x[n - 1] + xdif;
  result.extent = [x[0] - xdif / 2, x[n - 1] + xdif / 2];
  return result;
};

maxdiff = function(x) {
  var d, i, k, ref, result;
  if (x.length < 2) {
    return null;
  }
  result = x[1] - x[0];
  if (x.length < 3) {
    return result;
  }
  for (i = k = 2, ref = x.length; 2 <= ref ? k < ref : k > ref; i = 2 <= ref ? ++k : --k) {
    d = x[i] - x[i - 1];
    if (d > result) {
      result = d;
    }
  }
  return result;
};

matrixMin = function(mat) {
  var i, j, result;
  result = mat[0][0];
  for (i in mat) {
    for (j in mat[i]) {
      if (result > mat[i][j]) {
        result = mat[i][j];
      }
    }
  }
  return result;
};

matrixMax = function(mat) {
  var i, j, result;
  result = mat[0][0];
  for (i in mat) {
    for (j in mat[i]) {
      if (result < mat[i][j]) {
        result = mat[i][j];
      }
    }
  }
  return result;
};

matrixMaxAbs = function(mat) {
  var i, j, result;
  result = Math.abs(mat[0][0]);
  for (i in mat) {
    for (j in mat[i]) {
      if (result < Math.abs(mat[i][j])) {
        result = Math.abs(mat[i][j]);
      }
    }
  }
  return result;
};

matrixExtent = function(mat) {
  return [matrixMin(mat), matrixMax(mat)];
};

d3.selection.prototype.moveToFront = function() {
  return this.each(function() {
    return this.parentNode.appendChild(this);
  });
};

d3.selection.prototype.moveToBack = function() {
  return this.each(function() {
    var firstChild;
    firstChild = this.parentNode.firstchild;
    if (firstChild) {
      return this.parentNode.insertBefore(this, firstChild);
    }
  });
};

forceAsArray = function(x) {
  if (x == null) {
    return x;
  }
  if (Array.isArray(x)) {
    return x;
  }
  return [x];
};

missing2null = function(vec, missingvalues) {
  if (missingvalues == null) {
    missingvalues = ['NA', ''];
  }
  return vec.map(function(value) {
    if (missingvalues.indexOf(value) > -1) {
      return null;
    } else {
      return value;
    }
  });
};

displayError = function(message, divid) {
  var div;
  if (divid == null) {
    divid = null;
  }
  div = "div.error";
  if (divid != null) {
    div += "#" + divid;
  }
  if (d3.select(div).empty()) {
    d3.select("body").insert("div", ":first-child").attr("class", "error");
  }
  return d3.select(div).append("p").text(message);
};

sumArray = function(vec) {
  var x;
  vec = (function() {
    var k, len, results;
    results = [];
    for (k = 0, len = vec.length; k < len; k++) {
      x = vec[k];
      if (x != null) {
        results.push(x);
      }
    }
    return results;
  })();
  if (!(vec.length > 0)) {
    return null;
  }
  return vec.reduce(function(a, b) {
    return (a * 1) + (b * 1);
  });
};

calc_crosstab = function(data) {
  var col, cs, i, k, l, ncol, nrow, ref, ref1, result, row, rs;
  nrow = data.ycat.length;
  ncol = data.xcat.length;
  result = (function() {
    var k, ref, results;
    results = [];
    for (row = k = 0, ref = nrow; 0 <= ref ? k <= ref : k >= ref; row = 0 <= ref ? ++k : --k) {
      results.push((function() {
        var l, ref1, results1;
        results1 = [];
        for (col = l = 0, ref1 = ncol; 0 <= ref1 ? l <= ref1 : l >= ref1; col = 0 <= ref1 ? ++l : --l) {
          results1.push(0);
        }
        return results1;
      })());
    }
    return results;
  })();
  for (i in data.x) {
    result[data.y[i]][data.x[i]] += 1;
  }
  rs = rowSums(result);
  cs = colSums(result);
  for (i = k = 0, ref = ncol; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
    result[nrow][i] = cs[i];
  }
  for (i = l = 0, ref1 = nrow; 0 <= ref1 ? l < ref1 : l > ref1; i = 0 <= ref1 ? ++l : --l) {
    result[i][ncol] = rs[i];
  }
  result[nrow][ncol] = sumArray(rs);
  return result;
};

rowSums = function(mat) {
  var k, len, results, x;
  results = [];
  for (k = 0, len = mat.length; k < len; k++) {
    x = mat[k];
    results.push(sumArray(x));
  }
  return results;
};

transpose = function(mat) {
  var i, j, k, ref, results;
  results = [];
  for (j = k = 0, ref = mat[0].length; 0 <= ref ? k < ref : k > ref; j = 0 <= ref ? ++k : --k) {
    results.push((function() {
      var l, ref1, results1;
      results1 = [];
      for (i = l = 0, ref1 = mat.length; 0 <= ref1 ? l < ref1 : l > ref1; i = 0 <= ref1 ? ++l : --l) {
        results1.push(mat[i][j]);
      }
      return results1;
    })());
  }
  return results;
};

colSums = function(mat) {
  return rowSums(transpose(mat));
};

log2 = function(x) {
  if (x == null) {
    return x;
  }
  return Math.log(x) / Math.log(2.0);
};

log10 = function(x) {
  if (x == null) {
    return x;
  }
  return Math.log(x) / Math.log(10.0);
};

abs = function(x) {
  if (x == null) {
    return x;
  }
  return Math.abs(x);
};

mean_by_group = function(g, y) {
  var i, means, n;
  means = {};
  n = {};
  for (i in g) {
    if (n[g[i]] != null) {
      if (y[i] != null) {
        means[g[i]] += y[i];
      }
      if (y[i] != null) {
        n[g[i]] += 1;
      }
    } else {
      if (y[i] != null) {
        means[g[i]] = y[i];
      }
      if (y[i] != null) {
        n[g[i]] = 1;
      }
    }
  }
  for (i in means) {
    means[i] /= n[i];
  }
  return means;
};

sd_by_group = function(g, y) {
  var dev, i, means, n, sds;
  means = mean_by_group(g, y);
  sds = {};
  n = {};
  for (i in g) {
    dev = y[i] - means[g[i]];
    if (n[g[i]] != null) {
      if (y[i] != null) {
        sds[g[i]] += dev * dev;
      }
      if (y[i] != null) {
        n[g[i]] += 1;
      }
    } else {
      if (y[i] != null) {
        sds[g[i]] = dev * dev;
      }
      if (y[i] != null) {
        n[g[i]] = 1;
      }
    }
  }
  for (i in sds) {
    sds[i] = n[i] < 2 ? null : Math.sqrt(sds[i] / (n[i] - 1));
  }
  return sds;
};

count_groups = function(g, y) {
  var i, n;
  n = {};
  for (i in g) {
    if (n[g[i]] != null) {
      if (y[i] != null) {
        n[g[i]] += 1;
      }
    } else {
      if (y[i] != null) {
        n[g[i]] = 1;
      }
    }
  }
  return n;
};

ci_by_group = function(g, y, m) {
  var ci, dev, i, means, n, sds;
  if (m == null) {
    m = 2;
  }
  means = mean_by_group(g, y);
  sds = {};
  n = {};
  for (i in g) {
    dev = y[i] - means[g[i]];
    if (n[g[i]] != null) {
      if (y[i] != null) {
        sds[g[i]] += dev * dev;
      }
      if (y[i] != null) {
        n[g[i]] += 1;
      }
    } else {
      if (y[i] != null) {
        sds[g[i]] = dev * dev;
      }
      if (y[i] != null) {
        n[g[i]] = 1;
      }
    }
  }
  for (i in sds) {
    sds[i] = n[i] < 2 ? null : Math.sqrt(sds[i] / (n[i] - 1));
  }
  ci = {};
  for (i in means) {
    ci[i] = {
      mean: means[i],
      low: n[i] > 0 ? means[i] - m * sds[i] / Math.sqrt(n[i]) : means[i],
      high: n[i] > 0 ? means[i] + m * sds[i] / Math.sqrt(n[i]) : means[i]
    };
  }
  return ci;
};
