// import { Link } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

export function ExternalLink({ href, children, style }: { href: string; children: React.ReactNode; style?: any }) {
  const handlePress = () => {
    WebBrowser.openBrowserAsync(href);
  };
  return (
    <TouchableOpacity onPress={handlePress} style={style}>
      {children}
    </TouchableOpacity>
  );
}
