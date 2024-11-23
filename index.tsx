import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Modal, Pressable, ActivityIndicator } from 'react-native';

const App = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedButton, setSelectedButton] = useState('');
  const [counters, setCounters] = useState<Record<string, number>>({});
  const [previousCount, setPreviousCount] = useState<number>(0);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [paymentInProgress, setPaymentInProgress] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);

  const buttons = [
    { id: 1, title: 'Button 1', image: { uri: 'https://e7.pngegg.com/pngimages/298/457/png-clipart-red-circle-button-miscellaneous-button-png.png' } },
    { id: 2, title: 'Button 2', image: { uri: 'https://flexible.img.hani.co.kr/flexible/normal/970/777/imgdb/resize/2019/0926/00501881_20190926.JPG' } },
    { id: 3, title: 'Button 3', image: { uri: 'https://e7.pngegg.com/pngimages/298/457/png-clipart-red-circle-button-miscellaneous-button-png.png' } },
    { id: 4, title: 'Button 4', image: { uri: 'https://flexible.img.hani.co.kr/flexible/normal/970/777/imgdb/resize/2019/0926/00501881_20190926.JPG' } },
    { id: 5, title: 'Button 5', image: { uri: 'https://e7.pngegg.com/pngimages/298/457/png-clipart-red-circle-button-miscellaneous-button-png.png' } },
    { id: 6, title: 'Button 6', image: { uri: 'https://flexible.img.hani.co.kr/flexible/normal/970/777/imgdb/resize/2019/0926/00501881_20190926.JPG' } },
    { id: 7, title: 'Button 7', image: { uri: 'https://e7.pngegg.com/pngimages/298/457/png-clipart-red-circle-button-miscellaneous-button-png.png' } },
    { id: 8, title: 'Button 8', image: { uri: 'https://flexible.img.hani.co.kr/flexible/normal/970/777/imgdb/resize/2019/0926/00501881_20190926.JPG' } },
    { id: 9, title: 'Button 9', image: { uri: 'https://e7.pngegg.com/pngimages/298/457/png-clipart-red-circle-button-miscellaneous-button-png.png' } },
  ];

  const handlePress = (title: string) => {
    const ttsMessage = `${title}을 선택하셨습니다. 원하시는 작업을 선택해주세요: 구매는 YES(파란색), 취소는 NO(노란색), 수량 증가를 원하면 +(초록색), 수량 감소를 원하면 -(빨간색) 버튼을 눌러주세요.`;
    const speech = new window.SpeechSynthesisUtterance(ttsMessage);
    window.speechSynthesis.speak(speech);
    setSelectedButton(title);
    setPreviousCount(counters[title] || 0);
    setModalVisible(true);
  };

  const handleModalButtonPress = (buttonName: string) => {
    const ttsMessage = `${buttonName}을 클릭하셨습니다.`;
    const speech = new window.SpeechSynthesisUtterance(ttsMessage);
    window.speechSynthesis.speak(speech);
  };

  const handlePayment = () => {
    const paymentMessage = "결제가 진행중입니다. 잠시만 기다려 주세요";
    const paymentSpeech = new window.SpeechSynthesisUtterance(paymentMessage);
    window.speechSynthesis.speak(paymentSpeech);
    setPaymentInProgress(true);
    setModalVisible(false);
    setInfoModalVisible(false);
    setPaymentModalVisible(true);
    setTimeout(() => {
      const completionMessage = "결제가 완료되었습니다";
      const completionSpeech = new window.SpeechSynthesisUtterance(completionMessage);
      window.speechSynthesis.speak(completionSpeech);
      // Reset state and return to initial screen
      setCounters({});
      setSelectedButton('');
      setPaymentInProgress(false);
      setPaymentModalVisible(false);
    }, 10000);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        {buttons.map((button) => (
          <TouchableOpacity key={button.id} style={styles.button} onPress={() => handlePress(button.title)}>
            <Image source={button.image} style={styles.image} />
            <Text style={styles.text}>{button.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <ScrollView horizontal contentContainerStyle={styles.footerContainer} showsHorizontalScrollIndicator={false}>
          {Object.keys(counters).map((key) =>
            counters[key] > 0 ? (
              <View key={key} style={styles.footerItem}>
                <Text style={styles.footerText}>{key} * {counters[key]}</Text>
                <Pressable
                  style={[styles.counterButton, styles.buttonMinus]}
                  onPress={() => {
                    setCounters((prevCounters) => {
                      const newCounters = { ...prevCounters };
                      delete newCounters[key];
                      return newCounters;
                    });
                    const ttsMessage = `${key} 항목이 제거되었습니다`;
                    const speech = new window.SpeechSynthesisUtterance(ttsMessage);
                    window.speechSynthesis.speak(speech);
                  }}
                >
                  <Text style={styles.textStyle}>-</Text>
                </Pressable>
              </View>
            ) : null
          )}
        </ScrollView>
      </View>
      <TouchableOpacity style={styles.infoButton} onPress={() => {
          setInfoModalVisible(true);
          const infoTTSMessage = Object.keys(counters).length > 0
            ? Object.keys(counters).map((key) => counters[key] > 0 ? `${key}를 ${counters[key]}개 선택하셨습니다.` : '').filter(Boolean).join(' ')
            : '선택된 항목이 없습니다.';
          const infoSpeech = new window.SpeechSynthesisUtterance(infoTTSMessage);
          window.speechSynthesis.speak(infoSpeech);
          const aattsMessage = `결제하기를 원하실경우 결제하기버튼(연두색)을 클릭하여주세요. 장바구니를 나가기를 원하실경우 취소버튼(빨간색)을 클릭하여주세요.`;
          const aaspeech = new window.SpeechSynthesisUtterance(aattsMessage);
          window.speechSynthesis.speak(aaspeech);
        }}>
        <Text style={styles.infoButtonText}>결제하기</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{selectedButton}</Text>
            <Text style={styles.modalText}> 얼마나 구배하시겠습니까?</Text>
            <View style={styles.counterContainer}>
              <Pressable
                style={[styles.counterButton, styles.buttonMinus]}
                onPress={() => {
                  handleModalButtonPress('Minus');
                  setCounters((prevCounters) => {
                    const newCount = Math.max((prevCounters[selectedButton] || 0) - 1, 0);
                    const newCounters = {
                      ...prevCounters,
                      [selectedButton]: newCount,
                    };
                    const ttsMessage = `${selectedButton} 수량은 현재 ${counters[newCount]}개 입니다.`;
                    const speech = new window.SpeechSynthesisUtterance(ttsMessage);
                    window.speechSynthesis.speak(speech);
                    return newCounters;
                  });
                }}
              >
                <Text style={styles.textStyle}>-</Text>
              </Pressable>
              <Text style={styles.counterText}>{counters[selectedButton] || 0}</Text>
              <Pressable
                style={[styles.counterButton, styles.buttonPlus]}
                onPress={() => {
                  handleModalButtonPress('Plus');
                  setCounters((prevCounters) => {
                    const newCount = (prevCounters[selectedButton] || 0) + 1;
                    const newCounters = {
                      ...prevCounters,
                      [selectedButton]: newCount,
                    };
                    const ttsMessage = `현재 ${selectedButton}의 수량은 ${newCount}개 입니다.`;
                    const speech = new window.SpeechSynthesisUtterance(ttsMessage);
                    window.speechSynthesis.speak(speech);
                    return newCounters;
                  });
                }}
              >
                <Text style={styles.textStyle}>+</Text>
              </Pressable>
            </View>
            <View style={styles.modalButtonContainer}>
              <Pressable
                style={[styles.buttonModal, styles.buttonClose]}
                onPress={() => {
                  handleModalButtonPress('취소');
                  setModalVisible(!modalVisible);
                  setCounters((prevCounters) => ({
                    ...prevCounters,
                    [selectedButton]: previousCount,
                  }));
                  setSelectedButton('');
                }}
              >
                <Text style={styles.textStyle}>취소</Text>
              </Pressable>
              <Pressable
                style={[styles.buttonModal, styles.buttonYes]}
                onPress={() => {
                  handleModalButtonPress('담기');
                  setModalVisible(!modalVisible);
                  setSelectedButton('');
                }}
              >
                <Text style={styles.textStyle}>담기</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={infoModalVisible}
        onRequestClose={() => {
          setInfoModalVisible(!infoModalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>장바구니</Text>
            {paymentInProgress ? (
              <Text style={styles.modalText}>결제가 진행중입니다</Text>
            ) : Object.keys(counters).length > 0 ? (
              <View style={styles.infoContentContainer}>
                {Object.keys(counters).map((key) =>
                  counters[key] > 0 ? (
                    <View key={key} style={styles.footerItem}>
                      <Text style={styles.infoText}>{key} * {counters[key]}</Text>
                    </View>
                  ) : null
                )}
              </View>
            ) : (
              <Text style={styles.infoText}>비어 있음</Text>
            )}
            <View style={styles.modalButtonContainer}>
              <Pressable
                style={[styles.buttonModal, styles.paymentcancelButton]}
                onPress={() => {
                  handleModalButtonPress('취소');
                  setInfoModalVisible(!infoModalVisible);
                }}
              >
                <Text style={styles.textStyle}>취소</Text>
              </Pressable>
              <Pressable
                style={[styles.buttonModal, styles.paymentButton]}
                onPress={() => {
                  handlePayment();
                }}
              >
                <Text style={styles.textStyle}> 결제하기</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={paymentModalVisible}
        onRequestClose={() => {
          setPaymentModalVisible(!paymentModalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>결제가 진행중입니다</Text>
            <ActivityIndicator size="large" color="#0000ff" style={styles.spinner} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  footer: {
    flexDirection: 'row',
    paddingVertical: 10,
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerText: { 
    color: 'white',
    fontSize: 16,
    marginVertical: 2,
  },
  infoText: {
    color: 'black',
    fontSize: 16,
    marginVertical: 2
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#000000',
  },
  button: {
    width: '30%',
    aspectRatio: 1,
    margin: '1.5%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  image: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  buttonModal: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    minWidth: 100,
    alignItems: 'center',
  },
  buttonClose: {
    backgroundColor: '#f44336',
  },
  buttonYes: {
    backgroundColor: '#0000FF'
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  counterButton: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    minWidth: 50,
    alignItems: 'center',
  },
  buttonMinus: {
    backgroundColor: '#f44336',
  },
  buttonPlus: {
    backgroundColor: '#4CAF50',
  },
  counterText: {
    fontSize: 20,
    marginHorizontal: 20,
  },
  infoButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#008080',
    padding: 15,
    borderRadius: 50,
    elevation: 5,
  },
  infoButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  infoContentContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingVertical: 10,
  },
  paymentButton: {
    backgroundColor: '#32CD32',
    marginTop: 20,
  },
  paymentcancelButton: {
    backgroundColor: '#f44336',
    marginTop: 20,
  },
  spinner: {
    marginTop: 20,
  },
});

export default App;
