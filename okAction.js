// Some code
{ALL:
  var formNo = Form.getArtInstance().getMyID();
  var formName = Form.getArtInstance().getName();

  Client.addInfoLog("[" + formName + "] okAction start: " + formNo);

  #include GlobalFunction;
  loadLibrary("SushiExpressScript.Common");

  var task = Form.getCurrentTask();
  var proID = task.getProcessID();

  //申請人關卡
  if ("PRO03041703814440505".equals(proID)) {
    CheckData_Applicant();
  }

  Client.addInfoLog("[" + proID + "] okAction end: " + proID);
}


