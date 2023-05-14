import { Icon } from "@/components/icon";
import { makeIcon, TabBarIcon } from "@/components/tab-bar-icon";
import { TabbedNavigator } from "@/components/tab-slot";
import cssStyles from "@/styles/root-layout.module.scss";
import { Pressable, StyleSheet } from "@bacons/react-views";
import { Link } from "expo-router";
import React from "react";
import {
  Platform,
  Text,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function HeaderLogo() {
  const isLargeHorizontal = useWidth(1264);
  const isSmallHorizontal = useWidth(768);

  return (
    <Link
      style={[
        { paddingVertical: 20, alignItems: "flex-start" },
        Platform.select({
          default: isSmallHorizontal &&
            !isLargeHorizontal && {
              paddingTop: 0,
              minHeight: 96,
              marginTop: 12,
              paddingBottom: 23,
              height: 96,
            },
          web: cssStyles.headerLink,
        }),
      ]}
      href="/"
      asChild
    >
      <Pressable>
        {({ hovered }) => (
          <Text
            style={[
              jsStyles.headerLogo,
              {
                backgroundColor: hovered ? "rgba(0, 0, 0, 0.1)" : "transparent",
              },
            ]}
          >
            <Icon
              style={Platform.select({
                default: !isLargeHorizontal && { display: "none" },
                web: cssStyles.wideVisible,
              })}
              name="logo"
              fill={Colors.dark}
            />
            <Icon
              style={Platform.select({
                default: isLargeHorizontal && { display: "none" },
                web: cssStyles.wideHidden,
              })}
              name="logo-small"
              fill={Colors.dark}
            />
          </Text>
        )}
      </Pressable>
    </Link>
  );
}

function useWidth(size) {
  if (typeof window === "undefined") {
    return true;
  }
  const { width } = useWindowDimensions();
  if (Platform.OS === "ios" || Platform.OS === "android") {
    return false;
  }
  return width >= size;
}

function SideBar({ visible }) {
  const isLarge = useWidth(1265);

  return (
    <View
      style={[
        jsStyles.sideBar,

        ...Platform.select({
          default: [
            !visible && {
              display: "none",
            },
            isLarge && {
              minWidth: NAV_MEDIUM_WIDTH,
            },
          ],

          web: [cssStyles.largeVisible, cssStyles.sideBar],
        }),
      ]}
    >
      <View
        style={[
          jsStyles.sidebarInner,
          ...Platform.select({
            default: [
              isLarge &&
                ({
                  width: NAV_MEDIUM_WIDTH,
                  minWidth: NAV_MEDIUM_WIDTH,
                  alignItems: "flex-start",
                } as const),
            ],
            web: [cssStyles.sideBarInner],
          }),
        ]}
      >
        <View
          zIndex={3}
          style={[
            jsStyles.sidebarInner2,
            Platform.select({
              default: !isLarge && {
                alignItems: "center",
              },
              web: cssStyles.sideBarHeader,
            }),
          ]}
        >
          <HeaderLogo />

          <View style={{ gap: 4, flex: 1 }}>
            <SideBarTabItem name="index" icon={makeIcon("home")}>
              Home
            </SideBarTabItem>
            <SideBarTabItem name="explore" icon={makeIcon("explore")}>
              Explore
            </SideBarTabItem>
            {/* Divider */}
          </View>
          <View>
            <SideBarTabItem name="/more" icon={makeIcon("more")}>
              More
            </SideBarTabItem>
          </View>
        </View>
      </View>
    </View>
  );
}

function TabBar({ visible }) {
  return (
    <View
      style={[
        {
          paddingBottom: useSafeAreaInsets().bottom,
        },
        Platform.select({
          default: {
            display: visible ? "flex" : "none",
          },
          web: cssStyles.smallVisible,
        }),
      ]}
    >
      <View style={jsStyles.nav}>
        {[
          { name: "index", id: "index", icon: "home" },
          { name: "explore", id: "explore", icon: "explore" },
          { name: "/more", id: "more", icon: "more" },
        ].map((tab, i) => (
          <TabBarItem key={i} name={tab.name} id={tab.id}>
            {({ focused, pressed, hovered }) => (
              <TabBarIcon
                color="black"
                style={[
                  {
                    paddingHorizontal: 8,
                  },
                  Platform.select({
                    web: {
                      transitionDuration: "100ms",
                      transform: hovered ? [{ scale: 1.1 }] : [{ scale: 1 }],
                    },
                  }),
                  pressed && {
                    transform: [{ scale: 0.9 }],
                    opacity: 0.8,
                  },
                ]}
                name={tab.icon}
                focused={focused}
              />
            )}
          </TabBarItem>
        ))}
      </View>
    </View>
  );
}

function useIsTabSelected(name: string): boolean {
  const { navigation } = TabbedNavigator.useContext();

  const state = navigation.getState();
  const current = state.routes.find((route, i) => state.index === i);

  return current?.name === name;
}

function TabBarItem({
  children,
  name,
  style,
  id,
}: {
  children?: any;
  name: string;
  style?: ViewStyle;
  id: string;
}) {
  const focused = useIsTabSelected(id);

  if (name.startsWith("/") || name.startsWith(".")) {
    return (
      <Link href={name} asChild style={style}>
        <Pressable>{(props) => children({ ...props, focused })}</Pressable>
      </Link>
    );
  }

  return (
    <TabbedNavigator.Link name={id} asChild style={style}>
      <Pressable>{(props) => children({ ...props, focused })}</Pressable>
    </TabbedNavigator.Link>
  );
}

function SideBarTabItem({
  children,
  icon,
  name,
}: {
  children: string;
  icon: (props: { focused?: boolean; color: string }) => JSX.Element;
  name: string;
}) {
  const isLarge = useWidth(1265);

  return (
    <TabBarItem
      name={name}
      id={name}
      accessibilityHasPopup="menu"
      style={{
        paddingVertical: 4,
        width: "100%",
      }}
    >
      {({ focused, hovered }) => (
        <View
          style={[
            {
              padding: 12,
              flexDirection: "row",
              alignItems: "center",
              borderRadius: 999,
              transitionProperty: ["background-color", "box-shadow"],
              transitionDuration: "200ms",
            },
            hovered && {
              backgroundColor: "rgba(0, 0, 0, 0.1)",
            },
          ]}
        >
          <View
            style={[
              {
                transitionTimingFunction: "cubic-bezier(0.17, 0.17, 0, 1)",
                transitionProperty: ["transform"],
                transitionDuration: "150ms",
              },
              hovered && {
                transform: [{ scale: 1.1 }],
              },
            ]}
          >
            {icon({
              focused,
              color: "#000",
            })}
          </View>

          <Text
            style={[
              {
                color: "#000",
                fontSize: 16,
                marginLeft: 16,
                marginRight: 16,
                lineHeight: 24,
              },
              Platform.select({
                default: {
                  display: isLarge ? "flex" : "none",
                },
                web: cssStyles.sideBarTabItemText,
              }),
              focused && {
                fontWeight: "bold",
              },
            ]}
          >
            {children}
          </Text>
        </View>
      )}
    </TabBarItem>
  );
}

export function ResponsiveNavigator() {
  const isRowLayout = useWidth(768);

  return (
    <TabbedNavigator
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarActiveTintColor: "black",
      }}
    >
      <View
        style={[
          jsStyles.flex1,
          Platform.select({
            default: {
              flexDirection: isRowLayout ? "row" : "column",
            },
            web: cssStyles.container,
          }),
        ]}
      >
        <SideBar visible={isRowLayout} />
        <AppHeader visible={!isRowLayout} />
        <TabbedNavigator.Slot />
        <TabBar visible={!isRowLayout} />
      </View>
    </TabbedNavigator>
  );
}

function AppHeader({ visible }) {
  const { top } = useSafeAreaInsets();
  const height = 60 + top;
  return (
    <>
      <View style={{ height }} />
      <View
        style={[
          Platform.select({
            default: !visible && {
              display: "none",
            },
            web: cssStyles.smallVisible,
          }),
          { height, paddingTop: top },
          jsStyles.appHeader,
        ]}
      >
        <Icon name="logo" fill={Colors.dark} />
      </View>
    </>
  );
}

const Colors = {
  lightGray: "rgba(230, 230, 230, 1)",
  dark: "rgba(41, 41, 41, 1)",
};

const NAV_MEDIUM_WIDTH = 244;

const jsStyles = StyleSheet.create({
  sideBar: {
    minWidth: 72,
    width: 72,
  },
  sidebarInner: {
    position: Platform.select({ web: "fixed", default: "absolute" }),
    height: "100%",
    maxHeight: "100%",
    alignItems: "stretch",
    borderRightWidth: 1,
    borderRightColor: Colors.lightGray,
    minWidth: 72,
    width: 72,
    paddingTop: 8,
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  flex1: { flex: 1 },
  appHeader: {
    zIndex: 10,
    backgroundColor: "white",
    position: Platform.select({ web: "fixed", default: "absolute" }),
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  sidebarInner2: {
    flex: 1,
    alignItems: "stretch",
    height: "100%",
    justifyContent: "space-between",
  },
  headerLogo: {
    margin: 0,
    display: "flex",
    // flex: 1,
    alignItems: "center",
    padding: 12,
    marginVertical: 4,
    borderRadius: 4,
    transitionProperty: ["background-color", "box-shadow"],
    transitionDuration: "200ms",
  },
  nav: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    justifyContent: "space-around",
    alignItems: "center",
    height: 49,
    paddingHorizontal: 16,
  },
});
