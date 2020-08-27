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

import ZegoExpressEngine, {ZegoScenario, ZegoEventListener, ZegoSurfaceView, ZegoTextureView} from 'zego-express-engine-reactnative';
import { ZegoUser, ZegoView, ZegoVideoConfig, ZegoMediaPlayer } from 'zego-express-engine-reactnative/src/ZegoExpressDefines';


const granted = PermissionsAndroid.check(
  PermissionsAndroid.PERMISSIONS.CAMERA,
  PermissionsAndroid.RECORD_AUDIO
)

export default class App extends Component<{}> {

  constructor(props) {
    super(props)

    this.version = ""
  }

  _test_onLoginRoom(roomID, state, errorCode, extendedData) {
    console.log("JS2 room StateUpdate");
  }

  //核实
  async _checkPermission() {
    try {
        //返回Promise类型
        const granted = PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.CAMERA
        )
        granted.then((data)=>{
            this.show("是否获取读写权限"+data)
        }).catch((err)=>{
            this.show(err.toString())
        })
    } catch (err) {
        this.show(err.toString())
    }
  }

//请求多个
async requestMultiplePermission() {
  try {
      const permissions = [
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          PermissionsAndroid.PERMISSIONS.CAMERA
      ]
      //返回得是对象类型
      const granteds = await PermissionsAndroid.requestMultiple(permissions)
      var data = "是否同意地址权限: "
      if (granteds["android.permission.ACCESS_FINE_LOCATION"] === "granted") {
          data = data + "是\n"
      } else {
          data = data + "否\n"
      }
      data = data+"是否同意相机权限: "
      if (granteds["android.permission.CAMERA"] === "granted") {
          data = data + "是\n"
      } else {
          data = data + "否\n"
      }
      data = data+"是否同意存储权限: "
      if (granteds["android.permission.WRITE_EXTERNAL_STORAGE"] === "granted") {
          data = data + "是\n"
      } else {
          data = data + "否\n"
      }
      this.show(data)
  } catch (err) {
      this.show("check permission error: " + err.toString())
  }
}

  onClickA() {
    ZegoExpressEngine.instance().on('RoomStateUpdate', (roomID, state, errorCode, extendedData) => {
      console.log("JS onRoomStateUpdate: " + state + " roomID: " + roomID + " err: " + errorCode + " extendData: " + extendedData);
    });

    ZegoExpressEngine.instance().on('PublisherStateUpdate', (streamID, state, errorCode, extendedData) => {
      console.log("JS onPublisherStateUpdate: " + state + " streamID: " + streamID + " err: " + errorCode + " extendData: " + extendedData);
    });

    ZegoExpressEngine.instance().on('PlayerStateUpdate', (streamID, state, errorCode, extendedData) => {
      console.log("JS onPlayerStateUpdate: " + state + " streamID: " + streamID + " err: " + errorCode + " extendData: " + extendedData);
    });

    ZegoExpressEngine.instance().loginRoom("9999", new ZegoUser("lzp", "lzpppp"));
    ZegoExpressEngine.instance().startPreview(new ZegoView(findNodeHandle(this.refs.zego_preview_view), 0, 0));
    //ZegoExpressEngine.instance().startPublishingStream("333");

    //ZegoExpressEngine.instance().startPlayingStream("333", new ZegoView(findNodeHandle(this.refs.zego_play_view), 0, 0));
    /*ZegoExpressEngine.instance().setVideoConfig(new ZegoVideoConfig(5));
    ZegoExpressEngine.instance().getVideoConfig().then((config) => {
      console.log("cw: " + config.captureWidth + " ch: " + config.captureHeight + " ew: " + config.encodeWidth + " eh: " + config.encodeHeight + " br: " + config.bitrate + " fps: " + config.fps + " cid: " + config.codecID);
    });

    ZegoExpressEngine.instance().createMediaPlayer().then((player) => {
      this.mediaPlayer = player;
      this.mediaPlayer.setPlayerView(new ZegoView(findNodeHandle(this.refs.zego_preview_view), 0, 0));
      this.mediaPlayer.on("MediaPlayerStateUpdate", (player, state, errorCode) => {
        console.log("media player state: " + state + " err: " + errorCode);
      });
      this.mediaPlayer.on("MediaPlayerPlayingProgress", (player, millsecond) => {
        console.log("progress: " + millsecond);
      });
      this.mediaPlayer.loadResource("https://storage.zego.im/demo/201808270915.mp4").then((err) => {
        console.log("load resource err: " + err);
        this.mediaPlayer.start();
      });

    });*/
  }

  onClickLogin() {
    ZegoExpressEngine.instance().loginRoom("9999", new ZegoUser("lzp", "lzpppp"));
  }

  onClickLogout() {
    ZegoExpressEngine.instance().logoutRoom("9999");
  }

  onClickAddListener() {
    ZegoExpressEngine.instance().on('RoomStateUpdate', this._test_onLoginRoom);
  }

  onClickRemoveListener() {
    ZegoExpressEngine.instance().off('RoomStateUpdate', this._test_onLoginRoom);
    ZegoExpressEngine.instance().destroyMediaPlayer(this.mediaPlayer);
  }

  componentDidMount() {
    console.log("componentDidMount")

    ZegoExpressEngine.createEngine(1739272706, "1ec3f85cb2f21370264eb371c8c65ca37fa33b9defef2a85e0c899ae82c0f6f8", true, 0).then((engine) => {
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
                      title="点我！"/>
                <Text style={styles.sectionDescription}>
                  Edit <Text style={styles.highlight}>App.js</Text> to change this
                  screen and then come back to see your edits.
                </Text>
              </View>
              <Button onPress={this.onClickLogin.bind(this)}
                      title="loginRoom" />
              <Button onPress={this.onClickLogout.bind(this)}
                      title="logoutRoom" />
              <Button onPress={this.onClickAddListener.bind(this)}
                      title="addEventListener" />
              <Button onPress={this.onClickRemoveListener.bind(this)}
                      title="removeEventListener" />
              <View style={{height: 200}}>
                  <ZegoTextureView ref='zego_preview_view' style={{height: 200}}/>
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>See Your Changes</Text>
                <Text style={styles.sectionDescription}>
                  <ReloadInstructions />
                </Text>
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
