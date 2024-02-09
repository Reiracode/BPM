// ddlBrand

#include GlobalFunction;

loadLibrary("SushiExpressScript.Client_Common");

var brandno = Form.getValue("ddlBrand").split(" ")[0];
SetTestRetailByNo("tblChargeRetail", brandno, "ddlRetail")


//ddlRetail
#include GlobalFunction;
//onchange
loadLibrary("SushiExpressScript.Client_Common");

//var retailNo = Form.getValue("ddlRetailx").substring(0,8);
//Form.setValue("hdfITStaffId",retailNo);
//
////傳入門市代碼，取得該門市於BPM組織物
//var newDepId = getRetailDepByRetailNo(retailNo);
//Form.setValue("hdfDepId",newDepId.DepID);


// --防呆  

//多門市時，選擇品牌及門市才更新，單門市時，資料空值
SetBoStaff();


getOrgTree();
getBrandManager();
getBrandMangerMailList();
getBrandEmployee();




