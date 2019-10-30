import React, {Fragment} from 'react';
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import RequestError from './RequestError';

import theme from '../theme/themeExport';
import i18n, {CapitalizeFirst} from '../translations/i18n';
import {List, connect} from '../wappsto-components/List';
import {getItem} from '../wappsto-redux/selectors/items';

function mapStateToProps(state, componentProps) {
  const refreshItem =
    componentProps.refreshItem && getItem(state, componentProps.refreshItem);
  return {
    refreshItem,
  };
}

class ListComponent extends List {
  componentDidUpdate(prevProps) {
    super.componentDidUpdate.apply(this, arguments);
    if (prevProps.refreshItem !== this.props.refreshItem) {
      this.refresh();
    }
  }
  render() {
    const request = this.props.request;
    const data = [];
    this.props.items.forEach(item => {
      data.push({title: item.name || item.meta.id, data: [item]});
    });
    return (
      <View style={this.props.style || theme.common.container}>
        <SectionList
          keyExtractor={(item, index) => item.meta.id}
          sections={data}
          ListEmptyComponent={
            (!request || request.status !== 'pending') && (
              <Fragment>
                <Text styles={theme.common.infoText}>
                  {CapitalizeFirst(i18n.t('infoMessage.listIsEmpty'))}
                </Text>
                <TouchableOpacity
                  onPress={this.refresh}
                  style={[theme.common.button, theme.common.ghost]}>
                  <Text>{CapitalizeFirst(i18n.t('refresh'))}</Text>
                </TouchableOpacity>
              </Fragment>
            )
          }
          renderSectionHeader={this.props.renderSectionHeader}
          renderItem={this.props.renderItem}
          refreshing={
            (request &&
              request.status === 'pending' &&
              (!request.options.query || !request.options.query.offset)) ||
            false
          }
          onRefresh={this.refresh}
          onEndReached={this.loadMore}
          onEndReachedThreshold={0.01}
          ListFooterComponent={
            request &&
            request.status === 'pending' &&
            request.options.query.offset ? (
              <ActivityIndicator size="large" />
            ) : null
          }
        />
        <RequestError error={request} />
      </View>
    );
  }
}

export default connect(
  ListComponent,
  mapStateToProps,
);
