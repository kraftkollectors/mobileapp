import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import React from "react";
import * as Linking from "expo-linking";
import { Octicons, SimpleLineIcons, FontAwesome6 } from "@expo/vector-icons";
import { COLORS } from "../../../../constants/themes/colors";
import { FORMAT_TIME_STRING_12H } from "../../../../constants/utilities";

export default function ContactCard({ profile, artisan }) {
  async function openSocialHandle(link) {
    let url = "";

    if (link.includes("http")) {
      url = link;
    } else {
      url = `https://${link}`;
    }

    Linking.openURL(url);
  }

  return (
    <View style={styles.contactListComp}>
      {/**CONTACT INFO */}
      <View style={styles.contactSectionBlocks}>
        <View style={styles.contactDetailsBlock}>
          {/** */}
          <View style={styles.listTab}>
            <View style={styles.listTabLeft}>
              <View style={styles.ltIcon}>
                <Octicons name="clock" size={24} color={COLORS.black300} />
              </View>
              <Text style={styles.ltTitle}>Work Hour</Text>
            </View>
            <TouchableOpacity>
              {artisan && (
                <Text style={styles.ltValue}>
                  {FORMAT_TIME_STRING_12H(artisan?.workHourFrom)} -{" "}
                  {FORMAT_TIME_STRING_12H(artisan?.workHourTo)}
                </Text>
              )}
            </TouchableOpacity>
          </View>
          {/** */}
          {/** */}
          <View style={styles.listTab}>
            <View style={styles.listTabLeft}>
              <View style={styles.ltIcon}>
                <Octicons name="mail" size={24} color={COLORS.black300} />
              </View>
              <Text style={styles.ltTitle}>Email</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.ltValue} numberOfLines={1}>
                {profile?.email}
              </Text>
            </TouchableOpacity>
          </View>
          {/** */}
          {/**WEBSITE LINK */}
          {artisan?.website && (
            <View style={styles.listTab}>
              <View style={styles.listTabLeft}>
                <View style={styles.ltIcon}>
                  <Octicons name="globe" size={24} color={COLORS.black300} />
                </View>
                <Text style={styles.ltTitle}>Website</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  openSocialHandle(artisan?.website);
                }}
              >
                <Text style={styles.ltValueLink} numberOfLines={1}>
                  {artisan?.website}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {/** */}
        </View>
      </View>

      {/**SOCIAL INFO */}
      {(artisan?.instagram ||
        artisan?.twitter ||
        artisan?.facebook ||
        artisan?.linkedin) && (
        <View style={styles.contactSocialBlocks}>
          <Text style={styles.contactSocialTitle}>Social Links</Text>

          <View style={styles.contactSocialIconsBlock}>
            {/**INSTAGRAM */}
            {artisan?.instagram && (
              <TouchableOpacity
                onPress={() => {
                  openSocialHandle(artisan?.instagram);
                }}
                style={styles.csiCicrle}
              >
                <View style={styles.csiIcon}>
                  <SimpleLineIcons
                    name="social-instagram"
                    size={16}
                    color={COLORS.black400}
                  />
                </View>
              </TouchableOpacity>
            )}
            {/** */}
            {/**TWITTER */}
            {artisan?.twitter && (
              <TouchableOpacity
                onPress={() => {
                  openSocialHandle(artisan?.twitter);
                }}
                style={styles.csiCicrle}
              >
                <View style={styles.csiIcon}>
                  <FontAwesome6
                    name="x-twitter"
                    size={16}
                    color={COLORS.black400}
                  />
                </View>
              </TouchableOpacity>
            )}
            {/** */}
            {/**FACEBOOK */}
            {artisan?.facebook && (
              <TouchableOpacity
                onPress={() => {
                  openSocialHandle(artisan?.facebook);
                }}
                style={styles.csiCicrle}
              >
                <View style={styles.csiIcon}>
                  <SimpleLineIcons
                    name="social-facebook"
                    size={16}
                    color={COLORS.black400}
                  />
                </View>
              </TouchableOpacity>
            )}
            {/** */}
            {/**LINKEDIN */}
            {artisan?.linkedin && (
              <TouchableOpacity
                onPress={() => {
                  openSocialHandle(artisan?.linkedin);
                }}
                style={styles.csiCicrle}
              >
                <View style={styles.csiIcon}>
                  <SimpleLineIcons
                    name="social-linkedin"
                    size={16}
                    color={COLORS.black400}
                  />
                </View>
              </TouchableOpacity>
            )}
            {/** */}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contactListComp: {
    width: "100%",
    backgroundColor: COLORS.whiteBG,
    paddingLeft: 16,
    paddingTop: 12,
  },
  contactSectionBlocks: {
    width: "100%",
    paddingVertical: 8,
    gap: 8,
  },
  contactDetailsBlock: {
    width: "100%",
    gap: 12,
  },
  listTab: {
    width: "100%",
    height: 48,
    paddingVertical: 8,
    paddingRight: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  listTabLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ltIcon: {
    width: 24,
    height: 24,
  },
  ltTitle: {
    fontFamily: "EinaSemiBold",
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.black300,
  },
  ltValue: {
    fontFamily: "EinaRegular",
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.black900,
  },
  ltValueLink: {
    fontFamily: "EinaRegular",
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.blueNormal,
  },
  contactSocialBlocks: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
    paddingRight: 16,
  },
  contactSocialTitle: {
    fontFamily: "EinaSemiBold",
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.black300,
  },
  contactSocialIconsBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  csiCicrle: {
    width: 32,
    height: 32,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: COLORS.black100,
    alignItems: "center",
    justifyContent: "center",
  },
  csiIcon: {
    width: 16,
    height: 16,
  },
});
