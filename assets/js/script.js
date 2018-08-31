var addFormToggle=false;
var tasksArray=[];

function setCookie(cname, cvalue, exdays){var d = new Date(); d.setTime(d.getTime() + (exdays*24*60*60*1000)); var expires = "expires="+ d.toUTCString(); document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";}
function getCookie(cname){var name = cname + "="; var decodedCookie = decodeURIComponent(document.cookie); var ca = decodedCookie.split(';'); for(var i = 0; i <ca.length; i++) {var c = ca[i]; while (c.charAt(0) == ' ') {c = c.substring(1);}if (c.indexOf(name) == 0) {return c.substring(name.length, c.length);}}return "";}
function cleanArray(actual){var newArray = new Array(); for (var i = 0; i < actual.length; i++) {if (actual[i]) {newArray.push(actual[i]);}}return newArray;}

function loadTasksList(){
    if (getCookie('tdl')==''){
        $('#taskList').html('<div class="emptyList">لیست خالی است!</div>');
    }else{
        tasksArray = JSON.parse(getCookie('tdl'));
        var i=0;
        while(tasksArray[i]){
            $('#taskList').append('<div class="collection-item waves-effect waves-light" item="'+i+'" onclick="removeTaskBox('+i+');">'+tasksArray[i]+'</div>');
            i++;
        }
    }
    if ($('#taskList').text().length==0){
        $('#taskList').html('<div class="emptyList">لیست خالی است!</div>');
    }
}

function addTask(task){
    if ($('#taskList').html()=='<div class="emptyList">لیست خالی است!</div>'){
        $('#taskList').html('');
    }
    var tasksCount = tasksArray.length;
    $('#taskList').append('<div class="collection-item waves-effect waves-light" item="'+tasksCount+'" onclick="removeTaskBox('+tasksCount+');">'+task+'</div>');
    tasksArray.push(task);
}

function removeTaskBox(id){
    addFormToggle = true;
    $('#addTask').html('انصراف');
    var newTitle = 'حذف "'+tasksArray[id]+'"';
    viewPage('#taskList', '#removeTaskForm', newTitle);
    $('#itemForRemove').val(id);
}
function removeTask(id){
    $(".collection-item[item="+id+"]").remove();
    //tasksArray.splice(id, 1);
    delete tasksArray[id];
    if ($('#taskList').text().length==0){
        $('#taskList').html('<div class="emptyList">لیست خالی است!</div>');
    }
}

function saveTasks(){
    var newArray = cleanArray(tasksArray);
    var tasksStr = JSON.stringify(newArray);
    setCookie('tdl', tasksStr, 365);
}

function viewPage(currentPageID, newPageID, title){
    $('.contentTitle').fadeOut(1).html(title).fadeIn(300);
    $(currentPageID).hide();
    $(newPageID).fadeIn(300);
}

$(document).ready(function(){
    loadTasksList();

    $('#addTask').click(function(){
        if (addFormToggle==false){
            addFormToggle = true;
            viewPage('#taskList', '#addTaskForm', 'افزودن کار جدید!');
            $('#addTask').html('لغو کردن');
            $('#taskNameInput').focus();
        }else{
            addFormToggle = false;
            viewPage('#addTaskForm', '#taskList', 'لیست کارهای روزمره');
            $('#addTask').html('کار جدید');
            $('#removeTaskForm').hide();
        }
    });

    $('#taskNameInput').bind("enterKey",function(e){
        $('#addTaskSubmit').click();
    });
    $('#taskNameInput').keyup(function(e){
        if(e.keyCode==13){
            $(this).trigger("enterKey");
        }
    });

    $('#addTaskSubmit').click(function(){
        if ($('#taskNameInput').val().trim().length>0){
            var task = $('#taskNameInput').val();
            addTask(task);
            $('#taskNameInput').val('');
            $('#addTask').html('کار جدید');
            viewPage('#addTaskForm', '#taskList', 'لیست کارهای روزمره');
            addFormToggle=false;
        }else{
            M.toast({html: 'باید عنوانی را وارد کنید!'});
            $('#taskNameInput').val('');
        }
    });

    $('#removeAccept').click(function(){
        var taskID = $('#itemForRemove').val();
        removeTask(taskID);
        viewPage('#removeTaskForm', '#taskList', 'لیست کارهای روزمره');
        $('#addTask').html('کار جدید');
        addFormToggle = false;
        M.toast({html: 'حذف با موفقیت انجام شد!'});
    });

    $('#saveTasks').click(function(){
        saveTasks();
        M.toast({html: 'کارهای شما ذخیره شد!'});
    });
});