// Boton Read More con su funcion. Se toma como parametro el atributo que al inspeccionar en consola se nota que cambia al hacer expandirse el boton.
const btn = document.getElementById('btn')
if(document.getElementById('btnId')){
  btn.addEventListener('click', function(){
    btnRead(btn.getAttribute("aria-expanded"))
})
}
function btnRead(determinador){determinador == 'true' ? btn.innerHTML = 'Read Less': btn.innerHTML = 'Read More'}

// Funcion que determina el html a afectar
if (document.getElementById('senateTable')) {
  fetchData('senate', 'tbodySenate')
} else {
  fetchData('house', 'tbodyHouse')
}

function fetchData(url, contenedor){
  fetch(`https://api.propublica.org/congress/v1/113/${url}/members.json`,{
    headers: {
      'X-API-Key': 'wYnEms56CSRvWCR8o3wnvmhy50vtvpa5pGZRwAFY'
    }})
  .then(respuesta => respuesta.json())
  .then(data => { 
    var data = data.results[0].members
    if(document.getElementById('tbodySenate') || document.getElementById('tbodyHouse')){
      generateTables(data, contenedor)
    // } else if(document.getElementById('attHouse') || document.getElementById('plHouse')){
    //   objectCreator(data)
    } else {
      objectCreator(data)
    }
  })
}
// Funcion que genera las respectivas tablas
function generateTables(data, contenedor){
  var tbody = document.getElementById(`${contenedor}`)
  for(var i=0; i<data.length; i++){
    var nuevoTr = document.createElement('tr')
    tbody.appendChild(nuevoTr)
    var name = document.createElement('td')
    var anchor = document.createElement('a')
    anchor.innerHTML = (`${data[i].first_name} ${data[i].middle_name || " "} ${data[i].last_name}`)
    // data[i].middle_name == null ? anchor.innerText = (data[i].first_name + " " + data[i].last_name) : anchor.innerText = (data[i].first_name + " " + data[i].middle_name + " "  + data[i].last_name) 
    anchor.className = 'aNames'
    anchor.setAttribute('href', data[i].url)
    anchor.setAttribute('target', '_blank')
    name.className = "tdMargin"
    name.appendChild(anchor) 
    nuevoTr.appendChild(name)
    var name = document.createElement('td')
    name.innerText = (data[i].party)
    nuevoTr.appendChild(name)
    var name = document.createElement('td')
    name.innerText = (data[i].state)
    nuevoTr.appendChild(name)
    var name = document.createElement('td')
    name.innerText = (data[i].seniority)
    nuevoTr.appendChild(name)
    var name = document.createElement('td')
    name.innerText = data[i].votes_with_party_pct.toFixed(2) + " %"
    nuevoTr.appendChild(name)
  }
}
// Attendance & Party loyalty
// Funcion que crea objeto y sus propiedades
var statistics = {}
function objectCreator(data){
  statistics.cantPersonas = data.length
  var democrats = 0
  var republicans = 0
  var independents = 0
  var democratsVotes = 0
  var republicansVotes = 0
  var independentsVotes = 0
  var filtered = []
  for(var i=0; i<data.length; i++){
    if(data[i].party == 'D' ){
      democrats++
      democratsVotes = democratsVotes + data[i].votes_with_party_pct
      statistics.membersDemocrats
    }else if(data[i].party == 'R' ){
      republicans++
      republicansVotes= republicansVotes + data[i].votes_with_party_pct
    }else if(data[i].party == 'ID' ){
      independents++
      independentsVotes = independentsVotes + data[i].votes_with_party_pct
    }
  }
  console.log(statistics)
  // Propiedades del objeto
  statistics.membersDemocrats = democrats
  statistics.membersRepublicans = republicans
  statistics.membersIndependents = independents
  statistics.promDemocratsVotes = parseFloat((democratsVotes / democrats).toFixed(2))
  statistics.promRepublicansVotes = parseFloat((republicansVotes / republicans).toFixed(2))
  statistics.promIndependentsVotes = parseFloat(independents != 0 ? (independentsVotes / independents).toFixed(2) : 0)
  // Llamo a la funcion creadora de la primer tabla pasandole los respectivos parametros
  createTable('Democrats', 'membersDemocrats', 'promDemocratsVotes')
  createTable('Republicans', 'membersRepublicans', 'promRepublicansVotes')
  createTable('Independents', 'membersIndependents', 'promIndependentsVotes')
  // Declaro las variables para realizar las tablas del 10%, primero ordenandolas y luego obteniendo ese 10pct
  var filtered = data.filter(filtro => filtro.total_votes !=0)
  console.log(filtered)
  var toSort = filtered.sort((a,b) => a.missed_votes_pct - b.missed_votes_pct )
  var tenPct = Math.ceil(statistics.cantPersonas * 0.10)
  var attPctMembersUp = toSort.slice(0, tenPct)
  var toSort = filtered.sort((a,b) => b.missed_votes_pct - a.missed_votes_pct)
  var attPctMembersDown = toSort.slice(0, tenPct)
  var sort = filtered.sort((a,b) => b.votes_with_party_pct - a.votes_with_party_pct )
  var plPctMembersUp = sort.slice(0, tenPct)
  var sort = filtered.sort((a,b) => a.votes_with_party_pct - b.votes_with_party_pct )
  var plPctMembersDown = sort.slice(0, tenPct)
// Llamo a cada tabla diferenciando si es Att o Pl
  if(document.getElementById('tbodyDos') || document.getElementById('tbodyTres')){
    pctTableCreator('tbodyDos', attPctMembersDown, 'missed_votes', 'missed_votes_pct')
    pctTableCreator('tbodyTres', attPctMembersUp, 'missed_votes', 'missed_votes_pct')
  } else {
    pctTableCreator('tbodyPl', plPctMembersDown, 'total_votes', 'votes_with_party_pct')
    pctTableCreator('tbodyPL', plPctMembersUp, 'total_votes', 'votes_with_party_pct')
  }
}
// Funcion creadora de la tabla de los miembros
function createTable(party, membersParty, membersPct){
  var tbody = document.getElementById('tbodyUno')
  var tr = document.createElement('tr')
  tbody.appendChild(tr)
  var td = document.createElement('td')
  td.innerHTML = `${party}`
  tr.appendChild(td)
  var td = document.createElement('td')
  td.innerHTML = statistics[membersParty]
  tr.appendChild(td)
  var td = document.createElement('td')
  td.innerHTML = statistics[membersPct]
  tr.appendChild(td)
}
// Funcion que crea las tablas del 10%
function pctTableCreator(ubicacion, data, paramVotes, paramVotesPct){
  var tbody = document.getElementById(ubicacion)
  for(var i=0; i<data.length; i++){
    var tr = document.createElement('tr')
    tbody.appendChild(tr)
    var td = document.createElement('td')
    td.innerHTML = data[i].first_name + " " + data[i].last_name
    tr.appendChild(td)
    var td = document.createElement('td')
    document.getElementById('tbodyDos') || document.getElementById('tbodyTres') ? td.innerHTML = data[i][paramVotes] : td.innerHTML = Math.ceil((data[i][paramVotes] - data[i].missed_votes) * data[i].votes_with_party_pct / 100.)
    tr.appendChild(td)
    var td = document.createElement('td')
    td.innerHTML = data[i][paramVotesPct].toFixed(2)
    tr.appendChild(td)
  }
}
