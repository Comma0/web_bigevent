$(function () {

    let layer = layui.layer
    let form = layui.form
    let laypage = layui.laypage

    // 三、定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }


    // 四、定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 一、定义一个查询的参数对象，将来请求数据的时候，需要将请求参数对象提交到服务器
    let q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认显示两条
        cate_id: '', // 文章分类的id
        state: '' // 文章的发布状态
    }


    initTable()
    initCate()

    // 二、获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }

                // 使用模板引擎渲染页面数据
                let htmlStr = template('tpl-table', res)
                $("tbody").html(htmlStr)

                // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }


    // 五、获取并渲染文章分类的下拉选择框
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // 调用模板引擎渲染分类的可选项
                let htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 通过 layui 重新渲染表单区域的UI结构
                form.render()
            }
        })
    }


    // 六、为筛选绑定提交事件
    $("#form-search").submit(function (e) {
        // 1) 阻止默认行为
        e.preventDefault()
        // 2) 获取表单中选中项的值
        let cate_id = $('[name=cate_id]').val()
        let state = $('[name=state]').val()
        // 3) 为查询参数 q 中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        // 4) 根据最新的筛选条件，重新渲染表格的数据
        initTable()
    })


    // 七、定义渲染分页的方法
    function renderPage(total) {
        // 1) 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', // 分页容器的 id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换的时候触发 jump 回调
            // 触发 jump 回到的方式有两种：
            // 1) 点击页码的时候会触发 jump 回调
            // 2) 只要调用了 laypage.render() 方法，就会触发 jump 回调
            jump: function (obj, first) {
                // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
                // 如果 first 的值为 true，证明是方式2触发的
                // 否则就是方式1触发的
                console.log(first);
                console.log(obj.curr)
                // 把最新的页码值，赋值给 q 这个参数对象中
                q.pagenum = obj.curr
                // 把最新的条目数赋值到这个查询参数对象的 pagesize 属性中
                q.pagesize = obj.limit
                // 根据最新的 q 获取最新的数据列表，并渲染表格
                // initTable()
                if (!first) {
                    initTable()
                }
            }
        })
    }

    // 八、通过代理的方式，为删除按钮绑定点击事件
    $("tbody").on('click', '.btnDelete', function (e) {
        // 获取上传按钮个数
        let length = $(".btnDelete").length
        console.log(length)  // 2
        // 获取文章id
        let id = $(this).attr('data-id')
        // 询问用户是否要删除数据
        layer.confirm('确认删除?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    console.log(res)
                    if(res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    // 当数据生成完成后，需判断当前这一页中，是否还有剩余的数据
                    // 如果没有剩余的数据了，则让页码值减一，之后再重新调用 initTable 方法
                    // 等于 1 说明当前页面只有一条数据，点完就等于 0
                    if(length === 1){
                        // 如果 length 的值等于1，说明删除完毕之后，页面上就没有任何数据了
                        // 页码值不能小于 1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })

            layer.close(index);
        });
    })
})