//GlobalFunction，並依實際欄位數量對各欄位進行處理dx
//設置表單各區域隱藏屬性
//申請人資訊、主旨、用途說明為共通欄位，不設置隱藏
//DEFAULT  全close， 依稽核類型 控制panel Visible or NOT
// ddlAudClass OPEeform ui　＞setFormVisible
//歸檔結案區域，於setArchiveVisible判斷是否顯示
//問題，select下拉選單要寫在哪些區，不會簽核時，看不到內容, 是否在這設定？
//loadLibrary("SushiExpressScript.Client_Common");

//brandDepID ==> hdfbrandDepID

//取得品牌主管 後置email
function getBrandManager() {
  //以品牌代碼取得dep id 
  var brandDepID = Form.getValue("hdfbrandDepID");

  //部門名稱
  var dep = Client.getDepartment(brandDepID);

  Form.setValue("hdfApplicantMemId", brandDepID)



  var mailList = "";

  //
  if (dep == null) {
    //部門不存在

  } else {
    var managerID = dep.getManagerID();
    var rol = Client.getRole(managerID);
    if (rol == null) {
      //職務不存在

    } else {
      //把職務的人取出
      var memberList = rol.getMemberList();
      if (memberList.size() == 0) {
        //此職務內沒有人
      } else {
        //取第一個
        var memID = memberList.get(0);
        //將memid 放在hidden teXT，以供
        // Form.setValue("hdfBrandCeo",memID);
        var mem = Client.getMember(memID);
        if (mem == null) {

        } else {
          //品牌manger mail
          mailList += (mem.getEmail() + ";");

        }
      }

    }

  }


  //營業經理MAIL
  var brandNo = Form.getValue("ddlBrand").split(" ")[0];
  var subDepId = "";
  //1002 + 1023 
  if (brandNo == "1002") {
    subDepId = "DEP23611613977449785";

  } else if (brandNo == "1005") {
    subDepId = "DEP23591613975455883";
  } else if (brandNo == "1012") {
    subDepId = "DEP23571613973818781";

  } else if (brandNo == "1022") {
    subDepId = "DEP23581613973987110";

  } else if (brandNo == "1023") {
    subDepId = "DEP100011641258676464";
  }

  var dep = Client.getDepartment(subDepId);


  if (dep == null) {
    //部門不存在

  } else {

    var managerID = dep.getManagerID();
    var rol = Client.getRole(managerID);
    if (rol == null) {
      //職務不存在

    } else {
      //把職務的人取出
      var memberList = rol.getMemberList();
      if (memberList.size() == 0) {
        //此職務內沒有人
      } else {
        //取第一個
        var memID = memberList.get(0);
        //將memid 放在hidden teXT，以供
        //Form.setValue("hdfBrandManager",memID);

        var mem = Client.getMember(memID);
        if (mem == null) {
        } else {
          //品牌manger mail
          mailList += (mem.getEmail() + ";");

        }

      }

    }

  }


  Form.setValue("hdfBrandCeo", mailList);
}

//以品牌代號1002 取得品牌主管及營業部主管maillist
function getBrandMangerMailList() {
  //之後改用parangetBrandMangerMailList(brandno)
  var brandno = Form.getValue("ddlBrand").split(" ")[0];
  //以品牌代碼取得dep id 
  var brandDepID = getBrandID(brandno);
  // var brandDep = Client.getDepartment(brandDepID);
  var mailList = "";
  var depInfo = [];

  depInfo.push(brandDepID.DepID);


  //設定brand營業部ID 1002 + 1023 必須二個部門都讀
  if (brandno == "1002" || brandno == "1023") {
    depInfo.push("DEP23611613977449785", "DEP100011641258676464");
  } else if (brandno == "1005") {
    depInfo.push("DEP23591613975455883");
  } else if (brandno == "1012") {
    depInfo.push("DEP23571613973818781");
  } else if (brandno == "1022") {
    depInfo.push("DEP40021636451898001");
  } else if (brandno == "1019") {
    depInfo.push("DEP23581613973987110");
  }

  //[] Form.setValue("hdfCountersignId",depInfo)
  //***************************************************
  var string = "";
  for (var i = 0; i < depInfo.length; i++) {

    //string  += depInfo[i];
    //部門名稱
    var dep = Client.getDepartment(depInfo[i]);
    string += (dep + ";");

    var managerID = dep.getManagerID();
    var rol = Client.getRole(managerID);//取得職務
    if (rol == null) {

    } else {
      //把職務的人取出，有就取第一筆，沒:防呆
      var memberList = rol.getMemberList();
      if (memberList.size() == 0) {

      } else {
        var memID = memberList.get(0);
        var mem = Client.getMember(memID);
        if (mem == null) {
        } else {
          //品牌manger mail
          mailList += (mem.getEmail() + ";");
        }
      }

    }

  }

  Form.setValue("hdfmailList", mailList);
  Form.setValue("hdfCountersignId", string)
  //DEP20331612424233534
  //DEP23571613973818781


  //   DEP20351612424254515 
  //   DEP23611613977449785 
  //   DEP100011641258676464
  //***************************************************  
  //    for (var i = 0; i < depInfo.length; i++) {
  //     		//var dep  = depInfo[i];
  //     		Form.setValue("hdfCountersignId",dep)
  //            var  managerID = dep.getManagerID();
  //            var rol = Client.getRole(managerID);//取得職務
  //            if (rol == null){   
  //            
  //            }else{
  //                //把職務的人取出，有就取第一筆，沒:防呆
  //                var memberList = rol.getMemberList();
  //                if (memberList.size()==0){
  //                        
  //                }else{
  //                    var memID = memberList.get(0);
  //                    var mem = Client.getMember(memID);
  //                    if (mem == null){
  //                    }else{
  //                        //品牌manger mail
  //                        mailList += (mem.getEmail()+";") ;
  //                    }
  //                }
  //                
  //            }
  //    }




  //dep.getManagerID(); 有問題明天看

  //var dep ='DEP20351612424254515';
  //  var  managerID = dep.getManagerID();
  //  Form.setValue("hdfmailList",mailList);



}



//組織樹hdfDepID帶出預設
function getOrgTree() {
  var OrgTree1 = Form.getComponent("orgAcceptance");
  var orgDepID = Form.getValue("hdfDepId");
  OrgTree1.setRootNode(orgDepID);
}

//取得brand B info
function getBrandID(brandNo) {
  var retail = null;
  var args = [brandNo];
  var sql = "select DepID , ParentID, ManagerID, Name, ID, Synopsis "
    + "from Dep_GenInf where convert(nvarchar, Synopsis) = 'B' and ID = ?";
  var rs = Client.SQLloadValue(sql, args);

  if (rs.size() > 0) {
    retail = {};
    var row = rs.get(0);
    retail.DepID = row.get("DepID");
    retail.ParentID = row.get("ParentID");
    retail.ManagerID = row.get("ManagerID");
    retail.Name = row.get("Name");
    retail.ID = row.get("ID");
    retail.Synopsis = row.get("Synopsis");
  }
  return retail;

}

//取得門市 R info
function getRetailDepByRetailNo(retailNo) {
  var retail = null;
  var args = [retailNo];
  var sql = "select DepID, ParentID, ManagerID, Name, ID, Synopsis "
    + "from Dep_GenInf where convert(nvarchar, Synopsis) = 'R' and ID = ?";
  var rs = Client.SQLloadValue(sql, args);

  if (rs.size() > 0) {
    retail = {};
    var row = rs.get(0);
    retail.DepID = row.get("DepID");
    retail.ParentID = row.get("ParentID");
    retail.ManagerID = row.get("ManagerID");
    retail.Name = row.get("Name");
    retail.ID = row.get("ID");
    retail.Synopsis = row.get("Synopsis");
  }
  return retail;
}

//以品牌no取DEPID+fAPI(FORMID) 取得品牌負責專員
//多筆 下拉 才寫入，單筆應一開表單就載入門市資料
function SetBoStaff() {
  var retailNo = Form.getValue("ddlRetail").split(" ")[0]; 	//取得門市no
  var newDepId = getRetailDepByRetailNo(retailNo);       	    //傳入門市no，取得門市ID   
  var brandNo = Form.getValue("ddlBrand").split(" ")[0]; 	    //品牌no
  var brandQeury = getBrandID(brandNo);

  Form.setValue("hdfRetailNo", retailNo);
  Form.setValue("hdfDepId", newDepId.DepID);
  Form.setValue("hdfbrandDepID", brandQeury.DepID);

  //    loadLibrary("SushiExpressScript.Common");
  //    var formNo = Form.getArtInstance().getArtifactID();  		//設定formNO文件編號
  //    Form.setValue("formNO",formNo);

  //找營業專員
  getBrandEmployee()
}

//依文件ID 找品牌的營業專員
function getBrandEmployee() {
  loadLibrary("SushiExpressScript.Common");
  var formID = Form.getArtInstance().getArtifactID();  		//設定formNO文件編號
  Form.setValue("formNO", formID);

  var brandID = Form.getValue("hdfbrandDepID");

  //sushi  = 迴轉，只設迴轉，sushi吃同樣的設定
  if ("DEP20021626325280636".equals(brandID)) {
    // if (brandID == "DEP20021626325280636") {
    brandID = "DEP20351612424254515";
  }


  //放入品牌的營業專員
  var tblMDSTAFF = Form.getComponent("tblMDSTAFF");
  tblMDSTAFF.clear();

  //note application db 以後有api
  var sql =
    " select EmployeeId from  Application.dbo.MD_Staff(NOLOCK)  " +
    " where  FormId =? " +
    " and BrandDepId=? ";

  var args = [formID, brandID];
  var dt = Client.SQLloadValue(sql, args);

  for (var i = 0; i < dt.size(); i++) {
    var dr = dt.get(i);
    Client.addInfoLog(" dt.get(i): " + dt.get(i));
    tblMDSTAFF.setValueAt(dr.get("EmployeeId"), i, "BOId");
  }

}





//申請人 選稽核類型>>連動panel
function setFormVisible() {
  Form.getComponent("pnlHygieneaud").setVisible(false);	//抽驗
  Form.getComponent("pnlFireEng").setVisible(false);	    //消防工程
  Form.getComponent("pnlDeprivation").setVisible(false);	//缺失照片
  Form.getComponent("pnlAddlDocs").setVisible(false);  	//補件資料
  Form.getComponent("pnlAttachment1").setVisible(false);  //有稽核單 才顯示 - 稽核單附件

  Form.getComponent("pnlAudreport2a").setVisible(false);  //稽核項目 HR關卡才要顯示
  Form.getComponent("pnlCloseInfo").setVisible(false);  //結案說明-結案關卡才顯示



  //稽核類型
  var ddlAudClass = Form.getValue("ddlAudClass");

  //回歸預設項目
  //       setAddDocsAllDefault(); 

  if ("衛生環保".equals(ddlAudClass)) {
    Form.getComponent("pnlHygieneaud").setVisible(false);
    Form.getComponent("pnlDeprivation").setVisible(true);
    Form.getComponent("pnlAddlDocs").setVisible(true)
  } else if ("消防".equals(ddlAudClass)) {
    Form.getComponent("pnlFireEng").setVisible(true);
    Form.getComponent("pnlDeprivation").setVisible(true);

  } else if ("其他".equals(ddlAudClass)) {
    Form.getComponent("pnlDeprivation").setVisible(true);
  } else {
  }

}


//根據稽核類型顯示不同的區塊
function setAudClassLayout() {
  //稽核類型
  var ddlAudClass = Form.getValue("ddlAudClass");

  if ("衛生環保".equals(ddlAudClass)) {
    Form.getComponent("pnlHygieneaud").setVisible(false);
    Form.getComponent("pnlDeprivation").setVisible(true);
    Form.getComponent("pnlAddlDocs").setVisible(true)
  } else if ("消防".equals(ddlAudClass)) {
    Form.getComponent("pnlFireEng").setVisible(true);
    Form.getComponent("pnlDeprivation").setVisible(true);
  } else if ("勞檢".equals(ddlAudClass)) {
    Form.getComponent("pnlAudreport2a").setVisible(true);

  } else if ("其他".equals(ddlAudClass)) {
    Form.getComponent("pnlDeprivation").setVisible(true);
  }

}



//稽核類型>>下拉選單連動
function setAudSelector() {
  var ddlAudClass = Form.getValue("ddlAudClass");
  var ddlAudDep = Form.getValue("ddlAudDep");
  var audDepList = [];
  var audResonList = [];

  //稽核單位/稽核原因 
  var ddlAudDep = Form.getComponent("ddlAudDep");
  var ddlAudReson = Form.getComponent("ddlAudReson");

  ddlAudDep.removeAllItems();
  ddlAudReson.removeAllItems();

  audDepList.push("請選擇");
  audResonList.push("請選擇");

  if ("衛生環保".equals(ddlAudClass)) {
    audDepList.push("環保局", "衛生局", "食藥署", "餐飲衛生評核", "賣場抽測(含SGS)", "其他");
    audResonList.push("例行稽核", "民眾檢舉", "食品中毒", "其他");
  } else if ("消防".equals(ddlAudClass)) {
    audResonList.push("消防申報", "例行", "其他");
  } else if ("其他".equals(ddlAudClass)) {

  } else {

  }

  //       Client.addInfoLog("audDepList.length: " + audDepList.length);
  //       Client.addInfoLog("audResonList.length: " + audResonList.length);

  for (var i = 0; i < audDepList.length; i++) {
    ddlAudDep.addItem(audDepList[i]);
  }

  for (var i = 0; i < audResonList.length; i++) {
    ddlAudReson.addItem(audResonList[i]);
  }
}




//設置品牌門市資料txtBrand/ddlRetail
function SetRetailData() {
  //門市
  SetInitDemoRetail("tblChargeRetail", "ddlBrand", "ddlRetail");
}


function setNowDate() {
  //DEFAULT  申請日期/申請人資料
  var nowDate = new Packages.java.text.SimpleDateFormat("yyyy/MM/dd").format(Client.getServerTime());
  Form.setValue("txtApplyDate", nowDate);
}

//取得申請人資料
function getApplyInfo() {
  //申請人
  var applicant = Client.getCurrentMember();
  var applicantCode = applicant.getMyID();
  var applicantName = applicant.getName();
  var applicantId = applicant.getID();
  var tel = applicant.getPhone();

  //申請人職位
  var roleId = task.getRoleID();
  var role = Client.getRole(roleId);
  var jobTitle = role.getName();																		// 


  //填入申請人資料
  Form.setValue("txtApplyName", applicantCode + " " + applicantName);
  Form.setValue("txtJobTitle", jobTitle);
  Form.setValue("txtTel", tel);

}

//是否有抽驗
function setSamepleData() {
  var rdoSampleY = Form.getValue("rdoSampleY");
  Form.getComponent("pnlHygieneaud").setVisible(false);

  if ("true".equals(rdoSampleY)) {
    Form.getComponent("pnlHygieneaud").setVisible(true);
  } else {
    Form.getComponent("pnlHygieneaud").setVisible(false);
  }
}



//補件資料a 預設把營業證公司下拉關閉，選y打開n
function setAddDocsa() {
  var rdoAddlDocsAy = Form.getValue("rdoAddlDocsAy");
  Form.getComponent("ddlAddlDocsAItem").setEnabled(false);

  if ("true".equals(rdoAddlDocsAy)) {
    Form.getComponent("ddlAddlDocsAItem").setEnabled(true);
  } else {
    Form.setValue("ddlAddlDocsAItem", "-");
    Form.getComponent("ddlAddlDocsAItem").setEnabled(false);
  }
}

//補件資料b 預設把自來水費單下拉關閉，選y打開n
function setAddDocsb() {
  var rdoAddlDocsBy = Form.getValue("rdoAddlDocsBy");
  //  Form.getComponent("ddlAddlDocsBItem").setEnabled(false) ;	 

  if ("true".equals(rdoAddlDocsBy)) {
    Form.getComponent("ddlAddlDocsBItem").setEnabled(true);
  } else {
    Form.setValue("ddlAddlDocsBItem", "-");
    Form.getComponent("ddlAddlDocsBItem").setEnabled(false);
  }
}

//補件資料c
function setAddDocsc() {
  var rdoAddlDocsCy = Form.getValue("rdoAddlDocsCy");
  if ("true".equals(rdoAddlDocsCy)) {
    Form.getComponent("txtAddlDocsCIngred").setEnabled(true);
    Form.getComponent("txtAddlDocsCInfo").setEnabled(true);
  } else {
    Form.setValue("txtAddlDocsCIngred", "");
    Form.setValue("txtAddlDocsCInfo", "");
    Form.getComponent("txtAddlDocsCIngred").setEnabled(false);
    Form.getComponent("txtAddlDocsCInfo").setEnabled(false);
  }
}

//補件資料D
function setAddDocsd() {
  var rdoAddlDocsDy = Form.getValue("rdoAddlDocsDy");
  if ("true".equals(rdoAddlDocsDy)) {
    Form.getComponent("txtAddlDocsDIngred").setEnabled(true);
    Form.getComponent("txtAddlDocsDInfo").setEnabled(true);
  } else {
    Form.setValue("txtAddlDocsDIngred", "");
    Form.setValue("txtAddlDocsDInfo", "");
    Form.getComponent("txtAddlDocsDIngred").setEnabled(false);
    Form.getComponent("txtAddlDocsDInfo").setEnabled(false);
  }
}

//補件資料E
function setAddDocse() {
  var rdoAddlDocsEy = Form.getValue("rdoAddlDocsEy");
  if ("true".equals(rdoAddlDocsEy)) {
    Form.getComponent("txtAddlDocsEIngred").setEnabled(true);
    Form.getComponent("txtAddlDocsEInfo").setEnabled(true);

  } else {
    Form.setValue("txtAddlDocsEIngred", "");
    Form.setValue("txtAddlDocsEInfo", "");
    Form.getComponent("txtAddlDocsEIngred").setEnabled(false);
    Form.getComponent("txtAddlDocsEInfo").setEnabled(false);
  }
}
//補件資料f
function setAddDocsf() {
  var rdoAddlDocsFy = Form.getValue("rdoAddlDocsFy");
  if ("true".equals(rdoAddlDocsFy)) {
    Form.getComponent("txtAddlDocsFIngred").setEnabled(true);
    Form.getComponent("txtAddlDocsFInfo").setEnabled(true);
  } else {
    Form.setValue("txtAddlDocsFInfo", "");
    Form.setValue("txtAddlDocsFIngred", "");
    Form.getComponent("txtAddlDocsFIngred").setEnabled(false);
    Form.getComponent("txtAddlDocsFInfo").setEnabled(false);
  }
}
//補件資料g
function setAddDocsg() {
  var rdoAddlDocsGy = Form.getValue("rdoAddlDocsGy");
  if ("true".equals(rdoAddlDocsGy)) {
    Form.getComponent("txtAddlDocsGInfo").setEnabled(true);
  } else {
    Form.setValue("txtAddlDocsGInfo", "");
    Form.getComponent("txtAddlDocsGInfo").setEnabled(false);
  }
}


//檢查稽核單 false清空說明及附件
function checkAudForm() {
  var rdoAudFormN = Form.getValue("rdoAudFormN");
  if ("true".equals(rdoAudFormN)) {
    Form.getComponent("pnlAudFormInfo").setVisible(false);
    Form.getComponent("pnlAttachment1").setVisible(false);
    Form.setValue("txtAudFormInfo", "");
    Form.getComponent("txtAudFormInfo").setEnabled(false);

  } else {
    Form.getComponent("pnlAudFormInfo").setVisible(true);
    Form.getComponent("pnlAttachment1").setVisible(true);
    Form.getComponent("txtAudFormInfo").setEnabled(true);
  }
}

//檢查消防 false清空說明及附件
function checkAudFireEng() {
  var rdoFireEngN = Form.getValue("rdoFireEngN");

  if ("true".equals(rdoFireEngN)) {
    Form.setValue("txtFireEngInfo", "");
    Form.getComponent("txtFireEngInfo").setEnabled(false);
  } else {
    Form.getComponent("txtFireEngInfo").setEnabled(true);
  }
}

//限期改善
function checkRequireDate() {
  var rdoRequireN = Form.getValue("rdoRequireN");

  if ("true".equals(rdoRequireN)) {
    Form.setValue("txtRequireDate", "");
    Form.getComponent("txtRequireDate").setEnabled(false);
  } else {
    Form.getComponent("txtRequireDate").setEnabled(true);
  }
}



function setAddDocsAllDefault() {
  //切換稽核類型 清空資料
  //是否有稽核單
  Form.setValue("txtAudFormInfo", "");
  Form.getComponent("txtAudFormInfo").setEnabled(false);

  //消防
  Form.setValue("rdoFireEngN", "true");
  Form.setValue("txtFireEngInfo", "");
  Form.getComponent("txtFireEngInfo").setEnabled(false);

  //限期改善
  Form.setValue("rdoRequireN", "true");
  Form.setValue("txtRequireDate", "");
  Form.getComponent("txtRequireDate").setEnabled(false);


  //補件資料
  //營業登記證
  Form.setValue("rdoAddlDocsAn", "true");
  Form.setValue("ddlAddlDocsAItem", "-");
  Form.getComponent("ddlAddlDocsAItem").setEnabled(false);

  //自來水費單
  Form.setValue("rdoAddlDocsBn", "true");
  Form.setValue("ddlAddlDocsBItem", "-");
  Form.getComponent("ddlAddlDocsBItem").setEnabled(false);

  Form.setValue("rdoAddlDocsCn", "true");
  Form.setValue("rdoAddlDocsDn", "true");
  Form.setValue("rdoAddlDocsEn", "true");
  Form.setValue("rdoAddlDocsFn", "true");
  Form.setValue("rdoAddlDocsGn", "true");

  Form.setValue("txtAddlDocsCIngred", "");
  Form.setValue("txtAddlDocsCInfo", "");
  Form.setValue("txtAddlDocsDIngred", "");
  Form.setValue("txtAddlDocsDInfo", "");
  Form.setValue("txtAddlDocsEIngred", "");
  Form.setValue("txtAddlDocsEInfo", "");
  Form.setValue("txtAddlDocsFInfo", "");
  Form.setValue("txtAddlDocsFIngred", "");
  Form.setValue("txtAddlDocsGInfo", "");

  Form.getComponent("txtAddlDocsCIngred").setEnabled(false);
  Form.getComponent("txtAddlDocsCInfo").setEnabled(false);
  Form.getComponent("txtAddlDocsDIngred").setEnabled(false);
  Form.getComponent("txtAddlDocsDInfo").setEnabled(false);
  Form.getComponent("txtAddlDocsEIngred").setEnabled(false);
  Form.getComponent("txtAddlDocsEInfo").setEnabled(false);
  Form.getComponent("txtAddlDocsFIngred").setEnabled(false);
  Form.getComponent("txtAddlDocsFInfo").setEnabled(false);
  Form.getComponent("txtAddlDocsGInfo").setEnabled(false);

}

//申請人 必填檢查
function CheckData_Common() {
  var txtTel = Form.getValue("txtTel");
  var ddlAudClass = Form.getValue("ddlAudClass");
  var ddlAudDep = Form.getValue("ddlAudDep");
  var txtAudDate = Form.getValue("txtAudDate");
  var nowDate = new Packages.java.text.SimpleDateFormat("yyyy/MM/dd").format(Client.getServerTime());
  var ddlBrand = Form.getValue("ddlBrand");
  var ddlRetail = Form.getValue("ddlRetail");
  //申請人關卡
  if ("".equals(txtTel)) {
    Form.addDataInvalidMsg("請填寫聯絡電話");
  }
  //0214
  if ("請選擇".equals(ddlBrand)) {
    Form.addDataInvalidMsg("請選擇品牌");
  }
  if ("請選擇".equals(ddlRetail)) {
    Form.addDataInvalidMsg("請選擇門市");
  }


  //稽核類型：其他時， 說明必填 txtAudDep txtAudReson
  var ddlAudClass = Form.getValue("ddlAudClass");
  var txtAudDep = Form.getValue("txtAudDep");
  var txtAudReson = Form.getValue("txtAudReson");
  //稽核原因：其他時，說明必填
  var ddlAudReson = Form.getValue("ddlAudReson");
  var txtAudResonInfo = Form.getValue("txtAudResonInfo");
  //稽核單位：其他時，說明必填
  var ddlAudDep = Form.getValue("ddlAudDep");
  var txtAudDepInfo = Form.getValue("txtAudDepInfo");


  if ("其他".equals(ddlAudClass)) {
    if ("".equals(txtAudDep) || "".equals(txtAudReson)) {
      Form.addDataInvalidMsg("稽核類型「其他」，請填寫稽核單位及原因說明");
    }
    //衛生環保 -> 稽核單位/原因必填
  } else if ("衛生環保".equals(ddlAudClass)) {
    if ("請選擇".equals(ddlAudDep) || "".equals(ddlAudDep)) {
      Form.addDataInvalidMsg("請選擇稽核單位");
    }

    if ("請選擇".equals(ddlAudReson)) {
      Form.addDataInvalidMsg("請選擇稽核原因");
    }
    //hr關卡
    //        }else if ("勞檢".equals(ddlAudClass)) { 
    //              	if ("請選擇".equals(ddlAudItem)) {
    //          			 Form.addDataInvalidMsg("請選擇稽核原因");
    //      		 	 }	 	

  } else if ("消防".equals(ddlAudClass)) {
    if ("請選擇".equals(ddlAudReson)) {
      Form.addDataInvalidMsg("請選擇稽核原因");
    }
  } else {
    if ("請選擇".equals(ddlAudClass) || "".equals(ddlAudClass)) {
      Form.addDataInvalidMsg("請選擇稽核類型");
    }

  }


  if ("".equals(txtAudDate)) {
    Form.addDataInvalidMsg("請填寫稽核日期");

  } else {
    if (!CheckDate(txtAudDate, nowDate)) {
      //errLog = "稽核日期不可大於今日";
      Form.addDataInvalidMsg("稽核日期不可大於今日");
      Form.setValue("txtAudDate", nowDate);
    }
  }

  //補件資料
  var rdoAddlDocsAy = Form.getValue("rdoAddlDocsAy");
  var rdoAddlDocsBy = Form.getValue("rdoAddlDocsBy");
  var rdoAddlDocsCy = Form.getValue("rdoAddlDocsCy");
  var rdoAddlDocsDy = Form.getValue("rdoAddlDocsDy");
  var rdoAddlDocsEy = Form.getValue("rdoAddlDocsEy");
  var rdoAddlDocsFy = Form.getValue("rdoAddlDocsFy");
  var rdoAddlDocsGy = Form.getValue("rdoAddlDocsGy");

  var ddlAddlDocsAItem = Form.getValue("ddlAddlDocsAItem");
  var ddlAddlDocsBItem = Form.getValue("ddlAddlDocsBItem");
  var txtAddlDocsCIngred = Form.getValue("txtAddlDocsCIngred");
  var txtAddlDocsDIngred = Form.getValue("txtAddlDocsDIngred");
  var txtAddlDocsEIngred = Form.getValue("txtAddlDocsEIngred");
  var txtAddlDocsFIngred = Form.getValue("txtAddlDocsFIngred");
  var txtAddlDocsGInfo = Form.getValue("txtAddlDocsGInfo");

  if ("true".equals(rdoAddlDocsAy) && "-".equals(ddlAddlDocsAItem)) {
    Form.addDataInvalidMsg("請選擇營業登記證-種類");
  }

  if ("true".equals(rdoAddlDocsBy) && "-".equals(ddlAddlDocsBItem)) {
    Form.addDataInvalidMsg("請選擇自來水費單-月份");
  }

  if ("true".equals(rdoAddlDocsCy) && "".equals(txtAddlDocsCIngred)) {
    Form.addDataInvalidMsg("請填寫檢驗報告 - 食材");
  }

  if ("true".equals(rdoAddlDocsDy) && "".equals(txtAddlDocsDIngred)) {
    Form.addDataInvalidMsg("請填寫原產地證明 -食材");
  }

  if ("true".equals(rdoAddlDocsEy) && "".equals(txtAddlDocsEIngred)) {
    Form.addDataInvalidMsg("請填寫產品責任險 - 食材");
  }


  if ("true".equals(rdoAddlDocsFy) && "".equals(txtAddlDocsFIngred)) {
    Form.addDataInvalidMsg("請填寫非基改證明 - 食材");
  }

  if ("true".equals(rdoAddlDocsGy) && "".equals(txtAddlDocsGInfo)) {
    Form.addDataInvalidMsg("請填寫其他 - 說明");
  }

}



//判斷需求日期涵式
function CheckDate(cldNameFrom, cldNameTo) {
  var result = false;
  if (new Packages.pase.agenda.MyDate().getSubtractDay(cldNameFrom, cldNameTo) > -1) {
    result = true;
  }
  return result;
}

//SetChargeRetail寫入隱藏/table tblChargeRetail品牌門市代號及名稱
function SetTestRetail(tblChargeRetail) {
  if (tblChargeRetail != "" && Form.getComponent(tblChargeRetail) != null) {
    var table = Form.getComponent(tblChargeRetail);
    table.clear();

    var retailList = GetChargeRetail();

    //寫入是否多門市人員
    var multirole = retailList.length;
    Form.setValue("hdfMultiRole", multirole);

    for (var i = 0; i < retailList.length; i++) {
      var retail = retailList[i];
      var rowIndex = table.newRow() - 1;

      table.setValueAt(retail.BrandNo, rowIndex, "BrandNo");
      table.setValueAt(retail.BrandName, rowIndex, "BrandName");
      table.setValueAt(retail.RetailNo, rowIndex, "RetailNo");
      table.setValueAt(retail.RetailName, rowIndex, "RetailName");

      if (retailList.length == 1) {
        //門市NO
        Form.setValue("hdfRetailNo", retail.RetailNo);
        //門市ID
        var newDepId = getRetailDepByRetailNo(retail.RetailNo);
        Form.setValue("hdfDepId", newDepId.DepID);
        //品牌ID
        var brandID = getBrandID(retail.BrandNo); //品牌no
        Form.setValue("hdfbrandDepID", brandID.DepID);
      }
    }
  }
}

//SetChargeBrand 設定品牌
function SetTestBrand(tblChargeRetail, ddlBrand) {
  if (tblChargeRetail != "" && Form.getComponent(tblChargeRetail) != null && ddlBrand != "" && Form.getComponent(ddlBrand) != null) {
    var newList = Form.getComponent(ddlBrand);
    newList.removeAllItems();

    var brandList = GetChargeBrand(tblChargeRetail);
    Client.addInfoLog("brandList.length: " + brandList.length);

    if (brandList.length > 1) {
      newList.addItem("請選擇");
    }

    for (var i = 0; i < brandList.length; i++) {
      newList.addItem(brandList[i].BrandNo + " " + brandList[i].BrandName);
    }

  }
}



function SetTestRetailByNo(tblChargeRetail, brandNo, ddlRetail, defaultType) {
  if (tblChargeRetail != "" && Form.getComponent(tblChargeRetail) != null && brandNo != "" && ddlRetail != "" && Form.getComponent(ddlRetail) != null) {
    var newList = Form.getComponent(ddlRetail);
    newList.removeAllItems();

    //by 品牌show 門市
    var retailList = GetChargeRetailByBrandNo(tblChargeRetail, brandNo);
    Client.addInfoLog("retailList.length: " + retailList.length);

    if (retailList.length > 1) {
      newList.addItem("請選擇");
    }

    for (var i = 0; i < retailList.length; i++) {
      newList.addItem(retailList[i].RetailNo + " " + retailList[i].RetailName);

      if (retailList.length == 1) {
        //門市NO
        Form.setValue("hdfRetailNo", retailList[0].RetailNo);
        //門市ID
        var newDepId = getRetailDepByRetailNo(retailList[0].RetailNo);
        Form.setValue("hdfDepId", newDepId.DepID);
        //品牌ID
        // var brandNo = Form.getValue("ddlBrand");
        var brandID = getBrandID(brandNo); //品牌no
        Form.setValue("hdfbrandDepID", brandID.DepID);



        //0214多品牌 多門市只有SHIHSUI 1
        SetBoStaff();
        getOrgTree();
        //getBrandManager();
        getBrandMangerMailList();
        getBrandEmployee();
      }
    }
  }
}




function SetInitDemoRetail(tblChargeRetail, ddlBrand, ddlRetail, defaultType) {
  var errLog = "";

  //20240207寫入品牌門市
  SetTestRetail(tblChargeRetail);
  SetTestBrand(tblChargeRetail, ddlBrand);

  if (!"".equals(Form.getValue(ddlBrand))) {

    var brandno = Form.getValue("ddlBrand").split(" ")[0];
    SetTestRetailByNo("tblChargeRetail", brandno, ddlRetail)

  } else {
    errLog = "無門市查詢權限！";
  }





  return errLog;
}





//必填欄位 檢查申請人申請內容及放單號
function CheckData_Applicant() {
  var status = "0";
  var documentsNo = "";
  var curTask = Form.getCurrentTask();

  if ("AST06681704266187018".equals(curTask.getProSignStateId())) {
    //提交申請
    CheckData_Common();
    if (Form.getDataInvalidMsgList().size() == 0) {

      status = "2";	//提交申請
      documentsNo = Form.getArtInstance().getMyID();

      if ("".equals(Form.getValue("txtDocumentsNo"))) {
        Form.setValue("txtDocumentsNo", documentsNo);
      }
      Form.setValue("hdfStatus", status);
    }
  }

}


//非申請人的關卡要關掉setApproveProcess
function setProcessApprove() {
  //結案人員才能看 填 
  Form.getComponent("pnlAudreport2a").setVisible(false);
  Form.getComponent("pnlCloseInfo").setVisible(false);


  Form.getComponent("ddlBrand").setEnabled(false);
  Form.getComponent("ddlRetail").setEnabled(false);

  Form.getComponent("ddlAudClass").setEnabled(false);
  Form.getComponent("ddlAudDep").setEnabled(false);
  Form.getComponent("txtAudDep").setEnabled(false);
  Form.getComponent("txtAudDepInfo").setEnabled(false);
  Form.getComponent("ddlAudReson").setEnabled(false);
  Form.getComponent("txtAudReson").setEnabled(false);
  Form.getComponent("txtAudResonInfo").setEnabled(false);
  Form.getComponent("txtAudDate").setEnabled(false);


  Form.getComponent("rdoStoreManY").setEnabled(false);
  Form.getComponent("rdoStoreManN").setEnabled(false);
  Form.getComponent("txtCountersignName").setEnabled(false);
  Form.getComponent("txtAudProcess").setEnabled(false);
  Form.getComponent("rdoAudFormY").setEnabled(false);
  Form.getComponent("rdoAudFormN").setEnabled(false);
  Form.getComponent("rdoAudFormOther").setEnabled(false);
  Form.getComponent("txtAudFormInfo").setEnabled(false);
  Form.getComponent("rdoSampleY").setEnabled(false);
  Form.getComponent("rdoSampleN").setEnabled(false);
  Form.getComponent("txtSampleInfo").setEnabled(false);
  Form.getComponent("rdoFireEngY").setEnabled(false);
  Form.getComponent("rdoFireEngN").setEnabled(false);
  Form.getComponent("rdoFireEngOther").setEnabled(false);
  Form.getComponent("txtFireEngInfo").setEnabled(false);

  Form.getComponent("rdoRequireY").setEnabled(false);
  Form.getComponent("rdoRequireN").setEnabled(false);
  Form.getComponent("txtRequireDate").setEnabled(false);

  Form.getComponent("Button1").setVisible(false);

  Form.getComponent("Button2").setVisible(false);
  Form.getComponent("Button4").setVisible(false);

  Form.getComponent("orgAcceptance").setEnabled(false);

  Form.getComponent("ddlAddlDocsAItem").setEnabled(false);
  Form.getComponent("ddlAddlDocsBItem").setEnabled(false);
  Form.getComponent("txtAddlDocsCIngred").setEnabled(false);
  Form.getComponent("txtAddlDocsCInfo").setEnabled(false);
  Form.getComponent("txtAddlDocsDIngred").setEnabled(false);
  Form.getComponent("txtAddlDocsDInfo").setEnabled(false);
  Form.getComponent("txtAddlDocsEIngred").setEnabled(false);
  Form.getComponent("txtAddlDocsEInfo").setEnabled(false);
  Form.getComponent("txtAddlDocsFIngred").setEnabled(false);
  Form.getComponent("txtAddlDocsFInfo").setEnabled(false);
  Form.getComponent("txtAddlDocsGInfo").setEnabled(false);

  //結案及hr人員才能填
  Form.getComponent("ddlAudItem").setEnabled(false);
  Form.getComponent("txtClosureInfo").setEnabled(false);

  Form.getComponent("rdoAddlDocsAy").setEnabled(false);
  Form.getComponent("rdoAddlDocsBy").setEnabled(false);
  Form.getComponent("rdoAddlDocsCy").setEnabled(false);
  Form.getComponent("rdoAddlDocsDy").setEnabled(false);
  Form.getComponent("rdoAddlDocsEy").setEnabled(false);
  Form.getComponent("rdoAddlDocsFy").setEnabled(false);
  Form.getComponent("rdoAddlDocsGy").setEnabled(false);

  Form.getComponent("rdoAddlDocsAn").setEnabled(false);
  Form.getComponent("rdoAddlDocsBn").setEnabled(false);
  Form.getComponent("rdoAddlDocsCn").setEnabled(false);
  Form.getComponent("rdoAddlDocsDn").setEnabled(false);
  Form.getComponent("rdoAddlDocsEn").setEnabled(false);
  Form.getComponent("rdoAddlDocsFn").setEnabled(false);
  Form.getComponent("rdoAddlDocsGn").setEnabled(false);

}



//結案關卡：說明+實際改善日期
function setProcessClose() {
  Form.getComponent("txtActualDate").setEnabled(true);
  Form.getComponent("pnlCloseInfo").setVisible(true);
  Form.getComponent("txtClosureInfo").setEnabled(true);
}


//HR經理關卡：稽核類型
function setProcessHR() {
  Form.getComponent("pnlAudreport2a").setVisible(true);
  Form.getComponent("ddlAudItem").setEnabled(true);
}

function setProcessHRClose() {
  Form.getComponent("pnlAudreport2a").setVisible(true);

}


//根流程 隱藏區塊
function setProcessRoot() {
  //HR經理關卡：稽核類型
  Form.getComponent("pnlAudreport2a").setVisible(false);


  //結案關卡：說明+實際改善日期
  Form.getComponent("pnlCloseInfo").setVisible(false);
  Form.getComponent("pnlCloseInfo").setVisible(false);
  Form.getComponent("txtActualDate").setEnabled(false);


}







//依關卡額外

/*
all 結案關卡：結案說明 + 實際改善日  
人資經理 選擇稽核項目ddlAudItem   
Q 草稿判斷  1、還沒送出 task id 是空的？∵沒送出沒關卡？
表單結案後，是否要開放所有欄位資料給所有關卡看
其他 營管 權限打開 結案
*/

{ALL:
  var formNo = Form.getArtInstance().getMyID();
  var formName = Form.getArtInstance().getName();
  Client.addInfoLog("[" + formName + "] openFormUIAction START: " + formNo);
  #include GlobalFunction;

  //Form.getCurrentTask()可能為null，改用文件狀態判斷
  var astID = Form.getArtInstance().getArtState().getID();

  //申請人(文件狀態設定：初始化、退回申請人)可異動資料
  if ("AST06561703746636384".equals(astID) || "AST07701705988180587".equals(astID)) {
    setFormVisible();
    //結案+HR關卡關掉
    setProcessRoot();

    // }else if ("AST06991704445651068".equals(astID)) {
    //		 //營業專員
    //		 setProcessApprove();
  } else if ("AST07021704446619758".equals(astID)) {
    //人資經理關卡-稽核項目  
    setFormVisible();
    setProcessApprove();
    setProcessHR();


  } else if ("AST07751706152173071".equals(astID) || "AST07761706152188576".equals(astID) || "AST07081704448015967".equals(astID)) {
    //HR食安裝修結案關卡-結案說明  
    setFormVisible();
    setProcessApprove();
    setProcessClose();

    if ("AST07081704448015967".equals(astID)) {
      setProcessHRClose();
    }


  } else {
    //其他簽核關卡，readonly
    setFormVisible();
    setProcessApprove();
    //setAudClassLayout();
  }

  Client.addInfoLog("[" + formName + "] openFormUIAction END: " + astID);
}




