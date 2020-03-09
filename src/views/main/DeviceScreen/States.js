import React, { useMemo, useCallback } from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import { useSelector } from 'react-redux';
import ControlState from './ControlState';
import ReportState from './ReportState';
import RequestError from '../../../components/RequestError';
import { makeEntitiesSelector } from 'wappsto-redux/selectors/entities';
import theme from '../../../theme/themeExport';
import { useTranslation, CapitalizeFirst } from '../../../translations';
import useRequest from 'wappsto-blanket/hooks/useRequest';

const StatesComponent = React.memo(({ value }) => {
  const { t } = useTranslation();
  const id = value.meta.id;
  const url = '/value/' + id + '/state';
  const { request, send } = useRequest();
  const getEntities = useMemo(makeEntitiesSelector, []);
  const states = useSelector(state => getEntities(state, 'state', {parent: {type: 'value', id: id}}));

  const refresh = useCallback(() => {
    if (!request || request.status !== 'pending') {
      send({
        method: 'GET',
        url: url,
        query: {
          expand: 0
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request, url]);

  const reportState = states.find(s => s.type === 'Report');
  const controlState = states.find(s => s.type === 'Control');

  return (
    <View>
      {states.length !== 0 ? (
        <>
          <View style={theme.common.itemContent}>
            {reportState && <ReportState value={value} state={reportState} />}
            {reportState && controlState && <View style={theme.common.seperator} />}
            {controlState && <ControlState value={value} state={controlState} />}
          </View>
        </>
      ) : (
        <Text style={[theme.common.infoText, theme.common.secondary]}>
          {CapitalizeFirst(t('infoMessage.valueIsEmpty'))}
        </Text>
      )}
      {request && request.status === 'pending' && (
        <ActivityIndicator size='large' />
      )}
      <RequestError request={request} />
    </View>
  );
});

export default StatesComponent;
