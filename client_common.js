// Some co
/*------------------------------------------------------------------------------------------------------------------------------------------------------
  AgentFlow
------------------------------------------------------------------------------------------------------------------------------------------------------*/

/*
  [開啟子表單]
  artId:	子表單文件Id
  width:	子表單視窗寬度
  height:	子表單視窗高度

  #2021-03-30 Create by Mars
*/
function OpenForm(artId, width, height) {
  OpenFormWithArgs(artId, width, height, null);
}

/*
  [開啟子表單(帶參數)]
  artId:	子表單文件Id
  width:	子表單視窗寬度
  height:	子表單視窗高度
  args:	參數

  #2021-03-30 Create by Mars
*/
function OpenFormWithArgs(artId, width, height, args) {
  var artIns = Client.createArtInstance(artId);
  if (args != null) {
    for (var i = 0; i < args.length; i++) {
      artIns.appDataMap.put(args[i].k, args[i].v);
    }
  }
  Client.updateArtInstance(artIns);
  Client.createForm(artIns.getID(), "", true, false, false, 0, 0, 0, width, height);
}

/*
  [傳值至子表單]
  key:	子表單的Object名稱
  value:	要傳遞給key的值

  #2021-03-30 Create by Mars
*/
function MakeArg(key, value) {
  var obj = {};

  obj.k = key;
  obj.v = value;

  return obj;
}

/*
  [取得登入帳號之部門編號]

  #2021-03-30 Create by Mars
*/
function GetDepartmentNo() {
  var deptNo = "";

  var member = Client.getMember(Form.getCurrentTask().getMemberID());
  var deptId = member.getMemberDR(Form.getCurrentTask().getRoleID()).getDepartmentID();
  deptNo = Client.getDepartment(deptId).getMyID();

  return deptNo;
}

/*
  [取得登入帳號之負責門市]

  #2021-03-30 Create by Mars
*/
function GetChargeRetail() {
  var retailList = [];

  var memberId = Client.getCurrentMember().getID();
  var sql = "";
  try {
    sql =
      " WITH" +
      " RM AS" +
      " (" +
      " SELECT RolID" +
      " FROM Rol_Mem (NOLOCK)" +
      " WHERE MemID = ?" +
      " )" +
      " SELECT B.ID AS BrandNo, B.Name AS BrandName, T.RetailNo, T.RetailName" +
      " FROM" +
      " (" +
      " SELECT D3.ID AS RetailNo, D3.Name AS RetailName, D1.ParentID AS ParentId, R.RolID AS RolId" +
      " FROM Dep_GenInf D1 (NOLOCK)" +
      " INNER JOIN Dep_GenInf D2 (NOLOCK) ON D2.ParentID = D1.DepID AND CONVERT(VARCHAR(2), D2.Synopsis) = 'AR'" +
      " INNER JOIN Dep_GenInf D3 (NOLOCK) ON D3.ParentID = D2.DepID AND CONVERT(VARCHAR(1), D3.Synopsis) = 'R'" +
      " INNER JOIN Rol_GenInf R (NOLOCK) ON R.DepID = D1.DepID" +
      " WHERE CONVERT(VARCHAR(1), D1.Synopsis) = 'A'" +
      " UNION" +
      " SELECT D1.ID AS RetailNo, D1.Name AS RetailName, D3.ParentID AS ParentId, R.RolID AS RolId" +
      " FROM Dep_GenInf D1 (NOLOCK)" +
      " INNER JOIN Rol_GenInf R (NOLOCK) ON R.DepID = D1.DepID" +
      " INNER JOIN Dep_GenInf D2 (NOLOCK) ON D2.DepID = D1.ParentID AND CONVERT(VARCHAR(2), D2.Synopsis) = 'AR'" +
      " INNER JOIN Dep_GenInf D3 (NOLOCK) ON D3.DepID = D2.ParentID AND CONVERT(VARCHAR(1), D3.Synopsis) = 'A'" +
      " WHERE CONVERT(VARCHAR(1), D1.Synopsis) = 'R'" +
      " UNION" +
      " SELECT D5.ID AS RetailNo, D5.Name AS RetailName, D3.ParentID AS ParentId, R.RolID AS RolId" +
      " FROM Dep_GenInf D1 (NOLOCK)" +
      " INNER JOIN Dep_GenInf D2 (NOLOCK) ON D2.ParentID = D1.DepID" +
      " INNER JOIN Dep_GenInf D3 (NOLOCK) ON D3.ParentID = D2.DepID AND CONVERT(VARCHAR(2), D3.Synopsis) = 'A'" +
      " INNER JOIN Dep_GenInf D4 (NOLOCK) ON D4.ParentID = D3.DepID AND CONVERT(VARCHAR(2), D4.Synopsis) = 'AR'" +
      " INNER JOIN Dep_GenInf D5 (NOLOCK) ON D5.ParentID = D4.DepID AND CONVERT(VARCHAR(1), D5.Synopsis) = 'R'" +
      " INNER JOIN Rol_GenInf R (NOLOCK) ON R.DepID = D2.DepID" +
      " WHERE CONVERT(VARCHAR(1), D1.Synopsis) = 'B'" +
      " ) T" +
      " INNER JOIN RM ON RM.RolID = T.RolId " +
      " INNER JOIN Dep_GenInf D (NOLOCK) ON D.DepID = T.ParentId" +
      " INNER JOIN Dep_GenInf B (NOLOCK) ON B.DepID = D.ParentId AND CONVERT(VARCHAR(1), B.Synopsis) = 'B'" +
      " ORDER BY BrandNo, RetailNo";
    var args = [];
    args.push(memberId);

    var dtRetailList = Client.SQLloadValue(sql, args);
    if (dtRetailList != null) {
      for (var i = 0; i < dtRetailList.size(); i++) {
        var dr = dtRetailList.get(i);

        var retail = {};
        retail.BrandNo = dr.get("BrandNo");
        retail.BrandName = dr.get("BrandName");
        retail.RetailNo = dr.get("RetailNo");
        retail.RetailName = dr.get("RetailName");

        retailList.push(retail);
      }
    }
  }
  catch (ex) {
    Client.addExeLog("取得登入帳號之負責門市錯誤:" + ex.message);
    Client.addExeLog("sql=" + sql);
  }

  return retailList;
}

/*
  [設定登入帳號之負責門市]
  tblChargeRetail:	負責門市表格名稱

  #2021-03-31 Create by Mars
*/
function SetChargeRetail(tblChargeRetail) {
  if (tblChargeRetail != "" && Form.getComponent(tblChargeRetail) != null) {
    var table = Form.getComponent(tblChargeRetail);
    table.clear();

    var retailList = GetChargeRetail();
    for (var i = 0; i < retailList.length; i++) {
      var retail = retailList[i];
      var rowIndex = table.newRow() - 1;

      table.setValueAt(retail.BrandNo, rowIndex, "BrandNo");
      table.setValueAt(retail.BrandName, rowIndex, "BrandName");
      table.setValueAt(retail.RetailNo, rowIndex, "RetailNo");
      table.setValueAt(retail.RetailName, rowIndex, "RetailName");
    }
  }
}

/*
  [取得登入帳號之負責品牌]
  tblChargeRetail:	負責門市表格名稱

  #2021-03-31 Create by Mars
*/
function GetChargeBrand(tblChargeRetail) {
  var brandList = [];

  if (tblChargeRetail != "" && Form.getComponent(tblChargeRetail) != null && Form.getComponent(tblChargeRetail).getRowCount() > 0) {
    var table = Form.getComponent(tblChargeRetail);

    var brandNo = "";
    for (var i = 0; i < table.getRowCount(); i++) {
      if (!table.getValueAt(i, "BrandNo").equals(brandNo)) {
        var brand = {};
        brand.BrandNo = table.getValueAt(i, "BrandNo");
        brand.BrandName = table.getValueAt(i, "BrandName");
        brandList.push(brand);

        brandNo = table.getValueAt(i, "BrandNo");
      }
    }
  }

  return brandList;
}

/*
  [設定登入帳號之負責品牌]
  tblChargeRetail:	負責門市表格名稱
  ddlBrand:			品牌下拉式選單名稱

  #2021-03-31 Create by Mars
*/
function SetChargeBrand(tblChargeRetail, ddlBrand) {
  if (tblChargeRetail != "" && Form.getComponent(tblChargeRetail) != null && ddlBrand != "" && Form.getComponent(ddlBrand) != null) {
    var dropDownList = Form.getComponent(ddlBrand);
    dropDownList.removeAllOptions();

    var brandList = GetChargeBrand(tblChargeRetail);
    for (var i = 0; i < brandList.length; i++) {
      dropDownList.addOption(brandList[i].BrandNo + " " + brandList[i].BrandName, brandList[i].BrandNo);
    }
  }
}

/*
  [取得登入帳號之負責門市(by品牌編號)]
  tblChargeRetail:	負責門市表格名稱
  brandNo:			品牌編號

  #2021-03-31 Create by Mars
*/
function GetChargeRetailByBrandNo(tblChargeRetail, brandNo) {
  var retailList = [];

  if (tblChargeRetail != "" && Form.getComponent(tblChargeRetail) != null && Form.getComponent(tblChargeRetail).getRowCount() > 0 && brandNo != "") {
    var table = Form.getComponent(tblChargeRetail);

    for (var i = 0; i < table.getRowCount(); i++) {
      if (table.getValueAt(i, "BrandNo").equals(brandNo)) {
        var retail = {};
        retail.RetailNo = table.getValueAt(i, "RetailNo");
        retail.RetailName = table.getValueAt(i, "RetailName");
        retailList.push(retail);
      }
    }
  }

  return retailList;
}

/*
  [設定登入帳號之負責門市(by品牌編號)]
  tblChargeRetail:	負責門市表格名稱
  brandNo:			品牌編號
  ddlRetail:			門市下拉式選單名稱

  #2021-03-31 Create by Mars
*/
function SetChargeRetailByBrandNo(tblChargeRetail, brandNo, ddlRetail, defaultType) {
  if (tblChargeRetail != "" && Form.getComponent(tblChargeRetail) != null && brandNo != "" && ddlRetail != "" && Form.getComponent(ddlRetail) != null) {
    var dropDownList = Form.getComponent(ddlRetail);
    dropDownList.removeAllOptions();

    if (defaultType != null && defaultType == true) {
      dropDownList.addOption("-", "");
    }
    var retailList = GetChargeRetailByBrandNo(tblChargeRetail, brandNo);
    for (var i = 0; i < retailList.length; i++) {
      dropDownList.addOption(retailList[i].RetailNo + " " + retailList[i].RetailName, retailList[i].RetailNo);
    }
  }
}

/*
  [設定登入帳號之初始負責門市]
  tblChargeRetail:	負責門市表格名稱
  ddlBrand:			品牌下拉式選單名稱
  ddlRetail:			門市下拉式選單名稱

  #2021-03-31 Create by Mars
*/
function SetInitChargeRetail(tblChargeRetail, ddlBrand, ddlRetail, defaultType) {
  var errLog = "";

  SetChargeRetail(tblChargeRetail);
  SetChargeBrand(tblChargeRetail, ddlBrand);
  if (Form.getValue(ddlBrand).size() > 0 && !Form.getValue(ddlBrand).get(0).equals("")) {
    SetChargeRetailByBrandNo(tblChargeRetail, Form.getValue(ddlBrand).get(0), ddlRetail, defaultType);
  }
  else {
    errLog = "無門市查詢權限！";
  }

  return errLog;
}

/*------------------------------------------------------------------------------------------------------------------------------------------------------
  Function
------------------------------------------------------------------------------------------------------------------------------------------------------*/

/*
  [設置文字顏色]
  str:		字串
  fontColor:	文字顏色

  #2021-03-30 Create by Mars
*/
function SetFontColor(str, fontColor) {
  return "<font color=\'" + fontColor + "\'>" + str + "</font>";
}

/*
  [取得日期區間]
  forwardDays:	往後天數
  periodDays:		總計天數
  sort:			排序規則(asc: 從前往後; desc: 從後往前)

  #2021-03-30 Create by Mars
*/
function GetPeriodDate(forwardDays, periodDays, sort) {
  var periodDate = [];

  var myDate = new Packages.pase.agenda.MyDate();
  var nowDate = new Packages.java.text.SimpleDateFormat("yyyy/MM/dd").format(Client.getServerTime());
  var start = -forwardDays;
  var end = periodDays - forwardDays;
  var weight = -1;
  if (sort == "asc") {
    start = -(periodDays - forwardDays) + 1;
    end = forwardDays + 1;
    weight = 1;
  }
  var index = 0;
  for (var i = start; i < end; i++) {
    var newDate = myDate.add(nowDate, i * weight);
    periodDate[index++] = newDate;
  }

  return periodDate;
}

/*
  [設定日期區間]
  forwardDays:	往後天數
  periodDays:		總計天數
  sort:			排序規則(asc: 從前往後; desc: 從後往前)
  ddlDate:		日期下拉式選單名稱

  #2021-03-30 Create by Mars
*/
function SetPeriodDate(forwardDays, periodDays, sort, ddlDate) {
  if (ddlDate != "" && Form.getComponent(ddlDate) != null) {
    var dropDownList = Form.getComponent(ddlDate);
    dropDownList.removeAllOptions();

    var dateList = GetPeriodDate(forwardDays, periodDays, sort);
    if (dateList != null && dateList.length > 0) {
      for (var i = 0; i < dateList.length; i++) {
        dropDownList.addOption(dateList[i], dateList[i]);
      }
    }
  }
}

/*
  [取得週區間]
  forwardWeeks:	往後週數
  periodWeeks:	總計週數
  sort:			排序規則(asc: 從前往後; desc: 從後往前)

  #2021-04-08 Create by Mars
*/
function GetPeriodWeek(forwardWeeks, periodWeeks, sort) {
  var periodWeek = [];

  var myDate = new Packages.pase.agenda.MyDate();
  var nowDate = new Packages.java.text.SimpleDateFormat("yyyy/MM/dd").format(Client.getServerTime());
  var weekDay = myDate.getDayOfWeek(nowDate);
  var thursdayDate = myDate.add(nowDate, -(weekDay - 2));
  if (weekDay < 2) {
    thursdayDate = myDate.add(thursdayDate, -7);
  }
  var start = -forwardWeeks;
  var end = periodWeeks - forwardWeeks;
  var weight = -1;
  if (sort == "asc") {
    start = -(periodWeeks - forwardWeeks) + 1;
    end = forwardWeeks + 1;
    weight = 1;
  }
  var index = 0;
  for (var i = start; i < end; i++) {
    var newDate = myDate.add(thursdayDate, 7 * weight * i);
    periodWeek[index++] = newDate;
  }

  return periodWeek;
}

/*
  [設定週區間]
  forwardWeeks:	往後週數
  periodWeeks:	總計週數
  sort:			排序規則(asc: 從前往後; desc: 從後往前)
  ddlWeek:		週下拉式選單名稱

  #2021-04-08 Create by Mars
*/
function SetPeriodWeek(forwardWeeks, periodWeeks, sort, ddlWeek) {
  if (ddlWeek != "" && Form.getComponent(ddlWeek) != null) {
    var dropDownList = Form.getComponent(ddlWeek);
    dropDownList.removeAllOptions();

    var weekList = GetPeriodWeek(forwardWeeks, periodWeeks, sort);
    if (weekList != null && weekList.length > 0) {
      var myDate = new Packages.pase.agenda.MyDate();
      for (var i = 0; i < weekList.length; i++) {
        var startDate = myDate.add(weekList[i], 6);
        var endDate = myDate.add(weekList[i], 12);
        dropDownList.addOption(weekList[i] + " (" + startDate + " ~ " + endDate + ")", weekList[i]);
      }
    }
  }
}

/*
  [檢查表格是否有重覆資料]
  table:				被檢查的表格元件
  fieldList:			被檢查的欄位
  valueList:			資料
  excludeRowIndex:	排除檢查的列數

  #2021-04-08 Create by Mars
*/
function CheckTableDuplicate(table, fieldList, valueList, excludeRowIndex) {
  var result = true;

  if (table != null && fieldList != null && valueList.length > 0 && valueList != null && valueList.length > 0 && fieldList.length == valueList.length) {
    for (var i = 0; i < table.getRowCount(); i++) {
      if (excludeRowIndex != i) {
        var duplicateFlag = true;
        for (var j = 0; j < fieldList.length; j++) {
          if (!table.getValueAt(i, fieldList[j]).equals(valueList[j])) {
            duplicateFlag = false;
            break;
          }
        }
        if (duplicateFlag) {
          result = false;
          break;
        }
      }
    }
  }

  return result;
}

/*
  [取得隱藏Table值]
  table:		表格元件
  keyField:	搜尋Key欄位名稱
  key:		搜尋Key值
  valueField:	隱藏Value值
*/
function GetHiddenTableValue(table, keyField, key, valueField) {
  var value = "";

  if (table != null && keyField != "" && key != "" && valueField != "") {
    for (var i = 0; i < table.getRowCount(); i++) {
      if (table.getValueAt(i, keyField).equals(key)) {
        value = table.getValueAt(i, valueField);
        break;
      }
    }
  }

  return value;
}

/*
  [清除Table空列]
  table:		表格元件
  checkField:	檢查空值的欄位
*/
function ClearTableEmptyRow(table, checkField) {
  if (table != null && checkField != "") {
    for (var i = table.getRowCount() - 1; i >= 0; i--) {
      if (table.getValueAt(i, checkField).equals("")) {
        table.deleteRow(i);
      }
    }
  }
}

/*
  [匯出Excel]
  reportName:		報表名稱
  tblName:		輸出表格名稱
  columnName:		欄位名稱
  columnType:		欄位型態
  columnWidth:	欄位寬度
  downloadFlag:	是否下載

  #2021-08-06 Create by Mars
*/
function ExportToExcel(reportName, tblName, columnName, columnType, columnWidth, downloadFlag) {
  loadLibrary("SushiExpressScript.Common");
  importPackage(Packages.org.apache.poi.xssf.usermodel);
  importPackage(Packages.java.io);

  var workbook = new XSSFWorkbook();
  var sheet = workbook.createSheet();
  workbook.setSheetName(0, reportName);

  var borderStyle = Packages.org.apache.poi.ss.usermodel.BorderStyle;
  var horizontalAlignment = Packages.org.apache.poi.ss.usermodel.HorizontalAlignment;
  var verticalAlignment = Packages.org.apache.poi.ss.usermodel.VerticalAlignment;
  var fillPatternType = Packages.org.apache.poi.ss.usermodel.FillPatternType;
  var cellStyle_L = GetCellStyle(workbook, null, null, borderStyle.THIN, borderStyle.THIN, borderStyle.THIN, borderStyle.THIN, horizontalAlignment.LEFT, verticalAlignment.CENTER, "微軟正黑體", null, null, null, null, null, null, null);
  var cellStyle_R = GetCellStyle(workbook, cellStyle_L, null, null, null, null, null, horizontalAlignment.RIGHT, null, "微軟正黑體", null, null, null, null, null, null, null);
  var cellStyle_I = GetCellStyle(workbook, cellStyle_L, "#,##0", null, null, null, null, horizontalAlignment.RIGHT, null, "微軟正黑體", null, null, null, null, null, null, null);
  var cellStyle_D = GetCellStyle(workbook, cellStyle_L, "#,##0.00", null, null, null, null, horizontalAlignment.RIGHT, null, "微軟正黑體", null, null, null, null, null, null, null);
  var cellStyle_P = GetCellStyle(workbook, cellStyle_L, "0.00%", null, null, null, null, horizontalAlignment.RIGHT, null, "微軟正黑體", null, null, null, null, null, null, null);

  //標題
  var rowIndex = 0;
  var row = sheet.createRow(rowIndex++);
  for (var i = 0; i < columnName.length; i++) {
    var cellStyle = cellStyle_L;
    if (columnType[i] == "I" || columnType[i] == "D" || columnType[i] == "P") {
      cellStyle = cellStyle_R;
    }
    SetCell(row.createCell(i), cellStyle, columnName[i]);
    sheet.setColumnWidth(i, columnWidth[i]);
  }

  //資料
  var tbl = Form.getComponent(tblName);
  for (var i = 0; i < tbl.getRowCount(); i++) {
    var row = sheet.createRow(rowIndex++);
    for (var j = 0; j < columnName.length; j++) {
      var cellStyle = cellStyle_L;
      var cellValue = tbl.getValueAt(i, columnName[j]);
      if (columnType[j] == "I") {
        cellStyle = cellStyle_I;
        cellValue = parseInt(cellValue.replaceAll(",", ""));
      }
      else if (columnType[j] == "D") {
        cellStyle = cellStyle_D;
        cellValue = parseFloat(cellValue.replaceAll(",", ""));
      }
      else if (columnType[j] == "P") {
        cellStyle = cellStyle_P;
        cellValue = parseFloat(cellValue.replaceAll("%", "") / 100);
      }
      SetCell(row.createCell(j), cellStyle, cellValue);
    }
  }

  //存檔
  var nowTime = new Packages.pase.agenda.MyDate().getCurrentDate("yMdHms");
  var fileFolder = GetVariableValue("FileTempPath");
  var fileName = reportName + "_" + nowTime + ".xlsx";
  var file = new java.io.FileOutputStream(fileFolder + fileName);
  workbook.write(file);
  file.close();

  //下載
  if (downloadFlag) {
    Form.downloadFile(fileFolder, fileName);
  }

  return fileFolder + fileName;
}

/*------------------------------------------------------------------------------------------------------------------------------------------------------
  Business Logic
------------------------------------------------------------------------------------------------------------------------------------------------------*/

/*
  [取得單據時間點]
  checkTimes:		檢查時間
  deliveryDate:	出貨日期

  #2021-04-08 Create by Mars
*/
function GetSPOTime(checkTimes, deliveryDate) {
  var result = "9";

  if (checkTimes != null && checkTimes.length >= 1 && checkTimes.length < 10) {
    //		var myDate = " 2022/02/28/ 09:29 54";
    //		var nowDate = " 2022/02/28";
    //		var nowTime =  " 2022/02/28 09:29:55";

    var myDate = new Packages.pase.agenda.MyDate();
    var nowDate = new Packages.java.text.SimpleDateFormat("yyyy/MM/dd").format(Client.getServerTime());
    var nowTime = new Packages.java.text.SimpleDateFormat("yyyy/MM/dd HH:mm:ss").format(Client.getServerTime());

    for (var i = 0; i < checkTimes.length; i++) {
      if (myDate.getSubtractSecond(nowDate + " " + checkTimes[i], nowTime) < 0) {
        result = i.toString();
        break;
      }
    }

    if (deliveryDate != null) {
      //如果出貨日期不為明天，若result != "0" && result != "9"，則設置為1
      if (myDate.getSubtractDay(nowDate, deliveryDate) > 1 && result != "0" && result != "9") {
        result = "1";
      }
    }
  }

  return result;
}

/*GetChargeBrand
  [檢查訂單資料]
  brandNo:	品牌編號
  retailNo:	門市編號
  poTime:		單據時間點
  startTime:	下單開始時間
  endTime:	下單結束時間
  checkType:	檢查點

  #2021-04-08 Create by Mars
*/
function CheckSPOData(brandNo, retailNo, poTime, startTime, endTime, checkType) {
  var errLog = "";

  //檢查門市資料
  if (brandNo == "" || retailNo == "") {
    errLog = "門市資料異常！";
  }
  else {
    //檢查下單時間
    if (checkType == "1" && poTime == "0") {
      errLog = "未達下單時間(" + startTime + ")！";
    }
    else if (poTime == "9") {
      errLog = "已過截止時間(" + endTime + ")！";
    }
  }

  return errLog;
}

```