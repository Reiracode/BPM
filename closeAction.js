{ALL:
  var formNo = Form.getArtInstance().getMyID();
  var formName = Form.getArtInstance().getName();
  Client.addInfoLog("[" + formName + "] closeFormAction START: " + formNo);
  #include GlobalFunction;


  //	saveAppData();

  Client.addInfoLog("[" + formName + "] closeFormAction END: " + formNo);
}

