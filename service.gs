var t = HtmlService.createTemplateFromFile("index");
t.data = [];

function doGet(e) {
  return t.evaluate();
}

function doPost(request){
  if( request.parameter.code ){
    var meet_code = String(request.parameters.code);
    meet_code = meet_code.split("-").join("");
    var filterByCode = "meeting_code==" + meet_code;
    
    var linkDoc = generateReport(filterByCode);
    var msg = "Il report della riunione con codice:" + meet_code + " è presente al link:" + linkDoc;
    
    t.data["meet_code"] = meet_code;
    t.data["link_doc"] = linkDoc; 
    t.data["msg"] = msg;
    return t.evaluate();
  }
  else t.evaluate();
}