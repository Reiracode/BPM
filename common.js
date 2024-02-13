/*------------------------------------------------------------------------------------------------------------------------------------------------------
  Fundamental
------------------------------------------------------------------------------------------------------------------------------------------------------*/

/*
  [取得呼叫源為Client/Server]
	
  #2021-03-30 Create by Mars
*/
function GetContext() {
  if (typeof (Server) != "undefined") {
    return Server;
  }
  else if (typeof (Client) != "undefined") {
    return Client;
  }
  else {
    return null;
  }
}

/*------------------------------------------------------------------------------------------------------------------------------------------------------
  AgentFlow
------------------------------------------------------------------------------------------------------------------------------------------------------*/

/*
  [取得專案成員MemId]
  rolId:	專案成員Id
	
  #2021-03-30 Create by Mars
*/
function GetPrjRolMemId(rolId) {
  var memIdList = [];

  if (rolId != "") {
    var context = GetContext();
    try {
      var sql =
        " SELECT DISTINCT MemID AS MemId" +
        " FROM PrjRol_Mem (NOLOCK)" +
        " WHERE RolID = ?";
      var args = [];
      args.push(rolId);

      var dtMemId = context.SQLloadValue(sql, args);
      if (dtMemId != null && dtMemId.size() > 0) {
        for (var i = 0; i < dtMemId.size(); i++) {
          memIdList[i] = dtMemId.get(i).get("MemId");
        }
      }
    }
    catch (ex) {
      context.addExeLog("取得專案職務代碼錯誤:" + ex.message);
      context.addExeLog("sql=" + sql);
    }
  }

  return memIdList;
}

/*
  [取得門市成員MemId]
  retailNo:	門市編號[retailNo]

  #2021-04-14 Create by Mars
*/
function GetRetailMemId(retailNo) {
  var memIdList = [];

  if (retailNo != null && retailNo.length > 0) {
    var context = GetContext();
    try {
      var sql_Where_DepId = "";
      for (var i = 0; i < retailNo.length; i++) {
        if (retailNo[i] != "") {
          sql_Where_DepId += ", '" + retailNo[i] + "'";
        }
      }

      if (sql_Where_DepId.length > 2) {
        sql_Where_DepId = sql_Where_DepId.substring(2, sql_Where_DepId.length);

        var sql =
          " SELECT DISTINCT RM.MemID AS MemId" +
          " FROM Rol_GenInf R (NOLOCK)" +
          " INNER JOIN Dep_GenInf D (NOLOCK) ON D.DepID = R.DepID" +
          " INNER JOIN Rol_Mem RM (NOLOCK) ON RM.RolID = R.RolID" +
          " WHERE D.ID IN (" + sql_Where_DepId + ")";

        var dtMemId = context.SQLloadValue(sql);
        if (dtMemId != null && dtMemId.size() > 0) {
          for (var i = 0; i < dtMemId.size(); i++) {
            memIdList[i] = dtMemId.get(i).get("MemId");
          }
        }
      }
    }
    catch (ex) {
      context.addExeLog("取得門市成員MemId錯誤:" + ex.message);
      context.addExeLog("sql=" + sql);
    }
  }

  return memIdList;
}

/*
  [取得門市Email]
  retailNo:	門市編號[retailNo]

  #2021-05-18 Create by Mars
*/
function GetRetailEmail(retailNo) {
  var email = "";

  if (retailNo != null && retailNo.length > 0) {
    var context = GetContext();
    try {
      var sql_Where_DepId = "";
      for (var i = 0; i < retailNo.length; i++) {
        if (retailNo[i] != "") {
          sql_Where_DepId += ", '" + retailNo[i] + "'";
        }
      }

      if (sql_Where_DepId.length > 2) {
        sql_Where_DepId = sql_Where_DepId.substring(2, sql_Where_DepId.length);

        var sql =
          " SELECT DISTINCT M.EMail AS Email" +
          " FROM Dep_GenInf D (NOLOCK)" +
          " INNER JOIN Rol_GenInf R (NOLOCK) ON R.DepID = D.DepID" +
          " INNER JOIN Rol_Mem RM (NOLOCK) ON RM.RolID = R.RolID" +
          " INNER JOIN Mem_GenInf M (NOLOCK) ON M.MemID = RM.MemID" +
          " WHERE CONVERT(VARCHAR(2), D.Synopsis) = 'R'" +
          " AND D.ID IN (" + sql_Where_DepId + ")" +
          " AND ISNULL(M.EMail, '') <> ''";

        var dtEmail = context.SQLloadValue(sql);
        if (dtEmail != null && dtEmail.size() > 0) {
          for (var i = 0; i < dtEmail.size(); i++) {
            email += dtEmail.get(i).get("EMail") + ";";
          }
        }
      }
    }
    catch (ex) {
      context.addExeLog("取得取得門市Email錯誤:" + ex.message);
      context.addExeLog("sql=" + sql);
    }
  }

  return email;
}

/*
  [取得專案成員Email]
  rolId:	專案成員Id

  #2021-04-21 Create by Mars
*/
function GetPrjRolEmail(rolId) {
  var email = "";

  if (rolId != "") {
    var context = GetContext();
    var memIdList = GetPrjRolMemId(rolId);
    for (var i = 0; i < memIdList.length; i++) {
      var member = context.getMember(memIdList[i]);
      if (member != null && member.getEmail() != "") {
        email += member.getEmail() + "; ";
      }
    }
  }

  return email;
}

/*
  [取得部門成員Email]
  deptId:		部門Id
  subFlag:	是否包含子部門

  #2021-04-21 Create by Mars
*/
function GetDeptMemEmail(detpId, subFlag) {
  var email = "";

  if (detpId != "") {
    var context = GetContext();
    var memIdList = context.getSubMemberIDOfDR(detpId, subFlag);
    for (var i = 0; i < memIdList.size(); i++) {
      var member = context.getMember(memIdList.get(i));
      if (member != null && member.getEmail() != "") {
        email += member.getEmail() + "; ";
      }
    }
  }

  return email;
}

/*
  [取得變數值]
  variableCode:	變數代碼
	
  #2021-04-08 Create by Mars
*/
function GetVariableValue(variableCode) {
  var variableValue = "";

  if (variableCode != "") {
    var context = GetContext();
    try {
      var sql =
        " SELECT VariableValue" +
        " FROM AF_Variable (NOLOCK)" +
        " WHERE Name = ?";
      var args = [];
      args.push(variableCode);

      var dtVariable = context.SQLloadValue(sql, args);
      if (dtVariable != null && dtVariable.size() > 0) {
        variableValue = dtVariable.get(0).get("VariableValue");
      }
    }
    catch (ex) {
      context.addExeLog("取得變數值錯誤:" + ex.message);
      context.addExeLog("sql=" + sql);
    }
  }

  return variableValue;
}

/*
  [取得日曆特定日期]
  dateName:	特定日期名稱

  #2021-05-03 Create by Mars
*/
function GetCalendarDate(dateName) {
  var date = "";

  if (dateName != "") {
    var context = GetContext();
    try {
      var sql =
        " SELECT DayOfYear" +
        " FROM AF_IncludeDays (NOLOCK)" +
        " WHERE Name = ?";
      var args = [];
      args.push(dateName);

      var dtIncludeDays = context.SQLloadValue(sql, args);
      if (dtIncludeDays != null && dtIncludeDays.size() > 0) {
        date = dtIncludeDays.get(0).get("DayOfYear");
      }
    }
    catch (ex) {
      context.addExeLog("取得日曆特定日期錯誤:" + ex.message);
      context.addExeLog("sql=" + sql);
    }
  }

  return date;
}

/*------------------------------------------------------------------------------------------------------------------------------------------------------
  Function
------------------------------------------------------------------------------------------------------------------------------------------------------*/

/*
  [四捨五入]
  value:	原數值
  digit:	四捨五入到小數第幾位
	
  #2021-03-30 Create by Mars
*/
function MathRound(value, digit) {
  var tValue = 0;

  var context = GetContext();
  try {
    var mathValue = new java.math.BigDecimal("" + value);
    tValue = mathValue.setScale(digit, 4);
  }
  catch (ex) {
    context.addExeLog("四捨五入錯誤:" + ex.message);
    context.addExeLog("value=" + value);
  }

  return tValue;
}

/*
  [取得完整月份]
  month:	月份
	
  #2021-04-22 Create by Mars
*/
function GetFullMonth(month) {
  var fullMonth = "0" + month;

  fullMonth = fullMonth.substring(fullMonth.length - 2, fullMonth.length);

  return fullMonth;
}

/*
  [設定儲存格]
  cell:		儲存格
  cellStyle:	儲存格格式
  cellValue:	值

  #2021-08-05 Create by Mars
*/
function SetCell(cell, cellStyle, cellValue) {
  cell.setCellStyle(cellStyle);
  cell.setCellValue(cellValue);
}

/*
  [設定儲存格]
  workbook:				工作表
  cloneCellStyle:			複製儲存格格式
  dataFormat:				儲存格型態
  borderRight:			右方格線格式
  borderLeft:				左方格線格式
  borderTop:				上方格線格式
  borderBottom:			下方格線格式
  horizontalAlignment:	水平格式
  verticalAlignment:		垂直格式
  fontName:				字體格式
  fontHeightInPoints:		字體大小
  fontColor:				字體顏色
  bold:					粗體格式
  italic:					斜體格式
  underline:				底線格式
  fillForegroundColor:	前景顏色
  fillPattern:			前景格式


  #2021-08-05 Create by Mars
*/
function GetCellStyle(workbook, cloneCellStyle, dataFormat, borderRight, borderLeft, borderTop, borderBottom, horizontalAlignment, verticalAlignment, fontName,
  fontHeightInPoints, fontColor, bold, italic, underline, fillForegroundColor, fillPattern) {
  var cellStyle = workbook.createCellStyle();

  if (cloneCellStyle != null) {
    cellStyle.cloneStyleFrom(cloneCellStyle);
  }
  if (dataFormat != null) {
    cellStyle.setDataFormat(workbook.createDataFormat().getFormat(dataFormat));
  }
  if (borderRight != null) {
    cellStyle.setBorderRight(borderRight);
  }
  if (borderLeft != null) {
    cellStyle.setBorderLeft(borderLeft);
  }
  if (borderTop != null) {
    cellStyle.setBorderTop(borderTop);
  }
  if (borderBottom != null) {
    cellStyle.setBorderBottom(borderBottom);
  }
  if (horizontalAlignment != null) {
    cellStyle.setAlignment(horizontalAlignment);
  }
  if (verticalAlignment != null) {
    cellStyle.setVerticalAlignment(verticalAlignment);
  }
  if (fillForegroundColor != null) {
    cellStyle.setFillForegroundColor(fillForegroundColor);
  }
  if (fillPattern != null) {
    cellStyle.setFillPattern(fillPattern);
  }

  var font = workbook.createFont();
  if (bold != null) {
    font.setBold(bold); 							//粗體
  }
  if (italic != null) {
    font.setItalic(italic); 						//斜體
  }
  if (underline != null) {
    font.setUnderline(underline); 					//底線(這是單底線，雙底線是0X02)
  }
  if (fontName != null) {
    font.setFontName(fontName);						//設置字體為微軟正黑體
  }
  if (fontHeightInPoints != null) {
    font.setFontHeightInPoints(fontHeightInPoints); //字型大小(10會是16，20會是32，30會是48，數字乘上1.6變實際字體大小)
  }
  if (fontColor != null) {
    font.setColor(fontColor); 						//顏色 (0X1是白色三原色都255，0X10是紅色128，0X11是綠色128，0X15是綠色、藍色128，0X20是藍色128)
  }
  cellStyle.setFont(font);

  return cellStyle;
}

/*
  [取得環境文字]

  #2021-10-19 Create by Mars
*/
function GetEnvStr() {
  var envStr = "";

  var productionFlag = GetVariableValue("ProductionFlag");
  if (productionFlag == "0") {
    envStr = "-開發";
  }
  else if (productionFlag == "2") {
    envStr = "-測試";
  }

  return envStr;
}

/*
  [取得星期文字]

  #2022-03-31
*/
function GetWeekStr(weekDay) {
  var weekStr = "";

  switch (weekDay) {
    case 0:
      weekStr = "日";
      break;
    case 1:
      weekStr = "一";
      break;
    case 2:
      weekStr = "二";
      break;
    case 3:
      weekStr = "三";
      break;
    case 4:
      weekStr = "四";
      break;
    case 5:
      weekStr = "五";
      break;
    case 6:
      weekStr = "六";
      break;
  }

  return weekStr;
}

/*
  [取得附件名稱列表]
  attachFile:	附件元件

  #2022-08-16
*/
function GetAttachedFileNameList(attachFile) {
  var attachedFileNameList = [];

  var fileList = [];
  if (typeof (Server) != "undefined") {
    fileList = Packages.pe.filesystem.AttachFileInfo.parseAttachFileInfo(attachFile);
  }
  else if (typeof (Client) != "undefined") {
    fileList = attachFile.getFileList();
  }

  for (var i = 0; i < fileList.size(); i++) {
    var fileInfo = fileList.get(i);
    attachedFileNameList.push(fileInfo.getFileName());
  }

  return attachedFileNameList;
}

/*
  [取得副檔名]
  fileName:	檔案名稱

  #2022-08-16
*/
function GetFileExt(fileName) {
  var fileExt = "";

  var index = fileName.lastIndexOf(".");
  if (index >= 0) {
    fileExt = fileName.substring(index + 1);
  }

  return fileExt;
}

/*------------------------------------------------------------------------------------------------------------------------------------------------------
  Database
------------------------------------------------------------------------------------------------------------------------------------------------------*/
/*
  [取得DB連線]
  dbName:	短期資料庫名稱

  #2021-04-20 Create by Mars
*/
function GetConn(dbName) {
  var conn = null;

  var context = GetContext();
  try {
    //DB連線
    if (dbName == null || dbName == "") {
      dbName = "DB_Application";
    }
    conn = context.createSessionConnection(dbName);
  }
  catch (ex) {
    context.addExeLog("資料庫連線失敗:" + ex.message);
  }

  return conn;
}

/*
  [取得DB資料]
  sql:	Sql指令
  dbName:	短期資料庫名稱

  #2021-03-30 Create by Mars
*/
function GetData(sql, dbName) {
  var data = null;

  var context = GetContext();
  try {
    //DB連線
    if (dbName == null || dbName == "") {
      dbName = "DB_Application";
    }
    var conn = context.createSessionConnection(dbName);

    //讀取資料
    data = conn.loadValue(sql);
  }
  catch (ex) {
    context.addExeLog("資料庫讀取失敗:" + ex.message);
    context.addExeLog("Sql=" + sql);
  }
  finally {
    if (conn != null) {
      conn.close();
    }
  }

  return data;
}

/*
  [取得DB資料(帶參數)]
  sql:	Sql指令
  args:	參數
  dbName:	短期資料庫名稱

  #2021-03-30 Create by Mars
*/
function GetDataWithArgs(sql, args, dbName) {
  var data = null;

  var context = GetContext();
  try {
    //DB連線
    if (dbName == null || dbName == "") {
      dbName = "DB_Application";
    }
    var conn = context.createSessionConnection(dbName);

    //讀取資料
    var data = conn.loadValue(sql, args);
  }
  catch (ex) {
    context.addExeLog("資料庫讀取失敗:" + ex.message);
    context.addExeLog("Sql=" + sql);
  }
  finally {
    if (conn != null) {
      conn.close();
    }
  }

  return data;
}

/*
  [取得DB UniqueIdentifier]

  #2021-04-14 Create by Mars
*/
function GetDBNewId() {
  var id = "";

  var sql =
    " SELECT NEWID() AS Id";
  var dt = GetData(sql);
  if (dt != false && dt.size() > 0) {
    id = dt.get(0).get("Id");
  }

  return id;
}

/*------------------------------------------------------------------------------------------------------------------------------------------------------
  SAP
------------------------------------------------------------------------------------------------------------------------------------------------------*/

/*
  [取得SAP連線]
  sapConnName:	SAP連線名稱

  #2021-04-19 Create by Mars
*/
function GetSAPConn(sapConnName) {
  var sapConn = null;

  if (sapConnName == null || sapConnName == "") {
    sapConnName = "SAP";
  }
  var url = "rmi://localhost:1301/" + sapConnName;

  try {
    sapConn = java.rmi.Naming.lookup(url);
  }
  catch (ex) {
    var context = GetContext();
    context.addExeLog("SAP連線失敗:" + ex.message);
  }

  return sapConn;
}

/*
  [取得初始RFC Return物件]
	
  #2021-04-20 Create by Mars
*/
function GetInitRFCReturn() {
  var rfcReturn = {};

  rfcReturn.Type = "";
  rfcReturn.Number = "";
  rfcReturn.Message = "";
  rfcReturn.LogNo = "";

  return rfcReturn;
}

/*
  [取得RFC Return物件]
  rfcReturnTable:	RFC回傳Table
	
  #2021-04-20 Create by Mars
*/
function GetRFCReturnList(rfcReturnTable) {
  var rfcReturnList = [];

  while (!rfcReturnTable.isEmpty()) {
    rfcReturn = GetInitRFCReturn();
    if (rfcReturnTable.getString("TYPE") != null) {
      rfcReturn.Type = rfcReturnTable.getString("TYPE");
    }
    if (rfcReturnTable.getString("NUMBER") != null) {
      rfcReturn.Number = rfcReturnTable.getString("NUMBER");
    }
    if (rfcReturnTable.getString("MESSAGE") != null) {
      rfcReturn.Message = rfcReturnTable.getString("MESSAGE");
    }
    if (rfcReturnTable.getString("LOG_NO") != null) {
      rfcReturn.LogNo = rfcReturnTable.getString("LOG_NO");
    }
    rfcReturnList.push(rfcReturn);

    if (!rfcReturnTable.nextRow()) {
      break;
    }
  }

  return rfcReturnList;
}

/*
  [格式化RFC日期格式]
  data: RFC傳入值

  #2021-06-15 Create by Mars
*/
function RFCDateFormat(data) {
  if (data != null) {
    if (data != "") {
      if (data == "0000-00-00") {
        data = "";
      }
      else {
        data = data.replaceAll("'", "");
      }
    }
  }
  else {
    data = "";
  }
  return data;
}

/*------------------------------------------------------------------------------------------------------------------------------------------------------
  DMS
------------------------------------------------------------------------------------------------------------------------------------------------------*/
/*
  [新增發佈DMS文件]
  dmsTypeCode:			DMS文件類型代碼
  deptName:				部門名稱(二階，以Underline連接)
  authorId:				作者Member Id
  serialId:				DMS文件Id
  documentName:			文件名稱
  documentType:			文件類型
  description:			文件描述
  versionId:				版本
  docSecurityLevel:		加密方式
  artId:					表單Id
  insId:					文件Id
  attachedFileItemNo:		附件ItemNo
  attachedFileNameList:	附件名稱列表
  publishFlag:			是否發佈

  #2022-08-16 Create by Mars
*/
function CreateDMSDocument(dmsTypeCode, deptName, authorId, serialId, documentName, documentType, description, versionId, docSecurityLevel, artId, insId, attachedFileItemNo, attachedFileNameList, publishFlag) {
  var errLog = "";

  var deptType = GetDeptType(dmsTypeCode, deptName);
  var attributeTypeId = deptType.TypeId;
  var publishFolderId = deptType.PublishFolderId;
  if (attributeTypeId == "" || publishFolderId == "") {
    errLog = "查無 [" + deptName + "] 對應之DMS合約文件夾！";
  }
  else {
    var dmciImpl = GetDMCIImpl();
    if (dmciImpl != null) {
      var dmService = dmciImpl.getDMService();
      var queryService = dmciImpl.getQueryService();

      var documentKey = CreateDMSVirtualDocument(dmService, queryService, publishFolderId, authorId, serialId, documentName, attributeTypeId, documentType, description, versionId, docSecurityLevel);
      if (documentKey == "") {
        errLog = "創建DMS文件失敗！";
      }
      else {
        UploadDMSNewPhysicalDocument(dmciImpl, artId, insId, attachedFileItemNo, documentKey, authorId, attachedFileNameList);

        if (publishFlag) {
          if (CommitDMSPublishDocument(dmService, documentKey, publishFolderId)) {
            errLog = "發佈DMS文件失敗！";
          }
        }
      }
    }
    else {
      errLog = "DMS連線失敗！";
    }
  }

  return errLog;
}

/*
  [取得DMS文件類型Id、資料夾Id]
  dmsTypeCode:			DMS文件類型代碼
  deptName:				部門名稱(二階，以Underline連接)

  #2022-08-16 Create by Mars
*/
function GetDeptType(dmsTypeCode, detpName) {
  var deptType = {};
  deptType.TypeId = "";
  deptType.PublishFolderId = "";

  var dmsParentTypeId = GetVariableValue("DMSTypeId_" + dmsTypeCode);

  var sql =
    " SELECT ISNULL(TypeId, '') AS TypeId, ISNULL(PublishFolder, '') AS PublishFolder" +
    " FROM AttributeType (NOLOCK)" +
    " WHERE ParentId = ?" +
    " AND TypeName = ?";
  var args = [];
  args.push(dmsParentTypeId);
  args.push(deptName);

  var dtDeptType = GetDataWithArgs(sql, args, "DB_DMS");
  if (dtDeptType != null && dtDeptType.size() > 0) {
    var dr = dtDeptType.get(0);
    deptType.TypeId = dr.get("TypeId");
    deptType.PublishFolderId = dr.get("PublishFolder");
  }

  return deptType;
}

/*
  [取得DMS連線]

  #2022-08-16 Create by Mars
*/
function GetDMCIImpl() {
  loadLibrary("SushiExpressScript.Common");

  var dmciImpl = Packages.ogre.dms.util.si.DMCIFactory.createDMCIImpl();

  var dmsHost = GetVariableValue("DMSHost");
  var dmsPort = GetVariableValue("DMSPort");
  if (dmciImpl.connectServer(dmsHost, dmsPort)) {
    return dmciImpl;
  }
  else {
    return null;
  }
}

/*
  [新增DMS文件]
  dmService:				DMS服務
  queryService:			DMS查詢服務
  publishFolderId:		文件資料夾Id
  authorId:				作者Member Id
  serialId:				DMS文件Id
  documentName:			文件名稱
  documentType:			文件類型
  description:			文件描述
  versionId:				版本
  docSecurityLevel:		加密方式

  #2022-08-16 Create by Mars
*/
function CreateDMSVirtualDocument(dmService, queryService, publishFolderId, authorId, serialId, documentName, attributeTypeId, documentType, description, versionId, docSecurityLevel) {
  var documentKey = "";

  var virtualDocumentInfo = new Packages.ogre.dms.data.VirtualDocumentInfo();
  virtualDocumentInfo.setPublishFolderID(publishFolderId);
  virtualDocumentInfo.setAuthorID(authorId);
  virtualDocumentInfo.setSerialID(serialId);
  virtualDocumentInfo.setDocumentName(documentName);
  virtualDocumentInfo.setAttributeTypeID(attributeTypeId);
  virtualDocumentInfo.setDocumentType(documentType);
  virtualDocumentInfo.setDescription(description);
  virtualDocumentInfo.setVersionID(versionId);
  virtualDocumentInfo.setDocSecurityLevel(docSecurityLevel);

  var virtualDocument = new Packages.ogre.dms.data.VirtualDocument(virtualDocumentInfo);
  documentKey = dmService.commitCreateVirtualDocument(authorId, queryService.getUserByID(authorId).getUserWorkSpaceID(), virtualDocument);

  return documentKey;
}

/*
  [上傳DMS附件]
  dmciImpl:				DMS連線
  artId:					表單Id
  insId:					文件Id
  attachedFileItemNo:		附件ItemNo
  documentKey:			DMS文件Key
  authorId:				作者Member Id
  attachedFileNameList:	附件名稱列表

  #2022-08-16 Create by Mars
*/
function UploadDMSNewPhysicalDocument(dmciImpl, artId, insId, attachedFileItemNo, documentKey, authorId, attachedFileNameList) {
  loadLibrary("SushiExpressScript.Common");

  var fileUploadPath = GetVariableValue("FileUploadPath") + artId + "\\" + insId + attachedFileItemNo + "\\";
  var physicalDocumentTransferTool = dmciImpl.getPhysicalDocumentTransferTool();

  for (var i = 0; i < attachedFileNameList.length; i++) {
    var filePath = fileUploadPath + attachedFileNameList[i];
    var fileObject = new java.io.File(filePath);
    var fileInputStream = new java.io.FileInputStream(fileObject);
    var fileName = attachedFileNameList[i];
    var fileExt = GetFileExt(fileName);
    physicalDocumentTransferTool.uploadNewPhysicalDocument(authorId, documentKey, fileExt, fileName, fileInputStream);
  }
}

/*
  [發佈DMS文件]
  dmService:				DMS服務
  documentKey:			DMS文件Key
  publishFolderId:		文件資料夾Id

  #2022-08-16 Create by Mars
*/
function CommitDMSPublishDocument(dmService, documentKey, publishFolderId) {
  var result = false;

  result = dmService.commitPublishDocument("Administrator", documentKey, publishFolderId);

  return result;
}

/*------------------------------------------------------------------------------------------------------------------------------------------------------
  Master Data
------------------------------------------------------------------------------------------------------------------------------------------------------*/

/*
  [取得品牌]
*/
function GetBrand() {
  var brandList = [];

  var sql =
    " SELECT B.BrandNo, B.BrandName" +
    " FROM MD_Brand B (NOLOCK)" +
    " ORDER BY B.BrandNo";

  var dtBrand = GetData(sql);
  if (dtBrand != null) {
    for (var i = 0; i < dtBrand.size(); i++) {
      var dr = dtBrand.get(i);

      var brand = {};
      brand.BrandNo = dr.get("BrandNo");
      brand.BrandName = dr.get("BrandName");

      brandList.push(brand);
    }
  }

  return brandList;
}

/*
  [取得所有門市]

  #2021-04-21 Create by Mars
*/
function GetRetail() {
  return GetRetailProcedure("", "");
}

/*
  [取得門市(by 門市編號)]
  retailNo:	門市編號

  #2021-03-30 Create by Mars
*/
function GetRetailByRetailNo(retailNo) {
  var retail = null;

  if (retailNo != "") {
    var retailList = GetRetailProcedure("", retailNo);
    if (retailList.length > 0) {
      retail = retailList[0];
    }
  }

  return retail;
}

/*
  [取得門市(by 品牌編號)]
  brandNo:	品牌編號

  #2021-03-30 Create by Mars
*/
function GetRetailByBrandNo(brandNo) {
  return GetRetailProcedure(brandNo, "");
}

/*
  [取得門市程式(非Publish)]
  brandNo:	品牌編號
  retailNo:	門市編號

  #2021-03-30 Create by Mars
*/
function GetRetailProcedure(brandNo, retailNo) {
  var retailList = [];

  var sql =
    " SELECT B.BrandNo, B.BrandName, R.RetailNo, R.RetailName, R.FactoryNo, R.DeliveryTime, CASE WHEN R.OpenDate IS NULL OR YEAR(R.OpenDate) = 1900 THEN '' ELSE CONVERT(VARCHAR(10), R.OpenDate, 120) END AS OpenDate, R.Currency, R.Address" +
    " FROM MD_Retail R (NOLOCK)" +
    " INNER JOIN MD_Brand B (NOLOCK) ON B.BrandNo = R.BrandNo" +
    " WHERE 1 = 1";
  var args = [];

  if (brandNo != "") {
    sql += " AND R.BrandNo = ?";
    args.push(brandNo);
  }
  if (retailNo != "") {
    sql += " AND R.RetailNo = ?";
    args.push(retailNo);
  }

  sql += " ORDER BY B.BrandNo, R.RetailNo";

  var dtRetail = GetDataWithArgs(sql, args);
  if (dtRetail != null) {
    for (var i = 0; i < dtRetail.size(); i++) {
      var dr = dtRetail.get(i);

      var retail = {};
      retail.BrandNo = dr.get("BrandNo");
      retail.BrandName = dr.get("BrandName");
      retail.RetailNo = dr.get("RetailNo");
      retail.RetailName = dr.get("RetailName");
      retail.FactoryNo = dr.get("FactoryNo");
      retail.DeliveryTime = dr.get("DeliveryTime");
      retail.OpenDate = dr.get("OpenDate");
      retail.Currency = dr.get("Currency");
      retail.Address = dr.get("Address");

      retailList.push(retail);
    }
  }

  return retailList;
}

/*
  [取得商品大類]

  #2021-03-30 Create by Mars
*/
function GetMaterialCategory1() {
  var materialCategory1List = [];

  var sql =
    " SELECT MaterialCategory1No, MaterialCategory1Name" +
    " FROM MD_MaterialCategory (NOLOCK)" +
    " GROUP BY MaterialCategory1No, MaterialCategory1Name" +
    " ORDER BY MaterialCategory1No";

  var dtMaterialCategory1 = GetData(sql);
  if (dtMaterialCategory1 != null) {
    for (var i = 0; i < dtMaterialCategory1.size(); i++) {
      var dr = dtMaterialCategory1.get(i);

      var materialCategory1 = {};
      materialCategory1.MaterialCategory1No = dr.get("MaterialCategory1No");
      materialCategory1.MaterialCategory1Name = dr.get("MaterialCategory1Name");

      materialCategory1List.push(materialCategory1);
    }
  }

  return materialCategory1List;
}

/*
  [取得商品中類]
  materialCategory1No:	商品大類編號

  #2021-03-30 Create by Mars
*/
function GetMaterialCategory2(materialCategory1No) {
  var materialCategory2List = [];

  if (materialCategory1No != "") {
    var sql =
      " SELECT MaterialCategory2No, MaterialCategory2Name" +
      " FROM MD_MaterialCategory (NOLOCK)" +
      " WHERE MaterialCategory1No = ?" +
      " GROUP BY MaterialCategory2No, MaterialCategory2Name" +
      " ORDER BY MaterialCategory2No";
    var args = [];
    args.push(materialCategory1No);

    var dtMaterialCategory2 = GetDataWithArgs(sql, args);
    if (dtMaterialCategory2 != null) {
      for (var i = 0; i < dtMaterialCategory2.size(); i++) {
        var dr = dtMaterialCategory2.get(i);

        var materialCategory2 = {};
        materialCategory2.MaterialCategory2No = dr.get("MaterialCategory2No");
        materialCategory2.MaterialCategory2Name = dr.get("MaterialCategory2Name");

        materialCategory2List.push(materialCategory2);
      }
    }
  }

  return materialCategory2List;
}

/*
  [取得商品小類]
  materialCategory2No:	商品中類編號

  #2021-03-30 Create by Mars
*/
function GetMaterialCategory3(materialCategory2No) {
  var materialCategory3List = [];

  if (materialCategory2No != "") {
    var sql =
      " SELECT MaterialCategory3No, MaterialCategory3Name" +
      " FROM MD_MaterialCategory (NOLOCK)" +
      " WHERE MaterialCategory2No = ?" +
      " GROUP BY MaterialCategory3No, MaterialCategory3Name" +
      " ORDER BY MaterialCategory3No";
    var args = [];
    args.push(materialCategory2No);

    var dtMaterialCategory3 = GetDataWithArgs(sql, args);
    if (dtMaterialCategory3 != null) {
      for (var i = 0; i < dtMaterialCategory3.size(); i++) {
        var dr = dtMaterialCategory3.get(i);

        var materialCategory3 = {};
        materialCategory3.MaterialCategory3No = dr.get("MaterialCategory3No");
        materialCategory3.MaterialCategory3Name = dr.get("MaterialCategory3Name");

        materialCategory3List.push(materialCategory3);
      }
    }
  }

  return materialCategory3List;
}

/*
  [取得商品]
  brandNo:				品牌編號
  materialCategory1No:	商品大類編號
  materialCategory2No:	商品中類編號
  materialCategory3No:	商品小類編號
  materialType2:			商品分類2(N: 一般; E: 預估; D: 需求物)

  #2021-03-30 Create by Mars
*/
function GetMaterial(brandNo, materialCategory1No, materialCategory2No, materialCategory3No, materialType2, factoryNo) {
  var materialList = [];

  if (brandNo != "" && materialType2 != "") {
    var sql =
      " SELECT DISTINCT M.MaterialNo, M.MaterialName, C.MaterialCategory1No, C.MaterialCategory1Name, C.MaterialCategory2No, C.MaterialCategory2Name," +
      " C.MaterialCategory3No, C.MaterialCategory3Name, M.MaterialType1, M.MaterialType2, M.Spec" +
      " FROM MD_Material M (NOLOCK)" +
      " INNER JOIN MD_MaterialCost P (NOLOCK) ON P.MaterialNo = M.MaterialNo " +
      " INNER JOIN MD_MaterialCategory C (NOLOCK) ON C.MaterialCategory3No = M.MaterialCategory3No" +
      " WHERE P.BrandNo = ?";
    var args = [];
    args.push(brandNo);

    if (materialType2 == "A") {
      sql += " AND (M.MaterialType2 = 'N' OR M.MaterialNo IN ('100001', '100002'))";
    }
    else {
      sql += " AND M.MaterialType2 = ?";
      args.push(materialType2);
    }

    //商品大中小類
    if (materialCategory1No != "") {
      sql += " AND C.MaterialCategory1No = ?";
      args.push(materialCategory1No);
    }
    if (materialCategory2No != "") {
      sql += " AND C.MaterialCategory2No = ?";
      args.push(materialCategory2No);
    }
    if (materialCategory3No != "") {
      sql += " AND C.MaterialCategory3No = ?";
      args.push(materialCategory3No);
    }
    if (factoryNo != "") {
      sql += " AND EXISTS(SELECT 1 FROM MD_MaterialFactory MF (NOLOCK) WHERE MF.MaterialNo = M.MaterialNo AND MF.FactoryNo = ?)";
      args.push(factoryNo);

      //排除不可訂貨
      sql += " AND NOT EXISTS(SELECT 1 FROM SPO_DefaultMaterial DM2 (NOLOCK) WHERE DM2.DefaultType = '9' AND DM2.BrandNo = P.BrandNo AND DM2.FactoryNo = ? AND DM2.MaterialNo = M.MaterialNo AND GETDATE() >= DM2.StartDate)";
      args.push(factoryNo);
    }

    sql +=
      " GROUP BY M.MaterialNo, M.MaterialName, C.MaterialCategory1No, C.MaterialCategory1Name, C.MaterialCategory2No, C.MaterialCategory2Name," +
      " C.MaterialCategory3No, C.MaterialCategory3Name, M.MaterialType1, M.MaterialType2, M.Spec" +
      " ORDER BY M.MaterialNo";

    var dtMaterial = GetDataWithArgs(sql, args);
    if (dtMaterial != null) {
      for (var i = 0; i < dtMaterial.size(); i++) {
        var dr = dtMaterial.get(i);

        var material = {};
        material.MaterialNo = dr.get("MaterialNo");
        material.MaterialName = dr.get("MaterialName");
        material.MaterialCategory1No = dr.get("MaterialCategory1No");
        material.MaterialCategory1Name = dr.get("MaterialCategory1Name");
        material.MaterialCategory2No = dr.get("MaterialCategory2No");
        material.MaterialCategory2Name = dr.get("MaterialCategory2Name");
        material.MaterialCategory3No = dr.get("MaterialCategory3No");
        material.MaterialCategory3Name = dr.get("MaterialCategory3Name");
        material.MaterialType1 = dr.get("MaterialType1");
        material.MaterialType2 = dr.get("MaterialType2");
        material.Spec = dr.get("Spec");

        materialList.push(material);
      }
    }
  }

  return materialList;
}

/*
  [取得商品出貨單位]
  brandNo:		品牌編號
  materialNo:		商品編號
  materialType2:	商品分類2(N: 一般；E: 預估；D: 需求物)

  #2021-04-13 Create by Mars
*/
function GetMaterialUnit(brandNo, materialNo, materialType2, factoryNo) {
  if (materialType2 == null) {
    materialType2 = "";
  }
  if (factoryNo == null) {
    factoryNo = "";
  }
  return GetMaterialProcedure(brandNo, "", materialNo, materialType2, "", false, "", factoryNo);
}

/*
  [取得商品單價]
  brandNo:	品牌編號
  materialNo:	商品編號
  unit:		出貨單位

  #2021-04-13 Create by Mars
*/
function GetMaterialCost(brandNo, materialNo, unit, factoryNo) {
  var materialCost = null;

  var materialCostList = GetMaterialProcedure(brandNo, "", materialNo, "", unit, false, "", factoryNo);
  if (materialCostList.length > 0) {
    materialCost = materialCostList[0];
  }

  return materialCost;
}

/*
  [取得門市預設訂貨商品]
  retailNo:	門市編號

  #2021-04-13 Create by Mars
*/
function GetDefaultMaterial(brandNo, retailNo, factoryNo) {
  return GetMaterialProcedure(brandNo, retailNo, "", "N", "", false, "3", factoryNo);
}

/*
  [取得門市必填訂貨商品]
  brandNo:	品牌編號

  #2021-04-13 Create by Mars
*/
function GetRequiredMaterial(brandNo, factoryNo) {
  return GetMaterialProcedure(brandNo, "", "", "N", "", false, "2", factoryNo);
}

/*
  [取得門市新進商品]
  brandNo:	品牌編號

  #2021-04-16 Create by Mars
*/
function GetNewMaterial(brandNo, factoryNo) {
  return GetMaterialProcedure(brandNo, "", "", "N", "", true, "", factoryNo);
}

/*
  [取得門市不可訂貨商品]
  brandNo:	品牌編號

  #2021-10-08 Create by Mars
*/
function GetOffShelfMaterial(brandNo, factoryNo) {
  return GetDefaultMaterialProcedure2(brandNo, factoryNo, "", "9", "", "A");
}

/*
  [取得商品程式(非Publish)]
  brandNo:		品牌編號
  retailNo:		門市編號
  materialNo:		商品編號
  materialType2:	商品分類2(N: 一般；E: 預估；D: 需求物;A: 追加)
  unit:			出貨單位
  newFlag:		新品Flag
  defaultType:	預設類型

  #2021-04-13 Create by Mars
  #2022-05-30 Create by 孟憲 (修改當日追加限定食材及3樣包材)
  #2022-08-03 Create by 孟憲 (修改新開幕門市可當日追加全部品項)
*/
function GetMaterialProcedure(brandNo, retailNo, materialNo, materialType2, unitNo, newFlag, defaultType, factoryNo) {
  var materialCostList = [];

  var sql =
    " SELECT M.MaterialNo, M.MaterialName, C.MaterialCategory1No, C.MaterialCategory1Name, C.MaterialCategory2No, C.MaterialCategory2Name, C.MaterialCategory3No," +
    " C.MaterialCategory3Name, M.MaterialType1, M.MaterialType2, M.Spec, P.UnitNo, P.UnitName, CONVERT(VARCHAR(10), P.AvailableDate, 111) AS AvailableDate, P.UnitCost" +
    " FROM MD_MaterialCost P (NOLOCK)" +
    " INNER JOIN MD_Material M (NOLOCK) ON M.MaterialNo = P.MaterialNo" +
    " INNER JOIN MD_MaterialCategory C (NOLOCK) ON C.MaterialCategory3No = M.MaterialCategory3No";
  var sql_Where =
    " WHERE 1 = 1";
  var args = [];

  //品牌編號
  if (brandNo != "") {
    sql_Where += " AND P.BrandNo = ?";
    args.push(brandNo);
  }

  //品號
  if (materialNo != "") {
    sql_Where += " AND P.MaterialNo = ?";
    args.push(materialNo);
  }

  //商品分類2
  if (materialType2 != "") {
    if (materialType2 == "A") {
      sql_Where += " AND ((M.MaterialType1 = 'I' AND M.MaterialType2 = 'N') OR (M.MaterialNo IN ('100001', '100002', '200003', '200034', '200035')))";
    }
    else if (materialType2 == "A2") {
      sql_Where += " AND (M.MaterialType2 = 'N' OR M.MaterialNo IN ('100001', '100002'))"
    }
    else if (materialType2 == "A3") {
      sql_Where += " AND (M.MaterialType2 IN ('N', 'E'))"
    }
    else {
      sql_Where += " AND M.MaterialType2 = ?";
      args.push(materialType2);
    }
  }

  //出貨單位
  if (unitNo != "") {
    sql_Where += " AND P.UnitNo = ?";
    args.push(unitNo);
  }

  //新品
  if (newFlag) {
    var newMaterialDay = GetVariableValue("NewMaterialDay");
    if (newMaterialDay == "") {
      newMaterialDay = "7";
    }
    sql_Where += " AND GETDATE() BETWEEN P.AvailableDate AND DATEADD(DD, " + newMaterialDay + " + 1, P.AvailableDate)";
  }

  //必填、預設
  if (defaultType != "") {
    sql += " INNER JOIN SPO_DefaultMaterial DM (NOLOCK) ON DM.BrandNo = P.BrandNo AND DM.MaterialNo = P.MaterialNo AND DM.UnitNo = P.UnitNo";
    sql_Where += " AND DM.DefaultType = ?";
    args.push(defaultType);

    if (retailNo != "") {
      sql_Where += " AND DM.RetailNo = ?";
      args.push(retailNo);
    }
  }

  //工廠
  if (factoryNo != "") {
    sql_Where += " AND EXISTS(SELECT 1 FROM MD_MaterialFactory MF (NOLOCK) WHERE MF.MaterialNo = M.MaterialNo AND MF.FactoryNo = ?)";
    args.push(factoryNo);

    //排除不可訂貨
    sql_Where += " AND NOT EXISTS(SELECT 1 FROM SPO_DefaultMaterial DM2 (NOLOCK) WHERE DM2.DefaultType = '9' AND DM2.BrandNo = P.BrandNo AND DM2.FactoryNo = ? AND DM2.MaterialNo = M.MaterialNo AND GETDATE() >= DM2.StartDate)";
    args.push(factoryNo);
  }

  //組合SQL
  if (defaultType != "") {
    sql += sql_Where + " ORDER BY DM.SortNo";
  }
  else {
    sql += sql_Where + " ORDER BY P.MaterialNo";
  }

  var dtMaterialCost = GetDataWithArgs(sql, args);
  if (dtMaterialCost != null) {
    for (var i = 0; i < dtMaterialCost.size(); i++) {
      var dr = dtMaterialCost.get(i);

      var materialCost = {};
      materialCost.MaterialNo = dr.get("MaterialNo");
      materialCost.MaterialName = dr.get("MaterialName");
      materialCost.MaterialCategory1No = dr.get("MaterialCategory1No");
      materialCost.MaterialCategory1Name = dr.get("MaterialCategory1Name");
      materialCost.MaterialCategory2No = dr.get("MaterialCategory2No");
      materialCost.MaterialCategory2Name = dr.get("MaterialCategory2Name");
      materialCost.MaterialCategory3No = dr.get("MaterialCategory3No");
      materialCost.MaterialCategory3Name = dr.get("MaterialCategory3Name");
      materialCost.MaterialType1 = dr.get("MaterialType1");
      materialCost.MaterialType2 = dr.get("MaterialType2");
      materialCost.Spec = dr.get("Spec");
      materialCost.UnitNo = dr.get("UnitNo");
      materialCost.UnitName = dr.get("UnitName");
      materialCost.AvailableDate = dr.get("AvailableDate");
      materialCost.UnitCost = parseFloat(dr.get("UnitCost"));

      materialCostList.push(materialCost);
    }
  }

  return materialCostList;
}

/*
  [取得商品程式(非Publish)]
  brandNo:		品牌編號
  retailNo:		門市編號
  materialNo:		商品編號
  materialType2:	商品分類2(N: 一般；E: 預估；D: 需求物;A: 追加)
  defaultType:	預設類型

  #2021-10-08 Create by Mars
*/
function GetDefaultMaterialProcedure2(brandNo, factoryNo, retailNo, defaultType, materialNo, materialType2) {
  var materialList = [];

  var sql =
    " SELECT CONVERT(VARCHAR(10), DM.StartDate, 111) AS StartDate, DM.MaterialNo, M.MaterialName, DM.Remark" +
    " FROM MD_MaterialCost P (NOLOCK)" +
    " INNER JOIN MD_Material M (NOLOCK) ON M.MaterialNo = P.MaterialNo" +
    " INNER JOIN MD_MaterialCategory C (NOLOCK) ON C.MaterialCategory3No = M.MaterialCategory3No" +
    " INNER JOIN SPO_DefaultMaterial DM (NOLOCK) ON DM.BrandNo = P.BrandNo AND DM.MaterialNo = P.MaterialNo";
  var sql_Where =
    " WHERE 1 = 1";
  var args = [];

  //品牌編號
  if (brandNo != "") {
    sql_Where += " AND P.BrandNo = ?";
    args.push(brandNo);
  }

  //工廠
  if (factoryNo != "") {
    sql_Where += " AND DM.FactoryNo = ?";
    args.push(factoryNo);

    sql_Where += " AND EXISTS(SELECT 1 FROM MD_MaterialFactory MF (NOLOCK) WHERE MF.MaterialNo = M.MaterialNo AND MF.FactoryNo = ?)";
    args.push(factoryNo);
  }

  //門市
  if (retailNo != "") {
    sql_Where += " AND DM.RetailNo = ?";
    args.push(retailNo);
  }

  //類型
  if (defaultType != "") {
    sql_Where += " AND DM.DefaultType = ?";
    args.push(defaultType);
  }

  //品號
  if (materialNo != "") {
    sql_Where += " AND P.MaterialNo = ?";
    args.push(materialNo);
  }

  //商品分類2
  if (materialType2 != "") {
    if (materialType2 == "A") {
      sql_Where += " AND M.MaterialType2 IN ('N', 'E')";
    }
    else {
      sql_Where += " AND M.MaterialType2 = ?";
      args.push(materialType2);
    }
  }

  //組合SQL
  sql += sql_Where + " ORDER BY DM.SortNo";

  var dtMaterial = GetDataWithArgs(sql, args);
  if (dtMaterial != null) {
    for (var i = 0; i < dtMaterial.size(); i++) {
      var dr = dtMaterial.get(i);

      var material = {};
      material.StartDate = dr.get("StartDate");
      material.MaterialNo = dr.get("MaterialNo");
      material.MaterialName = dr.get("MaterialName");
      material.Remark = dr.get("Remark");

      materialList.push(material);
    }
  }

  return materialList;
}

/*
  [更新門市預設訂貨商品]
  brandNo:		品牌編號
  retailNo:		門市編號
  materialList:	商品([商品編號, 出貨單位])
  creator:		創建人員

  #2021-04-13 Create by Mars
*/
function UpdateDefaultMaterial(brandNo, retailNo, materialList, creator) {
  return UpdateDefaultMaterialProcedure(brandNo, "", "3", retailNo, materialList, creator);
}

/*
  [更新門市必填訂貨商品]
  brandNo:		品牌編號
  materialList:	商品([商品編號, 出貨單位])
  creator:		創建人員

  #2021-04-13 Create by Mars
*/
function UpdateRequiredMaterial(brandNo, materialList, creator) {
  return UpdateDefaultMaterialProcedure(brandNo, "", "2", "", materialList, creator);
}

/*
  [更新門市必填訂貨商品]
  brandNo:		品牌編號
  materialList:	商品([起始日期, 商品編號])
  creator:		創建人員

  #2021-10-08 Create by Mars
*/
function UpdateOffShelfMaterial(brandNo, factoryNo, materialList, creator) {
  return UpdateDefaultMaterialProcedure(brandNo, factoryNo, "9", "", materialList, creator);
}

/*
  [更新門市預設(必填)訂貨商品程式(非Publish)]
  brandNo:		品牌編號
  defaultType:	預設類型(2: 必填; 3: 預設)
  retailNo:		門市編號
  materialList:	商品([商品編號, 出貨單位])
  creator:		創建人員

  #2021-04-13 Create by Mars
*/
function UpdateDefaultMaterialProcedure(brandNo, factoryNo, defaultType, retailNo, materialList, creator) {
  var result = false;

  if (brandNo != "" && defaultType != "" && creator != "") {
    var context = GetContext();
    try {
      //DB連線
      var conn = context.createSessionConnection("DB_Application");

      //刪除
      var sql =
        " DELETE SPO_DefaultMaterial" +
        " WHERE BrandNo = '" + brandNo + "'" +
        " AND DefaultType = '" + defaultType + "'";

      //工廠
      if (factoryNo != "") {
        sql += " AND FactoryNo = '" + factoryNo + "'";
      }

      //門市編號
      if (retailNo != "") {
        sql += " AND RetailNo = '" + retailNo + "'";
      }

      //SQL刪除指令結尾
      sql += ";";

      //新增
      for (var i = 0; i < materialList.length; i++) {
        var material = materialList[i];
        var materialNo = "";
        var startDate = "";
        var unitNo = "";
        var unitName = "";
        var sortNo = "";
        var remark = "";
        if (material != null && material.MaterialNo != null) {
          materialNo = material.MaterialNo;
          if (material.StartDate != null) {
            startDate = material.StartDate;
          }
          if (material.UnitNo != null) {
            unitNo = material.UnitNo;
          }
          if (material.UnitName != null) {
            unitName = material.UnitName;
          }
          if (material.SortNo != null) {
            sortNo = material.SortNo;
          }
          if (material.Remark != null) {
            remark = material.Remark;
          }
          sql +=
            " INSERT INTO SPO_DefaultMaterial (BrandNo, DefaultType, StartDate, FactoryNo, RetailNo, MaterialNo, UnitNo, UnitName, SortNo, Creator, Remark)" +
            " VALUES ('" + brandNo + "', '" + defaultType + "', '" + startDate + "', '" + factoryNo + "', '" + retailNo + "', '" + materialNo + "', '" + unitNo + "', '" + unitName + "', '" + sortNo + "', '" + creator + "', '" + remark + "');";
        }
      }

      //更新資料表
      if (conn.updateValue(sql)) {
        conn.commit();
        result = true;
      }
    }
    catch (ex) {
      conn.rollback();
      context.addExeLog("資料庫更新失敗:" + ex.message);
      context.addExeLog("Sql=" + sql);
    }
    finally {
      if (conn != null) {
        conn.close();
      }
    }
  }

  return result;
}

/*
  [更新門市作業截止時間]
  brandNo:		品牌編號
  retailList:		商品([門市, 作業, 截止時, 截止分])
  creator:		創建人員

  #2022-02-23 Create by Serena
*/
function UpdateDeadlineRetailList(brandNo, retailList, creator) {
  var result = false;

  if (brandNo != "" && creator != "") {
    var context = GetContext();
    try {
      //DB連線
      var conn = context.createSessionConnection("DB_Application");

      //刪除
      var sql =
        " DELETE SPO_RetailDeadline" +
        " WHERE BrandNo = '" + brandNo + "'" + ";";

      //新增
      for (var i = 0; i < retailList.length; i++) {
        var retail = retailList[i];
        var retailNo = "";
        var retailName = "";
        var deliveryTime = "";
        var taskType = "";
        var taskTypeName = "";
        var endTimeHour = "";
        var endTimeMinute = "";
        if (retail != null && retail.RetailNo != null) {
          retailNo = retail.RetailNo;
          if (retail.RetailName != null) {
            retailName = retail.RetailName;
          }
          if (retail.DeliveryTime != null) {
            deliveryTime = retail.DeliveryTime;
          }
          if (retail.TaskType != null) {
            taskType = retail.TaskType;
          }
          if (retail.TaskTypeName != null) {
            taskTypeName = retail.TaskTypeName;
          }
          if (retail.EndTimeHour != null) {
            endTimeHour = retail.EndTimeHour;
          }
          if (retail.EndTimeMinute != null) {
            endTimeMinute = retail.EndTimeMinute;
          }
          sql +=
            " INSERT INTO SPO_RetailDeadline (BrandNo, RetailNo, RetailName, DeliveryTime, TaskType, TaskTypeName, EndTimeHour, EndTimeMinute, Creator)" +
            " VALUES ('" + brandNo + "', '" + retailNo + "', '" + retailName + "', '" + deliveryTime + "', '" + taskType + "', '" + taskTypeName + "', '" + endTimeHour + "', '" + endTimeMinute + "', '" + creator + "');";
        }
      }

      //更新資料表
      if (conn.updateValue(sql)) {
        conn.commit();
        result = true;
      }
    }
    catch (ex) {
      conn.rollback();
      context.addExeLog("資料庫更新失敗:" + ex.message);
      context.addExeLog("Sql=" + sql);
    }
    finally {
      if (conn != null) {
        conn.close();
      }
    }
  }

  return result;
}

/*
  [取得作業截止時間]
  brandNo:		品牌代號
  retailNo:		門市代號 
  taskType:		作業(SBPO: 門市補貨作業;SCPO: 門市當日追加)
  #2022-03-14 Create by Serena
*/
function GetDeadLineData(brandNo, retailNo, taskType) {
  var deadlineData = [];
  var endTime = "";

  var sql =
    " SELECT RetailNo, RetailName, DeliveryTime, TaskTypeName, EndTimeHour, EndTimeMinute" +
    " FROM SPO_RetailDeadline(NOLOCK)" +
    " WHERE BrandNo = ?";
  var args = [];
  args.push(brandNo);

  if (retailNo != "") {
    sql += " AND RetailNo = ?";
    args.push(retailNo);
  }
  if (taskType != "") {
    sql += " AND TaskType = ?";
    args.push(taskType);
  }
  sql += " ORDER BY DeliveryTime, RetailNo ";

  var dtGetDealline = GetDataWithArgs(sql, args);
  if (dtGetDealline != null) {
    for (var i = 0; i < dtGetDealline.size(); i++) {
      var dr = dtGetDealline.get(i);

      var retailDeadlineList = {};
      retailDeadlineList.RetailNo = dr.get("RetailNo");
      retailDeadlineList.RetailName = dr.get("RetailName");
      retailDeadlineList.DeliveryTime = dr.get("DeliveryTime");
      retailDeadlineList.TaskTypeName = dr.get("TaskTypeName");
      retailDeadlineList.EndTimeHour = dr.get("EndTimeHour");
      retailDeadlineList.EndTimeMinute = dr.get("EndTimeMinute");

      deadlineData.push(retailDeadlineList);
    }
  }
  else {
    deadlineData = null;
  }
  return deadlineData;
}

/*
  [取得退貨原因]

  #2021-04-13 Create by Mars
*/
function GetRejectReason() {
  var rejectReasonList = [];

  var sql =
    " SELECT R.RejectReasonNo, R.RejectReason, R.ReturnFlag" +
    " FROM MD_RejectReason R (NOLOCK)" +
    " ORDER BY R.RejectReasonNo";

  var dtRejectReason = GetData(sql);
  if (dtRejectReason != null) {
    for (var i = 0; i < dtRejectReason.size(); i++) {
      var dr = dtRejectReason.get(i);

      var rejectReason = {};
      rejectReason.RejectReasonNo = dr.get("RejectReasonNo");
      rejectReason.RejectReason = dr.get("RejectReason");
      rejectReason.ReturnFlag = dr.get("ReturnFlag");

      rejectReasonList.push(rejectReason);
    }
  }

  return rejectReasonList;
}

/*
  [取得排程主檔(by 排程類型)]
  jobType:	排程類型

  #2021-04-13 Create by Mars
*/
function GetJobDetailByJobType(jobType) {
  return GetJobDetailProcedure(jobType, "");
}

/*
  [取得排程主檔(by 排程代碼)]
  jobCode:	排程代碼

  #2021-04-13 Create by Mars
*/
function GetJobDetailByJobCode(jobCode) {
  var jobDetail = null;

  var jobDetailList = GetJobDetailProcedure("", jobCode);
  if (jobDetailList.length > 0) {
    jobDetail = jobDetailList[0];
  }

  return jobDetail;
}

/*
  [取得排程主檔程式(非Publish)]
  jobType:	排程類型
  jobCode:	排程代碼

  #2021-04-13 Create by Mars
*/
function GetJobDetailProcedure(jobType, jobCode) {
  var jobDetailList = [];

  var sql =
    " SELECT J.Id, J.JobType, J.JobName, J.Parm1, J.Parm2, J.Parm3, J.Parm4, J.Parm5" +
    " FROM MD_JobDetail J (NOLOCK)";
  var sql_Where =
    " WHERE UsableFlag = 1";
  var args = [];

  //排程類型
  if (jobType != "") {
    sql_Where += " AND J.JobType = ?";
    args.push(jobType);
  }

  //排程類型
  if (jobCode != "") {
    sql_Where += " AND J.JobCode = ?";
    args.push(jobCode);
  }

  //組合SQL
  sql += sql_Where;

  var dtJobDetail = GetDataWithArgs(sql, args);
  if (dtJobDetail != null) {
    for (var i = 0; i < dtJobDetail.size(); i++) {
      var dr = dtJobDetail.get(i);

      var jobDetail = {};
      jobDetail.Id = dr.get("Id");
      jobDetail.JobType = dr.get("JobType");
      jobDetail.JobCode = dr.get("JobCode");
      jobDetail.JobName = dr.get("JobName");
      jobDetail.Parm1 = dr.get("Parm1");
      jobDetail.Parm2 = dr.get("Parm2");
      jobDetail.Parm3 = dr.get("Parm3");
      jobDetail.Parm4 = dr.get("Parm4");
      jobDetail.Parm5 = dr.get("Parm5");

      jobDetailList.push(jobDetail);
    }
  }

  return jobDetailList;
}

/*
  [儲存排程Log]

  jobId:		排程主檔Id
  result:		執行結果
  remark:		備註
  creator:	創建人員

  #2021-04-14 Create by Mars
*/
function SaveJobOperationLog(jobId, result, remark, creator) {
  return SaveJobOperationLogAndDetail_SAP(jobId, result, remark, null, null, creator);
}

/*
  [儲存排程Log(含明細)]

  jobId:		排程主檔Id
  result:		執行結果
  remark:		備註
  detailList:	Log明細([明細1-20])
  creator:	創建人員

  #2021-04-14 Create by Mars
*/
function SaveJobOperationLogAndDetail(jobId, result, remark, detailList, creator) {
  return SaveJobOperationLogAndDetail_SAP(jobId, result, remark, null, detailList, creator);
}

/*
  [儲存SAP排程Log]

  jobId:			排程主檔Id
  result:			執行結果
  remark:			備註
  rfcReturnList:	RFC回傳物件
  creator:		創建人員

  #2021-04-14 Create by Mars
*/
function SaveJobOperationLog_SAP(jobId, result, remark, rfcReturnList, creator) {
  return SaveJobOperationLogAndDetail_SAP(jobId, result, remark, rfcReturnList, null, creator);
}

/*
  [儲存SAP排程Log(含明細)]

  jobId:			排程主檔Id
  result:			執行結果
  remark:			備註
  rfcReturnList:	RFC回傳物件
  detailList:		Log明細([明細1-20])
  creator:		創建人員

  #2021-04-14 Create by Mars
*/
function SaveJobOperationLogAndDetail_SAP(jobId, result, remark, rfcReturnList, detailList, creator) {
  var result1 = false;

  if (jobId != "") {
    var context = GetContext();
    try {
      //DB連線
      var conn = context.createSessionConnection("DB_Application");

      if (rfcReturn == null) {
        rfcReturn = GetInitRFCReturn();
      }

      var id = GetDBNewId();
      remark = remark.replace(/'/g, "");
      var sql =
        " INSERT INTO LG_JobOperation (Id, JobId, Result, Remark, Creator)" +
        " VALUES ('" + id + "', '" + jobId + "', '" + result + "', '" + remark + "', '" + creator + "');";

      //SAP
      if (rfcReturnList != null) {
        for (var i = 0; i < rfcReturnList.length; i++) {
          var rfcReturn = rfcReturnList[i];
          if (rfcReturn != null) {
            var sapType = "";
            var sapNumber = "";
            var sapMessage = "";
            var sapLogOn = "";

            if (rfcReturn.Type != null) {
              sapType = rfcReturn.Type;
            }
            if (rfcReturn.Number != null) {
              sapNumber = rfcReturn.Number;
            }
            if (rfcReturn.Message != null) {
              sapMessage = rfcReturn.Message;
            }
            if (rfcReturn.LogNo != null) {
              sapLogOn = rfcReturn.LogNo;
            }

            sql +=
              " INSERT INTO LG_JobOperationSAPLog (JobOperationId, SAPType, SAPNumber, SAPMessage, SAPLogNo)" +
              " VALUES ('" + id + "', '" + sapType + "', '" + sapNumber + "', '" + sapMessage + "', '" + sapLogOn + "');";
          }
        }
      }

      //明細
      if (detailList != null) {
        for (var i = 0; i < detailList.length; i++) {
          var detail = detailList[i];
          if (detail != null) {
            var detail1 = "";
            var detail2 = "";
            var detail3 = "";
            var detail4 = "";
            var detail5 = "";
            var detail6 = "";
            var detail7 = "";
            var detail8 = "";
            var detail9 = "";
            var detail10 = "";
            var detail11 = "";
            var detail12 = "";
            var detail13 = "";
            var detail14 = "";
            var detail15 = "";
            var detail16 = "";
            var detail17 = "";
            var detail18 = "";
            var detail19 = "";
            var detail20 = "";

            if (detail.Detail1 != null) {
              detail1 = detail.Detail1;
            }
            if (detail.Detail2 != null) {
              detail2 = detail.Detail2;
            }
            if (detail.Detail3 != null) {
              detail3 = detail.Detail3;
            }
            if (detail.Detail4 != null) {
              detail4 = detail.Detail4;
            }
            if (detail.Detail5 != null) {
              detail5 = detail.Detail5;
            }
            if (detail.Detail6 != null) {
              detail6 = detail.Detail6;
            }
            if (detail.Detail7 != null) {
              detail7 = detail.Detail7;
            }
            if (detail.Detail8 != null) {
              detail8 = detail.Detail8;
            }
            if (detail.Detail9 != null) {
              detail9 = detail.Detail9;
            }
            if (detail.Detail10 != null) {
              detail10 = detail.Detail10;
            }
            if (detail.Detail11 != null) {
              detail11 = detail.Detail11;
            }
            if (detail.Detail12 != null) {
              detail12 = detail.Detail12;
            }
            if (detail.Detail13 != null) {
              detail13 = detail.Detail13;
            }
            if (detail.Detail14 != null) {
              detail14 = detail.Detail14;
            }
            if (detail.Detail15 != null) {
              detail15 = detail.Detail15;
            }
            if (detail.Detail16 != null) {
              detail16 = detail.Detail16;
            }
            if (detail.Detail17 != null) {
              detail17 = detail.Detail17;
            }
            if (detail.Detail18 != null) {
              detail18 = detail.Detail18;
            }
            if (detail.Detail19 != null) {
              detail19 = detail.Detail19;
            }
            if (detail.Detail20 != null) {
              detail20 = detail.Detail20;
            }

            sql +=
              " INSERT INTO LG_JobOperationDetail (JobOperationId, Detail1, Detail2, Detail3, Detail4, Detail5," +
              " Detail6, Detail7, Detail8, Detail9, Detail10," +
              " Detail11, Detail12, Detail13, Detail14, Detail15," +
              " Detail16, Detail17, Detail18, Detail19, Detail20)" +
              " VALUES ('" + id + "', '" + detail1 + "', '" + detail2 + "', '" + detail3 + "', '" + detail4 + "', '" + detail5 + "'," +
              " '" + detail6 + "', '" + detail7 + "', '" + detail8 + "', '" + detail9 + "', '" + detail10 + "'," +
              " '" + detail11 + "', '" + detail12 + "', '" + detail13 + "', '" + detail14 + "', '" + detail15 + "'," +
              " '" + detail16 + "', '" + detail17 + "', '" + detail18 + "', '" + detail19 + "', '" + detail20 + "');";
          }
        }
      }

      //更新資料表
      if (conn.updateValue(sql)) {
        conn.commit();
        result1 = true;
      }
    }
    catch (ex) {
      conn.rollback();
      context.addExeLog("資料庫更新失敗:" + ex.message);
      context.addExeLog("Sql=" + sql);
    }
    finally {
      if (conn != null) {
        conn.close();
      }
    }
  }

  return result1;
}

/*
  [取得所有單位]

  #2023-01-06 Create by Mars
*/
function GetUnit() {
  return GetUnitProcedure("", null);
}

/*
  [取得單位(by 單位編號)]
  unitNo:	單位編號

  #2023-01-06 Create by Mars
*/
function GetUnitByUnitNo(unitNo) {
  var unit = null;

  if (unitNo != "") {
    var unitList = GetUnitProcedure(unitNo, null);
    if (unitList.length > 0) {
      unit = unitList[0];
    }
  }

  return unit;
}

/*
  [取得單位(by 商業計量單位旗標)]
  buFlag:	商業計量單位旗標

  #2023-01-06 Create by Mars
*/
function GetUnitByBUFlag(buFlag) {
  return GetUnitProcedure("", buFlag);
}

/*
  [取得單位程式(非Publish)]
  unitNo:	單位編號
  buFlag:	商業計量單位旗標

  #2023-01-06 Create by Mars
*/
function GetUnitProcedure(unitNo, buFlag) {
  var unitList = [];

  var sql =
    " SELECT UnitNo, CASE BUFlag WHEN 'X' THEN 1 ELSE 0 END AS BUFlag, UnitName_3, UnitName_L" +
    " FROM MD_S_Unit (NOLOCK)" +
    " WHERE 1 = 1";
  var args = [];

  if (unitNo != "") {
    sql += " AND UnitNo = ?";
    args.push(unitNo);
  }
  if (buFlag != null) {
    if (buFlag) {
      sql += " AND BUFlag = 'X'";
    }
    else {
      sql += " AND BUFlag = ''";
    }
  }

  sql += " ORDER BY UnitNo";

  var dtUnit = GetDataWithArgs(sql, args);
  if (dtUnit != null) {
    for (var i = 0; i < dtUnit.size(); i++) {
      var dr = dtUnit.get(i);

      var unit = {};
      unit.UnitNo = dr.get("UnitNo");
      unit.BUFlag = dr.get("BUFlag");
      unit.UnitName_3 = dr.get("UnitName_3");
      unit.UnitName_L = dr.get("UnitName_L");

      unitList.push(unit);
    }
  }

  return unitList;
}

/*
  [取得所有銷售組織]

  #2023-01-06 Create by Mars
*/
function GetSalesOrg() {
  return GetSalesOrgProcedure("", "");
}

/*
  [取得銷售組織(by 銷售組織編號)]
  salesOrgNo:	銷售組織編號

  #2023-01-06 Create by Mars
*/
function GetSalesOrgBySalesOrgNo(salesOrgNo) {
  var salesOrg = null;

  if (salesOrgNo != "") {
    var salesOrgList = GetSalesOrgProcedure("", salesOrgNo);
    if (salesOrgList.length > 0) {
      salesOrg = salesOrgList[0];
    }
  }

  return salesOrg;
}

/*
  [取得銷售組織(by 公司編號)]
  companyNo:	公司編號

  #2023-01-06 Create by Mars
*/
function GetSalesOrgByCompanyNo(companyNo) {
  var salesOrgList = [];

  if (companyNo != "") {
    salesOrgList = GetSalesOrgProcedure(companyNo, "");
  }

  return salesOrgList;
}

/*
  [取得銷售組織程式(非Publish)]
  companyNo:	公司編號
  salesOrgNo:	銷售組織編號

  #2023-01-06 Create by Mars
*/
function GetSalesOrgProcedure(companyNo, salesOrgNo) {
  var salesOrgList = [];

  var sql =
    " SELECT CompanyNo, SalesOrgNo, SalesOrgName, CurrencyNo" +
    " FROM MD_S_SalesOrg (NOLOCK)" +
    " WHERE 1 = 1";
  var args = [];

  if (companyNo != "") {
    sql += " AND CompanyNo = ?";
    args.push(companyNo);
  }
  if (salesOrgNo != "") {
    sql += " AND SalesOrgNo = ?";
    args.push(salesOrgNo);
  }

  sql += " ORDER BY CompanyNo, SalesOrgNo";

  var dtSalesOrg = GetDataWithArgs(sql, args);
  if (dtSalesOrg != null) {
    for (var i = 0; i < dtSalesOrg.size(); i++) {
      var dr = dtSalesOrg.get(i);

      var salesOrg = {};
      salesOrg.CompanyNo = dr.get("CompanyNo");
      salesOrg.SalesOrgNo = dr.get("SalesOrgNo");
      salesOrg.SalesOrgName = dr.get("SalesOrgName");
      salesOrg.CurrencyNo = dr.get("CurrencyNo");

      salesOrgList.push(salesOrg);
    }
  }

  return salesOrgList;
}

/*
  [取得所有公司]

  #2023-01-06 Create by Mars
*/
function GetCompany() {
  return GetCompanyProcedure("");
}

/*
  [取得公司(by 公司編號)]
  companyNo:	公司編號

  #2023-01-06 Create by Mars
*/
function GetCompanyByCompanyNo(companyNo) {
  var company = null;

  if (companyNo != "") {
    var companyList = GetCompanyProcedure(companyNo);
    if (companyList.length > 0) {
      company = companyList[0];
    }
  }

  return company;
}

/*
  [取得公司程式(非Publish)]
  companyNo:	公司編號

  #2023-01-06 Create by Mars
*/
function GetCompanyProcedure(companyNo) {
  var companyList = [];

  var sql =
    " SELECT CompanyNo, CompanyName, CountryNo" +
    " FROM MD_S_Company (NOLOCK)" +
    " WHERE 1 = 1";
  var args = [];

  if (companyNo != "") {
    sql += " AND CompanyNo = ?";
    args.push(companyNo);
  }

  sql += " ORDER BY CompanyNo";

  var dtCompany = GetDataWithArgs(sql, args);
  if (dtCompany != null) {
    for (var i = 0; i < dtCompany.size(); i++) {
      var dr = dtCompany.get(i);

      var company = {};
      company.CompanyNo = dr.get("CompanyNo");
      company.CompanyName = dr.get("CompanyName");
      company.CountryNo = dr.get("CountryNo");

      companyList.push(company);
    }
  }

  return companyList;
}

/*
  [取得所有幣別]

  #2023-01-06 Create by Mars
*/
function GetCurrency() {
  return GetCurrencyProcedure("");
}

/*
  [取得幣別(by 幣別編號)]
  currencyNo:	幣別編號

  #2023-01-06 Create by Mars
*/
function GetCurrencyByCurrencyNo(currencyNo) {
  var currency = null;

  if (currencyNo != "") {
    var currencyList = GetCurrencyProcedure(currencyNo);
    if (currencyList.length > 0) {
      currency = currencyList[0];
    }
  }

  return currency;
}

/*
  [取得幣別程式(非Publish)]
  currencyNo:	幣別編號

  #2023-01-06 Create by Mars
*/
function GetCurrencyProcedure(currencyNo) {
  var currencyList = [];

  var sql =
    " SELECT CurrencyNo, CurrencyName_L, CurrencyName_S" +
    " FROM MD_S_Currency (NOLOCK)" +
    " WHERE 1 = 1";
  var args = [];

  if (currencyNo != "") {
    sql += " AND CurrencyNo = ?";
    args.push(currencyNo);
  }

  sql += " ORDER BY CurrencyNo";

  var dtCurrency = GetDataWithArgs(sql, args);
  if (dtCurrency != null) {
    for (var i = 0; i < dtCurrency.size(); i++) {
      var dr = dtCurrency.get(i);

      var currency = {};
      currency.CurrencyNo = dr.get("CurrencyNo");
      currency.CurrencyName_L = dr.get("CurrencyName_L");
      currency.CurrencyName_S = dr.get("CurrencyName_S");

      currencyList.push(currency);
    }
  }

  return currencyList;
}

/*
  [取得所有國家]

  #2023-01-06 Create by Mars
*/
function GetCountry() {
  return GetCountryProcedure("");
}

/*
  [取得國家(by 國家編號)]
  countryNo:	國家編號

  #2023-01-06 Create by Mars
*/
function GetCountryByCountryNo(countryNo) {
  var country = null;

  if (countryNo != "") {
    var countryList = GetCountryProcedure(countryNo);
    if (countryList.length > 0) {
      country = countryList[0];
    }
  }

  return country;
}

/*
  [取得國家程式(非Publish)]
  countryNo:	國家編號

  #2023-01-06 Create by Mars
*/
function GetCountryProcedure(countryNo) {
  var countryList = [];

  var sql =
    " SELECT CountryNo, CountryName, CurrencyNo" +
    " FROM MD_S_Country (NOLOCK)" +
    " WHERE 1 = 1";
  var args = [];

  if (countryNo != "") {
    sql += " AND CountryNo = ?";
    args.push(countryNo);
  }

  sql += " ORDER BY CountryNo";

  var dtCountry = GetDataWithArgs(sql, args);
  if (dtCountry != null) {
    for (var i = 0; i < dtCountry.size(); i++) {
      var dr = dtCountry.get(i);

      var country = {};
      country.CountryNo = dr.get("CountryNo");
      country.CountryName = dr.get("CountryName");
      country.CurrencyNo = dr.get("CurrencyNo");

      countryList.push(country);
    }
  }

  return countryList;
}

/*
  [取得所有配銷通路]

  #2023-01-06 Create by Mars
*/
function GetChannel() {
  return GetChannelProcedure("");
}

/*
  [取得配銷通路(by 配銷通路編號)]
  channelNo:	配銷通路編號

  #2023-01-06 Create by Mars
*/
function GetChannelByChannelNo(channelNo) {
  var channel = null;

  if (channelNo != "") {
    var channelList = GetChannelProcedure(channelNo);
    if (channelList.length > 0) {
      channel = channelList[0];
    }
  }

  return channel;
}

/*
  [取得配銷通路程式(非Publish)]
  channelNo:	配銷通路編號

  #2023-01-06 Create by Mars
*/
function GetChannelProcedure(channelNo) {
  var channelList = [];

  var sql =
    " SELECT ChannelNo, ChannelName" +
    " FROM MD_S_Channel (NOLOCK)" +
    " WHERE 1 = 1";
  var args = [];

  if (channelNo != "") {
    sql += " AND ChannelNo = ?";
    args.push(channelNo);
  }

  sql += " ORDER BY ChannelNo";

  var dtChannel = GetDataWithArgs(sql, args);
  if (dtChannel != null) {
    for (var i = 0; i < dtChannel.size(); i++) {
      var dr = dtChannel.get(i);

      var channel = {};
      channel.ChannelNo = dr.get("ChannelNo");
      channel.ChannelName = dr.get("ChannelName");

      channelList.push(channel);
    }
  }

  return channelList;
}

/*
  [取得所有條件類型]

  #2023-01-06 Create by Mars
*/
function GetConditionType() {
  return GetConditionTypeProcedure("", "", null, null, "");
}

/*
  [取得條件類型(by 條件用途、應用程式、存取順序、是否回扣)]
  purposeCode:		條件用途
  appCode:			應用程式
  accessCodeFlag:		存取順序是否有資料
  negativeNoFlag:		回扣是否有資料

  #2023-01-06 Create by Mars
*/
function GetConditionTypeByAccessCode(purposeCode, appCode, accessCodeFlag, negativeNoFlag) {
  return GetConditionTypeProcedure(purposeCode, appCode, accessCodeFlag, negativeNoFlag, "");
}

/*
  [取得條件類型(by 條件用途、應用程式、存取順序、是否回扣、條件類型編號)]
  purposeCode:		條件用途
  appCode:			應用程式
  accessCodeFlag:		存取順序是否有資料
  negativeNoFlag:		回扣是否有資料
  conditionTypeNo:	條件類型編號

  #2023-01-06 Create by Mars
*/
function GetConditionTypeByConditionTypeNo(purposeCode, appCode, accessCodeFlag, negativeNoFlag, conditionTypeNo) {
  var conditionType = null;

  if (purposeCode != "" && appCode != "" && conditionTypeNo != "") {
    var conditionTypeList = GetConditionTypeProcedure(purposeCode, appCode, accessCodeFlag, negativeNoFlag, conditionTypeNo);
    if (conditionTypeList.length > 0) {
      conditionType = conditionTypeList[0];
    }
  }

  return conditionType;
}

/*
  [取得條件類型程式(非Publish)]
  purposeCode:		條件用途
  appCode:			應用程式
  accessCodeFlag:		存取順序是否有資料
  negativeNoFlag:		回扣是否有資料
  conditionTypeNo:	條件類型編號

  #2023-01-06 Create by Mars
*/
function GetConditionTypeProcedure(purposeCode, appCode, accessCodeFlag, negativeNoFlag, conditionTypeNo) {
  var conditionTypeList = [];

  var sql =
    " SELECT PurposeCode, AppCode, AccessCode, NegativeNo, ConditionTypeNo, ConditionTypeName" +
    " FROM MD_S_ConditionType (NOLOCK)" +
    " WHERE 1 = 1";
  var args = [];

  if (purposeCode != "") {
    sql += " AND PurposeCode = ?";
    args.push(purposeCode);
  }
  if (appCode != "") {
    sql += " AND AppCode = ?";
    args.push(appCode);
  }
  if (accessCodeFlag != null) {
    if (accessCodeFlag) {
      sql += " AND ISNULL(AccessCode, '') <> ''";
    }
    else {
      sql += " AND ISNULL(AccessCode, '') = ''";
    }
  }
  if (negativeNoFlag != null) {
    if (negativeNoFlag) {
      sql += " AND ISNULL(NegativeNo, '') <> ''";
    }
    else {
      sql += " AND ISNULL(NegativeNo, '') = ''";
    }
  }
  if (conditionTypeNo != "") {
    sql += " AND ConditionTypeNo = ?";
    args.push(conditionTypeNo);
  }

  sql += " ORDER BY PurposeCode, AppCode, ConditionTypeNo";

  var dtConditionType = GetDataWithArgs(sql, args);
  if (dtConditionType != null) {
    for (var i = 0; i < dtConditionType.size(); i++) {
      var dr = dtConditionType.get(i);

      var conditionType = {};
      conditionType.PurposeCode = dr.get("PurposeCode");
      conditionType.AppCode = dr.get("AppCode");
      conditionType.AccessCode = dr.get("AccessCode");
      conditionType.NegativeNo = dr.get("NegativeNo");
      conditionType.ConditionTypeNo = dr.get("ConditionTypeNo");
      conditionType.ConditionTypeName = dr.get("ConditionTypeName");

      conditionTypeList.push(conditionType);
    }
  }

  return conditionTypeList;
}

/*
  [取得所有價目表類型]

  #2023-01-06 Create by Mars
*/
function GetPriceListType() {
  return GetPriceListTypeProcedure("");
}

/*
  [取得價目表類型(by 價目表類型編號)]
  priceListTypeNo:	價目表類型編號

  #2023-01-06 Create by Mars
*/
function GetPriceListTypeByPriceListTypeNo(priceListTypeNo) {
  var priceListType = null;

  if (priceListTypeNo != "") {
    var priceListTypeList = GetPriceListTypeProcedure(priceListTypeNo);
    if (priceListTypeList.length > 0) {
      priceListType = priceListTypeList[0];
    }
  }

  return priceListType;
}

/*
  [取得價目表類型程式(非Publish)]
  priceListTypeNo:	價目表類型編號

  #2023-01-06 Create by Mars
*/
function GetPriceListTypeProcedure(priceListTypeNo) {
  var priceListTypeList = [];

  var sql =
    " SELECT PriceListTypeNo, PriceListTypeName" +
    " FROM MD_S_PriceListType (NOLOCK)" +
    " WHERE 1 = 1";
  var args = [];

  if (priceListTypeNo != "") {
    sql += " AND PriceListTypeNo = ?";
    args.push(priceListTypeNo);
  }

  sql += " ORDER BY PriceListTypeNo";

  var dtPriceListType = GetDataWithArgs(sql, args);
  if (dtPriceListType != null) {
    for (var i = 0; i < dtPriceListType.size(); i++) {
      var dr = dtPriceListType.get(i);

      var priceListType = {};
      priceListType.PriceListTypeNo = dr.get("PriceListTypeNo");
      priceListType.PriceListTypeName = dr.get("PriceListTypeName");

      priceListTypeList.push(priceListType);
    }
  }

  return priceListTypeList;
}

/*
  [取得所有客戶]
  usableFlag:	是否有效

  #2023-01-06 Create by Mars
*/
function GetCustomer(usableFlag) {
  return GetCustomerProcedure("", "", "", usableFlag);
}

/*
  [取得客戶(by 客戶編號)]
  customerNo:	客戶編號
  usableFlag:	是否有效

  #2023-01-06 Create by Mars
*/
function GetCustomerByCustomerNo(customerNo, usableFlag) {
  var customer = null;

  if (customerNo != "") {
    var customerList = GetCustomerProcedure(customerNo, "", "", usableFlag);
    if (customerList.length > 0) {
      customer = customerList[0];
    }
  }

  return customer;
}

/*
  [取得客戶(by 業務夥伴分組編號)]
  bpGRPNo:	業務夥伴分組編號
  usableFlag:	是否有效

  #2023-01-10 Create by Mars
*/
function GetCustomerByBPGRPNo(bpGRPNo, usableFlag) {
  var customerList = [];

  if (bpGRPNo != "") {
    customerList = GetCustomerProcedure("", "", bpGRPNo, usableFlag);
  }

  return customerList;
}

/*
  [取得客戶程式(非Publish)]
  customerNo:		客戶編號
  deliveryTime:	配送時段
  bpGRPNo:		業務夥伴分組編號
  usableFlag:		是否有效

  #2023-01-06 Create by Mars
*/
function GetCustomerProcedure(customerNo, deliveryTime, bpGRPNo, usableFlag) {
  var customerList = [];

  var sql =
    " SELECT CustomerNo, CustomerName, CountryNo, DeliveryTime, BPGRPNo, ArchiveFlag, BlockFlag, NotApproveFlag, OpenDate" +
    " FROM MD_S_Customer (NOLOCK)" +
    " WHERE 1 = 1";
  var args = [];

  if (customerNo != "") {
    sql += " AND CustomerNo = ?";
    args.push(customerNo);
  }
  if (deliveryTime != "") {
    sql += " AND DeliveryTime = ?";
    args.push(deliveryTime);
  }
  if (bpGRPNo != "") {
    sql += " AND BPGRPNo = ?";
    args.push(bpGRPNo);
  }
  if (usableFlag != null) {
    if (usableFlag) {
      sql += " AND (ArchiveFlag <> 'X' AND BlockFlag <> 'X' AND NotApproveFlag <> 'X')";
    }
    else {
      sql += " AND (ArchiveFlag = 'X' OR BlockFlag = 'X' OR NotApproveFlag = 'X')";
    }
  }

  sql += " ORDER BY CustomerNo";

  var dtCustomer = GetDataWithArgs(sql, args);
  if (dtCustomer != null) {
    for (var i = 0; i < dtCustomer.size(); i++) {
      var dr = dtCustomer.get(i);

      var customer = {};
      customer.CustomerNo = dr.get("CustomerNo");
      customer.CustomerName = dr.get("CustomerName");
      customer.CountryNo = dr.get("CountryNo");
      customer.DeliveryTime = dr.get("DeliveryTime");
      customer.BPGRPNo = dr.get("BPGRPNo");
      customer.ArchiveFlag = dr.get("ArchiveFlag");
      customer.BlockFlag = dr.get("BlockFlag");
      customer.NotApproveFlag = dr.get("NotApproveFlag");
      customer.OpenDate = dr.get("OpenDate");

      customerList.push(customer);
    }
  }

  return customerList;
}

/*
  [取得所有產業別]

  #2023-01-16 Create by Mars
*/
function GetIndustry() {
  return GetIndustryProcedure("");
}

/*
  [取得產業別(by 產業別編號)]
  insudtryNo:	產業別編號

  #2023-01-16 Create by Mars
*/
function GetIndustryByIndustryNo(industryNo) {
  var industry = null;

  if (industryNo != "") {
    var industryList = GetIndustryProcedure(industryNo);
    if (industryList.length > 0) {
      industry = industryList[0];
    }
  }

  return industry;
}

/*
  [取得產業別程式(非Publish)]
  insudtryNo:	產業別編號

  #2023-01-16 Create by Mars
*/
function GetIndustryProcedure(industryNo) {
  var industryList = [];

  var sql =
    " SELECT IndustryNo, IndustryName" +
    " FROM MD_S_Industry (NOLOCK)" +
    " WHERE 1 = 1";
  var args = [];

  if (industryNo != "") {
    sql += " AND IndustryNo = ?";
    args.push(industryNo);
  }

  sql += " ORDER BY IndustryNo";

  var dtIndustry = GetDataWithArgs(sql, args);
  if (dtIndustry != null) {
    for (var i = 0; i < dtIndustry.size(); i++) {
      var dr = dtIndustry.get(i);

      var industry = {};
      industry.IndustryNo = dr.get("IndustryNo");
      industry.IndustryName = dr.get("IndustryName");

      industryList.push(industry);
    }
  }

  return industryList;
}

/*
  [取得所有物料類型]

  #2023-01-16 Create by Mars
*/
function GetMaterialClass() {
  return GetMaterialClassProcedure("");
}

/*
  [取得物料類型(by 物料類型編號)]
  materialClassNo:	物料類型編號

  #2023-01-16 Create by Mars
*/
function GetMaterialClassByMaterialClassNo(materialClassNo) {
  var materialClass = null;

  if (materialClassNo != "") {
    var materialClassList = GetMaterialClassProcedure(materialClassNo);
    if (materialClassList.length > 0) {
      materialClass = materialClassList[0];
    }
  }

  return materialClass;
}

/*
  [取得物料類型程式(非Publish)]
  materialClassNo:	物料類型編號

  #2023-01-16 Create by Mars
*/
function GetMaterialClassProcedure(materialClassNo) {
  var materialClassList = [];

  var sql =
    " SELECT MaterialClassNo, MaterialClassName" +
    " FROM MD_S_MaterialClass (NOLOCK)" +
    " WHERE 1 = 1";
  var args = [];

  if (materialClassNo != "") {
    sql += " AND MaterialClassNo = ?";
    args.push(materialClassNo);
  }

  sql += " ORDER BY MaterialClassNo";

  var dtMaterialClass = GetDataWithArgs(sql, args);
  if (dtMaterialClass != null) {
    for (var i = 0; i < dtMaterialClass.size(); i++) {
      var dr = dtMaterialClass.get(i);

      var materialClass = {};
      materialClass.MaterialClassNo = dr.get("MaterialClassNo");
      materialClass.MaterialClassName = dr.get("MaterialClassName");

      materialClassList.push(materialClass);
    }
  }

  return materialClassList;
}

/*
  [取得所有跨廠物料狀態]

  #2023-01-16 Create by Mars
*/
function GetMaterialStatus() {
  return GetMaterialStatusProcedure("");
}

/*
  [取得跨廠物料狀態(by 跨廠物料狀態編號)]
  materialStatusNo:	跨廠物料狀態編號

  #2023-01-16 Create by Mars
*/
function GetMaterialStatusByMaterialStatusNo(materialStatusNo) {
  var materialStatus = null;

  if (materialStatusNo != "") {
    var materialStatusList = GetMaterialStatusProcedure(materialStatusNo);
    if (materialStatusList.length > 0) {
      materialStatus = materialStatusList[0];
    }
  }

  return materialStatus;
}

/*
  [取得跨廠物料狀態程式(非Publish)]
  materialStatusNo:	跨廠物料狀態編號

  #2023-01-16 Create by Mars
*/
function GetMaterialStatusProcedure(materialStatusNo) {
  var materialStatusList = [];

  var sql =
    " SELECT MaterialStatusNo, MaterialStatusName" +
    " FROM MD_S_MaterialStatus (NOLOCK)" +
    " WHERE 1 = 1";
  var args = [];

  if (materialStatusNo != "") {
    sql += " AND MaterialStatusNo = ?";
    args.push(materialStatusNo);
  }

  sql += " ORDER BY MaterialStatusNo";

  var dtMaterialStatus = GetDataWithArgs(sql, args);
  if (dtMaterialStatus != null) {
    for (var i = 0; i < dtMaterialStatus.size(); i++) {
      var dr = dtMaterialStatus.get(i);

      var materialStatus = {};
      materialStatus.MaterialStatusNo = dr.get("MaterialStatusNo");
      materialStatus.MaterialStatusName = dr.get("MaterialStatusName");

      materialStatusList.push(materialStatus);
    }
  }

  return materialStatusList;
}

/*
  [取得所有材質細碼]

  #2023-01-16 Create by Mars
*/
function GetMaterialKind() {
  return GetMaterialKindProcedure("");
}

/*
  [取得材質細碼(by 材質細碼編號)]
  materialKindNo:	材質細碼編號

  #2023-01-16 Create by Mars
*/
function GetMaterialKindByMaterialKindNo(materialKindNo) {
  var materialKind = null;

  if (materialKindNo != "") {
    var materialKindList = GetMaterialKindProcedure(materialKindNo);
    if (materialKindList.length > 0) {
      materialKind = materialKindList[0];
    }
  }

  return materialKind;
}

/*
  [取得材質細碼程式(非Publish)]
  materialKindNo:	材質細碼編號

  #2023-01-16 Create by Mars
*/
function GetMaterialKindProcedure(materialKindNo) {
  var materialKindList = [];

  var sql =
    " SELECT MaterialKindNo, MaterialKindName" +
    " FROM MD_S_MaterialKind (NOLOCK)" +
    " WHERE 1 = 1";
  var args = [];

  if (materialKindNo != "") {
    sql += " AND MaterialKindNo = ?";
    args.push(materialKindNo);
  }

  sql += " ORDER BY MaterialKindNo";

  var dtMaterialKind = GetDataWithArgs(sql, args);
  if (dtMaterialKind != null) {
    for (var i = 0; i < dtMaterialKind.size(); i++) {
      var dr = dtMaterialKind.get(i);

      var materialKind = {};
      materialKind.MaterialKindNo = dr.get("MaterialKindNo");
      materialKind.MaterialKindName = dr.get("MaterialKindName");

      materialKindList.push(materialKind);
    }
  }

  return materialKindList;
}

/*
  [取得所有儲存條件]

  #2023-01-16 Create by Mars
*/
function GetCompartment() {
  return GetCompartmentProcedure("");
}

/*
  [取得儲存條件(by 儲存條件編號)]
  compartmentNo:	儲存條件編號

  #2023-01-16 Create by Mars
*/
function GetCompartmentByCompartmentNo(compartmentNo) {
  var compartment = null;

  if (compartmentNo != "") {
    var compartmentList = GetCompartmentProcedure(compartmentNo);
    if (compartmentList.length > 0) {
      compartment = compartmentList[0];
    }
  }

  return compartment;
}

/*
  [取得儲存條件程式(非Publish)]
  compartmentNo:	儲存條件編號

  #2023-01-16 Create by Mars
*/
function GetCompartmentProcedure(compartmentNo) {
  var compartmentList = [];

  var sql =
    " SELECT CompartmentNo, CompartmentName" +
    " FROM MD_S_Compartment (NOLOCK)" +
    " WHERE 1 = 1";
  var args = [];

  if (compartmentNo != "") {
    sql += " AND CompartmentNo = ?";
    args.push(compartmentNo);
  }

  sql += " ORDER BY CompartmentNo";

  var dtCompartment = GetDataWithArgs(sql, args);
  if (dtCompartment != null) {
    for (var i = 0; i < dtCompartment.size(); i++) {
      var dr = dtCompartment.get(i);

      var compartment = {};
      compartment.CompartmentNo = dr.get("CompartmentNo");
      compartment.CompartmentName = dr.get("CompartmentName");

      compartmentList.push(compartment);
    }
  }

  return compartmentList;
}

/*
  [取得所有工廠]

  #2023-01-16 Create by Mars
*/
function GetFactory() {
  return GetFactoryProcedure("", "", "");
}

/*
  [取得工廠(by 採購群組編號)]
  procurementOrgNo:	採購群組編號

  #2023-01-16 Create by Mars
*/
function GetFactoryByProcurementOrgNo(procurementOrgNo) {
  var factoryList = [];

  if (procurementOrgNo != "") {
    factoryList = GetFactoryProcedure(procurementOrgNo, "", "");
  }

  return factoryList;
}

/*
  [取得工廠(by 銷售群組編號)]
  salesOrgNo:			銷售群組編號

  #2023-01-16 Create by Mars
*/
function GetFactoryBySalesOrgNo(salesOrgNo) {
  var factoryList = [];

  if (salesOrgNo != "") {
    factoryList = GetFactoryProcedure("", salesOrgNo, "");
  }

  return factoryList;
}

/*
  [取得工廠(by 工廠編號)]
  factoryNo:			工廠編號

  #2023-01-16 Create by Mars
*/
function GetFactoryByFactoryNo(factoryNo) {
  var factory = null;

  if (factoryNo != "") {
    var factoryList = GetFactoryProcedure("", "", factoryNo);
    if (factoryList.length > 0) {
      factory = factoryList[0];
    }
  }

  return factory;
}

/*
  [取得工廠程式(非Publish)]
  procurementOrgNo:	採購群組編號
  salesOrgNo:			銷售群組編號
  factoryNo:			工廠編號

  #2023-01-16 Create by Mars
*/
function GetFactoryProcedure(procurementOrgNo, salesOrgNo, factoryNo) {
  var factoryList = [];

  var sql =
    " SELECT FactoryNo, FactoryName, ProcurementOrgNo, SalesOrgNo, CountryNo, ValuationNo" +
    " FROM MD_S_Factory (NOLOCK)" +
    " WHERE 1 = 1";
  var args = [];

  if (procurementOrgNo != "") {
    sql += " AND ProcurementOrgNo = ?";
    args.push(procurementOrgNo);
  }
  if (salesOrgNo != "") {
    sql += " AND SalesOrgNo = ?";
    args.push(salesOrgNo);
  }
  if (factoryNo != "") {
    sql += " AND FactoryNo = ?";
    args.push(factoryNo);
  }

  sql += " ORDER BY ProcurementOrgNo, SalesOrgNo, FactoryNo";

  var dtFactory = GetDataWithArgs(sql, args);
  if (dtFactory != null) {
    for (var i = 0; i < dtFactory.size(); i++) {
      var dr = dtFactory.get(i);

      var factory = {};
      factory.FactoryNo = dr.get("FactoryNo");
      factory.FactoryName = dr.get("FactoryName");
      factory.ProcurementOrgNo = dr.get("ProcurementOrgNo");
      factory.SalesOrgNo = dr.get("SalesOrgNo");
      factory.CountryNo = dr.get("CountryNo");
      factory.ValuationNo = dr.get("ValuationNo");

      factoryList.push(factory);
    }
  }

  return factoryList;
}

/*
  [取得利潤中心(by 成本控制編號)]
  costCtrlNo:		成本控制編號

  #2023-01-16 Create by Mars
*/
function GetProfitCenterByCostCtrlNo(costCtrlNo) {
  var profitCenterList = [];

  if (costCtrlNo != "") {
    profitCenterList = GetProfitCenterProcedure(costCtrlNo, "");
  }

  return profitCenterList;
}

/*
  [取得利潤中心(by 利潤中心編號)]
  profitCenterNo:	利潤中心編號

  #2023-01-16 Create by Mars
*/
function GetProfitCenterByProfitCenterNo(profitCenterNo) {
  var profitCenter = null;

  if (profitCenterNo != "") {
    var profitCenterList = GetProfitCenterProcedure("", profitCenterNo);
    if (profitCenterList.length > 0) {
      profitCenter = profitCenterList[0];
    }
  }

  return profitCenter;
}

/*
  [取得利潤中心程式(非Publish)]
  costCtrlNo:		成本控制編號
  profitCenterNo:	利潤中心編號

  #2023-01-16 Create by Mars
*/
function GetProfitCenterProcedure(costCtrlNo, profitCenterNo) {
  var profitCenterList = [];

  var sql =
    " SELECT ProfitCenterNo, ProfitCenterName_S, ProfitCenterName_L, CostCtrlNo" +
    " FROM MD_S_ProfitCenter (NOLOCK)" +
    " WHERE 1 = 1";
  var args = [];

  if (costCtrlNo != "") {
    sql += " AND CostCtrlNo = ?";
    args.push(costCtrlNo);
  }
  if (profitCenterNo != "") {
    sql += " AND ProfitCenterNo = ?";
    args.push(profitCenterNo);
  }

  sql += " ORDER BY CostCtrlNo, ProfitCenterNo";

  var dtProfitCenter = GetDataWithArgs(sql, args);
  if (dtProfitCenter != null) {
    for (var i = 0; i < dtProfitCenter.size(); i++) {
      var dr = dtProfitCenter.get(i);

      var profitCenter = {};
      profitCenter.ProfitCenterNo = dr.get("ProfitCenterNo");
      profitCenter.ProfitCenterName_S = dr.get("ProfitCenterName_S");
      profitCenter.ProfitCenterName_L = dr.get("ProfitCenterName_L");
      profitCenter.CostCtrlNo = dr.get("CostCtrlNo");

      profitCenterList.push(profitCenter);
    }
  }

  return profitCenterList;
}

/*
  [取得儲存位置(by 工廠編號)]
  factoryNo:	工廠編號

  #2023-01-16 Create by Mars
*/
function GetStorageByFactoryNo(factoryNo) {
  var storageList = [];

  if (factoryNo != "") {
    storageList = GetStorageProcedure(factoryNo, "");
  }

  return storageList;
}

/*
  [取得儲存位置(by 工廠編號、儲存位置編號)]
  factoryNo:	工廠編號
  storageNo:	儲存位置編號

  #2023-01-16 Create by Mars
*/
function GetStorageByStorageNo(factoryNo, storageNo) {
  var storage = null;

  if (factoryNo != "" && storageNo != "") {
    var storageList = GetStorageProcedure(factoryNo, storageNo);
    if (storageList.length > 0) {
      storage = storageList[0];
    }
  }

  return storage;
}

/*
  [取得儲存位置程式(非Publish)]
  factoryNo:	工廠編號
  storageNo:	儲存位置編號

  #2023-01-16 Create by Mars
*/
function GetStorageProcedure(factoryNo, storageNo) {
  var storageList = [];

  var sql =
    " SELECT StorageNo, StorageName, FactoryNo" +
    " FROM MD_S_Storage (NOLOCK)" +
    " WHERE 1 = 1";
  var args = [];

  if (factoryNo != "") {
    sql += " AND FactoryNo = ?";
    args.push(factoryNo);
  }
  if (storageNo != "") {
    sql += " AND StorageNo = ?";
    args.push(storageNo);
  }

  sql += " ORDER BY FactoryNo, StorageNo";

  var dtStorage = GetDataWithArgs(sql, args);
  if (dtStorage != null) {
    for (var i = 0; i < dtStorage.size(); i++) {
      var dr = dtStorage.get(i);

      var storage = {};
      storage.StorageNo = dr.get("StorageNo");
      storage.StorageName = dr.get("StorageName");
      storage.FactoryNo = dr.get("FactoryNo");

      storageList.push(storage);
    }
  }

  return storageList;
}

/*
  [取得稅分類(by 稅編號)]
  taxNo:		稅編號

  #2023-01-16 Create by Mars
*/
function GetTaxClassByTaxNo(taxNo) {
  var taxClassList = [];

  if (taxNo != "") {
    taxClassList = GetTaxClassProcedure(taxNo, "");
  }

  return taxClassList;
}

/*
  [取得稅分類(by 稅編號、稅分類編號)]
  taxNo:		稅編號
  taxClassNo:	稅分類編號

  #2023-01-16 Create by Mars
*/
function GetTaxClassByTaxClassNo(taxNo, taxClassNo) {
  var taxClass = null;

  if (taxNo != "" && taxClassNo != "") {
    var taxClassList = GetTaxClassProcedure(taxNo, taxClassNo);
    if (taxClassList.length > 0) {
      taxClass = taxClassList[0];
    }
  }

  return taxClass;
}

/*
  [取得稅分類程式(非Publish)]
  taxNo:		稅編號
  taxClassNo:	稅分類編號

  #2023-01-16 Create by Mars
*/
function GetTaxClassProcedure(taxNo, taxClassNo) {
  var taxClassList = [];

  var sql =
    " SELECT TaxClassNo, TaxClassName, TaxNo" +
    " FROM MD_S_TaxClass (NOLOCK)" +
    " WHERE 1 = 1";
  var args = [];

  if (taxNo != "") {
    sql += " AND TaxNo = ?";
    args.push(taxNo);
  }
  if (taxClassNo != "") {
    sql += " AND TaxClassNo = ?";
    args.push(taxClassNo);
  }

  sql += " ORDER BY TaxNo, TaxClassNo";

  var dtTaxClass = GetDataWithArgs(sql, args);
  if (dtTaxClass != null) {
    for (var i = 0; i < dtTaxClass.size(); i++) {
      var dr = dtTaxClass.get(i);

      var taxClass = {};
      taxClass.TaxClassNo = dr.get("TaxClassNo");
      taxClass.TaxClassName = dr.get("TaxClassName");
      taxClass.TaxNo = dr.get("TaxNo");

      taxClassList.push(taxClass);
    }
  }

  return taxClassList;
}

/*
  [取得所有科目指派群組]

  #2023-01-16 Create by Mars
*/
function GetMaterialAccGrp() {
  return GetMaterialAccGrpProcedure("");
}

/*
  [取得科目指派群組(by 科目指派群組編號)]
  materialAccGrpNo:	科目指派群組編號

  #2023-01-16 Create by Mars
*/
function GetMaterialAccGrpByMaterialAccGrpNo(materialAccGrpNo) {
  var materialAccGrp = null;

  if (materialAccGrpNo != "") {
    var materialAccGrpList = GetMaterialAccGrpProcedure(materialAccGrpNo);
    if (materialAccGrpList.length > 0) {
      materialAccGrp = materialAccGrpList[0];
    }
  }

  return materialAccGrp;
}

/*
  [取得科目指派群組程式(非Publish)]
  materialAccGrpNo:	科目指派群組編號

  #2023-01-16 Create by Mars
*/
function GetMaterialAccGrpProcedure(materialAccGrpNo) {
  var materialAccGrpList = [];

  var sql =
    " SELECT MaterialAccGrpNo, MaterialAccGrpName" +
    " FROM MD_S_MaterialAccGrp (NOLOCK)" +
    " WHERE 1 = 1";
  var args = [];

  if (materialAccGrpNo != "") {
    sql += " AND MaterialAccGrpNo = ?";
    args.push(materialAccGrpNo);
  }

  sql += " ORDER BY MaterialAccGrpNo";

  var dtMaterialAccGrp = GetDataWithArgs(sql, args);
  if (dtMaterialAccGrp != null) {
    for (var i = 0; i < dtMaterialAccGrp.size(); i++) {
      var dr = dtMaterialAccGrp.get(i);

      var materialAccGrp = {};
      materialAccGrp.MaterialAccGrpNo = dr.get("MaterialAccGrpNo");
      materialAccGrp.MaterialAccGrpName = dr.get("MaterialAccGrpName");

      materialAccGrpList.push(materialAccGrp);
    }
  }

  return materialAccGrpList;
}

/*
  [取得所有物料群組1]

  #2023-01-12 Create by Mars
*/
function GetMaterialType1() {
  return GetMaterialType1Procedure("");
}

/*
  [取得物料群組1(by 物料群組1編號)]
  materialType1No:	物料群組1編號

  #2023-01-12 Create by Mars
*/
function GetMaterialType1ByMaterialType1No(materialType1No) {
  var materialType1 = null;

  if (materialType1No != "") {
    var materialType1List = GetMaterialType1Procedure(materialType1No);
    if (materialType1List.length > 0) {
      materialType1 = materialType1List[0];
    }
  }

  return materialType1;
}

/*
  [取得物料群組1程式(非Publish)]
  materialType1No:	物料群組1編號

  #2023-01-12 Create by Mars
*/
function GetMaterialType1Procedure(materialType1No) {
  var materialType1List = [];

  var sql =
    " SELECT MaterialType1No, MaterialType1Name" +
    " FROM MD_S_MaterialType1 (NOLOCK)" +
    " WHERE 1 = 1";
  var args = [];

  if (materialType1No != "") {
    sql += " AND MaterialType1No = ?";
    args.push(materialType1No);
  }

  sql += " ORDER BY MaterialType1No";

  var dtMaterialType1 = GetDataWithArgs(sql, args);
  if (dtMaterialType1 != null) {
    for (var i = 0; i < dtMaterialType1.size(); i++) {
      var dr = dtMaterialType1.get(i);

      var materialType1 = {};
      materialType1.MaterialType1No = dr.get("MaterialType1No");
      materialType1.MaterialType1Name = dr.get("MaterialType1Name");

      materialType1List.push(materialType1);
    }
  }

  return materialType1List;
}

/*
  [取得所有物料群組2]

  #2023-01-12 Create by Mars
*/
function GetMaterialType2() {
  return GetMaterialType2Procedure("");
}

/*
  [取得物料群組2(by 物料群組2編號)]
  materialType2No:	物料群組2編號

  #2023-01-12 Create by Mars
*/
function GetMaterialType2ByMaterialType2No(materialType2No) {
  var materialType2 = null;

  if (materialType2No != "") {
    var materialType2List = GetMaterialType2Procedure(materialType2No);
    if (materialType2List.length > 0) {
      materialType2 = materialType2List[0];
    }
  }

  return materialType2;
}

/*
  [取得物料群組2程式(非Publish)]
  materialType2No:	物料群組1編號

  #2023-01-12 Create by Mars
*/
function GetMaterialType2Procedure(materialType2No) {
  var materialType2List = [];

  var sql =
    " SELECT MaterialType2No, MaterialType2Name" +
    " FROM MD_S_MaterialType2 (NOLOCK)" +
    " WHERE 1 = 1";
  var args = [];

  if (materialType2No != "") {
    sql += " AND MaterialType2No = ?";
    args.push(materialType2No);
  }

  sql += " ORDER BY MaterialType2No";

  var dtMaterialType2 = GetDataWithArgs(sql, args);
  if (dtMaterialType2 != null) {
    for (var i = 0; i < dtMaterialType2.size(); i++) {
      var dr = dtMaterialType2.get(i);

      var materialType2 = {};
      materialType2.MaterialType2No = dr.get("MaterialType2No");
      materialType2.MaterialType2Name = dr.get("MaterialType2Name");

      materialType2List.push(materialType2);
    }
  }

  return materialType2List;
}

/*
  [取得所有可用度檢查]

  #2023-01-16 Create by Mars
*/
function GetAvailability() {
  return GetAvailabilityProcedure("");
}

/*
  [取得可用度檢查(by 可用度檢查編號)]
  availabilityNo:	可用度檢查編號

  #2023-01-16 Create by Mars
*/
function GetAvailabilityByAvailabilityNo(availabilityNo) {
  var availability = null;

  if (availabilityNo != "") {
    var availabilityList = GetAvailabilityProcedure(availabilityNo);
    if (availabilityList.length > 0) {
      availability = availabilityList[0];
    }
  }

  return availability;
}

/*
  [取得可用度檢查程式(非Publish)]
  availabilityNo:	可用度檢查編號

  #2023-01-16 Create by Mars
*/
function GetAvailabilityProcedure(availabilityNo) {
  var availabilityList = [];

  var sql =
    " SELECT AvailabilityNo, AvailabilityName" +
    " FROM MD_S_Availability (NOLOCK)" +
    " WHERE 1 = 1";
  var args = [];

  if (availabilityNo != "") {
    sql += " AND AvailabilityNo = ?";
    args.push(availabilityNo);
  }

  sql += " ORDER BY AvailabilityNo";

  var dtAvailability = GetDataWithArgs(sql, args);
  if (dtAvailability != null) {
    for (var i = 0; i < dtAvailability.size(); i++) {
      var dr = dtAvailability.get(i);

      var availability = {};
      availability.AvailabilityNo = dr.get("AvailabilityNo");
      availability.AvailabilityName = dr.get("AvailabilityName");

      availabilityList.push(availability);
    }
  }

  return availabilityList;
}

/*
  [取得所有運輸群組]

  #2023-01-16 Create by Mars
*/
function GetTransportation() {
  return GetTransportationProcedure("");
}

/*
  [取得運輸群組(by 運輸群組編號)]
  transportationNo:	運輸群組編號

  #2023-01-16 Create by Mars
*/
function GetTransportationByTransportationNo(transportationNo) {
  var transportation = null;

  if (transportationNo != "") {
    var transportationList = GetTransportationProcedure(transportationNo);
    if (transportationList.length > 0) {
      transportation = transportationList[0];
    }
  }

  return transportation;
}

/*
  [取得運輸群組程式(非Publish)]
  transportationNo:	運輸群組編號

  #2023-01-16 Create by Mars
*/
function GetTransportationProcedure(transportationNo) {
  var transportationList = [];

  var sql =
    " SELECT TransportationNo, TransportationName" +
    " FROM MD_S_Transportation (NOLOCK)" +
    " WHERE 1 = 1";
  var args = [];

  if (transportationNo != "") {
    sql += " AND TransportationNo = ?";
    args.push(transportationNo);
  }

  sql += " ORDER BY TransportationNo";

  var dtTransportation = GetDataWithArgs(sql, args);
  if (dtTransportation != null) {
    for (var i = 0; i < dtTransportation.size(); i++) {
      var dr = dtTransportation.get(i);

      var transportation = {};
      transportation.TransportationNo = dr.get("TransportationNo");
      transportation.TransportationName = dr.get("TransportationName");

      transportationList.push(transportation);
    }
  }

  return transportationList;
}

/*
  [取得所有裝載群組]

  #2023-01-16 Create by Mars
*/
function GetLoading() {
  return GetLoadingProcedure("");
}

/*
  [取得裝載群組(by 裝載群組編號)]
  loadingNo:	裝載群組編號

  #2023-01-16 Create by Mars
*/
function GetLoadingByLoadingNo(loadingNo) {
  var loading = null;

  if (loadingNo != "") {
    var loadingList = GetLoadingProcedure(loadingNo);
    if (loadingList.length > 0) {
      loading = loadingList[0];
    }
  }

  return loading;
}

/*
  [取得裝載群組程式(非Publish)]
  loadingNo:	裝載群組編號

  #2023-01-16 Create by Mars
*/
function GetLoadingProcedure(loadingNo) {
  var loadingList = [];

  var sql =
    " SELECT LoadingNo, LoadingName" +
    " FROM MD_S_Loading (NOLOCK)" +
    " WHERE 1 = 1";
  var args = [];

  if (loadingNo != "") {
    sql += " AND LoadingNo = ?";
    args.push(loadingNo);
  }

  sql += " ORDER BY LoadingNo";

  var dtLoading = GetDataWithArgs(sql, args);
  if (dtLoading != null) {
    for (var i = 0; i < dtLoading.size(); i++) {
      var dr = dtLoading.get(i);

      var loading = {};
      loading.LoadingNo = dr.get("LoadingNo");
      loading.LoadingName = dr.get("LoadingName");

      loadingList.push(loading);
    }
  }

  return loadingList;
}

/*
  [取得所有採購群組]

  #2023-01-16 Create by Mars
*/
function GetProcurementGrp() {
  return GetProcurementGrpProcedure("");
}

/*
  [取得採購群組(by 採購群組編號)]
  procurementGrpNo:	採購群組編號

  #2023-01-16 Create by Mars
*/
function GetProcurementGrpByProcurementGrpNo(procurementGrpNo) {
  var procurementGrp = null;

  if (procurementGrpNo != "") {
    var procurementGrpList = GetProcurementGrpProcedure(procurementGrpNo);
    if (procurementGrpList.length > 0) {
      procurementGrp = procurementGrpList[0];
    }
  }

  return procurementGrp;
}

/*
  [取得採購群組程式(非Publish)]
  procurementGrpNo:	採購群組編號

  #2023-01-16 Create by Mars
*/
function GetProcurementGrpProcedure(procurementGrpNo) {
  var procurementGrpList = [];

  var sql =
    " SELECT ProcurementGrpNo, ProcurementGrpName" +
    " FROM MD_S_ProcurementGrp (NOLOCK)" +
    " WHERE 1 = 1";
  var args = [];

  if (procurementGrpNo != "") {
    sql += " AND ProcurementGrpNo = ?";
    args.push(procurementGrpNo);
  }

  sql += " ORDER BY ProcurementGrpNo";

  var dtProcurementGrp = GetDataWithArgs(sql, args);
  if (dtProcurementGrp != null) {
    for (var i = 0; i < dtProcurementGrp.size(); i++) {
      var dr = dtProcurementGrp.get(i);

      var procurementGrp = {};
      procurementGrp.ProcurementGrpNo = dr.get("ProcurementGrpNo");
      procurementGrp.ProcurementGrpName = dr.get("ProcurementGrpName");

      procurementGrpList.push(procurementGrp);
    }
  }

  return procurementGrpList;
}

/*
  [取得所有採購值碼]

  #2023-01-16 Create by Mars
*/
function GetProcurementCode() {
  return GetProcurementCodeProcedure("");
}

/*
  [取得採購值碼(by 採購值碼)]
  procurementCod:	採購值碼

  #2023-01-16 Create by Mars
*/
function GetProcurementCodeByProcurementCode(procurementCod) {
  var procurementCode = null;

  if (procurementCod != "") {
    var procurementCodeList = GetProcurementCodeProcedure(procurementCod);
    if (procurementCodeList.length > 0) {
      procurementCode = procurementCodeList[0];
    }
  }

  return procurementCode;
}

/*
  [取得採購值碼程式(非Publish)]
  procurementCod:	採購值碼

  #2023-01-16 Create by Mars
*/
function GetProcurementCodeProcedure(procurementCod) {
  var procurementCodeList = [];

  var sql =
    " SELECT ProcurementCode, ReminderDay_1, ReminderDay_2, ReminderDay_3, ToleranceAmt_In, ToleranceAmt_Ex, DeliveryAmt_Min, DeliveryVariation" +
    " FROM MD_S_ProcurementCode (NOLOCK)" +
    " WHERE 1 = 1";
  var args = [];

  if (procurementCod != "") {
    sql += " AND ProcurementCode = ?";
    args.push(procurementCod);
  }

  sql += " ORDER BY ProcurementCode";

  var dtProcurementCode = GetDataWithArgs(sql, args);
  if (dtProcurementCode != null) {
    for (var i = 0; i < dtProcurementCode.size(); i++) {
      var dr = dtProcurementCode.get(i);

      var procurementCode = {};
      procurementCode.ProcurementCode = dr.get("ProcurementCode");
      procurementCode.ReminderDay_1 = dr.get("ReminderDay_1");
      procurementCode.ReminderDay_2 = dr.get("ReminderDay_2");
      procurementCode.ReminderDay_3 = dr.get("ReminderDay_3");
      procurementCode.ToleranceAmt_In = dr.get("ToleranceAmt_In");
      procurementCode.ToleranceAmt_Ex = dr.get("ToleranceAmt_Ex");
      procurementCode.DeliveryAmt_Min = dr.get("DeliveryAmt_Min");
      procurementCode.DeliveryVariation = dr.get("DeliveryVariation");

      procurementCodeList.push(procurementCode);
    }
  }

  return procurementCodeList;
}

/*
  [取得所有供應商]

  #2023-01-16 Create by Mars
*/
function GetSupplier() {
  return GetSupplierProcedure("");
}

/*
  [取得供應商(by 供應商編號)]
  supplierNo:	供應商編號

  #2023-01-16 Create by Mars
*/
function GetSupplierBySupplierNo(supplierNo) {
  var supplier = null;

  if (supplierNo != "") {
    var supplierList = GetSupplierProcedure(supplierNo);
    if (supplierList.length > 0) {
      supplier = supplierList[0];
    }
  }

  return supplier;
}

/*
  [取得供應商程式(非Publish)]
  supplierNo:	供應商編號

  #2023-01-16 Create by Mars
*/
function GetSupplierProcedure(supplierNo) {
  var supplierList = [];

  var sql =
    " SELECT SupplierNo, SupplierName, CountryNo" +
    " FROM MD_S_Supplier (NOLOCK)" +
    " WHERE 1 = 1";
  var args = [];

  if (supplierNo != "") {
    sql += " AND SupplierNo = ?";
    args.push(supplierNo);
  }

  sql += " ORDER BY SupplierNo";

  var dtSupplier = GetDataWithArgs(sql, args);
  if (dtSupplier != null) {
    for (var i = 0; i < dtSupplier.size(); i++) {
      var dr = dtSupplier.get(i);

      var supplier = {};
      supplier.SupplierNo = dr.get("SupplierNo");
      supplier.SupplierName = dr.get("SupplierName");
      supplier.CountryNo = dr.get("CountryNo");

      supplierList.push(supplier);
    }
  }

  return supplierList;
}

/*
  [取得採購組織(by 公司編號)]
  companyNo:			公司編號

  #2023-01-16 Create by Mars
*/
function GetProcurementOrgByCompanyNo(companyNo) {
  var procurementOrgList = [];

  if (companyNo != "") {
    procurementOrgList = GetProcurementOrgProcedure(companyNo, "");
  }

  return procurementOrgList;
}

/*
  [取得採購組織(by 採購組織編號)]
  procurementOrgNo:	採購組織編號

  #2023-01-17 Create by Mars
*/
function GetProcurementOrgByProcurementOrgNo(procurementOrgNo) {
  var procurementOrg = null;

  if (procurementOrgNo != "") {
    var procurementOrgList = GetProcurementOrgProcedure("", procurementOrgNo);
    if (procurementOrgList.length > 0) {
      procurementOrg = procurementOrgList[0];
    }
  }

  return procurementOrg;
}

/*
  [取得採購組織程式(非Publish)]
  companyNo:			公司編號
  procurementOrgNo:	採購組織編號

  #2023-01-17 Create by Mars
*/
function GetProcurementOrgProcedure(companyNo, procurementOrgNo) {
  var procurementOrgList = [];

  var sql =
    " SELECT ProcurementOrgNo, ProcurementOrgName, CompanyNo" +
    " FROM MD_S_ProcurementOrg (NOLOCK)" +
    " WHERE 1 = 1";
  var args = [];

  if (companyNo != "") {
    sql += " AND CompanyNo = ?";
    args.push(companyNo);
  }
  if (procurementOrgNo != "") {
    sql += " AND ProcurementOrgNo = ?";
    args.push(procurementOrgNo);
  }

  sql += " ORDER BY CompanyNo, ProcurementOrgNo";

  var dtProcurementOrg = GetDataWithArgs(sql, args);
  if (dtProcurementOrg != null) {
    for (var i = 0; i < dtProcurementOrg.size(); i++) {
      var dr = dtProcurementOrg.get(i);

      var procurementOrg = {};
      procurementOrg.ProcurementOrgNo = dr.get("ProcurementOrgNo");
      procurementOrg.ProcurementOrgName = dr.get("ProcurementOrgName");
      procurementOrg.CompanyNo = dr.get("CompanyNo");

      procurementOrgList.push(procurementOrg);
    }
  }

  return procurementOrgList;
}

/*
  [取得稅碼(by 稅程序編號)]
  taxCodeNo:		稅程序編號

  #2023-01-17 Create by Mars
*/
function GetTaxCategoryByTaxCodeNo(taxCodeNo) {
  var taxCategoryList = [];

  if (taxCodeNo != "") {
    taxCategoryList = GetTaxCategoryProcedure(taxCodeNo, "");
  }

  return taxCategoryList;
}

/*
  [取得稅碼(by 稅程序編號、稅碼編號)]
  taxCodeNo:		稅程序編號
  taxCategoryNo:	稅碼編號

  #2023-01-17 Create by Mars
*/
function GetTaxCategoryByTaxCategoryNo(taxCodeNo, taxCategoryNo) {
  var taxCategory = null;

  if (taxCodeNo != "" && taxCategoryNo != "") {
    var taxCategoryList = GetTaxCategoryProcedure(taxCodeNo, taxCategoryNo);
    if (taxCategoryList.length > 0) {
      taxCategory = taxCategoryList[0];
    }
  }

  return taxCategory;
}

/*
  [取得稅碼程式(非Publish)]
  taxCodeNo:		稅程序編號
  taxCategoryNo:	稅碼編號

  #2023-01-17 Create by Mars
*/
function GetTaxCategoryProcedure(taxCodeNo, taxCategoryNo) {
  var taxCategoryList = [];

  var sql =
    " SELECT TaxCategoryNo, TaxCategoryName, TaxCodeNo" +
    " FROM MD_S_TaxCategory (NOLOCK)" +
    " WHERE 1 = 1";
  var args = [];

  if (taxCodeNo != "") {
    sql += " AND TaxCodeNo = ?";
    args.push(taxCodeNo);
  }
  if (taxCategoryNo != "") {
    sql += " AND TaxCategoryNo = ?";
    args.push(taxCategoryNo);
  }

  sql += " ORDER BY TaxCodeNo, TaxCategoryNo";

  var dtTaxCategory = GetDataWithArgs(sql, args);
  if (dtTaxCategory != null) {
    for (var i = 0; i < dtTaxCategory.size(); i++) {
      var dr = dtTaxCategory.get(i);

      var taxCategory = {};
      taxCategory.TaxCategoryNo = dr.get("TaxCategoryNo");
      taxCategory.TaxCategoryName = dr.get("TaxCategoryName");
      taxCategory.TaxCodeNo = dr.get("TaxCodeNo");

      taxCategoryList.push(taxCategory);
    }
  }

  return taxCategoryList;
}

/*
  [取得所有MRP類型]

  #2023-01-17 Create by Mars
*/
function GetMRPType() {
  return GetMRPTypeProcedure("");
}

/*
  [取得MRP類型(by MRP類型編號)]
  mrpTypeNo:	MRP類型編號

  #2023-01-17 Create by Mars
*/
function GetMRPTypeByMRPTypeNo(mrpTypeNo) {
  var mrpType = null;

  if (mrpTypeNo != "") {
    var mrpTypeList = GetMRPTypeProcedure(mrpTypeNo);
    if (mrpTypeList.length > 0) {
      mrpType = mrpTypeList[0];
    }
  }

  return mrpType;
}

/*
  [取得MRP類型程式(非Publish)]
  mrpTypeNo:	MRP類型編號

  #2023-01-17 Create by Mars
*/
function GetMRPTypeProcedure(mrpTypeNo) {
  var mrpTypeList = [];

  var sql =
    " SELECT MRPTypeNo, MRPTypeName" +
    " FROM MD_S_MRPType (NOLOCK)" +
    " WHERE 1 = 1";
  var args = [];

  if (mrpTypeNo != "") {
    sql += " AND MRPTypeNo = ?";
    args.push(mrpTypeNo);
  }

  sql += " ORDER BY MRPTypeNo";

  var dtMRPType = GetDataWithArgs(sql, args);
  if (dtMRPType != null) {
    for (var i = 0; i < dtMRPType.size(); i++) {
      var dr = dtMRPType.get(i);

      var mrpType = {};
      mrpType.MRPTypeNo = dr.get("MRPTypeNo");
      mrpType.MRPTypeName = dr.get("MRPTypeName");

      mrpTypeList.push(mrpType);
    }
  }

  return mrpTypeList;
}

/*
  [取得MRP控制員(by 工廠編號)]
  factoryNo:			工廠編號

  #2023-01-17 Create by Mars
*/
function GetMRPControllerByFactoryNo(factoryNo) {
  var mrpControllerList = [];

  if (factoryNo != "") {
    mrpControllerList = GetMRPControllerProcedure(factoryNo, "");
  }

  return mrpControllerList;
}

/*
  [取得MRP控制員(by 工廠編號、MRP控制員編號)]
  factoryNo:			工廠編號
  mrpControllerNo:	MRP控制員編號

  #2023-01-17 Create by Mars
*/
function GetMRPControllerByMRPControllerNo(factoryNo, mrpControllerNo) {
  var mrpController = null;

  if (factoryNo != "" && mrpControllerNo != "") {
    var mrpControllerList = GetMRPControllerProcedure(factoryNo, mrpControllerNo);
    if (mrpControllerList.length > 0) {
      mrpController = mrpControllerList[0];
    }
  }

  return mrpController;
}

/*
  [取得MRP控制員程式(非Publish)]
  factoryNo:			工廠編號
  mrpControllerNo:	MRP控制員編號

  #2023-01-17 Create by Mars
*/
function GetMRPControllerProcedure(factoryNo, mrpControllerNo) {
  var mrpControllerList = [];

  var sql =
    " SELECT MRPControllerNo, MRPControllerName, FactoryNo, ProcurementGrpNo" +
    " FROM MD_S_MRPController (NOLOCK)" +
    " WHERE 1 = 1";
  var args = [];

  if (factoryNo != "") {
    sql += " AND FactoryNo = ?";
    args.push(factoryNo);
  }
  if (mrpControllerNo != "") {
    sql += " AND MRPControllerNo = ?";
    args.push(mrpControllerNo);
  }

  sql += " ORDER BY FactoryNo, MRPControllerNo";

  var dtMRPController = GetDataWithArgs(sql, args);
  if (dtMRPController != null) {
    for (var i = 0; i < dtMRPController.size(); i++) {
      var dr = dtMRPController.get(i);

      var mrpController = {};
      mrpController.MRPControllerNo = dr.get("MRPControllerNo");
      mrpController.MRPControllerName = dr.get("MRPControllerName");
      mrpController.FactoryNo = dr.get("FactoryNo");
      mrpController.ProcurementGrpNo = dr.get("ProcurementGrpNo");

      mrpControllerList.push(mrpController);
    }
  }

  return mrpControllerList;
}

/*
  [取得特殊採購(by 工廠編號)]
  factoryNo:			工廠編號

  #2023-01-17 Create by Mars
*/
function GetSPProcurementByFactoryNo(factoryNo) {
  var spProcurementList = [];

  if (factoryNo != "") {
    spProcurementList = GetSPProcurementProcedure(factoryNo, "");
  }

  return spProcurementList;
}

/*
  [取得特殊採購(by 工廠編號、特殊採購編號)]
  factoryNo:			工廠編號
  spProcurementNo:	特殊採購編號

  #2023-01-17 Create by Mars
*/
function GetSPProcurementBySPProcurementNo(factoryNo, spProcurementNo) {
  var spProcurement = null;

  if (factoryNo != "" && spProcurementNo != "") {
    var spProcurementList = GetSPProcurementProcedure(factoryNo, spProcurementNo);
    if (spProcurementList.length > 0) {
      spProcurement = spProcurementList[0];
    }
  }

  return spProcurement;
}

/*
  [取得特殊採購程式(非Publish)]
  factoryNo:			工廠編號
  spProcurementNo:	特殊採購編號

  #2023-01-17 Create by Mars
*/
function GetSPProcurementProcedure(factoryNo, spProcurementNo) {
  var spProcurementList = [];

  var sql =
    " SELECT SPProcurementNo, SPProcurementName, FactoryNo, ProcurementTypeNo, SPProcurementTypeNo, SPFactoryNo" +
    " FROM MD_S_SPProcurement (NOLOCK)" +
    " WHERE 1 = 1";
  var args = [];

  if (factoryNo != "") {
    sql += " AND FactoryNo = ?";
    args.push(factoryNo);
  }
  if (spProcurementNo != "") {
    sql += " AND SPProcurementNo = ?";
    args.push(spProcurementNo);
  }

  sql += " ORDER BY FactoryNo, SPProcurementNo";

  var dtSPProcurement = GetDataWithArgs(sql, args);
  if (dtSPProcurement != null) {
    for (var i = 0; i < dtSPProcurement.size(); i++) {
      var dr = dtSPProcurement.get(i);

      var spProcurement = {};
      spProcurement.SPProcurementNo = dr.get("SPProcurementNo");
      spProcurement.SPProcurementName = dr.get("SPProcurementName");
      spProcurement.FactoryNo = dr.get("FactoryNo");
      spProcurement.ProcurementTypeNo = dr.get("ProcurementTypeNo");
      spProcurement.SPProcurementTypeNo = dr.get("SPProcurementTypeNo");
      spProcurement.SPFactoryNo = dr.get("SPFactoryNo");

      spProcurementList.push(spProcurement);
    }
  }

  return spProcurementList;
}

/*
  [取得所有物料]
  usableFlag:	是否有效
	
  #2023-01-06 Create by Mars
*/
function GetSMaterial(usableFlag) {
  return GetSMaterialProcedure("", "", "", "", usableFlag);
}

/*
  [取得物料(by 物料小類)]
  materialCategory3No:	物料小類
  usableFlag:				是否有效

  #2023-01-06 Create by Mars
*/
function GetSMaterialByMaterialCategory3No(materialCategory3No, usableFlag) {
  var materialList = [];

  if (materialCategory3No != "") {
    materialList = GetSMaterialProcedure("", materialCategory3No, "", "", usableFlag);
  }

  return materialList;
}

/*
  [取得物料(by 物料類型)]
  materialClassNo:	物料類型
  usableFlag:			是否有效

  #2023-01-06 Create by Mars
*/
function GetSMaterialByMaterialClassNo(materialClassNo, usableFlag) {
  var materialList = [];

  if (materialClassNo != "") {
    materialList = GetSMaterialProcedure("", "", "", materialClassNo, usableFlag);
  }

  return materialList;
}

/*
  [取得物料(by 物料編號)]
  materialNo:	物料編號
  usableFlag:	是否有效

  #2023-01-06 Create by Mars
*/
function GetSMaterialByMaterialNo(materialNo, usableFlag) {
  var material = null;

  if (materialNo != "") {
    var materialList = GetSMaterialProcedure(materialNo, "", "", "", usableFlag);
    if (materialList.length > 0) {
      material = materialList[0];
    }
  }

  return material;
}

/*
  [取得物料程式(非Publish)]
  materialNo:				物料編號
  materialCategory3No:	物料小類
  magerialStatusNo:		跨廠物料狀態
  materialClassNo:		物料類型
  usableFlag:				是否有效

  #2023-01-11 Create by Mars
*/
function GetSMaterialProcedure(materialNo, materialCategory3No, materialStatusNo, materialClassNo, usableFlag) {
  var materialList = [];

  var sql =
    " SELECT MaterialNo, MaterialName, MaterialCategory3No, MaterialStatusNo, MaterialClassNo, UnitNo, NormalGRPNo, CompartmentNo, Spec" +
    " FROM MD_S_Material (NOLOCK)" +
    " WHERE 1 = 1";
  var args = [];

  if (materialNo != "") {
    sql += " AND MaterialNo = ?";
    args.push(materialNo);
  }
  if (materialCategory3No != "") {
    sql += " AND MaterialCategory3No = ?";
    args.push(materialCategory3No);
  }
  if (materialStatusNo != "") {
    sql += " AND MaterialStatusNo = ?";
    args.push(materialStatusNo);
  }
  if (materialClassNo != "") {
    sql += " AND MaterialClassNo = ?";
    args.push(materialClassNo);
  }
  if (usableFlag != null) {
    if (usableFlag) {
      sql += " AND MaterialStatusNo NOT IN ('01', '99')";
    }
    else {
      sql += " AND MaterialStatusNo IN ('01', '99')";
    }
  }

  sql += " ORDER BY MaterialNo";

  var dtMaterial = GetDataWithArgs(sql, args);
  if (dtMaterial != null) {
    for (var i = 0; i < dtMaterial.size(); i++) {
      var dr = dtMaterial.get(i);

      var material = {};
      material.MaterialNo = dr.get("MaterialNo");
      material.MaterialName = dr.get("MaterialName");
      material.MaterialCategory3No = dr.get("MaterialCategory3No");
      material.MaterialStatusNo = dr.get("MaterialStatusNo");
      material.MaterialClassNo = dr.get("MaterialClassNo");
      material.UnitNo = dr.get("UnitNo");
      material.NormalGRPNo = dr.get("NormalGRPNo");
      material.CompartmentNo = dr.get("CompartmentNo");
      material.Spec = dr.get("Spec");

      materialList.push(material);
    }
  }

  return materialList;
}

/*
  [取得物料工廠(by 物料編號)]
  materialNo:	物料編號

  #2023-01-11 Create by Mars
*/
function GetSMaterialFactoryByMaterialNo(materialNo) {
  var materialFactoryList = [];

  if (materialNo != "") {
    materialFactoryList = GetSMaterialFactoryProcedure(materialNo, "", "", "");
  }

  return materialFactoryList;
}

/*
  [取得物料工廠(by 物料編號、工廠編號)]
  materialNo:	物料編號
  factoryNo:	工廠編號

  #2023-01-11 Create by Mars
*/
function GetSMaterialFactoryByFactoryNo(materialNo, factoryNo) {
  var materialFactory = null;

  if (materialNo != "" && factoryNo != "") {
    var materialFactoryList = GetSMaterialFactoryProcedure(materialNo, factoryNo, "", "");
    if (materialFactoryList.length > 0) {
      materialFactory = materialFactoryList[0];
    }
  }

  return materialFactory;
}

/*
  [取得物料工廠程式(非Publish)]
  materialNo:		物料編號
  factoryNo:		工廠編號
  loadingNo:		裝載群組編號
  availabilityNo:	跨廠物料狀態

  #2023-01-11 Create by Mars
*/
function GetSMaterialFactoryProcedure(materialNo, factoryNo, loadingNo, availabilityNo) {
  var materialFactoryList = [];

  var sql =
    " SELECT MaterialNo, FactoryNo, LoadingNo, AvailabilityNo" +
    " FROM MD_S_MaterialFactory (NOLOCK)" +
    " WHERE 1 = 1";
  var args = [];

  if (materialNo != "") {
    sql += " AND MaterialNo = ?";
    args.push(materialNo);
  }
  if (factoryNo != "") {
    sql += " AND FactoryNo = ?";
    args.push(factoryNo);
  }
  if (loadingNo != "") {
    sql += " AND LoadingNo = ?";
    args.push(loadingNo);
  }
  if (availabilityNo != "") {
    sql += " AND AvailabilityNo = ?";
    args.push(availabilityNo);
  }

  sql += " ORDER BY MaterialNo, FactoryNo";

  var dtMaterialFactory = GetDataWithArgs(sql, args);
  if (dtMaterialFactory != null) {
    for (var i = 0; i < dtMaterialFactory.size(); i++) {
      var dr = dtMaterialFactory.get(i);

      var materialFactory = {};
      materialFactory.MaterialNo = dr.get("MaterialNo");
      materialFactory.FactoryNo = dr.get("FactoryNo");
      materialFactory.LoadingNo = dr.get("LoadingNo");
      materialFactory.AvailabilityNo = dr.get("AvailabilityNo");

      materialFactoryList.push(materialFactory);
    }
  }

  return materialFactoryList;
}

/*
  [取得物料儲存地點(by 物料編號)]
  materialNo:	物料編號

  #2023-01-11 Create by Mars
*/
function GetMaterialStorageByMaterialNo(materialNo) {
  var materialStorageList = [];

  if (materialNo != "") {
    materialStorageList = GetMaterialStorageProcedure(materialNo, "", "");
  }

  return materialStorageList;
}

/*
  [取得物料儲存地點(by 物料編號、工廠編號)]
  materialNo:	物料編號
  factoryNo:	工廠編號

  #2023-01-11 Create by Mars
*/
function GetMaterialStorageByFactoryNo(materialNo, factoryNo) {
  var materialStorageList = [];

  if (materialNo != "" && factoryNo != "") {
    materialStorageList = GetMaterialStorageProcedure(materialNo, factoryNo, "");
  }

  return materialStorageList;
}

/*
  [取得物料儲存地點(by 物料編號、工廠編號、儲存地點編號)]
  materialNo:	物料編號
  factoryNo:	工廠編號
  storageNo:	儲存地點編號

  #2023-01-11 Create by Mars
*/
function GetMaterialStorageByStorageNo(materialNo, factoryNo, storageNo) {
  var materialStorage = null;

  if (materialNo != "" && factoryNo != "" && storageNo != "") {
    var materialStorageList = GetMaterialStorageProcedure(materialNo, factoryNo, storageNo);
    if (materialStorageList.length > 0) {
      materialStorage = materialStorageList[0];
    }
  }

  return materialStorage;
}

/*
  [取得物料儲存地點程式(非Publish)]
  materialNo:	物料編號
  factoryNo:	工廠編號
  storageNo:	儲存地點編號

  #2023-01-11 Create by Mars
*/
function GetMaterialStorageProcedure(materialNo, factoryNo, storageNo) {
  var materialStorageList = [];

  var sql =
    " SELECT MaterialNo, FactoryNo, StorageNo" +
    " FROM MD_S_MaterialStorage (NOLOCK)" +
    " WHERE 1 = 1";
  var args = [];

  if (materialNo != "") {
    sql += " AND MaterialNo = ?";
    args.push(materialNo);
  }
  if (factoryNo != "") {
    sql += " AND FactoryNo = ?";
    args.push(factoryNo);
  }
  if (storageNo != "") {
    sql += " AND StorageNo = ?";
    args.push(storageNo);
  }

  sql += " ORDER BY MaterialNo, FactoryNo, StorageNo";

  var dtMaterialStorage = GetDataWithArgs(sql, args);
  if (dtMaterialStorage != null) {
    for (var i = 0; i < dtMaterialStorage.size(); i++) {
      var dr = dtMaterialStorage.get(i);

      var materialStorage = {};
      materialStorage.MaterialNo = dr.get("MaterialNo");
      materialStorage.FactoryNo = dr.get("FactoryNo");
      materialStorage.StorageNo = dr.get("StorageNo");

      materialStorageList.push(materialStorage);
    }
  }

  return materialStorageList;
}

/*
  [取得物料銷售組織(by 物料編號)]
  materialNo:	物料編號

  #2023-01-11 Create by Mars
*/
function GetMaterialSalesOrgByMaterialNo(materialNo) {
  var materialSalesOrgList = [];

  if (materialNo != "") {
    materialSalesOrgList = GetMaterialSalesOrgProcedure(materialNo, "", "");
  }

  return materialSalesOrgList;
}

/*
  [取得物料銷售組織(by 物料編號、銷售組織、配銷通路)]
  materialNo:	物料編號
  salesOrgNo:	銷售組織編號
  channelNo:	配銷通路編號

  #2023-01-11 Create by Mars
*/
function GetMaterialSalesOrgBySalesOrgNo(materialNo, salesOrgNo, channelNo) {
  var materialSalesOrg = null;

  if (materialNo != "" && salesOrgNo != "" && channelNo != "") {
    var materialSalesOrgList = GetMaterialSalesOrgProcedure(materialNo, salesOrgNo, channelNo);
    if (materialSalesOrgList.length > 0) {
      materialSalesOrg = materialSalesOrgList[0];
    }
  }

  return materialSalesOrg;
}

/*
  [取得物料銷售組織程式(非Publish)]
  materialNo:	物料編號
  salesOrgNo:	銷售組織編號
  channelNo:	配銷通路編號

  #2023-01-11 Create by Mars
*/
function GetMaterialSalesOrgProcedure(materialNo, salesOrgNo, channelNo) {
  var materialSalesOrgList = [];

  var sql =
    " SELECT MaterialNo, SalesOrgNo, ChannelNo, NormalGRPNo, MaterialType1No, MaterialType2No" +
    " FROM MD_S_MaterialSalesOrg (NOLOCK)" +
    " WHERE 1 = 1";
  var args = [];

  if (materialNo != "") {
    sql += " AND MaterialNo = ?";
    args.push(materialNo);
  }
  if (salesOrgNo != "") {
    sql += " AND SalesOrgNo = ?";
    args.push(salesOrgNo);
  }
  if (channelNo != "") {
    sql += " AND ChannelNo = ?";
    args.push(channelNo);
  }

  sql += " ORDER BY MaterialNo, SalesOrgNo, ChannelNo";

  var dtMaterialSalesOrg = GetDataWithArgs(sql, args);
  if (dtMaterialSalesOrg != null) {
    for (var i = 0; i < dtMaterialSalesOrg.size(); i++) {
      var dr = dtMaterialSalesOrg.get(i);

      var materialSalesOrg = {};
      materialSalesOrg.MaterialNo = dr.get("MaterialNo");
      materialSalesOrg.SalesOrgNo = dr.get("SalesOrgNo");
      materialSalesOrg.ChannelNo = dr.get("ChannelNo");
      materialSalesOrg.NormalGRPNo = dr.get("NormalGRPNo");
      materialSalesOrg.MaterialType1No = dr.get("MaterialType1No");
      materialSalesOrg.MaterialType2No = dr.get("MaterialType2No");

      materialSalesOrgList.push(materialSalesOrg);
    }
  }

  return materialSalesOrgList;
}

/*
  [取得物料計量單位(by 物料編號)]
  materialNo:	物料編號

  #2023-01-11 Create by Mars
*/
function GetMaterialUnitByMaterialNo(materialNo) {
  var materialUnitList = [];

  if (materialNo != "") {
    materialUnitList = GetMaterialUnitProcedure(materialNo, "");
  }

  return materialUnitList;
}

/*
  [取得物料計量單位(by 物料編號、單位編號)]
  materialNo:	物料編號
  unitNo_A:	物料編號

  #2023-01-11 Create by Mars
*/
function GetMaterialUnitByUnitNo(materialNo, unitNo_A) {
  var materialUnit = null;

  if (materialNo != "" && unitNo_A != "") {
    var materialUnitList = GetMaterialUnitProcedure(materialNo, unitNo_A);
    if (materialUnitList.length > 0) {
      materialUnit = materialUnitList[0];
    }
  }

  return materialUnit;
}

/*
  [取得物料計量單位程式(非Publish)]
  materialNo:	物料編號
  unitNo_A:	物料編號

  #2023-01-11 Create by Mars
*/
function GetMaterialUnitProcedure(materialNo, unitNo_A) {
  var materialUnitList = [];

  var sql =
    " SELECT MU.MaterialNo, MU.Amt_A, MU.UnitNo_A, U1.UnitName_3 AS UnitName_A, MU.Amt_B, M.UnitNo AS UnitNo_B, U2.UnitName_3 AS UnitName_B" +
    " FROM MD_S_MaterialUnit MU (NOLOCK)" +
    " INNER JOIN MD_S_Material M (NOLOCK) ON M.MaterialNo = MU.MaterialNo" +
    " INNER JOIN MD_S_Unit U1 (NOLOCK) ON U1.UnitNo = MU.UnitNo_A" +
    " INNER JOIN MD_S_Unit U2 (NOLOCK) ON U2.UnitNo = M.UnitNo" +
    " WHERE 1 = 1";
  var args = [];

  if (materialNo != "") {
    sql += " AND MU.MaterialNo = ?";
    args.push(materialNo);
  }
  if (unitNo_A != "") {
    sql += " AND MU.UnitNo_A = ?";
    args.push(unitNo_A);
  }

  sql += " ORDER BY U1.UnitName_3";

  var dtMaterialUnit = GetDataWithArgs(sql, args);
  if (dtMaterialUnit != null) {
    for (var i = 0; i < dtMaterialUnit.size(); i++) {
      var dr = dtMaterialUnit.get(i);

      var materialUnit = {};
      materialUnit.MaterialNo = dr.get("MaterialNo");
      materialUnit.Amt_A = dr.get("Amt_A");
      materialUnit.UnitNo_A = dr.get("UnitNo_A");
      materialUnit.UnitName_A = dr.get("UnitName_A");
      materialUnit.Amt_B = dr.get("Amt_B");
      materialUnit.UnitNo_B = dr.get("UnitNo_B");
      materialUnit.UnitName_B = dr.get("UnitName_B");

      materialUnitList.push(materialUnit);
    }
  }

  return materialUnitList;
}

/*
  [取得物料售價(by 條件類型編號、銷售組織編號、配銷通路編號、價目表類型編號(選)、客戶編號(選)、物料編號、生效日期(選))]
  conditionTypeNo:	條件類型編號
  salesOrgNo:			銷售組織編號
  channelNo:			配銷通路編號
  priceListTypeNo:	價目表類型編號
  customerNo:			客戶編號
  materialNo:			物料編號
  startDate:			生效日期

  #2023-01-12 Create by Mars
*/
function GetMaterialPriceByMaterialNo(conditionTypeNo, salesOrgNo, channelNo, priceListTypeNo, customerNo, materialNo, startDate) {
  var materialPriceList = [];

  if (conditionTypeNo != "" && salesOrgNo != "" && channelNo != "" && materialNo != "") {
    materialPriceList = GetMaterialPriceProcedure(conditionTypeNo, salesOrgNo, channelNo, priceListTypeNo, customerNo, materialNo, startDate);
  }

  return materialPriceList;
}

/*
  [取得物料售價程式(非Publish)]
  conditionTypeNo:	條件類型編號
  salesOrgNo:			銷售組織編號
  channelNo:			配銷通路編號
  priceListTypeNo:	價目表類型編號
  customerNo:			客戶編號
  materialNo:			物料編號
  startDate:			生效日期

  #2023-01-12 Create by Mars
*/
function GetMaterialPriceProcedure(conditionTypeNo, salesOrgNo, channelNo, priceListTypeNo, customerNo, materialNo, startDate) {
  var materialPriceList = [];

  var sql =
    " SELECT MP.PriceId, MP.ConditionTypeNo, CT.ConditionTypeName, MP.SalesOrgNo, SO.SalesOrgName, MP.ChannelNo, CN.ChannelName, MP.PriceListTypeNo, PLT.PriceListTypeName," +
    " MP.CustomerNo, CM.CustomerName, MP.MaterialNo, M.MaterialName, MP.StartDate, MP.EndDate, MP.Amt, MP.UnitNo, U1.UnitName_3 AS UnitName, MP.Price," +
    " CASE WHEN ISNULL(MP.Amt, 0) > 0 THEN CONVERT(DECIMAL(17, 5), MP.Price / MP.Amt) ELSE 0 END AS UnitPrice," +
    " MP.PriceCurrencyNo AS CurrencyNo, CC.CurrencyName_L AS CurrencyName," +
    " CASE WHEN ISNULL(Amt_B, 0) > 0 THEN CONVERT(DECIMAL(11, 2), CONVERT(FLOAT, MU.Amt_B) / CONVERT(FLOAT, MU.Amt_A)) ELSE 0 END AS BasicConvertValue," +
    " M.UnitNo AS UnitNo_Basic, U2.UnitName_3 AS UnitName_Basic, M.Spec," +
    " MSO.MaterialType1No, MT1.MaterialType1Name, MSO.MaterialType2No, MT2.MaterialType2Name," +
    " CASE MP.PriceTypeNo WHEN '001' THEN 1 ELSE 0 END AS NewFlag" +
    " FROM MD_S_MaterialPrice MP (NOLOCK)" +
    " INNER JOIN MD_S_ConditionType CT (NOLOCK) ON CT.ConditionTypeNo = MP.ConditionTypeNo" +
    " INNER jOIN MD_S_SalesOrg SO (NOLOCK) ON SO.SalesOrgNo = MP.SalesOrgNo" +
    " INNER JOIN MD_S_Channel CN (NOLOCK) ON CN.ChannelNo = MP.ChannelNo" +
    " INNER JOIN MD_S_Material M (NOLOCK) ON M.MaterialNo = MP.MaterialNo" +
    " INNER JOIN MD_S_Unit U1 (NOLOCK) ON U1.UnitNo = MP.UnitNo" +
    " INNER JOIN MD_S_Unit U2 (NOLOCK) ON U2.UnitNo = M.UnitNo" +
    " INNER JOIN MD_S_MaterialUnit MU (NOLOCK) ON MU.MaterialNo = MP.MaterialNo AND MU.UnitNo_A = MP.UnitNo" +
    " INNER JOIN MD_S_Currency CC (NOLOCK) ON CC.CurrencyNo = MP.PriceCurrencyNo" +
    " INNER JOIN MD_S_MaterialSalesOrg MSO (NOLOCK) ON MSO.MaterialNo = MP.MaterialNo AND MSO.SalesOrgNo = MP.SalesOrgNo AND MSO.ChannelNo = MP.ChannelNo" +
    " LEFT JOIN MD_S_PriceListType PLT (NOLOCK) ON PLT.PriceListTypeNo = MP.PriceListTypeNo" +
    " LEFT JOIN MD_S_Customer CM (NOLOCK) ON CM.CustomerNo = MP.CustomerNo" +
    " LEFT JOIN MD_S_MaterialType1 MT1 (NOLOCK) ON MT1.MaterialType1No = MSO.MaterialType1No" +
    " LEFT JOIN MD_S_MaterialType2 MT2 (NOLOCK) ON MT2.MaterialType2No = MSO.MaterialType2No" +
    " WHERE 1 = 1";
  var args = [];

  if (conditionTypeNo != "") {
    sql += " AND MP.ConditionTypeNo = ?";
    args.push(conditionTypeNo);
  }
  if (salesOrgNo != "") {
    sql += " AND MP.SalesOrgNo = ?";
    args.push(salesOrgNo);
  }
  if (channelNo != "") {
    sql += " AND MP.ChannelNo = ?";
    args.push(channelNo);
  }
  if (priceListTypeNo != "") {
    sql += " AND MP.PriceListTypeNo = ?";
    args.push(priceListTypeNo);
  }
  if (customerNo != "") {
    sql += " AND MP.CustomerNo = ?";
    args.push(customerNo);
  }
  if (materialNo != "") {
    sql += " AND MP.MaterialNo = ?";
    args.push(materialNo);
  }
  if (startDate != null) {
    sql += " AND MP.StartDate <= ?";
    args.push(startDate);
  }

  sql += " ORDER BY MP.ConditionTypeNo, MP.SalesOrgNo, MP.ChannelNo, MP.PriceListTypeNo, MP.CustomerNo, MP.MaterialNo, MP.StartDate";

  var dtMaterialPrice = GetDataWithArgs(sql, args);
  if (dtMaterialPrice != null) {
    for (var i = 0; i < dtMaterialPrice.size(); i++) {
      var dr = dtMaterialPrice.get(i);

      var materialPrice = {};
      materialPrice.PriceId = dr.get("PriceId");
      materialPrice.ConditionTypeNo = dr.get("ConditionTypeNo");
      materialPrice.ConditionTypeName = dr.get("ConditionTypeName");
      materialPrice.SalesOrgNo = dr.get("SalesOrgNo");
      materialPrice.SalesOrgName = dr.get("SalesOrgName");
      materialPrice.ChannelNo = dr.get("ChannelNo");
      materialPrice.ChannelName = dr.get("ChannelName");
      materialPrice.PriceListTypeNo = dr.get("PriceListTypeNo");
      materialPrice.PriceListTypeName = dr.get("PriceListTypeName");
      materialPrice.CustomerNo = dr.get("CustomerNo");
      materialPrice.CustomerName = dr.get("CustomerName");
      materialPrice.MaterialNo = dr.get("MaterialNo");
      materialPrice.MaterialName = dr.get("MaterialName");
      materialPrice.StartDate = dr.get("StartDate");
      materialPrice.EndDate = dr.get("EndDate");
      materialPrice.Amt = dr.get("Amt");
      materialPrice.UnitNo = dr.get("UnitNo");
      materialPrice.UnitName = dr.get("UnitName");
      materialPrice.Price = dr.get("Price");
      materialPrice.UnitPrice = dr.get("UnitPrice");
      materialPrice.CurrencyNo = dr.get("CurrencyNo");
      materialPrice.CurrencyName = dr.get("CurrencyName");
      materialPrice.BasicConvertValue = dr.get("BasicConvertValue");
      materialPrice.UnitNo_Basic = dr.get("UnitNo_Basic");
      materialPrice.UnitName_Basic = dr.get("UnitName_Basic");
      materialPrice.Spec = dr.get("Spec");
      materialPrice.MaterialType1No = dr.get("MaterialType1No");
      materialPrice.MaterialType1Name = dr.get("MaterialType1Name");
      materialPrice.MaterialType2No = dr.get("MaterialType2No");
      materialPrice.MaterialType2Name = dr.get("MaterialType2Name");
      materialPrice.NewFlag = dr.get("NewFlag");

      materialPriceList.push(materialPrice);
    }
  }

  return materialPriceList;
}

/*
  [取得客戶銷售組織(by 客戶編號、是否有效)]
  customerNo:		客戶編號
  usableFlag:		是否有效

  #2023-01-12 Create by Mars
*/
function GetCustomerSalesOrgByCustomerNo(customerNo, usableFlag) {
  var customerSalesOrgList = [];

  if (customerNo != "") {
    customerSalesOrgList = GetCustomerSalesOrgProcedure(customerNo, "", "", "", usableFlag);
  }

  return customerSalesOrgList;
}

/*
  [取得客戶銷售組織(by 客戶編號、銷售組織編號、配銷通路編號、部門編號、是否有效)]
  customerNo:		客戶編號
  salesOrgNo:		銷售組織編號
  channelNo:		配銷通路編號
  departmentNo:	部門編號
  usableFlag:		是否有效

  #2023-01-12 Create by Mars
*/
function GetCustomerSalesOrgBySalesOrgNo(customerNo, salesOrgNo, channelNo, departmentNo, usableFlag) {
  var customerSalesOrg = null;

  if (customerNo != "" && salesOrgNo != "" && channelNo != "" && departmentNo != "") {
    var customerSalesOrgList = GetCustomerSalesOrgProcedure(customerNo, salesOrgNo, channelNo, departmentNo, usableFlag);
    if (customerSalesOrgList.length > 0) {
      customerSalesOrg = customerSalesOrgList[0];
    }
  }

  return customerSalesOrg;
}

/*
  [取得客戶銷售組織程式(非Publish)]
  customerNo:		客戶編號
  salesOrgNo:		銷售組織編號
  channelNo:		配銷通路編號
  departmentNo:	部門編號
  usableFlag:		是否有效

  #2023-01-12 Create by Mars
*/
function GetCustomerSalesOrgProcedure(customerNo, salesOrgNo, channelNo, departmentNo, usableFlag) {
  var customerSalesOrgList = [];

  var sql =
    " SELECT CustomerNo, SalesOrgNo, ChannelNo, DepartmentNo, SalesOfficeNo, FactoryNo, CurrencyNo, DeleteFlag, BlockCode" +
    " FROM MD_S_CustomerSalesOrg (NOLOCK)" +
    " WHERE 1 = 1";
  var args = [];

  if (customerNo != "") {
    sql += " AND CustomerNo = ?";
    args.push(customerNo);
  }
  if (salesOrgNo != "") {
    sql += " AND SalesOrgNo = ?";
    args.push(salesOrgNo);
  }
  if (channelNo != "") {
    sql += " AND ChannelNo = ?";
    args.push(channelNo);
  }
  if (departmentNo != "") {
    sql += " AND DepartmentNo = ?";
    args.push(departmentNo);
  }
  if (usableFlag != null) {
    if (usableFlag) {
      sql += " AND (DeleteFlag <> 'X' AND BlockCode = '')";
    }
    else {
      sql += " AND (DeleteFlag = 'X' OR BlockCode <> '')";
    }
  }

  sql += " ORDER BY CustomerNo, SalesOrgNo, ChannelNo, DepartmentNo";

  var dtCustomerSalesOrg = GetDataWithArgs(sql, args);
  if (dtCustomerSalesOrg != null) {
    for (var i = 0; i < dtCustomerSalesOrg.size(); i++) {
      var dr = dtCustomerSalesOrg.get(i);

      var customerSalesOrg = {};
      customerSalesOrg.CustomerNo = dr.get("CustomerNo");
      customerSalesOrg.SalesOrgNo = dr.get("SalesOrgNo");
      customerSalesOrg.ChannelNo = dr.get("ChannelNo");
      customerSalesOrg.DepartmentNo = dr.get("DepartmentNo");
      customerSalesOrg.SalesOfficeNo = dr.get("SalesOfficeNo");
      customerSalesOrg.FactoryNo = dr.get("FactoryNo");
      customerSalesOrg.CurrencyNo = dr.get("CurrencyNo");
      customerSalesOrg.DeleteFlag = dr.get("DeleteFlag");
      customerSalesOrg.BlockCode = dr.get("BlockCode");

      customerSalesOrgList.push(customerSalesOrg);
    }
  }

  return customerSalesOrgList;
}

/*
  [取得所有銷售據點]

  #2023-01-12 Create by Mars
*/
function GetSalesOffice() {
  return GetSalesOfficeProcedure("");
}

/*
  [取得銷售據點(by 銷售據點編號)]
  salesOfficeNo:	銷售據點編號

  #2023-01-12 Create by Mars
*/
function GetSalesOfficeBySalesOfficeNo(salesOfficeNo) {
  var salesOffice = null;

  if (salesOfficeNo != "") {
    var salesOfficeList = GetSalesOfficeProcedure(salesOfficeNo);
    if (salesOfficeList.length > 0) {
      salesOffice = salesOfficeList[0];
    }
  }

  return salesOffice;
}

/*
  [取得銷售據點程式(非Publish)]
  salesOfficeNo:	銷售據點編號

  #2023-01-12 Create by Mars
*/
function GetSalesOfficeProcedure(salesOfficeNo) {
  var salesOfficeList = [];

  var sql =
    " SELECT SalesOfficeNo, SalesOfficeName" +
    " FROM MD_S_SalesOffice (NOLOCK)" +
    " WHERE 1 = 1";
  var args = [];

  if (salesOfficeNo != "") {
    sql += " AND SalesOfficeNo = ?";
    args.push(salesOfficeNo);
  }

  sql += " ORDER BY SalesOfficeNo";

  var dtSalesOffice = GetDataWithArgs(sql, args);
  if (dtSalesOffice != null) {
    for (var i = 0; i < dtSalesOffice.size(); i++) {
      var dr = dtSalesOffice.get(i);

      var salesOffice = {};
      salesOffice.SalesOfficeNo = dr.get("SalesOfficeNo");
      salesOffice.SalesOfficeName = dr.get("SalesOfficeName");

      salesOfficeList.push(salesOffice);
    }
  }

  return salesOfficeList;
}

/*
  [取得客戶銷售組織(by 銷售組織編號、配銷通路編號、部門編號)]
  salesOrgNo:		銷售組織編號
  channelNo:		配銷通路編號
  departmentNo:	部門編號

  #2023-01-16 Create by Mars
*/
function GetSalesOrgOfficeBySalesOrgNo(salesOrgNo, channelNo, departmentNo) {
  var salesOrgOfficeList = [];

  if (salesOrgNo != "" && channelNo != "" && departmentNo != "") {
    salesOrgOfficeList = GetSalesOrgOfficeProcedure(salesOrgNo, channelNo, departmentNo);
  }

  return salesOrgOfficeList;
}

/*
  [取得銷售組織據點程式(非Publish)]
  salesOrgNo:		銷售組織編號
  channelNo:		配銷通路編號
  departmentNo:	部門編號

  #2023-01-16 Create by Mars
*/
function GetSalesOrgOfficeProcedure(salesOrgNo, channelNo, departmentNo) {
  var salesOrgOfficeList = [];

  var sql =
    " SELECT SalesOrgNo, ChannelNo, DepartmentNo, SalesOfficeNo" +
    " FROM MD_S_SalesOrgOffice (NOLOCK)" +
    " WHERE 1 = 1";
  var args = [];

  if (salesOrgNo != "") {
    sql += " AND SalesOrgNo = ?";
    args.push(salesOrgNo);
  }
  if (channelNo != "") {
    sql += " AND ChannelNo = ?";
    args.push(channelNo);
  }
  if (departmentNo != "") {
    sql += " AND DepartmentNo = ?";
    args.push(departmentNo);
  }

  sql += " ORDER BY SalesOrgNo, ChannelNo, DepartmentNo, SalesOfficeNo";

  var dtSalesOrgOffice = GetDataWithArgs(sql, args);
  if (dtSalesOrgOffice != null) {
    for (var i = 0; i < dtSalesOrgOffice.size(); i++) {
      var dr = dtSalesOrgOffice.get(i);

      var salesOrgOffice = {};
      salesOrgOffice.SalesOrgNo = dr.get("SalesOrgNo");
      salesOrgOffice.ChannelNo = dr.get("ChannelNo");
      salesOrgOffice.DepartmentNo = dr.get("DepartmentNo");
      salesOrgOffice.SalesOfficeNo = dr.get("SalesOfficeNo");

      salesOrgOfficeList.push(salesOrgOffice);
    }
  }

  return salesOrgOfficeList;
}

/*
  [取得業務夥伴住址(by 業務夥伴編號)]
  bpNo:	業務夥伴編號

  #2023-01-16 Create by Mars
*/
function GetBPAddressByBPNo(bpNo) {
  var bpAddressList = [];

  if (bpNo != "") {
    bpAddressList = GetBPAddressProcedure(bpNo);
  }

  return bpAddressList;
}

/*
  [取得業務夥伴住址程式(非Publish)]
  bpNo:	業務夥伴編號

  #2023-01-16 Create by Mars
*/
function GetBPAddressProcedure(bpNo) {
  var bpAddressList = [];

  var sql =
    " SELECT BPNo, AddressNo, Address" +
    " FROM MD_S_BPAddress (NOLOCK)" +
    " WHERE 1 = 1";
  var args = [];

  if (bpNo != "") {
    sql += " AND BPNo = ?";
    args.push(bpNo);
  }

  sql += " ORDER BY BPNo, AddressNo";

  var dtBPAddress = GetDataWithArgs(sql, args);
  if (dtBPAddress != null) {
    for (var i = 0; i < dtBPAddress.size(); i++) {
      var dr = dtBPAddress.get(i);

      var bpAddress = {};
      bpAddress.BPNo = dr.get("BPNo");
      bpAddress.AddressNo = dr.get("AddressNo");
      bpAddress.Address = dr.get("Address");

      bpAddressList.push(bpAddress);
    }
  }

  return bpAddressList;
}

/*------------------------------------------------------------------------------------------------------------------------------------------------------
  Transaction Data
------------------------------------------------------------------------------------------------------------------------------------------------------*/

/*
  [取得門市出貨資料]
  retailNo:			門市編號
  deliveryDateFrom:	出貨起始日期
  deliveryDateTo:		出貨結束日期
  deliveryType:		出貨類型(D: 出貨；R: 退貨)

  #2021-04-14 Create by Mars
*/
function GetDeliveryNote(retailNo, deliveryDateFrom, deliveryDateTo, deliveryType) {
  return GetDeliveryNoteProcedure(null, retailNo, deliveryDateFrom, deliveryDateTo, deliveryType);
}

/*
  [取得門市出貨資料(by Id)]
  idList:	Id

  #2021-04-27 Create by Mars
*/
function GetDeliveryNoteById(idList) {
  return GetDeliveryNoteProcedure(idList, null, null, null, null);
}

/*
  [取得門市出貨資料程式(非Publish)]
  idList:				Id
  retailNo:			門市編號
  deliveryDateFrom:	出貨起始日期
  deliveryDateTo:		出貨結束日期
  deliveryType:		出貨類型(D: 出貨；R: 退貨)

  #2021-04-27 Create by Mars
*/
function GetDeliveryNoteProcedure(idList, retailNo, deliveryDateFrom, deliveryDateTo, deliveryType) {
  var deliveryNoteList = [];

  var sql =
    " SELECT D.Id, CONVERT(VARCHAR(10), D.DeliveryDate, 111) AS DeliveryDate, D.BPMNo, D.SAPPOType, D.SAPPONo, D.SAPDNNo, CONVERT(VARCHAR(8), D.PriceDate, 112) AS PriceDate, D.MaterialNo, D.MaterialName, D.UnitNo," +
    " D.UnitName, ISNULL(D.UnitCost, 0) AS UnitCost, D.Spec, D.MaterialType1, D.POAmount, D.DeliveryAmount, ISNULL(D.TotalCost, 0) AS TotalCost," +
    " D.Remarks, D.RejectReasonNo, D.RejectReason" +
    " FROM SPO_DeliveryNote D (NOLOCK)" +
    " WHERE 1 = 1" +
    " AND D.MaterialType2 IN ('N', 'E', 'O')";
  var args = [];

  //Id
  var sql_Where_Id = "";
  if (idList != null && idList.length > 0) {
    sql_Where_Id = "'" + idList[0] + "'";
    for (var i = 1; i < idList.length; i++) {
      sql_Where_Id += ", '" + idList[i] + "'";
    }
    sql_Where_Id = " AND D.Id IN (" + sql_Where_Id + ")";
  }

  //門市編號
  var sql_Where_RetailNo = "";
  if (retailNo != null) {
    sql_Where_RetailNo = " AND D.RetailNo = ?";
    args.push(retailNo);
  }

  //出貨日期
  var sql_Where_DeliveryDate = "";
  if (deliveryDateFrom != null && deliveryDateFrom != null) {
    sql_Where_DeliveryDate = " AND D.DeliveryDate BETWEEN ? AND ?";
    args.push(deliveryDateFrom);
    args.push(deliveryDateTo);
  }

  //出貨類型
  var sql_Where_DeliveryType = "";
  if (deliveryType != null) {
    if (deliveryType == "R") {
      sql_Where_DeliveryType = " AND D.SAPPOType IN ('ZRTN')";
    }
    else {
      sql_Where_DeliveryType = " AND D.SAPPOType IN ('ZRO1', 'ZRO2', 'ZRO3')";
    }
  }

  //組裝Sql
  sql = sql +
    sql_Where_Id +
    sql_Where_RetailNo +
    sql_Where_DeliveryDate +
    sql_Where_DeliveryType +
    " AND D.UsableFlag = 1" +
    " ORDER BY D.DeliveryDate, D.MaterialNo";

  var dtDeliveryNote = GetDataWithArgs(sql, args);
  if (dtDeliveryNote != null) {
    for (var i = 0; i < dtDeliveryNote.size(); i++) {
      var dr = dtDeliveryNote.get(i);

      var deliveryNote = {};
      deliveryNote.Id = dr.get("Id");
      deliveryNote.DeliveryDate = dr.get("DeliveryDate");
      deliveryNote.BPMInsId = dr.get("BPMInsId");
      deliveryNote.BPMNo = dr.get("BPMNo");
      deliveryNote.SAPPOType = dr.get("SAPPOType");
      deliveryNote.SAPPONo = dr.get("SAPPONo");
      deliveryNote.SAPDNNo = dr.get("SAPDNNo");
      deliveryNote.PriceDate = dr.get("PriceDate");
      deliveryNote.MaterialNo = dr.get("MaterialNo");
      deliveryNote.MaterialName = dr.get("MaterialName");
      deliveryNote.UnitNo = dr.get("UnitNo");
      deliveryNote.UnitName = dr.get("UnitName");
      deliveryNote.UnitCost = parseFloat(dr.get("UnitCost"));
      deliveryNote.Spec = dr.get("Spec");
      deliveryNote.MaterialType1 = dr.get("MaterialType1");
      deliveryNote.POAmount = parseFloat(dr.get("POAmount"));
      deliveryNote.DeliveryAmount = parseFloat(dr.get("DeliveryAmount"));
      deliveryNote.TotalCost = parseInt(dr.get("TotalCost"));
      deliveryNote.Remark = dr.get("Remark");
      deliveryNote.RejectReasonNo = dr.get("RejectReasonNo");
      deliveryNote.RejectReason = dr.get("RejectReason");

      deliveryNoteList.push(deliveryNote);
    }
  }

  return deliveryNoteList;
}

/*
  [取得門市營收]
  retailNo:		門市編號
  operationYear:	營收年份
  operationMonth:	營收月份

  #2021-04-14 Create by Mars
*/
function GetRetailRevenue(retailNo, operationYear, operationMonth) {
  var retailRevenueList = [];

  if (retailNo != null) {
    var sql =
      " SELECT CONVERT(VARCHAR(10), R.OperationDate, 111) AS OperationDate, R.IndependentCost, R.Revenue" +
      " FROM SPO_RetailRevenue R (NOLOCK)" +
      " WHERE R.RetailNo = ?" +
      " AND YEAR(R.OperationDate) = ?" +
      " AND MONTH(R.OperationDate) = ?" +
      " ORDER BY R.OperationDate";
    var args = [];
    args.push(retailNo);
    args.push(operationYear);
    args.push(operationMonth);

    var dtRetailRevenue = GetDataWithArgs(sql, args);
    if (dtRetailRevenue != null) {
      for (var i = 0; i < dtRetailRevenue.size(); i++) {
        var dr = dtRetailRevenue.get(i);

        var retailRevenue = {};
        retailRevenue.OperationDate = dr.get("OperationDate");
        retailRevenue.IndependentCost = parseInt(dr.get("IndependentCost"));
        retailRevenue.Revenue = parseInt(dr.get("Revenue"));

        retailRevenueList.push(retailRevenue);
      }
    }
  }

  return retailRevenueList;
}

/*
  [若無門市營收資料，則創建門市營收]
  retailNo:		門市編號
  operationYear:	營收年份
  operationMonth:	營收月份
  creator:		創建人員

  #2021-04-14 Create by Mars
*/
function CheckRetailRevenueAndCreate(retailNo, operationYear, operationMonth, creator) {
  var result = false;

  if (retailNo != "" && operationYear != "" && operationMonth != "" && creator != "") {
    var retailRevenueList = GetRetailRevenue(retailNo, operationYear, operationMonth);
    if (retailRevenueList.length > 0) {
      result = true;
    }
    else {
      var context = GetContext();
      try {
        //DB連線
        var conn = context.createSessionConnection("DB_Application");

        var sql = "";
        var myDate = new Packages.pase.agenda.MyDate();
        var operationDate = operationYear + "/" + GetFullMonth(operationMonth) + "/1";
        var endDate = myDate.add(myDate.addMonth(operationDate, 1), -1);
        var days = myDate.getCurrentDay();
        for (var i = 0; i < days; i++) {
          var newDate = myDate.add(operationDate, i);

          sql +=
            " INSERT INTO SPO_RetailRevenue (RetailNo, OperationDate, Creator)" +
            " VALUES ('" + retailNo + "', '" + newDate + "', '" + creator + "')";
        }

        //更新資料表
        if (conn.updateValue(sql)) {
          conn.commit();
          result = true;
        }
      }
      catch (ex) {
        conn.rollback();
        context.addExeLog("資料庫更新失敗:" + ex.message);
        context.addExeLog("Sql=" + sql);
      }
      finally {
        if (conn != null) {
          conn.close();
        }
      }
    }
  }

  return result;
}

/*
  [更新門市營收]
  revenueList:	營收[id, independentCost, revenue]
  updateFlag:		1: 更新自購成本、營收；2: 更新營收
  editor:			更新人員

  #2021-04-14 Create by Mars
*/
function UpdateRetailRevenue(revenueList, updateFlag, editor) {
  var result = false;

  if (revenueList != null && editor != "") {
    var context = GetContext();
    try {
      //DB連線
      var conn = context.createSessionConnection("DB_Application");

      var sql = "";
      for (var i = 0; i < revenueList.length; i++) {
        var revenue = revenueList[i];
        if (revenue != null && revenue.RetailNo != null && revenue.OperationDate != null && revenue.Revenue != null) {
          sql +=
            " UPDATE SPO_RetailRevenue" +
            " SET Revenue = '" + revenue.Revenue + "'";
          if (updateFlag == "1" && revenue.IndependentCost != null) {
            sql += " , IndependentCost = '" + revenue.IndependentCost + "'";
          }
          sql +=
            " , EditTime = GETDATE(), Editor = '" + editor + "'" +
            " WHERE RetailNo = '" + revenue.RetailNo + "' AND OperationDate = '" + revenue.OperationDate + "';";
        }
      }

      //更新資料表
      if (conn.updateValue(sql)) {
        conn.commit();
        result = true;
      }
    }
    catch (ex) {
      conn.rollback();
      context.addExeLog("資料庫更新失敗:" + ex.message);
      context.addExeLog("Sql=" + sql);
    }
    finally {
      if (conn != null) {
        conn.close();
      }
    }
  }

  return result;
}

/*
  [取得所有未離職及3個月內離職員工]

  #2022-09-27 Create by 孟憲
*/
function GetEmployee() {
  return GetEmployeeProcedure("");
}

/*
  [取得所有未離職及3個月內離職員工(by 員工編號)]
  employeeNo:	員工編號

  #2022-09-27 Create by 孟憲
*/
function GetEmployeeByEmployeeNo(employeeNo) {
  var employee = null;

  if (employeeNo != "") {
    var employeeList = GetEmployeeProcedure(employeeNo);
    if (employeeList.length > 0) {
      employee = employeeList[0];
    }
  }
  return employee;
}

/*
  [取得員工程式]
  employeeNo:	員工編號

  #2022-09-27 Create by 孟憲
*/
function GetEmployeeProcedure(employeeNo) {
  var employeeList = [];

  var sql =
    "SELECT * FROM MD_Employee " +
    "WHERE 1 = 1";
  var args = [];

  if (employeeNo != "") {
    sql += " AND EmployeeNo = ?";
    args.push(employeeNo);
  }

  sql += " ORDER BY BrandNo, DepNo";
  var dtEmployee = GetDataWithArgs(sql, args);
  if (dtEmployee != null) {
    for (var i = 0; i < dtEmployee.size(); i++) {
      var dr = dtEmployee.get(i);

      var employee = {};
      employee.BrandNo = dr.get("BrandNo");
      employee.DepNo = dr.get("DepNo");
      employee.DepName = dr.get("DepName");
      employee.RolNo = dr.get("RolNo");
      employee.RolName = dr.get("RolName");
      employee.EmployeeNo = dr.get("EmployeeNo");
      employee.EmployeeName = dr.get("EmployeeName");
      employee.OnBoardDate = dr.get("OnBoardDate");
      employee.ResignDate = dr.get("ResignDate");

      employeeList.push(employee);
    }
  }
  return employeeList;
}
