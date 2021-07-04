$(function(){
    // 调用 getUserInfo 获取用户基本信息
    getUserInfo()

    let layer = layui.layer

    // 三 点击退出按钮实现退出功能
    $("#btnLogout").click(function () { 
        // 1) 提示用户是否确认退出
        layer.confirm('确定退出登录?', {icon: 3, title:'提示'}, function(index){
            // 2) 清空本地储存中的token
            localStorage.removeItem('token')
            // 3) 重新跳转回登录页
            location.href = '/login.html'
            // 4) 关闭 confirm 询问框
            layer.close(index);
        });
    })
})

// 一、获取用户基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // 1) headers: 请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if(res.status !== 0) {
                return layui.layer .msg('获取用户信息失败')
            }
            console.log(res);
            // 2) 调用 renderAvatar，渲染用户的头像
            renderAvatar(res.data)
        },
        // 3) 无论请求成功还是失败，都会调用 complete 回调函数
        // 见baseAPI.js
    })
}


// 二、渲染用户的头像
function renderAvatar(user) {
    // 1) 获取用户的名称
    let name = user.nickname || user.username
    // 2) 设置欢迎的文本
    $("#welcome").html('欢迎&nbsp;&nbsp;' + name)
    // 3) 按需渲染用户的头像
    if(user.user_pic !== null) {
        // 3.1 渲染图片头像
        $(".layui-nav-img").attr('src', user.user_pic).show()
        $(".txet.avatar").hide()
    }else{
        // 3.2 渲染文本头像
        $(".layui-nav-img").hide()
        let first = name[0].toUpperCase()
        $(".text-avatar").html(first).show()
    }
}