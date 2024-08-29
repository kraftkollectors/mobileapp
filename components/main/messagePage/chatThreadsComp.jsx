import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import ChatThread from "./subComps/chatThread";
import { COLORS } from "../../../constants/themes/colors";
import ChatThreadLoadingTemp from "../../loadingTemplates/messagePage/chatThreadLoadingTemp";
import {
  LOCAL_STORAGE_PATH,
  StoreDataToMemory,
} from "../../../constants/utilities/localStorage";
import { useRouter } from "expo-router";

export default function ChatThreadsComp({
  threads,
  isLoading,
  userData,
  activeGroup,
  searchQuery,
}) {
  const router = useRouter();
  let userId = userData?._id;
  //FILTER THREAD
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    if (threads) {
      let cloneThread = [];

      if (activeGroup === "unread") {
        threads.forEach((thread) => {
          if (
            thread?.messageDoc.receiverId === userId &&
            thread?.messageDoc.status != "seen"
          ) {
            cloneThread.push(thread);
          }
        });
      } else {
        threads.forEach((thread) => {
          cloneThread.push(thread);
        });
      }

      //FILTER THROUGH SEARCH
      let finalSearch = cloneThread.filter(
        (str) =>
          str?.firstName
            .toLowerCase()
            .includes(searchQuery.trim().toLowerCase()) ||
          str?.lastName.toLowerCase().includes(searchQuery.trim().toLowerCase())
      );

      setConversations(finalSearch);
    }
  }, [threads, activeGroup, searchQuery]);

  const [tryLogin, setTryLogin] = useState(false);
  const [showLoginTxt, setSLT] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setSLT(true);
    }, 1500);
  }, []);

  useEffect(() => {
    if (tryLogin) {
      //SAVE CURRENT PATH
      StoreDataToMemory(LOCAL_STORAGE_PATH.redirectPath, "/main/messages/");

      setTimeout(() => {
        setTryLogin(false);
        router.replace("/auth/signin/");
      }, 2500);
    }
  }, [tryLogin]);

  return (
    <>
      {isLoading ? (
        <>
          <ChatThreadLoadingTemp />
          <ChatThreadLoadingTemp />
        </>
      ) : (
        <>
          {conversations && conversations.length > 0 ? (
            conversations.map((item, index) => (
              <ChatThread key={index} data={item} id={userId} />
            ))
          ) : (
            <View style={styles.noChats}>
              <View style={styles.noChatsIllustration}>
                <Image
                  source={require("../../../assets/icons/no-chats.png")}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </View>

              <View style={styles.noChatsInner}>
                <Text style={styles.noChatsText}>No conversations here</Text>
                {!userData && showLoginTxt && (
                  <>
                    {tryLogin ? (
                      <ActivityIndicator
                        size={"small"}
                        color={COLORS.blueNormal}
                      />
                    ) : (
                      <TouchableOpacity
                        onPress={() => {
                          setTryLogin(true);
                        }}
                      >
                        <Text style={styles.noChatsLoginText}>
                          Login to see chats
                        </Text>
                      </TouchableOpacity>
                    )}
                  </>
                )}
              </View>
            </View>
          )}
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  noChats: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    gap: 24,
    paddingTop: 120,
  },
  noChatsIllustration: {
    width: 160,
    height: 160,
    overflow: "hidden",
  },
  noChatsInner: {
    width: "100%",
    alignItems: "center",
    gap: 4,
  },
  noChatsText: {
    fontFamily: "EinaBold",
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.black400,
  },
  noChatsLoginText: {
    fontFamily: "EinaSemiBold",
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.blueNormal,
  },
});
