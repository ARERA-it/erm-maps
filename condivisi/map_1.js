
// removing foreign regions: Vaticano, San Marino, Malta, Corsica
function only_italian_regions(element) {
  return element.id.startsWith("IT");
}
path = AmCharts.maps.italyHigh.svg.g.path;
AmCharts.maps.italyHigh.svg.g.path = path.filter(only_italian_regions);


function readSelectors() {
  var tip_cliente = $('#tip_cliente').val();
  var mercato = $('#mercato').val();
  var anno = $('#anno').val();

  // se vuoi i testi:
  // var tip_cliente = $('#tip_cliente option:selected').html();
  // var mercato = $('#mercato option:selected').html();
  // var anno = $('#anno option:selected').html();

  return { 'tip_cliente': tip_cliente, 'mercato': mercato, 'anno': anno}
}

function filename() {
  var sel = readSelectors();
  var fnm = [sel.tip_cliente, sel.mercato, sel.anno].join('_');
  return fnm;
}

labelHash = {
  "bt_dom": "BT domestici",
  "bt_altri": "BT altri usi",
  "magg_tutela": "Maggior tutela",
  "mercato_lib": "Mercato libero",
  "salvaguardia": "Salvaguardia"
}

function decodeLabel(code) {
  var string = labelHash[code];
  if (string == null) {
    return "Undefined ("+code+")";
  } else {
    return labelHash[code];
  }
}

function normlz(string) {
  return string.toLowerCase().split(' ').join('_');
}



function buildSelectorL1(h=Arera.hash, currSelL1=Object.keys(h)[0]) {
  $('#tip_cliente').empty();
  for (var k in h) {
    $('#tip_cliente').append("<option value="+k+">"+h[k].text+"</option>");
  }
  $('#tip_cliente').val(currSelL1);
  buildSelectorL2(h[currSelL1].chld); // Potrei passare solo l'albero da qui in giù...
}

function buildSelectorL2(h, currSelL2=Object.keys(h)[0]) {
  $('#mercato').empty();
  for (var k in h) {
    $('#mercato').append("<option value="+k+">"+h[k].text+"</option>");
  }
  $('#mercato').val(currSelL2);
  buildSelectorL3(h[currSelL2].chld); 
}

function buildSelectorL3(arr, currSelL3=arr[0]) {
  $('#anno').empty();
  for (var idx in arr) {
    $('#anno').append("<option value="+arr[idx]+">"+arr[idx]+"</option>");
  }
  $('#anno').val(currSelL3);
}


function buildSelectors(h) {
  buildSelectorL1(h);
}

function refreshSelectors(params) {
  $('#tip_cliente').html("");
}

// Ricostruisce l'albero delle categorie
// -------------------------------------
// { 'bt_dom': {
//     'text': 'BT domestici',
//     'chld': {
//       'magg_tutela': {
//         'text': 'Maggior tutela',
//         'chld': ['2012', '2013', ...]
//       },
//       'mercato_lib': {
//         'text': 'Mercato libero',
//         'chld': ['2012', '2013', ...]
//       }       
//     }
//   }
// }
function readDataStruct(array) {
  var hash = {};
  $.each(array, function(idx, el){
    var key1 = el.tip_cliente
    var txt1 = decodeLabel(key1);
    if (!hash.hasOwnProperty(key1)) {
      hash[key1] = { 'text': txt1, 'chld': {}};
    }
    var key2 = el.mercato;
    var txt2 = decodeLabel(key2);
    if (!hash[key1].chld.hasOwnProperty(key2)) {
      hash[key1].chld[key2] = { 'text': txt2, 'chld': []};
    }
    if (!hash[key1].chld[key2].chld.includes(el.anno)) {
      hash[key1].chld[key2].chld.push(el.anno);
    }
  });
  Arera.hash = hash;
  buildSelectors(hash);
}


function loadData() {
  AmCharts.loadFile( "https://raw.githubusercontent.com/ARERA-it/erm-maps/master/dati/versione_1.csv", {}, function( response ) {    
    var data = AmCharts.parseCSV( response, {"delimiter": ",", "useColumnNames": true, "skip": 1});
    Arera.data = data;
    
    readDataStruct(data);
    drawMap();   
  });
}

function drawMap() {
  Arera.map = AmCharts.makeChart("map_1",
  {
    "type": "map",
    "language": "fr",
    "colorSteps": 40,
    "balloonLabelFunction": function(item, map) {
      var label = item.title+": "
      if (isNaN(item.value)) {
        return label+"valore non disponibile";
      } else {
        return label+item.value+"%";
      }
    },
    "areasSettings": {
      autoZoom: true,
      // balloonText: "[[title]]: [[value]]%"
    },
    "dataProvider": { 
      "map": "italyHigh",
      "areas": readData()
    },
    "colorSteps": 40,
    "valueLegend": {
      right: 10,
      minValue: 0,
      maxValue: 100
    },
    "forceNormalize": false,
    "minValue": 0,
    "maxValue": 100,
    "export": AmCharts.exportCFG
  });
}

function percents(float) {
  if (float == null) {
    return null;
  }
  return Math.round(float * 1000) / 10;
}

function redrawMap(selectors=readSelectors()) {
  Arera.map.dataProvider.areas = readData(selectors);
  Arera.map.validateData();
}


function readData(selectors=readSelectors()) {
  var filteredRows = Arera.data.filter(function(row) {
    return row.tip_cliente==selectors.tip_cliente &&
    row.mercato==selectors.mercato &&
    row.anno==selectors.anno;
  })
  var result = $.map(filteredRows, function(row) {
    return { id: row.id, value: percents(parseFloat(row.valore)) } // 
  })
  return result;  
}






Arera = {};
loadData();


$('document').ready(function() {
    $('.map_dropdown').change(function(){
    var v = readSelectors();
    var level_changed = $(this).attr('id'); // id del dropdown (<select> tag) che è stato cambiato
    // 'tip_cliente', 'mercato', 'anno'
    var value = $(this).val(); // 'mercato_lib'
    
    if (level_changed=='tip_cliente') {
      buildSelectorL2(Arera.hash[value].chld);
      
    } else if (level_changed=='mercato') {
      var tip_cliente = $('#tip_cliente').val();
      buildSelectorL3(Arera.hash[tip_cliente].chld[value].chld);
    }
    redrawMap(v);
  })
})

