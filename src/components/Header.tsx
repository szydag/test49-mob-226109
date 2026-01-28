import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeftIcon } from 'react-native-heroicons/solid'; // Using heroicons for back button

type HeaderProps = {
  title: string;
  color: string;
  showBack?: boolean;
};

const Header: React.FC<HeaderProps> = ({ title, color, showBack = false }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: insets.top }} className={`w-full bg-[${color}] pb-4 px-4 flex-row items-center`}>
      {showBack && (
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4 p-1">
          <ChevronLeftIcon size={24} color="white" />
        </TouchableOpacity>
      )}
      <Text className="text-white text-2xl font-bold flex-1 text-center pr-10" style={showBack ? { paddingRight: 40 } : {}}>
        {title}
      </Text>
    </View>
  );
};

export default Header;
