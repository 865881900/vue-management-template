//签名拼凑表单原文数据成String
function sign(){
       //提取敏感表单数据，按照特定规则拼凑成字符串作为签名原文
       var data = document.getElementById("bd_a").value;
       data = data+","+document.getElementById("bd_b").value;
       data = data+","+document.getElementById("bd_c").value;
       //alert("签名原文为："+data); 
       var rv=HuncaLogin(data);
       return rv;
  }

function HuncaLogin(data){
	var netonex=new NetONEX();
	netonex.setupObject();
	var rv;
	try{
		rv=netonex.getCertificateCollectionX(); 
	}catch(e){ 
		alert("CA安全控件加载失败，请确保您的IE安全设置已允许加载active控件！");
		return "-6";
    }  
    var gc = null; 
    rv.CF_KeyUsage=0x20;  
    rv.OEM=2;
    rv.CF_Issuer_Contains="湖南";
    var max=rv.Load(); 
    if(max<1){ 
    	alert("对不起，未能获取到数字证书！");
        return "0";
    }else if(max==1){
    	gc=rv.GetAt(0);
    }else{
		gc=rv.SelectCertificateDialog();
    } 
    var result; 
    try{
    	result = gc.PKCS1String(data); 
    	if(null!=result&&undefined!=result&&""!=result){
		   	document.getElementById("ca_cert").value=gc.Content; 
			document.getElementById("ca_sign").value=result;  
	     	return "1"; 
	 	}else{
	 		return "0";
	 	}
    } catch(e){
    	alert("签名失败");
        return "-1";
    }      
}

function HuncaGetSn() {
	var netonex=new NetONEX();
	netonex.setupObject();
	var rv;
	try{
		rv=netonex.getCertificateCollectionX(); 
	} catch (e) {
		return "-6";
	}
	var gc = null;
	rv.CF_KeyUsage = 0x20;
	rv.OEM = 2;
	var max = rv.Load();
	if (max < 1) {
		return "0";
	} else if (max == 1) {
		gc = rv.GetAt(0);
	} else {
		gc = rv.SelectCertificateDialog();
	}
	try{
		return gc.SerialNumberDec;
	}catch(e){
		return "-1";
	}
}

function HuncaGetSubject(){	
	var netonex=new NetONEX();
	netonex.setupObject();
	var rv;
	try{
		rv=netonex.getCertificateCollectionX(); 
	} catch (e) {
		return "-6";
	}
	var gc = null;
	rv.CF_KeyUsage = 0x20;
	rv.OEM = 2;
	var max = rv.Load();
	if (max < 1) {
		return "0";
	} else if (max == 1) {
		gc = rv.GetAt(0);
	} else {
		gc = rv.SelectCertificateDialog();
	}
	try{
		return gc.Subject;
	}catch(e){
		return "-1";
	}     
}

function HuncaGetG(){	
	var netonex=new NetONEX();
	netonex.setupObject();
	var rv;
	try{
		rv=netonex.getCertificateCollectionX(); 
	} catch (e) {
		return "-6";
	}
	var gc = null;
	rv.CF_KeyUsage = 0x20;
	rv.OEM = 2;
	var max = rv.Load();
	if (max < 1) {
		return "0";
	} else if (max == 1) {
		gc = rv.GetAt(0);
	} else {
		gc = rv.SelectCertificateDialog();
	}
	try{
		var numb = gc.Subject.lastIndexOf("G=");
		var str1 = gc.Subject.substring(numb);
		var numb1 = str1.indexOf(",");
		return str1.substring(2,numb1);
	//	document.getElementById('cerG').value=gc.FriendlyName;
	}catch(e){
		return "-1";
	}     
}

function HuncaGetIssuer(){	
	var netonex=new NetONEX();
	netonex.setupObject();
	var rv;
	try{
		rv=netonex.getCertificateCollectionX(); 
	} catch (e) {
		return "-6";
	}
	var gc = null;
	rv.CF_KeyUsage = 0x20;
	rv.OEM = 2;
	var max = rv.Load();
	if (max < 1) {
		return "0";
	} else if (max == 1) {
		gc = rv.GetAt(0);
	} else {
		gc = rv.SelectCertificateDialog();
	}
	try{
		return gc.Issuer;
	}catch(e){
		return "-1";
	}     
}

function HuncaGetCert(){	
	var netonex=new NetONEX();
	netonex.setupObject();
	var rv;
	try{
		rv=netonex.getCertificateCollectionX(); 
	} catch (e) {
		return "-6";
	}
	var gc = null;
	rv.CF_KeyUsage = 0x20;
	rv.OEM = 2;
	var max = rv.Load();
	if (max < 1) {
		return "0";
	} else if (max == 1) {
		try{
			return rv.GetAt(0);
		}catch(e){
			return "-1";
		} 
	} else {
		try{
			return rv.SelectCertificateDialog();
		}catch(e){
			return "-1";
		}
	}   
}

function HuncaSign(data){	 
	var netonex=new NetONEX();
	netonex.setupObject();
	var rv;
	try{
		rv=netonex.getCertificateCollectionX(); 
	}catch(e){ 
		return "-6";
    }  
    var gc = null; 
    rv.CF_KeyUsage=0x20;  
    rv.OEM=2;
    var max=rv.Load(); 
    if(max<1){ 
        return "0";
    }else if(max==1){
    	gc=rv.GetAt(0);
    }else{
		gc=rv.SelectCertificateDialog();
    } 
    var result; 
    try{
    	result = gc.PKCS1String(data); 
    	if(null!=result&&undefined!=result&&""!=result){
	     	return gc;  
	 	}else{
	 		return "0";
	 	}
    } catch(e){
        return "-1";
    }      
}

function HuncaHashFile(filepath){	
	var rv;
	try{
		rv=netonex.CreateHashXInstance(); 
	}catch(e){ 
		return "-6";
    }  
    var filehash; 
    try{
    	filehash = rv.SHA1File(filepath); 
    	if(null!=filehash&&undefined!=dataStr&&""!=dataStr){
	     	return filehash;  
	 	}else{
	 		return "0";
	 	}
    } catch(e){
        return "-1";
    }      
}

function HuncaBase64(data){	
	var rv;
	try{
		rv=netonex.CreateBase64XInstance(); 
	}catch(e){ 
		return "-6";
    }  
    var base64data; 
    try{
    	base64data = rv.EncodeString(data); 
    	if(null!=base64data&&undefined!=base64data&&""!=base64data){
	     	return base64data;  
	 	}else{
	 		return "0";
	 	}
    } catch(e){
        return "-1";
    }      
}

function HuncaDecode(data){	
	var rv;
	try{
		rv=netonex.CreateBase64XInstance(); 
	}catch(e){ 
		return "-6";
    }  
    var dataStr; 
    try{
    	dataStr = rv.DecodeString(data); 
    	if(null!=dataStr&&undefined!=dataStr&&""!=dataStr){
	     	return dataStr;  
	 	}else{
	 		return "0";
	 	}
    } catch(e){
        return "-1";
    }      
}

