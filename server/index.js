import express from 'express';

const app = express();
// 登录
app.route('/user/login').post((req, res) => {
  res.send({
    code: 200,
    message: '登录成功'
  });
});
// 获取路由信息
app.route('/user/init').post((req, res) => {
  res.send({
    success: true,
    code: 0,
    message: '',
    data: {
      userId: '8a8028f2814265e5018160627c20043a',
      userName: 'gcjzry100',
      currentIdentify: {
        id: '8a8028f280bc3c920181088f233a0b10.8a8028f280bc3c920181088979f80b0d.8a8028f280bc3c9201810892f7f90b17',
        groupId: '8a8028f280bc3c920181088f233a0b10',
        groupCode: 'GDW_G_WITNESS_GROUP',
        groupName: '无人值守见证管理组',
        roleId: '8a8028f280bc3c920181088979f80b0d',
        roleCode: 'GDW_R_WITNESS_PERSON',
        roleName: '见证人员',
        organId: '8a8028f280bc3c9201810892f7f90b17',
        organCode: 'GDW_O_WITNESS_DEFAULT',
        organName: '无人值守见证默认组织',
        sourceId: null,
        sort: 0
      },
      identifyList: [
        {
          id: '8a8028f280bc3c920181088f233a0b10.8a8028f280bc3c920181088979f80b0d.8a8028f280bc3c9201810892f7f90b17',
          groupId: '8a8028f280bc3c920181088f233a0b10',
          groupCode: 'GDW_G_WITNESS_GROUP',
          groupName: '无人值守见证管理组',
          roleId: '8a8028f280bc3c920181088979f80b0d',
          roleCode: 'GDW_R_WITNESS_PERSON',
          roleName: '见证人员',
          organId: '8a8028f280bc3c9201810892f7f90b17',
          organCode: 'GDW_O_WITNESS_DEFAULT',
          organName: '无人值守见证默认组织',
          sourceId: null,
          sort: 0
        }
      ],
      systemName: '公共资源交易数字见证系统',
      menuList: [
        {
          resCode: 'GDW_WITNESS_PERFERENCE',
          visiable: '1',
          showChild: null,
          icon: null,
          index: 1,
          title: '无人值守见证',
          path: '/GDW_WITNESS_PERFERENCE',
          systemId: '8a8028f280bc3c92018108a9f2f70b22',
          type: null,
          children: [
            {
              resCode: 'WitnessTask/Witnessing',
              visiable: '1',
              showChild: null,
              icon: '',
              index: 3,
              title: '我的见证',
              systemId: '8a8028f280bc3c92018108a9f2f70b22',
              type: '0',
              children: []
            },
            {
              resCode: 'Workbench',
              visiable: '1',
              showChild: null,
              icon: '',
              index: 3,
              title: '见证工作台',
              systemId: '8a8028f280bc3c92018108a9f2f70b22',
              type: '0',
              children: []
            }
          ]
        }
      ],
      buttonList: [
        {
          code: 'BTN_ADD_OTHER_WITNESS_SUB_TASK',
          title: '选择其他任务',
          url: '',
          desc: ''
        },
        {
          code: 'BTN_ADD_WITNESS_ITEM',
          title: '新增见证事项',
          url: '',
          desc: ''
        },
        {
          code: 'BTN_ADD_WITNESS_SUB_TASK',
          title: '加入任务',
          url: '',
          desc: ''
        },
        {
          code: 'BTN_ASSIGN_ALLOCATE',
          title: '定向分配',
          url: '',
          desc: ''
        },
        {
          code: 'BTN_BATCH_APPROVE',
          title: '批量审核',
          url: '',
          desc: ''
        },
        {
          code: 'BTN_CONFIRM_WITNESS_RECORD',
          title: '全部确认',
          url: '',
          desc: ''
        },
        {
          code: 'BTN_FINISH_WITNESS_SUB_TASK',
          title: '结束见证',
          url: '',
          desc: ''
        },
        {
          code: 'BTN_RANDOM_ALLOCATE',
          title: '随机分配',
          url: '',
          desc: ''
        },
        {
          code: 'BTN_TRANSFER_WITNESS_SUB_TASK',
          title: '移交见证',
          url: '',
          desc: ''
        },
        {
          code: 'BTN_VIEW_WITNESS_VIDEO',
          title: '查看视频【页面按钮】',
          url: 'gtv/witness/media/list',
          desc: '页面按钮'
        },
        {
          code: 'BTN_WITNESS_RECOVERY',
          title: '恢复见证',
          url: '',
          desc: ''
        },
        {
          code: 'BTN_WITNESS_STOP',
          title: '暂停见证',
          url: '',
          desc: ''
        }
      ]
    }
  });
});

app.listen(3000, () => {
  console.log(`Example app listening on port ${3000}`);
});
