import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import DefaultStatusBar from "../../../components/general/defaultStatusBar.comp";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../auth.style";
import ChoiceTab from "../../../components/auth/choiceTab.comp";
import SimpleTab from "../../../components/auth/simpleTab";
import { useRouter } from "expo-router";

export default function Signup() {
  const router = useRouter();
  const [socketConn, setSocketConn] = useState(false);

  function goBack() {
    router.back();
  }

  function goToSignIn() {
    router.replace("/auth/signin/");
  }

  //CHOICES
  function continueWithEmail() {
    router.push("/auth/signup/continue");
  }

  return (
    <>
      <DefaultStatusBar theme={"dark"} setSocket={setSocketConn} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topPart}>
          <View style={styles.onboardImgTab}>
            <Image
              source={require("../../../assets/photos/onboard-bg.png")}
              style={styles.onboardImg}
            />
          </View>
        </View>

        <View style={styles.innerBlock}>
          <View></View>

          <View style={styles.bottomPart}>
            <View style={styles.whiteLogoTab}>
              <Image
                source={require("../../../assets/photos/logo-white.png")}
                style={styles.whiteLogoImg}
              />
            </View>

            {/** */}
            <View style={styles.whiteFrameCont}>
              <TouchableOpacity onPress={goBack} style={styles.backBtn}>
                <Image
                  source={require("../../../assets/icons/arrowLeft.png")}
                  style={styles.backBtnImg}
                />
              </TouchableOpacity>

              <View style={styles.headingTextCont}>
                <Text style={styles.headingText}>Create a new account</Text>
                <View style={styles.subTextTab}>
                  <Text style={styles.subText}>Already have an account?</Text>
                  <TouchableOpacity onPress={goToSignIn}>
                    <Text style={styles.subTextLink}>Sign In</Text>
                  </TouchableOpacity>
                </View>
              </View>
              {/** */}
              <View style={styles.choiceBlock}>
                <ChoiceTab choice={"mail"} choiceFunction={continueWithEmail} />

                <SimpleTab />

                <ChoiceTab choice={"google"} choiceFunction={() => {}} />
              </View>
              {/** */}
              <Text style={styles.baseTextTab}>
                <Text style={styles.baseText}>
                  By signing up, you agree to our{" "}
                </Text>
                <TouchableOpacity>
                  <Text style={styles.baseTextLink}>
                    Terms, Conitions & Privacy Policy
                  </Text>
                </TouchableOpacity>
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}
