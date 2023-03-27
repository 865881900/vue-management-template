/**===================================================
 * Copyright(C) gzca.cc
 * Author: yangjiafeng
 * Updated Date: 2019.02.21
 * Version: 1.3
 * Description: 浏览器和GZCA数字证书客户端基于WebSocket通信
 *====================================================*/
var casocket = null;
window.GZCA = {
  socket: null,
  success: false,
  connect: false,
  first: false,
  init: function(callback) {

		if(!this.success) {
			var websoketUrl, www_url = window.location.href;
			www_url.split('://')[0] === 'https' ? websoketUrl = 'wss://localhost:19528' : websoketUrl = 'ws://localhost:9527';
			try {
				if(casocket){
					this.socket = casocket;
					this.success = true;
					this.connect = true;
					this.first = true;
					callback(this.success);
				} else {
					WebSocket.close; // 连接前先关闭
					this.socket = new WebSocket(websoketUrl);
					casocket = this.socket;
					var self = this;
					this.socket.onerror = function(event) {
						self.success = false;
						if (!self.first) {
							alert('客户端未运行');
						} else {
							self.reconnect();
						}
					};
					this.socket.onopen = function(event) {
						console.log('WebSocket已成功连接');
						if (!self.first) {
							self.first = true;
						}
						self.onOpen(callback);
					};
					this.socket.onclose = function(event) {
						console.log('WebSocket未连接');
						self.success = false;
						self.connect = false;
					};
					this.socket.onmessage = function(msg) {
						self.connect = true; // 拿到任何消息都说明当前连接是正常的
					};
				}
			} catch (error) {
				console.log(error)
				this.reconnect();
			}
		} else {
			this.onOpen(callback);
		}
	},
	onOpen: function(callback) {
		this.success = true;
		callback(this.success);
	},
	stop: function() {
		this.socket.close();
		return false;
	},
	reconnect: function() {
		var self = this;
		if (this.connect) {
			return;
		}
		// 没连接上会一直重连，设置延迟避免请求过多
		setTimeout(function() {
			self.init(function(result) {
				if (result) {
					self.connect = true;
				}
			});
		}, 2000);
	},
	getMsg: function(data, callback) {
		this.socket.send(data);
		this.socket.onmessage = function(msg) {
			callback(msg.data);
		};
	},

	IsLinux: function() {
		var os = navigator.platform;
		if (os.indexOf("Linux") > -1) {
			return true;
        }
		return false;
	},

	// blob对象解析
	blobParse: function(result, callback) {
		var reader = new FileReader();
		reader.readAsText(result, this.IsLinux() ? 'UTF-8' : 'GBK');
		reader.onload = function(e) {
			var blobtString = reader.result;
			var isErr = JSON.parse(blobtString);
			if (isErr.err == -1) {
				return;
			}
			callback(blobtString);
		};
	},
	backer: function(result, callback) {
		var o = JSON.parse(result);
		o.result.success ? callback(this.ownProp(o, 0)) : callback(this.ownProp(o));
	},
	ownProp: function(o, index) {
		var res = {success: o.result.success, msg: o.result.msg};
		if(index !== null || index !== undefined) {
			var $o = o.data[index];
			for(var prop in $o) {
				if($o.hasOwnProperty(prop)) {
					res[prop] = $o[prop];
				}
			}
		}
		return res;
	},
	callbackMsg: function(jsonRequest, callback) {
		var self = this;
		this.getMsg(jsonRequest, function(res) {
			self.blobParse(res, function(res) {
				self.backer(res, function(res) {
					callback(res);
				});
			});
		});
	},
	/**
	 * 获取介质列表
	 */
	GetUKeyList: function(callback) {
		var jsonRequest = '{"function":"GetUKeyList","args":[]}', self = this;
		this.getMsg(jsonRequest,function(result){
			self.blobParse(result,function(result){
				var o = JSON.parse(result);
				if (o.result.success) {
					if(o.data.length > 1) {
						var layer = Object.create(self.ca);
						layer.title = "选择设备";
						layer.listText = "设备列表";

						var certList = document.getElementById(self.ca.listContainer);
						if(!certList){
							var layer = Object.create(self.ca);
							self.newLayer(layer);
							certList = document.getElementById(self.ca.listContainer);
						}
						certList.innerHTML = "";
						for (var i = 0; i < o.data.length; i++) {
							var p = document.createElement('p');
							p.innerHTML = '<span>'+ o.data[i].manu+'</span>&nbsp;&nbsp;&nbsp;' + o.data[i].sn;
							if (i == 0) {
								p.className = 'active';
							}
							p.onclick = function() {
								self.clickP(this);
							};
							certList.appendChild(p);
						}
						var gzcaLayerSure = self.getNode('gzca-layer-sure');
						var gzcaLayerClose = self.getNode('gzca-layer-close');
						var gzcaLayerCancel = self.getNode('gzca-layer-cancel');
						gzcaLayerClose.onclick = function() {
							self.closeLayer();
						};
						gzcaLayerCancel.onclick = function() {
							self.closeLayer();
						};
						gzcaLayerSure.onclick = function() {
							self.selectCert(function(index) {
								callback(self.ownProp(o, index));
							});
						};
					} else {
						callback(self.ownProp(o, 0));
					}
				} else {
					callback(self.ownProp(o));
				}
			});
		});
	},
	/**
	 * 获取证书所在容器名
	 * createList: 是否创建证书列表，提供选择
	 */
	GZCA_GetContainerName: function(createList, certType, callback) {
		this.GZCA_GetCertList(createList, certType, callback);
	},
	/**
	 * 获取证书列表
	 * 参数: CertType：证书类型，可选值'0'、'1'、'2' ('0': 获取签名证书和加密证书，'1': 获取签名证书，'2': 获取加密证书)
	 */
	GZCA_GetCertList: function(createList, certType, callback) {
		var self = this, ListenCode = this.ListenCode.CERTLIST;
		this.GZCA_StartListen(ListenCode, function(res){
			if(res.success){
				var jsonRequest = '{"function":"GZCA_GetCertList","args":[{"CertType": "'+certType+'"}]}';
				self.getMsg(jsonRequest, function(result) {
					self.blobParse(result, function(result) {
						var o = JSON.parse(result);
						var certList = document.getElementById(self.ca.listContainer);
						if (o.result.success) {
							if(createList){
								var len = o.data.length;
								if(len > 1) {
									if(!certList){
										var layer = Object.create(self.ca);
										self.newLayer(layer);
										certList = document.getElementById(self.ca.listContainer);
									}
									initList(certList, o.data);
								}else{
									if(certList){
										initList(certList, o.data);
									}else{
										self.GZCA_StopListen(ListenCode,function(res){
											callback(self.ownProp(o, 0));
										});
									}
								}
							}else {
								self.GZCA_StopListen(ListenCode,function(res){
									callback({success: true, msg: o.result.msg, data: o.data});
								});
							}
						} else {
							if(o.data && certList){
								var gzcaCertLayer = document.querySelectorAll('.'+self.ca.container);
								gzcaCertLayer[0].parentNode.removeChild(gzcaCertLayer[0]);
							}
							self.GZCA_StopListen(ListenCode,function(res){
								callback(self.ownProp(o));
							});
						}
						function initList(certList, list) {
							certList.innerHTML = "";
							for (var i = 0; i < list.length; i++) {
								var p = document.createElement('p');
								p.innerHTML = '<span>'+ list[i].CN+'</span>' + list[i].ContainerName;
								if (i == 0) {
									p.className = 'active';
								}
								p.onclick = function() {
									self.clickP(this);
								};
								certList.appendChild(p);
							}
							var gzcaLayerSure = self.getNode('gzca-layer-sure');
							var gzcaLayerClose = self.getNode('gzca-layer-close');
							var gzcaLayerCancel = self.getNode('gzca-layer-cancel');
							gzcaLayerClose.onclick = function() {
								self.GZCA_StopListen(ListenCode,function(res){
									self.closeLayer();
								});
							};
							gzcaLayerCancel.onclick = function() {
								self.GZCA_StopListen(ListenCode,function(res){
									self.closeLayer();
								});
							};
							gzcaLayerSure.onclick = function() {
								self.selectCert(function(result) {
									self.GZCA_StopListen(ListenCode,function(res){
										callback(self.ownProp(o, result));
									});
								});
							};
						}
					});
				});
			}else{
				self.GZCA_Msg(res.msg);
			}
		});
	},
	ListenCode: {
		CERTLIST: '00000001'
	},
	/**
	 * 登陆(客户端弹出PIN码框)
	 * 参数:
	 * ContainerName: 证书所在容器名
	 */
	GZCA_Login: function(ContainerName, callback) {
		var jsonRequest = '{"function":"GZCA_Login","args":[{"ContainerName": "' + ContainerName + '", "UserPin": "123456", "IsLogin": "N"}]}';
		this.callbackMsg(jsonRequest, function(res) {
			callback(res);
		});
	},
	/**
	 * 登陆(浏览器输入PIN码)
	 * 参数:
	 * ContainerName: 证书所在容器名
	 * UserPin: 用户Pin(最低六位)
	 */
	GZCA_Login_PIN: function(ContainerName, UserPin, callback) {
		var jsonRequest = '{"function":"GZCA_Login","args":[{"ContainerName": "' + ContainerName + '", "UserPin": "'+ UserPin +'", "IsLogin": "Y"}]}';
		this.callbackMsg(jsonRequest, function(res) {
			callback(res);
		});
	},
	/**
	 * 注销登录
	 * ContainerName: 证书所在容器名
	 */
	GZCA_Logout: function(ContainerName, callback) {
		var jsonRequest = '{"function":"GZCA_Logout","args":[{"ContainerName": "' + ContainerName + '"}]}';
		this.callbackMsg(jsonRequest, function(res) {
			callback(res);
		});
	},
	/**
	 * 获取登陆状态
	 * ContainerName: 证书所在容器名
	 */
	GZCA_IsLogin: function(ContainerName, callback) {
		var jsonRequest = '{"function":"GZCA_IsLogin","args":[{"ContainerName": "' + ContainerName + '"}]}';
		this.callbackMsg(jsonRequest, function(res) {
			callback(res);
		});
	},
	/**
	 * 导出证书
	 * 参数:
	 * ContainerName: 证书所在容器名
	 * CertType: 证书类型(0：both,1：签名,2：加密)
	 */
	GZCA_ExportCert: function(ContainerName, CertType, callback) {
		var jsonRequest = '{"function":"GZCA_ExportCert","args":[{"ContainerName": "' + ContainerName + '", "CertType": "' + CertType + '"}]}';
		this.callbackMsg(jsonRequest, function(res) {
			callback(res);
		});
	},
	/**
	 * 获取证书信息
	 * 参数:
	 * CertB64: Base64编码的数字证书
	 */
	GZCA_GetCertInfo: function(CertB64, callback) {
		var jsonRequest = '{"function":"GZCA_GetCertInfo","args":[{"CertB64": "' + CertB64 + '"}]}';
		this.callbackMsg(jsonRequest, function(res) {
			callback(res);
		});
	},
	/**
	 * 根据OID获取证书信息
	 * 参数:
	 * CertB64: Base64编码的数字证书
	 * Oid: oid
	 */
	GZCA_GetCertInfoByOid: function(Oid, CertB64, callback) {
		var jsonRequest = '{"function":"GZCA_GetCertInfoByOid","args":[{"Oid":"'+Oid+'", "CertB64":"'+CertB64+'"}]}';
		this.callbackMsg(jsonRequest, function(res) {
			if(res.success) {
				var odiValue = res.OidValue;
				res.OidValue = odiValue.replace(/[\s]*/gm, '').replace(/^\d*\.*/g, '');
			}
			callback(res);
		});
	},
	/**
	 * Pkcs#1数字签名,可以配置GZCA_IsLogin使用，如果isLogin === true时，不需要验证PIN,否则需要
	 * 参数:
	 * ContainerName: 证书所在容器名
	 * Data: 带签名原文
	 */
	GZCA_Pkcs1SignData: function(ContainerName, Data, callback) {
		var jsonRequest = '{"function":"GZCA_Pkcs1SignData","args":[{"ContainerName":"' + ContainerName + '", "Data":"' + Data + '", "IsLogin":"Y"}]}';
		this.callbackMsg(jsonRequest, function(res) {
			callback(res);
		});
	},
	/**
	 * Pkcs#1数字签名验证
	 * 参数:
	 * CerB64：Base64编码的签名证书
	 * Data：待签名的原文
	 * SignData：签名值
	 */
	GZCA_Pkcs1VerifySign: function(CertB64, Data, SignData, callback) {
		var jsonRequest = '{"function":"GZCA_Pkcs1VerifySign","args":[{"CertB64":"' + CertB64 + '", "Data":"' + Data + '", "SignData":"' + SignData + '"}]}';
		this.callbackMsg(jsonRequest, function(res) {
			callback(res);
		});
	},
	/**
	 * SM2公钥加密(USBKEY)
	 * 参数:
	 * ContainerName: 证书所在容器名
	 * Data: 待加密的原文
	 */
	GZCA_EccEncryptData: function(ContainerName, Data, callback) {
		var jsonRequest = '{"function":"GZCA_EccEncryptData","args":[{"ContainerName":"' + ContainerName + '", "Data":"' + Data + '", "IsLogin":"Y"}]}';
		this.callbackMsg(jsonRequest, function(res) {
			callback(res);
		});
	},
	/**
	 * SM2私钥解密
	 * 参数:
	 * ContainerName: 证书所在容器名
	 * Data: 待解密的密文
	 */
	GZCA_EccDecryptData: function(ContainerName, Data, callback) {
		var jsonRequest = '{"function":"GZCA_EccDecryptData","args":[{"ContainerName":"' + ContainerName + '", "Data":"' + Data + '", "IsLogin":"Y"}]}';
		this.callbackMsg(jsonRequest, function(res) {
			callback(res);
		});
	},
	/**
	 * SM4对称加密(字符串)
	 * Data: 待加密的原文
	 */
	GZCA_EncryptDataEx: function(Data, callback) {
		var jsonRequest = '{"function":"GZCA_EncryptDataEx","args":[{"Data":"' + Data + '"}]}';
		this.callbackMsg(jsonRequest, function(res) {
			callback(res);
		});
	},
	/**
	 * SM4对称解密(字符串)
	 * 参数:
	 * KeyB64: 对称密钥，Base64编码
	 * Data: 待解密的数据，Base64编码
	 */
	GZCA_DecryptDataEx: function(KeyB64, Data, callback) {
		var jsonRequest = '{"function":"GZCA_DecryptDataEx","args":[{"KeyB64":"' + KeyB64 + '", "Data":"' + Data + '"}]}';
		this.callbackMsg(jsonRequest, function(res) {
			callback(res);
		});
	},
	/**
	 * SM4对称加密(文件)
	 * 参数:
	 * ContainerName: 证书所在容器名
	 * SrcFile: 待加密的文件全路径(如c:\1.txt)
	 * DstFile: 加密后的文件全路径
	 */
	GZCA_EncryptFileEx: function(SrcFile, DstFile, callback) {
		SrcFile = SrcFile.replace(/\\/g, '/');
		DstFile = DstFile.replace(/\\/g, '/');
		var jsonRequest = '{"function":"GZCA_EncryptFileEx","args":[{"SrcFile":"' + SrcFile + '", "DstFile":"' + DstFile + '"}]}';
		this.callbackMsg(jsonRequest, function(res) {
			callback(res);
		});
	},
	/**
	 * SM4对称解密(文件)
	 * 参数:
	 * ContainerName：证书所在容器名
	 * SrcFile：待解密的文件全路径,如c:\2.txt
	 * DstFile：解密后的文件全路径
	 */
	GZCA_DecryptFileEx: function(SrcFile, DstFile, KeyB64, callback) {
		SrcFile = SrcFile.replace(/\\/g, '/');
		DstFile = DstFile.replace(/\\/g, '/');
		var jsonRequest = '{"function":"GZCA_DecryptFileEx","args":[{"SrcFile":"' + SrcFile + '", "DstFile":"' + DstFile + '", "KeyB64":"' + KeyB64 + '"}]}';
		this.callbackMsg(jsonRequest, function(res) {
			callback(res);
		});
	},
	/**
	 * 获取客户端版本信息
	 * 参数:
	 */
	GZCA_GetClientVersion: function(callback) {
		var jsonRequest = '{"function":"GZCA_GetClientVersion","args":[]}';
		this.callbackMsg(jsonRequest, function(res) {
			callback(res);
		});
	},
	getNode: function(id) {
		return document.getElementById(id);
	},
	// UI
	ca: {
		layerId: 'gzca-cert-layer',
		idName: "layerClass",
		title: "选择证书",
		height: 230,
		width: 500,
		content: "layerContent",
		conText: "没有证书",
		listText: '证书列表',
		head: "gzcaHeader",
		listContainer: "gzca-layer-cert-list",
		bottom: "layerBottom",
		buttonText: [ "确认", "取消" ],
		container: 'gzca-layerContainer',
		add: function() {
			var layerContainer = document.createElement("div");
			var addLayer = document.createElement("div");
			addLayer.id = this.layerId;
			addLayer.className = 'gzca-cert-layer';
			layerContainer.className = 'gzca-layerContainer';
			layerContainer.appendChild(addLayer);
			document.getElementsByTagName("body")[0].appendChild(layerContainer);
			addLayer.innerHTML = '<div id="layer"><div id="'+ this.idName+ '" onselectstart="return false;"><div id="'+ this.head+ '"><h3>'+ this.title+ '</h3><span class="close" id="gzca-layer-close" title="关闭"></span></div><div id="'+ this.content + '"><fieldset><legend>' + this.listText+ '</legend><div id="' + this.listContainer+ '"></div></fieldset></div><div id="' + this.bottom+ '"><span id="gzca-layer-sure">' + this.buttonText[0]+ '</span><span id="gzca-layer-cancel">'+ this.buttonText[1] + '</span></div></div></div>';
		}
	},
	eventEl: {
		addEvent: function(element, type, handler) {
			if (element.addEventListener) {
				element.addEventListener(type, handler, false);
			} else if (element.attachEvent) {
				element.attachEvent("on" + type, handler);
			} else {
				element["on" + type] = handler;
			}
		},
		removeEvent: function(element, type, handler) {
			if (element.removeEventListener) {
				element.removeEventListener(type, handler, false);
			} else if (element.detachEvent) {
				element.detachEvent("on" + type, handler);
			} else {
				element["on" + type] = null;
			}
		},
		getEvent: function(event) {
			window.event ? window.event : event;
		},
		stopPropagation: function(event) {
			var event = event || window.event;
			if (event.stopPropagation) {
				event.stopPropagation();
			} else {
				return event.cancelBubble = true;
			}
		},
		preventDefaullt: function(event) {
			var event = event || window.event;
			if (event.preventDefault) {
				event.preventDefault();
			} else {
				event.returnValue = false;
			}
		}
	},
	clickP: function(e) {
		if (!this.hasClass(e, 'active')) {
			this.addClass(e, 'active');
			var sibilingArr = this.siblingElem(e);
			for (var s = 0; s < sibilingArr.length; s++) {
				this.removeClass(sibilingArr[s], 'active');
			}
		}
	},
	selectArr: [],
	keyid: '',
	selectCert: function(callback) {
		var getContentP = this.getNode("gzca-layer-cert-list").getElementsByTagName("p");
		for (var i = 0; i < getContentP.length; i++) {
			if (this.hasClass(getContentP[i], 'active')) {
				callback(i);
				this.closeLayer();
			}
		}
	},
	closeLayer: function() {
		var gzcaCertLayer = this.getNode('gzca-cert-layer').parentNode;
		gzcaCertLayer.parentNode.removeChild(gzcaCertLayer);
	},
	// 初始化函数
	newLayer: function newLayer(layer, o) {
		layer.add();
		var $this = this;
		var getLayer = $this.getNode(layer.idName);
		var getHeader = $this.getNode(layer.head);
		var getBottom = $this.getNode(layer.bottom);
		var getBtns = getBottom.getElementsByTagName("span");
		if (o && o.btn) {
			for (var i = 0; i < getBtns.length; i++) {
				getBtns[i].innerHTML = o.btn[i].text;
				getBtns[i].id = o.btn[i].id;
			}
		} else {
			for (var j = 0; j < getBtns.length; j++) {
				getBtns[j].innerHTML = layer.buttonText[j];
			}
		}
		// 设置高宽
		if (o) {
			layer.height = o.height;
			layer.width = o.width;
		}
		getLayer.style.height = layer.height + "px";
		getLayer.style.width = layer.width + "px";
		getLayer.style.marginTop = layer.height / -2 + "px";
		getLayer.style.marginLeft = layer.width / -2 + "px";
		// 弹出层拖拽
		var drag = function(disX, disY) {
			$this.eventEl.addEvent(document, "mousemove", dragMove);
			$this.eventEl.addEvent(getHeader, "mouseup", function() {
				$this.eventEl.removeEvent(document, "mousemove", dragMove);
			});
			function dragMove(event) {
				var event = event || window.event;
				var w = document.documentElement.clientWidth || document.body.clientWidth;
				var h = document.documentElement.clientHeight || document.body.clientHeight;
				getLayer.style.top = (event.clientY - disY) + "px";
				getLayer.style.left = (event.clientX - disX) + "px";
				if (event.clientY - disY <= 0) {
					getLayer.style.top = 0;
				}
				if (event.clientX - disX <= 0) {
					getLayer.style.left = 0;
				}
				if (event.clientY - disY >= h - getLayer.offsetHeight) {
					getLayer.style.top = (h - getLayer.offsetHeight) + "px";
				}
				if (w - (event.clientX - disX) - getLayer.offsetWidth <= 0) {
					getLayer.style.left = (w - getLayer.offsetWidth) + "px";
				}
				getLayer.style.marginTop = 0;
				getLayer.style.marginLeft = 0;
			}
		}
		var mdown = function(event) {
			var event = event || window.event;
			var disX = event.clientX - getLayer.offsetLeft;
			var disY = event.clientY - getLayer.offsetTop;
			drag(disX, disY);
		}
		this.eventEl.addEvent(getHeader, "mousedown", mdown);
	},
	// 样式类操作
	addClass: function(obj, cls) {
		var obj_class = obj.className, blank = (obj_class != '') ? ' ' : '';
		added = obj_class + blank + cls;
		obj.className = added;
	},
	removeClass: function(obj, cls) {
		var obj_class = ' ' + obj.className + ' ';
		obj_class = obj_class.replace(/(\s+)/gi, ' '), removed = obj_class
				.replace(' ' + cls + ' ', ' ');
		removed = removed.replace(/(^\s+)|(\s+$)/g, '');
		obj.className = removed;
	},
	hasClass: function(obj, cls) {
		var obj_class = obj.className, obj_class_lst = obj_class.split(/\s+/);
		x = 0;
		for (x in obj_class_lst) {
			if (obj_class_lst[x] == cls) {
				return true;
			}
		}
		return false;
	},
	siblingElem: function(elem) {
		var _nodes = [], _elem = elem;
		while ((elem = elem.previousSibling)) {
			if (elem.nodeType === 1) {
				_nodes.push(elem);
			} else {
				continue;
			}
		}
		elem = _elem;
		while ((elem = elem.nextSibling)) {
			if (elem.nodeType === 1) {
				_nodes.push(elem);
			} else {
				continue;
			}
		}
		return _nodes;
	},
	// 弹出dialog
	getCertificate: function getCertificate(o) {
		var layer = Object.create(this.ca);
		this.newLayer(layer, o);
	},
	/**
	 * Pkcs#1数字签名,不管KEY是否为登陆状态，都需要验证PIN
	 * 参数:
	 * ContainerName: 证书所在容器名
	 * Data: 带签名原文
	 */
	GZCA_Pkcs1SignData_PIN: function(ContainerName, Data, callback) {
		var jsonRequest = '{"function":"GZCA_Pkcs1SignData","args":[{"ContainerName":"' + ContainerName + '", "Data":"' + Data + '", "IsLogin":"N"}]}';
		this.callbackMsg(jsonRequest, function(res) {
			callback(res);
		});
	},
	/**
	 * SM4对称加密(字符串-usbkey)
	 * ContainerName: 证书所在容器名
	 * Data: 待加密的原文
	 */
	GZCA_EncryptData: function(ContainerName, Data, callback) {
		var jsonRequest = '{"function":"GZCA_EncryptData","args":[{"ContainerName":"' + ContainerName + '", "Data":"' + Data + '", "IsLogin":"N"}]}';
		this.callbackMsg(jsonRequest, function(res) {
			callback(res);
		});
	},
	/**
	 * SM4对称解密(字符串-usbkey)
	 * 参数:
	 * ContainerName: 证书所在容器名
	 * Data: 待解密的数据，Base64编码
	 */
	GZCA_DecryptData: function(ContainerName, Data, callback) {
		var jsonRequest = '{"function":"GZCA_DecryptData","args":[{"ContainerName":"' + ContainerName + '", "Data":"' + Data + '", "IsLogin":"N"}]}';
		this.callbackMsg(jsonRequest, function(res) {
			callback(res);
		});
	},
	/**
	 * SM2公钥加密(加密证书)
	 * 参数:
	 * CerB64: base64编码的加密证书
	 * Data: 待加密的原文
	 */
	GZCA_EccEncryptDataEx: function(CerB64, Data, callback) {
		var jsonRequest = '{"function":"GZCA_EccEncryptDataEx","args":[{"CertB64":"' + CerB64 + '", "Data":"' + Data + '"}]}';
		this.callbackMsg(jsonRequest, function(res) {
			callback(res);
		});
	},
		/**
	 * 非对称公钥加密(加密证书)
	 * 参数:
	 * CerB64: base64编码的加密证书
	 * Data: 待加密的原文
	 */
	GZCA_AsymEncryptData: function(CerB64, Data, callback) {
		var jsonRequest = '{"function":"GZCA_AsymEncryptData","args":[{"CertB64":"' + CerB64 + '", "Data":"' + Data + '"}]}';
		this.callbackMsg(jsonRequest, function(res) {
			callback(res);
		});
	},
	/**
	 * 非对称私钥解密
	 * 参数:
	 * ContainerName: 证书所在容器名
	 * Data: 待解密的密文
	 */
	GZCA_AsymDecryptData: function(ContainerName, Data, callback) {
		var jsonRequest = '{"function":"GZCA_AsymDecryptData","args":[{"ContainerName":"' + ContainerName + '", "Data":"' + Data + '", "IsLogin":"Y"}]}';
		this.callbackMsg(jsonRequest, function(res) {
			callback(res);
		});
	},
	/**
	 * 非对称私钥解密并加密转换输出
	 * 参数:
	 * ContainerName: 证书所在容器名
	 * ExchangeCertB64: base64编码的转换加密证书
	 * Data: 待解密的密文
	 */
	 GZCA_AsymDecryptDataExchange: function(ContainerName, ExchangeCertB64, Data, callback) {
		var jsonRequest = '{"function":"GZCA_AsymDecryptDataExchange","args":[{"ContainerName":"' + ContainerName + '", "CertB64":"' + ExchangeCertB64 + '", "Data":"' + Data + '", "IsLogin":"Y"}]}';
		this.callbackMsg(jsonRequest, function(res) {
			callback(res);
		});
	},
	/**
	 * SM4对称加密(文件-usbkey)
	 * 参数:
	 * ContainerName: 证书所在容器名
	 * SrcFile: 待加密的文件全路径(如c:\1.txt)
	 * DstFile: 加密后的文件全路径
	 */
	GZCA_EncryptFile: function(ContainerName, SrcFile, DstFile, callback) {
		SrcFile = SrcFile.replace(/\\/g, '/');
		DstFile = DstFile.replace(/\\/g, '/');
		var jsonRequest = '{"function":"GZCA_EncryptFile","args":[{"ContainerName":"' + ContainerName + '", "SrcFile":"' + SrcFile + '", "DstFile":"' + DstFile + '", "IsLogin":"N"}]}';
		this.callbackMsg(jsonRequest, function(res) {
			callback(res);
		});
	},
	/**
	 * SM4对称解密(文件-usbkey)
	 * 参数:
	 * ContainerName：证书所在容器名
	 * SrcFile：待解密的文件全路径,如c:\2.txt
	 * DstFile：解密后的文件全路径
	 */
	GZCA_DecryptFile: function(ContainerName, SrcFile, DstFile, callback) {
		SrcFile = SrcFile.replace(/\\/g, '/');
		DstFile = DstFile.replace(/\\/g, '/');
		var jsonRequest = '{"function":"GZCA_DecryptFile","args":[{"ContainerName":"' + ContainerName + '", "SrcFile":"' + SrcFile + '", "DstFile":"' + DstFile + '", "IsLogin":"N"}]}';
		this.callbackMsg(jsonRequest, function(res) {
			callback(res);
		});
	},

	/**
	 * SM3杂凑值计算(字符串)
	 * 参数:
	 * InData：待计算杂凑值的原文
	 * 返回:
	 * HashB64: 杂凑值base64
	 */
	GZCA_HashData: function(InData, callback) {
		var jsonRequest = '{"function":"GZCA_HashData","args":[{"Data":"' + InData + '"}]}';
		this.callbackMsg(jsonRequest, function(res) {
			callback(res);
		});
	},
	/**
	 * SM3杂凑值计算(文件)
	 * 参数:
	 * SrcFile: 待计算杂凑值的文件全路径(用”/”分隔，如c:/a.txt)
	 * 返回:
	 * HashB64: 杂凑值base64
	 */
	GZCA_HashFile: function(SrcFile, callback) {
		SrcFile = SrcFile.replace(/\\/g, '/');
		var jsonRequest = '{"function":"GZCA_HashFile","args":[{"SrcFile":"' + SrcFile + '"}]}';
		this.callbackMsg(jsonRequest, function(res) {
			callback(res);
		});
	},
	//开始监听消息
	GZCA_StartListen: function(Type, callback) {
		var jsonRequest = '{"function":"GZCA_StartListen","args":[{"Type":"' + Type + '"}]}';
		this.callbackMsg(jsonRequest, function(res) {
			callback(res);
		});
	},
	//停止监听消息
	GZCA_StopListen: function(Type, callback) {
		var jsonRequest = '{"function":"GZCA_StopListen","args":[{"Type":"' + Type + '"}]}';
		this.callbackMsg(jsonRequest, function(res) {
			callback(res);
		});
	},
	//数字信封加密(字符串)，支持多证书
	/**
	 * 参数: 1.certList加密证书列表，2.data:待加密数据base64编码列表，以|分隔
	 * 返回:
	 */
	GZCA_EnvelopeSealData: function(certList, data, callback) {
		var jsonRequest = '{"function":"GZCA_EnvelopeSealData","args":[{"CertB64List":"' + certList + '", "DataB64List":"' + data + '"}]}';
		this.callbackMsg(jsonRequest, function(res) {
			callback(res);
		});
	},
	//Pkcs7数字信封加密(字符串)，支持多证书
	/**
	 * 参数: 1.certList加密证书列表，以|分隔，2.data:待加密数据base64编码
	 * 返回:
	 */
	GZCA_Pkcs7EncryptData: function(certList, dataB64, callback) {
		var jsonRequest = '{"function":"GZCA_Pkcs7EncryptData","args":[{"CertB64List":"' + certList + '", "DataB64":"' + dataB64 + '"}]}';
		this.callbackMsg(jsonRequest, function(res) {
			callback(res);
		});
	},
	//Pkcs7数字信封解密(字符串)，支持多证书
	/**
	 * 参数: 1.containerName容器名，2.data:数字信封base64
	 * 返回:
	 */
	GZCA_Pkcs7DecryptData: function(containerName, dataB64, callback) {
		var self = this;
		this.GZCA_IsLogin(containerName, function(res) {
			if(self.GZCA_Next(res)) {
				if(!res.isLogin) {
					self.GZCA_Login(containerName, function(res){
						fn(res);
					});
				}else{
					fn(res);
				}
			}
			function fn(res) {
				if(self.GZCA_Next(res)) {
					var jsonRequest = '{"function":"GZCA_Pkcs7DecryptData","args":[{"ContainerName":"' + containerName + '", "DataB64":"' + dataB64 + '", "IsLogin":"' + res.isLogin + '"}]}';
					self.callbackMsg(jsonRequest, function(res) {
						callback(res);
					});
				}
			}
		});
	},
	//数字信封解密(字符串)，支持多证书
	/**
	 * 参数: 1.containerName容器名，2.data:数字信封base64
	 * 返回:
	 */
	GZCA_EnvelopeOpenData: function(containerName, data, callback) {
		var self = this;
		this.GZCA_IsLogin(containerName, function(res) {
			if(self.GZCA_Next(res)) {
				if(!res.isLogin) {
					self.GZCA_Login(containerName, function(res){
						fn(res);
					});
				}else{
					fn(res);
				}
			}
			function fn(res) {
				if(self.GZCA_Next(res)) {
					var jsonRequest = '{"function":"GZCA_EnvelopeOpenData","args":[{"ContainerName":"' + containerName + '", "Data":"' + data + '", "IsLogin":"' + res.isLogin + '"}]}';
					self.callbackMsg(jsonRequest, function(res) {
						callback(res);
					});
				}
			}
		});
	},
	GZCA_Next: function(o) {
		if(!o.success) {
			alert(o.msg);
			return false;
		}
		return true;
	},
	//数字信封加密(字符串+文件混合)
	/**
	 * 参数: 1.CerB64加密证书，2.InData:待加密数据base64编码列表，以|分隔，3.SrcFile:待加密文件列表，以|分隔
	 * 返回:
	 */
	GZCA_EnvelopeSealGroup: function(CerB64, InData, SrcFile, DstFile, callback) {
		if(!SrcFile){
			SrcFile = "|";
		}
		SrcFile = SrcFile.replace(/\\/g, '/');
		DstFile = DstFile.replace(/\\/g, '/');
		SrcFile = SrcFile.replace(/\"/g, '');
		DstFile = DstFile.replace(/\"/g, '');
		var a = DstFile.split('/');
		if(/[\/:*?]/g.test(a[a.length-1])){
			alert("文件名不能包含\\\/:*?");
			return;
		}

		var jsonRequest = '{"function":"GZCA_EnvelopeSealGroup","args":[{"CertB64":"' + CerB64 + '", "DataB64List":"' + InData + '", "SrcFileList":"' + SrcFile+ '", "DstFile":"' + DstFile + '"}]}';
		this.callbackMsg(jsonRequest, function(res) {
			callback(res);
		});
	},
	//数字信封解密(字符串+文件混合)
	/**
	 * 参数: 1.containerName容器名，2.SrcFile:，3.DstFileDir:，4.IsLogin
	 * 返回:
	 */
	GZCA_EnvelopeOpenGroup: function(containerName, SrcFile, DstFileDir, IsLogin, callback) {
		SrcFile = SrcFile.replace(/\\/g, '/');
		DstFileDir = DstFileDir.replace(/\\/g, '/');
		SrcFile = SrcFile.replace(/\"/g, '');
		DstFileDir = DstFileDir.replace(/\"/g, '');
		var jsonRequest = '{"function":"GZCA_EnvelopeOpenGroup","args":[{"ContainerName":"' + containerName + '", "SrcFile":"' + SrcFile + '", "DstFileDir":"' + DstFileDir + '", "IsLogin":"' + IsLogin + '"}]}';
		this.callbackMsg(jsonRequest, function(res) {
			callback(res);
		});
	},
	//数字信封加密(单文件单证书)
	/**
	 * 参数: 1.CerB64加密证书，2.SrcFile:待加密文件，3.DstFile:加密后文件
	 * 返回:
	 */
	 GZCA_EnvelopeSealFile: function(CerB64, SrcFile, DstFile, callback) {
		if(!SrcFile){
			SrcFile = "|";
		}
		SrcFile = SrcFile.replace(/\\/g, '/');
		DstFile = DstFile.replace(/\\/g, '/');
		SrcFile = SrcFile.replace(/\"/g, '');
		DstFile = DstFile.replace(/\"/g, '');
		var a = DstFile.split('/');
		if(/[\/:*?]/g.test(a[a.length-1])){
			alert("文件名不能包含\\\/:*?");
			return;
		}

		var jsonRequest = '{"function":"GZCA_EnvelopeSealFileEx","args":[{"CertB64":"' + CerB64 + '", "SrcFile":"' + SrcFile + '", "DstFile":"' + DstFile + '"}]}';
		this.callbackMsg(jsonRequest, function(res) {
			callback(res);
		});
	},
	//数字信封解密(单文件单证书)
	/**
	 * 参数: 1.containerName容器名，2.SrcFile:，3.DstFile:，4.IsLogin
	 * 返回:
	 */
	GZCA_EnvelopeOpenFile: function(containerName, SrcFile, DstFile, IsLogin, callback) {
		SrcFile = SrcFile.replace(/\\/g, '/');
		DstFile = DstFile.replace(/\\/g, '/');
		SrcFile = SrcFile.replace(/\"/g, '');
		DstFile = DstFile.replace(/\"/g, '');
		var jsonRequest = '{"function":"GZCA_EnvelopeOpenFileEx","args":[{"ContainerName":"' + containerName + '", "SrcFile":"' + SrcFile + '", "DstFile":"' + DstFile + '", "IsLogin":"' + IsLogin + '"}]}';
		this.callbackMsg(jsonRequest, function(res) {
			callback(res);
		});
	},
	GZCA_Msg: function(msg) {
		var div = document.createElement("div");
		var span = document.createElement("span");
		div.className = 'gzca-msg-container';
		span.innerHTML = msg;
		span.className = 'gzca-msg gzca-msg-show';
		div.appendChild(span);
		document.body.appendChild(div);
		var divNode = document.querySelectorAll('.gzca-msg-container');
		window.setTimeout(function(){
			divNode[0].parentNode.removeChild(divNode[0]);
		},3000);
	},
	/**
	 * Pkcs#1数字签名,可以配置GZCA_IsLogin使用，如果isLogin === true时，不需要验证PIN,否则需要
	 * 参数:
	 * ContainerName: 证书所在容器名
	 * DataB64: Base64编码带签名原文
	 */
	GZCA_Pkcs1SignDataEx: function(ContainerName, DataB64, callback) {
		var jsonRequest = '{"function":"GZCA_Pkcs1SignDataEx","args":[{"ContainerName":"' + ContainerName + '", "DataB64":"' + DataB64 + '", "IsLogin":"Y"}]}';
		this.callbackMsg(jsonRequest, function(res) {
			callback(res);
		});
	},
	/**
	 * Pkcs#1数字签名,不管KEY是否为登陆状态，都需要验证PIN
	 * 参数:
	 * ContainerName: 证书所在容器名
	 * DataB64: Base64编码的带签名原文
	 */

	 _PINEx: function(ContainerName, DataB64, callback) {
		var jsonRequest = '{"function":"GZCA_Pkcs1SignDataEx","args":[{"ContainerName":"' + ContainerName + '", "DataB64":"' + DataB64 + '", "IsLogin":"N"}]}';
		this.callbackMsg(jsonRequest, function(res) {
			callback(res);
		});
	},
	/**
	 * Pkcs#1数字签名验证
	 * 参数:
	 * CerB64：Base64编码的签名证书
	 * DataB64：Base64编码的待签名的原文
	 * SignData：签名值
	 */
	GZCA_Pkcs1VerifySignEx: function(CertB64, DataB64, SignData, callback) {
		var jsonRequest = '{"function":"GZCA_Pkcs1VerifySignEx","args":[{"CertB64":"' + CertB64 + '", "DataB64":"' + DataB64 + '", "SignData":"' + SignData + '"}]}';
		this.callbackMsg(jsonRequest, function(res) {
			callback(res);
		});
	},
		/**
	 * Pkcs#7数字签名(attach),可以配置GZCA_IsLogin使用，如果isLogin === true时，不需要验证PIN,否则需要
	 * 参数:
	 * ContainerName: 证书所在容器名
	 * DataB64: Base64编码带签名原文
	 */
	GZCA_Pkcs7SignData_attach: function(ContainerName, DataB64, callback) {
		var jsonRequest = '{"function":"GZCA_Pkcs7SignData","args":[{"ContainerName":"' + ContainerName + '", "DataB64":"' + DataB64 + '", "IsDetached":"N"' + ', "IsLogin":"Y"}]}';
		this.callbackMsg(jsonRequest, function(res) {
			callback(res);
		});
	},
			/**
	 * Pkcs#7数字签名(detach),可以配置GZCA_IsLogin使用，如果isLogin === true时，不需要验证PIN,否则需要
	 * 参数:
	 * ContainerName: 证书所在容器名
	 * DataB64: Base64编码带签名原文
	 */
	GZCA_Pkcs7SignData_detach: function(ContainerName, DataB64, callback) {
		var jsonRequest = '{"function":"GZCA_Pkcs7SignData","args":[{"ContainerName":"' + ContainerName + '", "DataB64":"' + DataB64 + '", "IsDetached":"Y"' + ', "IsLogin":"Y"}]}';
		this.callbackMsg(jsonRequest, function(res) {
			callback(res);
		});
	},
		/**
	 * Pkcs#7数字签名验证
	 * 参数:
	 * DataB64：Base64编码的待签名的原文
	 * SignData：签名值
	 */
	GZCA_Pkcs7VerifySign: function(DataB64, SignData, callback) {
		var jsonRequest = '{"function":"GZCA_Pkcs7VerifySign","args":[{"DataB64":"' + DataB64 + '", "SignData":"' + SignData + '"}]}';
		this.callbackMsg(jsonRequest, function(res) {
			callback(res);
		});
	},
	GZCA_Base64: function() {
		;(function (global, factory) {
			typeof exports === 'object' && typeof module !== 'undefined'
				? module.exports = factory(global)
				: typeof define === 'function' && define.amd
				? define(factory) : factory(global)
		}(this, function(global) {
				'use strict';
				global = global || {};
				var _Base64 = global.Base64;
				var version = "2.5.1";
				var buffer;
				if (typeof module !== 'undefined' && module.exports) {
					try {
							buffer = eval("require('buffer').Buffer");
					} catch (err) {
							buffer = undefined;
					}
				}
				var b64chars
					= 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
				var b64tab = function(bin) {
					var t = {};
					for (var i = 0, l = bin.length; i < l; i++) t[bin.charAt(i)] = i;
					return t;
				}(b64chars);
				var fromCharCode = String.fromCharCode;
				var cb_utob = function(c) {
					if (c.length < 2) {
							var cc = c.charCodeAt(0);
							return cc < 0x80 ? c
									: cc < 0x800 ? (fromCharCode(0xc0 | (cc >>> 6))
									+ fromCharCode(0x80 | (cc & 0x3f)))
									: (fromCharCode(0xe0 | ((cc >>> 12) & 0x0f))
									+ fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
									+ fromCharCode(0x80 | ( cc         & 0x3f)));
					} else {
							var cc = 0x10000
								+ (c.charCodeAt(0) - 0xD800) * 0x400
								+ (c.charCodeAt(1) - 0xDC00);
							return (fromCharCode(0xf0 | ((cc >>> 18) & 0x07))
								+ fromCharCode(0x80 | ((cc >>> 12) & 0x3f))
								+ fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
								+ fromCharCode(0x80 | ( cc         & 0x3f)));
					}
				};
				var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
				var utob = function(u) {
					return u.replace(re_utob, cb_utob);
				};
				var cb_encode = function(ccc) {
					var padlen = [0, 2, 1][ccc.length % 3],
					ord = ccc.charCodeAt(0) << 16
							| ((ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8)
							| ((ccc.length > 2 ? ccc.charCodeAt(2) : 0)),
					chars = [
							b64chars.charAt( ord >>> 18),
							b64chars.charAt((ord >>> 12) & 63),
							padlen >= 2 ? '=' : b64chars.charAt((ord >>> 6) & 63),
							padlen >= 1 ? '=' : b64chars.charAt(ord & 63)
					];
					return chars.join('');
				};
				var btoa = global.btoa ? function(b) {
					return global.btoa(b);
				} : function(b) {
					return b.replace(/[\s\S]{1,3}/g, cb_encode);
				};
				var _encode = buffer ?
					buffer.from && Uint8Array && buffer.from !== Uint8Array.from
					? function (u) {
							return (u.constructor === buffer.constructor ? u : buffer.from(u)).toString('base64')
					}
					:  function (u) {
						return (u.constructor === buffer.constructor ? u : new  buffer(u)).toString('base64')
					}
					: function (u) { return btoa(utob(u)) }
				;
				var encode = function(u, urisafe) {
						return !urisafe? _encode(String(u)): _encode(String(u)).replace(/[+\/]/g, function(m0) {
								return m0 == '+' ? '-' : '_';
						}).replace(/=/g, '');
				};
				var encodeURI = function(u) { return encode(u, true) };
				var re_btou = new RegExp([
					'[\xC0-\xDF][\x80-\xBF]',
					'[\xE0-\xEF][\x80-\xBF]{2}',
					'[\xF0-\xF7][\x80-\xBF]{3}'
				].join('|'), 'g');
				var cb_btou = function(cccc) {
					switch(cccc.length) {
					case 4:
							var cp = ((0x07 & cccc.charCodeAt(0)) << 18)
									|    ((0x3f & cccc.charCodeAt(1)) << 12)
									|    ((0x3f & cccc.charCodeAt(2)) <<  6)
									|     (0x3f & cccc.charCodeAt(3)),
							offset = cp - 0x10000;
							return (fromCharCode((offset  >>> 10) + 0xD800)
							+ fromCharCode((offset & 0x3FF) + 0xDC00));
					case 3:
							return fromCharCode(
									((0x0f & cccc.charCodeAt(0)) << 12)
											| ((0x3f & cccc.charCodeAt(1)) << 6)
											|  (0x3f & cccc.charCodeAt(2))
							);
					default:
							return  fromCharCode(
									((0x1f & cccc.charCodeAt(0)) << 6)
											|  (0x3f & cccc.charCodeAt(1))
							);
					}
				};
				var btou = function(b) {
					return b.replace(re_btou, cb_btou);
				};
				var cb_decode = function(cccc) {
					var len = cccc.length,
					padlen = len % 4,
					n = (len > 0 ? b64tab[cccc.charAt(0)] << 18 : 0)
							| (len > 1 ? b64tab[cccc.charAt(1)] << 12 : 0)
							| (len > 2 ? b64tab[cccc.charAt(2)] <<  6 : 0)
							| (len > 3 ? b64tab[cccc.charAt(3)]       : 0),
					chars = [
							fromCharCode( n >>> 16),
							fromCharCode((n >>>  8) & 0xff),
							fromCharCode( n         & 0xff)
					];
					chars.length -= [0, 0, 2, 1][padlen];
					return chars.join('');
				};
				var _atob = global.atob ? function(a) {
					return global.atob(a);
				} : function(a){
					return a.replace(/\S{1,4}/g, cb_decode);
				};
				var atob = function(a) {
					return _atob(String(a).replace(/[^A-Za-z0-9\+\/]/g, ''));
				};
				var _decode = buffer ?
					buffer.from && Uint8Array && buffer.from !== Uint8Array.from
					? function(a) {
							return (a.constructor === buffer.constructor? a : buffer.from(a, 'base64')).toString();
					}
					: function(a) {
							return (a.constructor === buffer.constructor? a : new buffer(a, 'base64')).toString();
					}
					: function(a) { return btou(_atob(a)) };
				var decode = function(a){
					return _decode(
							String(a).replace(/[-_]/g, function(m0) { return m0 == '-' ? '+' : '/' }).replace(/[^A-Za-z0-9\+\/]/g, '')
					);
				};
				var noConflict = function() {
					var Base64 = global.Base64;
					global.Base64 = _Base64;
					return Base64;
				};
				global.Base64 = {
					VERSION: version,
					atob: atob,
					btoa: btoa,
					fromBase64: decode,
					toBase64: encode,
					utob: utob,
					encode: encode,
					encodeURI: encodeURI,
					btou: btou,
					decode: decode,
					noConflict: noConflict,
					__buffer__: buffer
				};
				if (typeof Object.defineProperty === 'function') {
					var noEnum = function(v){
						return {value:v,enumerable:false,writable:true,configurable:true};
					};
					global.Base64.extendString = function () {
							Object.defineProperty(
									String.prototype, 'fromBase64', noEnum(function () {
											return decode(this)
									}));
							Object.defineProperty(
									String.prototype, 'toBase64', noEnum(function (urisafe) {
											return encode(this, urisafe)
									}));
							Object.defineProperty(
									String.prototype, 'toBase64URI', noEnum(function () {
											return encode(this, true)
									}));
					};
				}
				if (global['Meteor']) {
					Base64 = global.Base64;
				}
				if (typeof module !== 'undefined' && module.exports) {
					module.exports.Base64 = global.Base64;
				}
				else if (typeof define === 'function' && define.amd) {
					define([], function(){ return global.Base64 });
				}
				return {Base64: global.Base64};
		}));
		return this.Base64;
	},
};
