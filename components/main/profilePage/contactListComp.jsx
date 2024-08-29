import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import React from "react";
import { Octicons, SimpleLineIcons, FontAwesome6 } from "@expo/vector-icons";
import { COLORS } from "../../../constants/themes/colors";
import { FORMAT_TIME_STRING_12H } from "../../../constants/utilities";

export default function ContactListComp({ profile, artisan }) {
  return (
    <View style={styles.contactListComp}>
      {/**CONTACT INFO */}
      <View style={styles.contactSectionBlocks}>
        <Text style={styles.contactSectionTitle}>Contact Info</Text>

        <View style={styles.contactDetailsBlock}>
          {/** */}
          <View style={styles.listTab}>
            <View style={styles.listTabLeft}>
              <View style={styles.ltIcon}>
                <Octicons name="clock" size={24} color={COLORS.black300} />
              </View>
              <Text style={styles.ltTitle}>Work Hour</Text>
            </View>
            <View>
              {!artisan || !artisan.workHourFrom ? (
                <Text style={styles.notAddedText}>Nil</Text>
              ) : (
                <Text style={styles.ltValue}>
                  {FORMAT_TIME_STRING_12H(artisan?.workHourFrom)} -{" "}
                  {FORMAT_TIME_STRING_12H(artisan?.workHourTo)}
                </Text>
              )}
            </View>
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
          {/** */}
          <View style={styles.listTab}>
            <View style={styles.listTabLeft}>
              <View style={styles.ltIcon}>
                <Octicons name="globe" size={24} color={COLORS.black300} />
              </View>
              <Text style={styles.ltTitle}>Website</Text>
            </View>
            {!artisan || !artisan.website ? (
              <Text style={styles.notAddedText}>Nil</Text>
            ) : (
              <TouchableOpacity>
                <Text style={styles.ltValueLink} numberOfLines={1}>
                  {artisan?.website}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          {/** */}
        </View>
      </View>

      {/**SOCIAL INFO */}
      <View style={styles.contactSectionBlocks}>
        <Text style={styles.contactSectionTitle}>Social Links</Text>

        {artisan &&
        (artisan.instagram ||
          artisan.twitter ||
          artisan.facebook ||
          artisan.linkedin) ? (
          <View style={styles.contactDetailsBlock}>
            {/**INSTAGRAM */}
            {artisan.instagram != "" && (
              <View style={styles.listTab}>
                <View style={styles.listTabLeft}>
                  <View style={styles.ltIcon}>
                    <SimpleLineIcons
                      name="social-instagram"
                      size={24}
                      color={COLORS.black300}
                    />
                  </View>
                  <Text style={styles.ltTitle}>Instagram</Text>
                </View>
                <TouchableOpacity style={styles.ltSocialBtn}>
                  <Text style={styles.ltSocialLink} numberOfLines={1}>
                    View Profile
                  </Text>
                  <Octicons
                    name="link-external"
                    size={16}
                    color={COLORS.blueNormal}
                  />
                </TouchableOpacity>
              </View>
            )}
            {/** */}
            {/**TWITTER */}
            {artisan.twitter != "" && (
              <View style={styles.listTab}>
                <View style={styles.listTabLeft}>
                  <View style={styles.ltIcon}>
                    <FontAwesome6
                      name="x-twitter"
                      size={24}
                      color={COLORS.black300}
                    />
                  </View>
                  <Text style={styles.ltTitle}>Twitter</Text>
                </View>
                <TouchableOpacity style={styles.ltSocialBtn}>
                  <Text style={styles.ltSocialLink} numberOfLines={1}>
                    View Profile
                  </Text>
                  <Octicons
                    name="link-external"
                    size={16}
                    color={COLORS.blueNormal}
                  />
                </TouchableOpacity>
              </View>
            )}
            {/** */}
            {/**FACEBOOK */}
            {artisan.facebook != "" && (
              <View style={styles.listTab}>
                <View style={styles.listTabLeft}>
                  <View style={styles.ltIcon}>
                    <SimpleLineIcons
                      name="social-facebook"
                      size={24}
                      color={COLORS.black300}
                    />
                  </View>
                  <Text style={styles.ltTitle}>Facebook</Text>
                </View>
                <TouchableOpacity style={styles.ltSocialBtn}>
                  <Text style={styles.ltSocialLink} numberOfLines={1}>
                    View Profile
                  </Text>
                  <Octicons
                    name="link-external"
                    size={16}
                    color={COLORS.blueNormal}
                  />
                </TouchableOpacity>
              </View>
            )}
            {/** */}
            {/**LINKEDIN */}
            {artisan.linkedin != "" && (
              <View style={[styles.listTab, { borderBottomWidth: 0 }]}>
                <View style={styles.listTabLeft}>
                  <View style={styles.ltIcon}>
                    <SimpleLineIcons
                      name="social-linkedin"
                      size={24}
                      color={COLORS.black300}
                    />
                  </View>
                  <Text style={styles.ltTitle}>LinkedIn</Text>
                </View>
                <TouchableOpacity style={styles.ltSocialBtn}>
                  <Text style={styles.ltSocialLink} numberOfLines={1}>
                    View Profile
                  </Text>
                  <Octicons
                    name="link-external"
                    size={16}
                    color={COLORS.blueNormal}
                  />
                </TouchableOpacity>
              </View>
            )}
            {/** */}
          </View>
        ) : (
          <Text style={styles.notAddedText}>Not added yet</Text>
        )}
      </View>
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
  contactSectionTitle: {
    fontFamily: "EinaRegular",
    fontSize: Platform.OS === "ios" ? 14 : 16,
    lineHeight: 24,
    color: COLORS.black400,
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
    fontSize: Platform.OS === "ios" ? 12 : 14,
    lineHeight: 20,
    color: COLORS.black300,
  },
  ltValue: {
    fontFamily: "EinaSemiBold",
    fontSize: Platform.OS === "ios" ? 14 : 16,
    lineHeight: 24,
    color: COLORS.black400,
  },
  ltValueLink: {
    fontFamily: "EinaSemiBold",
    fontSize: Platform.OS === "ios" ? 14 : 16,
    lineHeight: 24,
    color: COLORS.blueNormal,
  },
  ltSocialBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ltSocialLink: {
    fontFamily: "EinaSemiBold",
    fontSize: Platform.OS === "ios" ? 12 : 14,
    lineHeight: 20,
    color: COLORS.blueNormal,
  },
  notAddedText: {
    fontFamily: "EinaRegular",
    fontSize: Platform.OS === "ios" ? 14 : 16,
    lineHeight: 24,
    color: COLORS.black300,
  },
});
