// Some code
var artIns = MyTask.getArtInstance();
var dataMap = artIns.getAppDataMap();

//var documentsNo = dataMap.get("txtDocumentsNo");
//var applicantName = dataMap.get("txtApplicantName");
//var nowTime = new Packages.java.text.SimpleDateFormat("YY/MM/dd HH:mm").format(Server.getServerTime());

var from = "eip@sushiexpress.com.tw";
var to = "";
var cc = "";
var etID = "ETP30101634807347700";
var fileList = new java.util.Vector();

//取人員資料
var applicantId = dataMap.get("hdfApplicantId");					//取申請人

var applicantEmail = Server.getMemberByID(applicantId).getEmail();
to += applicantEmail + ";";

/*
var tblApplicantDirector = dataMap.get("tblApplicantDirector");		//取申請人主管
var tblCountersign = dataMap.get("tblCountersign");					//取會簽人員
var tblBO = dataMap.get("tblBO");									//取BO人員
var tblModuleIT = dataMap.get("tblModuleIT");						//取模組資訊
var itPMId = dataMap.get("hdfITPMId");								//取ITPM
var tblITdirector = dataMap.get("tblITDirector");					//取資訊部主管
var tblITStaff = dataMap.get("tblITStaff");							//取資訊處理人
var acceptanceId = dataMap.get("hdfAcceptanceId");					//取驗收人員

var serviceType3 = dataMap.get("ddlServiceType3");

if (serviceType3.equals("新專案需求") || serviceType3.equals("功能新增/功能優化")){
  var applicantEmail = Server.getMemberByID(applicantId).getEmail();
  to += applicantEmail + ";";
  for (var i = 0; i < tblApplicantDirector.size(); i++){
    var applicantDirector = tblApplicantDirector.get(i)
    var applicantDirectorId = applicantDirector.get("ITEM1");
    var applicantDirectorEmail = Server.getMemberByID(applicantDirectorId).getEmail();
    to += applicantDirectorEmail + ";";
  }
  for (var i = 0; i < tblCountersign.size(); i++){
    var countersign = tblCountersign.get(i)
    var countersignId = countersign.get("ITEM1");
    var countersignEmail = Server.getMemberByID(countersignId).getEmail();
    to += countersignEmail + ";";
  }
  for (var i = 0; i < tblBO.size(); i++){
    var bo = tblBO.get(i)
    var boId = bo.get("ITEM1");
    var boEmail = Server.getMemberByID(boId).getEmail();
    to += boEmail + ";";
  }
  for (var i = 0; i < tblModuleIT.size(); i++){
    var moduleIT = tblModuleIT.get(i)
    var moduleITId = moduleIT.get("ITEM1");
    var moduleITEmail = Server.getMemberByID(moduleITId).getEmail();
    to += moduleITEmail + ";";
  }
  var itPMEmail = Server.getMemberByID(itPMId).getEmail();
  to += itPMEmail + ";";
  for (var i = 0; i < tblITdirector.size(); i++){
    var itDirector = tblITdirector.get(i)
    var itDirectorId = itDirector.get("ITEM1");
    var itDirectorEmail = Server.getMemberByID(itDirectorId).getEmail();
    to += itDirectorEmail + ";";
  }
  for (var i = 0; i < tblITStaff.size(); i++){
    var itStaff = tblITStaff.get(i)
    var itStaffId = itStaff.get("ITEM1");
    var itStaffEmail = Server.getMemberByID(itStaffId).getEmail();
    to += itStaffEmail + ";";
  }
  var acceptanceEmail = Server.getMemberByID(acceptanceId).getEmail();
  to += acceptanceEmail + ";";
}
else {
  var applicantEmail = Server.getMemberByID(applicantId).getEmail();
  to += applicantEmail + ";";
  var itPMEmail = Server.getMemberByID(itPMId).getEmail();
  to += itPMEmail + ";";
  for (var i = 0; i < tblITStaff.size(); i++){
    var itStaff = tblITStaff.get(i)
    var itStaffId = itStaff.get("ITEM1");
    var itStaffEmail = Server.getMemberByID(itStaffId).getEmail();
    to += itStaffEmail + ";";
  }
}

//郵件內文
body += "<p style='font-size:14px;'>";
body += 	"特此通知，您有一份簽核工作已結案，謝謝。<br />";
body += 	"<br />";
body += 		"表單名稱：資訊服務申請單<br />";
body += 		"單據號碼：" + documentsNo + "<br />";
body += 		"申請人員：" + applicantName + "<br />";
body += 		"結案時間：" + nowTime + "<br />";
body += 	"<br />";
body += 	"點選連結進入表單查看：" + "<a href=$webAgendaURL$mailOpenForm>開啟表單</a>";
body += "</p>"

Server.sendHTMLMail(from, to, cc, subject, body, fileList);
*/

Server.sendTemplateMail(from, to, cc, etID, fileList, MyTask.getID(), true);

//Server.updateArtInstance(artIns);

//完成任務
Server.completeTask(MyTask, "AST03551634176779088");

```