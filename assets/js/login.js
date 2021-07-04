$(function() {
    // 1、点击 "去注册账号"的链接
    $("#link_reg").click(function() {
        $(".login-box").hide()
        $(".reg-box").show()
    })

    // 2、点击 "去登录"的链接
    $("#link_login").click(function() {
        $(".login-box").show()
        $(".reg-box").hide()
    })

    // 3、自定义验证规则
    // 1) 从 layui 获取 form 对象
    let form = layui.form
    // 2) 通过 form.verify() 函数来自定义验证规则
    form.verify({
        // 3) 以数组形式自定义了一个叫 pwd 的验证规则
        pwd: [
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
        ],
        // 4) 验证两次密码是否一致的规则
        repwd: function (value) {
            // 通过形参拿到的是确认密码框的内容，还需要拿到密码框的内容，然后进行一次等于的判断
            // 如果判断失败，则 return 一个提示消息即可
            let pwd = $(".reg-box [name=password]").val()
            if(pwd !== value) {
                return '两次密码不一致！'
            }
        }
    })


    // 4、监听注册表单的提交事件
    let layer = layui.layer
    $("#form_reg").on('submit', function (e) {
        // 1) 阻止默认的提交行为
        e.preventDefault()
        // 2) 发起Ajax的post请求
        $.post(
            '/api/reguser',
            {
                username: $("#form_reg [name=username]").val(),
                password: $("#form_reg [name=password]").val()
            },
            function (res) {
                if(res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('注册成功，请登录！')
                // 模拟人的点击行为
                $("#link_login").click()
            }
        )
    })

    // 5、监听登录表单的提交事件
    $("#form_login").submit(function (e) { 
        // 1) 阻止表单的默认提交行为
        e.preventDefault()
        $.ajax({
            url: '/api/login',
            method: 'POST',
            data: $(this).serialize(),
            success: function (res) {
                if(res.status !== 0) {
                    // return layer.mag('登录失败！')
                    console.log(res);
                    return alert('登录失败')
                } 
                layer.msg('登录成功')
                console.log(res.token)
                // 将登录成功得到的 token 字符串，保存到 localStorage 中
                localStorage.setItem('token', res.token)
                // 跳转到后台主页
                location.href = '/index.html'
            }
        })
    })
})
