import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import Popover, { PopoverPlacement } from 'react-native-popover-view';
import Icon from 'react-native-vector-icons/Feather';
import Text from '../../../components/Text';
import Button from '../../../components/Button';
import theme from '../../../theme/themeExport';
import { useTranslation, CapitalizeFirst } from '../../../translations';
import useVisible from 'wappsto-blanket/hooks/useVisible';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  center: {
    justifyContent: 'center'
  },
  buttonRow:{
    backgroundColor: 'pink'
  },
  button: {
    minWidth:30,
    height:30,
    margin:5,
    paddingHorizontal: 5,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: 'white'
  },
  buttonDisabled: {
    backgroundColor: theme.variables.disabled
  },
  modalDropdown:{
    flex: 1,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  dropdownButton: {
    flexDirection:'row',
    alignItems: 'center'
  },
  typeIconStyle: {
    padding: 10,
    paddingRight:15
  },
  typeIconSelected: {
    backgroundColor: 'grey'
  },
  dropdownText: {
    width:'100%',
    height: 30,
    lineHeight: 30,
    paddingHorizontal: 10
  },
  chartContainer: {
    height:500,
    borderColor:'red',
    borderWidth: 1,
  },
  liveCircle: {
    width: 10,
    height: 10,
    borderRadius: 20,
    margin: 10
  },
  liveOn: {
    backgroundColor: 'green'
  },
  liveOff: {
    backgroundColor: 'red'
  }
});

const TYPES = ['clock', 'hash']; //, 'calendar'
const TIME_OPTIONS = [
  {t: 'lastXMinutes', number: 5, time: 'minute' },
  {t: 'lastXMinutes', number: 30, time: 'minute' },
  {t: 'lastXHours', number: 1, time: 'hour' },
  {t: 'lastXMonths', number: 1, time: 'month' }
];
const POINT_OPTIONS = [50, 100, 300, 1000];

const OPERATIONS = ['none', 'avg', 'count', 'max', 'min', 'sqrdiff', 'stddev', 'sum', 'variance'];
const GROUP_BY = ['none', 'microsecond', 'millisecond', 'second', 'minute', 'hour', 'day', 'week', 'month', 'quarter', 'year'];

const compute = ({ start, end }) => {
  if(!start || !end){
    return;
  }
  // diff in minutes
  const diff = (end.getTime() - start.getTime()) / (1000 * 60);
  if(diff <= 60){
    return;
  } else if(diff <= 60 * 24){
    return ['minute', 'avg'];
  } else if(diff <= 60 * 24 * 7){
    return ['hour', 'avg'];
  } else if(diff <= 60 * 24 * 30 * 18) {
    return ['day', 'avg'];
  } else {
    return ['week', 'avg'];
  }
}

const getDateOptions = (time, number = 1, autoCompute) => {
  const options = { end: new Date() };
  switch(time){
    case 'minute':
      options.start = new Date();
      options.start.setMinutes(options.start.getMinutes() - number);
      break;
    case 'hour':
      options.start = new Date();
      options.start.setHours(options.start.getHours() - number);
      break;
    case 'day':
      options.start = new Date();
      options.start.setDate(options.start.getDate() - number);
      if(autoCompute){
        [options.group_by, options.operation] = compute(options);
      }
      break;
    case 'week':
      options.start = new Date();
      options.start.setDate(options.start.getDate() - (7 * number));
      if(autoCompute){
        [options.group_by, options.operation] = compute(options);
      }
      break;
    case 'month':
      options.start = new Date();
      options.start.setMonth(options.start.getMonth() - number);
      if(autoCompute){
        [options.group_by, options.operation] = compute(options);
      }
      break;
    default:
      break;
  }
  options.start.setMilliseconds(0);
  options.end.setMilliseconds(0);
  return options;
}

const getXValueOptions = (number) => {
  const start = (new Date('01/01/2010')).toISOString();
  const end = (new Date()).toISOString();
  return { start, end, limit: number, value: { number }, type: 'hash', order: 'descending' };
}

const TypeSelector = React.memo(({ type, setOptions }) => {
  const onChangeType = (_, selectedType) => {
    setOptions((options) => options.type === selectedType ? options : {...options, type: selectedType, value: ''});
  }
  return (
    <ModalDropdown
      style={styles.button}
      defaultValue={type}
      options={TYPES}
      renderRow={(option, _, isSelected) => <Icon size={15} name={option} style={[styles.typeIconStyle, isSelected && styles.typeIconSelected]}/>}
      onSelect={onChangeType}
    >
      <View style={styles.row}>
        <Icon size={15} name={type} style={{marginRight:5}}/>
        <Icon size={10} name='chevron-down'/>
      </View>
    </ModalDropdown>
  );
});

const TimeValue = React.memo(({ value, setOptions }) => {
  const { t } = useTranslation();
  const onChangeValue = (_, selectedValue) => {
    const newOptions = getDateOptions(selectedValue.time, selectedValue.number, false);
    setOptions((options) => {
      const n = {...options, ...newOptions, value: selectedValue, type: 'clock'};
      delete n.limit;
      delete n.order;
      return n;
    });
  }
  return (
    <ModalDropdown
      style={styles.modalDropdown}
      defaultValue={CapitalizeFirst(t(value?.t || 'pleaseSelect', { number: value.number }))}
      defaultIndex={0}
      options={TIME_OPTIONS}
      textStyle={styles.dropdownText}
      onSelect={onChangeValue}
      renderButtonText={(option) => CapitalizeFirst(t(option.t, { number: option.number }))}
      renderRow={(option, _, isSelected) => (
        <Text content={CapitalizeFirst(t(option.t, { number: option.number }))} color={isSelected ? 'secondary' : 'primary'}/>
      )}
    />
  )
});

const LastXValue = React.memo(({ value, setOptions }) => {
  const { t } = useTranslation();
  const onChangeValue = (_, selectedValue) => {
    const newOptions = getXValueOptions(selectedValue);
    setOptions(options => ({...options, ...newOptions}));
  }
  return (
    <ModalDropdown
      style={styles.modalDropdown}
      defaultValue={CapitalizeFirst(t(value?.number ? 'lastXPoints' : 'pleaseSelect', { number: value.number }))}
      options={POINT_OPTIONS}
      textStyle={styles.dropdownText}
      onSelect={onChangeValue}
      renderButtonText={(option) => CapitalizeFirst(t('lastXPoints', { number: option }))}
      renderRow={(option, _, isSelected) => (
        <Text content={CapitalizeFirst(t('lastXPoints', { number: option }))} color={isSelected ? 'secondary' : 'primary'}/>
      )}
    />
  )
});

const CalendarValue = React.memo(({ value, setOptions }) => {
  return null;
});

const Compute = React.memo(({ operation, group_by, setOptions }) => {
  const { t } = useTranslation();
  const [ visible, show, hide ] = useVisible(false);
  const [ localOptions, setLocalOptions ] = useState({ operation: operation || 'none', group_by: group_by || 'none' });
  const disabled = (localOptions.operation !== 'none' && localOptions.group_by === 'none')
              || (localOptions.operation === operation && localOptions.group_by === group_by)
              || (localOptions.operation === 'none' && localOptions.group_by === 'none' && !operation && !group_by);

  const resetAndShow = () => {
    setLocalOptions({ operation: operation || 'none', group_by: group_by || 'none' });
    show();
  }

  const onChangeOperation = (_, selectedOperation) => {
    setLocalOptions(options => ({...options, operation: selectedOperation, group_by: selectedOperation === 'none' ? 'none' : options.group_by}));
  }

  const onChangeGroupBy = (_, selectedGB) => {
    setLocalOptions(options => ({...options, group_by: selectedGB}));
  }

  const apply = () => {
    setOptions(options => {
      const newOptions = {...options, ...localOptions}
      if(newOptions.operation === 'none'){
        delete newOptions.operation;
        delete newOptions.group_by;
      }
      return newOptions;
    });
    hide();
  }
  return(
    <Popover
      placement={PopoverPlacement.BOTTOM}
      isVisible={visible}
      onRequestClose={hide}
      from={
        <TouchableOpacity style={styles.button} onPress={resetAndShow}>
          <Icon name='more-horizontal'/>
        </TouchableOpacity>
      }
    >
      <ModalDropdown
        style={styles.button}
        defaultValue={localOptions.operation}
        options={OPERATIONS}
        renderButtonText={option => t(option)}
        renderRow={(option, _, isSelected) => (
          <Text content={CapitalizeFirst(t(option))} color={isSelected ? 'secondary' : 'primary'}/>
        )}
        onSelect={onChangeOperation}
      />
      {
        localOptions.operation !== 'none' &&
        <ModalDropdown
          style={styles.button}
          defaultValue={localOptions.group_by}
          options={GROUP_BY}
          renderButtonText={option => t(option)}
          renderRow={(option, _, isSelected) => (
            <Text content={CapitalizeFirst(t(option))} color={isSelected ? 'secondary' : 'primary'}/>
          )}
          onSelect={onChangeGroupBy}
        />
      }

      <Button
        disabled={disabled}
        onPress={apply}
        display='block'
        color='primary'
        text={CapitalizeFirst(t('apply'))}
      />
    </Popover>
  )
});

const defaultOptions = {
  type: TYPES[0],
  value: TIME_OPTIONS[0]
};
const ChartHeader = ({ options, setOptions, children}) => {
  const { t } = useTranslation();

  useEffect(() => {
    if(!options){
      const dates = getDateOptions(defaultOptions.value.time, defaultOptions.value.number, false);
      setOptions({...defaultOptions, ...dates});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if(!options){
    return null
  }

  const toggleLive = () => {
    setOptions({...options, live: !options.live});
  }

  const setArrowOptions = (newOptions, number) => {
    setOptions({...defaultOptions, ...newOptions, value: { ...options.value, number }});
  }

  let ValueComponent = null;
  let handleLeft, handleRight, leftDisabled, rightDisabled;
  switch(options.type){
    case 'clock':{
      ValueComponent = TimeValue;
      const diff = 1;
      const leftDiff = options.value.number + diff;
      const rightDiff = options.value.number - diff;
      switch(options.value.time){
        case 'minute':
          leftDisabled = leftDiff === 60;
          break;
        case 'hour':
          leftDisabled = leftDiff === 24;
          break;
        case 'day':
          leftDisabled = leftDiff === 7;
          break;
        case 'week':
          leftDisabled = leftDiff === 4;
          break;
        case 'month':
          leftDisabled = leftDiff === 2;
          break;
        default:
          leftDisabled = leftDiff === 1;
      }
      rightDisabled = rightDiff === 0;
      handleLeft = () => {
        const newOptions = getDateOptions(options.value.time, leftDiff, false);
        setArrowOptions(newOptions, leftDiff);
      }
      handleRight = () => {
        const newOptions = getDateOptions(options.value.time, rightDiff, false);
        setArrowOptions(newOptions, rightDiff);
      }
      break;
    }
    case 'hash':{
      ValueComponent = LastXValue;
      const diff = 10;
      const leftDiff = options.value.number + diff;
      const rightDiff = options.value.number - diff;
      leftDisabled = leftDiff > 2000;
      rightDisabled = rightDiff === 0;
      handleLeft = () => {
        const newOptions = getXValueOptions(leftDiff);
        setArrowOptions(newOptions, leftDiff);
      }
      handleRight = () => {
        const newOptions = getXValueOptions(rightDisabled);
        setArrowOptions(newOptions, rightDiff);
      }
      break;
    }
    case 'calendar':
      ValueComponent = CalendarValue;
      break;
  }

  return (
    <View>
      <TouchableOpacity style={theme.common.row} onPress={toggleLive}>
        <View style={[styles.liveCircle, options.live ? styles.liveOn : styles.liveOff]}/>
        <Text content={CapitalizeFirst(t('live'))} />
      </TouchableOpacity>
      {
        !options.live && 
        <>
          <View style={[styles.row, styles.buttonRow]}>
            <TypeSelector type={options.type} setOptions={setOptions}  />
            <ValueComponent value={options.value} setOptions={setOptions} />
            <Compute operation={options.operation} group_by={options.group_by} setOptions={setOptions}/>
          </View>
          {
            !!options.value &&
            <View style={[theme.common.row, styles.center]}>
              <TouchableOpacity style={[styles.button, leftDisabled && styles.buttonDisabled]} onPress={handleLeft} disabled={leftDisabled}>
                <Icon name='chevron-left'/>
              </TouchableOpacity>
              <Text content={CapitalizeFirst(t(options.type === 'clock' ? options.value.t : 'lastXPoints', { number: options.value.number }))}/>
              <TouchableOpacity style={[styles.button, rightDisabled && styles.buttonDisabled]} onPress={handleRight} disabled={rightDisabled}>
                <Icon name='chevron-right'/>
              </TouchableOpacity>
            </View>
          }
        </>
      }
      <View style={styles.chartContainer}>
        {children}
      </View>
    </View>
  );
};

export default ChartHeader;
