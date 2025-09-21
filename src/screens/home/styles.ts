import { StyleSheet } from 'react-native';
import { colors } from 'src/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  riskSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  riskIcon: {
    marginBottom: 16,
  },
  riskTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  riskDescription: {
    color: colors.white07,
    textAlign: 'center',
    marginBottom: 16,
    maxWidth: 320,
  },
  feedbackTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  feedbackTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.white,
    marginRight: 6,
  },
  feedbackInfoIcon: {
    marginTop: 2,
  },
  feedbackGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 32,
  },
  feedbackCard: {
    width: 140,
    height: 90,
    backgroundColor: colors.primary04,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
  },
  feedbackCardLabel: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  bottomButtonArea: {
    marginTop: 'auto',
    marginBottom: 32,
    width: '100%',
    alignItems: 'center',
  },
  outlinedButton: {
    borderColor: colors.white,
    borderWidth: 1,
    backgroundColor: 'transparent',
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: '100%',
  },
  outlinedButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  listCtr: {
    justifyContent: 'center', 
    gap: 15
  }
});
