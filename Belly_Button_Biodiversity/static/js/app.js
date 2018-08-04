function buildMetadata(sample) {


  // @TODO: Complete the following function that builds the metadata panel
    
  // Use `d3.json` to fetch the metadata for a sample
    d3.json(`/metadata/${sample}`).then(function(data){
      // Use d3 to select the panel with id of `#sample-metadata`
      var metdat = d3.select("#sample-metadata");
      // Use `.html("") to clear any existing metadata
      metdat.html("")
      // Use `Object.entries` to add each key and value pair to the panel
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      console.log(`Metadata for sample #${sample}`)
      Object.entries(data).forEach(([key, value]) => console.log(`Key: ${key} ||| Value: ${value}`));
      Object.entries(data).forEach(([key, value]) => metdat.append("h6").text(`${key}: ${value}`));
    });

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
  }

function buildCharts(sample) {
    //* Create a Bubble Chart that uses data from your samples route (`/samples/<sample>`) to display each sample.

    // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(function(data){
    // @TODO: Build a Bubble Chart using the sample data    
    // * Use `otu_ids` for the x values
    // * Use `sample_values` for the y values
    // * Use `sample_values` for the marker size
    // * Use `otu_ids` for the marker colors
    // * Use `otu_labels` for the text values
    console.log(`Sample Data for sample #${sample}:`)
    console.log(data.otu_ids);
    console.log(data.sample_values);
    var trace = {
      x: data.otu_ids,
      y: data.sample_values,
      mode: 'markers',
      type: 'scatter',
      text: data.otu_labels,
      marker: { size: data.sample_values, color: data.otu_ids}
    };
    var plotdata = [trace];

    var layout = {
      xaxis: { title: "OTU ID"}
    };

    Plotly.newPlot("bubble",plotdata,layout)
  });

  d3.json(`/samples/${sample}`).then(function(data){
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each). 
    // function sortByKey(array, key) {
    //   return data.key.sort(function(a, b) {
    //       var x = a[key]; var y = b[key];
    //       return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    //   });
    //   }
      
    //   sorted_data = sortByKey(data, 'sample_values');
      
    //   console.log(sorted_data);


    console.log(`Top Ten Samples:`)
    console.log(data.sample_values.slice(0,10));
    // Use sample_values as the values for the PIE chart
    // Use otu_ids as the labels for the pie chart
    // Use otu_labels as the hovertext for the chart
    var trace = {
      labels: data.otu_ids.slice(0,10),
      values: data.sample_values.slice(0,10),
      type: 'pie',
      hoverinfo: data.otu_labels.slice(0,10)
    };
    var plotdata = [trace];

    var layout = {
      height: 400,
      width: 400
    };

    Plotly.newPlot("pie",plotdata,layout)
  });

}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
