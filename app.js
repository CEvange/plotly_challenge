function buildMetadata(sample){
    d3.json("samples.json").then((samplesData) => {
        var metadata =samplesData.metadata;
        var resultsarray = metadata.filter(sampleobject =>
            sampleobject.id == sample);
        var results = resultsarray[0]
        var panel = d3.select("#sample-metadata");
        panel.html("");
        Object.entries(results).forEach(([key,value]) => {
            panel.append("h6").text(`${key}:${value}`);
        });
    });
}

function buildCharts(sample){
//Use the D3 library to read in samples.json
d3.json("samples.json").then((samplesData) => {
    var samples = samplesData.samples;
    var resultarray = samples.filter(sampleobject =>
        sampleobject.id == sample);
    var result = resultarray[0];
    var otu_id = result.otu_ids;
    var otu_label = result.otu_labels;
    var values = result.sample_values;
    
 // Bar Chart
    var trace1 =[{
        x: values.slice(0,10).reverse(),
        y: otu_id.slice(0,10).map(otuID=> `OTU ${otuID}`).reverse(),
        text: otu_label.slice(0,10).reverse(),
        type:"bar",
        orientation:"h",
        color: "blue"
    }];

    var trace1layout ={
        title:"Top 10 OTUs",
        showlegend: false,
          yaxis: {
            zeroline: false,
            gridwidth: 2
          },
          bargap :0.10
    };

    Plotly.newPlot("bar",trace1,trace1layout);


//Bubble Chart
    var trace2 =[{
        x: otu_id,
        y: values,
        text: otu_label,
        mode: "markers",
        marker: {
            color: otu_id,
            size:values
        }
    }];
    var trace2layout={
        xaxis: {title: "OTU ID"},
        hovermode: "closest",
    };
    Plotly.newPlot("bubble",trace2,trace2layout);
});
}



function init(){
    var dropdownMenu = d3.select("#selDataset");
    d3.json("samples.json").then((samplesData) => {
        var sample_names = samplesData.names;
        sample_names.forEach((sample) => {
            dropdownMenu
            .append("option")
            .text(sample)
            .property("value", sample);
        });
    
        const sample_one = sample_names[0];
        buildCharts(sample_one);
        buildMetadata(sample_one);
    });
}

function optionChanged(newdata){
    buildCharts(newdata);
    buildMetadata(newdata);
}

init();