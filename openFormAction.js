//以下撰寫於表單openFormUIAction，作為表單開啟時的畫面呈現調整
//如果有依關卡額外處理的事件，撰寫於後面的if else內
//如果要對某段程式增加額外的追蹤log，可參考下述寫法，印出表單名稱與表單編號及被觸發的事件名稱
//openform  okation 可依關卡設定
//如何判斷表單狀態1、草稿 2、簽核中 
//renew

{
  ALL:
  #include GlobalFunction;
  loadLibrary("SushiExpressScript.Common");
  loadLibrary("SushiExpressScript.Client_Common");

  var formNo = Form.getArtInstance().getMyID();
  var formName = Form.getArtInstance().getName();

  Client.addInfoLog("[" + formName + "] openFormAction start: " + formNo);

  //取得現在關卡	
  var task = Form.getCurrentTask();
  if (task == null) {
    //表示透過createForm開啟表單，不做任何事 Form.setArtReadOnly(true);

  } else {
    var proID = task.getProcessID();
    var rootID = task.getRootID();   //Get the task id of root task
    var frontID = task.getFrontID(); //Get the task id of front task

    //現在流程id = 起單人關卡設定新申請預設帶入
    //草稿 已儲存有工作主題，按上一頁沒存，沒有工作主題
    //帶出填單人資訊前，先判斷填單人是否有值，沒有代表是新單
    //目前操作情境：日期以系統自動取得，非人員可選
    //資料更新的時機：每次更新 / 草稿上的日期
    //20240207 Q1 草稿看不到抽驗物品，但是簽核人可以

    //送單人的流程編號
    if ("PRO03041703814440505".equals(proID)) {
      //方法1判斷草稿
      if (rootID.equals(frontID)) {

        //新起單：帶入預設的值  目的做：草稿日期起單的初始日
        if (Form.getValue("txtApplyName") == "") {
          setNowDate();
          getApplyInfo();
          setAudSelector();

          // 下拉選單的預設值
          SetRetailData(); //==>SetInitDemoRetail     

          //草稿 不需要動的function					     
        } else {
          //user看到自己選的，但是可以選
          //消防  稽核原因 只出現選的：消防申報
          //部門下拉選單：只出現選的單一部門
          //用程式生成的下拉選單都沒有出現   
          //要改成  === > 帶出整個選單，並將自己選的(設為預設)  
          //						SetRetailData()

        }



      }

      //方法2 每次開表單都要設setNowDate();
      //預設帶入資料



      //應判斷單一門市人員，直接帶出data
      if (!"請選擇".equals(Form.getValue("ddlBrand"))) {
        getBrandMangerMailList();
        getBrandEmployee();
        getOrgTree();
      }


      //如果下拉沒有資料，depip為空，應增加非空值再去找depid 以供組織樹
      //function SetRetailData(){
      //     SetInitDemoRetail("tblChargeRetail", "ddlBrand", "ddlRetail");
      //   }

      //如果沒

      //更新組織樹by DepID 
      //		var retailNo = Form.getValue("ddlRetail").split(" ")[0];
      //		Form.setValue("hdfITStaffId", retailNo);
      //
      //		//傳入門市代碼，取得該門市於BPM組織物
      //		var newDepId = getRetailDepByRetailNo(retailNo);
      //		Form.setValue("hdfDepId", newDepId.DepID);
      //		getOrgTree();

    }


  }

  ////    }

  Client.addInfoLog("[" + formName + "] openFormAction END: " + formNo);

}


```