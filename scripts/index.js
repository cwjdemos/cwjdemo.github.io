const nextDay = _ => new Date().setHours(24, 0, 0)
const lastYear = _ => new Date(new Date().setMonth(0, 0)).setHours(24, 0, 0)
const nextYear = _ => new Date(new Date().setMonth(12, 1)).setHours(0, 0, 0)
const analyzeTTL = time => {
    let h = Math.floor(time / 3600)
    let m = Math.floor((time % 3600) / 60)
    let s = Math.floor(time % 3600 % 60)
    return { h, m, s }
}
const $id = id => document.getElementById(id)
const render = (content, elm) => (elm.innerHTML !== content) && (elm.innerHTML = content)
const ttDe = () => {
    let secondToDay = (nextDay() - new Date()) / 1000
    let { h, m } = analyzeTTL(secondToDay)
    let pt1, pt2, pt3
    if (h >= 12) {
        pt1 = "今天已经度过了"
        pt2 = 23 - h
        pt3 = 59 - m
    } else {
        pt1 = "距离今天结束还有"
        pt2 = h
        pt3 = m
    }
    render(pt1, $id("pt1"))
    render(pt2, $id("pt2"))
    render(pt3, $id("pt3"))
}
const ttYe = () => {
    let year = new Date().getFullYear()
    let per = (Date.now() - lastYear()) / (nextYear() - lastYear())
    let pt4 = `${year}年已经过去了`
    let pt5 = `${(per * 100).toFixed(5)}%`
    render(pt4, $id("pt4"))
    render(pt5, $id("pt5"))
    $id("progress").style.width = pt5
}
const exec = () => {
    ttDe()
    ttYe()
}
exec()
setInterval(() => {
    exec()
}, 1000)
const toggleClass = (ele, cls) => {
    let origin = ele.className.split(" ")
    if (origin.indexOf(cls) > -1) {
        origin.splice(origin.indexOf(cls), 1)
    } else {
        origin.push(cls)
    }
    ele.className = origin.join(" ")
}
const githubPrefix = "https://github.com/cwj0417/"
const demoDir = "demos/"
const addProject = (title, options, desc, isGame) => {
    let { github, homepage, demonstration, download } = options
    let $project = document.createElement("div")
    $project.className = "project"
    let $title = document.createElement("div")
    $title.className = "title"
    let $desc = document.createElement("div")
    $desc.className = "desc hid"
    $project.appendChild($title)
    $project.appendChild($desc)
    document.getElementById(isGame ? "games" : "projects").appendChild($project)

    // arrow
    let $arrow = document.createElement("i")
    $arrow.className = "fa fa-angle-down arrow"
    $arrow.addEventListener("click", () => {
        toggleClass($arrow, "expended")
        toggleClass($desc, "hid")
    })
    // title
    let $name = document.createElement("div")
    $name.className = "name"
    $name.innerHTML = title
    $name.addEventListener("click", () => {
        toggleClass($arrow, "expended")
        toggleClass($desc, "hid")
    })

    $title.appendChild($arrow)
    $title.appendChild($name)

    // github
    if (github) {
        let $github_a = document.createElement("a")
        let $github_icon = document.createElement("i")
        $github_a.href = `${githubPrefix}/${github}`
        $github_a.target = "_blank"
        $github_icon.className = "fa fa-github"
        $github_a.appendChild($github_icon)
        $title.appendChild($github_a)
    }

    if (demonstration) {
        let $demo_a = document.createElement("a")
        let $demo_icon = document.createElement("i")
        $demo_a.href = `${demoDir}${demonstration}`
        $demo_a.target = "_blank"
        $demo_icon.className = "fa fa-play"
        $demo_a.appendChild($demo_icon)
        $title.appendChild($demo_a)
    }

    if (homepage) {
        let $homepage_a = document.createElement("a")
        let $homepage_icon = document.createElement("i")
        $homepage_a.href = homepage
        $homepage_a.target = "_blank"
        $homepage_icon.className = "fa fa-home"
        $homepage_a.appendChild($homepage_icon)
        $title.appendChild($homepage_a)
    }

    if (download) {
        let $download_a = document.createElement("a")
        let $download_icon = document.createElement("i")
        $download_a.href = `${githubPrefix}/${download}/releases`
        $download_a.target = "_blank"
        $download_icon.className = "fa fa-download"
        $download_a.appendChild($download_icon)
        $title.appendChild($download_a)
    }

    //desc
    $desc.innerHTML = desc
}
addProject("泡泡龙", { github: "canvas", demonstration: "ppl/index.html" }, "2014年研究canvas时做的游戏, 自己写的碰撞判断", true)
addProject("时钟", { github: "canvas", demonstration: "clock/index.html" }, "2014年研究canvas时照着教程做的", true)
addProject("yohane", { github: "yohane", homepage: githubPrefix + "yohane" }, "基于命令行, 把md文件转化为ppt")
addProject("jin", { github: "jin", homepage: "https://jin.yo-cwj.com" }, "配色系统")
addProject("钢琴模拟器", {github: "keyboardJoy", demonstration: "keyboard/index.html"}, "加载midi文件来模拟钢琴弹奏", true)
addProject("弹一弹", {github: "superflip", demonstration: "flip/index.html"}, "小游戏", true)
addProject("carrot", {github: "carrot"}, "基于rn的菜谱app")
addProject("vocabook", { github: "lock-on", download: "lock-on" }, "背单词软件")
addProject("yosoro", { github: "yosoro" }, "chrome插件, 提供多种实用功能")
addProject("gistore", { github: "gistore", homepage: githubPrefix + "gistore" }, "使用github的gist服务来备份单机应用")
addProject("did", { github: "did", homepage: githubPrefix + "did", download: "did" }, "chrome插件, 记录每天做的事和todos.")