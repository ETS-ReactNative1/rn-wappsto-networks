import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import Screen from '../../../components/Screen';
import MenuButton from '../../../components/MenuButton';
import List from '../../../components/List';
import DeviceItem from './DeviceItem';
import AddNetwork from './AddNetwork';
import theme from '../../../theme/themeExport';
import { useTranslation, CapitalizeEach, CapitalizeFirst } from '../../../translations';
import { iotNetworkListAdd, iotNetworkListRemove } from '../../../util/params';
import { isPrototype } from 'wappsto-blanket/util';
import { getServiceVersion } from 'wappsto-redux/util/helpers';
import useAppStateStream from '../../../hooks/useAppStateStream';
import useAddNetworkStream from '../../../hooks/useAddNetworkStream';

const DevicesListScreen = React.memo(({ navigation }) => {
  const { t } = useTranslation();
  const query = useMemo(() => ({
    expand: 1,
    limit: 10,
    order_by: getServiceVersion('network') === '' ? 'created' : 'meta.created',
    from_last: true,
    verbose: true
  }), []);

  useAppStateStream();
  useAddNetworkStream(iotNetworkListAdd, iotNetworkListRemove);

  return (
    <Screen>
      <List
        url='/network'
        query={query}
        addItemName={iotNetworkListAdd}
        removeItemName={iotNetworkListRemove}
        page={navigation.state.routeName}
        renderItem={({ item: network }) => (
          <>
            <View>
              <Text style={theme.common.listHeader}>
                { isPrototype(network) && <Text>({CapitalizeEach(t('prototype'))}) </Text> }
                { network.name ?
                  <>
                    <Text style={theme.common.H5}>{network.name}</Text>{'\n'}
                    <Text>{network.meta.id}</Text>
                  </>
                :
                  <Text>{network.meta.id}</Text>
                }
              </Text>
              {
                network.device.length === 0 ?
                <Text style={[theme.common.infoText, theme.common.secondary]}>
                  {CapitalizeFirst(t('infoMessage.networkIsEmpty'))}
                </Text>
                :
                network.device.map(id => (
                  <DeviceItem
                    key={id}
                    id={id}
                    navigation={navigation}
                    isPrototype={isPrototype(network)}
                  />
                ))
              }
            </View>
            <View style={theme.common.listFooter} />
          </>
        )}
      />
    </Screen>
  );
});

DevicesListScreen.navigationOptions = ({ navigation, screenProps: { t } }) => {
  return {
    ...theme.headerStyle,
    title: CapitalizeEach(t('pageTitle.main')),
    headerLeft: <MenuButton navigation={navigation} />,
    headerRight: <AddNetwork navigation={navigation} />,
  };
};

export default DevicesListScreen;
