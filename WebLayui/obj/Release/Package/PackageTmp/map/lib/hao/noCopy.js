/* 2017-10-27 20:22:35 | 修改 木遥（QQ：346819890） */
//禁止了右键功能、复制、F11、F12等功能 

function KeyDown() {
    //console.log("ASCII代码是："+event.keyCode);

    if (
            event.keyCode == 112 ||             //屏蔽 F1   
            event.keyCode == 123 ||             //屏蔽 F12 
            (event.ctrlKey && event.keyCode == 82) ||       //屏蔽 Ctrl + R
            (event.ctrlKey && event.keyCode == 78) ||       //屏蔽 Ctrl + N
            (event.shiftKey && event.keyCode == 121) ||      //屏蔽  shift+F10
            (event.altKey && event.keyCode == 115)||        //屏蔽  Alt+F4
        (event.srcElement.tagName == "A" && event.shiftKey)//屏蔽 shift 加鼠标左键新开一网页
        ) {
        event.keyCode = 0;
        event.returnValue = false;
        return false;
    }
     
    return true;
}
//键盘按下 
document.onkeydown = KeyDown; 
document.oncontextmenu = function () {
    event.returnValue = false;
};
document.onselectstart = function () {
    event.returnValue = false;
};
document.oncopy = function () {
    event.returnValue = false;
}; 