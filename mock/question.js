

const fakeQuerys = (req, res, url) => {
  const data = [{
    value: '1',
    label: '222',
    children: []
  }]

  res.json({
    code: 200,
    data
  })
}
const fakeShares = (req, res, url) => {
  const start = req.pageNum * req.pageSize
  const list = new Array(100)
  list.filter((x, index) => {
    return index > start && index < start + req.pageSize
  })
  for (let i = 0; i < list.length; i++) {
    const temp = {
      id: i,
      name: `题目${i}`,
      type: `${i % 2}`,
      questionNum: 10 * (i % 2) + 3,
      degree: '5',
      subject: '数学/五年级',
      print: '10',
      status: `${i % 2}`
    }
    list[i] = temp
  }
  res.json({
    code: 200,
    total: list.length,
    data: list,
    aaa: list.filter((x, index) => {
      return index > start && index < start + req.pageSize
    })
  })
}
const fakeDire = (req, res, url) => {
  res.json({
    "code": 200,
    "message": null,
    "data": [
      {
        "id": 1,
        "name": "哲学",  // 名称
        "parentId": 0,  // 父节点id
        "isRoot": 1,    // 是否是根节点
        "creator": null,
        "children": [
          {
            "id": 2,
            "name": "人教版",
            "parentId": 1,
            "isRoot": 0,
            "creator": null,
            "children": [
              {
                "id": 3,
                "name": "一年级",
                "parentId": 2,
                "isRoot": 0,
                "creator": null,
                "children": [
                  {
                    "id": 4,
                    "name": "第一单元：人数世界",
                    "parentId": 3,
                    "isRoot": 0,
                    "creator": null,
                    "children": [
                      {
                        "id": 5,
                        "name": "论我从哪里来",
                        "parentId": 4,
                        "isRoot": 0,
                        "creator": null,
                        "children": []
                      }
                    ]
                  },
                  {
                    "id": 6,
                    "name": "第二单元：辩论学",
                    "parentId": 3,
                    "isRoot": 0,
                    "creator": null,
                    "children": [
                      {
                        "id": 7,
                        "name": "辩论学的鼻祖",
                        "parentId": 6,
                        "isRoot": 0,
                        "creator": null,
                        "children": []
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  })
}
const fakeTags = (_, res, url) => {
  res.json({ "code": 200, "message": "操作成功", "data": [{ "id": 1, "creator": null, "createTime": null, "updateTime": null, "value": "标签01" }, { "id": 2, "creator": null, "createTime": null, "updateTime": null, "value": "标签02" }, { "id": 3, "creator": null, "createTime": null, "updateTime": null, "value": "标签03" }] })
}
export default {
  'GET /question/querys': fakeQuerys,
  'GET /question/share': fakeShares,
  'GET /v1/subjectDictionary/directories': fakeDire,
  'GET /v1/tag/list': fakeTags
  
}