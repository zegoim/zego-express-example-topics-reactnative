/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Alert,
  Button,
  Text,
  StatusBar,
  findNodeHandle,
  PermissionsAndroid,
  Platform
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import ZegoExpressEngine, {ZegoTextureView, ZegoMixerTask, ZegoAudioConfig, ZegoAudioConfigPreset, ZegoMixerInputContentType, ZegoScenario} from 'zego-express-engine-reactnative';

const granted = (Platform.OS == 'android' ? PermissionsAndroid.check(
                                              PermissionsAndroid.PERMISSIONS.CAMERA,
                                              PermissionsAndroid.RECORD_AUDIO) : undefined);



// Developers can get appID from admin console.
// https://console.zego.im/dashboard
// for example:
//     const appID = 123456789;
const appID = 

// Developers should customize a user ID.
// for example:
//     const userID = "zego_benjamin";
const userID = ''

// Developers can get token from admin console.
// https://console.zego.im/dashboard
// Note: The user ID used to generate the token needs to be the same as the userID filled in above!
// for example:
//     const token = "04AAAAAxxxxxxxxxxxxxx";
const token = ''

export default class App extends Component<{}> {

  constructor(props) {
    super(props)

    this.version = ""
  }

  onClickA() {
    ZegoExpressEngine.instance().on('roomStateUpdate', (roomID, state, errorCode, extendedData) => {
      console.log("JS onRoomStateUpdate: " + state + " roomID: " + roomID + " err: " + errorCode + " extendData: " + extendedData);
    });

    ZegoExpressEngine.instance().on('IMRecvBroadcastMessage', (roomID, messageList) => {
      console.log("JS onIMRecvBroadcastMessage: " + " roomID: " + roomID + " messageList: " + messageList);
      for (let msg of messageList) {
        console.log("current broadcast msg: message: " + msg.message + " messageID" + msg.messageID + " sendTime: " + msg.sendTime + " from user :" + msg.fromUser.userID + " x " + msg.fromUser.userName); // "0", "1", "2",
      }
    });

    ZegoExpressEngine.instance().on('IMRecvBarrageMessage', (roomID, messageList) => {
      console.log("JS onIMRecvBarrageMessage: " + " roomID: " + roomID);
      for (let msg of messageList) {
        console.log("current barrage msg: message: " + msg.message + " messageID" + msg.messageID + " sendTime: " + msg.sendTime + " from user :" + msg.fromUser.userID + " x " + msg.fromUser.userName); // "0", "1", "2",
     }
    });

    ZegoExpressEngine.instance().on('IMRecvCustomCommand', (roomID, fromUser, command) => {
      console.log("JS onIMRecvCustomCommand: " + " roomID: " + roomID + " from user: " + fromUser.userID + " x " + fromUser.userName + " command: " + command);
    });

    ZegoExpressEngine.instance().on('publisherStateUpdate', (streamID, state, errorCode, extendedData) => {
      console.log("JS onPublisherStateUpdate: " + state + " streamID: " + streamID + " err: " + errorCode + " extendData: " + extendedData);
    });

    ZegoExpressEngine.instance().on('playerStateUpdate', (streamID, state, errorCode, extendedData) => {
      console.log("JS onPlayerStateUpdate: " + state + " streamID: " + streamID + " err: " + errorCode + " extendData: " + extendedData);
    });

    ZegoExpressEngine.instance().on('mixerSoundLevelUpdate', (soundLevels) => {
      /*soundLevels.array.forEach(element => {
        console.log("JS onMixerSoundLevelUpdate: " + element)
      });*/
      var level = soundLevels[0]

      console.log("JS onMixerSoundLevelUpdate: " + soundLevels[0] + " type of: " + typeof level)
      
    });

    ZegoExpressEngine.instance().on('mixerRelayCDNStateUpdate', (taskID, infoList) => {
      console.log("JS onMixerRelayCDNStateUpdate: " + taskID)
      infoList.forEach((item) => {
        console.log("item: " + item.url + " ,state: " + item.state + " ,reason: " + item.updateReason, " ,time: " + item.stateTime)
      })
    });

    ZegoExpressEngine.instance().loginRoom("9999", {"userID": userID, "userName": "zego"}, {token: token});
    ZegoExpressEngine.instance().startPreview({"reactTag": findNodeHandle(this.refs.zego_preview_view), "viewMode": 0, "backgroundColor": 0});
    ZegoExpressEngine.instance().startPublishingStream("333");
    ZegoExpressEngine.instance().startPlayingStream("333", {"reactTag": findNodeHandle(this.refs.zego_play_view), "viewMode": 0, "backgroundColor": 0});
  }

  onClickB() {
    ZegoExpressEngine.instance().createMediaPlayer().then((player) => {
      this.mediaPlayer = player;
      this.mediaPlayer.setPlayerView({"reactTag": findNodeHandle(this.refs.zego_media_view), "viewMode": 0, "backgroundColor": 0});
      this.mediaPlayer.on("mediaPlayerStateUpdate", (player, state, errorCode) => {
        console.log("media player state: " + state + " err: " + errorCode);
      });
      this.mediaPlayer.on("mediaPlayerPlayingProgress", (player, millsecond) => {
        //console.log("progress: " + millsecond);
      });
      this.mediaPlayer.loadResource("https://storage.zego.im/demo/201808270915.mp4").then((ret) => {
        console.log("load resource err: " + ret.errorCode);
        this.mediaPlayer.start();

        this.mediaPlayer.getAudioTrackCount().then((count) => {
          console.log(" get audio track count: " + count);
          this.mediaPlayer.setAudioTrackIndex(1);
        });
      });

    });
  }

  onClickC() {
    ZegoExpressEngine.instance().sendBroadcastMessage("9999", "test-boardcast-msg!!!!!!");
    ZegoExpressEngine.instance().sendBarrageMessage("9999", "test-danmaku-msg!!!!!!").then((ret) => {
      console.log("sendBarrageMessage: error: " + ret.errorCode + " message str: " + ret.messageID)
    });
    ZegoExpressEngine.instance().sendCustomCommand("9999", "testcommand?").then((ret) => {
      console.log("sendCustomCommand: error: " + ret.errorCode)
    });
  }

  onClickD() {
    const task = new ZegoMixerTask('mix-stream-rn')
    task.inputList = [{"streamID": "333", "contentType": ZegoMixerInputContentType.Video, "layout": {"x": 0, "y": 0, "width": 100, "height": 100}}]
    task.outputList = [{"target": "zzzz"}]
    //var task = {"taskID": "mix-stream-rn"}
    console.log("task soundlevel: " + task.enableSoundLevel)
    ZegoExpressEngine.instance().startMixerTask(task).then((result) => {
      console.log("start mixer task, error: " + result.errorCode + " extended data: " + result.extendedData)
    })
  }

  onClickE() {
    const task = new ZegoMixerTask('mix-stream-rn')
    task.inputList = [{"streamID": "333", "contentType": ZegoMixerInputContentType.Audio}]
    task.outputList = [{"target": "zzzz"}]
    ZegoExpressEngine.instance().stopMixerTask(task).then((result) => {
      console.log("stop mixer task, error: " + result.errorCode)
    })
  }

  componentDidMount() {
    console.log("componentDidMount")
    let profile = {appID: appID, scenario: ZegoScenario.General}
    
    ZegoExpressEngine.createEngineWithProfile(profile).then((engine) => {
        // 动态获取设备权限（android）
        if(Platform.OS == 'android') {
          granted.then((data)=>{
            console.log("是否已有相机、麦克风权限: " + data)
            if(!data) {
              const permissions = [
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                PermissionsAndroid.PERMISSIONS.CAMERA
              ]
              //返回得是对象类型
              PermissionsAndroid.requestMultiple(permissions)
              }
          }).catch((err)=>{
            console.log("check err: " + err.toString())
          })
        }

        engine.getVersion().then((ver) => {
          console.log("Express SDK Version: " + ver)
        });
    });
    
  }

  componentWillUnmount() {
    console.log('componentWillUnmount');
    //ZegoExpressEngine.instance().off('RoomStateUpdate');
    if(ZegoExpressEngine.instance()) {
      console.log('[LZP] destroyEngine')
      ZegoExpressEngine.destroyEngine();
    }
  }


  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <Header />

            <View style={styles.body}>
              <View style={styles.sectionContainer}>
              <Button onPress={this.onClickA.bind(this)}
                      title="点我进行推拉流"/>
              </View>
              <Text style={styles.sectionTitle}>本地预览</Text>
              <View style={{height: 200}}>
                  <ZegoTextureView ref='zego_preview_view' style={{height: 200}}/>
              </View>
              <Text style={styles.sectionTitle}>远端拉流</Text>
              <View style={{height: 200}}>
                  <ZegoTextureView ref='zego_play_view' style={{height: 200}}/>
              </View>
              <View style={styles.sectionContainer}>
              <Button onPress={this.onClickB.bind(this)}
                      title="点我进行网络媒体播放"/>
              </View>
              <View style={{height: 200}}>
                  <ZegoTextureView ref='zego_media_view' style={{height: 200}}/>
              </View>
              <Button onPress={this.onClickC.bind(this)}
                      title="点我发送 IM"/>
              <Button onPress={this.onClickD.bind(this)}
                      title="点我发起混流"/>
              <Button onPress={this.onClickE.bind(this)}
                      title="点我停止混流"/>
            </View>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
}

/*const App: () => React$Node = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Header />
          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
            <Button onPress={onClickA}
                    title="点我！"/>
              <Text style={styles.sectionDescription}>
                Edit <Text style={styles.highlight}>App.js</Text> to change this
                screen and then come back to see your edits.
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>See Your Changes</Text>
              <Text style={styles.sectionTitle}>See Your Changes</Text>
              <Text style={styles.sectionDescription}>
                <ReloadInstructions />
              </Text>
            </View>
            <View ref="zego_view" style={{height: 200}}>
              
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Debug</Text>
              <Text style={styles.sectionDescription}>
                <DebugInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Learn More</Text>
              <Text style={styles.sectionDescription}>
                Read the docs to discover what to do next:
              </Text>
            </View>
            <LearnMoreLinks />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};*/

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  container: StyleSheet.absoluteFillObject
});

//export default App;
