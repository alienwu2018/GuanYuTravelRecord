// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        speed : 100,
    },

    

    onLoad () {
        //定义全局变量
        this.left = false;   //left键的状态
        this.right = false;  //right键的状态
        this.up = false;    //up键的状态
        this.shift = false;  //shift键的状态
        this.q = false;     //a键的状态
        this.flag = true;    //跑步动作控制
        this.flag2 = true;   //加速动作控制
        this.flag3 = true;   //传送键控制

        // this.isdead = false;
        this.direction = 0;  //角色方向，0-向右 1-向右

        this.y = this.node.position.y; //记录原先站立时的Y轴位置

        this.Role = this.node.getComponent(cc.Sprite).spriteFrame //记录原先站立时候的精灵

        //监听键盘事件
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    //键盘事件
    onKeyDown: function (event) {
        switch(event.keyCode) {
            case cc.macro.KEY.left:   //左键
                this.left = true;
                break; 
            case cc.macro.KEY.right:  //右键
                this.right = true;
                break;
            case cc.macro.KEY.up:    //上键
                this.up = true;
                break;
            case cc.macro.KEY.q:      //q键
                this.q = true;
                break;
            case cc.macro.KEY.w:      //w键
                this.w = true;
                break;          
            case cc.macro.KEY.shift: //shift键
                this.shift = true;
                break;
        }
    },

    onKeyUp: function (event){
        switch(event.keyCode){
            case cc.macro.KEY.left:
                this.left = false;  
                this.flag = true;   //恢复动画初始状态
                //停止播放动画
                this.node.getComponent(cc.Animation).stop('GYmove');
                //角色恢复初始站立状态
                this.node.getComponent(cc.Sprite).spriteFrame =  this.Role;
                this.node.setPosition(cc.v3(this.node.position.x,this.y,0))
                break;
            case cc.macro.KEY.right:
                this.right = false;
                this.flag = true;   //恢复动画初始状态
                //停止播放动画
                this.node.getComponent(cc.Animation).stop('GYmove');
                //角色恢复初始站立状态
                this.node.getComponent(cc.Sprite).spriteFrame =  this.Role;
                this.node.setPosition(cc.v3(this.node.position.x,this.y,0))
                break;
            case cc.macro.KEY.up:
                this.up = false;
                this.flag3 = true;
                break;
            case cc.macro.KEY.q:
                this.q = false;
                break;
            case cc.macro.KEY.w:
                this.w = false;
                break;
            case cc.macro.KEY.shift:
                this.shift = false;
                this.flag2 = true;
                this.speed/=3; //速度恢复原来的速度
                break;
        }
    },

    start () {

    },

    update (dt) {
        //角色事件
        if(this.left){  
            //播放角色移动动画
            if (this.flag==true){
                this.node.getComponent(cc.Animation).play('GYmove');
            }
            this.node.scaleX = -1;   //角色向左转
            this.node.x -= this.speed*dt;
            this.flag = false;
        }else if(this.right){
            //播放角色移动动画
            if (this.flag==true){
                this.node.getComponent(cc.Animation).play('GYmove');
            }
            this.node.scaleX = 1;   //角色向右转
            this.node.x += this.speed*dt;
            this.flag = false;
        }else if(this.up){
            var Room = cc.find('Canvas/Room'); //获取传送门节点
            //计算关羽与传送门之间的距离
            console.log(Math.abs(Room.position.x-this.node.x));
            if (this.flag3 == true){
                if (0<=Math.abs(Room.position.x-this.node.x)&&Math.abs(Room.position.x-this.node.x)<=50){
                    cc.director.loadScene("part2");
                    console.log("传送....");
                }
            }
            this.flag3 = false;
        }
        if (this.shift){
            if(this.flag2){
                this.speed*=3 ;  //玩家按下shift键的时候移动速度提高3倍
            }
            this.flag2 = false;
        }
        if (this.q){
            this.node.getComponent(cc.Animation).play('GYskill01');
        }else if(this.w){
            this.node.getComponent(cc.Animation).play('GYskill02');
        }
    },
});
