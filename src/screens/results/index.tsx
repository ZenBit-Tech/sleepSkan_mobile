import React, { useEffect, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path, Line, Circle, Rect, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { MainHeader, Screen, Text } from 'src/components';
import { colors } from 'src/theme';
import { RISK } from 'src/models';
import { auth, profileInfo } from 'src/store/selectors';
import { getUserInfo } from 'src/services/user';
import { TxKeyPath } from 'src/i18n';

import * as S from './styles'


const { width } = Dimensions.get('window');


type ChartPoint = { t: number; y: number };

const defaultData: ChartPoint[] = Array.from({ length: 42 }, (_, i) => {
  const base = 30 + i * 1.8 + Math.sin(i / 2) * 8;
  const bump = i > 22 ? (i - 22) * 2.2 : 0;
  return { t: i, y: Math.max(15, base + bump + (Math.random() * 10 - 5)) };
});


const snorePerMin = 2
const avgIntervalSec = 34
const threshold = 45
const totalSleep = '7h 45m'
const peakDb = '90 dB'
const snoringPct = '10 %'
const snoringTime = '1h 20m'
const data = defaultData

const palette = {
  bg: '#0C1D2B',
  nightTop: '#0A1A26',
  nightBottom: '#091725',
  text: '#EAF2F9',
  textDim: 'rgba(234,242,249,0.8)',
  muted: 'rgba(234,242,249,0.6)',
  accent: '#F5C13D',             // yellow for “INTERMÉDIO”
  card: '#102234',
  cardBorder: 'rgba(255,255,255,0.06)',
  gaugeTrack: '#2B3C4B',
  gaugeFill: '#E9C65B',
  tabDim: 'rgba(234,242,249,0.55)',
  chartStroke: '#6FA7D6',
  chartFillTop: 'rgba(111,167,214,0.25)',
  chartFillBottom: 'rgba(111,167,214,0.02)',
  threshold: '#F06B6B',
  dot: '#0E1116',
};

export const SleepReportScreen = () => {

  const {t} = useTranslation();
  const authInfo = useSelector(auth);
  const user = useSelector(profileInfo)

  useEffect(() => {
    authInfo.uid && getUserInfo(authInfo.uid)
  }, [authInfo])

  const riskLevel = useMemo(() => user.profile?.risk, [user.profile])

  console.log(user)

  // ----- Chart metrics -----
  const chartW = width - 32 - 16; // screen padding + card inner padding
  const chartH = 220;
  const minY = 0;
  const maxY = Math.max(threshold + 20, ...data.map(p => p.y)) + 10;

  const pathInfo = useMemo(() => {
    if (!data.length) return { line: '', area: '' };

    const sx = (t: number) => {
      const minT = data[0].t;
      const maxT = data[data.length - 1].t || 1;
      return (t - minT) / (maxT - minT) * chartW;
    };
    const sy = (y: number) => chartH - (y - minY) / (maxY - minY) * chartH;

    let d = `M 0 ${sy(data[0].y)}`;
    data.forEach((p, i) => {
      const x = sx(p.t);
      const y = sy(p.y);
      d += ` L ${x} ${y}`;
    });

    // Area under curve down to baseline
    let a = `M 0 ${chartH} L 0 ${sy(data[0].y)}`;
    data.forEach(p => {
      a += ` L ${sx(p.t)} ${sy(p.y)}`;
    });
    a += ` L ${chartW} ${chartH} Z`;

    const circles = data
      .filter(p => p.y >= threshold) // “Detected Snores” above threshold
      .map(p => ({ cx: sx(p.t), cy: sy(p.y) }));

    const thresholdY = sy(threshold);

    return { line: d, area: a, circles, thresholdY };
  }, [data, chartW, chartH, minY, maxY, threshold]);

  // ----- Risk gauge progress -----
  const progress = riskLevel === RISK.LOW ? 0.35 : riskLevel === RISK.MODERATE ? 0.68 : 1;
  const gaugeW = width - 70;
  const gaugeFillW = Math.round(gaugeW * progress);

  const onModalOpen = () => {
    console.log('Burger')
  }

  const getRiskColor = (risk?: RISK) => {
    if (risk === RISK.LOW) return colors.green
    else if (risk === RISK.HIGH) return colors.red
    else if (risk === RISK.MODERATE) return colors.yellow
    else return colors.beige
  }

  const getRiskText = useMemo((): TxKeyPath => {
    if (riskLevel === RISK.LOW) return 'results.low'
    else if (riskLevel === RISK.HIGH) return 'results.moderate'
    else if (riskLevel === RISK.MODERATE) return 'results.high'
    else return 'results.low'
  }, [riskLevel])

  return (
    <Screen 
      customHeader={<MainHeader 
                      withBack 
                      withBurger 
                      onRightIconPress={onModalOpen} />} 
      preset='scroll'
    >
      <View style={S.CONTAINER}>

          {/* Tabs + gauge */}
        <View style={S.TABS_ROW}>
          <Text tx='results.low' style={[styles.tab, { color: riskLevel === RISK.LOW ? palette.text : palette.tabDim }]} />
          <Text tx='results.moderate' style={[styles.tab, { color: riskLevel === RISK.MODERATE ? palette.text : palette.tabDim }]}>MÉDIO</Text>
          <Text tx='results.high' style={[styles.tab, { color: riskLevel === RISK.HIGH ? palette.text : palette.tabDim }]}>ALTO</Text>
        </View>
        <View style={[S.RISK_LEVEL, { width: gaugeW }]}>
          <View style={[S.RISK_LEVEL_FILL, { width: gaugeFillW, backgroundColor: getRiskColor(riskLevel) }]} />
        </View>
          {/* Risk & details */}
          <Text preset='headerBold' tx='results.title' style={S.TITLE} />
          <Text preset='headerBold' tx={getRiskText} style={[S.TITLE, { color: getRiskColor(riskLevel) }]} />

          <View style={{ marginTop: 12, paddingHorizontal: 18 }}>
            <Text preset='header5bold'>
             {t('results.snoreCount') } {snorePerMin} {avgIntervalSec} {t('results.perMin') }
            </Text>
            <Text preset='header5bold'>
            {t('results.interval') } {avgIntervalSec} {t('results.seconds') }
            </Text>
          </View>

          {/* Chart Card */}
          <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}>
            <Text style={[styles.cardTitle, { color: palette.text }]}>Snore Detection</Text>

            {/* Legend */}
            <View style={styles.legendRow}>
              <LegendDot type="line" label="Smoothed Energy" color={palette.chartStroke} />
              <LegendDot type="dash" label="Threshold" color={palette.threshold} />
              <LegendDot type="dot" label="Detected Snores" color={palette.text} />
            </View>

            <View style={{ borderRadius: 12, overflow: 'hidden', marginTop: 8 }}>
              <Svg width={chartW} height={chartH}>
                {/* gradient for area */}
                <Defs>
                  <SvgLinearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor={palette.chartFillTop} />
                    <Stop offset="1" stopColor={palette.chartFillBottom} />
                  </SvgLinearGradient>
                </Defs>

                {/* background */}
                <Rect x={0} y={0} width={chartW} height={chartH} fill="rgba(255,255,255,0.06)" />

                {/* threshold dashed line */}
                <Line
                  x1={0}
                  x2={chartW}
                  y1={pathInfo.thresholdY || 0}
                  y2={pathInfo.thresholdY || 0}
                  stroke={palette.threshold}
                  strokeDasharray="8,6"
                  strokeWidth={2}
                />

                {/* shaded area under curve */}
                <Path d={pathInfo.area} fill="url(#area)" />

                {/* main line */}
                <Path d={pathInfo.line} stroke={palette.chartStroke} strokeWidth={3} fill="none" />

                {/* detected snores (dots) */}
                {(pathInfo.circles || []).map((c, idx) => (
                  <Circle key={idx} cx={c.cx} cy={c.cy} r={3.5} fill={palette.text} stroke={palette.dot} strokeWidth={1} />
                ))}
              </Svg>
            </View>

            {/* simple X axis label */}
            <Text style={[styles.axisLabel, { color: palette.muted }]}>Time (s)</Text>
          </View>

          {/* Stats Grid */}
          <View style={S.GRID}>
            <StatCard
              title='results.snoreIntensity'
              value={peakDb}
              palette={palette}
            />
            <StatCard
              title='results.sleepTime'
              value={totalSleep}
              palette={palette}
            />
            <StatCard
              title='results.snoring'
              value={snoringPct}
              palette={palette}
            />
            <StatCard
              title='results.snoringTime'
              value={snoringTime}
              palette={palette}
            />
          </View>
      </View>
    </Screen>
  );
};

const LegendDot = ({ type, label, color }: { type: 'line' | 'dash' | 'dot', label: string, color: string }) => {
  return (
    <View style={styles.legItem}>
      <Svg width={22} height={12}>
        {type === 'line' && <Line x1={0} y1={6} x2={22} y2={6} stroke={color} strokeWidth={3} />}
        {type === 'dash' && <Line x1={0} y1={6} x2={22} y2={6} stroke={color} strokeWidth={2} strokeDasharray="6,5" />}
        {type === 'dot' && <Circle cx={11} cy={6} r={3} fill="#fff" />}
      </Svg>
      <Text style={styles.legText}>{label}</Text>
    </View>
  );
};

const StatCard = ({ title, value, palette }: { title: TxKeyPath; value: string; palette: any }) => {
  return (
    <LinearGradient
      colors={[colors.primary03, colors.primary03]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[S.STAT_CARD, { borderColor: palette.cardBorder }]}
    >
      <Text tx={title} preset='header4bold' style={S.CENTER_TEXT} />
      <Text preset='largeBold' style={S.CENTER_TEXT}>{value}</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  fill: { flex: 1 },
  header: {
    height: 48,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  brand: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 1,
  },
  icon: {
    fontSize: 22,
    fontWeight: '600',
    paddingHorizontal: 4,
  },
  
  tab: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
 

  badge: {
    marginTop: 6,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  card: {
    marginTop: 16,
    borderRadius: 16,
    padding: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  legendRow: {
    flexDirection: 'row',
    gap: 18,
    alignItems: 'center',
  },
  legItem: { flexDirection: 'row', alignItems: 'center' },
  legText: { color: 'rgba(234,242,249,0.85)', fontSize: 12, marginLeft: 6 },
  axisLabel: { textAlign: 'center', marginTop: 6, fontSize: 12 },


  statValue: { fontSize: 28, fontWeight: '900' },
});

export default SleepReportScreen;
