var list= [];//定义一个全局变量用于存储从文件读取出来的任务列表，这样就不用重复读取文件
//获取一个xmlhttp对象
function getxmlhttp () {
	var xmlhttp;
  	if (window.XMLHttpRequest)
    	xmlhttp=new XMLHttpRequest();
  	else
    	xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  	return xmlhttp;
}
//发送一个Ajax请求去读取文件
function getContain () {
	var xmlhttp = getxmlhttp();	
	xmlhttp.onreadystatechange = function () {
		if (xmlhttp.readyState === 4) {
			list = xmlhttp.responseText||"[]";
			//console.log(list);
			list = JSON.parse(list);
			//console.log(list);
			showAll();
		}
	};
	xmlhttp.open('POST', "http://127.0.0.1:3000/get", true);
	xmlhttp.setRequestHeader("Content-type","application/json");
	xmlhttp.send();
}
//发送一个Ajax请求去写入文件
function pushContain() {
	var xmlhttp = getxmlhttp();	
	xmlhttp.open('POST', "http://127.0.0.1:3000/push", true);
	xmlhttp.setRequestHeader("Content-type","application/json");
	//console.log(JSON.stringify(list));
	xmlhttp.send(JSON.stringify(list));
}
function creatTask(title) {
	var obj = new Object();
	obj.title = title;
	obj.completed = true;
	return obj;
}
//获取输入框输入的内容，若输入的内容为空则直接跳出，若不为空则生成任务对象，并把它写进localStorage
function get() {
	var value = document.getElementById('tittle').value;
	if(value=="")
		return;
	document.getElementById('tittle').value = "";
	list.push(creatTask(value));					
	pushContain();
	var str = window.location.href
	var index = str.indexOf("#");
	if(index  == -1)
		showAll();	
	else
	{
		var value = str.substr(index+2);
		show(value);
	}		
}
//根据value的值调用不同的输出函数
function show(value){
	if(value == "all")
		showAll();
	else if(value == "completed")
		showCompleted();
	else if(value == "active")
		showActive();
}
//输出所有的任务列表，通过字符串拼接成Html代码，替换到表格中
function showAll() {
	var str = "<table><tbody>";
	for (var i = 0; i < (list.length||0); i++) {
		if(list[i].completed==false)
			str+="<tr><td id='list"+i+"' class='completed' ondblclick='updata("+i+")'>";
		else
			str+="<tr><td id='list"+i+"' class='uncompleted' ondblclick='updata("+i+")'>";
		str+=list[i].title;
		if(list[i].completed==true)
			str+="</td><td><button class='btn btn-default btn-success' onclick='completed("+i+")'>完成</button>";
		else
			str+="</td><td><button class='btn btn-default btn-warning' onclick='uncompleted("+i+")'>取消</button>";
		str+="<button class='btn btn-default btn-danger' onclick='deleted("+i+")'>删除</button></td></tr>";
	}
	str+="</tbody></table>";
	document.getElementById("container").innerHTML=str;
}
//输出所有未完成的任务列表，通过字符串拼接成Html代码，替换到表格中
function showActive() {
	var str = "<table><tbody>";
	for (var i = 0; i < (list.length||0); i++) {
		if(list[i].completed==true)
		{
			str+="<tr><td id='list"+i+"' class='uncompleted' ondblclick='updata("+i+")'>";
			str+=list[i].title;
			str+="</td><td><button class='btn btn-default btn-success' onclick='completed("+i+")'>完成</button>";
			str+="<button class='btn btn-default btn-danger' onclick='deleted("+i+")'>删除</button></td></tr>";
		}
	}
	str+="</tbody></table>";
	document.getElementById("container").innerHTML=str;
}
//输出所有完成的任务列表，通过字符串拼接成Html代码，替换到表格中
function showCompleted() {
	var str = "<table><tbody>";
	for (var i = 0; i < (list.length||0); i++) {
		if(list[i].completed==false)
		{
			str+="<tr><td id='list"+i+"' class='completed' ondblclick='updata("+i+")'>";
			str+=list[i].title;
			str+="</td><td><button class='btn btn-default btn-warning' onclick='uncompleted("+i+")'>取消</button>";
			str+="<button class='btn btn-default btn-danger' onclick='deleted("+i+")'>删除</button></td></tr>";
		}
	}
	str+="</tbody></table>";
	document.getElementById("container").innerHTML=str;
}
//根据i将对应任务列表对象的completed值设置为false，并根据现在的url的参数调用show函数
function completed(i) {
	list[i].completed=false;
	pushContain();
	var str = window.location.href
	var index = str.indexOf("#");
	if(index  == -1)
		showAll();	
	else
	{
		var value = str.substr(index+2);
		show(value);
	}	
}
//根据i将对应任务列表对象的completed值设置为true，并根据现在的url的参数调用show函数
function uncompleted(i){
	list[i].completed=true;
	pushContain();
	var str = window.location.href
	var index = str.indexOf("#");
	if(index  == -1)
		showAll();	
	else
	{
		var value = str.substr(index+2);
		show(value);
	}		
}
//根据i将对应任务列表对象删除，并根据现在的url的参数调用show函数
function deleted(i) {
	list.splice(i,1);
	pushContain();
	var str = window.location.href
	var index = str.indexOf("#");
	if(index  == -1)
		showAll();	
	else
	{
		var value = str.substr(index+2);
		show(value);
	}			
}
//根据i生成一个要修改任务的id，将表格转变为可输入的文本框
function updata(i) {
	var id = "list" + i;
	var value = list[i].title;
	var str="<input id='task"+i+"' type='text' class='form-control' value='"+value+"' onkeydown='if(event.keyCode==13){change("+i+")}'>";
	document.getElementById(id).innerHTML=str;
}
//根据i生成文本框的id，将文本框转变为表格
function change(i) {
	var id = "task" + i;
	var value = document.getElementById(id).value;
	list[i].title = value;
	pushContain();
	var id = "list" + i;
	document.getElementById(id).innerHTML=value;
}