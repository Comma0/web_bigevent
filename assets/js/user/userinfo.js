$(function(){
    let form = layui.form
    let layer = layui.layer

    // 一、设置用户名提示规则
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度长度必须在1 ~ 6个字符之间!'
            }
        }
    })

    ininUserInfo()


    // 二、获取用户的基本信息
    function ininUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败')
                }
                console.log(res);
                // 调用 form.val() 快速为表单赋值
                form.val('formUserInfo', res.data)
            }
        })
    }

    // 三、实现表单的重置效果
    $("#btnReset").click(function(e){
        // 1) 阻止表单的默认重置行为，因为它会把登录名称一块清空了
        e.preventDefault()
        ininUserInfo()
    })

    // 四、监听表单的提交事件
    $(".layui-form").submit(function(e){
        // 1) 阻止表单的默认提交行为
        e.preventDefault()
        // 2) 发起 Ajax 数据请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res){
                if(res.status !== 0) {
                    return layer.msg('更新用户信息失败')
                }
                layer.msg('更新用户信息成功')
                // 调用父页面中的方法，重新渲染用户的头像和用户的信息
                // window 代表 iframe 这个窗口
                // parent 代表 显示 iframe 那个页面
                window.parent.getUserInfo()
            }
        })
    })
})