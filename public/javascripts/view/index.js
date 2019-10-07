let app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope, $http) {
  $scope.model = {
    bankLogo: '',
    branchLogo: '',
    branchBackImageStyle: {},
    isImageMedia: true,
    imageMediaList: [],
    audioUrl: '',
    isAudioPlay: false,
    textMemo: '',
    isVideoMedia: false,
    videoUrl: '',
    mediaModuleList: [],
    currentMediaModuleID: 0,
    currentMediaModuleType: '',
    isFullScreen: false
  };

  $scope.initPage = function () {
    $scope.loadBranchSetting();
    $scope.loadMediaModuleList();
  };

  $scope.loadBranchSetting = function(){
    $http.get('/login/backImageSetting').then(function successCallback (response) {
      if(response.data.err){
        bootbox.alert(response.data.msg);
        return false;
      }
      if(response.data.branchInfo === null){
        return false;
      }

      $scope.model.bankLogo = response.data.branchInfo.bankLogo;
      $scope.model.branchLogo = response.data.branchInfo.branchLogo;
      if(response.data.branchInfo.branchBackImage !== ''){
        $scope.model.branchBackImageStyle = {
          "background": "url(" + response.data.branchInfo.branchBackImage + ") no-repeat center center fixed",
          "background-size": "100%"
        };
      }
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.loadMediaModuleList = function(){
    $http.get('/index/mediaModuleList').then(function successCallback (response) {
      if(response.data.err){
        bootbox.alert(response.data.msg);
        return false;
      }
      if(response.data.mediaList === null){
        return false;
      }

      angular.forEach(response.data.mediaList, function (media, index) {
        $scope.model.mediaModuleList.push({
          mediaModuleID: media.mediaModuleID,
          mediaModuleName: media.mediaModuleName,
          mediaModuleType: media.mediaModuleType,
          mediaModuleClass: 'media-module'.concat(index + 1)
        });
      });
      $scope.model.currentMediaModuleID = $scope.model.mediaModuleList[0].mediaModuleID;
      $scope.model.currentMediaModuleType = $scope.model.mediaModuleList[0].mediaModuleType;
      $scope.model.isImageMedia = $scope.model.currentMediaModuleType === 'I';
      $scope.model.isVideoMedia = $scope.model.currentMediaModuleType === 'V';
      $scope.loadMedia();

    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.loadMedia = function(){
    $http.get('/index/mediaModuleDetail?mediaModuleID=' + $scope.model.currentMediaModuleID).then(function successCallback (response) {
      if(response.data.err){
        bootbox.alert(response.data.msg);
        return false;
      }
      if(response.data.mediaInfo === null){
        return false;
      }
      if(response.data.mediaInfo.mediaModuleDetailList !== null){
        let imageIndex = 0;
        $scope.model.imageMediaList.splice(0, $scope.model.imageMediaList.length);
        angular.forEach(response.data.mediaInfo.mediaModuleDetailList, function (mediaDetail) {
          //加载图文
          if($scope.model.isImageMedia){
            if(mediaDetail.mediaDetailType === 'I'){
              $scope.model.imageMediaList.push({
                mediaModuleNumber: imageIndex,
                mediaDetailID: mediaDetail.mediaDetailID,
                mediaModuleID: mediaDetail.mediaModuleID,
                mediaDetailType: mediaDetail.mediaDetailType,
                mediaDetailContent: mediaDetail.mediaDetailContent
              });
              imageIndex++;
            }
            if(mediaDetail.mediaDetailType === 'A'){
              $scope.model.audioUrl = mediaDetail.mediaDetailContent;
            }
            if(mediaDetail.mediaDetailType === 'T'){
              $scope.model.textMemo = mediaDetail.mediaDetailContent;
            }
          }
          //加载视频
          if($scope.model.isVideoMedia){
            $scope.model.videoUrl = mediaDetail.mediaDetailContent;
          }
        });
      }
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.onAudioPlay = function(){
    let audio = document.getElementById('background-audio');
    if(audio !== null){
      if(audio.paused)                     {
        audio.play();//audio.play();// 这个就是播放
        $scope.model.isAudioPlay = true;
      }else{
        audio.pause();// 这个就是暂停
        $scope.model.isAudioPlay = false;
      }
    }
  };

  $scope.onChangeMedia = function(mediaModuleID, mediaModuleType){
    $scope.model.currentMediaModuleID = mediaModuleID;
    $scope.model.currentMediaModuleType = mediaModuleType;
    $scope.model.isImageMedia = $scope.model.currentMediaModuleType === 'I';
    $scope.model.isVideoMedia = $scope.model.currentMediaModuleType === 'V';
    $scope.loadMedia();
  };

  $scope.onFullScreen = function(){
    let docElm = document.documentElement;
    if (docElm.webkitRequestFullScreen) {
      $scope.model.isFullScreen = true;
      docElm.webkitRequestFullScreen();
    }
  };

  $scope.onNormalScreen = function(){
    if (document.webkitCancelFullScreen) {
      $scope.model.isFullScreen = false;
      document.webkitCancelFullScreen();
    }
  };

  $scope.onSignOut = function(){
    commonUtility.delCookie(commonUtility.COOKIE_LOGIN_USER);
    commonUtility.delCookie(commonUtility.COOKIE_LOGIN_USERID);
    location.href = '/';
  };

  $scope.initPage();
});