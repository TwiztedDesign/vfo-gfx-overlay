angular.module('gfxApp',[])
    .controller('gfxController', ['$scope', function($scope) {
        $scope.edit = false;
        $scope.ready = false;
        $scope.isChanged = false;
        $scope.data = vff.state;
        $scope.data.elements= vff.state.elements || {};
        $scope.data.rundown= vff.state.rundown || [];


        let newRdItem = {
            name: 'New Item',
            elements:{}
        }

        let newElement = {
            type:'box',
            selected:false,
            visibility:true,
            show:true,
            rdItem:false,
            x:35,
            y:47,
            width:30,
            height:5,
            fontSize:2,
            opacity:1,
            bgColor:'#fff',
            bgVerticalFill:true,
            bgHorizontalFill:true,
            imgSrc:'',
            imgPosX:50,
            imgPosY:50,
            imgFill:'contain',
            color:'#0095FF',
            paddingX:2,
            paddingY:0,
            text:'New Element',
            minWidth:0,
            textAlign:'left',
            textVerticalAlign:'center',
            textBold:false,
            textItalic:false,
            index:0,
            customClass:''
        }

        function getElementKey(el){
            return Object.keys($scope.data.elements).find(key => $scope.data.elements[key] === el);
        }

        $scope.getSelectedRdItem = function(){
            return $scope.data.rundown.find(rd=>rd.selected);
        }

        $scope.getSelectedElement = function(){
            return Object.values($scope.data.elements).find(el=>el.selected);
        }


        $scope.newElement = function(){
            let el = JSON.parse(JSON.stringify(newElement));
            let key = Date.now();
            $scope.data.elements[key]=el;

            $scope.data.rundown.forEach((rd)=>{
                    rd.elements[key] = {};
                    rd.elements[key].text = el.text;
                    rd.elements[key].visibility = el.visibility;
                    rd.elements[key].imgSrc = el.imgSrc;

            });
        }

        $scope.deleteElement = function(el){
            let key = getElementKey(el);

            $scope.data.rundown.forEach((rd)=>{
                delete rd.elements[key];
            });

            delete $scope.data.elements[key];
        }

        $scope.selectNone = function(){
            Object.values($scope.data.elements).forEach((e)=>{
                e.selected=false;
            });
        }

        $scope.selectElement = function(el){
            $scope.selectNone();
            el.selected=true;
        }

        $scope.clearElementImg = function(el){
           el.imgSrc = '';
        }

        $scope.elementChange = function(el){
            let rd = $scope.getSelectedRdItem();
            let key = getElementKey(el);
            if(rd){
                rd.elements[key] = {};
                rd.elements[key].text = el.text;
                rd.elements[key].visibility = el.visibility;
                rd.elements[key].imgSrc = el.imgSrc;
            }
        }

        $scope.addRdItem = function(){
            let rd={
                name : 'New Item',
                elements: {}
            }

            Object.keys($scope.data.elements).forEach((e)=>{
                rd.elements[e] = {};
                rd.elements[e].text = $scope.data.elements[e].text;
                rd.elements[e].visibility = $scope.data.elements[e].visibility;
                rd.elements[e].imgSrc = $scope.data.elements[e].imgSrc;
            });

            $scope.data.rundown.push(rd);

            $scope.playRdItem(rd);
        }

        $scope.updateRdItem = function(item){
            Object.keys($scope.data.elements).forEach((e)=>{
                item.elements[e] = {};
                item.elements[e].text = $scope.data.elements[e].text;
                item.elements[e].visibility = $scope.data.elements[e].visibility;
                item.elements[e].imgSrc = $scope.data.elements[e].imgSrc;
            });

            $scope.selectRdItem(item);
        }

        $scope.updateSelectedRdItem = function(){
            let rd = $scope.getSelectedRdItem();
            if(rd){
                Object.keys($scope.data.elements).forEach((e)=>{
                    rd.elements[e] = {};
                    rd.elements[e].text = $scope.data.elements[e].text;
                    rd.elements[e].visibility = $scope.data.elements[e].visibility;
                    rd.elements[e].imgSrc = $scope.data.elements[e].imgSrc;
                });
            }
        }

        $scope.toggleRdItem = function(item){
            if(!item.playing){
                $scope.playRdItem(item);
            }else{
                $scope.stopRdItem(item);
            }

            $scope.save();
        }

        $scope.playRdItem = function(item){
            if($scope.data.playingRdItem){
                $scope.stopRdItem($scope.data.playingRdItem);
            }

            $scope.selectRdItem(item);
            
            $scope.data.playingRdItem = item;

            item.playing= true;

            Object.keys(item.elements).forEach((e)=>{
                if($scope.data.elements[e]){
                    Object.assign($scope.data.elements[e], item.elements[e]);
                    $scope.data.elements[e].show = true;
                }
            });
        }

        $scope.stopRdItem = function(item){
            Object.values($scope.data.rundown).forEach((e)=>{
                e.playing=false;
            });

            Object.keys(item.elements).forEach((e)=>{
                if($scope.data.elements[e]){
                    $scope.data.elements[e].show = false;
                }
            });

            $scope.data.playingRdItem = undefined;
        }

        $scope.selectRdNone = function(event){
            Object.values($scope.data.rundown).forEach((e)=>{
                e.selected=false;
                e.rename=false;
            });

            Object.values($scope.data.elements).forEach((e)=>{
                e.rdItem=false;
            });
        }

        $scope.selectRdItem = function(item){
            if(item !== $scope.getSelectedRdItem()){
                $scope.selectRdNone();
                item.selected=true;

                Object.keys(item.elements).forEach((e)=>{
                    if($scope.data.elements[e]){
                        Object.assign($scope.data.elements[e], item.elements[e]);
                        $scope.data.elements[e].show = true;
                        $scope.data.elements[e].rdItem=true;
                    }
                });
            }
        }

        $scope.renameRdItem = function(item){
            item.rename=true;
        }

        $scope.save = function(){
            vff.send();
        }
        
        vff.ready(()=>{
            $scope.edit = vff.isController();
            $scope.ready = true;
            handleOrientation();
            $scope.$apply();
        });

        vff.onModeChange(() => {
            $scope.edit = vff.isController();
            handleOrientation();
            $scope.$apply();
        });

        vff.onStateChange(e => {
            $scope.$apply();
        });

        function handleOrientation() {
            if (!$scope.edit) {
                vff.transform(0,0,1,1,0);
            } else {
                vff.transform(0,0,1,1,0.25, 0.05, 1, 0.80);
            }
        }

        handleOrientation();
        window.addEventListener('resize', handleOrientation);

        vff.video.getInfo().then((data)=>{
            console.log(data);
        });

    }]);