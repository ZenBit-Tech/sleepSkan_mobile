import { TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";

import { Text } from "src/components";
import { colors } from "src/theme";

import * as S from './styles'


interface BurgerModalProps {
    showBurgerModal: boolean
    onClose: () => void
    onModalOpen: () => void
    onDownload: () => void
    setDesiredService: (service: 'doctor_appointment' | 'prescription' | undefined) => void
}

export const BurgerModal = ({onClose, onDownload, setDesiredService, onModalOpen, showBurgerModal}: BurgerModalProps) => {
    
  const handleNoticeModalOpen = (desiredService: 'doctor_appointment' | 'prescription' | undefined) => {
    setDesiredService(desiredService)
    onClose()
    setTimeout(() => onModalOpen(), 500) 
  }
  
    return (
        <Modal
          isVisible={showBurgerModal}
          style={S.MODAL_WRAPPER}
          animationIn="fadeInUp"
          animationOut="fadeOutDown"  
          backdropOpacity={0.7}
          animationInTiming={100}
          animationOutTiming={100}
          backdropColor={'black'}
          onBackdropPress={onClose}
        >
        <View style={S.MODAL_CTR}>
          <View style={S.LINE} />
          <TouchableOpacity style={S.MODAL_TEXT_CTR} onPress={onDownload}>
            <Text 
              preset='header3bold'
              color={colors.darkText} 
              style={S.MODAL_TEXT}
              tx='results.downloadPDF'
            />
            
          </TouchableOpacity>
          <TouchableOpacity style={S.MODAL_TEXT_CTR} onPress={() => handleNoticeModalOpen('prescription')}>
            <Text 
              preset='header3bold'
              color={colors.darkText} 
              style={S.MODAL_TEXT} 
              tx='results.checkSnore'
            />
            
          </TouchableOpacity>
          <TouchableOpacity style={S.MODAL_TEXT_CTR} onPress={() => handleNoticeModalOpen('prescription')}>
            <Text 
              preset='header3bold'
              color={colors.darkText} 
              style={S.MODAL_TEXT}
              tx='results.orderEvaluation'
            />
          </TouchableOpacity>
          <TouchableOpacity style={S.MODAL_TEXT_CTR} onPress={() => handleNoticeModalOpen('doctor_appointment')}>
            <Text 
              preset='header3bold'
              color={colors.darkText} 
              style={S.MODAL_TEXT} 
              tx='results.docAppointment'
            />
          </TouchableOpacity>
        </View>
      </Modal>
      )}