// Exporting data...
AmCharts.exportCFG.menu[0].menu.push({
    "label": "Save data...",
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
            this.download( data, this.defaults.formats.CSV.mimeType, [ "Mappa_Italia", "csv" ].join( "." ) );
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
            this.download( data, this.defaults.formats.XLSX.mimeType, [ "Mappa_Italia", "xlsx" ].join( "." ) );
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
            this.download( data, this.defaults.formats.JSON.mimeType, [ "Mappa_Italia", "json" ].join( "." ) );
          });
        }
      }]
  });
  