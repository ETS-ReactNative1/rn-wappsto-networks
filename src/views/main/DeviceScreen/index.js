import React, { useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Screen from '../../../components/Screen';
import List from '../../../components/List';
import Value from './Value';
import { removeItem } from 'wappsto-redux/actions/items';
import { makeEntitySelector } from 'wappsto-redux/selectors/entities';
import { makeItemSelector } from 'wappsto-redux/selectors/items';
import theme from '../../../theme/themeExport';
import { selectedDeviceName } from '../../../util/params';

import DeviceSettings from '../DevicesListScreen/DeviceSettings';

const query = {
  expand: 3,
  order_by: 'meta.created'
};
const DeviceScreen = React.memo(({ navigation }) => {
  const dispatch = useDispatch();
  const getItem = useMemo(makeItemSelector, []);
  const selectedDevice = useSelector(state => getItem(state, selectedDeviceName));
  const getEntity = useMemo(makeEntitySelector, []);
  const device = useSelector(state => getEntity(state, 'device',selectedDevice));

  useEffect(() => {
    return () => {
      dispatch(removeItem(selectedDeviceName));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if(!device || !device.meta || !device.meta.id){
    navigation.goBack();
    return null;
  }
  const url = '/device/' + device.meta.id + '/value';
  return (
    <Screen>
      <List
        name={url}
        url={url}
        query={query}
        renderItem={({item}) => <Value item={item} />}
      />
    </Screen>
  );
});

DeviceScreen.navigationOptions = ({navigation}) => {

  return {
    ...theme.headerStyle,
    title: navigation.getParam('title', ''),
    headerRight: <DeviceSettings navigation={navigation} />
  };
};

export default DeviceScreen;