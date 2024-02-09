//申請人 前置
MyTask.setProSignStateId("AST06681704266187018");

// auto 申請人是否為區經理 自動執行

var artIns = MyTask.getArtInstance();
var nextState = "AST06731704266829027";
// if(true)
//if ("AST06731704266829027".equals(artIns)) {
if (true) {
  nextState = "AST06701704266656718";	//申請人是區經理
} else {
  //申請人不是區經理
  nextState = "AST06731704266829027";
}

Server.flowTo(MyTask, nextState);

//iap 區經理 前置
MyTask.setIapSignResult("agree");

//營業專員前置
MyTask.setProSignStateId("AST07671705901441396");


//iap 判斷稽核類型 自動執行
var artIns = MyTask.getArtInstance();
var ddlAudClass = artIns.getAppValue("ddlAudClass");

//HR AST07021704446619758
if ("衛生環保".equals(ddlAudClass)) {
  nextState = "AST07751706152173071";
} else if ("消防".equals(ddlAudClass)) {
  nextState = "AST07761706152188576";
} else if ("勞安".equals(ddlAudClass)) {
  nextState = "AST07021704446619758";
} else if ("其他".equals(ddlAudClass)) {
  nextState = "AST07831706585843209";
}

Server.flowTo(MyTask, nextState);



//結案 ： 前置  裝修 
MyTask.setProSignStateId("AST07131704448346420");
//食安
MyTask.setProSignStateId("AST07121704448326797");
//hr
MyTask.setProSignStateId("AST07081704448015967");


//auto結案
MyTask.setProSignStateId("AST07741706059216022");

var taskName = MyTask.getArtInstance();

taskName.setAppValue("hdfStatus", "9");
//完成任務
Server.completeTask(MyTask, "AST07741706059216022");




