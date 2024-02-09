//依關卡額外

/*
all 結案關卡：結案說明 + 實際改善日  
人資經理 選擇稽核項目ddlAudItem   
Q 草稿判斷  1、還沒送出 task id 是空的？∵沒送出沒關卡？
表單結案後，是否要開放所有欄位資料給所有關卡看
*/

{
  ALL:
  var formNo = Form.getArtInstance().getMyID();
  var formName = Form.getArtInstance().getName();
  Client.addInfoLog("[" + formName + "] openFormUIAction START: " + formNo);
  #include GlobalFunction;

  //Form.getCurrentTask()可能為null，改用文件狀態判斷
  var astID = Form.getArtInstance().getArtState().getID();

  //申請人(文件狀態設定：初始化、退回申請人)可異動資料
  if ("AST06561703746636384".equals(astID) || "AST07701705988180587".equals(astID)) {

    //setFormVisible();

    //結案+HR關卡關掉
    setProcessRoot();

  } else if ("AST07021704446619758".equals(astID)) {
    //人資經理關卡-稽核項目  
    setProcessApprove();
    setProcessHR();

  } else if ("AST07751706152173071".equals(astID) || "AST07761706152188576".equals(astID)) {
    //食安裝修結案關卡-結案說明  
    setProcessApprove();
    setProcessClose();

  } else {
    //其他簽核關卡，readonly
    setProcessApprove();
  }

  Client.addInfoLog("[" + formName + "] openFormUIAction END: " + astID);
}



```