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
        audioSource: {
            type: cc.AudioSource,
            default: null
        },
        player: {
            default: null,
            type: cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.speed = 100;
        this.flag = 0;   //0---向右 1---向左
        this.isdead = false;
        this.skillflag = false;
        this.x = this.node.position.x;
        this.distence = 250;  //记录华雄移动的最大距离
        this.node.getComponent(cc.Animation).play('HXmove');    

        this.GY = cc.find('Canvas/GY'); //获取关羽节点
        this.Hurt = cc.find('Canvas/hurt'); //获取伤害节点
        
        //监听键盘事件
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        // cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    Destroy(){
        this.node.destroy();
        this.Room = cc.find('Canvas/Room'); //获取传送门节点
        this.Room.setPosition(cc.v3(421,-103,0));
        this.Tips = cc.find('Canvas/tips');
        this.Tips.setPosition(cc.v3(421,-103,0));
        this.Tips.getComponent(cc.Animation).play('Tips');
        this.player.getComponent(cc.AudioSource).play();  //开启bgm
    },

    onKeyDown: function (event) {
        switch(event.keyCode) {
            case cc.macro.KEY.q:
                //如果关羽释放了技能，计算他们之间的距离
                if(Math.abs(this.node.position.x-this.GY.position.x)<=100){
                    this.flag = 3; //停止华雄的动作
                    // console.log(Math.abs(this.node.position.x-this.GY.position.x)<=10);
                    this.node.getComponent(cc.Animation).stop('HXmove');
                    this.skillflag = 0; //停止华雄的攻击动作;
                    this.isdead = true;  //华雄死亡
                    this.node.getComponent(cc.Animation).play('HXdead');  //播放华雄死亡动画
                    this.Hurt.setPosition(cc.v3(this.node.position.x-20,this.node.position.y,0));  //显示伤害数值
                    this.scheduleOnce(function(){ this.Hurt.destroy(); },0.3);
                    this.scheduleOnce(function(){ this.Destroy(); },5);
                }
                break;
            case cc.macro.KEY.w:
                //如果关羽释放了技能，计算他们之间的距离
                if(Math.abs(this.node.position.x-this.GY.position.x)<=100){
                    this.flag = 3; //停止华雄的动作
                    // console.log(Math.abs(this.node.position.x-this.GY.position.x)<=10);
                    this.node.getComponent(cc.Animation).stop('HXmove');
                    this.skillflag = 0; //停止华雄的攻击动作;
                    this.isdead = true;  //华雄死亡
                    this.node.getComponent(cc.Animation).play('HXdead');  //播放华雄死亡动画
                    this.Hurt.setPosition(cc.v3(this.node.position.x-20,this.node.position.y,0));  //显示伤害数值
                    this.scheduleOnce(function(){ this.Hurt.destroy(); },0.3);
                    this.scheduleOnce(function(){ this.Destroy(); },5);
                }
                break;
        }
    },    


    start () {
        
    },
    update (dt) {
        if (this.flag==0){
            if(this.node.position.x-this.x>=this.distence){
                // this.node.getComponent(cc.Animation).stop('HXmove');
                this.node.scaleX = -1;
                this.flag = 1;
                // this.node.getComponent(cc.Animation).play('HXmove');
            }else{
                this.node.x += this.speed*dt;
            }   
        } 
        if(this.flag==1){
            if(this.node.position.x<=this.x+1){
                // this.node.getComponent(cc.Animation).stop('HXmove');
                this.node.scaleX = 1;
                this.flag = 0;
                // this.node.getComponent(cc.Animation).play('HXmove');
            }else{
                this.node.x -= this.speed*dt;
            }
        }
        //如果关羽与华雄距离小于100的时候，引起华雄的仇恨
        if(this.GY.position.x<=this.node.position.x && this.node.position.x-this.GY.position.x<=100&&this.isdead == false){
            //停止走到
            this.flag = 2;
            this.node.getComponent(cc.Animation).stop('HXmove'); 
            this.node.scaleX = -1;   //面向关羽
            if (this.skillflag==false){
                this.player.getComponent(cc.AudioSource).pause();  //停止bgm
                this.audioSource.play();            //开启战斗bgm
                this.node.getComponent(cc.Animation).play('HXskill01'); //释放技能
            }
            this.skillflag = true;
        }else if (this.GY.position.x<=this.node.position.x && 1<this.node.position.x-this.GY.position.x<=2&&this.isdead == false){
            //关羽离开了仇恨距离
            if (this.flag==2){
                this.player.getComponent(cc.AudioSource).play();  //开启bgm
                this.audioSource.pause();            //停止战斗bgm
                this.node.scaleX = 1;  
                this.node.getComponent(cc.Animation).play('HXmove'); //华雄继续走动
                this.flag = 0;
            }
            this.skillflag = false;
        }
        if(this.GY.position.x>this.node.position.x && this.GY.position.x-this.node.position.x<=100 && this.isdead == false){
            //停止走到
            this.flag = 2;
            this.node.getComponent(cc.Animation).stop('HXmove'); 
            this.node.scaleX = 1;   //面向关羽
            if (this.skillflag==false){
                this.player.getComponent(cc.AudioSource).pause();  //停止bgm
                this.audioSource.play();            //开启战斗bgm
                this.node.getComponent(cc.Animation).play('HXskill01'); //释放技能
            }
            this.skillflag = true;
        }else if(this.GY.position.x>this.node.position.x && 2<this.GY.position.x-this.node.position.x<=3 && this.isdead == false){
            //关羽离开了仇恨距离
            if (this.flag==2){
                this.player.getComponent(cc.AudioSource).play();  //开启bgm
                this.audioSource.pause();            //停止战斗bgm
                this.node.scaleX = -1;  
                this.node.getComponent(cc.Animation).play('HXmove'); //华雄继续走动
                this.flag = 1;
            }
            this.skillflag = false;
        }
    },
});
