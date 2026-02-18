import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  Platform,
  InteractionManager,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
// import {LineChart} from 'react-native-gifted-charts';
import {useFocusEffect} from '@react-navigation/native';
//@ts-ignore
import {LineChart} from 'react-native-charts-wrapper';
import {processColor} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';

import {Loader, MainHeader, Modal, Screen, Text} from 'src/components';
import {colors} from 'src/theme';
import {RISK} from 'src/models';
import {auth as authSelector, profileInfo} from 'src/store/selectors';
import {getUserInfo} from 'src/services/user';
import {TxKeyPath} from 'src/i18n';
import {downloadPdfToDevice, fetchSessionJson} from 'src/services';
import {countSnorePercentage, downsampleMinMax, secondsToHM} from 'src/utils';
import {MainStack, SCREEN_WIDTH} from 'src/constants';
import {IS_ANDROID} from 'src/constants/common';
import {MainStackList} from 'src/navigation';

import * as S from './styles';
import {StatCard} from './components/card';
import {BurgerModal} from './components/burgerModal';
import {NoticeModal} from './components/noticeModal';

const snorePerMin = 2;
const avgIntervalSec = 34;
const threshold = 52;

export const SleepReportScreen = ({
  navigation,
}: StackScreenProps<MainStackList, MainStack.REPORT>) => {
  const {t} = useTranslation();
  const authInfo = useSelector(authSelector);
  const user = useSelector(profileInfo);
  const [resultsData, setResultsData] = useState<{value: number}[]>([]);
  const [ready, setReady] = useState(Platform.OS !== 'ios');
  const [nonce, setNonce] = useState(0);
  const [totalSleep, setTotalSleep] = useState<number>(0);
  const [totalSnore, setTotalSnore] = useState<number>(0);
  const [snorePercentage, setSnorePercentage] = useState<number>(0);
  const [snoreFrequency, setSnoreFrequency] = useState<number>(0);
  const [averageSnoreIntervalSec, setAverageSnoreIntervalSec] =
    useState<number>(0);
  const [trimmedLeadSeconds, setTrimmedLeadSeconds] = useState<number>(0);
  const [peak, setPeak] = useState<number>(0);
  const [showBurgerModal, setShowBurgerModal] = useState<boolean>(false);
  const [showNoticeModal, setShowNoticeModal] = useState<boolean>(false);
  const [desiredService, setDesiredService] = useState<
    'doctor_appointment' | 'prescription' | 'investigation' | undefined
  >(undefined);
  const [mmIdx, setMmIdx] = useState<number[]>([]);
  const [analyzeVersion, setAnalyzeVersion] = useState<'' | '-v1' | '-v2'>('');

  const chartWidth = useMemo(() => 2 * SCREEN_WIDTH, [SCREEN_WIDTH]);

  const SPL = useMemo(
    () => (user.profile?.SPL_at_0dBFS ? user.profile?.SPL_at_0dBFS : 86),
    [user.profile],
  );

  //===============react-native-charts-wrapper=====
  const onePointDuration = totalSleep / resultsData.length;

  const startTimeSec = useMemo(
    () =>
      user.profile?.start_recording_time &&
      user.profile?.start_recording_time + 30000,
    [user.profile?.start_recording_time, trimmedLeadSeconds],
  );

  const lineValues = useMemo(
    () => resultsData.map((p, i) => ({x: i * onePointDuration, y: p.value})),
    [resultsData, totalSleep],
  );

  const chartRef = useRef(null);
  const isIOS = Platform.OS === 'ios';
  const VISIBLE_POINTS = 35000;
  // start from 30 on the Y axis
  const Y_MIN = 30;

  //===============end=====

  useEffect(() => {
    authInfo.uid && getUserInfo(authInfo.uid);
  }, [authInfo]);

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== 'ios') return;
      let cancelled = false;
      InteractionManager.runAfterInteractions(
        () => !cancelled && setReady(true),
      );
      return () => {
        cancelled = true;
        setReady(false);
      };
    }, []),
  );

  // When we finally know width + have data on iOS, nudge a rerender once.
  useEffect(() => {
    if (Platform.OS !== 'ios') return;
    if (chartWidth > 0 && resultsData.length > 0) {
      const id = requestAnimationFrame(() => setNonce(n => n + 1));
      return () => cancelAnimationFrame(id);
    }
  }, [chartWidth, resultsData.length]);

  useEffect(() => {
    if (user.profile?.recording_results && authInfo.uid) {
      const response = fetchSessionJson(authInfo.uid, `session-result`);

      response
        .then(res => {
          const {values: mmVals, indices: mmIdxData} = downsampleMinMax(
            res.points,
            Math.floor(chartWidth / 2),
          );

          // const data = mmVals.map(v => ({ value: v + 94}));

          const data = res.points.map((v: number) => ({value: v + SPL}));
          setTotalSleep(res.totalSeconds);
          setTotalSnore(res.totalSnoringSec);
          setPeak(res.peakSnore);
          setSnorePercentage(
            res.snoringPercent
              ? res.snoringPercent.toFixed(0)
              : countSnorePercentage({
                  totalSleep: res.totalSeconds,
                  snore: res.totalSnoringSec,
                }),
          );
          setSnoreFrequency(
            res.snoreFrequency ? res.snoreFrequency.toFixed(1) : 0,
          );
          setAverageSnoreIntervalSec(
            res.averageSnoreIntervalSec
              ? res.averageSnoreIntervalSec.toFixed(0)
              : 0,
          );
          setTrimmedLeadSeconds(res.trimmedLeadSeconds);
          setResultsData(data);
          setMmIdx(mmIdxData);
        })
        .catch(err => {
          console.log('Error fetching json results', err);
          setResultsData([]);
        });
    }
  }, [user.profile, authInfo.uid, analyzeVersion]);

  const riskLevel = useMemo(() => user.profile?.risk, [user.profile]);

  // ----- Risk gauge progress -----
  const progress =
    riskLevel === RISK.LOW ? 0.35 : riskLevel === RISK.MODERATE ? 0.68 : 1;
  const gaugeW = SCREEN_WIDTH - 70;
  const gaugeFillW = Math.round(gaugeW * progress);

  const onModalOpen = () => {
    setShowBurgerModal(true);
  };

  const getRiskColor = (risk?: RISK) => {
    if (risk === RISK.LOW) return colors.green;
    else if (risk === RISK.HIGH) return colors.red;
    else if (risk === RISK.MODERATE) return colors.yellow;
    else return colors.beige;
  };

  const getRiskText = useMemo((): TxKeyPath => {
    if (riskLevel === RISK.LOW) return 'results.low';
    else if (riskLevel === RISK.HIGH) return 'results.moderate';
    else if (riskLevel === RISK.MODERATE) return 'results.high';
    else return 'results.low';
  }, [riskLevel]);

  const canRender = chartWidth > 0 && resultsData.length > 0 && ready;

  const handleDownload = async () => {
    setTimeout(
      () =>
        user.profile?.pdf_file &&
        downloadPdfToDevice(user.profile?.pdf_file, 'SleepScan_Report.pdf'),
      100,
    );
    setShowBurgerModal(false);
  };

  const scrollRef = useRef<ScrollView>(null);
  const yTicks = Array.from({length: 10 + 1}, (_, i) => 30 + i * 5);

  return (
    <Screen
      customHeader={
        <MainHeader
          withBack
          handleGoBack={() => navigation.navigate(MainStack.HOME)}
          withBurger
          onRightIconPress={onModalOpen}
        />
      }
      preset="scroll">
      <View style={S.CONTAINER}>
        {/* Tabs */}
        <View style={S.TABS_ROW}>
          <Text
            tx="results.low"
            style={[
              S.TAB,
              {
                color:
                  riskLevel === RISK.LOW ? colors.beige : colors.greyDark_06,
              },
            ]}
          />
          <Text
            tx="results.moderate"
            style={[
              S.TAB,
              {
                color:
                  riskLevel === RISK.MODERATE
                    ? colors.beige
                    : colors.greyDark_06,
              },
            ]}
          />
          <Text
            tx="results.high"
            style={[
              S.TAB,
              {
                color:
                  riskLevel === RISK.HIGH ? colors.beige : colors.greyDark_06,
              },
            ]}
          />
        </View>
        <View style={[S.RISK_LEVEL, {width: gaugeW}]}>
          <View
            style={[
              S.RISK_LEVEL_FILL,
              {width: gaugeFillW, backgroundColor: getRiskColor(riskLevel)},
            ]}
          />
        </View>
        {/* NEED FOR TEST */}
        {/* {user.profile?.label === 'test' && (
          <View style={S.TEST_CTR}>
            <TouchableOpacity
              onPress={() => setAnalyzeVersion('')}
              style={[
                S.TEST_BTN,
                analyzeVersion === '' && {borderColor: colors.blue_200},
              ]}>
              <Text
                text="Default"
                color={analyzeVersion === '' ? colors.white : colors.blue}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setAnalyzeVersion('-v1')}
              style={[
                S.TEST_BTN,
                analyzeVersion === '-v1' && {borderColor: colors.blue_200},
              ]}>
              <Text
                text="Version 1"
                color={analyzeVersion === '-v1' ? colors.white : colors.blue}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setAnalyzeVersion('-v2')}
              style={[
                S.TEST_BTN,
                analyzeVersion === '-v2' && {borderColor: colors.blue_200},
              ]}>
              <Text
                text="Version 2"
                color={analyzeVersion === '-v2' ? colors.white : colors.blue}
              />
            </TouchableOpacity>
          </View>
        )} */}
        {/* Risk & details */}
        <Text preset="headerBold" tx="results.title" style={S.TITLE} />
        <Text
          preset="headerBold"
          tx={getRiskText}
          style={[S.TITLE, {color: getRiskColor(riskLevel)}]}
        />

        <View style={S.DESCR_CTR}>
          <Text preset="header5bold">
            {t('results.snoreCount')} {snoreFrequency} {t('results.perMin')}
          </Text>
          <Text preset="header5bold">
            {t('results.interval')} {averageSnoreIntervalSec}{' '}
            {t('results.seconds')}
          </Text>
        </View>

        {/* Chart */}
        <View style={S.CHART_CTR}>
          <Text
            preset="smallBold"
            tx="results.detection"
            color={colors.textColor}
            style={S.CHART_TITLE}
          />
          {canRender ? (
            <ScrollView
              ref={scrollRef}
              horizontal
              showsHorizontalScrollIndicator={true}>
              <LineChart
                style={{height: 300, width: SCREEN_WIDTH * 2}}
                chartDescription={{text: ''}}
                legend={{enabled: false}}
                data={{
                  dataSets: [
                    {
                      values: lineValues,
                      label: '',
                      config: {
                        drawValues: false,
                        lineWidth: 1,
                        mode: 'CUBIC_BEZIER',
                        drawCircles: false,
                        color: processColor(colors.primary),

                        // area fill
                        drawFilled: true,
                        fillColor: processColor(colors.primary),
                        fillAlpha: 80,
                      },
                    },
                  ],
                }}
                xAxis={{
                  position: 'BOTTOM',
                  drawGridLines: false,
                  drawAxisLine: false,
                  valueFormatter: 'date',
                  valueFormatterPattern: 'HH:mm',
                  since: startTimeSec,
                  timeUnit: 'SECONDS',
                  granularityEnabled: true,
                  granularity: 1 * onePointDuration, // minimum axis-step (ms)
                  textColor: processColor(colors.greyDark_06),
                  // optional: hide x labels entirely
                  // drawLabels: false,
                }}
                yAxis={{
                  left: {
                    axisMinimum: Y_MIN,
                    drawGridLines: true,
                    textColor: processColor(colors.black),
                    axisLineColor: processColor(colors.greyDark_06),
                    axisLineWidth: StyleSheet.hairlineWidth,
                  },
                  right: {enabled: false},
                }}
                // keep Y labels visible; pan/zoom happens inside the chart view
                dragEnabled={true}
                scaleXEnabled={true}
                scaleYEnabled={false}
                pinchZoom={false}
                doubleTapToZoomEnabled={false}
                highlightPerDragEnabled={false}
                touchEnabled={true}
                viewPortOffsets={{
                  left: IS_ANDROID ? 55 : 25,
                  right: 20,
                  top: 0,
                  bottom: 20,
                }}
              />
            </ScrollView>
          ) : (
            // ? <ScrollView
            //   ref={scrollRef}
            //   horizontal
            //   showsHorizontalScrollIndicator={true}
            // >
            //     <LineChart
            //       width={chartWidth}
            //       height={300}
            //       data={resultsData}
            //       adjustToWidth
            //       initialSpacing={0}
            //       endSpacing={0}
            //       thickness={1}
            //       color={colors.primary}
            //       areaChart
            //       curved
            //       startFillColor={colors.primary}
            //       endFillColor1={colors.primary}
            //       startOpacity={0.8}
            //       endOpacity={0.1}
            //       dataPointsRadius={0}
            //       isAnimated={false}
            //       animationDuration={0}
            //       hideDataPoints
            //       yAxisOffset={25}
            //     />
            //     </ScrollView>
            <Loader size={50} />
          )}
        </View>
        {/* <Text text={`length: ${resultsData.length}`}/> */}
        {/* Stats Grid */}
        <View style={S.GRID}>
          <StatCard
            title="results.snoreIntensity"
            value={canRender ? `${Math.round(peak + 94)} dB` : ''}
          />
          <StatCard
            title="results.sleepTime"
            value={canRender ? secondsToHM(totalSleep) : ''}
          />
          <StatCard
            title="results.snoring"
            value={canRender ? `${snorePercentage}%` : ''}
            // value={countSnorePercentage({totalSleep, snore: totalSnore})}
          />
          <StatCard
            title="results.snoringTime"
            value={canRender ? secondsToHM(totalSnore) : ''}
          />
        </View>
      </View>
      <BurgerModal
        showBurgerModal={showBurgerModal}
        onClose={() => setShowBurgerModal(false)}
        onDownload={handleDownload}
        onModalOpen={() => setShowNoticeModal(true)}
        setDesiredService={setDesiredService}
      />
      <Modal
        isVisible={showNoticeModal}
        style={S.MODAL_WRAPPER}
        animationIn="fadeIn"
        animationOut="fadeOut"
        animationInTiming={200}
        onBackdropPress={() => setShowNoticeModal(false)}
        onClose={() => setShowNoticeModal(false)}>
        <NoticeModal
          desiredService={desiredService}
          userUid={authInfo.uid || ''}
          onClose={() => setShowNoticeModal(false)}
        />
      </Modal>
    </Screen>
  );
};
