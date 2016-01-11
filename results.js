//Obtain final results of the election 
function fetch_results(){
	var results=document.getElementById('results');
    var xmlhttp;
    var ballResults;
    if (window.XMLHttpRequest){
        xmlhttp=new XMLHttpRequest();
    }else{
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function(){
        if (xmlhttp.readyState==4 && xmlhttp.status==200) {
            var candidates = getCandidates(xmlhttp.responseText);
            getResults(function(response){
                ballResults=response.result;
                candWithVotes(candidates,ballResults);
            });
            
        }
    }
        xmlhttp.open('GET','candidatesList.json',true);
        xmlhttp.send(null);
}

//Obtain the array of names of the candidates with their respective id's.
function getCandidates(response){
    var json=JSON.parse(response);
    var output=json.candidates;
    return output;
}

//Set the "result" array to the global variable in order to be used later on.
function setVotes(response){
    var aux = response.votes;
    return aux;
}

//Call used to obtain the json information of the election results.
function getResults(callback){
    var xmlhttp;
    if (window.XMLHttpRequest){
        xmlhttp=new XMLHttpRequest();
    }else{
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function(){
        if (xmlhttp.readyState==4 && xmlhttp.status==200) {
            callback(JSON.parse(xmlhttp.responseText));
        }
    }
        xmlhttp.open('GET','results.json',true);
        xmlhttp.send(null);
}

//Match the names of the candidates with their respective votes and add the information to a table.
//It is assumed that the results are in the same order as the name of the candidates.
var info = [];
function candWithVotes(candidates, result){
    var ballotResults = "";
    var table = document.getElementById("bR");
    var totalVotes=0;
    for(var k=0;k<result.length;k++){
        totalVotes+=result[k].votes;
    }

    for(var j=0;j<candidates.length;j++){
        var percent = getPercentage(totalVotes,result[j].votes);
        var row=table.insertRow(j);
        var col1=row.insertCell(0);
        var col2=row.insertCell(1);
        col1.innerHTML = candidates[j].name;
        col2.innerHTML = "<img src='bar.png' width='"+percent+"' height='16' />"+result[j].votes;
        col2.className = "value";
        var arr = [candidates[j].name,result[j].votes];
        info.push.apply(info,arr);
    }
    drawChart(info);
    return ballotResults;
}

function getPercentage(total, partial){
    var per = (partial/total)*100;
    return per*3;
}

google.load("visualization", "1", {packages:["corechart"]});
function drawChart(info) {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Candidate');
    data.addColumn('number', 'Votes');
    for(var i=0;i<info.length;i++){
        data.addRow([info[i],info[i+1]]);
        i+=1;
    }

    var options = {
          is3D: true,
          backgroundColor:'#F0F8FF',
          chartArea: {left:275},
    };

    var chart = new google.visualization.PieChart(document.getElementById('pieR'));
        chart.draw(data,options);
}