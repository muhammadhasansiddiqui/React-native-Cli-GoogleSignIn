import React from 'react';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const DrawerToggle = ({navigation}) => (
  <TouchableOpacity onPress={() => navigation.openDrawer()} style={{marginLeft: 15}}>
    <Icon name="menu-outline" size={28} color="#000" />
  </TouchableOpacity>
);

export default DrawerToggle;
