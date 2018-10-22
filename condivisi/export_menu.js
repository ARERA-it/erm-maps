// Exporting data...
AmCharts.exportCFG.menu[0].menu.push({
    "label": "Salva i dati...",
    "menu": [
      {
        "label": "CSV",
        "click": function() {
          var mapData = [];
          this.setup.chart.dataProvider.areas.map(function(item) {
            mapData.push({
              Regione: item.title,
              Valore: item.value
            })
          });
          this.toCSV( {
            data: mapData
          }, function( data ) {
            this.download( data, this.defaults.formats.CSV.mimeType, [ filename(), "csv" ].join( "." ) );
          });
        }
      }, {
        "label": "XLSX",
        "click": function() {
          var mapData = [];
          this.setup.chart.dataProvider.areas.map(function(item) {
            mapData.push({
              Regione: item.title,
              Valore: item.value
            })
          });
          this.toXLSX( {
            data: mapData
          }, function( data ) {
            this.download( data, this.defaults.formats.XLSX.mimeType, [ filename(), "xlsx" ].join( "." ) );
          });
        }
      }, {
        "label": "JSON",
        "click": function() {
          var mapData = [];
          this.setup.chart.dataProvider.areas.map(function(item) {
            mapData.push({
              Regione: item.title,
              Valore: item.value
            })
          });
          this.toJSON( {
            data: mapData
          }, function( data ) {
            this.download( data, this.defaults.formats.JSON.mimeType, [ filename(), "json" ].join( "." ) );
          });
        }
      }]
  });
  
// AmCharts.exportCFG.menu[1].menu.push({
//     "label": "Annota"
// })


AmCharts.exportCFG.menu[0].menu[0]['label'] = "Scarica come..."
AmCharts.exportCFG.menu[0].menu[1]['label'] = "Salva i dati..."
AmCharts.exportCFG.menu[0].menu[2]['label'] = "Annota"
AmCharts.exportCFG.menu[0].menu[3]['label'] = "Stampa"
AmCharts.exportCFG.menu[0].menu[4]['label'] = "Salva i dati..."
