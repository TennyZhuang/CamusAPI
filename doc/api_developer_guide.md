# CaμsAPI 开发者使用手册

团队名称：鱻鱼
团队成员：庄天翼 叶曦 杨松洲 马子俊

---

## CaμsAPI 设计概要

#### API 设计初衷

  * 帮助校园开发者在有限的开发时间内完成清华课程助手项目

#### API 主要功能

  * 以新、旧两版网络学堂作为数据来源，可为开发者提供最新且准确的学生和教师的课业数据

#### API HOST

  * http://se.zhuangty.com:8000

#### API 使用方法

  1. 开发者获取 API 使用权限

  2. 开发者向 API 指定的 url 发起 HTTP POST Request， 提交数据的格式为 application/json

  3. API 返回 HTTP Response 给开发者，结果数据的格式为 application/json

#### API Reference

  * http://gh.zhuangty.com/CamusAPI/doc.html

    * CaμsAPI 在线使用手册, 由 `鱻鱼` 定期更新

  * http://docs.camusapi.apiary.io/#

    * CaμsAPI 在线测试和结果查看工具，可生成具有发起 HTTP Request 功能的代码段(包括Python/JS等多种语言版本)，供开发者使用

#### API 反馈

  * 若您对 API 接口设计有疑问，或者希望 API 能够提供一些新的服务，可随时联系 `鱻鱼` 团队。我们将诚恳地与您交流，并尽所能满足您的需求。

---

## CaμsAPI 接口定义

#### 1.  校内人员信息验证

功能介绍：

* 开发者通过此 API 验证校内人员身份，返回人员基本信息。

* 验证是 API 为校内人员提供课业数据服务的前提

接口: /users/register

请求类型：POST

请求参数：

```
{
    "apikey": "API Key",
    "apisecret": "API Secret Key",
    "username": "Valid username(e.g. 2014000000 or abc14)",
    "password": "Right-password-of-this-id"
}

```

&nbsp;

&nbsp;


参数说明：

| 字段 | 含义 | 备注 |
| --- | -- | -- |
| apikey | API授予开发者的账户编号 | 64位随机字符串 |
| apisecret | API授予开发者的账户密码 | 64位随机字符串 |
| username | 校内人员在校园网中的账户名 | 编号/非编号方式均可 |
| password | 校内人员在校园网中的账户密码 |             |

返回结果：

* 校内人员信息验证成功

```
Response 200

{
    "message": "Success",
    "username": "Request username",
    "existed": true/false,
    "information": {
        "studentnumber": "Stundent number",
        "department": "Department",
        "position": "undergrate/master/doctor/teacher",
        "email": "Email",
        "realname": "Real name"
    }
}
```
参数说明：

| 字段 | 含义 | 备注 |
| --- | -- | --|
| existed | 表明学生信息是否被重复验证，true为重复验证 | true 或者 false |

参数示例：
```
Response 200

{
  "message": "Success",
  "username": "mzj14",
  "existed": false,
  "information": {
    "studentnumber": "2014013408",
    "department": "软件学院",
    "position": "undergraduate",
    "email": "mzj14@mails.tsinghua.edu.cn"
    "realname": "马子俊",
  }
}

```

* 校内人员信息验证失败

```
Response 400

{
    "message": "Failure",
    "username": "Request username"
}
```
---

#### 2. 校内人员信息注销

功能介绍：

* 开发者告知 API 停止对校内人员课业数据服务

接口: /users/{username}/cancel

请求类型：POST

请求参数：
```
{
    "apikey": "API Key",
    "apisecret": "API Secret Key",
}
```

返回结果：

* 校内人员信息注销成功

```
Response 200

{
    "message": "Success",
    "username": "Request username",
}
```

* 校内人员信息注销失败 (即 username 非法)

```
Response 400
{
    "message": "Failure",
    "username": "Request username"
}
```

---

#### 3. 学生课程动态获取

功能介绍：

* 开发者通过此 API 获取学生本学期所学课程动态

接口: /learnhelper/{username}/courses

请求类型：POST

请求参数：
```
{
    "apikey": "API Key",
    "apisecret": "API Secret Key"
}
```

返回结果：

* 学生课程动态获取成功

```
Response 200
{
    "message": "Success",
    "username": "Request username",
    "courses": [
        {
            "coursename": "Course Name",
            "courseid": "Course ID",
            "unreadnotice": Unread Notice Number,
            "newfile": New File Number,
            "unsubmittedoperations": Unsubmitted Operations Number
        }
    ]
}
```

参数说明：

| 字段 | 含义 | 备注 |
| --- | -- | --|
| courseid | 课程ID | 非负整数 |
| unreadnotice | 课程未读公告数 | 非负整数 |
| newfile | 课程新文件数 | 非负整数 |
| unsubmittedoperations | 课程未交作业数 | 非负整数 |

参数示例：
```
Response 200

{
    "message": "Success",
    "username": "mzj14",
    "courses": [
        {
            "coursename": "计算机与网络体系结构(1)",
            "courseid": "34100294",
            "unreadnotice": 0,
            "newfile": 1,
            "unsubmittedoperations": 2
        },
        {
            "coursename": "软件工程(3)",
            "courseid": "34100325",
            "unreadnotice": 5,
            "newfile": 8,
            "unsubmittedoperations": 1
        }
    ]
}

```

* 学生课程动态获取失败 (即username非法)

```
Response 400

{
    "message": "Failure",
    "username": "Request username"
}
```

---

#### 4. 学生课程公告获取

功能介绍：

* 开发者通过此 API 获取学生本学期所学课程的公告

接口: /learnhelper/{username}/courses/{courseid}/notices

请求类型：POST

请求参数：
```
{
    "apikey": "API Key",
    "apisecret": "API Secret Key"
}
```

返回结果：

* 学生课程公告获取成功

```
Response 200

{
    "message": "Success",
    "username": "Request username",
    "notices": [
        {
            "sequencenum": Sequence Number,
            "title": "Title",
            "publishtime": "Publish Time",
            "state": "read/unread",
            "content": "Content"
        }
    ]
}
```

参数说明：

| 字段 | 含义 | 备注 |
| --- | -- | --|
| sequencenum | 公告序号  正整数，按发布时间编排，可保证一门功课的公告序号互异 |
| publishtime | 公告发布时间 | 值为字符串类型的时间戳 |
| state | 公告是否已读 | 值为"read"/"unread" |

参数示例：
```
Response 200

{
    "message": "Success",
    "username": "mzj14",
    "notices": [
        {
            "sequencenum"： 9,
            "title": "后八周组队报名",
            "publishtime": "1478016000",
            "state": "read",
            "content": "请大家在课程讨论“后八周大作业组队报名区”填写组队信息"
        },
        {
            "sequencenum"： 4,
            "title": "关于十一假期调课通知",
            "publishtime": "1474992000",
            "state": "read",
            "content": "根据学校十一假期的安排，下周四（10月6日）的课程调整到10月8日，请同学们互相转告。"
        }
    ]
}

```

* 学生课程公告获取失败 (即username/courseid非法)

```
Response 400
{
    "message": "Failure",
    "username": "Request username"
}
```

----

#### 5. 学生课程文件信息获取

功能介绍：

* 开发者通过此 API 获取学生本学期所学课程的文件信息

接口: /learnhelper/{username}/courses/{courseid}/documents

请求类型：POST

请求参数：
```
{
    "apikey": "API Key",
    "apisecret": "API Secret Key"
}
```

返回结果：

* 学生课程文件信息获取成功

```
Response 200
{
    "message": "Success",
    "username": "Request username",
    "documents": [
        {
            "sequencenum": Sequence Number,
            "title": "Title",
            "explanation": "Brief explanation",
            "updatingtime": "Updating Time",
            "state": "new/previous",
            "size": "Size of file",
            "url": "File url"
        }
    ]
}
```

参数说明：

| 字段 | 含义 | 备注 |
| --- | -- | --|
| explanation | 文件描述 |  |
| updatingtime | 文件更新时间 | 值为字符串类型的时间戳 |
| state | 文件是否已被下载 | 值为"new"/"previous" |
| url | 文件下载地址 |   |

参数示例：
```
Response 200

{
    "message": "Success",
    "username": "mzj14",
    "documents": [
        {
            "sequencenum": 15,
            "title": "软件体系结构",
            "explanation": "",
            "updatingtime": "1479830400",
            "state": "new",
            "size": "4.02M",
            "url": "http://learn.tsinghua.edu.cn//uploadFile//downloadFile_student.jsp？module_id=322&filePath=2n2e5nUtUFn1P2nPup00yEVhifXGf4C6n%2Bi7VVnkZbTdi3aFD9Gh41GEi%2BiQxdQTwve19JUn6Ms%3D&course_id=137929&file_id=1701009"
        }
    ]
}

```

* 学生课程文件信息获取失败 (即username/courseid非法)

```
Response 400

{
    "message": "Failure",
    "username": "Request username"
}
```

----

#### 6. 学生课程作业信息获取

功能介绍：

* 开发者通过此 API 获取学生本学期所学课程的作业信息

接口: /learnhelper/{username}/courses/{courseid}/assignments

请求类型：POST

请求参数：
```
{
    "apikey": "API Key",
    "apisecret": "API Secret Key"
}
```

返回结果：

* 学生课程作业信息获取成功

```
Response 200

{
    "message": "Success",
    "username": "Request username",
    "assignments": [
        {
            "sequencenum": Sequence Number,
            "title": "Title",
            "detail": "Detail of the assignment",
            "startdate": "Start date",
            "duedate": "Due Time",
            "scored": true/false
            "evaluatingteacher": "Evaluating teacher",
            "evaluatingdate": "Evaluating date",
            "comment": "Comment of teacher",
            "grade": Grade of the homework
        }
    ]
}
```

参数说明：

| 字段 | 含义 | 备注 |
| --- | -- | --|
| scored | 作业是否被批改 | true表示已被批改 |
| grade | 作业评分 | 浮点数 |


* 学生课程文件信息获取失败 (即username/courseid非法)

```
Response 400

{
    "message": "Failure",
    "username": "Request username"
}
```

---

#### 7. 学生周课表获取

功能介绍：

* 开发者通过此 API 获取学生本学期特定周的课表信息

接口: /schedule/{username}/{week}

参数说明：

| 字段 | 含义 | 备注 |
| --- | -- | --|
| week | 教学周周数 | 1 ~ 16的整数 |


请求类型：POST

请求参数：
```
{
    "apikey": "API Key",
    "apisecret": "API Secret Key"
}
```

返回结果：

* 学生周课表获取成功

```
Response 200

{
    "message": "Success",
    "username": "Request username",
    "classes": [
        {
            "coursid": "Course ID",
            "coursename": "Course name",
            "time": [day,period],
            "teacher": "Teacher",
            "classroom": "Classroom"
        }
    ]
}
```

参数说明：

| 字段 | 含义 | 备注 |
| --- | -- | --|
|  day  | 一周第几天 | 整数 1 ~ 7, 即周一 ~ 周日 |
| period | 课程是第几大节 | 整数 1 ~ 6 |


参数示例：

```
Response 200

{
    "message": "Success",
    "username": "mzj14",
    "classes": [
        {
            "coursid": "34100294",
            "coursename": "计算机与网络体系结构(1)",
            "time": [3,2],
            "teacher": "刘云浩",
            "classroom": "六教6A209"
        },
        {
            "coursid": "34100294",
            "coursename": "计算机与网络体系结构(1)",
            "time": [5,2],
            "teacher": "刘云浩",
            "classroom": "六教6A209"
        }
    ]
}
```


* 学生周课表获取失败 (即username/week非法)

```
Response 400

{
    "message": "Failure",
    "username": "Request username"
}
```

---

#### 8. 学生学期课表获取

功能介绍：

* 开发者通过此 API 获取学生本学期的课表信息

接口: /schedule/{username}

请求类型：POST

请求参数：
```
{
    "apikey": "API Key",
    "apisecret": "API Secret Key"
}
```

返回结果：

* 学生学期课表获取成功

```
Response 200

{
    "message": "Success",
    "username": "Request username",
    "classes": [
        {
            "coursid": "Course ID",
            "coursename": "Course name",
            "time": [day, period],
            "teacher": "Teacher",
            "classroom": "Classroom",
            "week": array of 0/1 whose length equals 16
        }
    ]

}
```


参数说明：

| 字段 | 含义 | 备注 |
| --- | -- | -- |
|  week  | 课程周数分布 | 值为字符串类型的长度为16的数组，元素为 0 或 1，表示某一周是否有此课 |

参数示例：

```
Response 200

{
    "message": "Success",
    "username": "mzj14",
    "classes": [
        {
            "coursid": "34100294",
            "coursename": "计算机与网络体系结构(1)",
            "time": [3,2],
            "teacher": "刘云浩",
            "classroom": "六教6A209",
            "week": [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        },
        {
            "coursid": "34100294",
            "coursename": "计算机与网络体系结构(1)",
            "time": [3,2],
            "teacher": "刘云浩",
            "classroom": "六教6A209",
            "week": [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        }
    ]
}
```


* 学生周课表获取失败 (即username非法)

```
Response 400

{
    "message": "Failure",
    "username": "Request username"
}
```

---

#### 9. 文图座位信息获取

功能介绍：

* 开发者通过此 API 获取当前文图的座位信息

接口: /library/hs

请求类型：POST

请求参数：
```
{
    "apikey": "API Key",
    "apisecret": "API Secret Key"
}
```

返回结果：

* 文图座位信息获取成功

```
Response 200

{
    "message": "Success",
    "username": "Request username",
    "areas": [
        {
            "name": "Name of study areas",
            "left": number of left seats,
            "used": number of used seats
        }
    ]
}
```


参数说明：

| 字段 | 含义 | 备注 |
| --- | -- | -- |
|  left  | 某区域剩余座位数 | 非负整数 |
|  used  | 某区域使用座位数 | 非负整数 |

参数示例：

```
Response 200

{
    "message": "Success",
    "areas": [
        {
            "name": "G层自修室",
            "left": 3,
            "used": 76
        },
        {
            "name": "F2A区",
            "left": 3,
            "used": 37
        }
    ]
}
```
